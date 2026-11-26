---
name: checks
description: Use when verifying a guide alignment change in the epam/ai-dial docs before the commit - scope, frontmatter, style, admonition form, readability, copied reference text, links and anchors, repository paths, the frontmatter linter, and the Docusaurus build - and when a failure must be classified as caused by the change or already present on the base branch.
user-invocable: false
---

# Guide checks

Run every check after the last edit, from the checkout root, and fix what the change broke. Report each check exactly: the command, the result, and the counts. A pull request into `development` runs no CI build (`.github/workflows/pr.yml` builds only PRs into `main`), so these checks are the only gate.

`<BASE>` is the task's base: `origin/development`, or the local `development` branch when the checkout has no `origin`. The scripts pick the same one when `--base` is left out.

Never run `npm install`, `npm ci`, `npm update`, `npm run lint:frontmatter:fix`, or `npm run check:references`. The last one calls registries and rewrites the tracked `outdated_references.json`.

## 1. Scope, frontmatter, style, and readability

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/guide_checks.py" --base <BASE> [--section <NAME> ...]
```

| Check | Errors | Warnings |
|---|---|---|
| scope | a changed path outside the four sections (or outside `--section`); a page added, removed, or renamed; any change to `sidebars-v2.js` | — |
| frontmatter | any field changed on an existing page, `last_verified` included | — |
| style, on added lines | banned words, `Next steps` or `Related` headings, bare `<…>` or `{…}` outside code, absolute or `docs.dialx.ai` links, fences without a language, headings below H4 | branch-pinned GitHub links, `localhost` in code, sentences over 30 words, exclamation marks, changelog wording ("new in", "since 0.50") |
| admonitions | a form the page doesn't use; a label other than Note, Tip, Warning; `:::info` on a page without one | a form that differs from the folder's or the section's when the page has none |
| readability | — | growth of more than 150 words or 15%, a new heading, a new table on an explanation or landing page, an added paragraph of more than 5 sentences, a sentence copied from a source page, a dash style the page doesn't use |

Errors must be zero. Read every warning: fix the ones in text you wrote, and keep a warning only with a reason you can state in the PR. A "copied from" warning almost always means a guide is repeating the reference; link it instead.

`--allow-last-verified` is for a run whose options include `set last_verified`; use it only then.

## 2. Links and anchors

```bash
git diff --name-only <BASE> -- 'docs_v2/*.md' > <WORK>/changed.txt
python3 -I "${CLAUDE_SKILL_DIR}/scripts/check_links.py" $(cat <WORK>/changed.txt)
```

It resolves relative `.md` links, extension-less route links, anchors, and sidebar ids in seconds, without `node_modules`. It doesn't replace the build.

## 3. Repository paths

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/repo_refs.py" --base <BASE> --added-only $(cat <WORK>/changed.txt)
```

Every path in this repository that an added line points to must exist at `<BASE>`. Without `--added-only` it lists every such path the guides name; on 2026-11-25 that was ten missing `dial-docker-compose/` paths in `5.operating-dial/1.local-setup/`, removed by `#680`. Those predate the run and go under "Needs review".

## 4. Frontmatter linter

```bash
test -x node_modules/.bin/tsx && npm run lint:frontmatter > <WORK>/lint.txt 2>&1; tail -5 <WORK>/lint.txt
grep -F -f <WORK>/changed.txt <WORK>/lint.txt
```

Without `node_modules/.bin/tsx`, skip it and say so: `npx` would download `tsx`, which counts as an install.

The linter fails before any run. On 2026-11-25: 101 errors and 13 warnings in 362 files. In the four sections, 42 errors are `component` values outside the accepted list and 6 warnings are title-case titles. An error on a changed page predates the run when `guide_checks.py` reports no frontmatter change on it. Report the total, the count on changed pages, and the count the run caused, which must be zero.

## 5. Build

```bash
test -d node_modules && npm run build > <WORK>/build.log 2>&1; echo "exit=$?"; tail -20 <WORK>/build.log
grep -n 'SUCCESS\|Error\|Broken link\|broken anchor' <WORK>/build.log | head -40
```

- Run it once, after all edits. It takes several minutes and writes `build/` and `.docusaurus/`, which are gitignored.
- Success is exit code 0 and `[SUCCESS] Generated static files`.
- A broken link or anchor fails the build. The log names the route (`/operating-dial/observability/tracing`); restore the numeric prefixes to find the file.
- Without `node_modules`, don't build: write "build not run: node_modules missing" in the PR and rely on checks 1–4.

**Is a failure pre-existing?** If it is in a file you changed, it's yours: fix it. Otherwise build the base in a scratch copy:

```bash
mkdir <WORK>/base && git archive <BASE> | tar -x -C <WORK>/base
ln -s "$(pwd)/node_modules" <WORK>/base/node_modules
(cd <WORK>/base && npm run build > <WORK>/build-base.log 2>&1); echo "exit=$?"
```

If the base fails the same way, report the failure as pre-existing with its first error line, and leave it.

**Environment failures** such as `Can't resolve '@theme/DebugConfig'` come from a `docusaurus start` dev server that rewrites `.docusaurus/` in the same checkout. Build the branch's content in a scratch copy (`git archive HEAD`) instead.

## 6. Read the whole diff

```bash
git diff --check <BASE>
git diff --stat <BASE>
git diff <BASE> -- docs_v2 > <WORK>/final.diff
```

- `git diff --check` prints nothing.
- Read `final.diff` from top to bottom. Every hunk traces to a ledger row with the verdict `update`.
- Drop any hunk that only rewords, reformats, or re-sorts.
- Read each changed paragraph in its page, as the `docs-services-review-and-update-relatives:style` final read describes.

## Report lines for the PR

```markdown
- `guide_checks.py`: 0 errors, <N> warnings kept (<WHY EACH WAS KEPT>)
- `check_links.py`: <N> links in <N> files, 0 errors
- `repo_refs.py --added-only`: <N> paths, 0 missing
- `npm run lint:frontmatter`: <N> errors on the tree, <N> on changed pages, 0 caused by this change
- `npm run build`: [SUCCESS] Generated static files
```
