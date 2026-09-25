# ADR: Documentation release strategy

> **Status:** Proposed — 2026-06-02

How and when to publish the restructured DIAL documentation to the public site at
https://docs.dialx.ai.

## 1. Status

**Proposed.** This ADR records the release options and a recommended approach for the
team to ratify, reject, or amend. It does not yet authorize any change to the site,
CI, or DNS.

## 2. Context

The DIAL docs site is being restructured from the incoherent Platform/Tutorials split
into journey-based sections (Understand DIAL, Building with DIAL, Operating DIAL,
Administering DIAL), per `recommended-site-structure.md` and `improvement-roadmap.md`.

The work is large and early. `tracking.json` covers **288 target pages and reports 0%
"done"** — 112 planned, 148 waiting-for-review, 28 waiting-for-test, 0 reviewed/tested.

Authoring already happens against a dual sidebar in `sidebars.js`: a legacy **OLD**
category and a restructured **NEW** category that coexist in a single Docusaurus build.
A progress page (`docs/docs/NEW/progress.md`) is auto-generated from `tracking.json` on
every `npm run build`.

The planning documents define *what* to build and the page-by-page migration map. What
is missing — and what this ADR decides — is *how and when* to release that content:
the publish, cutover, and OLD-retirement strategy. This is a planning/governance
document, so it lives in `docs-planning/` rather than in the Docusaurus content tree.

### 2.1 The governing constraint: review and test throughput

**The bottleneck is not build mechanics — it is the speed of human review and tutorial
testing.** The `tracking.json` queue (148 pages waiting-for-review, 28 waiting-for-test)
drains only as fast as reviewers and tutorial testers can work through it. No publishing
mechanism changes that rate.

Two consequences follow, and they drive the whole decision:

- **The release strategy must publish content at the rate review/test clears it** — no
  faster (publishing unreviewed pages is not acceptable) and no slower (finished pages
  should not sit unpublished).
- **The strategy must not add review/test load.** Anything that creates a second surface
  to keep in sync (for example a permanent parallel site) taxes the very resource that is
  already the bottleneck.

This is the strongest argument against a single big-bang release: it would withhold *all*
value until the *entire* 288-page queue has drained, which at the current baseline is far
off.

### 2.2 Hard requirement: no OLD/NEW split on the released site

**The public site must never show OLD and NEW sections side by side.** Duplicate titles
and a split navigation are exactly the problems this project exists to fix. The dual
sidebar is therefore an **authoring- and preview-only** construct: NEW content is staged
off the public navigation, and each released topic appears exactly once. When a section's
NEW pages go live, the matching OLD pages are retired in the same step.

### 2.3 Other constraints

- **Hosting is GitHub Pages.** The site is built from `main` and deployed to the
  `gh-pages` branch via `peaceiris/actions-gh-pages@v4`. There is one canonical site per
  repository. `BASE_URL` is environment-configurable, which makes a path- or
  subdomain-scoped second build feasible.
- **No versioning plugin and no redirects plugin are installed.**
  `@docusaurus/plugin-client-redirects` would have to be added before any old→new URL
  redirects are possible.
- **Strict broken-link checking is on** (`onBrokenLinks: throw`). Any partial release
  must keep all internal links resolvable, or the production build fails.

## 3. Decision drivers

| # | Driver | Why it matters |
|---|--------|----------------|
| D1 | Time-to-first-value | How soon real users benefit, given that review/test throughput (§2.1) caps the pace. |
| D2 | Navigation clarity | A single canonical page per topic; no OLD/NEW split on the public site (§2.2). |
| D3 | SEO & canonical-URL integrity | Avoiding split link equity, duplicate content, and orphaned URLs. |
| D4 | Broken-link / build risk | Exposure to `onBrokenLinks: throw` failures during a partial release. |
| D5 | Load on the bottleneck | Whether the option adds review/test or sync work to the already-constrained resource. |
| D6 | Reversibility | How easily a release step can be rolled back. |
| D7 | Setup effort | One-time work needed before the strategy can start. |

## 4. Options considered

### Option A — Public preview site with disclaimer and progress tracking

Stand up a second build (for example `next.docs.dialx.ai`, via a separate
`BASE_URL`/subdomain) that hosts NEW content **publicly, as it is drafted** — ahead of
full review/test. It is explicitly **non-canonical**: every page carries a clear
disclaimer ("Preview — work in progress, may be incomplete or change"), and the site
surfaces live migration progress via the auto-generated `progress.md` page. Content
graduates from preview to the canonical production site as review/test clears it.

> Note: an earlier draft listed a permanent "twin sites" variant and a temporary "beta"
> variant separately. They are the same mechanism — a second site — so they are merged
> here. A *permanent* public twin is rejected outright: it violates §2.2 (two canonical
> surfaces for the same topics).

**Pros**

- **Delivers tangible value the soonest** (D1): improved content reaches users as soon
  as it is drafted, without waiting on the review/test bottleneck — the disclaimer sets
  expectations about maturity.
- Decouples value delivery from review throughput, easing pressure on the bottleneck
  (D5).
- NEW content and the dual sidebar stay entirely off the canonical public site,
  satisfying §2.2; the preview is clearly labeled non-canonical (D2).
- Real users give feedback on NEW content early, before it becomes canonical (D1).

**Cons**

- A second deployment to run for the duration of the migration (D7).
- Requires care on SEO — the preview must be de-indexed (`noindex`) and use a canonical
  link to the production page so it does not compete in search (D3).
- Discipline required to keep disclaimers visible and to retire the preview when the
  migration completes.

### Option B — Both sections live in the public site (status quo) — **rejected**

Publish OLD and NEW as top-level categories in the same public site, as the sidebar is
structured today.

**Rejected:** directly violates §2.2 — it is the duplicate-title, split-navigation state
the project exists to eliminate. Retained here only as the *authoring/preview* layout,
which must be hidden from the production build.

### Option C — Big-bang release

Finish review/test on all 288 pages, then swap OLD→NEW in a single cutover.

**Pros**

- Cleanest possible end state; one coherent launch (D2, D3).

**Cons**

- Withholds all value until the entire review/test queue drains — the worst fit for the
  §2.1 bottleneck (D1).
- High risk concentrated in one event; maximal broken-link exposure at cutover (D4, D6).

### Option D — Progressive page-at-a-time migration

Promote individual NEW pages to the public site as each one is reviewed/tested, retiring
its OLD counterpart page by page.

**Pros**

- Publishes at the exact rate review/test clears, page by page (D1, D5).
- Each page is independently reversible (D6).

**Cons**

- Page-at-a-time promotion risks dangling links to not-yet-migrated neighbors under
  strict link checking (D4).
- Mid-migration, a section can be a patchwork of old and new pages, hurting coherence
  (D2).

### Option E — Section-by-section cutover

Cut over a whole journey section at once: when every page in a section (for example
Understand DIAL) passes review/test in `tracking.json`, that section is promoted to the
public site as a unit, old→new URL redirects are added for it, and its OLD pages are
retired in the same step. OLD shrinks section by section until it is empty.

**Pros**

- Publishes at the §2.1 review/test rate, but in coherent units (D1, D5).
- Each released section is internally complete, so links resolve and broken-link risk is
  contained (D4).
- A single canonical navigation per topic the moment a section lands; no OLD/NEW split is
  ever public (D2, D3).
- A section can be held back or rolled back independently (D6).

**Cons**

- Requires a redirects plugin and a defined per-section "ready" bar before starting (D7).
- Cross-section links must be sequenced carefully during the transition.

## 5. Decision matrix

Scored qualitatively: ✓ favorable, ~ mixed, ✗ unfavorable.

| Option | D1 Value | D2 Clarity | D3 SEO | D4 Link risk | D5 Bottleneck | D6 Reversible | D7 Setup |
|--------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **A Public preview site** | **✓✓** | **✓** | **~** | **✓** | **✓** | **✓** | **~** |
| B Both sections public | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| C Big bang | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ |
| D Progressive page-at-a-time | ✓ | ~ | ~ | ✗ | ✓ | ✓ | ✓ |
| E Section-by-section | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~ |

A and E are complementary, not competing: **A** is the public front door that delivers
value early (preview, disclaimer, progress); **E** is how that content graduates into
the canonical site as review/test clears. The ✓✓ on A/D1 reflects that it is the only
option delivering value *before* the review/test bottleneck drains.

## 6. Recommendation (Proposed)

Adopt a two-track strategy: **Option A — a public preview site with a clear disclaimer
and live migration-progress tracking — as the primary near-term release vehicle**, with
**Option E — section-by-section cutover — as the path content takes to graduate into the
canonical production site** once review/test clears it.

Why A leads:

- **It delivers tangible value the soonest.** Improved content reaches users as it is
  drafted, instead of waiting on the review/test bottleneck (§2.1). The disclaimer sets
  expectations, and the progress page (`docs/docs/NEW/progress.md`) shows exactly how far
  the migration has come (D1, D5).
- It keeps the canonical site clean: NEW content and the dual sidebar never appear on
  `docs.dialx.ai` until cutover, so §2.2 holds throughout (D2).
- The preview is one extra build of content the team already authors, not a separate
  surface to keep in editorial sync — so it adds little to the bottleneck (D5).
- It is fully reversible: the preview can be reshaped or rebuilt at any time without
  touching production (D6).

Why E is the graduation path:

- When a section's pages reach reviewed/tested in `tracking.json`, that whole section is
  promoted from preview to the canonical site as a unit, old→new redirects are added, and
  the matching OLD pages are retired in the same step.
- Promoting complete sections (rather than single pages, as in D) keeps links resolvable
  and contains the `onBrokenLinks: throw` risk (D4), and gives one canonical page per
  topic the moment a section lands (D2, D3).

Sequencing follows the roadmap phases: content appears on the preview site as soon as it
is drafted, and graduates to canonical section by section as review/test completes. The
Phase 1 showcase candidates in `improvement-roadmap.md` are natural first sections to
graduate. Because the disclaimer makes the preview's maturity explicit, value delivery is
no longer gated on the bottleneck — only the canonical promotion is.

## 7. Consequences

This decision implies the following work, deliberately left to a **follow-up
implementation note** (this ADR is strategy-level only):

- **Stand up the preview build** under a distinct `BASE_URL`/subdomain (for example
  `next.docs.dialx.ai`), serving the NEW content. Exclude it from search indexing
  (`noindex`) and point a canonical link at the production page so it does not compete in
  search.
- **Author the disclaimer** shown on every preview page ("Preview — work in progress; may
  be incomplete or change before it becomes official"), and surface the existing
  `progress.md` prominently as the migration tracker.
- **Keep NEW out of the canonical production build until cutover** — NEW lives on the
  preview site only, so §2.2 holds on `docs.dialx.ai` at every point during the migration.
- Add and configure `@docusaurus/plugin-client-redirects` and author the old→new URL
  redirect map, applied per section as it graduates to canonical.
- Define the precise per-section "ready to graduate" bar and tie it to `tracking.json`
  statuses (all target pages in the section at `reviewed`/`tested`). Because review/test
  is the bottleneck (§2.1), also track and, where possible, expand review/test throughput
  — it sets the canonical-promotion cadence more than anything in this ADR.
- Define an OLD-retirement checklist run at each section graduation (remove OLD sidebar
  entries, redirect their URLs, confirm no inbound links remain).
- Schedule retirement of the preview site once the migration completes.

Reversibility note: the preview never affects production, and until a section graduates
its OLD pages remain canonical — so any section can be held back or rolled back without
affecting the rest of the site.

## 8. References

- `docs-planning/improvement-roadmap.md` — four-phase plan and Phase 1 showcase candidates
- `docs-planning/recommended-site-structure.md` — target IA and page-by-page migration map
- `docs-planning/gap-analysis.md` — evidenced gaps, including duplicate-title pairs
- `docs-planning/tracking.json` — per-page review/test status (source of the "ready" bar)
- `docs/docs/NEW/progress.md` — auto-generated progress page
