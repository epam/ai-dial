---
name: checks
description: Use when verifying an aggregation branch of DIAL Loop pull requests in the epam/ai-dial docs before pushing it - scope, conflict markers, that every merged PR head is in the branch, lines of a PR that didn't arrive, duplicates, frontmatter, numbering, links and anchors, the frontmatter linter, the Docusaurus build, and how to tell new failures from ones already on the base.
user-invocable: false
---

# Aggregation checks

Run every check after the last merge and fix, from the checkout root. Report each check exactly: the command, the result, and the counts. A pull request into `development` runs no CI build (`.github/workflows/pr.yml` builds only PRs into `main`), so these checks are the only gate. That holds for the source PRs too: their content was never built together.

Never run `npm install`, `npm ci`, `npm update`, `npm run lint:frontmatter:fix`, or `npm run check:references`.

## 1. Aggregate checks

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/aggregate_checks.py" --base <BASE> --prs <WORK>/prs.json \
  --json <WORK>/checks.json > <WORK>/checks.txt 2>&1; echo "exit=$?"; cat <WORK>/checks.txt
```

It compares `HEAD` with its merge base on `<BASE>`.

| Result | Check | What to do |
|---|---|---|
| error | **scope**: a changed path outside `docs_v2/` and `sidebars-v2.js` | can't happen through the merges, since `collect` skips such PRs; find what added it and remove it |
| error | **markers**: a conflict marker on an added line | finish the resolution |
| error | **ancestry**: a merged PR's head is not in the branch | merge it again; never close that PR |
| error | **frontmatter**: no block, a duplicate key, or a `last_verified` that is no date | fix it as the conflicts skill says for frontmatter |
| error | **numbering**: two siblings with the same numeric prefix | renumber to the menu order (`docs-loop-pr-aggregation:conflicts`, section 3) |
| warning | **dropped**: a line a source PR added is not in the branch | each one must match a resolution in the conflict ledger; otherwise the change was lost, so restore it |
| warning | **duplicates**: a long line that appears more often than on the base | keep one, unless the page repeats it on purpose (the same example in two tabs) |
| warning | **whitespace**: what `git diff --check` reports | fix it only on lines a resolution wrote; the rest came from the source PRs |
| info | **overlaps**: files changed by more than one merged PR, or by a PR and by `development` after the PR branched | read the whole diff of each one (section 5) |

Errors must be zero.

## 2. Links and anchors

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/check_links.py"
```

Run it on the whole tree: one PR can rename a page or a heading that another PR links to. The tree was clean on 2026-11-26 (4,866 links in 363 files with three sync PRs merged). The script resolves relative `.md` links, extension-less route links, anchors, and sidebar ids in seconds, and needs no `node_modules`. It doesn't replace the build. An error in a file no merged PR touched predates the run; confirm it on the base copy from check 4.

## 3. Frontmatter linter

```bash
git diff --name-only <BASE>...HEAD -- 'docs_v2/*.md' > <WORK>/changed.txt
test -x node_modules/.bin/tsx && npm run lint:frontmatter > <WORK>/lint.txt 2>&1; tail -5 <WORK>/lint.txt
grep -F -f <WORK>/changed.txt <WORK>/lint.txt
```

Without `node_modules/.bin/tsx`, skip the linter and say so in the report: `npx` would download `tsx`, which counts as an install. The linter exits 1 before any change; on 2026-11-25 the tree had 101 errors in 362 files. Report the total, the count on changed pages, and the count the resolutions caused, which must be zero. An error that a source PR brought in as it was is reported under "Needs review", not fixed.

## 4. Build

```bash
test -d node_modules && npm run build > <WORK>/build.log 2>&1; echo "exit=$?"; tail -20 <WORK>/build.log
grep -n 'SUCCESS\|Error\|Broken link\|broken anchor' <WORK>/build.log | head -40
```

- Run it once, after the last commit. It takes several minutes. It writes `build/` and `.docusaurus/`, which are gitignored.
- Success means exit code 0 and `[SUCCESS] Generated static files` in the log.
- A broken link or anchor fails the build. The log names the route (`/services/core/configuration`); map it back to a file by restoring the numeric prefixes.
- Without `node_modules`, don't build. Say "build not run: node_modules missing" in the PR and rely on checks 1–3.

**Is a failure pre-existing?** If it is in a file a merged PR changed, the aggregation owns it: fix it, and say which PR brought it in. Otherwise, build the base in a scratch copy:

```bash
mkdir <WORK>/base && git archive <BASE> | tar -x -C <WORK>/base
ln -s "$(pwd)/node_modules" <WORK>/base/node_modules
(cd <WORK>/base && npm run build > <WORK>/build-base.log 2>&1); echo "exit=$?"
```

If the base fails the same way, report the failure as pre-existing, with its first error line, and leave it.

**Environment failures.** Errors such as `Can't resolve '@theme/DebugConfig'` or other module-resolution errors are about the environment, not the content. They show up when a `docusaurus start` dev server runs from the same checkout and rewrites `.docusaurus/`. Build in the scratch copy above with the branch's content (`git archive HEAD`) instead.

## 5. Read the overlap files

```bash
git diff --stat <BASE>...HEAD
git diff <BASE>...HEAD -- <OVERLAP FILE> > <WORK>/overlap-<NAME>.diff
```

For each file under "overlaps", read its whole diff once from top to bottom, looking for what `docs-loop-pr-aggregation:conflicts`, section 6, lists. The other files carry one PR's change as it was reviewed in that PR's run, so a glance at the stat is enough for them.

## Report lines for the PR

```markdown
- `aggregate_checks.py`: 0 errors; <N> dropped lines, each a ledger resolution; <N> duplicates kept (<WHY>)
- `check_links.py`: <N> links in <N> files, 0 errors
- `npm run lint:frontmatter`: <N> errors on the tree, <N> on changed pages, 0 caused by the resolutions
- `npm run build`: [SUCCESS] Generated static files
```
