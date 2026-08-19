#!/usr/bin/env -S npx tsx
/**
 * render-outdated-references.ts
 *
 * Renders the machine-readable outdated_references.json (produced by
 * check-references.ts) into a human-readable Markdown report,
 * outdated_references.md, at the repo root. Rendering only — no checking,
 * no network access.
 *
 * Usage:
 *   npx tsx scripts/render-outdated-references.ts
 *
 * Exit codes:
 *   0  — report written
 *   1  — outdated_references.json missing (run `npm run check:references` first)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { ReferenceResult } from "./references-shared.ts";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INPUT = join(REPO_ROOT, "outdated_references.json");
const OUTPUT = join(REPO_ROOT, "outdated_references.md");

interface Report {
    generatedAt: string;
    thresholdDays: number;
    warnings: string[];
    summary: {
        total: number;
        pass: number;
        fail: number;
        error: number;
        byEcosystem: { pypi: number; npm: number };
    };
    references: ReferenceResult[];
}

/** Make a string safe to drop into a Markdown table cell. */
function cell(value: string): string {
    return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}

const STATUS_LABEL: Record<ReferenceResult["result"], string> = {
    fail: "✗ fail",
    error: "⚠ error",
    pass: "✓ pass",
};

function pkgCell(ref: ReferenceResult): string {
    return ref.source ? `[\`${ref.name}\`](${ref.source})` : `\`${ref.name}\``;
}

function renderGroup(title: string, rows: ReferenceResult[]): string {
    if (rows.length === 0) return "";

    const sorted = [...rows].sort(
        (a, b) => a.location.localeCompare(b.location) || a.name.localeCompare(b.name),
    );

    const lines = [
        `### ${title} (${rows.length})`,
        "",
        "| Status | Package | Type | Kind | Referenced | Latest | Location | Reason |",
        "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ];

    for (const r of sorted) {
        lines.push(
            "| " +
                [
                    STATUS_LABEL[r.result],
                    pkgCell(r),
                    r.type,
                    r.kind,
                    `\`${cell(r.referencedVersion)}\``,
                    r.latestVersion ? `\`${cell(r.latestVersion)}\`` : "—",
                    `\`${cell(r.location)}\``,
                    cell(r.reason),
                ].join(" | ") +
                " |",
        );
    }

    lines.push("");
    return lines.join("\n");
}

function main() {
    if (!existsSync(INPUT)) {
        console.error(
            `outdated_references.json not found at ${INPUT}\n` +
                "Run `npm run check:references` first to generate it.",
        );
        process.exit(1);
    }

    const report: Report = JSON.parse(readFileSync(INPUT, "utf8"));
    const { summary, references } = report;
    const generatedOn = report.generatedAt.slice(0, 10);

    const out: string[] = [];

    out.push("# Outdated library references");
    out.push("");
    out.push(
        `_Auto-generated from \`outdated_references.json\` on ${generatedOn} — do not edit by hand._`,
    );
    out.push("");
    out.push(
        `A reference **passes** when its pinned version was released within the last ` +
            `${report.thresholdDays} days (≈6 months) **or** is the registry's current latest; ` +
            `otherwise it **fails**. Lookups that could not be resolved are reported as **errors**.`,
    );
    out.push("");

    if (report.warnings.length > 0) {
        out.push("## Warnings");
        out.push("");
        for (const w of report.warnings) out.push(`> ⚠️ ${cell(w)}`);
        out.push("");
    }

    out.push("## Summary");
    out.push("");
    out.push("| Total | ✓ Pass | ✗ Fail | ⚠ Error | PyPI | npm |");
    out.push("| --- | --- | --- | --- | --- | --- |");
    out.push(
        `| ${summary.total} | ${summary.pass} | ${summary.fail} | ${summary.error} | ` +
            `${summary.byEcosystem.pypi} | ${summary.byEcosystem.npm} |`,
    );
    out.push("");

    out.push("## References");
    out.push("");

    const groups: [string, ReferenceResult["result"]][] = [
        ["Failing", "fail"],
        ["Errors", "error"],
        ["Passing", "pass"],
    ];
    const rendered = groups
        .map(([title, key]) =>
            renderGroup(
                title,
                references.filter((r) => r.result === key),
            ),
        )
        .filter(Boolean);

    out.push(rendered.length > 0 ? rendered.join("\n") : "_No references found._\n");

    writeFileSync(OUTPUT, out.join("\n").replace(/\n+$/, "") + "\n");

    console.log(
        `Wrote ${OUTPUT}\n` +
            `  fail=${summary.fail}  error=${summary.error}  pass=${summary.pass}  (total ${summary.total})`,
    );
}

main();
