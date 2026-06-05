#!/usr/bin/env -S npx tsx
/**
 * build-changelog.ts
 *
 * Idempotent, hermetic generator for the on-site Changelog (Reference > Changelog).
 *
 * Source of truth: docs/releases/<version>/ — the curated, platform-level (Helm
 * stable-assembly) release notes authored each biweekly release. These are EXCLUDED
 * from the Docusaurus build (docusaurus.config.js `exclude: ['releases/**']`) because
 * they use repo-relative image/link paths, contain draft + JSON side files, and carry
 * at least one broken intra-doc anchor in the source. This script reads them, normalizes
 * them, and emits clean pages into docs_v2/reference/changelog/ that pass the
 * strict link/anchor/image checks (onBrokenLinks/Anchors/Images: 'throw').
 *
 * No network access. Reads repo files only. Output dir is wiped and rebuilt each run,
 * so re-running produces byte-identical output (idempotent).
 *
 * Usage:
 *   npx tsx scripts/build-changelog.ts
 *   npx tsx scripts/build-changelog.ts --dry-run   # report only, don't write
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ---------- Config ----------

const REPO_ROOT = path.join(__dirname, "..");
const RELEASES_DIR = path.join(REPO_ROOT, "docs", "releases");
const OUT_DIR = path.join(REPO_ROOT, "docs_v2", "reference", "changelog");
const IMG_OUT = path.join(OUT_DIR, "img");
const dryRun = process.argv.includes("--dry-run");

const RELEASE_NOTES_RE = /^(\d+)\.(\d+)-release-notes\.md$/;
const UPGRADE_RE = /^upgrade-to-(\d+)\.(\d+)\.md$/;

const GENERATED_BY = "scripts/build-changelog.ts";

// ---------- Helpers ----------

/** GitHub-style heading slug (close enough to detect broken anchors safely). */
function slugify(text: string): string {
    return text
        .trim()
        .toLowerCase()
        .replace(/`/g, "")
        .replace(/[^a-z0-9 \-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

function yamlEscape(s: string): string {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Collect the set of heading slugs present in a markdown body. */
function headingSlugs(body: string): Set<string> {
    const set = new Set<string>();
    for (const line of body.split(/\r?\n/)) {
        const m = line.match(/^#{1,6}\s+(.+?)\s*$/);
        if (m) set.add(slugify(m[1]));
    }
    return set;
}

/** Strip the first top-level (`# `) heading; its text is replaced by the frontmatter title. */
function stripLeadingH1(body: string): string {
    const lines = body.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        if (/^#\s+/.test(lines[i])) {
            lines.splice(i, 1);
            // also drop an immediately-following blank line for tidiness
            if (lines[i] !== undefined && lines[i].trim() === "") lines.splice(i, 1);
            break;
        }
    }
    return lines.join("\n");
}

interface AssetCopy {
    from: string;
    to: string;
}

/**
 * Rewrite relative asset references (markdown images, raw <img> tags, and non-md
 * relative links such as the 1.39 JSON side files) so they point at co-located,
 * copied assets. Returns the rewritten body plus the list of files to copy.
 * .md links and http(s)/anchor links are left untouched.
 */
function rewriteAssets(body: string, srcDir: string): { body: string; assets: AssetCopy[] } {
    const assets: AssetCopy[] = [];

    const resolveAndQueue = (ref: string, intoImg: boolean): string | null => {
        if (/^(https?:)?\/\//.test(ref) || ref.startsWith("#") || ref.startsWith("mailto:")) {
            return null; // external / anchor — leave as-is
        }
        // Every reference in the source files is relative (./ or ../). Anything else is
        // already-normalized output from an earlier pass — skip it (avoids double-processing).
        if (!ref.startsWith("./") && !ref.startsWith("../")) return null;
        const abs = path.resolve(srcDir, ref);
        if (!fs.existsSync(abs)) {
            console.warn(`  ⚠ missing asset referenced in ${path.relative(REPO_ROOT, srcDir)}: ${ref}`);
            return null;
        }
        const base = path.basename(abs);
        const to = intoImg ? path.join(IMG_OUT, base) : path.join(OUT_DIR, base);
        assets.push({ from: abs, to });
        return intoImg ? `img/${base}` : base;
    };

    let out = body;

    // 1. Raw <img src="..." ...> -> markdown image (the proven convention in NEW pages).
    out = out.replace(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g, (full, src: string) => {
        const altMatch = full.match(/\balt="([^"]*)"/);
        const alt = altMatch ? altMatch[1] : "";
        const rewritten = resolveAndQueue(src, true);
        return rewritten ? `![${alt}](${rewritten})` : full;
    });

    // 2. Markdown images ![alt](path)
    out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (full, alt: string, src: string) => {
        const rewritten = resolveAndQueue(src, true);
        return rewritten ? `![${alt}](${rewritten})` : full;
    });

    // 3. Non-md relative file links: [text](./foo.json) etc. (skip .md, http, #).
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (full, text: string, href: string) => {
        if (/^(https?:)?\/\//.test(href) || href.startsWith("#") || href.startsWith("mailto:")) return full;
        if (/\.mdx?(#.*)?$/.test(href)) return full; // .md cross-links handled separately
        if (!/\.[a-z0-9]+(#.*)?$/i.test(href)) return full; // not a file with an extension
        const rewritten = resolveAndQueue(href.replace(/#.*$/, ""), false);
        return rewritten ? `[${text}](${rewritten})` : full;
    });

    return { body: out, assets };
}

/**
 * Make imported Markdown safe for Docusaurus's MDX compiler. Docusaurus parses `.md` as MDX,
 * so bare `<placeholder>` / `{expr}` in prose are read as JSX and fail compilation. Escape
 * `<`, `{`, `}` everywhere EXCEPT inside fenced code blocks and inline code spans, where they
 * are already rendered verbatim and must be left untouched.
 */
function escapeProse(s: string): string {
    return s.replace(/</g, "&lt;").replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
}

function mdxSafe(body: string): string {
    const lines = body.split(/\r?\n/);
    let inFence = false; // fenced code block state
    return lines
        .map((line) => {
            if (/^\s*(```|~~~)/.test(line)) {
                inFence = !inFence;
                return line;
            }
            if (inFence) return line;
            // Escape prose, but preserve inline code spans (`...`).
            return line
                .split(/(`+[^`]*`+)/g)
                .map((part) => (part.startsWith("`") ? part : escapeProse(part)))
                .join("");
        })
        .join("\n");
}

/** Demote any intra-doc anchor link whose target heading does not exist (keeps build green). */
function sanitizeAnchors(body: string): string {
    const slugs = headingSlugs(body);
    return body.replace(/\[([^\]]+)\]\(#([^)]+)\)/g, (full, label: string, anchor: string) => {
        if (slugs.has(anchor)) return full;
        console.warn(`  ⚠ demoting broken anchor #${anchor} -> plain text "${label}"`);
        return label;
    });
}

/** First paragraph after "## Brief Summary", flattened to a single line. */
function extractSummary(body: string): string {
    const m = body.match(/##\s+Brief Summary\s*\n+([\s\S]*?)(?:\n\s*\n|\n#)/);
    if (!m) return "";
    return m[1]
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_`]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

/** Truncate at a word boundary for use as a frontmatter description. */
function truncate(s: string, max: number): string {
    if (s.length <= max) return s;
    const cut = s.slice(0, max);
    return cut.slice(0, cut.lastIndexOf(" ")).trimEnd() + "…";
}

function frontmatter(fields: Record<string, string | number>, sourceRel: string): string {
    const lines = ["---", `# Generated by ${GENERATED_BY} from ${sourceRel} — do not hand-edit.`];
    for (const [k, v] of Object.entries(fields)) {
        lines.push(typeof v === "number" ? `${k}: ${v}` : `${k}: "${yamlEscape(v)}"`);
    }
    lines.push("---", "");
    return lines.join("\n");
}

// ---------- Main ----------

interface ReleaseFile {
    version: string;   // "1.43"
    vnum: number;      // 1043
    kind: "notes" | "upgrade";
    srcPath: string;
}

function discoverReleases(): ReleaseFile[] {
    if (!fs.existsSync(RELEASES_DIR)) return [];
    const files: ReleaseFile[] = [];
    for (const dir of fs.readdirSync(RELEASES_DIR)) {
        const full = path.join(RELEASES_DIR, dir);
        if (!fs.statSync(full).isDirectory()) continue;
        for (const entry of fs.readdirSync(full)) {
            let m = entry.match(RELEASE_NOTES_RE);
            if (m) {
                files.push(mk(m, "notes", path.join(full, entry)));
                continue;
            }
            m = entry.match(UPGRADE_RE);
            if (m) files.push(mk(m, "upgrade", path.join(full, entry)));
            // everything else (drafts, *.json) is intentionally skipped
        }
    }
    return files;

    function mk(m: RegExpMatchArray, kind: "notes" | "upgrade", srcPath: string): ReleaseFile {
        const major = Number(m[1]);
        const minor = Number(m[2]);
        return { version: `${major}.${minor}`, vnum: major * 1000 + minor, kind, srcPath };
    }
}

function processFile(rf: ReleaseFile): { outName: string; content: string; assets: AssetCopy[] } {
    const sourceRel = path.relative(REPO_ROOT, rf.srcPath);
    const raw = fs.readFileSync(rf.srcPath, "utf-8");

    let body = stripLeadingH1(raw);
    const { body: withAssets, assets } = rewriteAssets(body, path.dirname(rf.srcPath));
    body = mdxSafe(sanitizeAnchors(withAssets));

    // sidebar_position: newest first, release-notes immediately above its upgrade guide.
    const basePos = -(rf.vnum * 2);

    let fm: string;
    let outName: string;
    if (rf.kind === "notes") {
        const description = truncate(extractSummary(raw), 250);
        fm = frontmatter(
            {
                title: `DIAL ${rf.version} release notes`,
                sidebar_label: `${rf.version} release notes`,
                sidebar_position: basePos,
                type: "reference",
                persona: "all",
                component: "platform",
                ...(description ? { description } : {}),
            },
            sourceRel,
        );
        outName = `release-notes-${rf.version}.md`;
    } else {
        fm = frontmatter(
            {
                title: `Upgrade to DIAL ${rf.version}`,
                sidebar_label: `${rf.version} upgrade guide`,
                sidebar_position: basePos + 1,
                type: "reference",
                persona: "devops",
                component: "helm",
                description: `Helm chart and component versions, configuration changes, and deprecations for DIAL ${rf.version}.`,
            },
            sourceRel,
        );
        outName = `upgrade-to-${rf.version}.md`;
    }

    return { outName, content: fm + body.replace(/^\n+/, "") + "\n", assets };
}

/** Build the changelog overview (category index): newest release first, with links. */
function buildIndex(releases: ReleaseFile[]): string {
    const versions = [...new Set(releases.map((r) => r.version))].sort(
        (a, b) => versionNum(b) - versionNum(a),
    );

    const sections: string[] = [];
    for (const version of versions) {
        const notes = releases.find((r) => r.version === version && r.kind === "notes");
        const upgrade = releases.find((r) => r.version === version && r.kind === "upgrade");
        const summary = notes ? extractSummary(fs.readFileSync(notes.srcPath, "utf-8")) : "";

        const links: string[] = [];
        if (notes) links.push(`[Release notes](release-notes-${version}.md)`);
        if (upgrade) links.push(`[Upgrade guide](upgrade-to-${version}.md)`);

        sections.push(
            `## DIAL ${version}\n\n${summary ? escapeProse(summary) + "\n\n" : ""}${links.join(" · ")}`,
        );
    }

    const fm = frontmatter(
        {
            title: "Changelog",
            sidebar_label: "Overview",
            sidebar_position: -100000,
            type: "reference",
            persona: "all",
            component: "platform",
            description: "Release notes and upgrade guides for each DIAL platform release, newest first.",
        },
        "docs/releases/",
    );

    const intro =
        "Release notes and upgrade guides for each DIAL platform (Helm stable-assembly) release, " +
        "newest first. Each release links to its highlights and to the technical upgrade guide " +
        "(component versions, configuration changes, and deprecations).";

    return `${fm}# Changelog\n\n${intro}\n\n${sections.join("\n\n")}\n`;
}

function versionNum(v: string): number {
    const [major, minor] = v.split(".").map(Number);
    return major * 1000 + minor;
}

function main(): void {
    console.log("📝 Building Changelog from docs/releases/ ...\n");

    const releases = discoverReleases();
    if (releases.length === 0) {
        console.warn("  No release files found — nothing to generate.");
    }

    const writes: { path: string; content: string }[] = [];
    const assetCopies = new Map<string, string>(); // to -> from (dedup by destination)

    if (releases.length > 0) {
        writes.push({ path: path.join(OUT_DIR, "index.md"), content: buildIndex(releases) });
    }

    for (const rf of releases) {
        const { outName, content, assets } = processFile(rf);
        writes.push({ path: path.join(OUT_DIR, outName), content });
        for (const a of assets) assetCopies.set(a.to, a.from);
    }

    const byVer = [...new Set(releases.map((r) => r.version))].sort();
    console.log(`  Releases: ${byVer.join(", ")}`);
    console.log(`  Pages: ${writes.length}   Assets: ${assetCopies.size}`);

    if (dryRun) {
        console.log("\n  --dry-run: no changes written.");
        return;
    }

    // Wipe + rebuild output dir for deterministic, idempotent output.
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
    fs.mkdirSync(IMG_OUT, { recursive: true });

    for (const [to, from] of assetCopies) {
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(from, to);
    }
    for (const w of writes) {
        fs.writeFileSync(w.path, w.content, "utf-8");
    }

    console.log(`\n✔ Wrote ${writes.length} page(s) + ${assetCopies.size} asset(s) to ${path.relative(REPO_ROOT, OUT_DIR)}`);
}

main();
