---
name: sources
description: Use when collecting what changed in the epam/ai-dial docs over a period, as input for updating the guide sections - the window of commits since the last guide alignment run or a given date, the content-only changes to service pages, the Admin and Chat user guides, the Overview, and docs/releases, release notes and upgrade notes digested, and the change ledger kept during the run.
user-invocable: false
---

# Source changes for a guide alignment

The sources are everything that tells the guides what is true now:

| Source | Path | What it is the authority for |
|---|---|---|
| Service pages | `docs_v2/7.services/` | every setting, default, endpoint, dependency, image, chart value, and behavior of a service; verified against released code by the service sync |
| Admin and Chat user guides | `docs_v2/6.administering-dial-new/`, `docs_v2/8.chat-user-guide/` | what an administrator or user does on a screen |
| Overview and Demos | `docs_v2/1.overview.md`, `docs_v2/9.demos/` | positioning and the service list; rarely a source for a guide fact |
| Release documents | `docs/releases/<N>/`: `<N>-release-notes.md`, `upgrade-to-<N>.md`, other guides | what a platform release ships, its component versions, what operators must do on upgrade, and which features are Preview |
| This repository's files | `dial-samples/`, and paths the guides tell readers to clone or open | whether a step that uses them still works |

Pages in the four target sections are not sources, but their changes in the window are context: someone may have done part of the work already.

Never research service repositories in this task. A fact no docs page or release document states is a "Needs review" item.

## 1. The window

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/window.py" --out <WORK>/window.json [--since <YYYY-MM-DD|#PR|COMMIT>]
```

The window ends at `<BASE>` and starts after:

1. `--since`, when the run's options give a start;
2. otherwise the commit that the newest alignment commit names: its message ends with "align with docs and release changes through `<SHA>`", which is how each run records its end;
3. otherwise the last commit before the same day one month ago.

A commit inside the window that adds 50 or more pages under `docs_v2/` is a bulk import, such as `#672`, which created the tree on 2026-11-13. Pages written together carry no change from one to the other, so the window starts after the newest such commit. The output says so.

Record the start mode, the start and end commits, and the commit list in the ledger. If the window has no commit with docs changes, stop: there is nothing to align.

## 2. The changes

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/source_changes.py" --work <WORK>
python3 -I "${CLAUDE_SKILL_DIR}/scripts/release_digest.py" --work <WORK>
```

`source_changes.py` compares the window's start with its end, with rename detection, over `docs_v2/`, `docs/releases/`, and `sidebars-v2.js`. It drops every hunk that differs only in link targets, whitespace, or frontmatter, so a renumbering or a link repair leaves no noise. `<WORK>/changes.md` lists, per source page:

| Kind | Meaning |
|---|---|
| `changed` | content changed: the sections (anchors), headings removed, added, or renamed, identifiers removed or added (a removed one marked "gone" when no source page has it any more), table rows changed, removed, or added, versions gone or new, and the path of the content-only diff in `<WORK>/diffs/` |
| `added` | a new page: its title, first paragraph, and H2 headings; `new service` when it is the overview of a new service folder, with the Services landing's one-line description |
| `removed` | a page deleted with no successor |
| `rewritten` | a page deleted and re-added under a new path with the same title and mostly new text; read both versions |
| `moved`, `links-only`, `frontmatter-only` | listed at the end; nothing to propagate unless a guide links the old path |

The end of the file lists the target pages that changed in the window.

`release_digest.py` writes `<WORK>/releases.md` for each release folder that changed in the window:

- the release notes' summary, every Major Enhancement with its Preview flag, and every Additional Notes item, each searched in the source pages and the target pages, with simple name variants ("Organization Units" also finds "org unit");
- the Versions list, compared with the previous release's;
- every component section of the upgrade notes, with its sub-sections (breaking changes, new, removed, and deprecated variables or settings, behavioral changes, migrations, API changes), their items, the callouts marked IMPORTANT or WARNING, and the identifiers they name, each with its count in source and target pages;
- other documents in the folder, by title and headings.

Notes and upgrade notes differ in weight. The release notes announce features in product language; the upgrade notes state settings, defaults, removals, and required actions precisely. Use the upgrade notes for facts and the release notes only for what shipped and what is Preview.

## 3. Read every content change

For each `changed`, `added`, `rewritten`, and `removed` entry, and for each release item:

1. Read the content-only diff, or the page itself for an added page. For a big addition, such as a new service, read its overview, and take its one-line description from the Services landing table.
2. Write down the fact in one line: what is true now that wasn't, or what stopped being true.
3. Note the PR numbers from the commits. A commit without a PR number is cited by its short SHA.

Skip nothing because it looks small: a one-word change of a default or a value is exactly what a guide repeats.

## 4. The ledger

Keep `<WORK>/ledger.md` current as you go. After a context compaction, re-read it and `git status`, and continue from there instead of starting over.

```markdown
# Guide alignment ledger

Window: <START>..<END> (<MODE>); base <BASE> at <COMMIT>; <N> commits

| # | Source | Fact | Guide page and line | Verdict | Edit or reason |
|---|---|---|---|---|---|
| 1 | [61] 7.services/1.core/…/3.valkey.md (#687) | the Redis page became Valkey; settings keep the `redis` prefix | 5.operating-dial/7.production-readiness/1.high-availability.md L20 | skip (still true) | "managed Redis-compatible service" stays correct |
```

One row per fact and guide page. A fact that touches no guide page gets one row with "—" as the page and its verdict.
