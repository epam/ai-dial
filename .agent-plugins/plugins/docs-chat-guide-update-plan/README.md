# docs-chat-guide-update-plan

A Claude Code plugin that plans the updates the DIAL Chat User Guide (`docs_v2/8.chat-user-guide/`) needs after the stable releases of DIAL Chat and DIAL Quick Apps. It reviews every stable release of `epam/ai-dial-chat`, `epam/ai-dial-quickapps-frontend`, and `epam/ai-dial-quickapps-backend` published from each page's `last_verified` date through today. The date itself is included; release candidates are skipped.

One research subagent per repository finds every change a chat user can see and proves it at the release. The run then writes a work order for writers and opens one pull request that adds it as `.research/chat-user-guide-<DATE>.md`. The work order has two parts:

- **Manual updates**: numbered, tickable items, each with the UI path, the page, section, and line, and what to do. The items are: retake, add, or remove a screenshot, and replace, add, or remove text.
- **Changes in the releases**: what changed for users, with links to the PRs, the release notes, and the source at the release tag.

The run doesn't edit page text or images. Its one commit sets `last_verified` to the run's date on every page of the guide and adds the work order file. The PR body is short: a summary, the link to the work order, and the checks under Verification. Writers push their screenshots and edits to the same branch, tick the items in the work order file, and mark the PR ready for review. Merging it records that the guide matches the releases through that date, and keeps the ticked work order in `.research/`.

The PR is titled `[DIAL Loop]: Chat update proposal for releases from <START> to <DATE>`. It is a draft while it has manual updates, when the PR route can open drafts. When the route can't, the PR opens ready and its body starts with a line that says not to merge it before every box is ticked. A new run stops while an earlier plan PR is still open.

## Skills and subagent

| Component | Invoked by | Role |
|---|---|---|
| `/docs-chat-guide-update-plan:plan` | you | the task: principles, scope, authorized actions, the nine-step workflow |
| `docs-chat-guide-update-plan:guide-map` | Claude | the guide's pages and UI paths, source areas per page, UI with no page, screenshots, inventory, text hits |
| `docs-chat-guide-update-plan:releases` | Claude | release windows, starting and checking the researchers |
| `docs-chat-guide-update-plan:repo-research` | the researcher | clone, change list, what users see, proof, routing, the findings file |
| `docs-chat-guide-update-plan:work-order` | Claude | from findings to items, item types and format, screenshot rules, the work order file, the PR body |
| `docs-chat-guide-update-plan:checks` | Claude | `plan_checks.py` on the work order, the branch, and the PR body, the frontmatter linter, Verification |
| `docs-chat-guide-update-plan:pr` | Claude | open-PR check, branch, `last_verified`, the work order file, commit, the PR and its draft state |
| `docs-chat-guide-update-plan:release-researcher` (subagent) | Claude | researches one repository with read-only tools and writes its findings file |

`plan` has `disable-model-invocation: true`: it pushes and opens a PR, so only you start it. The workflow skills have `user-invocable: false`. The subagent has no Agent or Edit tool and starts without `CLAUDE.md`: everything it needs is in its definition, its prompt, and `repo-research`.

The scripts use only the Python 3 standard library and `git`:

| Script | Does |
|---|---|
| `guide-map/scripts/guide_inventory.py` | lists the guide's pages in menu order with `last_verified`, headings and anchors, images and alt text, and bold UI labels |
| `guide-map/scripts/text_hits.py` | finds the guide lines that quote UI text the releases changed or removed, strong (bold, code, quote, alt, heading) or weak |
| `releases/scripts/release_windows.py` | per repository and `last_verified` date: the baseline, the target, and the stable releases to review, with their notes; release candidates, drafts, and older-line backports ignored |
| `repo-research/scripts/ui_changes.py` | per window: UI text, user-visible files, specs, routes and flags, `@epam/*` packages, the Quick Apps schema, tools, and stage names, each with the first release that ships it; the release-note items, one per PR |
| `checks/scripts/plan_checks.py` | checks the work order's sections and items against the pages, its links and wording rules; that the branch changes only `last_verified` and adds the one work order file, all staged; and the PR body's sections, size, and link to the work order |

## Install

This folder is both the plugin and a one-plugin marketplace of the same name. From the root of the `ai-dial` checkout:

```bash
claude plugin validate ./.agent-plugins/plugins/docs-chat-guide-update-plan
claude plugin marketplace add ./.agent-plugins/plugins/docs-chat-guide-update-plan
claude plugin install docs-chat-guide-update-plan@docs-chat-guide-update-plan
```

For one session only, without installing:

```bash
claude --plugin-dir ./.agent-plugins/plugins/docs-chat-guide-update-plan
```

The machine that runs it needs a clone of `epam/ai-dial`, Python 3, `git`, and network access to clone the three repositories. `node_modules/` is needed only for the frontmatter linter. It needs a GitHub account that can push branches and open PRs, drafts where the route allows, in `epam/ai-dial`, through `gh` or the environment's own pull-request tool. Reading the three public repositories needs no extra rights, but `gh` avoids the REST API's rate limit.

## Run

As a command, from the root of the `ai-dial` checkout:

```text
/docs-chat-guide-update-plan:plan
/docs-chat-guide-update-plan:plan dry run
/docs-chat-guide-update-plan:plan since 2026-10-01 review first
```

As a system prompt: `.agent-plugins/sys-prompts/docs-chat-guide-update-plan.md` holds the same task. With it loaded, a plain message such as "Plan the chat guide updates" starts the run. Each researcher can take ten minutes or more. A `claude -p` run stops background work after 10 idle minutes by default, so raise that cap:

```bash
CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0 claude --plugin-dir ./.agent-plugins/plugins/docs-chat-guide-update-plan \
  --append-system-prompt-file ./.agent-plugins/sys-prompts/docs-chat-guide-update-plan.md \
  -p "Plan the chat guide updates"
```

| Option | Effect |
|---|---|
| `since <YYYY-MM-DD>` | review the releases published from that day for every page, instead of from each page's `last_verified` |
| `dry run` | research and write the work order to the run's work folder, then report; no edits, branch, push, or PR |
| `review first` | stop after the summary and wait for a go-ahead before setting the dates and opening the PR |

What a run leaves:

- **one PR** on a `docs/chat-guide-plan-<YYYY-MM-DD>` branch. Its one commit sets `last_verified` on every page of the guide and adds the work order as `.research/chat-user-guide-<YYYY-MM-DD>.md` (`-2`, `-3` when that file exists). It is a draft when the work order has manual updates and the PR route can open drafts. When the releases need no manual update, the PR is ready and only records the verification.
- **no PR** when no repository has a stable release since the guide's dates, or when the run stops; the report says why.
- **the run's work folder** (`mktemp -d`), with the clones, each researcher's `findings.md` and `ui_changes.json`, the text hits, the ledger, `work-order.md`, and `pr-body.md`.
