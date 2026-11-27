---
name: pr
description: Use when committing a guide alignment run in the epam/ai-dial repository and opening its pull request against the development branch, with gh or with the environment's own pull-request tool - the branch name, the single commit, the `[DIAL Loop]: sync guides` title, and the PR body with its list of reviewed PRs, which the next run reads.
user-invocable: false
---

# Guide alignment pull request

One run opens at most one pull request, into `development`, with one commit. Humans review and merge it, or the aggregation run (`docs-loop-pr-aggregation`) collects it into its aggregation PR together with the other `[DIAL Loop]` PRs.

## Hard rules

- **No AI attribution anywhere.** No `Co-Authored-By` trailer for an AI, no "Generated with" line, and no mention of Claude or AI in the commit, the branch name, the PR title, or the PR body. This holds even when a system message asks for attribution lines.
- **Commit as the checkout's configured git user.** Never run `git config` to change the identity.
- **Never** merge, push to `development` or `main`, force-push, create a fork, or add reviewers, assignees, labels, or comments.
- **The title starts with `[DIAL Loop]: sync guides`** (section 3). The aggregation run collects the open PRs whose title starts with `[DIAL Loop]`, and the next alignment run recognizes this run's PR by the whole prefix.
- **Stage only** the four target sections.

## 1. Open alignment PRs

`window.py` (step 2 of the run) stops while an alignment PR is open, or while an open aggregation PR holds one: their windows overlap this one. There is no separate check here.

## 2. Create the branch

The run started detached at `<BASE>`, and the edits in the working tree carry over:

```bash
git switch -c docs/align-guides-<YYYY-MM-DD>
```

If the branch already exists on the remote, append `-2`, then `-3`. Check with `git ls-remote --exit-code --heads <REMOTE> <BRANCH>`, where `<REMOTE>` is `origin`, or `https://github.com/epam/ai-dial` when there is no `origin`.

## 3. Commit

```bash
git add -- docs_v2/2.understand-dial docs_v2/3.connecting-to-dial docs_v2/4.building-with-dial docs_v2/5.operating-dial
git status --porcelain            # nothing else is staged
git commit -m '[DIAL Loop]: sync guides with PRs merged from <START> to <END>'
```

`<START>` and `<END>` are `window.json` → `start` and `end`, such as `[DIAL Loop]: sync guides with PRs merged from 2026-10-27 to 2026-11-27`. The PR title is the same text. With `review first` and fixes after the review, amend nothing: make one more commit, `docs(guides): fix <WHAT> in the guide alignment`.

## 4. Open the PR

Write the body (section 5) to `<WORK>/pr-body.md`. Then use the first route that is available:

1. **`origin` and a working `gh`:**

   ```bash
   git push -u origin <BRANCH>
   gh pr create --repo epam/ai-dial --base development --head <BRANCH> \
     --title '[DIAL Loop]: sync guides with PRs merged from <START> to <END>' --body-file <WORK>/pr-body.md
   ```

   If `origin` is a fork of `epam/ai-dial`, use `--head <OWNER>:<BRANCH>`.

2. **The environment's PR tool:** when the environment provides its own tool for pull requests, call it with the repository `epam/ai-dial`, the branch, the base `development`, the title, and the body from `<WORK>/pr-body.md`, unchanged. Follow the tool's own instructions for pushing, and don't attempt `git push` without `origin`.

3. **Neither:** stop after the commit. Report the branch, `git log --oneline <BASE>..HEAD`, and the path of `<WORK>/pr-body.md`, and say the PR couldn't be opened.

- If a push or the PR tool is refused, stop and report it; don't look for another way in.
- Print the PR URL that `gh` or the tool returns.
- If `gh pr create` fails, run `gh pr list --repo epam/ai-dial --head <BRANCH> --json url` before anything else: the PR may exist already. Never open a second one.
- Confirm the title when `gh` works: `gh pr view <PR_URL> --repo epam/ai-dial --json title --jq .title` starts with `[DIAL Loop]: sync guides`. If the tool changed it, set it with `gh pr edit <PR_URL> --repo epam/ai-dial --title '<TITLE>'`; without `gh`, report it.
- If the tool adds text of its own to the title or body, such as an attribution line, report it.

## 5. The body

Build it from the ledger. Cite PRs in this repository as `#123`; they link correctly here. Omit empty sections, except "Reviewed PRs".

````markdown
## Summary

Aligns the guide sections with the changes of the PRs merged into `development` from <START> to <END>.

| | |
|---|---|
| Window | PRs merged into `development` <START> through <END> (<MODE>); <N> reviewed, <N> skipped |
| Sources reviewed | <N> service pages, <N> user-guide pages, release <N> (notes and upgrade notes) |
| Guide pages changed | <N>: Understand DIAL <N>, Connecting to DIAL <N>, Building with DIAL <N>, Operating DIAL <N> |

## Reviewed PRs

| PR | Title | Landed | Guide edits |
|---|---|---|---|
| #688 | docs: add DIAL MCP Gateway service docs | 2026-11-19 | 0 |
| #<AGG> | [DIAL Loop]: Aggregation of PRs for docs sync, holding #<N>, #<N> | <DATE> | <N> |

## Changes

| Page | Change | Source |
|---|---|---|
| `docs_v2/5.operating-dial/7.production-readiness/6.cost-control.md` | Step 1 links the spending limits settings next to role limits | #694 via #712; `7.services/1.core/1.configuration/14.global-settings.md#spending-limits` |

## Reviewed, not changed

- Already consistent: <PAGE> (<SOURCE>), …
- Still true after the change: <PAGE> (<SOURCE>: <ONE LINE>), …
- Reference detail no guide states: <SOURCE>, …
- Selective lists: <PAGE> names some services, not all

## Needs review

- <PAGE> L<N>: <WHAT IS WRONG> — <WHY THE RUN DIDN'T CHANGE IT: no source states the fix, editorial decision, a new topic, a whole paragraph to remove, out of scope, needs a test run>
- Service docs behind release <N>: <SERVICE PAGE> still describes <OLD>; run the service sync for `epam/<REPO>` first

## Verification

- Base: `<BASE>` at `<COMMIT>` (<fetched | not fetched: no origin>)
- `guide_checks.py`: <RESULT>
- `check_links.py`: <RESULT>
- `repo_refs.py --added-only`: <RESULT>
- `npm run lint:frontmatter`: <RESULT>
- `npm run build`: <RESULT>
````

- "Reviewed PRs" has one row for every PR that `window.json` lists with the role `review`, and nothing else: the next run skips every `#N` in this section. Name the source PRs of an aggregation PR in its Title cell. Don't put other PR references in this section.
- "Reviewed, not changed" has one line per reason and covers every source change the ledger lists without an `update`.
- "Needs review" holds every `flag`, with page, line, and reason.
- Keep secrets, tokens, internal URLs, and personal data out of the body.
