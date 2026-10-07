# Session handoff — doc-sync skills

Context for picking this up in a new session.

## The big picture

Goal: keep two DIAL user guides in sync with the apps they document, eventually
automatically (a DIAL release triggers a GitHub Action that updates the guide and
opens a PR for human review). Two skills, same design:

- **`chat-guide-sync`** — for the Chat guide (`docs_v2/chat-user-guide-new/`).
  Lives on branch **`chat-userguide-review`** (committed). Single source repo
  (`epam/ai-dial-chat`). Engine built + validated; guide is current, so it only
  needs steady-state syncing. Automation (trigger/PR/agent-in-CI) not built —
  see its own `references/automation-todo.md`.
- **`admin-guide-sync`** — for the Admin guide (`docs_v2/5.administering-dial/`).
  Lives on branch **`admin-userguide-sync`** (from `feature/doc_improvements`,
  NOT committed — staged in working tree). FIVE source repos. This is the active work.

Both replace the old, retired `chat-guide-capture` skill (deleted on the chat branch;
its keepers were harvested into `chat-guide-sync/references/capture-and-prose.md`).

## How the engine works (both skills)

```
DIAL release upgrade doc  -> component version(s)         [resolve_version.py]
per version: component release notes = git TAG annotation [changelog.py]  <- PRIMARY targeting
git diff baseline..target of the source repo             [detect.py]      <- authoritative detail
route changed paths -> guide pages via manifest `sources`[detect.py]
per page: pull the changed specs/code = evidence          [gather.py]
agent reads evidence, decides write/no-op/flag            [references/m2-verify-and-write.md]
agent writes text directly; flags screenshots for a human
assemble the PR body (Done / Recapture / Flag)            [assemble_pr.py]
```

KEY LESSON (learned by under-reporting in a test): **lead with the changelog
(`changelog.py`), then read the diff GUIDED by it.** A raw multi-release diff is too
big to eyeball and will hide changes. `openspec/specs` is only a partial signal
(incomplete at old baselines). The changelog (annotated git tag message) is the
developer-written list of what actually shipped per version.

Reconcile verdicts: matches / changed / new / removed / cosmetic / no-op / wrong-page
/ flag / recapture. New feature with no section -> draft it + hard-flag (option A).
Text only in V1; screenshots -> Recapture list. Never write an unverified claim as
fact -> Flag list.

## admin-guide-sync — current state

Files in `.claude/skills/admin-guide-sync/`:
- `SKILL.md` — orchestrator (modes auto/manual; actions verify-only/update/rebuild).
- `manifest.yaml` — 5 repos (with per-repo `baseline` + `signals`), 20+ pages mapped
  to `sources`. THE keystone. Evaluation pages (12.evaluation/) now have full source
  mappings.
- `scripts/` — resolve_version, changelog, detect, gather, assemble_pr (all multi-repo),
  + crop/mask (for later screenshot capture).
- `references/catch-up-plan.md` — the phased plan (READ THIS FIRST).
- `references/m2-verify-and-write.md` — the write contract + PR format + admin guide
  page patterns (table conventions for grids, properties, actions, etc.).
- `references/capture-and-prose.md` — screenshot discipline (later) + write lessons.

The 5 repos and baselines (guide currently covers through **DIAL 1.48**):
| repo | baseline (1.43) | 1.44 | 1.45 | 1.46 | 1.47 | 1.48 (current) |
|---|---|---|---|---|---|---|
| ai-dial-admin-frontend | 0.16.0 | 0.17.1 | 0.18.1 | 0.19.0 | 0.20.0 | 0.21.0 |
| ai-dial-admin-deployment-manager-backend | 0.16.0 | 0.17.0 | 0.18.1 | 0.19.0 | 0.20.0 | 0.21.0 |
| ai-dial-admin-backend | 0.16.0 | 0.17.0 | 0.18.1 | 0.19.0 | 0.20.0 | 0.21.0 |
| ai-dial-admin-evaluation-framework-backend | null | — | 0.1.0 | 0.2.0 | 0.3.0 | 0.4.0 |
| ai-dial-admin-evaluation-metrics | null | — | not listed | 0.1.0 | 0.1.1 | 0.3.0 |

### Phases
- Phase 0 (confirm baseline) — DONE: guide covers 1.43.
- Phase 1 (multi-repo engine) — DONE + validated (resolve/changelog/detect/gather).
- Phase 2 (map 20 pages) — DONE + validated.
- Phase 3 (the actual catch-up 1.43->1.48) — **COMPLETE. 1.44 COMPLETE. 1.45 COMPLETE. 1.46 COMPLETE. 1.47+1.48 COMPLETE (hybrid approach).**
- Phase 4 (automation: trigger, PR open, agent-in-CI) — NOT STARTED.

### Decisions made
- **Evaluation is IN scope** — the guide has a NEW Evaluation section (created during
  1.44 work), sourced from the two eval repos + frontend eval UI.
- Old guide `docs/tutorials/3.admin` is a **consultation reference only** — never
  ported page-by-page (new guide is structured differently).
- en.ts labels handled coarsely in V1 (it's TypeScript, not JSON); lean on specs/code.
- Do the catch-up **release by release** (1.43->1.44->...->1.48), page by page — NOT
  one 5-release jump (that hides changes).
- **Three-source completeness check** — every release reconciled against (1) git tag
  annotation (changelog.py), (2) each component repo's own CHANGELOG/RELEASE_NOTES,
  and (3) the DIAL platform release notes (`docs/releases/<version>/`). Every item
  across all three must reach a verdict before advancing to the next release.
- **Admin guide page patterns** — all pages follow consistent table-based structure
  (documented in `m2-verify-and-write.md`). Grids use `| Column | Description |`,
  properties use `| Field | Required | Editable | Description |`, actions/controls
  use `| Action/Control | Description |`. Never describe grid columns in prose.

## 1.44 catch-up — COMPLETED

### What was done (full reconciliation: 65 items across all pages)

**New pages created:**
- `docs_v2/5.administering-dial/12.evaluation/0.index.md` — Evaluation overview
- `docs_v2/5.administering-dial/12.evaluation/1.metrics.md` — Metrics grid + detail
- `docs_v2/5.administering-dial/12.evaluation/2.test-suites.md` — Test suites (5 tabs:
  Properties, Method, Test Cases with schema manager, Metrics with bindings, Runs)
- `docs_v2/5.administering-dial/12.evaluation/3.runs.md` — Runs grid, analytics tab,
  run comparison (3-level columns, bottom drawer), CSV export

**Existing pages updated:**
- `8.audit/1.activity-and-rollback.md` — Deployment audit views (image/container/
  firewall detail tables), synthetic entity types (routes, interceptors)
- `5.deployments/2.container-management.md` — Resources column in grid, node pool
  selection (field + env var tables), HuggingFace auto-detection (behavior table)
- `8.audit/2.monitoring-dashboards.md` — Tree view for entities consumption,
  column sorting and per-column filters for all Usage Log grids
- `4.assets.md` — Breadcrumb navigation, import validation with uniqueness conflicts
  (applications + toolsets import flows)
- `1.config-backup-and-global-settings.md` — Import preview validation errors

**Sidebar:** `sidebars-v2.js` updated with Evaluation category (4 pages).

**Already covered (no changes needed):**
- `5.deployments/1.images.md` — Save flow split (Save/Save as new version/Save as new
  image) and source code for all image types already documented
- `2.entities/2.applications.md` — Source Type column already in grid
- `2.entities/3.toolsets.md` — forwardAuthToken toggle already documented
- `3.builders.md` — Stop button already documented in images.md (Install/Stop action)
- `2.entities/1.models.md` — Core v0.43/v0.44 config properties are backend-level

**Three-source verification:** All items from platform release notes, component
upgrade guides (BE 0.17.0 + DM 0.17.0), and git tag annotations reached a verdict.
Zero gaps.

**Scratchpad:** Full reconciliation table at
`<scratchpad>/reconciliation-1.44.md` (65 items, all with verdicts).

### Key learnings from 1.44
- Conversation asset type was REVERTED in frontend 0.17.0 — always check for reverts
  in the tag annotation before documenting.
- Evaluation UI ships in the frontend even though eval backend repos are not listed as
  separate components in 1.44 — don't defer features just because their backend isn't
  a named component in the release.
- The DM repo has detailed upgrade plans at `docs/upgrade-plans/<version>.md` — these
  are the richest "component release notes" source for that repo.
- Admin backend repo's upgrade plan is at the same path pattern.
- Build passes with all changes (`onBroken*` all set to `throw`).

## 1.45 catch-up — COMPLETED

### What was done (full reconciliation: 37 items across all pages)

**New pages created:**
- `docs_v2/5.administering-dial/12.evaluation/2.datasets.md` — Datasets grid, detail
  view, test case management, schema manager, duplicate/clone, delete with linked
  test suites warning

**Existing pages updated:**
- `12.evaluation/0.index.md` — Added Dataset and Playground to concepts table, updated
  workflow to 4 steps, updated sub-page count/links (renumbered 2→3, 3→4)
- `12.evaluation/3.test-suites.md` (was `2.`) — Rewritten for dataset decoupling: test
  cases now come from linked dataset, dataset picker, public dataset read-only note
- `12.evaluation/4.runs.md` (was `3.`) — Compare action in grid, comparison rework
  (two methods, score bar), CSV `::` delimiter, export disabled during active run,
  new Playground section
- `8.audit/1.activity-and-rollback.md` — Diff Mini Map subsection, Deployment entity
  rollback subsection
- `8.audit/2.monitoring-dashboards.md` — "Money" → "Total Money" (3 occurrences)
- `4.assets.md` — Breadcrumb dropdown, 4-level nesting limit, Source column in
  Applications grid, Provider field in Toolsets, new Conversations asset section
- `2.entities/1.models.md` — Embedding Dimensions field, Secret Extra Data in upstreams,
  ID field in upstreams, Features section reorganized into named groups with 3 new
  toggles (Custom temperature, Max tokens, Max completion tokens) + Reasoning Efforts
  multi-value field. Screenshot outdated marker for upstreams redesign.
- `2.entities/2.applications.md` — Features section reorganized into named groups with
  same new toggles + Reasoning Efforts. New Application Properties subsection
  (key-value editor for applicationProperties).
- `2.entities/3.toolsets.md` — Provider field in properties
- `1.config-backup-and-global-settings.md` — Firewall validation grouped by domain
- `5.deployments/2.container-management.md` — Termination message, HuggingFace
  text-classification transformer details

**Sidebar:** `sidebars-v2.js` updated with Datasets entry between Metrics and Test suites.

**Three-source verification:** All 37 items from git tag annotations, component
upgrade plans (DM 0.18.0; BE 0.18.0 had no upgrade plan), and DIAL 1.45 platform
release notes reached a verdict. Four items required source investigation via agents
(FE #3676 new properties, FE #3628 sign-in method, BE #1051 Core v0.45.0 config,
BE #907 polymorphic source). All resolved.

**Scratchpad:** Full reconciliation table at
`<scratchpad>/reconciliation-1.45.md` (37 items, all with verdicts).

### Key learnings from 1.45
- FE #3676 ("new properties") and BE #1051 (Core v0.45.0 config) are the same feature
  from FE and BE sides — always cross-reference before duplicating work.
- Eval framework backend 0.1.0 ships as a named component for the first time in 1.45.
  The Evaluation section already existed from 1.44 (FE had the UI), but datasets as
  independent entities are a 1.45 feature.
- Features section reorganization (named groups) is a structural change that affects
  both Models and Applications pages. Group names come from the FE code
  (`modelsSwitchGroups` / `applicationSwitchGroups`).
- Admin backend repo has NO changelog or upgrade plan at 0.18.0 — relied on git tag
  annotations and properties-tracker.md in the repo source.
- Build verification still pending (user may be running it in their own console).

## 1.46 catch-up — COMPLETED

### What was done (full reconciliation: 37 items, 16 written, 14 no-op, 5 deferred, 2 meta)

**Existing pages updated:**
- `12.evaluation/4.runs.md` — Aggregated metric scores subsection (weighted mean, mean
  across all metrics). Complete rewrite of Compare mode: tabbed view (Execution results +
  Heatmap), display controls table, row detail panel.
- `12.evaluation/3.test-suites.md` — Overall score and Overall score threshold fields in
  Properties table. Test case filter subsection (query DSL).
- `5.deployments/2.container-management.md` — Metrics tab [Preview]: 5 metric sections
  (Scale & Health, Throughput, Compute, Latency, Load) with inference task filtering.
- `2.entities/3.toolsets.md` — Model Serving as fourth source type (grid, create form,
  properties). Vendor Website field. Intro field.
- `2.entities/2.applications.md` — Code App source type (create form + properties).
  Interfaces section (OpenAI Chat Completions). Intro field. External Services subsection
  (JSON-editor-only: externalServices map, appIdentity, allowUserExternalServices).
- `2.entities/1.models.md` — Interfaces section (3 types: OpenAI Chat Completions,
  OpenAI Responses, Anthropic Messages). Intro field.
- `2.entities/4.interceptors.md` — Interfaces section (OpenAI Chat Completions). Intro field.
- `4.assets.md` — Code App source type in Applications grid and create form.

**Deferred (not documented):**
- Analytics v2 (items 28-32): Preview feature gated by ANALYTICS_ENABLED env var.
  Query builder, tables management, AI query assistant, column display names.
  Still evolving rapidly — document when GA.

**Three-source verification:** All 37 items from git tag annotations (5 repos),
component release notes (DM 0.19.0 upgrade plan, eval-fw 0.2.0 migrations), and
DIAL 1.46 platform release notes reached a verdict. All flags resolved via source
investigation (externalServices from BE CoreApplication.java, interfaces from FE
PR #3945, Code App from FE PR #3795, Model Serving from FE PR #3815).

**Scratchpad:** Full reconciliation table at
`<scratchpad>/reconciliation-1.46.md` (37 items, all with verdicts).

### Key learnings from 1.46
- `externalServices`, `appIdentity`, `allowUserExternalServices` are backend-only in
  0.19.0 — no dedicated FE form, accessible only via JSON editor. Documented as such.
- `dynamicallyRegistered` is a new boolean in `ResourceAuthSettings` (used in external
  services auth and potentially toolset OAuth). No dedicated UI field.
- Analytics v2 is a major new section (Query Builder, Tables, AI assistant) but entirely
  behind `ANALYTICS_ENABLED` env var and marked [Preview]. Correct to defer.
- `gh` CLI is not available in this environment — use WebFetch for GitHub PR investigation.
- Eval-metrics 0.1.0 is the first named component release — backend service only.
- Build verification still pending (user may be running it in their own console).

## 1.47 + 1.48 catch-up — COMPLETED (hybrid approach)

### What was done

Used a hybrid approach: built reconciliation tables for BOTH 1.47 (41 items) and 1.48
(50 items), then merged into a per-page edit plan and wrote all edits once against the
1.48 final state. This avoided touching the same pages twice.

**Reconciliation tables:** `<scratchpad>/reconciliation-1.47.md` (41 items) and
`<scratchpad>/reconciliation-1.48.md` (50 items). Per-page edit plan at
`<scratchpad>/per-page-edit-plan.md`.

**Pages updated (16 of 25 pages needed edits):**
- `0.index.md` — Catalog menu group, config file visibility, updated asset/publication lists
- `2.entities/1.models.md` — Cache pricing, OpenAI Embeddings, Translator mode, catalog fields, vendor website
- `2.entities/2.applications.md` — Override name, catalog fields, skills supported, DIAL Native auth
- `2.entities/3.toolsets.md` — Catalog fields
- `2.entities/4.interceptors.md` — Override name
- `4.assets.md` — Skills section, Models section, Catalog section, role-based access for apps/toolsets
- `5.deployments/1.images.md` — Scoped git credentials
- `5.deployments/2.container-management.md` — GPU utilization metrics
- `7.publications-and-review.md` — Skills in publication types
- `8.audit/1.activity-and-rollback.md` — Platform model audit tabs, Since Creation time range
- `10.usage-limits-and-cost-control.md` — Cache pricing, calendar-period limits
- `12.evaluation/0.index.md` — Multi-turn, multi-request, overall score, cancellation, API support
- `12.evaluation/1.metrics.md` — Metric providers
- `12.evaluation/2.datasets.md` — Multi-turn schema type, Valid column (was Enabled), tags
- `12.evaluation/3.test-suites.md` — API support, overall score, test case overall score, multi-turn,
  multi-request, tags filter, null polarity, deployment validation, username resolution, metric
  table view, trends cards, try-out improvements
- `12.evaluation/4.runs.md` — Cancel/stop, import results, overall score, aggregated metrics,
  comparison Summary tab, only-matching mode, metric eval latency

**Deferred (not documented):**
- Analytics v2 (all items): Still [Preview], gated by ANALYTICS_ENABLED.
- Platform Translators standalone page: [Preview] in 1.48. Translator concept documented in Models Interfaces section.
- Cost cards in evaluation runs: FE #4554 temporarily hides them in 0.21.0.

**Baselines updated:** manifest.yaml baselines now at FE/DM/BE 0.21.0, eval-fw 0.4.0, eval-metrics 0.3.0.

### Key learnings from 1.47+1.48
- Hybrid approach (reconcile two releases, write once) is effective — avoids page churn
  while maintaining three-source completeness per release.
- Enabled/Disabled test case model is replaced by Valid/Invalid schema validation.
  `disabledTestCaseIds` removed entirely.
- Skills are a major new asset type spanning Assets, Publications, and the entity system.
- Catalog menu group consolidates platform-level entities alongside user assets.
- Calendar-period limits are a behavioral change (rolling → calendar windows).

## UI-vs-docs comparison (live admin at admin.eks.uat.dial.parts)

Phase 3 covered changes via git-tag reconciliation but missed quiet UI additions.
This phase walks every admin page on the live UAT instance (FE 0.21.2, BE 0.21.0,
Core 0.48.0) and compares field-by-field against the docs.

### Models page — COMPLETED

Compared `2.entities/1.models.md` against live Entities→Models UI.

**Changes written:**
- Removed Vendor Website, Catalog Properties, Catalog Schemas from Personalization
  table — confirmed NOT in Entities→Models FE code (only in Assets/Toolsets and
  Platform Models).
- Removed Hashing Order from Advanced Options — 0 hits in entire FE repo; removed
  from product.
- Removed Interfaces section — FE code explicitly sets `isInterfacesHidden = true`
  for Entities→Models view (only shown on Applications, Interceptors, Platform Models).
- Added "Allow resume" toggle to Feature Flags (Session & Access group).
- Updated Upstream Configuration: renamed "Chat completion endpoint" → "Upstream
  Endpoints", documented expandable fields (Base URL, Responses endpoint, Keys,
  Extra Data, Secret Extra Data).
- Updated Tokenizer Model: changed from text field to toggle + selector description.
- Updated Cost Unit: added scale qualifier mention.
- Updated Audit tab: documented 4 sub-sections (Dashboard, Traces, Conversations,
  Activities).

**Key discoveries:**
- `isInterfacesHidden` in `UpstreamEndpoints/Endpoint/Endpoint.tsx` — Interfaces
  rendering is controlled per-view. Hidden for Entities→Models and Routes.
- `catalogProperties`/`catalogSchemas` — only on Platform Models, Applications,
  Toolsets (via Catalog section), NOT Entities→Models.
- `vendorWebsite` — only in `Assets/Toolsets/View/Properties.tsx`.
- FE repo uses `development` branch (not `main`) — important for raw file URLs.
- `$GITHUB_TOKEN` env var is available for API calls; `gh` CLI is not installed.

### Applications page — COMPLETED

Compared `2.entities/2.applications.md` against live Entities→Applications UI
(both App Runner and Endpoint type apps) + FE source code.

**Changes written (13 findings):**
- Removed ID from grid columns — not in `APPLICATIONS_COLUMNS`.
- Removed Vendor website, Catalog properties, Catalog schemas from Properties
  table — only in Assets/Toolsets views, not Entities→Applications.
- Removed Code App from Create modal source types — only in
  `ASSET_APPLICATION_SOURCE_ITEMS`, not Entities view.
- Removed Skills supported toggle — zero hits for `skillsSupported` in FE repo.
- Removed Caching from feature groups list — not in `applicationSwitchGroups`.
- Removed Interfaces section from Properties — not rendered in Entities→Applications
  UI (confirmed by both UI walk and FE source: no Interfaces editor in admin-BE view).
- Added Temperature supported toggle (Sampling & Output Control).
- Added Parallel tool calls toggle (Tools / Function Calling).
- Added Allow resume toggle (Session & Access).
- Updated Audit tab to list 4 sub-tabs: Dashboard, Traces, Conversations, Activities.
- Removed ID from Roles grid columns — not visible in UI.

**Key discovery:**
- Changelog-driven catch-up put 5 items on the wrong page: Code App, Catalog fields,
  Interfaces, Skills supported were written into Entities→Applications during 1.46-1.48
  catch-up but belong to Assets→Applications or don't exist. Lesson recorded in
  `m2-verify-and-write.md`.

### Pages remaining
- Entities/Toolsets — NEXT
- Entities/Interceptors
- Entities/Routes
- Builders
- Catalog (Platform Models, Interceptors, Translators, Routes, App Runners, Roles, Keys)
- Assets
- Deployments (Model Servings, MCP Containers, Interceptor/Adapter/Application Containers, Images)
- Access Management
- Approvals
- Audit
- Evaluation
- Analytics (Dashboards, Tables, Pipelines, Queries, Sessions)

## Next step

**Phase 3 is COMPLETE.** The guide now covers DIAL 1.48.

Remaining work:
- **UI-vs-docs comparison** — IN PROGRESS (see above). Models done, Applications done, Toolsets next.
- **Build verification** — run `npm run build` to confirm all links resolve (ask user
  first — they may have it running).
- **Screenshot recapture** — nearly all updated pages need screenshots refreshed. Full
  recapture list to be compiled.
- **Phase 4 (automation)** — trigger/PR/agent-in-CI. NOT STARTED.

## Gotchas / environment
- Repo rule: **never commit/push** without explicit permission (user handles git).
  This branch's work is uncommitted on purpose.
- **Never upgrade/install packages** without explicit permission.
- `gh` CLI is NOT available in the dev environment (it IS in GitHub Actions) — that's
  why "open the PR" is deferred to the automation phase.
- Windows: git needs `core.longpaths=true` (scripts set it); subprocess git calls
  decode UTF-8 explicitly (en.ts/diffs break cp1252).
- Shallow clones / tag fetches of the 5 repos cache under the OS temp dir
  (`admin-guide-sync-cache/<repo>`); they persist within a session.
- `resolve_version` reads `docs/releases` from the CURRENT branch — make sure the
  target release folder is present (pull from origin/main if needed, as 1.48 was).
- User often has `npm run build` running in their own console — don't duplicate it
  unless asked or unless verifying your own changes.
