# PR #555 — Review Comment TODO / Triage

**PR:** [epam/ai-dial#555 — "All changes in feature/doc_improvements branch"](https://github.com/epam/ai-dial/pull/555)
**Branch:** `feature/doc_improvements` → `main` · **State:** OPEN
**Scope of this document:** every review comment on PR #555, triaged for **clarity** (do we understand what is being asked), **impact** (what/how much has to change), **caveats** (risks, dependencies, things to verify), and **other important details**.

## How to read this document

537 inline review comments were left, but they are heavily duplicated (parallel `CC @sr-remsha` acknowledgments, repeated "screenshot outdated" notes, and one theme — Redis→Valkey — repeated across ~30 files). To keep this actionable, comments are grouped:

- **Part A — Cross-cutting themes.** One decision/action resolves many comments at once. Do these first.
- **Part B — Section-by-section substantive comments.** Unique, content-bearing feedback that needs a per-item decision.
- **Part C — Noise / already-resolved.** Comments that need no independent action (CC pings, "screenshot committed" replies).
- **Part D — Prioritized action plan.**

### Reviewer map (line-comment counts)

| Reviewer | Count | Area of focus |
|---|---:|---|
| VolhaBazhkova | 179 | Chat User Guide text + screenshot accuracy |
| PolinaGurinovich97 | 87 | `CC @sr-remsha` pings (noise) |
| siarhei-fedziukovich | 73 | Administering DIAL (Admin Panel accuracy) |
| sr-remsha | 41 | Structure + "screenshot committed" replies |
| kamiakou-epam | 37 | Cloud/production deployment (Redis→Valkey, ingress) |
| andrii-novikov | 37 | Quick Apps 2.0 schema/config correctness |
| adubovik | 25 | Interceptors, Adapters, SDK reference scope |
| Mmefko | 19 | Observability (OTEL vs Prometheus) |
| YuriyIvon | 15 | Quick starts, positioning/comparisons, architecture |
| Pasichniuk | 11 | Deployments (images, container management) |
| serguei-gorokhov | 6 | Security & governance (authN/authZ) |
| alexey-ban | 5 | Production readiness |
| valerydluski | 2 | Mind Map Studio |
| olegmikhnovich | 1 | n8n integration |
| sdryapko | 3 (issue-level) | Evaluations, Code Apps |

> Note: the only PR-level review body is a stray `"t"` from siarhei-fedziukovich — ignore.

---

## Applied changes log — session 2026-08-10 (trivial batch)

The "truly-trivial, zero-dependency" batch was applied to `feature/doc_improvements`. Not committed (repo rule: user handles version control). Status key: ✅ applied · ⏭️ deferred · ⏸️ already present.

| Item | File | Change | Status |
|---|---|---|---|
| B3.1 | `.../quick-app-2/1.create-via-ui.md:62` | Knowledge-base wording (andrii-novikov `suggestion`) | ⏸️ already present verbatim |
| B3.3 | `.../quick-app-2/2.create-via-api.md:19` | Core-URL clarification (andrii-novikov `suggestion`) | ⏸️ already present verbatim |
| B3.4 | `.../9.tool-sets/2.mcp-server-integration.md:188,196` | `audience` → `aud` (JSON key + prose) | ✅ applied |
| B5.8 | `5.administering-dial/5.deployments/1.images.md:101` | dialog title `Save new version` → `Save as new version` | ✅ applied |
| B6.8 | `6.chat-user-guide/5.files.md:16,27` | `My files` → `My Files` (label, link text, heading; anchor `#my-files` unchanged) | ✅ applied |
| B6.6 | `6.chat-user-guide/3.marketplace-and-apps.md:41` | filter label `Source` → `Sources` | ✅ applied |
| B2.10 | `2.understand-dial/5.foundations/2.dial-evolution.md:46` | "roadmap is not publicly available" → link to https://dialx.ai/roadmap | ✅ applied |
| B4.5 | `.../sdk-reference/1.dial-app.md:61` | `during streaming responses` → `during SSE streaming responses` | ✅ applied |
| B5.13 | `5.administering-dial/img/100.png` | rename to meaningful name | ⏭️ deferred — **image is orphaned** (no reference in `docs_v2/`); nothing to re-point, and a meaningful name needs visual inspection. Decide **delete vs keep+wire-in** instead of a blind rename. |

> Reminder for the reviewer-reply step: items 1–2 need no code change (already correct) — reply confirming; item 9 needs a delete/keep decision, not a rename.

---

## Part A — Cross-cutting themes (do these first)

### A1. Redis → Valkey replacement (~30 comments, kamiakou-epam + YuriyIvon + alexey-ban)

- **Files:** all of `4.operating-dial/2.cloud-deployment/*` (aws, azure, gcp, generic-kubernetes), `4.operating-dial/7.production-readiness/*` (0.index, 1.high-availability, 3.secrets-management, 4.backup-and-restore, 5.upgrade-procedure), `2.understand-dial/2.architecture/2.dial-stack.md`, `4.operating-dial/2.cloud-deployment/0.index.md:29`.
- **What's asked:** Redis was replaced by **Valkey** in [dial-core 6.0.0](https://github.com/epam/ai-dial-helm/releases/tag/dial-core-6.0.0) and [dial 7.0.0](https://github.com/epam/ai-dial-helm/releases/tag/dial-7.0.0) Helm charts. Every mention of Redis in deployment/HA/backup context must be reviewed and updated. Separately, YuriyIvon (dial-stack.md:33) asks to note that any Redis-compatible managed PaaS (e.g. Azure Cache for Redis) can also be used; alexey-ban (high-availability.md:67) notes "we no longer use Bitnami Redis."
- **Clear?** Yes — unambiguous and evidenced with release links.
- **Impact:** High volume, low complexity. Mechanical find-and-replace-plus-verify across ~10 files, but each occurrence must be checked in context (config keys, chart values, port numbers may differ, not just the name).
- **Caveats:**
  - Confirm the exact cutover: is Redis still *supported* (compatibility mode) or fully replaced? Valkey is Redis-protocol-compatible, so "Redis-compatible PaaS still works" (YuriyIvon) and "we use Valkey now" (kamiakou) are both true — the docs should say Valkey is the default/bundled store while any Redis-protocol-compatible service remains valid.
  - Do NOT blanket-rename in conceptual pages where "Redis" describes the *protocol/ecosystem* rather than the bundled component.
  - Requires a `last_verified` bump on every touched page.
- **Owner hint:** kamiakou-epam (raised all deployment instances).

### A2. Chat User Guide screenshots outdated (~120 image comments, VolhaBazhkova; partly resolved by sr-remsha)

- **Files:** `6.chat-user-guide/img/*.png` (app-builder, app-link, chat, compare*, conv-menu, delete-*, deploy-code-app*, dial-marketplace*, edit-*, home, logs-code-app, marketplace-home-select, math-prompt*, mindmap2, model-link, move_prompt, publish-*, quick-app*, register-*, remove-*, replay*, share-*, system_prompt, temperature, toolset-*, unpublish-*, versioning*, workspace-talk-model, regenerate, like, and more).
- **What's asked:** Update screenshots to match current UI. Recurring specific changes: **new DIAL logo**; new **three-dots (`...`) context-menu** design (tracked in [ai-dial-chat#8073](https://github.com/epam/ai-dial-chat/issues/8073)); **radio-button fix**; new menu items (**Info**, **Use**, **View**, **Connect**, **Redeploy**); auto-populated publication fields; new features (Token limits, Process files, File tools, filter counts).
- **Clear?** Yes, individually. Each comment names the exact delta.
- **Impact:** Very high effort — requires authenticated DIAL Chat access to re-capture ~60+ screenshots (see memory: *screenshots require login, not anonymous*). Several depend on **ai-dial-chat#8073** landing first (bookmark + three-dots icon redesign) — VolhaBazhkova explicitly says "better to update the screenshot after the fix" for those.
- **Partial status:** sr-remsha has already committed replacements for a batch: `create-pt`, `app-wizards`, `compare-3/4`, `compare`, `conversation-menu`, `dial-marketplace`, `dial-marketplace5`, `home`, `isolated_view_mode`, `marketplace-home-select`, `mindmap2`, `prompt-menu`, `quick-app-builder`, `replay1`, `Replay_as_is`, `response-format`, `system_prompt`, `temperature`, `toolset-editor`, `workspace-talk-model`. `app-link` — sr-remsha asked VolhaBazhkova to re-confirm it may already be current.
- **Caveats:**
  - **Gate on #8073.** For every "three dots"/bookmark comment, capturing now guarantees rework. Decide: block those screenshots until the ui-kit fix ships, or accept a second pass.
  - Text must be re-validated alongside screenshots — several comments (e.g. `quick-app2-starters`, `deploy-code-app2`) note new *features* in the shot, not just cosmetics, which means the surrounding prose is also stale.
  - Track remaining vs. done in a checklist to avoid re-capturing already-fixed ones.
- **Recommended:** maintain a per-image status table; split into "cosmetic (logo/radio)" (do now) vs "blocked on #8073" vs "feature-changed (needs text edit too)".

### A3. "Tool Set" → "Toolset" terminology (~30 comments, VolhaBazhkova; related: siarhei-fedziukovich, andrii-novikov)

- **Files:** `6.chat-user-guide/4.tool-sets.md` (throughout), `6.chat-user-guide/6.sharing-and-publishing.md` (many lines), `6.chat-user-guide/3.marketplace-and-apps.md`, and anywhere "Tool Set(s)" appears.
- **What's asked:** DIAL Chat UI and Admin app use **Toolset** (one word). Standardize. VolhaBazhkova (4.tool-sets.md:2) explicitly says: pick one form and apply globally via search, and flags that the **Admin user guide uses "Tool set"** (lowercase second word) — so there is an existing inconsistency to resolve.
- **Clear?** Yes, but requires a **terminology decision** first.
- **Impact:** Global find-and-replace once the canonical form is chosen — but this **conflicts with the project glossary/style guide**, which currently standardizes on "Tool Set(s)" (see project CLAUDE.md and `docs-planning/glossary.md`).
- **Caveats — IMPORTANT:**
  - This is a **project-wide terminology conflict**, not a local fix. The CLAUDE.md conventions and glossary must be updated in lockstep, or the docs and the style guide will disagree.
  - Decide the single canonical form: **`Toolset`** (matches Chat + Admin UI, reviewer preference) vs `Tool Set` (current glossary). Recommendation: adopt **Toolset** to match the product UI, and amend the glossary + style guide accordingly.
  - After deciding, sweep filenames/anchors too — `#publish-a-tool-set` anchors are referenced in other comments; changing display text may or may not change slugs.
- **Blocker:** get sign-off from docs lead before the global sweep.

### A4. Quick Apps 1.0 removal + Quick Apps 2.0 schema correctness (~30 comments, andrii-novikov + others)

- **Files:** `3.building-with-dial/1.apps/2.quick-apps/0.index.md`, `.../coverage-status.md`, `.../1.quick-app-2/1.create-via-ui.md`, `2.create-via-api.md`, `3.create-via-config.md`, `4.working-with-tools-and-agents.md`, `5.tutorial-agent-loop-ui.md`, `6.tutorial-agent-loop-api.md`, `7.tutorial-agent-loop-config.md`, `8.examples.md`, `9.tool-sets/*`; glossary QuickApps entry.
- **What's asked (two strands):**
  1. **Remove Quick Apps 1.0.** andrii-novikov (0.index.md:15) "propose to remove QuickApps 1.0"; (0.index.md:15 again) "cannot say they are fully supported"; YuriyIvon/glossary:280 "check with the team if we keep both QuickApps and QuickApps 2.0."
  2. **Fix the 2.0 schema/config throughout** — these are factual errors:
     - `name` is **deprecated → use `deployment_id`** (0.index.md:99, 8.examples.md:24)
     - `starters` **deprecated → `conversation_starters`** (8.examples.md:35)
     - `applicationTypeSchemaId` is a **top-level property**, not nested under `reference` (3.create-via-config.md:115 & 263, 7.tutorial-agent-loop-config.md:75)
     - missing `dial:applicationTypeSchemaEndpoint` (7.tutorial-agent-loop-config.md:43)
     - tool query field is **`query`, not `text`** (4.working-with-tools-and-agents.md:99, 6.tutorial-agent-loop-api.md:144, 7...:66)
     - **no `{{variable}}` support** (0.index.md:64, 6.tutorial-agent-loop-api.md:123)
     - **no built-in RAG** in Quick Apps (0.index.md:147, coverage-status.md:35, examples need to connect a RAG tool — 8.examples.md:45)
     - properties table stale — "Starters deprecated, new properties added" (0.index.md:86); "there is no such feature" (coverage-status.md:38); `conversation_mode` will replace a soon-deprecated field (coverage-status.md:39)
     - **does the create-via-API path even work?** (2.create-via-api.md:1) — reviewer "was not able to create and could not find the endpoint"; "other endpoints outdated as well"
     - "10 iterations ≠ 10 tool calls" (6.tutorial-agent-loop-api.md:196); "core routes are incorrect" (6...:1); no `max_iterations` param (9.tool-sets/5.examples.md:305); "retest all examples, most configs outdated/not working" (9.tool-sets/5.examples.md:1); reference outdated vs fresh schema (9.tool-sets/4.reference.md:1)
- **Clear?** Yes — very specific, code-level corrections.
- **Impact:** **High and blocking.** This is the platform's primary value surface (per project brief). Multiple documented configs and API calls are **factually wrong and won't work**. This isn't editorial — it's correctness.
- **Caveats:**
  - **Verify against the live schema/source**, not against reviewer memory alone — reviewer flags several as "at least X is broken, but maybe not only." Use `docs-researcher` against [ai-dial-quickapps-backend](https://github.com/epam/ai-dial-quickapps-backend) + the current `applicationTypeSchema`.
  - Every config/API example should be **executed** before re-publishing (ties to A5 — CI-test the snippets).
  - The Quick Apps 1.0 removal decision affects sidebar structure, redirects, and the installation guide (see B-Operating: `7.quick-apps-installation.md` is also stale).
  - The `1.create-via-ui.md` UI is described as "outdated" AND sr-remsha has uploaded new screenshots but says "text must be validated and updated to reflect new features" — so screenshots and prose are out of sync here.
- **Owner:** andrii-novikov for schema truth; coordinate with QA-backend team.

### A5. Code snippets / tutorials must be CI-tested (adubovik)

- **Files:** `3.building-with-dial/2.interceptors/1.tutorial-pii-interceptor.md:10`, `3.adapters/1.tutorial-custom-adapter.md:12`. (Applies by extension to A4 Quick App examples.)
- **What's asked:** Integrate tutorial code into project CI as tests, the same way [dial-cookbook](https://github.com/epam/ai-dial/tree/main/dial-cookbook) examples are tested — otherwise there's no guarantee the snippets run.
- **Clear?** Yes.
- **Impact:** Medium-high, and it's **infrastructure/process work**, not doc editing — needs a test harness that extracts and runs the tutorial code. Broad payoff (prevents the exact class of breakage A4 is full of).
- **Caveats:** Requires runnable environment (DIAL Core + a model or echo). Decide scope: which tutorials become CI-gated. This is a roadmap/"sustainability" item, likely a separate follow-up issue rather than part of this PR.

### A6. SDK / low-level reference belongs with the source code, not the docs site (adubovik)

- **Files:** `3.building-with-dial/2.interceptors/2.sdk-reference.md` (10, 24, 28), `2.interceptors/4.examples.md:10`, `5.developer-tools/1.sdk-reference/*` (0.index.md:34, 1.dial-app.md:21/61/125, 4.exceptions.md:12, 5.telemetry.md:12).
- **What's asked:** Don't reproduce SDK method signatures, module tables, exception lists, and telemetry internals in the high-level docs — they are fragile (version-coupled to source) and belong in the SDK repo's own docs. There's a dedicated issue for telemetry: [ai-dial-sdk#249](https://github.com/epam/ai-dial-sdk/issues/249). Guiding principle he states: *"Do I help the reader answer their question, or overload them with redundant info?"* Prefer **usage-by-use-case** over type signatures; document only stable integration points (e.g. which HTTP clients support propagation, that only **SSE** streaming responses are affected — not "every streaming response").
- **Clear?** Yes, and philosophically consistent across all his SDK comments.
- **Impact:** **Structural/scope decision.** Potentially deletes or heavily trims several pages (`sdk-reference/*`, interceptor `sdk-reference.md`, `examples.md`). Affects the recommended site structure.
- **Caveats:**
  - This partially **contradicts the improvement roadmap's goal** of "consolidating configuration/reference on-site (stop redirecting to GitHub READMEs)." Reconcile: the roadmap wants *config reference* on-site; adubovik wants *SDK API reference* to stay with source. These aren't the same thing — config/behavior reference on-site is fine; mirroring SDK class signatures is what he objects to. Draw the line explicitly in the style guide.
  - Get docs-lead alignment before deleting pages that were deliberately created.
  - `4.exceptions.md` / `5.telemetry.md` — coordinate with SDK repo owners so the content lands there (link out, don't just delete).

### A7. Prefer Mermaid / visual diagrams (YuriyIvon, adubovik)

- **Files:** `1.home/5.architect-overview.md:22` ("make a visual diagram"), `3.adapters/1.tutorial-custom-adapter.md:25` ("Mermaid sequence diagram, supported by GitHub").
- **Clear?** Yes.
- **Impact:** Low-medium. Replace ASCII/prose flows with Mermaid. Docusaurus + GitHub both render Mermaid.
- **Caveats:** Confirm Mermaid is enabled in the Docusaurus theme config; keep diagrams theme-aware (light/dark). Architect overview currently uses a ```text block — good candidate.

---

## Part B — Section-by-section substantive comments

### B1. Home / Quick starts (`1.home/`)

| # | Comment (author, file:line) | Clear? | Impact | Caveats / notes |
|---|---|---|---|---|
| B1.1 | Reshape quick starts on the **full Docker Compose incl. Keycloak + Admin**, not the minimal "developer-only" compose (YuriyIvon — developer-quick-start:25, devops-quick-start:26, admin-quick-start:16) | Yes | High — rewrites 3 quick starts | Strategic direction change. Admin quick start currently links DevOps quick start as prereq but **DevOps QS doesn't include Admin** (his admin-quick-start:16 note) — the whole prereq chain is broken. Decide the canonical compose bundle first. |
| B1.2 | **Merge DevOps QS into Developer QS** — "no significant difference" (adubovik — devops-quick-start:10) | Yes | Medium — deletes/absorbs a page | Overlaps with B1.1. If quick starts are reshaped around one full compose, this consolidation likely happens naturally. Check for missing details before deleting. |
| B1.3 | Architect overview needs a **visual diagram** (YuriyIvon:22) | Yes | Low | See A7. |
| B1.4 | Admin QS: `Deployments` section is optional (needs Deployment Manager); use **Assets** instead; **Entities** materialize to Core config while Assets store apps/toolsets in marketplace/resource buckets; add an **Assets** section; "can see at least one entity" is wrong (empty env is valid); published resource should appear in Assets (siarhei-fedziukovich — admin-quick-start:24/28/33/42) | Mostly | Medium | Requires Admin Panel domain knowledge. Reconcile with B-Admin comments on the same concepts (entities vs assets vs deployments). |
| B1.5 | End-user guide: page "has almost no meaning" — it's really a chat quick start; drop "SaaS" wording; "model selector" → **agent selector** (can be non-model); "select an agent"/"enter your prompt"; the model list isn't limited to "document analysis/summarization/knowledge exploration" — it shows whatever the instance exposes; mention configurable auth providers + prior access (sr-remsha — end-user-guide:2/16/23/27/28/34/21) | Yes | Medium | Rename/repurpose the page; terminology (**agent** vs model) recurs across Chat guide. "SaaS" wording objection also raised by sdryapko (see B6) — decide globally. |
| B1.6 | Home index: "make sure this definition of DIAL meets expectations"; add a bullet per role in the roles table (sr-remsha — 0.index.md:12/29) | Partly | Low-Medium | "Definition meets expectations" needs a stakeholder review of the DIAL one-liner — get canonical wording from product. |
| B1.7 | Release-notes videos don't display on client-side nav (refresh fixes) — applies to **all** release-note videos (PolinaGurinovich97 — release-notes-1.38.md:17) | Yes | Medium (bug, not content) | This is a **Docusaurus/site bug**, not a content fix — likely a `<video>` vs MDX hydration issue on route change. Investigate the changelog generator/video embed component. Note: changelog files are generator-owned (see CLAUDE.md) — fix the template/component, not the emitted file. |

### B2. Understand DIAL (`2.understand-dial/`)

| # | Comment (author, file:line) | Clear? | Impact | Caveats / notes |
|---|---|---|---|---|
| B2.1 | DIAL vs app builders: explicitly state Quick Apps' **no-code limitation** — canvas builders allow deterministic flows; Quick Apps are **fully agentic** (model + system prompt + tools + knowledge base only) (YuriyIvon — dial-vs-app-builders:10) | Yes | Low | Accurate framing; aligns with A4 (no variables/flows). Add a short limitation note. |
| B2.2 | DIAL vs frameworks: "No" for **Unified API across providers** is unfair — frameworks *do* abstract across models (YuriyIvon — dial-vs-frameworks:44) | Yes | Low | Soften the comparison table: frameworks offer *code-level* provider abstraction; DIAL offers a *deployed service* boundary. Change cell from "No" to a nuanced value. |
| B2.3 | DIAL vs AI studios: "**Vendor/cloud-agnostic**" and "**Portability/lock-in**" bullets are the same point (YuriyIvon — :37) | Yes | Low | Merge the two bullets. |
| B2.4 | DIAL vs AI studios: "No (vendor's own)" for cross-vendor models is unfair — e.g. Vertex AI offers Claude (limited) (YuriyIvon — :46) | Yes | Low | Qualify the cell ("Limited / vendor-curated" rather than flat "No"). |
| B2.5 | DIAL Stack: note any Redis-compatible PaaS (Azure Cache for Redis) works (YuriyIvon — dial-stack:33) | Yes | Low | See A1 — fold into the Valkey update. |
| B2.6 | Application server: verify the **evaluation toolkit is not RAG-only**; whole eval section may need updating (YuriyIvon — application-server:36; PolinaGurinovich97 same line: "Eval for different use cases, NOT ONLY RAGs") | Yes | Medium | Ties to sdryapko's issue-level comments (B6) that the **old eval toolkit is being replaced by Admin Panel evaluation**. Don't just fix "RAG-only" — the section may be obsolete. Confirm current eval story with team before editing. |
| B2.7 | Unified API overview: "Are **custom renderers** relevant to the Unified API?" (YuriyIvon — :32) | Question | Low | Verify; likely remove if renderers are a Chat concern, not a Unified API concept. |
| B2.8 | Usage limits: explain limits use a **rolling window** (not calendar), computed **per-user**; no budgets tied to other entities yet (YuriyIvon — usage-limits:22) | Yes | Low-Medium | Important accuracy fix. Cross-check with Admin cost-limit comments (B5) — siarhei-fedziukovich says limits are **cost-based, not token-based**; align both. |
| B2.9 | Glossary: custom apps can expose **custom APIs** beyond Unified API — "not sure if needed here" (YuriyIvon — glossary:60) | Partly | Low | Reviewer ambivalent. Ties to siarhei-fedziukovich's point that routes/MCP use custom REST/MCP endpoints, not Unified API. Decide depth for glossary vs entities pages. |
| B2.10 | dial-evolution: DIAL roadmap **is** public — https://dialx.ai/roadmap (YuriyIvon — :46) | Yes | Trivial | Add the link; remove any "roadmap not public" claim. |
| B2.11 | Glossary: decide whether to keep **both QuickApps and QuickApps 2.0** (YuriyIvon — glossary:280) | Yes | Low | See A4 (1.0 removal decision drives this). |
| B2.12 | Security/AuthZ overview article is a false-impression + under-structured; needs a **registry/summary table** of all authN/authZ aspects with "editable where and by whom" (serguei-gorokhov — auth-and-access-control/0.index.md:1, and authentication-and-access-control.md:1/68/83/97) | Yes | **High** | The most substantive conceptual feedback. Current article implies access is config-file-only — but Admin Panel and Core APIs also manage access (folder rules, publications, sharing). He supplies the exact 7-row registry to build. Restore "how rules combine," add links to Publication/PRK/sharing/config. **Caveat:** authZ is sensitive — accuracy matters; keep in sync with the Administering-DIAL access pages (B5) and the conceptual article. His overall verdict is "mixed but no factual errors" — simplification went too far for expert readers. |

### B3. Building with DIAL — Apps / Quick Apps (`3.building-with-dial/1.apps/`)

- **Quick Apps schema/config correctness + 1.0 removal:** see **A4** (all of andrii-novikov's ~25 comments consolidated there).
- Additional itemized:

| # | Comment (author, file:line) | Clear? | Impact | Caveats / notes |
|---|---|---|---|---|
| B3.1 | create-via-ui: knowledge-base wording — suggested rewrite: "click **+ Add** and select DIAL file or upload; adds file info to app context, lets orchestrator/tools request its content" (andrii-novikov — 1.create-via-ui.md:62) | Yes (suggestion) | Trivial | Apply the GitHub `suggestion` verbatim. |
| B3.2 | create-via-ui:95 "Remove this, not supported"; :99 attachments need explicit types or `*/*`; :1 "guide describes outdated UI" (andrii-novikov) | Yes | Medium | Screenshots already re-uploaded by sr-remsha but prose not yet validated (see A2/A4). |
| B3.3 | create-via-api:19 suggested Core-URL clarification (andrii-novikov, `suggestion`) | Yes | Trivial | Apply suggestion. |
| B3.4 | Tool Sets index: **MCP can be used within a specific Quick App** (andrii-novikov — 9.tool-sets/0.index.md:51); `aud` not "audience" (…/2.mcp-server-integration.md:188) | Yes | Low | Factual fixes. |
| B3.5 | tutorial-agent-loop-ui: images show a **Notion toolset** flow — confusing (andrii-novikov — 5...:105) | Yes | Low | Re-capture with a neutral/consistent toolset. |
| B3.6 | Mind Map Studio supports **PPTX** — file list outdated (valerydluski — 4.mind-map-studio/0.index.md:26 & 1.authoring-workflow.md:41) | Yes | Low | Add PPTX; verify full current format list from source. |

### B4. Building with DIAL — Interceptors / Adapters / SDK / Integrations

- **SDK-reference scope objections:** see **A6**.
- **CI-test tutorials:** see **A5**.

| # | Comment (author, file:line) | Clear? | Impact | Caveats / notes |
|---|---|---|---|---|
| B4.1 | Adapters index: explain how **adapters relate to DIAL models vs DIAL applications** (often confused); adapters *implement* models; models have per-token pricing, upstream load-balancing, per-upstream auth (adubovik — adapters/0.index.md:18) | Yes | Medium | Core conceptual clarification — high reader value. Verify the exact distinctions with source. |
| B4.2 | Adapters: define "**Adapters**" precisely — DIAL-supplied set (OpenAI/Vertex/Bedrock) or *any* service implementing a DIAL model? (adubovik — :29). Also "streaming/embeddings/all Unified API features" needs this scoping. | Yes | Medium | Definitional; drives B4.1. Decide the canonical definition once. |
| B4.3 | Adapters: **vet retired model classes** — PaLM is dead (adubovik — :52); supported-providers "(direct)" is unclear/redundant (adubovik — 2.supported-providers.md:22) | Yes | Low | Currency pass on the provider/model list. |
| B4.4 | custom-adapter tutorial: show **load-balancing** adapter honoring `X-UPSTREAM-ENDPOINT` / `X-UPSTREAM-KEY` / `X-UPSTREAM-EXTRA-DATA` (adubovik — :134); where to store the model **API key**? (:82); use a **Mermaid** sequence diagram (:25) | Yes | Medium | Adds real depth. Ties to A5 (make it CI-tested) and A7 (Mermaid). |
| B4.5 | dial-app SDK: don't document propagation *mechanism* (impl detail) — list *which HTTP clients* support it; only **SSE** streaming (not "every streaming response") (adubovik — 1.dial-app.md:125/61); don't show extensible type signatures — show usage (adubovik — :21); module table rows ("Module: aidial_sdk / Description: DIALApp entry point, HTTPException") are meaningless (adubovik — 0.index.md:34) | Yes | Medium | Part of A6 rework. |
| B4.6 | n8n integration: see **actual patches** in [PR #584](https://github.com/epam/ai-dial/pull/584) (olegmikhnovich — 3.workflow-automation/1.n8n.md:1) | Yes | Low-Medium | Pull the corrected content from PR #584. Caveat: coordinate so #555 and #584 don't conflict on the same file. |
| B4.7 | sidebars: why are Interceptors & Adapters "Extension points" but **Apps aren't**? (adubovik — sidebars-v2.js:423) | Yes | Low | IA/labeling consistency decision. Either group Apps under extension points or rename the category. |

### B5. Administering DIAL (`5.administering-dial/`) — siarhei-fedziukovich (+ Pasichniuk, sr-remsha)

This section has the densest factual-accuracy feedback. **Overarching (sr-remsha, 0.index.md:1): map doc sections to the Admin Panel UI sections.** Many comments also flag **planned deprecations** — document current state but avoid over-investing in soon-removed features.

| # | Theme | Comments | Impact | Caveats |
|---|---|---|---|---|
| B5.1 | **Index conceptual errors** | approving content writes to **blob, not config file**; asset mgmt uses Core API + core-managed blob (plan: blob config becomes main approach); no separate "approval workflow" — Admin uses Core **approval-api**; `access.admin.rules` does **not** restrict config-file management (any `full_admin` can); EvalFramework possibly a separate component; auth props also in admin-backend config; toolsets = single word `toolsets`; entities definition wrong (routes/MCP use custom REST/MCP endpoints, **not** Unified/OpenAI API); **plans to remove `entities` & `builders` sections**, move `application runners` to unified **Assets**; `conversations` asset already added; `+ application containers` (0.index.md:22–69, many lines) | High | Deep Admin-Panel accuracy rewrite. **Caveat:** several items are "will change in upcoming releases" — decide whether to document present state or near-future. Confirm against [ai-dial-admin-backend configuration.md](https://github.com/epam/ai-dial-admin-backend/blob/development/docs/configuration.md). |
| B5.2 | **Models entity** | `Must match` is not obligatory (override name allowed); **External Endpoint** explanation (direct vs adapter-ref; `source` to be removed mid-term); cost units are **char_without_whitespace / tokens** (no "request" unit); pricing used by **Core real-time**, not by monitoring dashboards; model `ID` = how model is reached in Core/Unified API; display/personalization-name goes into `model` property; `Hashing order` missing from advanced-options screenshot; `Interfaces` block undocumented; "Make available to specific roles" controls visibility (1.models.md:48–313) | High | Precise, code-level. Verify each against admin schema. Roles/visibility wording overlaps B5.6. |
| B5.3 | **Applications entity** | Admin won't grab apps added directly to config after initial start (so "either config or UI" is wrong); `Display version` / `displayVersion`; "Maintainer" (UI) / `author` (config) = operator, free-form; "editable when" maybe not useful; if roles empty **and** "Make available to specific roles" on → nobody has access (2.applications.md:20–196) | Medium-High | Accuracy + a genuine access-control gotcha (empty-roles lockout) worth calling out. |
| B5.4 | **Toolsets entity** | `streamable-http` **or** `sse`; API_KEY + forwardPerRequestKey restriction — is it truly always, or only with a specific auth header? also add note for **Forward auth token** (OAuth Authorization-header conflict); add **static vs dynamic registration** note (dynamic needs fewer props); only header *name* in config (token provided at sign-in); "On this screen" — **no screenshots** in chapter (3.toolsets.md:59–165) | Medium | One item is a **question** (verify the exact restriction condition) — don't document until confirmed. |
| B5.5 | **Builders / Adapters / Interceptor templates** | Split the single `3.builders.md` into per-type pages like Entities (sr-remsha); **Adapters in Admin Panel deprecated** (Core config has no adapter entity — model just links via endpoint/interfaces); **Interceptor template deprecated** (2.entities/4.interceptors.md:72, 3.builders.md:246) | Medium | Structural split + deprecation notes. **Caveat:** don't deeply document features slated for removal — a short "deprecated, use X" note may suffice. |
| B5.6 | **Access management** | Third tab **Folder Storage** undocumented (roles.md:2); limits are **cost per period**, not token-based (roles.md:71 — recurs at 10.usage-limits:36); read-only access set via admin-be config, not [roles] (0.index.md:82); **Export Config doesn't modify config** (0.index.md:82) | Medium | Cost-vs-token error recurs — fix everywhere (also B2.8). Folder Storage is a whole missing page. |
| B5.7 | **Assets** | Single-file page should be **split per asset type** like Entities (sr-remsha, siarhei — 4.assets.md:1/10); `Conversation` asset missing; no `Status` column in latest release; `Code apps` source type added; `external services` + `interfaces` missing; `Forward auth token` not supported for assets / not on UI (4.assets.md:18–220) | Medium | Structural split + currency pass. |
| B5.8 | **Deployments** | `1.images.md`: "Save new version" → "**Save as new version**"; "adapters" vs "AI model adapters" naming inconsistency; messy global-domain-whitelist screenshot (improved since — update) (Pasichniuk). `2.container-management.md`: config change also triggers **RollingUpdate** restart; add **All domains** option; **Node Pool** props undocumented; **env-var config** (mount types, string/file) undocumented; `Type Image` + `Docker Image Reference` are **common** props, not type-specific; GPU only for **model servings**; model-servings flow oddly omitted at :300; Export deployments `Include secrets` description too broad + app containers unmentioned; 4-in-a-row and 3-in-a-row **images with no explanatory text** need per-image sections (sr-remsha). `3.mcp-containers.md`: grid shows **image name, not deployment name**; MCP is a separate file while others are aggregated — be consistent (sr-remsha) | Medium-High | Lots of concrete UI-accuracy gaps + missing config coverage. Container-management is the weakest page. |
| B5.9 | **Audit** | activity/rollback covers only entities(+keys/roles)+builders+deployments — **assets/publications not audited yet**; **Assets** added to UI by mistake, will be removed (1.activity-and-rollback.md:16/32). **Monitoring dashboards**: `+ routes`; token metrics relate only to LLM calls (not toolsets/routes); two money columns now (`Money` + `Total Money`); renamed metric tables (Calls by MCP/Tools/Parent Deployments/Project); app **or** global `route` deployment; no **Reactions** in usage_log (separate table); `Completion Time` column rename (several lines); MCP operation ≠ tool (e.g. resources/list, initialize); "HTTP method" (2.monitoring-dashboards.md:28–257) | Medium | Column-name/label currency pass against current Admin UI. |
| B5.10 | **Config backup / global settings** | export format is **zip or json**; component selector has **2 groups** (deployments; entities/builders/access-mgmt), doc reads as if 4 separate items (1.config-backup...:60/76) | Low-Medium | Clarify selector grouping. |
| B5.11 | **Publications & review** | "moved to Public **folder**" → **bucket** (actual folder set in publication request); do we need to **duplicate application asset properties** here, or link to Assets→Applications? (7.publications-and-review.md:34/83) | Low | Prefer linking over duplication. |
| B5.12 | **User management** | admin role also settable via admin-panel BE static settings (but BE slated for removal) (9.user-management.md:68) | Low | Deprecation-aware note. |
| B5.13 | **Image naming** | `img/100.png` — use **meaningful image names** (sr-remsha) | Yes | Trivial but good hygiene; rename + fix references. |

### B6. Chat User Guide (`6.chat-user-guide/`) — VolhaBazhkova (text) + sr-remsha

- **Screenshots:** see **A2**. **"Tool Set"→"Toolset":** see **A3**.
- Substantive text corrections (high accuracy value; VolhaBazhkova knows the product deeply):

| # | Theme | Representative comments | Impact | Caveats |
|---|---|---|---|---|
| B6.1 | **Link precision** | Dozens of "link goes to the whole chapter, should be the specific `#anchor`" (conversations, prompts, sharing, tool-sets, marketplace, settings, files) — e.g. `#conversation-settings`, `#create-a-prompt`, `#variables`, `#parameterized-replay`, `#publish-a-tool-set`, `#my-workspace`, `#duplicate` | Medium (volume) | Mechanical but must verify each anchor exists (some target sections **don't exist yet** — e.g. a Prompt "Duplicate" chapter must be **created** before linking; a Toolsets-in-Marketplace section must be created). **Caveat:** internal links must be relative `.md#anchor`, not the `docs.aks.dev.dial.parts` absolute URLs used in the review (see CLAUDE.md link rules). |
| B6.2 | **Agent vs model terminology** | "By default shows the **default agent from config**, not the last used" (conversations:141/260); button is "**Use model**/**Use application**" (261); it's an **agent selector**, not model selector (end-user-guide) | Medium | Recurs with B1.5. Standardize "agent" language. Factual: default-agent behavior changed. |
| B6.3 | **Naming conventions changed** | Names now **255 bytes (UTF-8)**, not 160 chars; dot-at-start rules differ for folders vs chats; "and are removed"/"trailing dot removed" wording wrong now (error/revert behavior instead); move-to-folder redesigned (any folder, not just parent) — across conversations.md, prompts.md, files.md | Medium | Consolidate naming rules in **one** place (conversations) and link from prompts/files (per B6.1). Verify exact current limits/behavior. |
| B6.4 | **Duplicate available for all chats/prompts** | Repeated false claim that Duplicate is "shared-only" — actually works for organization/shared/personal (conversations:281, prompts:149, and sharing refs) | Low-Medium | Fix everywhere; create the missing "Duplicate" sub-sections. |
| B6.5 | **Sharing & publishing** | Toolsets **cannot be shared** (only published) — remove share claims (4.tool-sets.md:12/77, sharing:12); publication fields **auto-populated** (name/author) — not required (sharing:188/210/232); items **selected by default** → user *un*selects (sharing:191); version dropdown doesn't exist for owner (sharing:116); sharing not stopped on name/version/icon change (only icon shows default) (sharing:141); "Attachments Manager" → now just **Files** (sharing:136); publish steps are one modal now — **de-duplicate** the near-identical per-type step lists (sharing:210/232/260); remove code-app-only actions (deploy/undeploy) from generic text (sharing:127); questionable link to technical AuthZ page for end-users (sharing:229, tool-sets:64) | **High** | Many are **factual errors about current behavior**, plus a structural de-dup opportunity (one publish flow, per-type screenshots). Verify against live Chat. |
| B6.6 | **Marketplace & apps** | Title "apps" too informal (3.marketplace-and-apps:2); create a dedicated **Toolsets in Marketplace/My workspace** section (referenced by many tool-sets.md links); "Sources" (missing s) (:41); document new features **Process files** (:199) and **File tools** (:211); delete-when-not-published wording confusing — deletable anytime (:411) | Medium | Creating the Toolsets-in-Marketplace section unblocks several B6.1 links. |
| B6.7 | **Conversations page specifics** | Compare mode unavailable for agents needing config (add the exact warning + screenshot) (:423); import JSON vs ZIP semantics (JSON=many convos, ZIP=one convo+attachments) (:311); remove over-specific "parent of root folder" (:315); export filename example stale (:295); regenerate/error-state buttons, hover-to-view/click-to-change patterns (:70/147/173/208); notes "not formatted properly" (sr-remsha :16) | Medium | Good depth adds. Screenshot-dependent items tie to A2. |
| B6.8 | **Files page** | "My files" → "**My Files**"; odd link to Admin guide (either remove "Review files" row or document the **Chat Admin view / Approve flow**, which is entirely undocumented); Delete option unavailable (remove); add **Info** option; naming-rules same as B6.3 (5.files.md:16–63) | Medium | The missing "Chat Admin approve" flow is a real content gap, not just a fix. |
| B6.9 | **Settings / index** | Link to "Choose and change the agent" section (7.settings:27); index cross-links to conversation sections (0.index:27/28 — and drop irrelevant "or change the agent") | Low | Anchor-precision (B6.1). |
| B6.10 | **Divider/format consistency** | Divider line style inconsistent with rest of project (sr-remsha — create-via-ui:32) | Trivial | Style-guide alignment. |

### B7. Operating DIAL — Observability (`4.operating-dial/6.observability/`) — Mmefko

Consistent theme: **treat OTEL and Prometheus as two separate paths**, and don't imply SDK-only config applies to Core/Chat.

| # | Comment | Impact | Caveats |
|---|---|---|---|
| B7.1 | Index: reorder so "components emit traces/metrics/logs; collector forwards OTEL; Prometheus scrapes a dedicated endpoint"; Core emits OTLP **and** Prometheus like others (not just "Runtime" col); add Prometheus-metrics rows; table should also list **Admin, StatGPT**, etc., not only Core/Chat/Adapters (0.index.md:47–59) | Medium | Conceptual accuracy — OTEL vs Prometheus are distinct collection methods. |
| B7.2 | Tracing: Core needs `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=...:4317`; **Chat doesn't support gRPC/4317** — use http/json on **4318** (`OTEL_EXPORTER_OTLP_PROTOCOL=http/json`); document all three transports (gRPC 4317, http/json 4318, http/protobuf 4318); add `OTEL_EXPORTER_OTLP_PROTOCOL` to examples; note **per-app protocol support differences**; more app examples (1.tracing.md:1/40/54) | Medium-High | **Verify each app's supported protocol/port matrix** — this is the crux and easy to get wrong. |
| B7.3 | Metrics: rename page to "**Configure metrics**" (drop "monitoring"); add OTEL-metrics config (`OTEL_METRICS_EXPORTER=otlp` + endpoint + protocol) separate from Prometheus; Core/Chat expose Prometheus **without** `OTEL_METRICS_EXPORTER=prometheus` (that's SDK-only); endpoint not mandatory (ServiceMonitor works); apps can **push** OTEL metrics via collector (scrape 9464 **or** push) (2.metrics-and-monitoring.md:1/46/50/69) | Medium | The "SDK-only vs Core/Chat" distinction recurs (also 6.providers/1.grafana-prometheus.md:47). |
| B7.4 | Logging: document **two** approaches — stdout (fluentbit/alloy/etc.) vs OTEL logs via collector (`OTEL_LOGS_EXPORTER=otlp` + endpoint); most apps incl. **Core** can export OTLP logs; specify gRPC/HTTP ports; OTEL logs follow the OTEL data model, stdout varies; add `OTEL_LOGS_EXPORTER` variable throughout (3.logging.md:1/26/28/29/37/39) | Medium | Add the variable consistently; verify Core OTLP-log support. |
| B7.5 | Grafana/Prometheus provider: OTEL_METRICS_EXPORTER=prometheus is SDK-only; Core/Chat expose without it (6.providers/1.grafana-prometheus.md:47) | Low | Same fix as B7.3. |

### B8. Operating DIAL — Cloud & Production (`4.operating-dial/2.cloud-deployment/`, `7.production-readiness/`) — kamiakou-epam, alexey-ban

- **Redis→Valkey** across these files: see **A1** (the bulk of kamiakou's 37 comments).

| # | Comment | Impact | Caveats |
|---|---|---|---|
| B8.1 | Update **ingress configuration** per the current Helm examples (AWS/Azure/GCP/generic `simple/values.yaml`, links given) (aws:50, azure:48, gcp:50, generic:44) | Medium | Pin to the referenced commit or track latest — decide. Verify each cloud's example. |
| B8.2 | Cloud index: Redis→Valkey (:29); stack also includes [DIAL Deployment Manager Backend](https://github.com/epam/ai-dial-admin-deployment-manager-backend) (:31) | Low | Add the component. |
| B8.3 | Azure/GCP: text says one thing but "we use **Ingress-NGINX** as stated in Prerequisites" — reconcile (azure:112, gcp:114) | Low | Internal consistency fix. |
| B8.4 | Quick Apps installation guide describes old Quick Apps, not the public [QA 2.0 Backend](https://github.com/epam/ai-dial-quickapps-backend) / [Frontend](https://github.com/epam/ai-dial-quickapps-frontend) — "rebuild from scratch" (kamiakou — 7.quick-apps-installation.md:1). PolinaGurinovich97: "skip QA front-end for today" | **High** | Ties to A4. **Caveat:** the "skip front-end for today" note suggests a phased/partial approach was agreed — clarify current intent before full rewrite. |
| B8.5 | Production readiness: HA text about **Bitnami Redis** obsolete (alexey-ban :67); adapter HA covers only OpenAI adapter — add others (e.g. global vs regional endpoints) (:82); scaling example limits **too low**, could mislead (:34); backup-and-restore omits the **Admin application** (:29); upgrade page should **link release notes + version-specific upgrade guides** (alexey-ban :32; kamiakou :10 → [DIAL Upgrade Guides](https://github.com/epam/ai-dial/tree/main/docs/releases)) | Medium | Substantive gaps beyond Valkey. Scaling-limits fix prevents customers copying bad numbers. |

---

## Part C — Noise / already-resolved (no independent action)

- **`CC @sr-remsha` pings (87, PolinaGurinovich97):** routing notes, not feedback. No action — each shadows a real VolhaBazhkova/other comment already captured above.
- **"new screenshot has been committed" (sr-remsha, ~25 replies):** already-resolved screenshot items (listed in A2). Action = **verify the committed shot matches the request, then resolve the thread**.
- **`app-link.png`:** sr-remsha asked VolhaBazhkova to confirm it's already current — **needs one reply**, not a re-capture.
- **Stray review body `"t"` (siarhei-fedziukovich):** ignore.

---

## Part D — Prioritized action plan

**P0 — Correctness blockers (docs are factually wrong / won't work):**
1. A4 — Quick Apps 2.0 schema/config/API fixes + 1.0 removal decision (verify against source, execute examples).
2. B8.4 — Quick Apps installation rebuild (coordinate with the "skip front-end for now" note).
3. B6.5 — Sharing/publishing behavior errors (toolsets can't be shared, auto-populated fields, default-selected, etc.).
4. B5.1/B5.2/B5.3 — Admin Panel conceptual + entity errors (blob vs config, cost-vs-token, entities definition).
5. B2.12 — AuthZ overview restructure (sensitive topic, false impression).

**P1 — Decisions that unblock batches (make these calls early):**
1. A3 — "Toolset" vs "Tool Set" canonical form (+ update glossary/style guide).
2. B1.1/B1.2 — Quick-start strategy (full compose w/ Keycloak+Admin; merge DevOps into Developer).
3. A6 — SDK-reference scope (keep on-site vs move to source; reconcile with roadmap).
4. A1 — Redis→Valkey support policy wording (replaced vs compatible).
5. B6.6/B6.8 — New sections to create (Toolsets-in-Marketplace, Chat Admin approve flow, Prompt Duplicate) — needed before B6.1 links resolve.

**P2 — High-volume mechanical (after P1 decisions):**
1. A1 — Valkey sweep (~10 files).
2. A2 — Screenshot re-capture (gate three-dots/bookmark shots on [ai-dial-chat#8073](https://github.com/epam/ai-dial-chat/issues/8073); needs authenticated capture).
3. A3 — Toolset terminology sweep.
4. B6.1/B6.3 — Link-anchor precision + naming-convention consolidation.
5. B5.6–B5.10, B5.9 — Admin UI label/currency passes; split Builders & Assets into per-type pages.

**P3 — Depth / infrastructure (likely separate follow-up issues):**
1. A5 — CI-test tutorial snippets.
2. A7 — Mermaid diagrams (architect overview, custom-adapter).
3. B7 — Observability OTEL/Prometheus rework (needs per-app protocol/port matrix verification).
4. B4.1/B4.4 — Adapter concept clarification + load-balancing adapter tutorial.
5. B1.7 — Release-notes video hydration bug (site/component fix).

**Cross-cutting caveats to respect throughout:**
- Internal links must be **relative `.md#anchor`**, never the `docs.aks.dev.dial.parts` absolute URLs used in reviews (CLAUDE.md rule; `onBroken*` = `throw`).
- Any structural/renumbering change must keep `sidebars-v2.js` prefixes in sync and pass `npm run build`.
- Screenshot capture requires authenticated DIAL Chat login (not anonymous).
- Many Admin items are "will be removed soon" — document current state with a light deprecation note rather than deep coverage.
- Coordinate with in-flight PRs: **#584** (n8n, B4.6) and the `feature/doc_improvements` branch guide (`BRANCH_GUIDE.md`, per the PR description).
