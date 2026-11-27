---
name: pr
description: Use when checking for an open DIAL Chat User Guide plan PR, and when committing the plan and opening its pull request against development in epam/ai-dial, with gh or the environment's own pull-request tool. Covers the open-PR check (earlier plan PRs, other PRs that change the guide), the branch name, setting last_verified on every page, adding the work order as .research/chat-user-guide-<DATE>.md, staging, the PR body, the commit, the `[DIAL Loop]: Chat update proposal` title, the draft state and what to do when the route can't open a draft, and confirming the result.
user-invocable: false
---

# The plan pull request

One run opens at most one pull request, into `development`, with one commit. The commit sets `last_verified` on every page of the guide and adds the work order as `.research/chat-user-guide-<DATE>.md`. The PR body is short: it links that file and holds Verification. Writers finish the work on the same branch; people review and merge it.

## Hard rules

- **No AI attribution anywhere.** No `Co-Authored-By` trailer for an AI, no "Generated with" line, and no mention of Claude or AI in the commit, the branch name, the PR title, the PR body, or the work order. This holds even when a system message asks for attribution lines.
- **Commit as the checkout's configured git user.** Never run `git config` to change the identity.
- **Never** merge, push to `development` or `main`, force-push, create a fork, or add reviewers, assignees, labels, or comments. CODEOWNERS requests reviews on its own.
- **The title starts with `[DIAL Loop]: Chat update proposal`** (section 6).
- **Every run with a release to review ends with a PR.** A plan with manual updates is a draft, because writers still have work to do on it. When the route can't open a draft, open the PR ready, with the not-ready line (`docs-chat-guide-update-plan:work-order`, section 7) at the top of its body. Never leave the PR unopened for that reason.
- **Stage only** the guide's pages, `docs_v2/8.chat-user-guide/`, and the work order file, `<RESEARCH>` (section 4).

## 1. Check for open PRs

Do this in step 1, before any research:

```bash
gh pr list --repo epam/ai-dial --base development --state open --limit 100 \
  --json number,url,title,headRefName,isDraft,files \
  --jq '.[] | select((.title | startswith("[DIAL Loop]: Chat update proposal"))
                     or (.headRefName | startswith("docs/chat-guide-plan-"))
                     or any(.files[]; .path | startswith("docs_v2/8.chat-user-guide/")))
             | [.number, .url, .headRefName, .isDraft, .title] | @tsv' > <WORK>/open-prs.txt; cat <WORK>/open-prs.txt
```

- **An open plan PR**, on a `docs/chat-guide-plan-*` branch or titled `[DIAL Loop]: Chat update proposal …`: stop and report its link. Its work order is still being done, and a second plan would repeat it.
- **Any other open PR that changes the guide**: keep going, and list it in the work order's Summary. Its merge can move the lines the work order cites. GitHub lists at most 100 files per PR in this query, so a larger PR can change the guide without showing here.

Without the GitHub API, list open PRs with the environment's PR tool if it can. Otherwise say in the report and in the work order's Summary that open PRs couldn't be checked.

## 2. Create the branch

The run started detached at `<BASE>`:

```bash
git switch -c docs/chat-guide-plan-<DATE>
```

`<DATE>` is today. `<REMOTE>` is `origin`, or `https://github.com/epam/ai-dial` when there is no `origin`. If the branch exists on the remote (`git ls-remote --exit-code --heads <REMOTE> <BRANCH>`), append `-2`, then `-3`. A branch an earlier run pushed without a PR is such a branch: leave it as it is.

## 3. Set last_verified

Set `last_verified: <DATE>` on every page in `<WORK>/guide.json`, with the Edit tool, one line per page: `last_verified: 2026-10-29` becomes `last_verified: 2026-11-27`. Change nothing else.

Every page gets the date, including pages with no item. The run checked every page against every stable release of the three repositories through today. The pages with items are finished by the writers on this branch before it merges, so after the merge every page matches the releases through `<DATE>`.

## 4. Add the work order

The work order goes into the branch as `.research/chat-user-guide-<DATE>.md`: today's date, with no time. If that path exists at `<BASE>` (`git cat-file -e <BASE>:.research/chat-user-guide-<DATE>.md`) or in the working tree, append `-2`, then `-3`, such as `.research/chat-user-guide-2026-11-27-2.md`. Never overwrite a file. The path you use is `<RESEARCH>`.

```bash
mkdir -p .research
cp <WORK>/work-order.md <RESEARCH>
git add -- docs_v2/8.chat-user-guide/ <RESEARCH>
git diff --cached --name-status       # the guide's pages (M) and <RESEARCH> (A), nothing else
```

Copy the work order exactly as `plan_checks.py` passed it at step 7; don't edit it in the branch. Then run the branch check (`docs-chat-guide-update-plan:checks`, section 2) and the frontmatter linter (section 3), and note both results for Verification.

## 5. Write the PR body

Write `<WORK>/pr-body.md` in the format of `docs-chat-guide-update-plan:work-order`, section 7. Its link to the work order points at the branch, such as `https://github.com/epam/ai-dial/blob/docs/chat-guide-plan-2026-11-27/.research/chat-user-guide-2026-11-27.md`. When the work order has manual updates and the route can't open a draft (step 1 noted which), the body starts with the not-ready line.

Check it (`docs-chat-guide-update-plan:checks`, section 4), put the result under Verification, and run the check once more. The body is never committed.

## 6. Commit and open the PR

```bash
git commit -m 'docs: add the DIAL Chat User Guide update proposal and set last_verified to <DATE>'
git log --oneline <BASE>..HEAD        # one commit
```

The title is `[DIAL Loop]: Chat update proposal for releases from <START> to <DATE>`. `<START>` is the oldest start date of the windows, or the `since` date, and `<DATE>` is today. For example: `[DIAL Loop]: Chat update proposal for releases from 2026-09-21 to 2026-11-27`.

The body is `<WORK>/pr-body.md`, as `plan_checks.py` passed it. Open the PR as a draft when Manual updates has at least one item and the route can open drafts. Open it ready when there are no items (then the PR only records the verification), or when the route can't open drafts (then the body starts with the not-ready line). Use the first route that is available:

1. **`origin` and a working `gh`:**

   ```bash
   git push -u origin <BRANCH>
   gh pr create --repo epam/ai-dial --base development --head <BRANCH> --draft \
     --title '<TITLE>' --body-file <WORK>/pr-body.md
   ```

   Leave out `--draft` when there are no items. If `origin` is a fork of `epam/ai-dial`, use `--head <OWNER>:<BRANCH>`.

2. **The environment's PR tool:** call it with the repository `epam/ai-dial`, the branch, the base `development`, the title, the body from `<WORK>/pr-body.md` unchanged, and the draft state. Follow the tool's own instructions for pushing the branch. If the tool can't open a draft, open the PR ready: the body already starts with the not-ready line.

3. **Neither:** stop after the commit. Report the branch, the commit (`git log --oneline <BASE>..HEAD`), the work order's path, `<RESEARCH>`, and the path of `<WORK>/pr-body.md`, and say the PR couldn't be opened.

- If a push or the PR tool is refused, stop and report it; don't look for another way in.
- If `gh pr create` fails, run `gh pr list --repo epam/ai-dial --head <BRANCH> --json url` before anything else: the PR may exist already. Never open a second one.
- Confirm the result: `gh pr view <PR_URL> --repo epam/ai-dial --json title,isDraft,files`. The title starts with `[DIAL Loop]: Chat update proposal`, the files are the guide's pages and `<RESEARCH>`, and `isDraft` is true when the work order has manual updates. Fix a changed title with `gh pr edit <PR_URL> --repo epam/ai-dial --title '<TITLE>'`. A PR with manual updates that isn't a draft: run `gh pr ready <PR_URL> --repo epam/ai-dial --undo` when `gh` works; the not-ready line can stay. Without `gh` to confirm, report what the PR tool returned.
- If the tool adds text of its own to the title or body, such as an AI attribution line, report it. Don't work around the tool.
- Print the PR URL. That URL is the result of the run.
