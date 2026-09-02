# DIAL Documentation - Improvement Roadmap

> **Status:** Draft


## Executive summary

The current `[docs.dialx.ai](http://docs.dialx.ai)` is best described as **an index of GitHub READMEs** rather than a documentation product. The site's structure, onboarding flow, and canonical reference pages systematically redirect readers to component repositories, which fragments the experience, breaks search, makes content stale invisibly, and leaves no single place to answer "what is DIAL and how do I use it?"

Beyond the content gaps, the **information architecture itself is a barrier to adoption**: duplicate page titles with different content, the same topic split across unrelated sidebar locations, seven-level-deep menu paths, and a Platform/Tutorials split that follows no consistent principle.

Most critically: **the site contains no in-depth tutorials**. The top-level "Tutorials" section is largely mislabeled — it contains user guides, configuration references, how-tos, and external links. The closest thing to tutorials are four minimal quickstart pages that run `docker compose up` without explaining what happens, verifying the result, or teaching any concept. A developer who wants to learn DIAL beyond "download and run" has nowhere to go.

This roadmap proposes a **four-phase program** to turn the docs into a first-class product surface:

| Phase | Exit outcome | Phase | Exit outcome |
| :-- | :-- | :-- | :-- |
| Phase 0 — Foundation | Evidence-based plan and CI quality gates in place |  |  |
| Phase 1 — Stop the bleeding | Self-contained docs for the top user journeys, including DIAL Apps and Tool Sets; navigation coherent; first tutorials exist |  |  |
| Phase 2 — Depth and differentiation | A developer can evaluate, pilot, and ship DIAL without leaving the site |  |  |
| Phase 3 — Sustainability | Quality does not decay between releases |  |  |

  

The guiding principle: **treat documentation as product**. Every assumption we make about code quality — tested, reviewed, versioned, observable — applies to docs.

* * *

## 1\. Approach and methodology

Before writing a single page, four things must be true:

### 1.1 Commit to an information architecture

Adopt **[Diátaxis](https://diataxis.fr/)** (tutorials / how-to / reference / explanation). Every page is classified as exactly one type; each type has its own voice and structure defined in the Style Guide.

The target site structure is defined in the **DIAL Recommended Doc Structure** document. It replaces the current Platform/Tutorials split with journey-based sections, eliminates all duplicate titles, and enforces a maximum sidebar depth of 4 levels.

### 1.2 Define personas and their first-hour journey

Six personas, each with a named entry point on the landing page:

| Persona | First-hour goal | Persona | First-hour goal |
| :-- | :-- | :-- | :-- |
| End user | Learn to use DIAL Chat: conversations, prompts, marketplace, apps, files, sharing |  |  |
| App Developer | Run DIAL locally, hit the Unified API, build a minimal application with the SDK |  |  |
| Platform / DevOps | Deploy DIAL to a chosen cloud with observability and auth wired in |  |  |
| Admin / Governance | Configure roles, rate limits, publications, and compliance settings |  |  |
| Evaluator / PoC lead | Understand what DIAL is, what it replaces, and run a demo |  |  |
| Solution Architect | Read reference architectures, scaling patterns, and integration trade-offs |  |  |

  

### 1.3 Inventory before authoring

Content audit spreadsheet: every URL classified by Diátaxis type, persona, last-updated date, quality score (1–5), owner, and action (keep / merge / rewrite / delete / redirect). The migration map in the Structure document provides the target destination for every existing page.

### 1.4 Instrument for outcomes

Baseline the metrics in §4 before work begins. Ship improvements against measurable targets, not vibes.

* * *

## 2\. Gap summary

The **DIAL Documentation Gap Analysis** identifies 25 gaps across six categories. The top findings, ranked by severity:

| Rank | Gap | Category | Rank | Gap | Category |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | No in-depth tutorials exist — quickstarts run docker compose up but teach nothing; no tutorial builds an app, adapter, or interceptor | Content |  |  |  |
| 2 | No "getting started with the API" guide — no bridge from Quick Start to API usage | Content |  |  |  |
| 3 | DIAL Apps ecosystem under-documented — Custom, Quick, Code, Mind Map scattered and asymmetric | Content |  |  |  |
| 4 | Tool Sets undocumented — no reference, no authoring guide, no examples | Content |  |  |  |
| 5 | Seven duplicate-title pairs in navigation | Navigation |  |  |  |
| 6 | Platform/Tutorials split incoherent — no consistent principle | Navigation |  |  |  |
| 7 | "Tutorials" section largely mislabeled — contains user guides, config references, how-tos, and external links | Navigation |  |  |  |
| 8 | GitHub redirects as authoritative source for canonical content | Structural |  |  |  |
| 9 | Videos not self-sufficient — no code, data, or config to reproduce | Content |  |  |  |
| 10 | No OpenAI API compatibility matrix — "compatible" unspecified | Content |  |  |  |

  

Additional high-impact gaps include: naming chaos ("Agent Builders" × 4 labels), no glossary, observability stops at "use OTEL," networking/firewall docs promised but never delivered, no dependency configuration guidance (Redis, blob storage), no error reference, no version compatibility matrix, no production hardening guide, no community surface, no testing guidance, no environment prerequisites, and no "what's next" navigation between pages.

See the full Gap Analysis document for detailed evidence, URLs, and impact assessment for all 25 gaps.

* * *

## 3\. The roadmap

### Phase 0 — Foundation

**Goal:** Plan with evidence, not opinion. Put quality gates in place before they're needed.

**Workstreams**

1. **Content inventory** — every page classified by Diátaxis type, persona, quality, last-updated, owner, action. Use the migration map in the Structure document. Flag every mislabeled page (especially "tutorials" that aren't tutorials).
2. **Style guide** finalized, reviewed by stakeholders, and committed to the docs repo as the governing standard for all new and modified content. Includes the **"what's next" rule** (every page must end with 2–3 links to logical follow-up pages). Machine-enforceable rules (terminology, frontmatter) are wired into CI. Existing pages are **not** retroactively updated — they come into compliance when touched during Phase 1 migration.
3. **Terminology glossary** stubbed per the Structure document's concept map.
4. **CI quality gates**:
  * Internal + external link checker.
  * Vale lint pack for terminology and forbidden phrases.
  * Dependency-freshness check.
  * Frontmatter completeness check.
5. **Analytics baseline** captured.

**Exit criteria**

* Inventory complete and reviewed.
* At least three CI gates enforcing on `main`.
* Baseline metrics dashboard exists.

* * *

### Phase 1 — Stop the bleeding

**Goal:** The top user journeys work end-to-end on `[docs.dialx.ai](http://docs.dialx.ai)` without redirecting to GitHub, without requiring a video to fill in the blanks, and without forcing the reader to guess which of two duplicate pages to visit. **The first real tutorials exist.**

**Workstreams**

#### 1.1 Implement the target site structure

Migrate to the structure in the **Structure document**:

* Collapse Platform/Tutorials into journey-based sections.
* Eliminate all seven duplicate-title pairs.
* Flatten sidebar to ≤ 4 levels.
* Apply sidebar grouping labels.
* Fix URL ↔ menu alignment with redirect rules.
* Replace the DevOps GitHub link with a docs-site landing page.
* Add "what's next" links to every page touched during migration.

#### 1.2 Ship the first tutorials — starting with the API

The most critical new content is the **"Getting started with the DIAL API" tutorial** (Structure document §4.0) — the bridge between "DIAL is running" and "I can use it." This is the first real tutorial on the site and sets the quality bar for all subsequent ones.

Also ship in Phase 1:

* **Environment prerequisites** page (OS-specific notes, Docker resource allocation).
* At least one tutorial per app type: one Custom App tutorial and one Quick App tutorial, each with a paired sample repo, sample data, and configuration.

#### 1.3 DIAL Apps and Tool Sets — top priority

Ship the DIAL Apps subsections per the Structure document: Custom Apps, Quick Apps (including Tool Sets and MCP), **Code Apps**, and Mind Map Studio.

#### 1.4 Fix the video content model

Split Demos section: capability showcases stay (no written companion required); tutorial videos migrate to parent pages (written companion required).

#### 1.5 Kill the GitHub-redirect habit

Canonical home on docs site for Configuration, Quick Starts, Helm walkthroughs, and SDK overview.

#### 1.6 Rewrite the landing page

Persona-routed entry for all six personas per the Structure document.

#### 1.7 Ship the Glossary, concept map, and OpenAI compatibility page

Per the Structure document §3. The glossary resolves naming chaos. The OpenAI compatibility page tells migrating developers what works and what doesn't.

#### 1.8 Fix the highest-impact stale examples

Prioritized by analytics.

#### 1.9 Launch the Changelog and version compatibility matrix

Per the Structure document §7.

**Exit criteria**

* Site structure matches the Structure document. Zero duplicate titles. Max sidebar depth ≤ 4.
* **At least three real tutorials exist** (API getting started, one Custom App, one Quick App), each following the Diátaxis tutorial pattern with sample repo, data, and verification steps.
* Every page touched has "what's next" links.
* DIAL Apps and Tool Sets section live (including Code Apps).
* Demo/tutorial video split implemented.
* Zero GitHub redirects on canonical pages.
* Landing page, glossary, OpenAI compatibility, changelog, and version matrix live.
* Environment prerequisites page live.

* * *

### Phase 2 — Depth and differentiation

**Goal:** A developer can evaluate, pilot, and ship DIAL without ever leaving the docs.

**Workstreams**

#### 2.1 Complete the tutorial library

Ship the remaining flagship tutorials per the Structure document (RAG app, translator app rewrite, Code App, PII interceptor, custom adapter, Overlay UI, eval-driven development, multi-provider routing). Each with sample repo, data, CI.

#### 2.2 SDK reference

Per Structure document §4.8.

#### 2.3 Comparison pages

Four pages per Structure document §3.

#### 2.4 Production readiness guide

Per Structure document §5.7. Includes **networking and firewall documentation** (the content explicitly promised by the current Quick Start and never delivered).

#### 2.5 Observability depth

Per Structure document §5.6: tracing (OTEL), provider-specific guides (Datadog, Grafana+Prometheus, ELK, Azure Monitor, AWS CloudWatch), alerting.

#### 2.6 Operational reference content

* **Dependency configuration** (Redis, blob storage, InfluxDB) — per Structure document §5.4.
* **Error code reference** — per Structure document §5.8.
* **Troubleshooting guide** — per Structure document §5.8.

#### 2.7 Developer experience content

* **Testing guidance for custom apps** — per Structure document §4.9.
* **RAG explanation** — per Structure document §3.
* **File management how-to** — per Structure document §4.14.

#### 2.8 Reference architectures and use cases

Per Structure document §8.

#### 2.9 Community section

Per Structure document §9: contribution guide, community extension list, repository map, discussion/support links.

**Exit criteria**

* Nine flagship tutorials pass CI on a regular cadence.
* SDK reference live.
* Four comparison pages published.
* Production readiness guide published (including networking/firewall).
* Observability section includes tracing and at least three provider-specific guides.
* Dependency config, error reference, and troubleshooting live.
* Testing guidance live.
* Community section live with contribution guide and extension list.
* Use-case index browsable in both directions.

* * *

### Phase 3 — Sustainability

**Goal:** Quality does not decay between releases.

**Workstreams**

* **Versioned documentation (optional, evaluate after Phase 2).** DIAL components release independently — there is no single release cadence to snapshot against. Instead, the primary mechanism is the **version compatibility matrix** (shipped in Phase 1) combined with **inline version annotations** on pages where behavior is version-dependent (e.g., "since Core 0.42"). Full site-wide docs versioning may be added later if user demand justifies the maintenance cost.
* **Per-page ownership** enforced via frontmatter; un-owned pages block merge.
* **Stale-content audit on a regular cadence:** `last_verified` beyond threshold generates a review task for the owner.
* **Unified changelog on docs site.** Aggregate release notes from all DIAL component repositories into a single chronological view on the docs site, so users can see what changed across the platform without visiting 15+ GitHub repos individually.
* **Docs-impact check in component release process.** Each component's release checklist includes a "docs impact" step: if a change affects user-facing behavior, a corresponding docs PR is opened and linked before the release is published. Enforced by process and PR template, not by cross-repo tooling.
* **Per-page feedback widget** → triaged, fed into the docs backlog.
* **Contributor onboarding path:** short guide for engineers submitting their first doc PR.
* **Community content pipeline:** accept community tutorials into a curated `community/` section with a lower review bar but the same freshness CI.

**Exit criteria (continuous)**

* Share of pages with fresh `last_verified` stays above target threshold.
* Zero pages without an owner.
* Mean time from feature ship to doc update stays below target threshold.

* * *

## Appendix: Phase 1 showcase page recommendation

Before broad rollout, rewrite one page end-to-end as a proof of concept. Three candidates:

* **The "Getting started with the DIAL API" tutorial** — demonstrates the Diátaxis tutorial pattern on net-new content. Proves that a real tutorial can exist on this site. Highest developer impact.
* **The Configuration page** — demonstrates the reference pattern on migrated content. Proves that GitHub redirects can be eliminated.
* **A DIAL Apps overview page** — demonstrates the explanation pattern on the most strategically important topic.

Pick these before scaling the approach. A good rewrite will sell the rest of the roadmap internally better than any slide deck.  
  
 

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)