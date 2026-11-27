---
name: releases
description: Use when planning DIAL Chat User Guide updates, to find the stable releases of epam/ai-dial-chat, epam/ai-dial-quickapps-frontend, and epam/ai-dial-quickapps-backend published since the guide's last_verified dates with release_windows.py (baselines, target, release candidates and backports ignored, same-day releases included), to start one release-researcher subagent per repository with the Agent tool and the exact prompt, to wait for them, and to check what they return.
user-invocable: false
---

# Releases and researchers

The guide documents what the stable releases of three repositories ship. A run reviews every stable release published from each page's `last_verified` date through today. The research itself runs in subagents, one per repository, so that three large repositories don't fill one context and each gets a clean start.

## 1. The release windows

Run it after `guide_inventory.py` (`docs-chat-guide-update-plan:guide-map`, section 5):

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/release_windows.py" --inventory <WORK>/guide.json --out <WORK>/windows.json \
  > <WORK>/windows.txt 2>&1; echo "exit=$?"; cat <WORK>/windows.txt
```

With `since <DATE>` in the run's input, add `--since <DATE>`: one window for every page.

What it decides, and why:

- **Stable only.** A release counts when GitHub doesn't mark it as a draft or a pre-release, and its tag is `X.Y.Z` with no suffix. `X.Y.Z-rc.N` is a release candidate, never documented. ai-dial-chat below 1.0.0 is the legacy chat.
- **One window per start date.** Each distinct `last_verified` date of the guide starts a window. Its baseline is the highest stable version published before that day.
- **Same-day releases are reviewed.** A release published on the start date itself is in the window, because the page may have been checked before it came out.
- **Versions, not dates, pick the baseline and the target.** These repositories publish backports of older lines after newer lines. A backport below a window's baseline is in no window for that date.
- The target is the highest stable version published on or before today.

It prints, per repository, the baselines, the target, the releases it reviews, and the release candidates and backports it ignored. A repository with `up to date` has no stable release above its baseline: it needs no researcher, and it counts as reviewed. A `STOP:` line means a page has no `last_verified`, a repository's releases can't be read, or no stable release predates a start date: stop the run and report it.

Without the GitHub API, the script falls back to the public REST API. When neither works but the environment's own GitHub tool can list releases, save its result per repository as a JSON array with the REST fields (`tag_name`, `published_at`, `prerelease`, `draft`, `html_url`, `body`). Then pass `--from-json epam/<REPO>=<FILE>` for each.

For the summary, also note which versions the latest DIAL platform release pins: `git show <BASE>:docs/releases/<N>/upgrade-to-<N>.md` for the highest `<N>` under `docs/releases/`, and its `ai-dial-chat`, `ai-dial-quickapps-backend`, and `ai-dial-quickapps-frontend` lines. The plan follows the repositories' own releases, which can be newer. Writers need to know when a deployment on the platform release doesn't have a change yet.

## 2. Start the researchers

Start one subagent for each repository whose status is `review`, all in one message, so they run at the same time. Use the Agent tool with:

- `subagent_type`: `docs-chat-guide-update-plan:release-researcher`
- `description`: `Research <NAME> releases`
- `prompt`: the text below, filled in

```text
Research <REPO> for the DIAL Chat User Guide update plan.

- Work folder: <WORK>
- Release windows: <WORK>/windows.json (your repository: "<REPO>"; target <TARGET>)
- Windows by page: <DATE>: <FROM> → <TARGET>, pages <PAGES>; <DATE>: …
- Guide inventory: <WORK>/guide.json
- Checkout root (read only): <CHECKOUT>
- GitHub access: <gh works | public REST API only | none: use the clone and the notes in windows.json>

Write your findings to <WORK>/research/<NAME>/findings.md, and answer with its path and the counts.
```

`<NAME>` is the repository name without `epam/`, `<CHECKOUT>` the absolute path of the ai-dial checkout, and the windows come from `<WORK>/windows.txt` and the dates in `<WORK>/guide.txt`.

If the Agent tool says that subagent type doesn't exist, use `subagent_type: general-purpose` with the same prompt, and add as its first line: `First read ${CLAUDE_PLUGIN_ROOT}/agents/release-researcher.md and follow it as your instructions.` If the Agent tool itself is missing, stop the run: the research must run in subagents, and the main session never researches a repository itself.

## 3. Wait, then check what came back

The researchers may run in the foreground or in the background. Either way, wait until all of them have answered before step 5 of the workflow. While you wait, you may read the guide's pages. Don't clone or research their repositories yourself.

A researcher can take ten minutes or more. In a `claude -p` run, background work is stopped after 10 minutes of idle waiting unless `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS` is raised; the plugin's README says how. If a researcher is stopped that way, its findings file is missing or unfinished.

For each repository, check:

- `<WORK>/research/<NAME>/findings.md` exists, starts with `# Findings:`, and lists the windows.
- Every finding has Kind, What a user sees, UI path, Shipped in, Evidence, Guide, and Proposed item.
- `ui_changes.json` exists, so text_hits.py can read it.
- Its "Not settled" items are things to carry to "Needs review", not to drop.

When a researcher fails, or its file fails these checks, start it once more with the same prompt and the line `Your previous attempt <WHAT WENT WRONG>; finish the findings file.` If the second attempt also fails, stop the run: the guide can't be marked as verified through today without every repository.

Record in `<WORK>/ledger.md`, per repository: the status, the windows, the researcher's counts, and the path of its findings file.
