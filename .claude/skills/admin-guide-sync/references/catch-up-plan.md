# Admin guide catch-up plan

The admin guide is ~4 months stale (every page `last_verified: 2026-06-04`). Before
normal release-to-release syncing can work, we must (a) find the baseline it actually
covers, (b) generalize the engine to five repos, (c) map pages to source, and (d) run
a one-time catch-up across all missed releases. Only then does the steady-state
"release -> PR" loop apply.

Do this step by step; each phase gates the next.

## Known facts (from initial recon)

- Guide content baseline: **2026-06-04** (all 20 pages).
- DIAL release dates (approx, from git): 1.43 = 2026-05-12, 1.44 = 2026-06-11,
  1.45 = 2026-07-07, 1.46 = 2026-08-03, 1.47 = 2026-08-31.
- **Latest release is 1.48** (on `main`). NOTE: this branch
  (`admin-userguide-sync`, from `feature/doc_improvements`) only has releases up to
  1.47 — `docs/releases/1.48/` is not here. Before resolving the target version,
  update this branch's `docs/releases` from `main` (or point `resolve_version` at
  `main`). The catch-up target is **1.48**.
- So the guide was written just after **1.43** and just before **1.44** → the working
  hypothesis is **the guide covers 1.43**. Catch-up span ≈ 1.43 → 1.48 (5 releases).
- Admin ships as 5 components; 1.47 versions: admin-frontend 0.20.0, admin-backend
  0.20.0, deployment-manager-backend 0.20.0, evaluation-framework-backend 0.3.0,
  evaluation-metrics 0.1.1 (get 1.48's from its upgrade doc on `main`).
- Old guide `docs/tutorials/3.admin`: **reference only**. Consult it when something
  is unclear or missing — it is NOT applied page-by-page (the new guide has a
  different structure). Never updated; not a migration source.

## Phase 0 — Confirm the baseline  ✅ DONE

**Result: the guide covers DIAL 1.43.** Evidence:
- 1.43's **MCP Registry in Deployment Manager** IS documented (`mcp-containers.md`:
  "From MCP Registry", "Select from registry").
- 1.44's features are ABSENT: HuggingFace auto-detection (guide has only manual HF
  container config), Evaluation Run Comparison, CSV export.
- Content date 2026-06-04 falls right after 1.43 (May 12), before 1.44 (June 11).

Baselines written to `manifest.yaml`: admin-frontend / admin-backend /
deployment-manager-backend = **0.16.0**. The two **evaluation repos did not exist**
as components at 1.43 (`baseline: null`).

**Evaluation scope — DECIDED: IN.** The admin guide WILL gain an evaluation section.
It is a brand-new area (no 1.43 baseline, no old-guide equivalent), sourced from
`ai-dial-admin-evaluation-framework-backend` + `-evaluation-metrics` (and the
frontend's evaluation UI). Creating it is an explicit Phase 3 task (new section,
written from source + live app, placed in the guide structure — slot TBD). It is
new-section work, not release-to-release drift.

<details><summary>Original Phase 0 procedure (for reference)</summary>

Goal: pin each repo's `baseline` version in `manifest.yaml`.

1. Take the hypothesis release **1.43**. Read its upgrade doc
   (`docs/releases/1.43/upgrade-to-1.43.md`) and record the 5 admin component versions.
   Do the same for 1.44.
2. Pick 3-5 concrete admin features that landed in **1.44** (from 1.44's release notes /
   admin component changelogs). Check the guide: are they absent? Pick 3-5 that landed
   in/by **1.43**: are they present?
3. If 1.43 features are in and 1.44 features are out → baseline = the **1.43** component
   versions. If the line is fuzzier, test 1.42/1.44 edges until it's clear.
4. Write the confirmed per-repo versions into `manifest.yaml` `repos[].baseline`.

Output: baselines set. This is the floor the catch-up diffs up from.

</details>

## Phase 1 — Generalize the engine to five repos  (resolve + detect DONE)

**Done & validated:**
- `resolve_version.py` → returns a {repo: version} map; reports repos absent from a
  release (1.43 correctly shows the 2 eval repos as not-yet-existing; 1.47 shows all 5).
- `detect.py` → multi-repo: per repo, fetch baseline..target, diff, classify by that
  repo's `signals`, route to `sources[<repo>]`; eval repos (baseline null) reported as
  ALL-NEW; everything merges to one work list. Plumbing validated on 1.47 (frontend
  2664 / deployment-manager 357 / backend 385 changed files).
- Repo layouts learned: frontend = NX/Next + `openspec/specs` (164) + `locales/en.ts`
  + `src/`; eval-framework = Java + `openspec/specs` (73); deployment-manager /
  admin-backend = Java, no specs; eval-metrics = Python, no specs. Recorded as
  per-repo `signals` in the manifest.

**Still TODO in Phase 1:**
- `gather.py` → multi-repo (depends on `sources`, so do it with/after Phase 2).
- Label handling: en.ts is TypeScript, not JSON — V1 treats it coarsely (option b);
  revisit only if specs/code prove insufficient.

<details><summary>Original Phase 1 procedure (for reference)</summary>

Goal: make the scripts multi-repo (they're chat's single-repo versions).

- `resolve_version.py` — return a `{repo_key: version}` map by matching all five
  `ai-dial-admin-*: X.Y.Z` lines in the upgrade doc. Fail loud if a repo is missing.
- `detect.py` — loop repos; fetch + `diff baseline..release` per repo; tag each changed
  path with its repo key; route to pages via `manifest.sources`; merge to one work list.
- `gather.py` — same loop; bundle evidence per page grouped by repo.
- `assemble_pr.py`, `crop.py`, `mask.py` — unchanged.

Validate on a single repo + a single page before wiring all five.

</details>

## Phase 2 — Map pages to source  (mapping DONE; gather.py pending)

**Done:** all 20 existing pages mapped in `manifest.yaml` (frontend specs by name
glob + `components/<Area>*` code globs + coarse backend keyword globs). Validated:
YAML parses, zero dead frontend spec globs, and `detect.py --release 1.47` flags
19/20 pages (compliance-faq correctly excluded as static; evaluation repos surface as
ALL-NEW sources). Pattern recorded in the manifest header.

Notes:
- Reasons collapse code to glob-level (not per-file) so the work list stays readable.
- A finer audit of the large "unmatched" list is more meaningful on a SINGLE-release
  diff (as learned on chat); defer until steady state.

**DONE:** `gather.py` generalized to multi-repo — per-page bundles grouped by repo
(spec diffs + changed-code lists + coarse label flag), and ALL-NEW repos (evaluation)
contribute a spec inventory at target instead of a diff. Validated on 1.47: 19 bundles,
eval repos reported all-new. **The admin engine is now complete** (resolve + detect +
gather + assemble_pr, all multi-repo).

<details><summary>Original Phase 2 procedure (for reference)</summary>

Goal: fill `manifest.pages[].sources`.

- Clone each repo shallow; learn its layout (admin-frontend is the main UI source —
  find where routes/components/i18n labels live; the backends own behavior).
- For each of the 20 pages, list the repo paths that decide its correctness
  (over-include). This is the admin analogue of chat's spec/lib/label mapping; the
  concrete signals differ per repo and must be discovered, not assumed.
- Validate with `detect.py`: a release bump should flag the right pages, and the
  "matched to no page" list should be only genuine non-guide surfaces.

</details>

## Old guide — reference only (not a phase)

`docs/tutorials/3.admin` is a **consultation reference**, not a migration source.
When source or the live app leaves something unclear, or a feature seems missing,
check whether the old guide explains it — and adapt the understanding into the new
guide's own structure and voice. Do NOT walk it page-by-page or port its prose; the
new guide is structured differently. It is never updated and can be deprecated later
by a separate, explicit decision.

## Phase 3 — One-time catch-up (1.43 → 1.48)

Goal: bring the guide to the current app.

**Do it release by release, not one 1.43→1.48 jump**, and lead with the changelog.
A single 5-release diff buries changes (a test on Toolsets surfaced one field and
missed a whole auth rework). Per step:

1. **Read the component changelog for that version** (`changelog.py` per repo) — the
   developer-written, feature-scoped list of what shipped. THIS is the targeting
   signal; the diff/evidence is read guided by it, not blind.
2. `detect.py` / `gather.py` for that release to get the work list + evidence.
3. Reconcile + write **page by page**, reviewing each. Cross-check every changelog
   line reaches a verdict (write / no-op / wrong-page / recapture) so nothing is
   skimmed.

- Because the span is large, do it **page by page**, reviewing each, not all 20 at
  once. Same reconcile/write/flag discipline as steady state.
- **Create the new Evaluation section** (decided in scope). Write it from the
  evaluation repos + the frontend's evaluation UI + the live app; place it in the
  guide structure (slot TBD, e.g. a new top-level `12.evaluation` page or folder);
  renumber siblings per the repo's prefix invariant; add its manifest page entry and
  source map. This is new-section authoring, not drift — expect a full screenshot
  capture pass for it.
- Screenshots will mostly need recapture (4 months of UI change) → expect a long
  Recapture list; that's a human follow-up.
- On completion, bump every `baseline` to the 1.48 versions and set pages'
  `last_verified`.

## Phase 4 — Steady state + automation

Once caught up, the skill behaves like chat-guide-sync: each DIAL release → detect →
write → PR. Then mirror chat's `automation-todo.md` (trigger, PR open, agent-in-CI)
for the admin skill.

## Order of work, short

0. Confirm baseline (1.43?) → set `repos[].baseline`. (First sync this branch's
   `docs/releases` with `main` so 1.48 is present.)
1. Generalize scripts to 5 repos.
2. Map 20 pages → source (fill `sources`).
3. One-time catch-up 1.43 → 1.48, page by page. (Old guide consulted as reference
   where helpful — not ported page-by-page.)
4. Steady state + automation.
