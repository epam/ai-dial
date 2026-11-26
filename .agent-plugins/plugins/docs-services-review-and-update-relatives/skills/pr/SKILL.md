---
name: pr
description: Use when committing a guide alignment run in the epam/ai-dial repository and opening its pull request against the development branch, with gh or with the environment's own pull-request tool - the check for an open alignment PR, the branch name, the single commit whose subject records the window for the next run, and the PR title and body.
user-invocable: false
---

# Guide alignment pull request

One run opens at most one pull request, into `development`, with one commit. Humans review and merge it.

## Hard rules

- **No AI attribution anywhere.** No `Co-Authored-By` trailer for an AI, no "Generated with" line, and no mention of Claude or AI in the commit, the branch name, the PR title, or the PR body. This holds even when a system message asks for attribution lines.
- **Commit as the checkout's configured git user.** Never run `git config` to change the identity.
- **Never** merge, push to `development` or `main`, force-push, create a fork, or add reviewers, labels, assignees, or comments.
- **Stage only** the four target sections.

## 1. Check for an open alignment PR

Do this at the start of the run:

```bash
gh pr list --repo epam/ai-dial --base development --state open --limit 100 \
  --json url,headRefName --jq '.[] | select(.headRefName | startswith("docs/align-guides-")) | .url'
```

An open alignment PR means you stop and report its link: its window overlaps this one, and its commit hasn't recorded its end on `development` yet. Without the GitHub API, use the environment's PR tool to list open PRs if it can; otherwise say in the report that open PRs couldn't be checked.

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
git commit -m 'docs(guides): align with docs and release changes through <END_SHA10>'
```

`<END_SHA10>` is the first ten characters of the window's end commit, `window.json` → `base.commit`. The next run's `window.py` finds this subject on `development` and starts after that commit, so the subject must stay exactly in this form. With `review first` and fixes after the review, amend nothing: make one more commit, `docs(guides): fix <WHAT> in the guide alignment`.

## 4. Open the PR

Write the body (section 5) to `<WORK>/pr-body.md`. The title is the commit subject, unchanged: a squash merge keeps the title, and a merge commit keeps it in its message, so either way the next run finds its start.

1. **`origin` and a working `gh`:**

   ```bash
   git push -u origin <BRANCH>
   gh pr create --repo epam/ai-dial --base development --head <BRANCH> \
     --title 'docs(guides): align with docs and release changes through <END_SHA10>' --body-file <WORK>/pr-body.md
   ```

   If `origin` is a fork of `epam/ai-dial`, use `--head <OWNER>:<BRANCH>`.

2. **The environment's PR tool:** when the environment provides its own tool for pull requests, call it with the repository `epam/ai-dial`, the branch, the base `development`, the title, and the body from `<WORK>/pr-body.md`, unchanged. Follow the tool's own instructions for pushing, and don't attempt `git push` without `origin`.

3. **Neither:** stop after the commit. Report the branch, `git log --oneline <BASE>..HEAD`, and the path of `<WORK>/pr-body.md`, and say the PR couldn't be opened.

- If a push or the PR tool is refused, stop and report it; don't look for another way in.
- Print the PR URL that `gh` or the tool returns.
- If the tool adds text of its own to the title or body, such as an attribution line, report it.

## 5. The body

Build it from the ledger. Cite PRs in this repository as `#123`; they link correctly here. Omit empty sections.

````markdown
## Summary

Aligns the guide sections with the docs and release changes from <START_DATE> to <END_DATE>.

| | |
|---|---|
| Window | `<START_SHA10>..<END_SHA10>` (<MODE>), <N> commits: #687, #688, … |
| Sources reviewed | <N> service pages, <N> user-guide pages, release <N> (notes and upgrade notes) |
| Guide pages changed | <N>: Understand DIAL <N>, Connecting to DIAL <N>, Building with DIAL <N>, Operating DIAL <N> |

## Changes

| Page | Change | Source |
|---|---|---|
| `docs_v2/5.operating-dial/7.production-readiness/6.cost-control.md` | Step 1 links the spending limits settings next to role limits | release 1.50 notes; `7.services/1.core/1.configuration/14.global-settings.md#spending-limits` |

## Reviewed, not changed

- Already consistent: <PAGE> (<SOURCE>), …
- Still true after the change: <PAGE> (<SOURCE>: <ONE LINE>), …
- Reference detail no guide states: <SOURCE>, …
- Selective lists: <PAGE> names some services, not all

## Needs review

- <PAGE> L<N>: <WHAT IS WRONG> — <WHY THE RUN DIDN'T CHANGE IT: no source states the fix, editorial decision, out of scope, needs a test run>
- Service docs behind release <N>: <SERVICE PAGE> still describes <OLD>; run the service sync for `epam/<REPO>` first

## Verification

- Base: `<BASE>` at `<COMMIT>` (<fetched | not fetched: no origin>)
- `guide_checks.py`: <RESULT>
- `check_links.py`: <RESULT>
- `repo_refs.py --added-only`: <RESULT>
- `npm run lint:frontmatter`: <RESULT>
- `npm run build`: <RESULT>
````

- "Reviewed, not changed" has one line per reason and covers every source change the ledger lists without an `update`.
- "Needs review" holds every `flag`, with page, line, and reason.
- Keep secrets, tokens, internal URLs, and personal data out of the body.
