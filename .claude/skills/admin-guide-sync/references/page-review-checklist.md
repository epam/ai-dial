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

## 2. Walk the LIVE UI — mandatory, first, complete, DEEP

**This is a user guide: document everything the user sees. Depth is the #1 recurring
complaint — shallow walks miss things. Open EVERYTHING, not a sample.**

- [ ] Open the page in the logged-in UAT instance (Chrome extension).
- [ ] Walk **every tab AND every sub-tab** top-to-bottom.
- [ ] **Expand every** collapsible/accordion and every **row-expand chevron**.
- [ ] **Open every dropdown/selector** and read **all** its options (not just the current value).
- [ ] **Open every popup, modal, confirmation, info tooltip, and overflow/actions menu.**
- [ ] Walk the **grid** + the **Columns panel** (all available/optional columns).
- [ ] Open the **Create** flow and **every source-type / sub-form branch** it opens.
- [ ] If a control opens, reveals, or navigates to something — **open it.** No control left unopened.
- [ ] Note the **control type** of each field (toggle vs selector vs popup vs text),
      not just its label. A screenshot per tab/state.
- [ ] Do NOT cherry-pick tabs you "expect are fine." Source biases you toward what you
      already suspect; the walk catches what you didn't.

**Token efficiency — standing defaults for the walk (screenshots are the #1 cost).**
The "open everything" depth bar stays; make it cheap, not shallow:
- [ ] **Read text, not pixels, to enumerate.** For column lists, dropdown options,
      menu items, and form-field labels use `read_page` / `get_page_text` / `find` —
      far cheaper than a screenshot and usually sufficient. Reserve screenshots for
      (a) confirming a control's *type/layout* and (b) captures destined for the docs.
- [ ] **Scale screenshots to `0.5` by default** (≈¼ the tokens, still readable); use
      full resolution only when fine detail matters. Use `zoom` on the *small region*
      you need (a menu, one field) instead of a full-page capture.
- [ ] **Do not screenshot after every click.** `find`/`read_page` confirms a menu or
      modal opened for a fraction of the cost.
- [ ] **Batch browser actions** (`browser_batch`) — click→read sequences in one call
      cut round-trips and intermediate images.
- [ ] **Delegate the mechanical walk to a cheaper-model subagent** (general-purpose on
      Sonnet/Haiku) that drives the browser and hands back a compact text inventory +
      only the few screenshots worth keeping; reserve the main (Opus) thread for
      reconciliation and writing. Rule of thumb: cheaper models walk & grep, Opus writes.
- [ ] **Review against a pinned shipped release, not a moving RC** — re-check the live
      footer FE version at the start of each page; if the instance was upgraded
      mid-review, re-point the source cache, but avoid re-walking a target that is still
      changing under you.

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

- [ ] **NO-LOSS RULE — this is a review, not a rewrite-from-scratch.** When you replace or
      reorder a section, diff the NEW text against the OLD: every item that was in the doc
      must still be present, OR verified absent from the live UI/source, OR deliberately
      relocated (and you say where). Never let a correct existing item silently disappear
      because you rebuilt a table from your walk. After editing a section, re-read the
      pre-edit version and account for every removed line. (Lost Updated/Creation Time on
      the Application Runners Properties rewrite, 2026-10-12.)
- [ ] **Explain, don't just list.** For every element document (a) what it is, (b) its
      purpose / what it controls, (c) how the user works with it. A field name + one-liner
      is not enough for a user guide. A bare list of control names (row actions, toggles,
      columns) with no description is a FAIL.
- [ ] **NEVER write a claim from the source agent / source code alone.** The source inventory
      is a research aid, NOT the text's source of truth. Every field, column, action, toggle,
      form, and especially every CONDITIONAL/CAUSAL claim ("appears when X", "only for Y
      bucket") must be SEEN on the live UI before it is written. If the UI and source disagree
      (e.g. source says no Roles tab but a platform app shows one), STOP and resolve it — do
      not publish either version. (Shipped wrong Properties "Source Type fields" logic + an
      unverified "Roles = platform bucket" claim this way, 2026-10-12.)
- [ ] **Capture every form/modal in FULL** — every field, its required marker, and its
      default — verified live. (Missed the required ID field in the Create Application form,
      2026-10-12.)
- [ ] **Section/heading naming: do NOT use the word "tab"** in headings or section names
      (write "Properties", not "Properties tab"). User preference (2026-10-12).
- [ ] Apply edits following the admin-guide page patterns (grids/properties/actions tables).
- [ ] **Present enumerable element sets as TABLES, not inline prose.** Grid columns, form
      fields, actions, toggles → a `| Item | Description |` table. Never a run-on sentence
      listing columns. (User feedback 2026-10-12.)
- [ ] **Write descriptions that read at a glance.** Keep each short; when a control has
      modes/states (toggle on/off, radio options), use short bullets per state — do NOT cram
      the conditions into one dense sentence. (User feedback 2026-10-12.)
- [ ] **For every edit that changes something a nearby screenshot shows, add the inline
      `<!-- SCREENSHOT OUTDATED: … -->` marker right then** — not as an afterthought.
- [ ] Never write an unverified claim as fact — live-only uncertainties go to the Flag list.
- [ ] Bump the page's `last_verified`.

## 4.5 Quality gate — the enforced LAST step before done (do not skip)

Re-read the finished page top to bottom against the reconciliation table and confirm EACH:
- [ ] **Completeness:** every element on the live UI (every form field incl. required markers,
      every grid column, every row/bulk action, every toggle, every tab/section, every
      dropdown option) is present in the doc. Nothing on screen is missing.
- [ ] **Explained:** every element has what-it-is / purpose / how-to — no bare name lists.
- [ ] **Traceable:** every claim maps to something you saw on the live UI AND confirmed in
      source. No sentence survives that you cannot point to on the screen.
- [ ] **No vague filler:** no description that just restates the label ("Base endpoint URL for
      the application"). If you don't know what a field does, go find out or flag it.
- [ ] **Conditionals verified:** every "appears when / only for" claim was checked on the
      actual cases, not inferred.
- [ ] **No-loss:** diffed against the pre-edit version; nothing correct was dropped.
Skipping this gate is what let unexplained toggles, a missing required field, and unverified
logic ship on the first Assets→Applications pass (2026-10-12).

## 5. Record & close

- [ ] Update `SESSION-HANDOFF.md`: findings written, screenshots to recapture, next page.
- [ ] Save any new durable lesson to BOTH a skill reference (repo) AND memory — not memory alone.
- [ ] Commit (exclude generator-owned `7.reference/changelog/` files unless asked).
- [ ] `npm run build` to confirm links — or confirm the user is running it.
