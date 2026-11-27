# docs-loop-pr-aggregation

A Claude Code plugin that collects the open pull requests of `epam/ai-dial` whose title starts with `[DIAL Loop]` into one aggregation pull request against `development`. It merges each source PR's head into one branch, resolves the conflicts from the evidence (the three versions, both PRs' change tables, and the sources they cite), checks the result, and opens the PR `[DIAL Loop]: Aggregation of PRs for docs sync`. It then closes each source PR with a comment that links the aggregation PR.

While an aggregation PR is open, the next run adds the new DIAL Loop PRs to it instead of opening a second one.

The source PRs come from the other two plugins: `docs-services-release-sync` (`[DIAL Loop]: sync DIAL <SERVICE> docs with <VERSION>`) and `docs-services-review-and-update-relatives` (`[DIAL Loop]: sync guides with PRs closed from <START> to <END>`). Both recognize an open aggregation PR: a sync skips a service whose folder it already changes, and an alignment run stops while it holds an alignment PR. After the aggregation PR merges, the next alignment run reviews it, with the descriptions of the source PRs it holds.

## Skills

| Skill | Invoked by | Role |
|---|---|---|
| `/docs-loop-pr-aggregation:aggregate` | you | the task: principles, scope, authorized actions, the nine-step workflow |
| `docs-loop-pr-aggregation:collect` | Claude | listing the open DIAL Loop PRs, roles, merge order, reading the source PRs |
| `docs-loop-pr-aggregation:conflicts` | Claude | the merge command, the conflict report, resolution rules by kind, the conflict ledger, when to abort one merge |
| `docs-loop-pr-aggregation:checks` | Claude | aggregate checks, links, linter, build, the overlap files, and how to classify failures |
| `docs-loop-pr-aggregation:pr` | Claude | branch, push, the title, the body, updating an open aggregation PR, closing the source PRs |

`aggregate` has `disable-model-invocation: true`: it pushes, comments, and closes PRs, so only you start it. The workflow skills have `user-invocable: false`.

The scripts use only the Python 3 standard library and `git`:

| Script | Does |
|---|---|
| `collect/scripts/loop_prs.py` | lists the open `[DIAL Loop]` PRs, fetches their heads to `refs/loop/`, assigns roles, merge order, and overlaps |
| `conflicts/scripts/conflicts.py` | reports the conflicts of the merge in progress, hunk by hunk with base text and a hint; `--check` fails while any remain |
| `checks/scripts/aggregate_checks.py` | scope, conflict markers, ancestry of every merged head, lines a PR added that didn't arrive, duplicates, frontmatter, numbering, overlaps |
| `checks/scripts/check_links.py` | relative links, anchors, sidebar ids |

## Install

This folder is both the plugin and a one-plugin marketplace of the same name. From the root of the `ai-dial` checkout:

```bash
claude plugin validate ./.agent-plugins/plugins/docs-loop-pr-aggregation
claude plugin marketplace add ./.agent-plugins/plugins/docs-loop-pr-aggregation
claude plugin install docs-loop-pr-aggregation@docs-loop-pr-aggregation
```

For one session only, without installing:

```bash
claude --plugin-dir ./.agent-plugins/plugins/docs-loop-pr-aggregation
```

The machine that runs it needs a clone of `epam/ai-dial` with `node_modules/` for the build, Python 3, and `git`. It needs a GitHub account that can push branches, open, edit, and close PRs, and comment in `epam/ai-dial`: through `gh`, or through the environment's own pull-request tool.

## Run

As a command, from the root of the `ai-dial` checkout:

```text
/docs-loop-pr-aggregation:aggregate
/docs-loop-pr-aggregation:aggregate dry run
/docs-loop-pr-aggregation:aggregate exclude #694 review first
```

As a system prompt: `.agent-plugins/sys-prompts/docs-loop-pr-aggregation.md` holds the same task. With it loaded, a plain message such as "Aggregate the DIAL Loop PRs" starts the run:

```bash
claude --plugin-dir ./.agent-plugins/plugins/docs-loop-pr-aggregation \
  --append-system-prompt-file ./.agent-plugins/sys-prompts/docs-loop-pr-aggregation.md \
  -p "Aggregate the DIAL Loop PRs"
```

| Option | Effect |
|---|---|
| `exclude #<N>` | leave that PR out and open |
| `dry run` | merge and check locally, then report; no push, PR, comment, or close |
| `review first` | stop after the summary and wait for a go-ahead before the push |

What a run leaves:

- **one open aggregation PR**, `[DIAL Loop]: Aggregation of PRs for docs sync`, on a `docs/loop-aggregate-<YYYY-MM-DD>` branch. Its body lists every source PR, every conflict resolution with its evidence, the fixes after merging, the PRs left open, all "Needs review" items, and the check results.
- **the source PRs closed**, each with a comment that links the aggregation PR. Their branches stay.
- **left open**: drafts, PRs against another base, PRs that change files outside `docs_v2/` and `sidebars-v2.js`, PRs excluded by the message, and PRs whose head moved during the run.

Merge the aggregation PR with **Squash and merge** or **Create a merge commit**, not **Rebase and merge**: a rebase drops the merge commits, and the conflict resolutions with them. Keep the `Merge #<N>: <TITLE>` commits as they are: the alignment run reads them to find the source PRs.
