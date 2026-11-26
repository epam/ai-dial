# docs-services-review-and-update-relatives

A Claude Code plugin that keeps the four guide sections of the DIAL docs in `epam/ai-dial` (Understand DIAL, Connecting to DIAL, Building with DIAL, and Operating DIAL) in line with what changed in the rest of `docs_v2/`, above all the service pages, and in the platform release documents under `docs/releases/`. One command reviews the changes since the last run, edits only what became false, broken, or incomplete for a guide's reader, checks the result, and opens a pull request against `development`.

Run the service syncs for a release first with the companion plugin, `docs-services-release-sync`, so the service pages are current; this plugin then carries their changes into the guides.

## Skills

| Skill | Invoked by | Role |
|---|---|---|
| `/docs-services-review-and-update-relatives:align` | you | the task: principles, scope, authorized actions, the nine-step workflow |
| `docs-services-review-and-update-relatives:sections` | Claude, or you | the four sections, the topic map from sources to guide pages, hub pages, stale-prone versions |
| `docs-services-review-and-update-relatives:sources` | Claude | the window, the content-only source changes, the release digest, the ledger |
| `docs-services-review-and-update-relatives:impact` | Claude | where changes touch the guides, the test, verdicts, proof, proportion, worked examples |
| `docs-services-review-and-update-relatives:style` | Claude, or you | voice, readability, admonitions by section, edit patterns |
| `docs-services-review-and-update-relatives:docs-map` | Claude, or you | what may be edited, links, frontmatter, MDX, search recipes |
| `docs-services-review-and-update-relatives:checks` | Claude | verification and how to classify failures |
| `docs-services-review-and-update-relatives:pr` | Claude | the open-PR check, branch, the commit that records the window, the PR body |

`align` has `disable-model-invocation: true`: it commits and pushes, so only you start it. The workflow skills have `user-invocable: false`; Claude loads them during a run. The scripts in `skills/*/scripts/` use only the Python 3 standard library and `git`, and read only the checkout; no GitHub API is needed for the research.

## Install

This folder is both the plugin and a one-plugin marketplace of the same name. From the root of the `ai-dial` checkout:

```bash
claude plugin validate ./.agent-plugins/plugins/docs-services-review-and-update-relatives
claude plugin marketplace add ./.agent-plugins/plugins/docs-services-review-and-update-relatives
claude plugin install docs-services-review-and-update-relatives@docs-services-review-and-update-relatives
```

Inside a session, the same is `/plugin marketplace add ./.agent-plugins/plugins/docs-services-review-and-update-relatives` and `/plugin install docs-services-review-and-update-relatives@docs-services-review-and-update-relatives`. A local marketplace picks up edits at the next session start or after `/reload-plugins`.

For one session only, without installing:

```bash
claude --plugin-dir ./.agent-plugins/plugins/docs-services-review-and-update-relatives
```

The machine that runs it needs a clone of `epam/ai-dial` with `node_modules/` for the build, Python 3, and `git`. To open the PR it uses `gh` when `origin` and `gh` work, otherwise the environment's own pull-request tool; with neither, it commits on its branch and reports that.

## Run

From the root of the `ai-dial` checkout:

```text
/docs-services-review-and-update-relatives:align
/docs-services-review-and-update-relatives:align since 2026-11-19
/docs-services-review-and-update-relatives:align dry run only operating-dial
/docs-services-review-and-update-relatives:align review first since #687
```

The short form `/align` works too, as long as no other installed plugin or skill uses that name.

Headless:

```bash
claude -p "/docs-services-review-and-update-relatives:align"
```

As a system prompt: `.agent-plugins/sys-prompts/docs-services-review-and-update-relatives.md` holds the same task. With it loaded, a plain message such as "Align the guides" or "Align the guides since 2026-11-19" starts the run:

```bash
claude --plugin-dir ./.agent-plugins/plugins/docs-services-review-and-update-relatives \
  --append-system-prompt-file ./.agent-plugins/sys-prompts/docs-services-review-and-update-relatives.md \
  -p "Align the guides"
```

| Option | Effect |
|---|---|
| `since <YYYY-MM-DD>`, `since #<PR>`, `since <COMMIT>` | start the window after that point |
| `only <SECTION>` | search and edit only `understand-dial`, `connecting-to-dial`, `building-with-dial`, or `operating-dial` |
| `dry run` | stop after the checks, with the edits uncommitted; no branch, commit, or PR |
| `review first` | stop for a go-ahead before the commit |
| `set last_verified` | also set `last_verified` to today on the pages the run edits |

## How the window works

Each run ends with one commit, `docs(guides): align with docs and release changes through <SHA10>`, and the PR carries the same title. The next run finds that text on `development` and starts after `<SHA10>`, so no change is reviewed twice or missed. Without a previous run, the window covers the last month. A commit that adds 50 or more pages at once, such as the creation of `docs_v2/` in `#672`, is skipped as a bulk import.

A run with nothing to change opens no PR and records no end, so the next run reviews the same window again. Pass `since` to move past it.

## What the first run will meet

On 2026-11-25 the default window ran from `#672` to `#692`, with `#687` (renumbering, Redis into Valkey), `#688` (DIAL MCP Gateway), `#683` and `9eeb5d43` (Admin guide), `#666` (release 1.50), and `#692` (Chat Themes sync). The worked examples in `docs-services-review-and-update-relatives:impact` come from that window. Known "Needs review" items include the removed `dial-docker-compose/` folder that four local-setup tutorials still clone, and the Helm pages that still describe the 1.49 charts.
