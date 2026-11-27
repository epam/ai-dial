---
name: pr
description: Use when checking for an open DIAL Chat User Guide plan PR, and when committing the plan and opening its pull request against development in epam/ai-dial, with gh or the environment's own pull-request tool. Covers the open-PR check (plan PRs, the aggregation PR, other PRs that change the guide), the branch name, setting last_verified on every page, the commit, the draft PR, the `[DIAL Loop]: plan` title, and confirming the result.
user-invocable: false
---

# The plan pull request

One run opens at most one pull request, into `development`, with one commit that sets `last_verified` on every page of the guide, and the work order as its body. Writers finish it on the same branch; people review and merge it.

## Hard rules

- **No AI attribution anywhere.** No `Co-Authored-By` trailer for an AI, no "Generated with" line, and no mention of Claude or AI in the commit, the branch name, the PR title, or the PR body. This holds even when a system message asks for attribution lines.
- **Commit as the checkout's configured git user.** Never run `git config` to change the identity.
- **Never** merge, push to `development` or `main`, force-push, create a fork, or add reviewers, assignees, labels, or comments. CODEOWNERS requests reviews on its own.
- **The title starts with `[DIAL Loop]: plan `** (section 4). The aggregation run (`docs-loop-pr-aggregation`) collects open `[DIAL Loop]` PRs, and skips drafts.
- **A plan with manual updates is a draft.** Writers still have work to do on it, and the draft state keeps the aggregation run from collecting it before they finish.
- **Stage only** the guide's pages, `docs_v2/8.chat-user-guide/`.

## 1. Check for open PRs

Do this in step 1, before any research:

```bash
gh pr list --repo epam/ai-dial --base development --state open --limit 100 \
  --json number,url,title,headRefName,isDraft,files \
  --jq '.[] | select((.title | startswith("[DIAL Loop]")) or any(.files[]; .path | startswith("docs_v2/8.chat-user-guide/")))
             | [.number, .url, .headRefName, .isDraft, .title] | @tsv' > <WORK>/open-prs.txt; cat <WORK>/open-prs.txt
```

- **An open plan PR**, on a `docs/chat-guide-plan-*` branch or titled `[DIAL Loop]: plan DIAL Chat User Guide updates …`: stop and report its link. Its work order is still being done, and a second plan would repeat it.
- **The open aggregation PR** (`[DIAL Loop]: Aggregation of PRs for docs sync`, on a `docs/loop-aggregate-*` branch): it may hold a finished plan PR, closed into it, whose dates haven't reached `development` yet. GitHub lists at most 100 files per PR in this query, so check it with git, where `<PR>` is its number:

  ```bash
  git fetch <REMOTE> +refs/pull/<PR>/head:refs/loop/pr-<PR>
  git diff --name-only <BASE>...refs/loop/pr-<PR> -- docs_v2/8.chat-user-guide/
  ```

  If it changes the guide, stop and report its link.
- **Any other open PR that changes the guide**: keep going, and list it in the Summary. Its merge can move the lines the work order cites.

`<REMOTE>` is `origin`, or `https://github.com/epam/ai-dial` when there is no `origin`. Without the GitHub API, list open PRs with the environment's PR tool if it can. Otherwise say in the report and in the Summary that open PRs couldn't be checked.

## 2. Create the branch

The run started detached at `<BASE>`:

```bash
git switch -c docs/chat-guide-plan-<DATE>
```

`<DATE>` is today. If the branch exists on the remote (`git ls-remote --exit-code --heads <REMOTE> <BRANCH>`), append `-2`, then `-3`.

## 3. Set last_verified

Set `last_verified: <DATE>` on every page in `<WORK>/guide.json`, with the Edit tool, one line per page: `last_verified: 2026-10-29` becomes `last_verified: 2026-11-27`. Change nothing else.

Every page gets the date, including pages with no item. The run checked every page against every stable release of the three repositories through today. The pages with items are finished by the writers on this branch before it merges, so after the merge every page matches the releases through `<DATE>`.

Then run the branch check (`docs-chat-guide-update-plan:checks`, section 2) and the frontmatter linter, and put their results under Verification.

## 4. Commit and open the PR

```bash
git add -- docs_v2/8.chat-user-guide/
git status --porcelain            # only the guide's pages are staged
git commit -m 'docs: set last_verified of the DIAL Chat User Guide to <DATE>'
```

The title is `[DIAL Loop]: plan DIAL Chat User Guide updates for releases from <START> to <DATE>`. `<START>` is the oldest start date of the windows, or the `since` date, and `<DATE>` is today. For example: `[DIAL Loop]: plan DIAL Chat User Guide updates for releases from 2026-09-21 to 2026-11-27`.

The body is `<WORK>/pr-body.md`, as `plan_checks.py` passed it. Open the PR as a draft when Manual updates has at least one item, and as a ready PR when it has none: then the PR only records the verification. Use the first route that is available:

1. **`origin` and a working `gh`:**

   ```bash
   git push -u origin <BRANCH>
   gh pr create --repo epam/ai-dial --base development --head <BRANCH> --draft \
     --title '<TITLE>' --body-file <WORK>/pr-body.md
   ```

   Leave out `--draft` when there are no items. If `origin` is a fork of `epam/ai-dial`, use `--head <OWNER>:<BRANCH>`.

2. **The environment's PR tool:** call it with the repository `epam/ai-dial`, the branch, the base `development`, the title, the body from `<WORK>/pr-body.md` unchanged, and the draft state. Follow the tool's own instructions for pushing the branch. If the tool can't open a draft and the plan has items, push the branch but don't open the PR. Report the branch and the path of the body, so a person opens the draft.

3. **Neither:** stop after the commit. Report the branch, the commit (`git log --oneline <BASE>..HEAD`), and the path of `<WORK>/pr-body.md`, and say the PR couldn't be opened.

- If a push or the PR tool is refused, stop and report it; don't look for another way in.
- If `gh pr create` fails, run `gh pr list --repo epam/ai-dial --head <BRANCH> --json url` before anything else: the PR may exist already. Never open a second one.
- Confirm the result: `gh pr view <PR_URL> --repo epam/ai-dial --json title,isDraft`. The title starts with `[DIAL Loop]: plan `, and `isDraft` matches the plan. Fix a changed title with `gh pr edit <PR_URL> --repo epam/ai-dial --title '<TITLE>'`. A PR that should be a draft and isn't: run `gh pr ready <PR_URL> --repo epam/ai-dial --undo`.
- If the tool adds text of its own to the title or body, such as an AI attribution line, report it. Don't work around the tool.
- Print the PR URL. That URL is the result of the run.
