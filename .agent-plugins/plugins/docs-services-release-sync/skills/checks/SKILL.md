---
name: checks
description: Use when verifying docs_v2 changes in the epam/ai-dial repository before a commit or pull request - scope, frontmatter, style, links and anchors, the frontmatter linter, and the Docusaurus build - and when a lint or build failure must be classified as caused by the change or already present on the base branch.
user-invocable: false
---

# Docs sync checks

Run every check after the last edit, from the checkout root, and fix what the change broke. Report each check exactly: the command, the result, and the counts. A pull request into `development` runs no CI build (`.github/workflows/pr.yml` builds only PRs into `main`), so these checks are the only gate.

`<BASE>` is the task's base: `origin/development`, or the local `development` branch when the checkout has no `origin`. `sync_checks.py` picks the same one when `--base` is left out.

Never run `npm install`, `npm ci`, `npm update`, `npm run lint:frontmatter:fix`, or `npm run check:references`. The last one calls registries and rewrites the tracked `outdated_references.json`.

## 1. Scope, frontmatter, and style

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/sync_checks.py" --base <BASE> \
  --service docs_v2/7.services/<N>.<service>/ [--service ...] --today <YYYY-MM-DD>
```

It compares the working tree, including untracked files under `docs_v2/`, with the base:

- **scope**: every changed path is in a synced service folder, a related section, or `sidebars-v2.js` when a page was added, removed, or renamed;
- **frontmatter**: existing pages change only `last_verified`, service pages carry today's date, related pages keep theirs, and new pages have every field;
- **style, on added lines only**: banned words, `Next steps` or `Related` headings, a `:::` block on a page that had none, a `:::` type other than `note`, `tip`, `warning` (and `info` in `0.index.md`), a bold label other than Note, Tip, or Warning, absolute or `docs.dialx.ai` links, bare `<…>` or `{…}` outside code (MDX), code fences without a language, headings below H4.

Errors must be zero. Review each warning: fix the ones in text you wrote, and leave the ones you deliberately kept. The warnings cover a bold label on a page that uses `:::` blocks, branch-pinned GitHub links, `localhost` in examples, sentences over 30 words, exclamation marks, and version wording.

A `last_verified` warning is expected on a page of a multi-repository folder that also covers a repository you didn't sync.

## 2. Links and anchors

```bash
git diff --name-only <BASE> -- 'docs_v2/*.md' > <WORK>/changed.txt
git ls-files --others --exclude-standard -- docs_v2 >> <WORK>/changed.txt
python3 -I "${CLAUDE_SKILL_DIR}/scripts/check_links.py" $(cat <WORK>/changed.txt)
```

After adding, removing, or renaming a page or a heading, run it with no arguments: links on other pages may point at what changed. The whole tree checked clean on 2026-11-25 (4,780 links). An error in a file you didn't touch predates the sync; confirm it on the base copy from check 4. The script resolves relative `.md` links, extension-less route links, anchors, and sidebar ids in seconds, and needs no `node_modules`. It does not replace the build.

## 3. Frontmatter linter

```bash
test -x node_modules/.bin/tsx && npm run lint:frontmatter > <WORK>/lint.txt 2>&1; tail -5 <WORK>/lint.txt
grep -F -f <WORK>/changed.txt <WORK>/lint.txt
```

Without `node_modules/.bin/tsx`, skip the linter and say so in the report: `npx` would download `tsx`, which counts as an install.

The linter exits 1 before any sync. On 2026-11-25 the tree had 101 errors in 362 files: 61 were `component: apps`, 12 were `type: user-guide`, and the rest were other `component` values. An error on a changed page predates the sync when `sync_checks.py` shows that page's frontmatter changed only in `last_verified`. Report the total, the count on changed pages, and the count the sync caused, which must be zero.

## 4. Build

```bash
test -d node_modules && npm run build > <WORK>/build.log 2>&1; echo "exit=$?"; tail -20 <WORK>/build.log
grep -n 'SUCCESS\|Error\|Broken link\|broken anchor' <WORK>/build.log | head -40
```

- Run it once, after all edits and commits. It takes several minutes. It writes `build/` and `.docusaurus/`, which are gitignored.
- Success means exit code 0 and `[SUCCESS] Generated static files` in the log.
- A broken link or anchor fails the build. The log names the route (`/services/log-parser/configuration`); map it back to a file by restoring the numeric prefixes.
- Without `node_modules`, don't build. Say "build not run: node_modules missing" in the PR and rely on checks 1–3.

**Is a failure pre-existing?** If the failing page or link is in a file you changed, it's yours: fix it. Otherwise, build the base in a scratch copy:

```bash
mkdir <WORK>/base && git archive <BASE> | tar -x -C <WORK>/base
ln -s "$(pwd)/node_modules" <WORK>/base/node_modules
(cd <WORK>/base && npm run build > <WORK>/build-base.log 2>&1); echo "exit=$?"
```

If the base fails the same way, report the failure as pre-existing, with its first error line, and leave it.

**Environment failures.** Errors such as `Can't resolve '@theme/DebugConfig'` or other module-resolution errors are environmental, not about content. They show up when a `docusaurus start` dev server runs from the same checkout and rewrites `.docusaurus/`. Build in the scratch copy above with the branch's content (`git archive HEAD`) instead.

## 5. Read the whole diff

```bash
git diff --check <BASE>
git diff --stat <BASE>
git diff <BASE> -- docs_v2 sidebars-v2.js > <WORK>/final.diff
```

- `git diff --check` must print nothing: no trailing whitespace and no conflict markers.
- Read `final.diff` once from top to bottom. Every hunk traces to a ledger row or to a stale version statement.
- Drop any hunk that only rewords, reformats, or re-sorts text.

## Report lines for the PR

```markdown
- `sync_checks.py`: 0 errors, <N> warnings kept (<WHY EACH WAS KEPT>)
- `check_links.py`: <N> links in <N> files, 0 errors
- `npm run lint:frontmatter`: <N> errors on the tree, <N> on changed pages, 0 caused by this change (<FIELDS>)
- `npm run build`: [SUCCESS] Generated static files
```
