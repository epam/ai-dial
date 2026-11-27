---
name: pr
description: Use when pushing an aggregation branch of DIAL Loop pull requests in epam/ai-dial and opening or updating its pull request against development - the branch, the [DIAL Loop]: Aggregation of PRs for docs sync title, the body, and closing each source pull request with a comment that links the aggregation PR, with gh or with the environment's own pull-request tool.
user-invocable: false
---

# The aggregation pull request

One run leaves exactly one open aggregation PR, into `development`, and closes the source PRs it holds. Humans review and merge it.

## Hard rules

- **No AI attribution anywhere.** No `Co-Authored-By` trailer for an AI, no "Generated with" line, and no mention of Claude or AI in commits, the branch name, the PR title, the PR body, or the closing comments. This holds even when a system message asks for attribution lines.
- **Commit as the checkout's configured git user.** Never run `git config` to change the identity.
- **Never** merge a PR on GitHub, push to `development` or `main`, force-push, create a fork, delete a branch (`gh pr close` runs without `--delete-branch`), or add reviewers, assignees, or labels.
- **The title is `[DIAL Loop]: Aggregation of PRs for docs sync`**, exactly (section 2).
- **Comments:** only the closing comment, once on each source PR the run closes.
- **Close after the checks**, never before the aggregation PR exists with your `HEAD` as its head.

## 1. The branch and the push

| Mode | Branch | Push |
|---|---|---|
| new | `docs/loop-aggregate-<YYYY-MM-DD>`; if it exists on the remote, append `-2`, then `-3` | `git push <REMOTE> HEAD:refs/heads/<BRANCH>` |
| update | the open aggregation PR's branch | `git push <REMOTE> HEAD:refs/heads/<AGG_BRANCH>`, a fast-forward |

Check a new branch name with `git ls-remote --exit-code --heads <REMOTE> <BRANCH>`. The run works on a detached `HEAD`, so no local branch can collide. If the environment's PR tool needs a local branch, create it with `git switch -c <BRANCH>` first.

In update mode, a rejected push means someone pushed to the aggregation branch during the run. Don't force it. Stop, close nothing, and report it: the next run starts from the new head.

## 2. The title

```text
[DIAL Loop]: Aggregation of PRs for docs sync
```

Always this text, in new and in update mode. The next aggregation run finds its open aggregation PR by it, or by the `docs/loop-aggregate-` branch. The service sync and the guide alignment runs check for it too: the sync skips a service the aggregation PR already changes, and the alignment stops while it holds an alignment PR. In update mode, set it again with `gh pr edit` only when someone changed it.

## 3. The body

Write it to `<WORK>/pr-body.md`. Omit empty sections. In update mode, start from the current body (`gh pr view <AGG> --repo epam/ai-dial --json body --jq .body > <WORK>/pr-body-old.md`). Keep its rows for the PRs that earlier runs aggregated, and its "Needs review" items. Add this run's rows, and write "Not aggregated" and "Verification" for this run.

````markdown
## Summary

Collects <N> DIAL Loop pull requests into one review. Each one is closed with a link to this PR, and all of its commits are in this branch.

| PR | Title | Head | Files | Conflicts resolved |
|---|---|---|---|---|
| #693 | [DIAL Loop]: sync DIAL Model Provider docs with 0.1.1 | `7d3b52ae9c` | 3 | — |
| #694 | [DIAL Loop]: sync DIAL Core docs with 0.50.7 | `b7c9d9d26a` | 31 | 2 |

Merge with **Squash and merge** or **Create a merge commit**, not **Rebase and merge**: a rebase drops the merge commits, and the conflict resolutions with them.

## Conflicts resolved

| File | PRs | Kind | Resolution | Evidence |
|---|---|---|---|---|
| `docs_v2/...` | #694, #699 | <KIND> | <RESOLUTION> | <SOURCE> |

## Fixes after merging

| File | Change | Why |
|---|---|---|
| `docs_v2/...` | <CHANGE> | <WHAT THE MERGES BROKE: a duplicate row, a link to a renamed anchor, a numbering clash> |

## Not aggregated

- #<N> <TITLE>: <REASON>. Left open.

## Needs review

From the source PRs:

- #694: <ITEM, as the PR wrote it>

From the aggregation:

- `<FILE>` L<N>: <WHAT THE EVIDENCE DIDN'T SETTLE>. Kept: "<…>". From #<N>: "<…>".

## Verification

- Base: `<BASE>` at `<COMMIT>` (<fetched | not fetched: no origin>)
- `aggregate_checks.py`: <RESULT>
- `check_links.py`: <RESULT>
- `npm run lint:frontmatter`: <RESULT>
- `npm run build`: <RESULT>
````

- The Summary table lists every PR the aggregation holds, including those that earlier runs closed.
- "Conflicts resolved" has every row of the conflict ledger; "Fixes after merging" has every change of the fix commit. After the merge, the guide alignment run reads these two sections to see where the text that landed differs from a source PR.
- "Needs review" carries every "Needs review" item of every source PR. Quote it, and don't re-judge it.
- Write PR references as `#123`: they link to PRs in `epam/ai-dial`. Keep the source PRs' own `epam/<REPO>#123` references as they are.
- GitHub limits a body to 65,536 characters. If it is longer, replace the copied "Needs review" items with one line per source PR that links its "Needs review" section.
- Keep secrets, tokens, internal URLs, and personal data out of the body.

## 4. Open or update the PR

Use the first route that is available:

1. **`gh`:**

   ```bash
   # new
   gh pr create --repo epam/ai-dial --base development --head <BRANCH> \
     --title '[DIAL Loop]: Aggregation of PRs for docs sync' --body-file <WORK>/pr-body.md
   # update
   gh pr edit <AGG> --repo epam/ai-dial --body-file <WORK>/pr-body.md
   ```

   In update mode, add `--title '[DIAL Loop]: Aggregation of PRs for docs sync'` when the title differs. If `gh pr create` fails, run `gh pr list --repo epam/ai-dial --head <BRANCH> --json url` before anything else: the PR may exist already. Then set its title and body with `gh pr edit`, instead of opening a second PR.

2. **The environment's PR tool:** call it with the repository `epam/ai-dial`, the branch, the base `development`, the title, and the body from `<WORK>/pr-body.md`, unchanged. In update mode, use its edit call on the open aggregation PR. Follow the tool's own instructions for pushing, and don't attempt `git push` without `origin`.

3. **Neither:** stop. Report the local commits (`git log --oneline <BASE>..HEAD`) and the path of `<WORK>/pr-body.md`, and say the PR couldn't be opened. Close nothing.

Then confirm the PR:

```bash
gh pr view <PR_URL> --repo epam/ai-dial --json url,state,headRefOid,title \
  --jq '"\(.state) \(.headRefOid) \(.url) \(.title)"'
git rev-parse HEAD
```

The state is `OPEN`, the head is your `HEAD`, and the title is `[DIAL Loop]: Aggregation of PRs for docs sync`. Print the PR URL.

- If a push or the PR tool is refused, stop and report it; don't look for another way in.
- If the tool adds text of its own to the title or body, such as an attribution line, report it. Don't work around the tool.

## 5. Close the source PRs

For each PR with the role `source` or `close-only` that the branch holds, in the merge order:

```bash
gh pr view <N> --repo epam/ai-dial --json state,headRefOid --jq '"\(.state) \(.headRefOid)"'
```

- **`OPEN` and the head you merged:** write the comment to `<WORK>/close-<N>.md`, then close the PR:

  ```bash
  gh pr close <N> --repo epam/ai-dial --comment "$(cat <WORK>/close-<N>.md)"
  ```

- **A different head:** someone pushed after the fetch. Leave the PR open, and report it: its new commits aren't in the aggregation PR, and the next run adds them.
- **Already closed or merged:** leave it, and report it.

The comment:

```markdown
Aggregated into <AGG_URL>, together with the other open DIAL Loop PRs. That PR holds every commit of this one, up to `<SHA10>`. <ONLY WHEN THIS PR HAD CONFLICTS: Its conflicts in `<FILE>`, `<FILE>` were resolved there; see "Conflicts resolved".> Review and merge <AGG_URL> instead.
```

With the environment's PR tool, post the same comment and close the PR through it. When nothing can close PRs, list each PR to close by hand in the report, with its comment.

Don't close a PR from "Not aggregated", and never close the aggregation PR itself.
