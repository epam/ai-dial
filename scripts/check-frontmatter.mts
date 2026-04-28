#!/usr/bin/env npx tsx
/**
 * check-frontmatter.ts
 *
 * CI-ready linter that validates YAML frontmatter in every Markdown file
 * under docs/. Rules are derived from the DIAL Documentation Style Guide §7.1.
 *
 * Usage:
 *   npx tsx scripts/check-frontmatter.ts          # check all docs
 *   npx tsx scripts/check-frontmatter.ts --strict  # treat warnings as errors
 *   npx tsx scripts/check-frontmatter.ts --fix     # insert stub frontmatter into files that have none
 *
 * Exit codes:
 *   0  — all files pass
 *   1  — one or more errors found
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

// ─── Configuration ──────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DOCS_ROOT = join(__dirname, "..", "docs");

/** Required frontmatter fields and their allowed values (null = any string). */
const REQUIRED_FIELDS: Record<string, string[] | null> = {
    title: null,
    type: ["tutorial", "how-to", "reference", "explanation", "landing"],
    persona: ["app-dev", "devops", "admin", "evaluator", "architect", "end-user", "all"],
    component: ["core", "chat", "admin", "sdk", "adapters", "helm", "platform", "rag"],
};

/** Fields that should be present but are non-blocking warnings when absent. */
const RECOMMENDED_FIELDS: Record<string, string[] | null> = {
    last_verified: null,
    owner: null,
};

/** Staleness threshold in days — last_verified older than this triggers a warning. */
const STALENESS_DAYS = 180;

/** Directories or filename patterns to skip entirely. */
const IGNORE_PATTERNS = [
    "node_modules",
    ".docusaurus",
    "build",
    "releases",      // auto-generated release notes
];

// ─── Types ──────────────────────────────────────────────────────────────────

interface Issue {
    file: string;
    line: number;
    severity: "error" | "warning";
    message: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function collectMarkdownFiles(dir: string): string[] {
    const results: string[] = [];

    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);

        if (IGNORE_PATTERNS.some((p) => entry === p || entry.startsWith("."))) continue;

        const stat = statSync(full);
        if (stat.isDirectory()) {
            results.push(...collectMarkdownFiles(full));
        } else if (extname(entry) === ".md" || extname(entry) === ".mdx") {
            results.push(full);
        }
    }

    return results;
}

function isValidISODate(value: unknown): value is string {
    if (typeof value === "string") {
        return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
    }
    // gray-matter auto-parses dates into Date objects
    if (value instanceof Date) {
        return !isNaN(value.getTime());
    }
    return false;
}

function toDateString(value: unknown): string {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return String(value);
}

function daysSince(dateStr: string | Date): number {
    const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Validation ─────────────────────────────────────────────────────────────

function validate(filePath: string): Issue[] {
    const rel = relative(DOCS_ROOT, filePath);
    const raw = readFileSync(filePath, "utf-8");
    const issues: Issue[] = [];

    // --- Check for frontmatter presence ---
    if (!raw.startsWith("---")) {
        issues.push({
            file: rel,
            line: 1,
            severity: "error",
            message: "Missing frontmatter block. Every doc page requires YAML frontmatter between --- delimiters.",
        });
        return issues; // nothing else to check
    }

    let parsed: matter.GrayMatterFile<string>;
    try {
        parsed = matter(raw);
    } catch (err) {
        issues.push({
            file: rel,
            line: 1,
            severity: "error",
            message: `Frontmatter YAML parse error: ${(err as Error).message}`,
        });
        return issues;
    }

    const data = parsed.data as Record<string, unknown>;

    // --- Required fields ---
    for (const [field, allowed] of Object.entries(REQUIRED_FIELDS)) {
        const value = data[field];

        if (value === undefined || value === null || value === "") {
            issues.push({
                file: rel,
                line: 1,
                severity: "error",
                message: `Missing required field "${field}".${allowed ? ` Allowed values: ${allowed.join(", ")}` : ""}`,
            });
            continue;
        }

        if (allowed && !allowed.includes(String(value))) {
            issues.push({
                file: rel,
                line: 1,
                severity: "error",
                message: `Invalid value "${value}" for field "${field}". Allowed: ${allowed.join(", ")}`,
            });
        }
    }

    // --- Recommended fields ---
    for (const [field] of Object.entries(RECOMMENDED_FIELDS)) {
        if (data[field] === undefined || data[field] === null || data[field] === "") {
            issues.push({
                file: rel,
                line: 1,
                severity: "warning",
                message: `Missing recommended field "${field}".`,
            });
        }
    }

    // --- last_verified: format and staleness ---
    if (data.last_verified !== undefined) {
        if (!isValidISODate(data.last_verified)) {
            issues.push({
                file: rel,
                line: 1,
                severity: "error",
                message: `Field "last_verified" must be an ISO date (YYYY-MM-DD). Got: "${data.last_verified}"`,
            });
        } else {
            const age = daysSince(data.last_verified as string | Date);
            if (age > STALENESS_DAYS) {
                issues.push({
                    file: rel,
                    line: 1,
                    severity: "warning",
                    message: `Page is stale: last_verified is ${toDateString(data.last_verified)} (${age} days ago, threshold: ${STALENESS_DAYS}).`,
                });
            }
        }
    }

    // --- version_compat format ---
    if (data.version_compat !== undefined && typeof data.version_compat === "string") {
        if (!/^[><=!~^]+\d+\.\d+/.test(data.version_compat)) {
            issues.push({
                file: rel,
                line: 1,
                severity: "warning",
                message: `Field "version_compat" has unusual format: "${data.version_compat}". Expected semver range (e.g., ">=0.40").`,
            });
        }
    }

    // --- Title style checks ---
    if (typeof data.title === "string") {
        const title = data.title;

        // How-to titles should start with a verb
        if (data.type === "how-to" && /^[A-Z][a-z]+(?:\s|$)/.test(title)) {
            const firstWord = title.split(/\s/)[0];
            const commonNouns = ["The", "A", "An", "All", "My", "Our", "This", "That"];
            if (commonNouns.includes(firstWord)) {
                issues.push({
                    file: rel,
                    line: 1,
                    severity: "warning",
                    message: `How-to title should start with a verb (e.g., "Configure…", "Deploy…"). Got: "${title}"`,
                });
            }
        }

        // Titles should be sentence case, not Title Case (simple heuristic)
        const words = title.split(/\s+/).slice(1); // skip first word
        const titleCaseWords = words.filter(
            (w) => /^[A-Z][a-z]/.test(w) && !isProperNoun(w)
        );
        if (titleCaseWords.length > words.length * 0.6 && words.length >= 3) {
            issues.push({
                file: rel,
                line: 1,
                severity: "warning",
                message: `Title appears to use Title Case instead of sentence case: "${title}"`,
            });
        }
    }

    return issues;
}

/** Words that are legitimately capitalized (proper nouns, product names). */
function isProperNoun(word: string): boolean {
    const proper = new Set([
        "DIAL", "Core", "Chat", "Admin", "SDK", "API", "OpenAI", "Azure",
        "AWS", "GCP", "Bedrock", "Vertex", "Helm", "Kubernetes", "Docker",
        "Redis", "Grafana", "Prometheus", "Datadog", "CloudWatch", "Keycloak",
        "Okta", "Cognito", "Auth0", "Entra", "MCP", "Python", "Java",
        "TypeScript", "JavaScript", "OTEL", "OpenTelemetry", "InfluxDB",
        "RAG", "PII", "SSO", "JWT", "RBAC", "OIDC", "OAuth", "UI",
        "Apps", "App", "Quick", "Code", "Mind", "Map", "Studio",
        "Marketplace", "Overlay", "Interceptors", "Interceptor",
    ]);
    return proper.has(word);
}

// ─── Fix mode: insert stub frontmatter ──────────────────────────────────────

function insertStubFrontmatter(filePath: string): boolean {
    const raw = readFileSync(filePath, "utf-8");
    if (raw.startsWith("---")) return false; // already has frontmatter

    // Derive title from first H1 heading
    const h1Match = raw.match(/^#\s+(.+)$/m);
    const title = h1Match ? h1Match[1].trim() : "TODO: Add title";

    const stub = [
        "---",
        `title: "${title.replace(/"/g, '\\"')}"`,
        "type: explanation       # tutorial | how-to | reference | explanation | landing",
        "persona: app-dev        # app-dev | devops | admin | evaluator | architect | end-user | all",
        "component: platform     # core | chat | admin | sdk | adapters | helm | platform | rag",
        `last_verified: ${new Date().toISOString().slice(0, 10)}`,
        'owner: ""               # e.g., "@dial-core-team"',
        "---",
        "",
    ].join("\n");

    writeFileSync(filePath, stub + raw, "utf-8");
    return true;
}

// ─── Reporter ───────────────────────────────────────────────────────────────

function formatIssue(issue: Issue): string {
    const icon = issue.severity === "error" ? "✘" : "⚠";
    return `  ${icon} ${issue.file}:${issue.line} — ${issue.message}`;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main(): void {
    const args = process.argv.slice(2);
    const strict = args.includes("--strict");
    const fix = args.includes("--fix");

    console.log(`\n🔍  DIAL Frontmatter Checker`);
    console.log(`   docs root: ${DOCS_ROOT}`);
    console.log(`   mode: ${fix ? "fix" : strict ? "strict" : "default"}\n`);

    const files = collectMarkdownFiles(DOCS_ROOT);

    if (files.length === 0) {
        console.log("No Markdown files found.\n");
        process.exit(0);
    }

    // --- Fix mode ---
    if (fix) {
        let fixed = 0;
        for (const file of files) {
            if (insertStubFrontmatter(file)) {
                fixed++;
                console.log(`  ✎ Inserted stub frontmatter: ${relative(DOCS_ROOT, file)}`);
            }
        }
        console.log(`\n  ${fixed} file(s) updated. Review and fill in the placeholder values.\n`);
        process.exit(0);
    }

    // --- Check mode ---
    const allIssues: Issue[] = [];
    for (const file of files) {
        allIssues.push(...validate(file));
    }

    const errors = allIssues.filter((i) => i.severity === "error");
    const warnings = allIssues.filter((i) => i.severity === "warning");

    if (errors.length > 0) {
        console.log(`Errors (${errors.length}):\n`);
        errors.forEach((i) => console.log(formatIssue(i)));
        console.log();
    }

    if (warnings.length > 0) {
        console.log(`Warnings (${warnings.length}):\n`);
        warnings.forEach((i) => console.log(formatIssue(i)));
        console.log();
    }

    // --- Summary ---
    const total = files.length;
    const failing = new Set([...errors.map((i) => i.file), ...(strict ? warnings.map((i) => i.file) : [])]).size;
    const passing = total - failing;

    console.log("─".repeat(60));
    console.log(`  Files scanned: ${total}`);
    console.log(`  Passing:       ${passing}`);
    console.log(`  Failing:       ${failing} (${errors.length} errors, ${warnings.length} warnings)`);
    if (strict) console.log(`  (--strict: warnings count as failures)`);
    console.log("─".repeat(60));
    console.log();

    const exitCode = strict ? (allIssues.length > 0 ? 1 : 0) : (errors.length > 0 ? 1 : 0);
    process.exit(exitCode);
}

main();