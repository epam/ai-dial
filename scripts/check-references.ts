#!/usr/bin/env -S npx tsx
/**
 * check-references.ts
 *
 * Scans docs_v2/ for pinned library references (Python/PyPI and npm) in inline
 * sample code, and crawls referenced GitHub sample repos for their dependency
 * manifests. Each pinned reference is validated against a freshness rule
 * (see references-shared.ts) and the results are written to
 * outdated_references.json at the repo root.
 *
 * Usage:
 *   npx tsx scripts/check-references.ts            # write report, exit 0
 *   npx tsx scripts/check-references.ts --strict   # exit 1 if any reference fails
 *
 * Env:
 *   GITHUB_TOKEN — optional; raises GitHub API rate limits while crawling repos.
 *
 * Exit codes:
 *   0  — report written (default; lookup errors are recorded, not fatal)
 *   1  — only with --strict, when one or more references are outdated
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import {
    collectMarkdownFiles,
    resolveRegistry,
    evaluate,
    THRESHOLD_DAYS,
    type Reference,
    type ReferenceResult,
    type Ecosystem,
} from "./references-shared.ts";

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = join(dirname(__filename), "..");
const DOCS_V2 = join(REPO_ROOT, "docs_v2");
const OUTPUT = join(REPO_ROOT, "outdated_references.json");

const STRICT = process.argv.includes("--strict");

// ─── Regexes ───────────────────────────────────────────────────────────────────

/** A Python pin in inline docs: name, optional [extras], ==version (tight, no
 *  spaces — so it never matches Python equality comparisons like `a == 1`). */
const PY_PIN = /([A-Za-z0-9_.-]+)(\[[^\]]+\])?==([0-9][\w.\-]*)/g;
/** A Python pin in a manifest: also matches PEP 621 form `name (==1.2.3)` and
 *  spaced `name == 1.2.3`. Used only on declarative dependency files. */
const PY_MANIFEST_PIN = /([A-Za-z0-9_.-]+)(?:\[[^\]]+\])?\s*\(?\s*==\s*([0-9][\w.\-]*)/g;
/** An npm pin: (optional @scope/)name@version. Global. */
const NPM_PIN = /(@?[A-Za-z0-9][\w.\/-]*)@(\d[\w.\-]*)/g;
/** Lines that establish an npm/yarn install context (so @ is a version pin). */
const NPM_CONTEXT = /\b(npm\s+(?:i|install|add)|yarn\s+add|--save(?:-dev)?)\b/;

// ─── Inline extraction ──────────────────────────────────────────────────────────

function extractInline(): Reference[] {
    const refs: Reference[] = [];
    const files = collectMarkdownFiles(DOCS_V2);

    for (const file of files) {
        const rel = relative(REPO_ROOT, file);
        const lines = readFileSync(file, "utf8").split("\n");

        lines.forEach((line, i) => {
            const loc = `${rel}:${i + 1}`;

            // Python: any ==pin on the line (requirements blocks, pip install).
            for (const m of line.matchAll(PY_PIN)) {
                refs.push({
                    name: m[1],
                    type: "pypi",
                    kind: "inline",
                    referencedVersion: m[3],
                    location: loc,
                });
            }

            // npm: only on install-context lines, to avoid false positives.
            if (NPM_CONTEXT.test(line)) {
                for (const m of line.matchAll(NPM_PIN)) {
                    refs.push({
                        name: m[1],
                        type: "npm",
                        kind: "inline",
                        referencedVersion: m[2],
                        location: loc,
                    });
                }
            }
        });
    }

    return refs;
}

// ─── GitHub sample-repo crawling ─────────────────────────────────────────────────

interface RepoRef {
    repo: string; // "ai-dial-sdk", "ai-dial", ...
    ref: string; // branch/tag, e.g. "main", "development"
    dir: string; // directory within the repo ("" = root)
    docLocation: string; // docs page that linked it
}

const GH_URL =
    /https:\/\/github\.com\/epam\/([\w.-]+)\/(?:blob|tree)\/([\w.\/-]+?)\/([^\s)\](<>"'#]+)/g;

/** Heuristic: does this GitHub path point at runnable sample code? */
function isSampleCode(repo: string, path: string): boolean {
    if (repo === "ai-dial-sdk") return true;
    return /(^|\/)(examples?|dial-cookbook|dial-samples)(\/|$)/.test(path);
}

function extractRepoRefs(): RepoRef[] {
    const seen = new Set<string>();
    const out: RepoRef[] = [];

    for (const file of collectMarkdownFiles(DOCS_V2)) {
        const rel = relative(REPO_ROOT, file);
        const text = readFileSync(file, "utf8");

        for (const m of text.matchAll(GH_URL)) {
            const [, repo, ref, path] = m;
            if (!isSampleCode(repo, path)) continue;

            // A linked file → use its directory; a linked dir → use the path itself.
            const looksLikeFile = /\.[a-z0-9]+$/i.test(basename(path));
            const dir = looksLikeFile ? dirname(path) : path;
            const normDir = dir === "." ? "" : dir;

            const key = `${repo}@${ref}:${normDir}`;
            if (seen.has(key)) continue;
            seen.add(key);
            out.push({ repo, ref, dir: normDir, docLocation: rel });
        }
    }

    return out;
}

const MANIFESTS = ["requirements.txt", "pyproject.toml", "setup.py", "package.json"];

function ghHeaders(): Record<string, string> {
    const h: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    return h;
}

/** List manifest files present in a repo directory via the contents API. */
async function listManifests(
    repo: string,
    ref: string,
    dir: string,
): Promise<{ name: string; download_url: string; htmlPath: string }[]> {
    const url = `https://api.github.com/repos/epam/${repo}/contents/${dir}?ref=${encodeURIComponent(ref)}`;
    const res = await fetch(url, { headers: ghHeaders() });
    if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") {
        throw new Error("RATE_LIMIT");
    }
    if (!res.ok) throw new Error(`contents ${dir || "/"}: ${res.status}`);
    const entries = (await res.json()) as any[];
    if (!Array.isArray(entries)) return [];
    return entries
        .filter((e) => e.type === "file" && MANIFESTS.includes(e.name))
        .map((e) => ({
            name: e.name,
            download_url: e.download_url,
            htmlPath: `https://github.com/epam/${repo}/blob/${ref}/${e.path}`,
        }));
}

function parseManifest(name: string, body: string): { name: string; type: Ecosystem; version: string }[] {
    const found: { name: string; type: Ecosystem; version: string }[] = [];

    if (name === "package.json") {
        try {
            const pkg = JSON.parse(body);
            for (const field of ["dependencies", "devDependencies"]) {
                for (const [dep, ver] of Object.entries<string>(pkg[field] ?? {})) {
                    // Only exact pins (skip ^, ~, ranges, tags, urls).
                    if (/^\d[\w.\-]*$/.test(ver)) {
                        found.push({ name: dep, type: "npm", version: ver });
                    }
                }
            }
        } catch {
            /* malformed JSON — ignore */
        }
        return found;
    }

    // requirements.txt / pyproject.toml / setup.py — extract == pins (lenient).
    for (const m of body.matchAll(PY_MANIFEST_PIN)) {
        found.push({ name: m[1], type: "pypi", version: m[2] });
    }
    return found;
}

async function extractGithubRepoRefs(): Promise<{ refs: Reference[]; warnings: string[] }> {
    const repoRefs = extractRepoRefs();
    const refs: Reference[] = [];
    const warnings: string[] = [];
    const fetchedManifests = new Set<string>(); // dedupe manifest URLs

    for (const r of repoRefs) {
        // Check the referenced directory and the repo root.
        const dirs = r.dir ? [r.dir, ""] : [""];
        for (const dir of dirs) {
            let manifests;
            try {
                manifests = await listManifests(r.repo, r.ref, dir);
            } catch (err) {
                if (err instanceof Error && err.message === "RATE_LIMIT") {
                    warnings.push(
                        "GitHub API rate limit reached — sample-repo crawl is incomplete. " +
                            "Set GITHUB_TOKEN to raise the 60 req/hr unauthenticated limit.",
                    );
                    return { refs, warnings }; // no point continuing once limited
                }
                continue; // dir missing / not a directory — skip quietly
            }

            for (const man of manifests) {
                if (fetchedManifests.has(man.htmlPath)) continue;
                fetchedManifests.add(man.htmlPath);

                let body: string;
                try {
                    const res = await fetch(man.download_url, { headers: ghHeaders() });
                    if (!res.ok) continue;
                    body = await res.text();
                } catch {
                    continue;
                }

                for (const pin of parseManifest(man.name, body)) {
                    refs.push({
                        name: pin.name,
                        type: pin.type,
                        kind: "github-repo",
                        referencedVersion: pin.version,
                        location: r.docLocation,
                        source: man.htmlPath,
                    });
                }
            }
        }
    }

    return { refs, warnings };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log("Scanning docs_v2 for inline references…");
    const inline = extractInline();
    console.log(`  found ${inline.length} inline pin(s)`);

    console.log("Crawling referenced GitHub sample repos…");
    const { refs: repo, warnings } = await extractGithubRepoRefs();
    console.log(`  found ${repo.length} manifest pin(s)`);
    for (const w of warnings) console.warn(`  ! ${w}`);

    const all = [...inline, ...repo];

    console.log(`Resolving ${all.length} reference(s) against registries…`);
    const results: ReferenceResult[] = [];
    for (const ref of all) {
        const info = await resolveRegistry(ref.type, ref.name);
        results.push(evaluate(ref, info));
    }

    const summary = {
        total: results.length,
        pass: results.filter((r) => r.result === "pass").length,
        fail: results.filter((r) => r.result === "fail").length,
        error: results.filter((r) => r.result === "error").length,
        byEcosystem: {
            pypi: results.filter((r) => r.type === "pypi").length,
            npm: results.filter((r) => r.type === "npm").length,
        },
    };

    const report = {
        generatedAt: new Date().toISOString(),
        thresholdDays: THRESHOLD_DAYS,
        warnings,
        summary,
        references: results.sort(
            (a, b) =>
                a.location.localeCompare(b.location) || a.name.localeCompare(b.name),
        ),
    };

    writeFileSync(OUTPUT, JSON.stringify(report, null, 2) + "\n");

    console.log(
        `\nWrote ${relative(REPO_ROOT, OUTPUT)}\n` +
            `  pass=${summary.pass}  fail=${summary.fail}  error=${summary.error}  ` +
            `(pypi=${summary.byEcosystem.pypi}, npm=${summary.byEcosystem.npm})`,
    );

    if (summary.fail > 0) {
        console.log("\nOutdated references:");
        for (const r of results.filter((x) => x.result === "fail")) {
            console.log(`  ✗ ${r.name}==${r.referencedVersion} @ ${r.location} — ${r.reason}`);
        }
    }

    if (STRICT && summary.fail > 0) process.exit(1);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
