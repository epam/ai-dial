---
name: checks
description: Use when verifying a DIAL Chat User Guide update plan before its pull request, with plan_checks.py - the work order file (its sections, item numbering and fields, that every cited page, line, heading, image, and replaced text exists, tag-pinned links, no AI attribution or labels, the `[DIAL Loop]: Chat update proposal` title), the branch (only last_verified on the guide's pages, plus the one new .research/chat-user-guide-<DATE>.md, all staged), and the PR body (its sections, size, and link to the work order) - and the frontmatter linter, and how to report each check under Verification.
user-invocable: false
---

# Checks

The run changes no page text, so the build and the link checks have nothing new to find. The risks are in the work order: an item that cites a line that doesn't hold the text, a heading that doesn't exist, an image name that is wrong, a link to a branch instead of a tag. A writer who meets one stops trusting the rest. The checks catch those, prove that the commit changes only `last_verified` and adds the one work order file, and check the PR body.

`--work-order` is `<WORK>/work-order.md` at step 7, and the copy in the branch, `<RESEARCH>`, at step 9. Run every command from the root of the checkout.

## 1. The work order (workflow step 7)

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/plan_checks.py" --work-order <WORK>/work-order.md --title '<TITLE>' \
  > <WORK>/plan_checks.txt 2>&1; echo "exit=$?"; cat <WORK>/plan_checks.txt
```

It prints `ok` or `FAIL` per check, with each reason under a `FAIL`:

| Check | A failure means |
|---|---|
| `sections` | a heading is missing, renamed, or out of order (`work-order`, section 6) |
| `items` | a gap in the numbers, an unknown type, a missing field, or a Where, Image, Replace, Remove, or Source that doesn't match the page or the format (`work-order`, section 4) |
| `links` | a link to `epam/<REPO>/blob/` or `/tree/` at a branch or a commit instead of an `X.Y.Z` tag |
| `rules` | attribution text or a label command in the work order, or a title that doesn't start with `[DIAL Loop]: Chat update proposal` |

Fix the work order, not the check, and run it again until every line is `ok`. A Replace that fails because the old text isn't on the line means the line number or the text is wrong. Look at the line again (`sed -n '<LINE>p' docs_v2/8.chat-user-guide/<PAGE>`) and fix whichever is wrong. If the page doesn't hold the text at all, the item is wrong: drop it, or move it to "Needs review".

## 2. The branch (workflow step 9, before the commit)

After setting `last_verified` and staging the work order (`docs-chat-guide-update-plan:pr`, sections 3 and 4):

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/plan_checks.py" --work-order <RESEARCH> --title '<TITLE>' \
  --base <BASE> --date <DATE> --inventory <WORK>/guide.json \
  > <WORK>/plan_checks_diff.txt 2>&1; echo "exit=$?"; cat <WORK>/plan_checks_diff.txt
```

The `diff` check compares what is staged with `<BASE>`. It passes when:

- the guide's pages change only in `last_verified: <DATE>` lines, on every page of the inventory;
- the only other change is one added file, `<RESEARCH>`: `.research/chat-user-guide-<DATE>.md`, or the same name with `-2` or `-3`, and the same path as `--work-order`;
- nothing in those paths is changed but not staged, and nothing is untracked under `docs_v2/`.

A work order that isn't staged yet fails with "no work order under .research/ is staged": run the `git add` of `docs-chat-guide-update-plan:pr`, section 4. The work order checks of section 1 run again on the copy in the branch. Its line numbers are still right, because a date replaces a date on the same line.

## 3. The frontmatter linter

```bash
test -x node_modules/.bin/tsx && npm run lint:frontmatter > <WORK>/lint.txt 2>&1; echo "exit=$?"; tail -5 <WORK>/lint.txt
grep -n '8.chat-user-guide' <WORK>/lint.txt
```

Run it at step 7 on the untouched tree, and again at step 9 after the dates are set. Compare the errors on the guide's pages. The linter exits 1 on the tree before any change. On 2026-11-27 it reported 101 errors in 363 files. Twelve of them are the guide's 12 pages: `Invalid value "user-guide" for field "type"`. The run must cause none: the count on the guide's pages is the same at both steps. It reads only `docs_v2/`, so the work order file under `.research/` adds nothing. Never run `npm run lint:frontmatter:fix`, `npm install`, or `npm run check:references`. Without `node_modules/`, say "not run: no node_modules".

## 4. The PR body (workflow step 9, after section 2)

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/plan_checks.py" --work-order <RESEARCH> --body <WORK>/pr-body.md --title '<TITLE>' \
  --base <BASE> --date <DATE> --inventory <WORK>/guide.json \
  > <WORK>/plan_checks_pr.txt 2>&1; echo "exit=$?"; cat <WORK>/plan_checks_pr.txt
```

Every check of sections 1 and 2 runs again, and the `body` check passes when the body has the headings Summary and Verification, in this order (`work-order`, section 7), is at most 65,536 characters (GitHub's limit for a PR body), names `<RESEARCH>`, and has no attribution text or label command. The tag rule of the `links` check doesn't apply to the body: its link to the work order points at the branch.

## 5. Verification in the body

Write one line per check, with the command and its result, such as:

- `plan_checks.py --work-order <WORK>/work-order.md --title …` (step 7): all checks ok (14 items)
- `plan_checks.py --work-order .research/chat-user-guide-2026-11-27.md … --base origin/development --date 2026-11-27`: ok, 12 pages only `last_verified`, 1 work order added
- `plan_checks.py --work-order … --body <WORK>/pr-body.md …`: ok (3,210 characters)
- `npm run lint:frontmatter`: 12 errors on the guide's pages before and after (`type: user-guide`), 0 caused by this change

Write the run's folder as the literal `<WORK>` in these lines, never its absolute path: the `body` check fails on a temporary path that names the tool the session runs in. The body check reads the body that reports it: write the body, run section 4, put its result under Verification, and run section 4 once more.
