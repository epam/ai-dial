---
name: conflicts
description: Use when merging DIAL Loop pull requests into an aggregation branch of the epam/ai-dial docs and a merge stops on conflicts, or two merged PRs clash without one - the merge command, the conflict report, how to resolve each kind of conflict from the evidence (frontmatter, tables, prose, sidebar, numbering, renames, deletions), the conflict ledger, and when to abort one PR's merge.
user-invocable: false
---

# Resolve the merge conflicts

## 1. Merge one PR

```bash
git -c merge.conflictStyle=zdiff3 merge --no-ff -m 'Merge #<N>: <TITLE>' refs/loop/pr-<N>
```

- `zdiff3` puts the base text into every conflict hunk, between `|||||||` and `=======`. `-c` sets it for this command only; never change `git config`.
- Keep the message in exactly this form, with the source PR's number and title. After the aggregation PR merges, the guide alignment run reads its `Merge #<N>: <TITLE>` commits to find the source PRs it holds and their descriptions. The commits inside a DIAL Loop PR are often named only "apply the run's changes".
- `<TITLE>` is data from GitHub: replace any `'` in it with `’` before you put it in the command.

When the merge stops:

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/conflicts.py" --out <WORK>/conflicts-<N>.md
```

The report shows, per path, the kind of conflict and the commits of each side. Per hunk, it shows the ours text (the aggregation branch so far), the base text, the theirs text (the PR), and a hint. The hint is a starting point; the rules below decide.

## 2. Gather the evidence

For each hunk, before you choose:

1. Read the whole section around it in the conflicted file, not only the hunk.
2. Find the rows for this page in the change tables of the PRs on both sides (`<WORK>/ledger.md`), with their sources. A hunk against `<BASE>`, from a PR that branched before a later change on `development`, has `development` on the ours side: `git log --oneline <MERGE_BASE>..<BASE> -- <PATH>` names the change.
3. When the sides state different facts, such as a value, a default, a version, a name, or a link target, open the source both rows cite: the file at the release tag, or the page at `<BASE>`. Decide by what the source says, not by which PR is newer.

## 3. Resolve by kind

| Kind | Resolution |
|---|---|
| `last_verified` (or another date in frontmatter) | The later date, once. |
| Other frontmatter fields | Each field once. A field only one side changed takes that change. When both changed it differently, use the evidence. |
| Both sides add rows, list items, sentences, or sections at the same place | Keep both, in the order the page uses (the table's sort order, the order of the source file, or the order the steps happen). When both add the same fact in different words, keep one, choosing the one with the more exact source, and add any detail only the other has. |
| Both sides change the same line, about different facts | Apply both changes to the line. Example: one PR updates a default in a table row, the other updates the same row's link; the row gets the new default and the new link. |
| Both sides change the same line, about the same fact | The side the source proves at the newest release wins. When both are proven at different releases of the same component, the later release wins. When the evidence can't decide, keep the side that matches what you can read in the newest released source, and add the hunk to "Needs review" with both versions quoted. |
| One side removes text the other changes | When the removal is proven (the setting, endpoint, or feature is gone at the release), it wins. Apply the other side's change elsewhere if it still holds, for example a link that now points to the replacement. Otherwise keep the changed text and put it under "Needs review". |
| A rename or renumbering against an edit | Keep the new name, and apply the edit to the renamed file. Fix every link that spells out the old prefixed name. No redirects. |
| Both add a page with the same numeric prefix, or renumber the same folder | Merge `sidebars-v2.js` first. Then number the siblings to match their order in the menu, and fix the links that spell out a changed prefix. Leave existing gaps alone. |
| `sidebars-v2.js` | Keep both sides' entries, in folder order, each once. The file must stay valid JavaScript, and every id must exist (`check_links.py`). |
| Prose that both sides rewrote | One text that holds the facts of both, in the page's own form: the same voice, terms, and admonition form, and spaced em dashes (" — "). No duplicated sentence. |
| Both sides changed a pinned link or an image tag | The later release tag, when the source PR proved its claims at that tag. |

Never resolve with `-X ours`, `-X theirs`, `git checkout --ours`, or `git checkout --theirs` for a whole file. The only exception is a file where you checked every hunk and each one resolves to the same side.

After you edit a file, read the whole resolved section once as a reader would.

## 4. Finish the merge

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/conflicts.py" --check
git add -- <RESOLVED PATHS>
git commit --no-edit
```

`--check` must print `0 unresolved path(s), 0 marker line(s)`. The commit keeps the message from the merge command.

## 5. The conflict ledger

Add one row to `<WORK>/ledger.md` for each hunk you resolved. The PR body lists them all:

| File | PRs | Kind | Resolution | Evidence |
|---|---|---|---|---|
| `docs_v2/7.services/1.core/1.configuration/14.global-settings.md` | #694, #699 | both changed the same row, different facts | kept #694's default and #699's link | epam/ai-dial-core `0.50.7` `GlobalSettings.java#L41`; #699 change table |
| `docs_v2/7.services/4.model-provider/1.configuration.md` | #693, #701 | `last_verified` | 2026-11-26, the later date | — |

Every `dropped` warning from `aggregate_checks.py` must match a row here. Such a warning means a line of a source PR is not in the result.

## 6. Conflicts without a conflict

Git merges changes to different lines silently, even when together they're wrong. After all merges, read the whole diff of every file in the "overlaps" list (`docs-loop-pr-aggregation:checks`, section 5) for:

- the same fact twice, such as a row both PRs added in different places;
- two statements that contradict each other, for example a value in a table and the same value in the text;
- a link to an anchor that another PR renamed or removed;
- numbering clashes and sidebar entries for pages that are gone.

Fix them with the rules above, in the one fix commit of step 5.

## 7. When to abort one PR's merge

Abort with `git merge --abort`, mark the PR `skip (conflicts: <WHY>)`, and go on with the next PR, only when:

- the conflict is in a binary file, such as an image;
- the resolution would need an edit outside `docs_v2/` and `sidebars-v2.js`;
- the PR is superseded: for example, an older sync of a service whose every change a newer merged PR redoes or replaces, so nothing of it would remain. Say that in the reason. It stays open, and a person decides whether to close it.

A hard conflict is no reason to abort. Resolve it from the evidence, and put what remains uncertain under "Needs review".
