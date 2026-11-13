#!/usr/bin/env -S npx tsx
/**
 * references-shared.ts
 *
 * Shared types and helpers for the docs_v2 library-reference checker
 * (see check-references.ts). Resolves pinned package versions against their
 * registries (PyPI, npm) and evaluates them against a freshness rule.
 *
 * Freshness rule (per reference): a pinned reference is valid when EITHER
 *   - the pinned version was released within the last THRESHOLD_DAYS, OR
 *   - the pinned version equals the registry's current latest.
 * Otherwise it is outdated (result: "fail"). Lookup failures → "error".
 */

import { readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

// ─── Configuration ──────────────────────────────────────────────────────────

/** "Younger than 6 months" threshold, in days, measured from run time. */
export const THRESHOLD_DAYS = 183;

/** Directories skipped while walking the docs tree. */
const IGNORE_PATTERNS = ["node_modules", ".docusaurus", "build"];

// ─── Types ──────────────────────────────────────────────────────────────────

export type Ecosystem = "pypi" | "npm";

export interface Reference {
    /** Package name as published on the registry (extras stripped). */
    name: string;
    /** Which registry this resolves against. */
    type: Ecosystem;
    /** Where the reference came from. */
    kind: "inline" | "github-repo";
    /** The pinned version string found in the docs / manifest. */
    referencedVersion: string;
    /** Docs page (and line) where the reference appears, e.g. "docs_v2/...md:42". */
    location: string;
    /** For github-repo references: URL of the manifest the pin was read from. */
    source?: string;
}

export interface ReferenceResult extends Reference {
    /** Current latest version on the registry (null if unresolved). */
    latestVersion: string | null;
    result: "pass" | "fail" | "error";
    reason: string;
}

/** Normalized registry data for a single package. */
export interface RegistryInfo {
    latest: string;
    /** Map of version → ISO release date (YYYY-MM-DD or full ISO). */
    releaseDates: Record<string, string>;
}

// ─── Filesystem helpers ───────────────────────────────────────────────────────

/** Recursively collect every Markdown file under `dir`. */
export function collectMarkdownFiles(dir: string): string[] {
    const results: string[] = [];

    for (const entry of readdirSync(dir)) {
        if (IGNORE_PATTERNS.includes(entry) || entry.startsWith(".")) continue;

        const full = join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) {
            results.push(...collectMarkdownFiles(full));
        } else if (extname(entry) === ".md" || extname(entry) === ".mdx") {
            results.push(full);
        }
    }

    return results;
}

// ─── Registry resolution ──────────────────────────────────────────────────────

const registryCache = new Map<string, RegistryInfo | Error>();

async function fetchJson(url: string, headers: Record<string, string> = {}): Promise<any> {
    const res = await fetch(url, { headers: { Accept: "application/json", ...headers } });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
}

/** Resolve a package's latest version + per-version release dates. Cached. */
export async function resolveRegistry(
    eco: Ecosystem,
    pkg: string,
): Promise<RegistryInfo | Error> {
    const key = `${eco}:${pkg.toLowerCase()}`;
    const cached = registryCache.get(key);
    if (cached) return cached;

    let result: RegistryInfo | Error;
    try {
        if (eco === "pypi") {
            const data = await fetchJson(
                `https://pypi.org/pypi/${encodeURIComponent(pkg)}/json`,
            );
            const releaseDates: Record<string, string> = {};
            for (const [ver, files] of Object.entries<any[]>(data.releases ?? {})) {
                const stamp = files?.[0]?.upload_time_iso_8601;
                if (stamp) releaseDates[ver] = stamp;
            }
            result = { latest: data.info?.version, releaseDates };
        } else {
            const data = await fetchJson(
                `https://registry.npmjs.org/${encodeURIComponent(pkg).replace("%40", "@")}`,
            );
            const releaseDates: Record<string, string> = {};
            for (const [ver, stamp] of Object.entries<string>(data.time ?? {})) {
                if (ver !== "created" && ver !== "modified") releaseDates[ver] = stamp;
            }
            result = { latest: data["dist-tags"]?.latest, releaseDates };
        }
    } catch (err) {
        result = err instanceof Error ? err : new Error(String(err));
    }

    registryCache.set(key, result);
    return result;
}

// ─── Evaluation ────────────────────────────────────────────────────────────────

function daysAgo(iso: string): number {
    return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

function fmtDate(iso: string): string {
    return iso.slice(0, 10);
}

const registryName: Record<Ecosystem, string> = { pypi: "PyPI", npm: "npm" };

/** Apply the freshness rule to a reference given its resolved registry data. */
export function evaluate(ref: Reference, info: RegistryInfo | Error): ReferenceResult {
    if (info instanceof Error) {
        return {
            ...ref,
            latestVersion: null,
            result: "error",
            reason: `${registryName[ref.type]} lookup failed for "${ref.name}": ${info.message}`,
        };
    }

    const { latest, releaseDates } = info;
    const pinnedDate = releaseDates[ref.referencedVersion];
    const latestDate = releaseDates[latest];

    // Pinned version not found on the registry — treat as an error, not a fail.
    if (!pinnedDate) {
        return {
            ...ref,
            latestVersion: latest ?? null,
            result: "error",
            reason: `Version "${ref.referencedVersion}" of "${ref.name}" not found on ${registryName[ref.type]} (latest is ${latest ?? "unknown"})`,
        };
    }

    const age = daysAgo(pinnedDate);

    if (age <= THRESHOLD_DAYS) {
        return {
            ...ref,
            latestVersion: latest,
            result: "pass",
            reason: `${ref.referencedVersion} released ${fmtDate(pinnedDate)} (${Math.round(age)}d ago, <6mo)`,
        };
    }

    if (ref.referencedVersion === latest) {
        return {
            ...ref,
            latestVersion: latest,
            result: "pass",
            reason: `${ref.referencedVersion} is the current latest (released ${fmtDate(pinnedDate)}, ${Math.round(age)}d ago; library not updated since)`,
        };
    }

    const latestPart = latestDate
        ? `latest ${latest} released ${fmtDate(latestDate)}`
        : `latest is ${latest}`;
    return {
        ...ref,
        latestVersion: latest,
        result: "fail",
        reason: `${ref.referencedVersion} released ${fmtDate(pinnedDate)} (${Math.round(age)}d ago, >6mo) and is not the latest; ${latestPart}`,
    };
}
