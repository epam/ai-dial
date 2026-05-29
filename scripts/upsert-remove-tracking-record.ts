#!/usr/bin/env -S npx tsx
/**
 * Upsert or remove a single tracking record in docs-planning/tracking.json.
 *
 * Usage:
 *   npx tsx scripts/upsert-remove-tracking-record.ts upsert --record '<json>'
 *   npx tsx scripts/upsert-remove-tracking-record.ts upsert --record-file path/to/record.json
 *   npx tsx scripts/upsert-remove-tracking-record.ts remove --filePath docs/foo/bar.md
 *   npx tsx scripts/upsert-remove-tracking-record.ts remove --sourceFilePath docs/old/page.md
 *
 * Flags:
 *   --force    Skip validation of existing records (only validates the new one)
 *
 * Behavior:
 *   - upsert: validates the record, inserts or replaces by targetPage.filePath,
 *     then re-sorts the file per recommended-site-structure.md.
 *   - remove: deletes the record whose targetPage.filePath matches (or
 *     --sourceFilePath for deleted records).
 *   - Always writes back a sorted, pretty-printed JSON.
 */

import * as fs from "node:fs";
import {
    findDeletedRecordIndex,
    findRecordIndex,
    printIssues,
    readStructureOrder,
    readTrackingFile,
    sortByStructure,
    type TrackingRecord,
    validateAllRecords,
    validateRecord,
    writeTrackingFile,
} from "./tracking-shared";

interface ParsedArgs {
    command: "upsert" | "remove";
    record?: string;
    recordFile?: string;
    filePath?: string;
    sourceFilePath?: string;
    force: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
    const [, , cmd, ...rest] = argv;
    if (cmd !== "upsert" && cmd !== "remove") {
        fail(`Unknown command "${cmd}". Use "upsert" or "remove".`);
    }
    const out: ParsedArgs = { command: cmd as "upsert" | "remove", force: false };
    for (let i = 0; i < rest.length; i++) {
        const a = rest[i];
        const next = rest[i + 1];
        switch (a) {
            case "--record":
                if (!next || next.startsWith("--")) fail(`--record requires a value.`);
                out.record = next;
                i++;
                break;
            case "--record-file":
                if (!next || next.startsWith("--")) fail(`--record-file requires a value.`);
                out.recordFile = next;
                i++;
                break;
            case "--filePath":
                if (!next || next.startsWith("--")) fail(`--filePath requires a value.`);
                out.filePath = next;
                i++;
                break;
            case "--sourceFilePath":
                if (!next || next.startsWith("--")) fail(`--sourceFilePath requires a value.`);
                out.sourceFilePath = next;
                i++;
                break;
            case "--force":
                out.force = true;
                break;
            default:
                fail(`Unknown argument: ${a}`);
        }
    }
    return out;
}

function fail(msg: string): never {
    console.error(`✖ ${msg}`);
    process.exit(2);
}

function loadRecord(args: ParsedArgs): TrackingRecord {
    let raw: string | undefined;
    if (args.record) raw = args.record;
    else if (args.recordFile) raw = fs.readFileSync(args.recordFile, "utf-8");
    else fail(`upsert requires --record '<json>' or --record-file <path>`);

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw!);
    } catch (e) {
        fail(`Could not parse record JSON: ${(e as Error).message}`);
    }

    if (!parsed || typeof parsed !== "object") {
        fail(`Record JSON must be an object.`);
    }
    return parsed as TrackingRecord;
}

function main() {
    const args = parseArgs(process.argv);
    const file = readTrackingFile();
    const records = file.records;

    if (args.command === "upsert") {
        const record = loadRecord(args);

        // Validate the new record
        const recordIssues = validateRecord(record, -1);
        const recordErrors = recordIssues.filter((i) => i.level === "error");
        if (recordErrors.length > 0) {
            console.error("✖ Record failed validation:");
            printIssues(recordIssues);
            process.exit(1);
        }
        if (recordIssues.length > 0) printIssues(recordIssues);

        const targetPath = record.targetPage?.filePath?.trim() ?? "";
        let action: "inserted" | "updated";

        if (record.mappingType === "deleted" && !targetPath) {
            // Dedupe deleted records by sorted concat of all source filePaths
            const sourceKey = record.sourcePages
                .map((sp) => (sp.filePath ?? "").trim())
                .sort()
                .join("|");
            const idx = records.findIndex(
                (r) =>
                    r.mappingType === "deleted" &&
                    r.sourcePages
                        .map((sp) => (sp.filePath ?? "").trim())
                        .sort()
                        .join("|") === sourceKey,
            );
            if (idx >= 0) {
                records[idx] = record;
                action = "updated";
            } else {
                records.push(record);
                action = "inserted";
            }
        } else {
            const idx = findRecordIndex(records, targetPath);
            if (idx >= 0) {
                records[idx] = record;
                action = "updated";
            } else {
                records.push(record);
                action = "inserted";
            }
        }

        // Validate full array (catch corruption in existing records)
        if (!args.force) {
            const allIssues = validateAllRecords(records);
            const allErrors = allIssues.filter((i) => i.level === "error");
            if (allErrors.length > 0) {
                console.error(
                    "✖ Existing records have validation errors. Use --force to override.",
                );
                printIssues(allErrors);
                process.exit(1);
            }
        }

        const sorted = sortByStructure(records, readStructureOrder());
        file.records = sorted;
        writeTrackingFile(file);
        console.log(
            `✔ ${action} record for "${targetPath || record.sourcePages?.[0]?.filePath || "(unknown)"}".`,
        );
        return;
    }

    if (args.command === "remove") {
        let idx: number;
        if (args.sourceFilePath) {
            idx = findDeletedRecordIndex(records, args.sourceFilePath);
            if (idx < 0) {
                console.error(
                    `⚠ No deleted record found with sourceFilePath "${args.sourceFilePath}"; nothing to remove.`,
                );
                process.exit(0);
            }
        } else if (args.filePath) {
            idx = findRecordIndex(records, args.filePath);
            if (idx < 0) {
                console.error(
                    `⚠ No record found for filePath "${args.filePath}"; nothing to remove.`,
                );
                process.exit(0);
            }
        } else {
            fail(`remove requires --filePath <path> or --sourceFilePath <path>`);
        }

        const removed = records.splice(idx, 1)[0];
        const sorted = sortByStructure(records, readStructureOrder());
        file.records = sorted;
        writeTrackingFile(file);
        const label = removed.targetPage?.filePath ||
            removed.sourcePages?.[0]?.filePath || "(unknown)";
        console.log(`✔ Removed record for "${label}".`);
        return;
    }
}

main();
