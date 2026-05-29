#!/usr/bin/env -S npx tsx
/**
 * Validate docs-planning/tracking.json:
 *   - schema/shape of every record
 *   - status compatibility with pageType
 *   - mappingType cardinality vs. sourcePages
 *   - duplicate targetPage.filePath
 *   - ordering vs. docs-planning/recommended-site-structure.md
 *
 * Exit code: 0 if no errors (warnings allowed), 1 otherwise.
 *
 * Usage:
 *   npx tsx scripts/validate-tracking-records.ts
 */

import {
    checkStructureOrdering,
    printIssues,
    readTrackingFile,
    validateAllRecords,
} from "./tracking-shared";

function main() {
    const file = readTrackingFile();
    const records = file.records;
    const issues = [
        ...validateAllRecords(records),
        ...checkStructureOrdering(records),
    ];

    const errors = issues.filter((i) => i.level === "error");
    const warnings = issues.filter((i) => i.level === "warning");

    if (issues.length === 0) {
        console.log(`✔ tracking.json is valid (${records.length} records).`);
        process.exit(0);
    }

    printIssues(issues);
    console.error(
        `\nSummary: ${errors.length} error(s), ${warnings.length} warning(s), ${records.length} record(s).`,
    );
    process.exit(errors.length > 0 ? 1 : 0);
}

main();
