---
name: admin-guide-sync
description: >-
  Keep the DIAL Admin User Guide (docs_v2/5.administering-dial/) in sync with the
  DIAL Admin component versions each DIAL platform release ships. Admin spans five
  source repos (admin-frontend, deployment-manager-backend, evaluation-framework-backend,
  evaluation-metrics, and the deprecating admin-backend). Detects what changed between
  the guide's pinned baseline and a new release, verifies against source at the pinned
  tags, writes the text updates, flags screenshots for human recapture, and opens a PR.
  Runs automatically (DIAL release) or manually ("is the admin guide stale?", "update
  the admin guide for 1.48", "catch the admin guide up"). Adapted from chat-guide-sync.
  Hands prose conventions to docs-page-writer.
compatibility: >-
  Python 3 with PyYAML. git (shallow-fetches component tags; no local clone needed).
  Multi-repo: resolve/detect/gather iterate over the five repos in manifest.yaml.
---

# DIAL Admin User Guide Sync

Keeps `docs_v2/5.administering-dial/` current against the DIAL Admin component
versions a DIAL release ships. Same engine as `chat-guide-sync`, generalized from
one source repo to **five**.

## What's different from chat-guide-sync (read first)

1. **Five source repos, not one.** `manifest.yaml` has a `repos:` list; versions,
   baselines, and per-page `sources` are all keyed by repo. The scripts must iterate
   over repos (see "Scripts need generalizing" below).
2. **The guide is far behind** (baseline ~2026-06-04, ~4 months stale). Before normal
   release-to-release syncing can work, a **one-time catch-up** is needed to bring it
   to the current app and establish correct per-repo baselines. That is Phase 0-4 of
   `references/catch-up-plan.md` and must happen first.
3. **An old guide exists as a consultation reference** (`docs/tutorials/3.admin`,
   never updated). Consult it when source or the app leaves something unclear or a
   feature seems missing, and adapt the understanding into the new guide's own
   structure. Do NOT port it page-by-page — the new guide is structured differently.
   It can be deprecated later by an explicit decision.

## Modes & actions (same as chat)

- **auto** (DIAL release -> PR) / **manual** (you drive it).
- `verify-only` (detect + report), `update` (detect + write changed pages + PR),
  `rebuild` (named scope, no detector).

## Pipeline (per repo, then merged)

```
DIAL release
  -> resolve_version: the 5 admin component versions from upgrade-to-<N>.md
  -> changelog.py: per-version tag-annotation changelog per repo  <-- PRIMARY targeting
  -> per repo: fetch, diff baseline..release                     <-- authoritative detail
  -> map changed paths -> affected guide pages (manifest sources)
  -> merge into one work list
  -> gather evidence (per page, across repos)
  -> agent reconcile + write  (references/m2-verify-and-write.md)
  -> PR (assemble_pr.py)
```

**Targeting signal (learned the hard way): read the component changelog first.**
Each admin component publishes its release notes as the ANNOTATED GIT TAG message
(`changelog.py`) -- a developer-written, feature-scoped list per version, e.g.
"(Toolsets) support Model Serving containers as toolset source". That is the signal
that tells the agent WHAT changed and where to look. The `git diff` is the
authoritative detail, but it must be read GUIDED by the changelog -- do not try to
infer user-visible changes from a raw multi-hundred-line diff alone (that under-reports;
it missed a whole auth rework in testing). `openspec/specs` is a weak signal for this
catch-up because it was incomplete at the 0.16.0 baseline.

## Scripts (multi-repo — built)

- `resolve_version.py` — all five `ai-dial-admin-*: X.Y.Z` versions from the upgrade doc.
- `changelog.py` — per-version tag-annotation changelog per repo across a span. The
  primary targeting signal (see pipeline above).
- `detect.py` — per repo, fetch + diff baseline..target, route changed paths to pages.
- `gather.py` — per-page evidence bundles grouped by repo (specs/code/labels;
  all-new repos contribute a spec inventory).
- `assemble_pr.py` — PR body (unchanged from chat; operates on agent records).
- `crop.py` / `mask.py` — screenshot reframe / redaction (M3 capture).

## Hard constraints (same as chat)

- Never commit/push beyond the PR branch the pipeline may open. Humans own merges.
- Never install/upgrade packages.
- Self-contained; only external reuse is `docs-page-writer` for prose.
- Text only in V1; screenshots are flagged for a human (Recapture list).
- Never write an unverified claim as fact; live-only facts go in the Flag list.
- Output stays inside `docs_v2/5.administering-dial/`.

## After a successful sync

Bump each repo's `baseline` in `manifest.yaml` to the synced release's versions, in
the same PR.

## Key paths

- `manifest.yaml` — five repos + 20 pages + per-repo baselines + per-page sources
  (baselines and sources are filled during catch-up).
- `references/catch-up-plan.md` — THE plan to run first: baseline discovery + the
  one-time catch-up to the current app.
- `references/page-review-checklist.md` — **the enforced per-page GATE for UI-vs-docs
  review passes.** Open it and work through it before touching any page (load lessons →
  live UI walk → reconcile → write → mark screenshots → record).
- `scripts/changelog.py` — per-version component changelog (primary targeting signal).
- `references/m2-verify-and-write.md` — verify-and-write contract + PR format (generic;
  reads "chat" in places — treat as the pattern, applies here too).
- `references/capture-and-prose.md` — screenshot discipline (M3) + write lessons.
- `scripts/*.py` — resolve/detect/gather/assemble (need multi-repo generalization) +
  crop/mask.

## Not yet built

- Multi-repo generalization of the scripts (see above).
- Phase 0 baseline discovery and the one-time catch-up (catch-up-plan.md).
- Per-page source maps in the manifest.
- Automation mechanics (trigger, PR open, agent-in-CI) — same remaining work as
  chat-guide-sync; mirror its `automation-todo.md` once catch-up is done.
