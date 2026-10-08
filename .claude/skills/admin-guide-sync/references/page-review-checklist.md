# Per-page UI-vs-docs review checklist

**Scope: the admin-guide-sync skill's MANUAL UI-vs-docs review mode** — the recurring,
page-by-page walk that reconciles the guide against the live app. It does NOT apply to
the automated changelog-driven sync (that runs in CI with no live UI, so step 2 and the
"live UI?" column cannot apply there). This is a permanent part of the skill, not a
one-off for the current catch-up.

**GATE: open and work through this file before touching ANY page in a UI-vs-docs
review pass. Do not write a single edit until step 4.** This is the enforced
pre-flight — reading the big contract "at some point" is not enough (that failed on
the Toolsets page: source-only pass + forgotten screenshot markers, both rules were
in `m2-verify-and-write.md` but not applied).

State the checklist back at the start of each page ("Pre-flight for <page>: …") so it
is visible that the gate ran.

## 0. Load the lessons (every page, no exceptions)

- [ ] Re-read `m2-verify-and-write.md` → the **Component-level verification** bullets
      (the UI-walk-mandatory rule) **and sections 3–4** (write rules: stale-screenshot
      markers, prose conventions, never-write-unverified).
- [ ] Skim the latest `SESSION-HANDOFF.md` entries for the pages already done — the
      same findings recur (view-level misplacement, ID columns, catalog fields).

## 1. Point the source at the live version

- [ ] Confirm the FE cache tag matches the live UAT footer (e.g. `FE 0.21.2`). If not,
      fetch/checkout the matching tag. Live is the target, not the pinned baseline.
- [ ] Identify the page's FE component tree (View → TabsContent → per-tab components).

## 2. Walk the LIVE UI — mandatory, first, complete

- [ ] Open the page in the logged-in UAT instance (Chrome extension).
- [ ] Walk **every tab** top-to-bottom. Expand every collapsible/accordion.
- [ ] Walk the **grid** (+ the Columns panel to see all available/optional columns).
- [ ] Open the **Create** modal and every source-type / sub-form it branches into.
- [ ] Note the **control type** of each field (toggle vs selector vs popup vs text),
      not just its label. A screenshot per tab.
- [ ] Do NOT cherry-pick tabs you "expect are fine." Source biases you toward what you
      already suspect; the walk catches what you didn't.

## 3. Reconcile — the triangulation table (REQUIRED OUTPUT)

Build ONE table for the page, one row per item (every grid column, every property
field, every tab, every control, every create-modal field). This table is the proof
that each item was read in the code, verified on the real UI, and reflected in the doc.
**No page is "done" until every row has all three source columns filled and agreeing.**

| Item | In FE source? | On live UI? | In doc? | Verdict |
|---|---|---|---|---|
| e.g. Grid: ID column | no (not in TOOLSETS_COLUMNS) | no (Columns panel) | yes → remove | removed |
| e.g. Forward auth token | yes (DialRadioGroupPopupField) | yes (selector+popup) | yes but wrong (said toggle) → fix | changed |

Rules:
- [ ] Every item gets a row; fill **all three** of source / live UI / doc. A row missing
      any of the three is an **open item, not a pass** — go get the missing cell.
- [ ] Mismatch between any two columns → a finding (changed / new / removed / wrong-page).
- [ ] Before a **removal** verdict, grep the full FE repo — zero hits = gone from the
      product; missing from one component = a per-view decision (keep it).
- [ ] Check **view-specific rendering** — the same component renders differently by parent
      props. Confirm the item belongs to THIS view (Entities vs Assets vs Catalog).
- [ ] Save the table to the scratchpad (`reconciliation-<page>.md`) and keep it until the
      page is committed. Collect ALL rows across ALL tabs **before** writing anything.

## 4. Write (now, and only now)

- [ ] Apply edits following the admin-guide page patterns (grids/properties/actions tables).
- [ ] **For every edit that changes something a nearby screenshot shows, add the inline
      `<!-- SCREENSHOT OUTDATED: … -->` marker right then** — not as an afterthought.
- [ ] Never write an unverified claim as fact — live-only uncertainties go to the Flag list.
- [ ] Bump the page's `last_verified`.

## 5. Record & close

- [ ] Update `SESSION-HANDOFF.md`: findings written, screenshots to recapture, next page.
- [ ] Save any new durable lesson to BOTH a skill reference (repo) AND memory — not memory alone.
- [ ] Commit (exclude generator-owned `7.reference/changelog/` files unless asked).
- [ ] `npm run build` to confirm links — or confirm the user is running it.
