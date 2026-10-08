---
name: chat-guide-sync
description: >-
  Keep the DIAL Chat User Guide (docs_v2/chat-user-guide-new/) in sync with the
  ai-dial-chat version each DIAL platform release ships. Detects what changed
  between the guide's pinned chat version and a new release, verifies the change
  against chat source at the pinned tag, writes the text updates, flags
  screenshots for human recapture, and opens a PR. Runs automatically (triggered
  by a DIAL release) or manually ("is the chat guide stale?", "update the guide
  for 1.48", "rebuild the toolsets page"). Replaces the older, semi-manual
  chat-guide-capture skill. Hands prose conventions to docs-page-writer.
compatibility: >-
  Python 3 with PyYAML (manifest/detector). git (shallow-fetches ai-dial-chat
  tags; no local clone or checkout needed). For the later capture milestone, a
  headless browser or a human-assisted capture pass -- NOT part of V1.
---

# DIAL Chat User Guide Sync

Keeps `docs_v2/chat-user-guide-new/` current against the ai-dial-chat version a
DIAL release ships. Built to run unattended in CI and open a PR for human review,
and to run the same logic interactively.

One engine, two entry points, three actions. Everything is fetched from URLs at
run time: **no local clone is assumed**.

## Modes (entry points)

- **auto** — triggered by a DIAL release. Scope comes from the detector. The human
  gates are not runtime prompts; they are the PR review and the committed config
  (manifest, later: fixtures). Output is a PR.
- **manual** — you drive it in a session. Scope comes from your request. You can
  stop to ask and inspect. Output is edits in the working tree (and a PR when asked).

Same evidence -> reconcile -> write machinery underneath. Only the gates and the
scope source differ.

## Actions (what sets the work list)

| Action | Detector? | Writes? | PR? | When |
|---|---|---|---|---|
| `verify-only` | yes | no | no | "is the guide stale?" / the M1 drift check |
| `update` | yes | yes (changed pages) | yes | a DIAL release landed (the default) |
| `rebuild` | no | yes (named scope) | yes | new page, full refresh, or recovery |

- `verify-only` stops after the detector and reports.
- `update` lets the detector pick the pages, then runs M2 on them.
- `rebuild` skips the detector; you name the pages, M2 re-verifies them against
  current source from scratch.

## The pipeline

```
DIAL release  ->  chat version  ->  fetch chat repo  ->  diff  ->  work list  ->  verify+write  ->  PR
  resolve_version    (pinned tag)     detect.py           detect.py              M2 (blueprint)
```

### Stage 1 — Detect (M1, built)

1. **Resolve the target version** — `scripts/resolve_version.py` reads the latest
   DIAL release's `upgrade-to-<N>.md` and extracts the single `ai-dial-chat: X.Y.Z`
   line. Fails loud on zero or 2+ matches (a release exception; a human looks).
2. **Diff** — `scripts/detect.py` shallow-fetches the `from`
   (`manifest.last_verified_chat_version`) and `to` tags from `chat_repo_url`,
   diffs them, and routes each changed path to the owning page(s) across five
   signals: specs, libs, raw code (pages/components/hooks), labels (routed by
   en.json namespace, key-level), backend.
3. **Output** — a selective work list: the pages to re-check, each with the reason,
   plus changed files that matched no page (coverage gaps to review).

**Important**: The diff is the primary targeting signal, but it is NOT the only
source. See the **three-source completeness check** in Stage 2.

Zero required arguments; `--to`, `--from`, `--cache`, `--json` available. See the
script headers for usage.

### Stage 2 — Verify & write (M2)

Per flagged page: gather evidence from the pinned clone, reconcile source-truth
against the current page text into a decision list, write the text edits directly,
flag screenshots for recapture. Then open a concise PR.

**Follow `references/m2-verify-and-write.md` exactly** — it is the agreed V1
contract: the five verdicts, the new-feature rule (draft + hard flag), the
stale-screenshot marker, the three-bucket PR format, and the boundaries.

### Stage 3 — Three-source completeness check (mandatory)

After all page edits are written, reconcile the work against ALL THREE sources
before declaring the sync complete. Every item across all three must reach a
verdict (done / no-op / flag / recapture / defer). Advancing to "open PR" without
this check is not allowed.

| # | Source | What it catches | Where to find it |
|---|--------|-----------------|------------------|
| 1 | **Git diff** (M1 detector output) | Code-level changes: renamed labels, new specs, removed components, backend behavior | `detect.py` output — already used in M2 |
| 2 | **DIAL Chat release notes** | User-facing features, breaking changes, behavioral changes the diff may under-represent | GitHub release page for `epam/ai-dial-chat` at the `to` tag (e.g. `https://github.com/epam/ai-dial-chat/releases/tag/<version>`) |
| 3 | **DIAL platform release notes** | Chat-relevant features highlighted at the platform level; cross-component features involving Chat | `docs/releases/<dial-version>/` in this repo — both the release notes and the upgrade guide |

**Why all three**: The diff catches everything that changed in code but can miss
the *significance* of a change (a one-line config flag that enables a major
feature). Chat release notes catch user-facing features the diff under-represents.
Platform release notes catch cross-component features (e.g. a Core change that
surfaces new UI in Chat). Any single source alone will miss things.

**Process**:
1. After M2 edits, read the Chat release notes for every chat version between
   `from` and `to` (inclusive of `to`, exclusive of `from`).
2. Read the DIAL platform release notes for the target DIAL release.
3. For each item in sources 2 and 3 that is chat-relevant: check whether the M2
   edits already cover it. If not, investigate and write/flag/no-op it.
4. Record the final reconciliation in the PR or scratchpad — every item with a
   verdict.

## Hard constraints

- **Never commit/push beyond the PR branch** the pipeline is explicitly allowed to
  open. Per the repo `CLAUDE.md`, humans own merges. In manual mode, don't even open
  a PR unless asked.
- **Never install or upgrade packages.** A build/dependency failure is a finding to
  report, not a license to change deps (repo `CLAUDE.md`).
- **Self-contained.** No runtime dependency on the old `chat-guide-capture` skill
  (being deleted) or `docs-researcher`. The only external reuse is `docs-page-writer`
  for prose conventions.
- **Text only in V1.** The agent does not capture or edit screenshots; it flags them.
- **Never write an unverified claim as fact.** Live-only confirmations go in the PR's
  Flag list, never into the page as settled text.
- **Output stays inside `docs_v2/chat-user-guide-new/`.** Wiring the folder into
  `sidebars-v2.js` is a separate, explicit human step.

## After a successful sync

Bump `last_verified_chat_version` in `manifest.yaml` to the `to` version, in the
same PR. That is what makes the next run incremental.

## Key paths

- `manifest.yaml` — page->source map, the chat repo URL, the DIAL releases path,
  and the pinned `last_verified_chat_version`. The keystone both stages read.
- `scripts/resolve_version.py` — latest DIAL release -> chat version.
- `scripts/detect.py` — fetch + diff + selective work list (M1).
- `scripts/gather.py` — per-page evidence bundles for M2.
- `scripts/assemble_pr.py` — agent records -> the fixed 3-bucket PR body.
- `scripts/crop.py`, `scripts/mask.py` — screenshot reframe / redaction (for M3 capture).
- `references/m2-verify-and-write.md` — the V1 verify-and-write contract and PR format.
- `references/capture-and-prose.md` — screenshot capture discipline (M3) + write/structure
  lessons (apply now). Harvested from the retired `chat-guide-capture`.
- Guide content: `docs_v2/chat-user-guide-new/*.md` + `img/` (and `3.catalog/img/`).
- Companion skill: `docs-page-writer` (prose/terminology/structure).

## Not yet built

- **M2 code** — the verify-and-write stage. Blueprint is agreed; implement to it.
- **M3** — the GitHub Action trigger and screenshot capture (headless or
  human-assisted). V1 leaves screenshots to a human via the PR's Recapture list.
  The capture discipline for M3 is already preserved in
  `references/capture-and-prose.md` (plus `scripts/crop.py`, `scripts/mask.py`).
- **Fixtures** — pre-authorized disposable demo content for capture (M3).
