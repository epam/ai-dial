# docs-services-review-and-update-relatives

A Claude Code plugin that keeps the four guide sections of the DIAL docs in `epam/ai-dial` (Understand DIAL, Connecting to DIAL, Building with DIAL, and Operating DIAL) in line with what the pull requests closed in the last month changed in the rest of `docs_v2/`, above all the service pages, and in the platform release documents under `docs/releases/`. One command reviews those changes, edits only what became false, broken, or incomplete for a guide's reader, checks the result, and opens a pull request against `development`, titled `[DIAL Loop]: sync guides with PRs closed from <START> to <END>`.

Run the service syncs for a release first with the companion plugin, `docs-services-release-sync`, so the service pages are current; this plugin then carries their changes into the guides once their PRs are merged, on their own or through an aggregation PR of the `docs-loop-pr-aggregation` plugin.

## Skills

| Skill | Invoked by | Role |
|---|---|---|
| `/docs-services-review-and-update-relatives:align` | you | the task: principles, scope, authorized actions, the nine-step workflow |
| `docs-services-review-and-update-relatives:sections` | Claude, or you | the four sections, the topic map from sources to guide pages, hub pages, stale-prone versions |
| `docs-services-review-and-update-relatives:sources` | Claude | the window of closed PRs, their descriptions, the content-only source changes, the release digest, the ledger |
| `docs-services-review-and-update-relatives:impact` | Claude | where changes touch the guides, the test, verdicts, proof, proportion, adding and removing, worked examples |
| `docs-services-review-and-update-relatives:style` | Claude, or you | voice, readability, admonitions by section, edit patterns |
| `docs-services-review-and-update-relatives:docs-map` | Claude, or you | what may be edited, links, frontmatter, MDX, search recipes |
| `docs-services-review-and-update-relatives:checks` | Claude | verification and how to classify failures |
| `docs-services-review-and-update-relatives:pr` | Claude | branch, commit, the `[DIAL Loop]: sync guides` title, the PR body and its list of reviewed PRs |

`align` has `disable-model-invocation: true`: it commits and pushes, so only you start it. The workflow skills have `user-invocable: false`; Claude loads them during a run. The scripts in `skills/*/scripts/` use only the Python 3 standard library and `git`. `window.py` reads the list of PRs from GitHub, with `gh` or the public API; the other scripts read only the checkout.

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
/docs-services-review-and-update-relatives:align review first since 2026-11-13
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
| `since <YYYY-MM-DD>` | start the window on that day instead of one month back |
| `only <SECTION>` | search and edit only `understand-dial`, `connecting-to-dial`, `building-with-dial`, or `operating-dial` |
| `dry run` | stop after the checks, with the edits uncommitted; no branch, commit, or PR |
| `review first` | stop for a go-ahead before the commit |
| `set last_verified` | also set `last_verified` to today on the pages the run edits |

## How the window works

A run reviews the pull requests of `epam/ai-dial` closed in the last month: on 2026-11-27, those closed from 2026-10-27 through 2026-11-27. Of those, it reviews only the PRs whose changes are on `development`:

- a merged PR, by its merge commit, or by a commit whose subject ends with `(#N)`, such as the cherry-pick of a release PR merged into `main`;
- a merged aggregation PR, `[DIAL Loop]: Aggregation of PRs for docs sync`, as one change; the run reads the descriptions of the source PRs it holds, which the aggregation closed without merging.

It skips PRs closed without merge, PRs held by an aggregation PR that is still open, PRs merged into another branch, promotions between `development` and `main`, PRs with no docs change, its own alignment PRs, and bulk imports such as `#672`. Commits pushed to `development` without a PR are not reviewed.

The PR descriptions say what changed and which source proves it; the diffs show the exact text. The run edits a guide only for the important changes, adds a fact only where the page already covers its topic, and removes only what a PR made false. Everything else goes in the PR as reviewed, not changed, or as "Needs review".

Each alignment PR lists the PRs it reviewed under "Reviewed PRs". Once it lands, the next run skips them, so two overlapping windows never review a PR twice. While an alignment PR is open, or an open aggregation PR holds one, a run stops. A run with nothing to change opens no PR, so the next run within the month reviews the same PRs again.

## What the first run will meet

On 2026-11-27 the window held 36 closed PRs. Seven are to review: `#666` (release 1.50, cherry-picked onto `development`), `#677` (overview at the site root), `#680` (legacy docs removed), `#683` (Admin guide), `#687` (Connecting to DIAL section, renumbering, Redis into Valkey), `#688` (DIAL MCP Gateway), and `#692` (Chat Themes sync). `#672` is skipped as a bulk import, along with dependency bumps, promotions to `main`, and the `feature/doc_improvements` PRs. The worked examples in `docs-services-review-and-update-relatives:impact` come from these PRs. Known "Needs review" items include the removed `dial-docker-compose/` folder that four local-setup tutorials still clone, and the Helm pages that still describe the 1.49 charts.
