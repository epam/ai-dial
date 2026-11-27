# docs-services-release-sync

A Claude Code plugin that syncs the DIAL service docs in `docs_v2/7.services/` of `epam/ai-dial` with the services' releases. Given one or more service repositories, it finds each docs folder, reviews every release since the pages were last verified, documents only the changes that matter to the people who deploy and configure the service, sets `last_verified`, checks the result, and opens a pull request against `development`. When nothing in the releases matters, it only marks the pages as verified.

The companion plugin, `docs-services-review-and-update-relatives`, then carries the merged service-page changes into the guide sections.

## Skills

| Skill | Invoked by | Role |
|---|---|---|
| `/docs-services-release-sync:sync` | you | the task: principles, scope, authorized actions, the nine-step workflow |
| `docs-services-release-sync:services-section` | Claude, or you | repository-to-folder mapping, page roles, the service catalog, version rules, `last_verified` rules |
| `docs-services-release-sync:release-research` | Claude | baseline, release window, PR ledger, PR reading, platform upgrade notes, proof at the tag |
| `docs-services-release-sync:change-triage` | Claude | what is significant, the verdicts, how much text, worked examples |
| `docs-services-release-sync:style` | Claude, or you | voice, terminology, tables, admonitions, code blocks, source links, diagrams, images, edit patterns |
| `docs-services-release-sync:docs-map` | Claude, or you | sections and scope, numbering and the sidebar, links and anchors, frontmatter, MDX hazards |
| `docs-services-release-sync:checks` | Claude | scope, frontmatter, style, links, linter, build, and how to classify failures |
| `docs-services-release-sync:pr` | Claude | the open-PR check, branch, commits, the PR body |

`sync` has `disable-model-invocation: true`: it commits and pushes, so only you start it. The workflow skills have `user-invocable: false`; Claude loads them during a run.

The scripts in `skills/*/scripts/` use only the Python 3 standard library and `git`:

| Script | Does |
|---|---|
| `services-section/scripts/service_folder.py` | maps a repository to its docs folder |
| `release-research/scripts/pinned_refs.py` | `last_verified`, pinned links, image tags, version prose, drift |
| `release-research/scripts/release_window.py` | baseline, target, and the releases to review (semver, drafts, backports, Helm) |
| `release-research/scripts/inventory.py` | the PR ledger: notes and commits, issues dropped, sync PRs expanded |
| `checks/scripts/sync_checks.py` | scope, frontmatter integrity, style on added lines |
| `checks/scripts/check_links.py` | relative links, anchors, sidebar ids |

An authenticated `gh` is used when it works. Without it, the scripts read clones and public github.com pages, and the PR goes through the environment's own pull-request tool.

## Install

This folder is both the plugin and a one-plugin marketplace of the same name. From the root of the `ai-dial` checkout:

```bash
claude plugin validate ./.agent-plugins/plugins/docs-services-release-sync
claude plugin marketplace add ./.agent-plugins/plugins/docs-services-release-sync
claude plugin install docs-services-release-sync@docs-services-release-sync
```

For one session only, without installing:

```bash
claude --plugin-dir ./.agent-plugins/plugins/docs-services-release-sync
```

The machine that runs it needs a clone of `epam/ai-dial` with `node_modules/` for the build, Python 3, and `git`.

## Run

As a command, from the root of the `ai-dial` checkout:

```text
/docs-services-release-sync:sync https://github.com/epam/ai-dial-log-parser
/docs-services-release-sync:sync epam/ai-dial-core epam/ai-dial-chat
/docs-services-release-sync:sync https://github.com/epam/ai-dial-helm dry run
/docs-services-release-sync:sync https://github.com/epam/ai-dial-chat-themes review first
```

The short form `/sync` works too, as long as no other installed plugin or skill uses that name.

As a system prompt: `.agent-plugins/sys-prompts/docs-services-release-sync.md` holds the same task. With it loaded, the user message is the repository link, with nothing else needed:

```bash
claude --plugin-dir ./.agent-plugins/plugins/docs-services-release-sync \
  --append-system-prompt-file ./.agent-plugins/sys-prompts/docs-services-release-sync.md \
  -p "https://github.com/epam/ai-dial-chat-themes"
```

Every run ends with a pull request against `development`, titled `[DIAL Loop]: sync DIAL <SERVICE> docs with <VERSION>`, and the PR review is the approval. The `[DIAL Loop]` prefix is how the `docs-loop-pr-aggregation` plugin finds the PR to collect it with the others. Two words change that:

- **`review first`** stops for a go-ahead before the first commit.
- **`dry run`** stops after the checks, with no branch, commit, or PR.

The base is `origin/development`, or the local `development` branch when the checkout has no `origin`. The PR is opened with `gh` when `origin` and `gh` work; otherwise through the environment's own pull-request tool, and if there is none, the run commits on its branch and reports that.
