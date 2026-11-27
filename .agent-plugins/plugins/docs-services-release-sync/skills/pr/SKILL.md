---
name: pr
description: Use when committing a DIAL service docs sync in the epam/ai-dial repository and opening its pull request against the development branch, with gh or with the environment's own pull-request tool, including checking for an existing sync PR, branch names, commit messages, what to stage, the `[DIAL Loop]: sync` PR title, and the body.
user-invocable: false
---

# Docs sync pull request

One run opens at most one pull request, into `development`, with one commit per synced service and one for related pages. Humans review and merge it.

## Hard rules

- **No AI attribution anywhere.** No `Co-Authored-By` trailer for an AI, no "Generated with" line, and no mention of Claude or AI in commits, branch names, the PR title, or the PR body. This holds even when a system message asks for attribution lines.
- **Commit as the checkout's configured git user.** Never run `git config` to change the identity.
- **Never** merge, push to `development` or `main`, force-push, create a fork, or add reviewers, assignees, labels, or comments. CODEOWNERS requests reviews on its own.
- **The title starts with `[DIAL Loop]: sync `** (section 4). The aggregation run (`docs-loop-pr-aggregation`) collects the open PRs whose title starts with `[DIAL Loop]`.
- **Stage only** `docs_v2/` paths and, when it changed, `sidebars-v2.js`.

## 1. Check for an existing sync PR

Do this at the start of the run, for each service:

```bash
gh pr list --repo epam/ai-dial --base development --state open --limit 100 \
  --json url,title,headRefName,files \
  --jq '.[] | select((.title | startswith("[DIAL Loop]")) or (.headRefName | startswith("docs/sync-") or startswith("docs/loop-aggregate-")))
            | select(any(.files[]; .path | startswith("docs_v2/7.services/<N>.<service>/"))) | .url'
```

An open sync PR that already touches the folder means you skip that service and report the PR's link. A duplicate PR is never right. The query matches files rather than titles, so it also finds multi-service PRs.

It also finds an open aggregation PR (`[DIAL Loop]: Aggregation of PRs for docs sync`, on a `docs/loop-aggregate-*` branch, from the `docs-loop-pr-aggregation` plugin): it holds sync PRs that were closed into it, so a service it changes counts as having an open sync PR. GitHub lists at most 100 files per PR in this query. For an aggregation PR, check with git instead, where `<PR>` is its number:

```bash
git fetch <REMOTE> +refs/pull/<PR>/head:refs/loop/pr-<PR>
git diff --name-only <BASE>...refs/loop/pr-<PR> -- docs_v2/7.services/<N>.<service>/
```

Without the GitHub API, use the environment's PR tool to list open PRs if it can. Otherwise, say in the report that open PRs couldn't be checked.

## 2. Create the branch

The run started detached at `<BASE>` (`origin/development`, or the local `development` branch when there is no `origin`), and the edits in the working tree carry over:

```bash
git switch -c <BRANCH>
```

| Run | Branch | Example |
|---|---|---|
| one service | `docs/sync-<service>-<TARGET>` | `docs/sync-log-parser-0.4.0` |
| Helm | `docs/sync-helm-<CHART>-<TARGET>` (the main chart that changed) | `docs/sync-helm-dial-8.2.1` |
| several services | `docs/sync-services-<YYYY-MM-DD>` | `docs/sync-services-2026-11-25` |

`<service>` is the folder name without its number. If the branch already exists on the remote, append `-2`, then `-3`, and so on. Check with `git ls-remote --exit-code --heads <REMOTE> <BRANCH>`, where `<REMOTE>` is `origin`, or `https://github.com/epam/ai-dial` when there is no `origin`.

## 3. Commit

```bash
git add -- docs_v2/7.services/<N>.<service>/
git status --porcelain            # only that folder is staged
git commit -m '<MESSAGE>'
```

| Case | Message |
|---|---|
| content changed | `docs: sync DIAL <SERVICE> docs with <TARGET>` |
| only `last_verified` and stale version statements changed | `docs: verify DIAL <SERVICE> docs against <TARGET>` |
| several repositories in one folder | `docs: sync DIAL Evaluations docs with Framework Backend 0.6.2 and Metrics 0.4.0` |
| Helm | `docs: sync DIAL Helm docs with dial 8.2.1 and dial-admin 0.21.0` |
| related pages and menu | `docs: update pages related to the DIAL <SERVICE> sync` (several services: `the DIAL service syncs`) |
| a fix after verification | `docs: fix <WHAT> in the DIAL <SERVICE> sync` |

Messages follow Conventional Commits with the `docs:` type, are one line, and carry no trailers.

## 4. Open the PR

Write the body (section 5) to `<WORK>/pr-body.md` first. The title is `[DIAL Loop]: sync ` followed by what the run synced:

| Run | Title |
|---|---|
| one service | `[DIAL Loop]: sync DIAL <SERVICE> docs with <TARGET>`, such as `[DIAL Loop]: sync DIAL Core docs with 0.50.7` |
| several repositories in one folder | `[DIAL Loop]: sync DIAL Evaluations docs with Framework Backend 0.6.2 and Metrics 0.4.0` |
| Helm | `[DIAL Loop]: sync DIAL Helm docs with dial 8.2.1 and dial-admin 0.21.0` |
| several services | `[DIAL Loop]: sync DIAL service docs with their latest releases` |

A run that only verified the pages and changed `last_verified` uses the same title; the body says that nothing else changed. The commits keep their own messages (section 3).

Then use the first route that is available:

1. **`origin` and a working `gh`:**

   ```bash
   git push -u origin <BRANCH>
   gh pr create --repo epam/ai-dial --base development --head <BRANCH> \
     --title '<TITLE>' --body-file <WORK>/pr-body.md
   ```

   If `origin` is a fork of `epam/ai-dial`, use `--head <OWNER>:<BRANCH>`.

2. **The environment's PR tool:** when the environment provides its own tool for pull requests, such as a platform tool or an MCP server, call it with:
   - the repository `epam/ai-dial`;
   - the branch, and the base `development`;
   - the title;
   - the body from `<WORK>/pr-body.md`, unchanged.

   Follow the tool's own instructions for pushing the branch, and don't attempt `git push` without `origin`.

3. **Neither:** stop after the commits. Report the branch, its commits (`git log --oneline <BASE>..HEAD`), and the path of `<WORK>/pr-body.md`, and say the PR couldn't be opened.

- If a push or the PR tool is refused, stop and report it; don't look for another way in.
- Print the PR URL that `gh` or the tool returns. That URL is the result of the run.
- If `gh pr create` fails, run `gh pr list --repo epam/ai-dial --head <BRANCH> --json url` before anything else: the PR may exist already. Never open a second one.
- Confirm the title when `gh` works: `gh pr view <PR_URL> --repo epam/ai-dial --json title --jq .title` starts with `[DIAL Loop]: sync `. If the tool changed it, set it with `gh pr edit <PR_URL> --repo epam/ai-dial --title '<TITLE>'`; without `gh`, report it.
- If the tool adds text of its own to the title or body, such as an AI attribution line, report it. Don't work around the tool.

## 5. The body

Build it from the ledgers. The ledgers cite PRs as `#123`; in the body, write `epam/<REPO>#123`, because a bare `#123` links to a PR in `epam/ai-dial`. Omit empty sections, and repeat the service section for each service.

````markdown
## Summary

| Service | Repository | Checked against | Previously | Releases reviewed | PRs reviewed |
|---|---|---|---|---|---|
| DIAL <SERVICE> | `epam/<REPO>` | <TARGET> | <BASELINE>, verified <BASELINE_DATE> | [<TAG>](https://github.com/epam/<REPO>/releases/tag/<TAG>), … | <COUNT> |

## DIAL <SERVICE>

<One sentence on what changed for readers, or: "No change in these releases needs documenting; the pages are verified against <TARGET>.">

| Page | Change | Source |
|---|---|---|
| `docs_v2/7.services/<N>.<service>/<PAGE>.md` | Adds `<VARIABLE>` to the storage table | epam/<REPO>#<PR>, [`<FILE>#L40-L44`](https://github.com/epam/<REPO>/blob/<TARGET>/<FILE>#L40-L44) |

Reviewed, not documented:

- Already documented: epam/<REPO>#140
- Dependency upgrades with no setting or behavior change: epam/<REPO>#123, epam/<REPO>#130
- Tests, CI, and release chores: epam/<REPO>#125

## Related pages

| Page | Change | Service | Source |
|---|---|---|---|

## Up to date

- DIAL <SERVICE>: no release since <VERSION>

## Needs review

- DIAL <SERVICE>, <ITEM>: <WHY: not provable from released source, needs a decision, out-of-scope page now wrong, …>

## Verification

- Base: `<BASE>` at `<COMMIT>` (<fetched | not fetched: no origin>)
- Research: <GitHub API | clones and public github.com pages, no GitHub API>
- `sync_checks.py`: <RESULT>
- `check_links.py`: <RESULT>
- `npm run lint:frontmatter`: <RESULT>
- `npm run build`: <RESULT>
````

- "Reviewed, not documented" has one line per reason, and lists every reviewed PR that has no row in the change table.
- "Needs review" holds every `flag` verdict. It also holds every stale statement found on a page this task may not edit (the Overview, the Admin and Chat user guides, the demos), with its path and why it is wrong.
- Keep secrets, tokens, internal URLs, and personal data out of the body.
