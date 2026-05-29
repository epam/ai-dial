import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// ---------- Types ----------

export type PageType =
    | "tutorial"
    | "how-to"
    | "reference"
    | "explanation"
    | "unknown";

export type CommonDocStatus = "planned" | "in-progress" | "na";
export type TutorialDocStatus =
    | CommonDocStatus
    | "waiting-for-test"
    | "tested";
export type RegularDocStatus =
    | CommonDocStatus
    | "waiting-for-review"
    | "reviewed";
export type AnyDocStatus = TutorialDocStatus | RegularDocStatus;

export type MappingType =
    | "merged"
    | "split"
    | "new"
    | "1-to-1"
    | "deleted";

export interface PageInfo {
    pageType: PageType;
    menuPath: string;
    filePath: string;
}

export interface TrackingRecord {
    targetPage: PageInfo;
    sourcePages: PageInfo[];
    status: AnyDocStatus;
    mappingType: MappingType;
    notes: string;
}

export interface TrackingFile {
    $schema?: string;
    records: TrackingRecord[];
}

// ---------- Constants ----------

const PAGE_TYPES: PageType[] = [
    "tutorial",
    "how-to",
    "reference",
    "explanation",
    "unknown",
];

const TUTORIAL_STATUSES: TutorialDocStatus[] = [
    "planned",
    "in-progress",
    "na",
    "waiting-for-test",
    "tested",
];

const REGULAR_STATUSES: RegularDocStatus[] = [
    "planned",
    "in-progress",
    "na",
    "waiting-for-review",
    "reviewed",
];

const MAPPING_TYPES: MappingType[] = [
    "merged",
    "split",
    "new",
    "1-to-1",
    "deleted",
];

function findRepoRoot(): string {
    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    let dir = scriptDir;
    while (dir !== path.dirname(dir)) {
        if (fs.existsSync(path.join(dir, "package.json"))) return dir;
        dir = path.dirname(dir);
    }
    throw new Error(
        `Could not find repo root (no package.json above ${scriptDir}).`,
    );
}

export const REPO_ROOT = findRepoRoot();
export const TRACKING_PATH = path.join(
    REPO_ROOT,
    "docs-planning",
    "tracking.json",
);
export const STRUCTURE_PATH = path.join(
    REPO_ROOT,
    "docs-planning",
    "recommended-site-structure.md",
);

// ---------- IO helpers ----------

export function readTrackingFile(): TrackingFile {
    if (!fs.existsSync(TRACKING_PATH)) return { records: [] };
    const raw = fs.readFileSync(TRACKING_PATH, "utf-8").trim();
    if (raw === "") return { records: [] };

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        throw new Error(
            `Failed to parse ${TRACKING_PATH}: ${(e as Error).message}`,
        );
    }

    if (!parsed || typeof parsed !== "object") {
        throw new Error(`${TRACKING_PATH} root must be an object.`);
    }

    const obj = parsed as Record<string, unknown>;

    // Support legacy flat-array format for migration
    if (Array.isArray(parsed)) {
        return { records: parsed as TrackingRecord[] };
    }

    if (!Array.isArray(obj.records)) {
        throw new Error(
            `${TRACKING_PATH} must have a "records" array.`,
        );
    }

    return parsed as TrackingFile;
}

export function writeTrackingFile(file: TrackingFile): void {
    fs.mkdirSync(path.dirname(TRACKING_PATH), { recursive: true });
    const output: TrackingFile = {
        $schema: "./tracking.schema.json",
        records: file.records,
    };
    fs.writeFileSync(
        TRACKING_PATH,
        JSON.stringify(output, null, 2) + "\n",
        "utf-8",
    );
}

// ---------- Validation ----------

export interface ValidationIssue {
    level: "error" | "warning";
    message: string;
    recordKey?: string;
}

function isString(v: unknown): v is string {
    return typeof v === "string";
}

function recordKey(r: TrackingRecord, idx: number): string {
    return r?.targetPage?.filePath?.trim() ||
        `<deleted:${r?.sourcePages?.[0]?.filePath ?? `index-${idx}`}>`;
}

function validatePageInfo(
    p: unknown,
    ctx: string,
    issues: ValidationIssue[],
    key: string,
    allowEmptyPaths = false,
): void {
    if (!p || typeof p !== "object") {
        issues.push({
            level: "error",
            message: `${ctx}: must be an object.`,
            recordKey: key,
        });
        return;
    }
    const pi = p as Partial<PageInfo>;

    if (!isString(pi.pageType) || !PAGE_TYPES.includes(pi.pageType as PageType)) {
        issues.push({
            level: "error",
            message: `${ctx}.pageType is invalid: ${String(pi.pageType)}`,
            recordKey: key,
        });
    }

    if (!isString(pi.menuPath)) {
        issues.push({
            level: "error",
            message: `${ctx}.menuPath must be a string.`,
            recordKey: key,
        });
    } else if (!allowEmptyPaths && pi.menuPath.trim() === "") {
        issues.push({
            level: "warning",
            message: `${ctx}.menuPath is empty.`,
            recordKey: key,
        });
    }

    if (!isString(pi.filePath)) {
        issues.push({
            level: "error",
            message: `${ctx}.filePath must be a string.`,
            recordKey: key,
        });
    } else if (!allowEmptyPaths && pi.filePath.trim() === "") {
        issues.push({
            level: "warning",
            message: `${ctx}.filePath is empty.`,
            recordKey: key,
        });
    }
}

export function validateRecord(
    r: unknown,
    idx: number,
): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    if (!r || typeof r !== "object") {
        issues.push({
            level: "error",
            message: `Record at index ${idx} is not an object.`,
        });
        return issues;
    }
    const rec = r as Partial<TrackingRecord>;
    const key = recordKey(rec as TrackingRecord, idx);

    // mappingType
    if (
        !isString(rec.mappingType) ||
        !MAPPING_TYPES.includes(rec.mappingType as MappingType)
    ) {
        issues.push({
            level: "error",
            message: `mappingType is invalid: ${String(rec.mappingType)}`,
            recordKey: key,
        });
    }

    // targetPage / sourcePages
    const isDeleted = rec.mappingType === "deleted";
    validatePageInfo(rec.targetPage, "targetPage", issues, key, isDeleted);

    if (!Array.isArray(rec.sourcePages)) {
        issues.push({
            level: "error",
            message: `sourcePages must be an array.`,
            recordKey: key,
        });
    } else {
        rec.sourcePages.forEach((sp, i) =>
            validatePageInfo(sp, `sourcePages[${i}]`, issues, key)
        );
    }

    // mappingType <-> sourcePages cardinality
    if (Array.isArray(rec.sourcePages)) {
        const n = rec.sourcePages.length;
        switch (rec.mappingType) {
            case "new":
                if (n !== 0) {
                    issues.push({
                        level: "error",
                        message: `mappingType "new" requires sourcePages = [].`,
                        recordKey: key,
                    });
                }
                break;
            case "1-to-1":
                if (n !== 1) {
                    issues.push({
                        level: "error",
                        message: `mappingType "1-to-1" requires exactly 1 sourcePage.`,
                        recordKey: key,
                    });
                }
                break;
            case "merged":
                if (n < 2) {
                    issues.push({
                        level: "error",
                        message: `mappingType "merged" requires >= 2 sourcePages.`,
                        recordKey: key,
                    });
                }
                break;
            case "split":
                if (n < 1) {
                    issues.push({
                        level: "error",
                        message: `mappingType "split" requires >= 1 sourcePage.`,
                        recordKey: key,
                    });
                }
                break;
            case "deleted":
                if (n < 1) {
                    issues.push({
                        level: "error",
                        message: `mappingType "deleted" requires >= 1 sourcePage.`,
                        recordKey: key,
                    });
                }
                break;
        }
    }

    // status compatibility with pageType
    const pageType = rec.targetPage?.pageType;
    const status = rec.status;
    if (rec.mappingType === "deleted") {
        if (status !== "na") {
            issues.push({
                level: "error",
                message: `Deleted records must have status "na".`,
                recordKey: key,
            });
        }
    } else if (pageType === "tutorial") {
        if (
            !isString(status) ||
            !TUTORIAL_STATUSES.includes(status as TutorialDocStatus)
        ) {
            issues.push({
                level: "error",
                message:
                    `Tutorial pages must use TutorialDocStatus; got "${String(status)}".`,
                recordKey: key,
            });
        }
    } else {
        if (
            !isString(status) ||
            !REGULAR_STATUSES.includes(status as RegularDocStatus)
        ) {
            issues.push({
                level: "error",
                message:
                    `Non-tutorial pages must use RegularDocStatus; got "${String(status)}".`,
                recordKey: key,
            });
        }
    }

    // notes
    if (!isString(rec.notes)) {
        issues.push({
            level: "error",
            message: `notes must be a string.`,
            recordKey: key,
        });
    }

    return issues;
}

export function validateAllRecords(
    records: TrackingRecord[],
): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    records.forEach((r, i) => issues.push(...validateRecord(r, i)));

    // Duplicate targetPage.filePath check
    const seen = new Map<string, number>();
    records.forEach((r, i) => {
        const fp = r?.targetPage?.filePath?.trim();
        if (!fp || r.mappingType === "deleted") return;
        if (seen.has(fp)) {
            issues.push({
                level: "error",
                message: `Duplicate targetPage.filePath "${fp}" (also at index ${seen.get(fp)}).`,
                recordKey: fp,
            });
        } else {
            seen.set(fp, i);
        }
    });

    return issues;
}

// ---------- Site-structure ordering ----------

/**
 * Parses `recommended-site-structure.md` and returns an ordered list of
 * normalized keys for sorting tracking records.
 *
 * Only parses content between the first section heading (### 1) and
 * the migration map section (## Current pages). Meta-headings like
 * ## Legend, ## Top-level navigation are excluded.
 */
export function readStructureOrder(): string[] {
    if (!fs.existsSync(STRUCTURE_PATH)) {
        return [];
    }
    const md = fs.readFileSync(STRUCTURE_PATH, "utf-8");
    const order: string[] = [];

    const lines = md.split(/\r?\n/);
    let inContent = false;

    for (const line of lines) {
        // Start parsing at the first ### numbered heading
        if (!inContent && /^###\s+\d/.test(line)) {
            inContent = true;
        }
        // Stop at the migration map section
        if (inContent && /^##\s+Current pages/i.test(line)) {
            break;
        }
        if (!inContent) continue;

        // Section headings
        const h = line.match(/^#{2,6}\s+(.+?)\s*$/);
        if (h) {
            order.push(normalizeKey(h[1]));
            continue;
        }
        // List items
        const li = line.match(/^\s*[*-]\s+(.+?)\s*$/);
        if (li) {
            const cleaned = li[1]
                .replace(/`\[[^\]]+\]`/g, "")
                .replace(/\*\*🆕\*\*/g, "")
                .replace(/←.*$/, "")
                .replace(/\*[^*]*\*/g, "")
                .replace(/`/g, "")
                .trim();
            if (cleaned) order.push(normalizeKey(cleaned));
        }
    }
    return order;
}

function normalizeKey(s: string): string {
    return s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Sort records to match the order defined by recommended-site-structure.md.
 *
 * Matching: for each record, extract the last meaningful path segment from
 * filePath and menuPath, then find the best matching structure key. Uses
 * forward-only matching (structure key must appear in the record's path,
 * not the reverse) to avoid short-key collisions.
 */
export function sortByStructure(
    records: TrackingRecord[],
    structureOrder: string[],
): TrackingRecord[] {
    const indexFor = (r: TrackingRecord): number => {
        if (r.mappingType === "deleted") return Number.MAX_SAFE_INTEGER;

        const paths = [
            normalizeKey(r.targetPage?.filePath ?? ""),
            normalizeKey(r.targetPage?.menuPath ?? ""),
        ].filter(Boolean);

        if (paths.length === 0) return structureOrder.length;

        let bestIdx = -1;
        let bestScore = 0;

        for (let i = 0; i < structureOrder.length; i++) {
            const key = structureOrder[i];
            if (!key || key.length < 3) continue;

            for (const haystack of paths) {
                if (!haystack.includes(key)) continue;

                // Score: longer key matches are more specific
                const score = key.length;
                if (score > bestScore) {
                    bestScore = score;
                    bestIdx = i;
                }
            }
        }

        return bestIdx === -1 ? structureOrder.length : bestIdx;
    };

    return [...records]
        .map((r, i) => ({ r, i, k: indexFor(r) }))
        .sort((a, b) => (a.k - b.k) || (a.i - b.i))
        .map((x) => x.r);
}

export function checkStructureOrdering(
    records: TrackingRecord[],
): ValidationIssue[] {
    const order = readStructureOrder();
    if (order.length === 0) {
        return [{
            level: "warning",
            message:
                `Could not derive ordering from ${STRUCTURE_PATH}; skipping order check.`,
        }];
    }
    const sorted = sortByStructure(records, order);
    const issues: ValidationIssue[] = [];
    for (let i = 0; i < records.length; i++) {
        if (records[i] !== sorted[i]) {
            issues.push({
                level: "error",
                message:
                    `Records are not ordered per recommended-site-structure.md. ` +
                    `First mismatch at index ${i}: expected target "${sorted[i]?.targetPage?.filePath ?? "(deleted)"
                    }", got "${records[i]?.targetPage?.filePath ?? "(deleted)"}".`,
            });
            break;
        }
    }
    return issues;
}

// ---------- Utility ----------

export function findRecordIndex(
    records: TrackingRecord[],
    filePath: string,
): number {
    const key = filePath.trim();
    return records.findIndex(
        (r) => (r.targetPage?.filePath ?? "").trim() === key,
    );
}

export function findDeletedRecordIndex(
    records: TrackingRecord[],
    sourceFilePath: string,
): number {
    const key = sourceFilePath.trim();
    return records.findIndex(
        (r) =>
            r.mappingType === "deleted" &&
            r.sourcePages.some(
                (sp) => (sp.filePath ?? "").trim() === key,
            ),
    );
}

export function printIssues(issues: ValidationIssue[]): void {
    for (const issue of issues) {
        const prefix = issue.level === "error" ? "✖ ERROR" : "⚠ WARN ";
        const where = issue.recordKey ? ` [${issue.recordKey}]` : "";
        console.error(`${prefix}${where}: ${issue.message}`);
    }
}
