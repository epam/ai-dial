#!/usr/bin/env -S npx tsx
/**
 * Renders docs-planning/tracking.json as a Docusaurus markdown page.
 *
 * Usage:
 *   npx tsx scripts/render-progress-table.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
    type AnyDocStatus,
    type MappingType,
    type TrackingRecord,
    REPO_ROOT,
    readTrackingFile,
} from "./tracking-shared";
// @ts-expect-error - JS config module, no types
import { NEW_BASE } from "../docs.config.js";

// Route-base prefix for NEW (docs_v2) pages, matching the current build's
// DOCS_VARIANT: "v2/" when NEW is at '/v2', "" when NEW owns '/'.
const NEW_PREFIX = NEW_BASE === "/" ? "" : NEW_BASE.replace(/^\//, "") + "/";

const OUTPUT_PATH = path.join(
    REPO_ROOT,
    "docs_v2/progress.md",
);

const STATUS_DISPLAY: Record<AnyDocStatus, { emoji: string; label: string }> = {
    planned:             { emoji: "⬜", label: "Planned" },
    "in-progress":       { emoji: "🔵", label: "In progress" },
    "waiting-for-review":{ emoji: "🟡", label: "Waiting for review" },
    reviewed:            { emoji: "🟢", label: "Reviewed" },
    "waiting-for-test":  { emoji: "🟠", label: "Waiting for test" },
    tested:              { emoji: "✅", label: "Tested" },
    na:                  { emoji: "⚫", label: "N/A" },
};

const MAPPING_DISPLAY: Record<MappingType, string> = {
    new: "New",
    "1-to-1": "1-to-1",
    merged: "Merged",
    split: "Split",
    deleted: "Deleted",
};

function escapeCell(s: string): string {
    return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function stripPrefix(menuPath: string, prefix: string): string {
    if (menuPath.startsWith(prefix)) {
        return menuPath.slice(prefix.length);
    }
    return menuPath;
}

function filePathToDocId(filePath: string): string | null {
    if (!filePath) return null;
    const abs = path.join(REPO_ROOT, filePath);
    if (!fs.existsSync(abs)) return null;

    // Instance route-base prefix:
    //   docs_v2/ -> "v2/" (NEW instance, routeBasePath 'v2')
    //   docs/    -> ""    (OLD instance, routeBasePath '/')
    let prefix = "";
    let rest = filePath;
    if (rest.startsWith("docs_v2/")) { prefix = NEW_PREFIX; rest = rest.slice("docs_v2/".length); }
    else if (rest.startsWith("docs/")) { rest = rest.slice("docs/".length); }

    // Honor a frontmatter `slug:` override (e.g. the Home Overview uses `slug: /`
    // to own the instance root), so the link points at the page's real URL.
    const fm = fs.readFileSync(abs, "utf-8").match(/^---\n([\s\S]*?)\n---/);
    const slugMatch = fm && fm[1].match(/^slug:\s*["']?(.+?)["']?\s*$/m);
    if (slugMatch) {
        const slug = slugMatch[1].trim().replace(/^\//, "").replace(/\/$/, "");
        return (prefix + slug).replace(/\/$/, "");
    }

    let docPath = rest.replace(/\.mdx?$/, "");
    docPath = docPath.replace(/(^|\/)\d+\./g, "$1");
    return prefix + docPath;
}

function extractSection(menuPath: string): string {
    const parts = menuPath.split(" > ");
    if (parts.length >= 2 && parts[0] === "NEW") return parts[1];
    return "Other";
}

function groupBySection(records: TrackingRecord[]): Map<string, TrackingRecord[]> {
    const groups = new Map<string, TrackingRecord[]>();
    for (const r of records) {
        const section =
            r.mappingType === "deleted" ? "Deleted" : extractSection(r.targetPage.menuPath);
        if (!groups.has(section)) groups.set(section, []);
        groups.get(section)!.push(r);
    }
    return groups;
}

function renderStatus(status: AnyDocStatus): string {
    const d = STATUS_DISPLAY[status];
    return d ? `${d.emoji} ${d.label}` : status;
}

function renderTargetCell(r: TrackingRecord, sectionPrefix: string): string {
    const raw = stripPrefix(r.targetPage.menuPath, sectionPrefix);
    const display = escapeCell(raw || r.targetPage.filePath || "(unknown)");
    const docId = filePathToDocId(r.targetPage.filePath);
    if (docId) return `[${display}](/${docId})`;
    return display;
}

function renderSourceCell(r: TrackingRecord): string {
    if (!r.sourcePages || r.sourcePages.length === 0) return "—";
    return r.sourcePages
        .map((sp) => {
            const raw = stripPrefix(sp.menuPath, "OLD > ");
            return escapeCell(raw || sp.filePath || "(unknown)");
        })
        .join("<br>");
}

function renderSummary(records: TrackingRecord[]): string {
    const statusCounts: Record<string, number> = {};
    const mappingCounts: Record<string, number> = {};
    for (const r of records) {
        statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
        mappingCounts[r.mappingType] = (mappingCounts[r.mappingType] || 0) + 1;
    }

    const total = records.length;
    const naCount = statusCounts["na"] || 0;
    const doneCount = (statusCounts["reviewed"] || 0) + (statusCounts["tested"] || 0);
    const trackable = total - naCount;
    const pct = trackable > 0 ? Math.round((doneCount / trackable) * 100) : 0;
    const barLen = 20;
    const filled = Math.round((pct / 100) * barLen);
    const bar = "█".repeat(filled) + "░".repeat(barLen - filled);

    const statusOrder: AnyDocStatus[] = [
        "planned", "in-progress", "waiting-for-review", "reviewed",
        "waiting-for-test", "tested", "na",
    ];

    const headerCells = statusOrder.map(
        (s) => ` ${STATUS_DISPLAY[s].emoji} ${STATUS_DISPLAY[s].label} `,
    );
    const valueCells = statusOrder.map(
        (s) => ` ${statusCounts[s] || 0} `,
    );

    const mappingParts = Object.entries(mappingCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${v} ${MAPPING_DISPLAY[k as MappingType] || k}`);

    const lines: string[] = [
        `## Summary`,
        ``,
        `|${headerCells.join("|")}|`,
        `|${headerCells.map(() => "---").join("|")}|`,
        `|${valueCells.join("|")}|`,
        ``,
        `**Progress: ${doneCount} / ${trackable} done** \`${bar}\` ${pct}%`,
        ``,
        `Mapping types: ${mappingParts.join(", ")}`,
    ];
    return lines.join("\n");
}

function renderSectionTable(
    section: string,
    records: TrackingRecord[],
): string {
    const sectionPrefix = `NEW > ${section} > `;
    const lines: string[] = [
        `## ${section} (${records.length})`,
        ``,
        `| Target Page | Source | Type | Mapping | Status |`,
        `|---|---|---|---|---|`,
    ];

    for (const r of records) {
        const target = renderTargetCell(r, sectionPrefix);
        const source = renderSourceCell(r);
        const pageType = r.targetPage.pageType;
        const mapping = MAPPING_DISPLAY[r.mappingType] || r.mappingType;
        const status = renderStatus(r.status);
        lines.push(`| ${target} | ${source} | ${pageType} | ${mapping} | ${status} |`);
    }

    return lines.join("\n");
}

function renderPage(records: TrackingRecord[]): string {
    const today = new Date().toISOString().slice(0, 10);

    const frontmatter = [
        `---`,
        `title: "Documentation progress"`,
        `type: reference`,
        `persona: all`,
        `component: platform`,
        `last_verified: ${today}`,
        `owner: "@dial-docs-team"`,
        `---`,
    ].join("\n");

    const intro = [
        `# Documentation progress`,
        ``,
        `This page is auto-generated from [\`tracking.json\`](https://github.com/epam/ai-dial/blob/main/docs-planning/tracking.json). Do not edit manually — run \`npm run tracking:progress\` to regenerate.`,
    ].join("\n");

    const summary = renderSummary(records);
    const groups = groupBySection(records);

    const sectionBlocks: string[] = [];
    for (const [section, recs] of groups) {
        sectionBlocks.push(renderSectionTable(section, recs));
    }

    const footer = `> Last generated: ${today}. Source: [\`tracking.json\`](https://github.com/epam/ai-dial/blob/main/docs-planning/tracking.json).`;

    return [
        frontmatter,
        "",
        intro,
        "",
        summary,
        "",
        "---",
        "",
        ...sectionBlocks.map((b) => b + "\n"),
        "---",
        "",
        footer,
        "",
    ].join("\n");
}

function main() {
    const file = readTrackingFile();
    const outputRelative = path.relative(REPO_ROOT, OUTPUT_PATH);
    const records = file.records.filter(r => r.targetPage.filePath !== outputRelative);
    const content = renderPage(records);

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, content, "utf-8");
    console.log(`✔ Wrote ${OUTPUT_PATH} (${records.length} records).`);
}

main();
