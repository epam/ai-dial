---
name: checks
description: Use when verifying a DIAL Chat User Guide update plan before its pull request, with plan_checks.py (the work order's sections, item numbering and fields, that every cited page, line, heading, image, and replaced text exists, tag-pinned links, body size, no AI attribution or labels, and that the branch changes only last_verified on the guide's pages) and the frontmatter linter, and how to report each check under Verification.
user-invocable: false
---

# Checks

The run changes no page text, so the build and the link checks have nothing new to find. The risks are in the work order: an item that cites a line that doesn't hold the text, a heading that doesn't exist, an image name that is wrong, a link to a branch instead of a tag. A writer who meets one stops trusting the rest. The checks catch those, and prove that the commit changes only `last_verified`.

## 1. The work order (workflow step 7)

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/plan_checks.py" --body <WORK>/pr-body.md --title '<TITLE>' \
  > <WORK>/plan_checks.txt 2>&1; echo "exit=$?"; cat <WORK>/plan_checks.txt
```

It prints `ok` or `FAIL` per check, with each reason under a `FAIL`:

| Check | A failure means |
|---|---|
| `sections` | a heading is missing, renamed, or out of order (`work-order`, section 6) |
| `items` | a gap in the numbers, an unknown type, a missing field, or a Where, Image, Replace, Remove, or Source that doesn't match the page or the format (`work-order`, section 4) |
| `links` | a link to `epam/<REPO>/blob/` or `/tree/` at a branch or a commit instead of an `X.Y.Z` tag |
| `size` | the body is over 65,536 characters |
| `rules` | attribution text, a label command, or a title that doesn't start with `[DIAL Loop]: plan ` |

Fix the work order, not the check, and run it again until every line is `ok`. A Replace that fails because the old text isn't on the line means the line number or the text is wrong. Look at the line again (`sed -n '<LINE>p' docs_v2/8.chat-user-guide/<PAGE>`) and fix whichever is wrong. If the page doesn't hold the text at all, the item is wrong: drop it, or move it to "Needs review".

## 2. The branch (workflow step 9, before the commit)

After setting `last_verified` (`docs-chat-guide-update-plan:pr`, section 3):

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/plan_checks.py" --body <WORK>/pr-body.md --title '<TITLE>' \
  --base <BASE> --date <DATE> --inventory <WORK>/guide.json \
  > <WORK>/plan_checks_diff.txt 2>&1; echo "exit=$?"; cat <WORK>/plan_checks_diff.txt
```

The `diff` check passes when the only changes against `<BASE>` are `last_verified: <DATE>` lines, only in the guide's pages, on every page of the inventory, and nothing is untracked under `docs_v2/`. The body checks run again too. The line numbers in the work order are still right, because a date replaces a date on the same line.

## 3. The frontmatter linter

```bash
test -x node_modules/.bin/tsx && npm run lint:frontmatter > <WORK>/lint.txt 2>&1; echo "exit=$?"; tail -5 <WORK>/lint.txt
grep -n '8.chat-user-guide' <WORK>/lint.txt
```

Run it at step 7 on the untouched tree, and again at step 9 after the dates are set. Compare the errors on the guide's pages. The linter exits 1 on the tree before any change. On 2026-11-27 it reported 101 errors in 363 files. Twelve of them are the guide's 12 pages: `Invalid value "user-guide" for field "type"`. The run must cause none: the count on the guide's pages is the same at both steps. Never run `npm run lint:frontmatter:fix`, `npm install`, or `npm run check:references`. Without `node_modules/`, say "not run: no node_modules".

## 4. Verification in the body

Write one line per check, with the command and its result, such as:

- `plan_checks.py --body … --title …`: all checks ok (14 items, 23,410 characters)
- `plan_checks.py … --base origin/development --date 2026-11-27`: ok, 12 pages, only `last_verified`
- `npm run lint:frontmatter`: 12 errors on the guide's pages before and after (`type: user-guide`), 0 caused by this change

The diff check runs after the body is first written, so update this section with its result before the commit, and run the body checks once more.
