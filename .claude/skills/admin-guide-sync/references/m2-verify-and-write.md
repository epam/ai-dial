# M2 — Verify & Write (V1 blueprint)

The stage after the detector. The detector says *which pages* changed and *what
source* changed under each. M2 reads that source, decides what the change means
for each page, and updates the text directly. Screenshots are left for a human.

This is the agreed V1 contract. Build to it; don't expand scope without a change
here first.

## Scope line (V1)

- The agent **writes text edits directly** into the guide pages.
- The agent **does not touch screenshots** — it flags which ones to recapture.
- The agent **opens a PR** whose body is three short lists: Done, Recapture, Flag.
- Everything M2 needs lives in THIS skill. No dependency on the old
  `chat-guide-capture` skill (it is being deleted) or `docs-researcher`.
- Prose conventions are the only external reuse: the `docs-page-writer` skill.

## Input

The detector's JSON work list: per flagged page, the changed specs / libs / code
folders / label namespaces, plus the `from` and `to` chat versions (a pinned tag).

## Flow

```
detector work list
      │
      ▼  per flagged page
1. GATHER EVIDENCE   read the changed source at the pinned tag
2. RECONCILE         compare source-truth to what the page currently says
3. DECISION LIST     one [{passage, verdict, evidence}] per page
4. WRITE             execute the list; edit only flagged passages
5. PER-PAGE RECORD   done items, recapture items, flags
      │
      ▼  aggregate
PR: 3 lists + bump manifest.last_verified_chat_version
```

The bridge between gather and write is the **decision list**: reconcile turns
facts into verdicts; the writer executes verdicts and never re-reads source. Every
edit therefore traces to one source fact.

## 1. Gather evidence (self-contained)

For each changed thing the detector reported, read it at the `to` tag from a
single shallow clone:

- **Labels** — `apps/chat/src/i18n/locales/en.json`. The authoritative source for
  any UI label, tooltip, placeholder, error string. Diff the changed namespace's
  keys between `from` and `to`.
- **Specs** — `openspec/specs/<feature>/spec.md`. The authoritative written feature
  behavior. `openspec/changes/archive/<date>-<slug>/` dates when a feature landed
  or broke.
- **Backend** — `apps/chat-api/`. Server-side behavior (conversation naming, title
  generation, transcription, usage) lives here, not in the React app.
- **Code** — the changed page/component/hook folder, when a spec didn't already
  explain the change.
- **Release notes** (the version's GitHub release page) — a *hint* only, in human
  words, for where to look. Never authoritative; notes are marketing-shaped and
  omit removals.

**Migration check** (harvested from the old skill — the new chat is a ground-up
rewrite, so an absent feature may be "coming later," not "gone"):
- Open issues labeled `in-migration` on `epam/ai-dial-chat`.
- The legacy migration guide in the repo
  (`docs/legacy-chat-migration-guide.md` on the chat version's tag).
- These distinguish "removed for good" from "not yet migrated"; the diff alone
  cannot.

**Investigation heuristics** (harvested keepers — apply while reconciling):
- **Verify a surprising negative twice.** Before concluding a feature was removed,
  confirm it in source a second way; a stale ref or a half-read diff lies.
- **"Either X or Y depending on deployment" is a smell that two features were
  merged.** Go find both.
- **A reviewer's correction can be as incomplete as the text it corrects** —
  establish the real mechanism, don't just swap one claim for another.
- **A partial finding is a lead, not a conclusion.** Finish reading before writing.

**Component-level verification** (learned from the Models page UI-vs-docs pass —
the changelog-driven flow misses quiet additions; these rules close the gap):

- **For a UI-vs-docs review pass, the live UI walk is MANDATORY — never ship a
  source-only reconciliation.** This is distinct from the automated changelog-driven
  sync (where the live UI isn't available). In a review pass the walk and the source
  play different, complementary roles: the **live walk is the completeness check**
  (what actually renders, in what control type, in what order), and **source confirms
  mechanics, conditionality, and removals.** Neither alone is enough. Learned the hard
  way on the Toolsets page (2026-10-07): a source-only pass was shipped, the user pushed
  back ("why didn't u check the UI"), and the live walk then caught 4 findings source
  had missed or under-reported — Forward-auth-token is a confirmation-popup selector
  (not a toggle), OAuth gained Client Registration Type + Token Endpoint Authentication
  Method, and Redirect URI is no longer a form field.
- **Changelogs have blind spots.** Silent additions, conditional-visibility
  changes, and field-type reworks are invisible to the three-source check.
  After the changelog reconciliation, do a full component scan per page to
  catch what the changelogs missed.
- **Read the FULL FE component tree, not just the top-level render.** Collapsible
  sections, toggle-reveal patterns (e.g. `DialSwitch` that shows a sub-selector),
  and conditional sub-components all live deeper in the tree. Follow every
  child import.
- **Fields are NOT universal across entity types.** The same component (e.g.
  `Endpoint.tsx`) renders differently depending on props the parent passes
  (e.g. `isInterfacesHidden`). Check each view's parent component to see what
  props it sends.
- **Always grep the full FE repo before confirming a removal.** "Not visible on
  this page" ≠ "removed from the product." A zero-hit grep across the repo is
  definitive; a missing field in one component is just a per-view decision.
- **Verify field types from source.** A `DialSwitch` toggle that reveals a
  selector popup is not a "text field." The docs must describe what the user
  actually interacts with. Read the component's JSX, not just its label.
- **The live UI is not part of the AUTOMATED flow** (changelog-driven sync) — there,
  FE source + release notes are the verification source. But this does NOT apply to a
  UI-vs-docs review pass, where the live walk is mandatory (see the first bullet above).
  Do not cite this line to justify skipping the walk.
- **FE repo uses the `development` branch** (not `main`). Use this for raw file
  fetches and GitHub API calls. `$GITHUB_TOKEN` env var is available; `gh` CLI
  is not installed.
- **Before executing edits, re-read section 3–4 of THIS file.** The write rules
  (stale-screenshot markers, prose conventions, never-write-unverified) are easy
  to skip when focused on content. Treat this document as a pre-flight checklist,
  not background reading.
- **Walk EVERY tab in the live UI before proposing edits.** When the user
  grants browser access, screenshot every tab top-to-bottom with all
  collapsible sections expanded. Do not skip tabs you "expect" are fine. Source-code
  analysis biases toward fields you already suspect; the UI walk catches what
  you didn't think to look for. Collect ALL findings across ALL tabs before
  proposing any changes — partial evidence leads to partial (wrong) conclusions.
- **Source analysis narrows; the UI walk completes.** Never let FE source
  investigation replace the full UI walk. Doing source first and then
  cherry-picking UI tabs to "confirm" is how you miss things (learned from the
  Applications page: checked only Properties/Features/Audit, skipped
  Parameters/Dependencies/App Routes/Roles/Interceptors).
- **Changelog-driven additions can land on the WRONG page.** A feature that
  ships in the Admin frontend may apply only to a specific view (Entities vs
  Assets vs Catalog). The changelog doesn't distinguish which view owns a
  feature. Learned from the Applications page: Code App source type, Catalog
  fields (vendorWebsite, catalogProperties, catalogSchemas), Interfaces section,
  and Skills supported toggle were all written into the Entities→Applications
  doc during catch-up, but they belong to Assets→Applications or don't exist
  at all. The UI-vs-docs walk catches these view-level misplacements.

## 2. Reconcile — the verdicts

### Three-source completeness check

Every release is reconciled against THREE independently-authored sources. Each
changelog line / release-note item must reach a verdict; any item present in a
source but missing a verdict is a gap to investigate before advancing.

| Source | Script / location | What it catches |
|---|---|---|
| **Git tag annotation** | `changelog.py` per repo | Developer's per-component feature list — primary targeting signal |
| **Component release notes** | Each repo's own `CHANGELOG.md` or `RELEASE_NOTES.md` (read at the target tag) | Detailed items the tag summary omitted — bug fixes, minor UI changes, deprecations |
| **DIAL platform release notes** | `docs/releases/<version>/release-notes-*.md` in this repo | Cross-component features, user-facing framing, items that span repos |

**Order:** reconcile the tag changelog first (it scopes the diff reading), then
cross-check against the component release notes, then against the DIAL platform
release notes. Items found only in the second or third source get the same
verdict treatment as any other changelog line.

### Verdict assignment

For each changed thing, compare source-truth to the current page text:

| Source says | Page says | Verdict | Action |
|---|---|---|---|
| A | A | **matches** | no-op |
| A | B | **changed** | rewrite that passage |
| A | (silent) | **new** | draft a new section (see V1 rule below) |
| (removed) | documents it | **removed** | delete the section |
| internal only | anything | **cosmetic** | no-op, record why |

Reconcile compares **text to text**. It can decide "label changed," "section
missing," "section now wrong." It **cannot** decide "the panel looks different" —
that is always a recapture flag, never a verdict here.

## 3–4. Write (V1 rules)

- **Write text edits directly** into the page files.
- **`new` feature, no existing section → write a best-effort section from source,
  then flag it hard.** A draft is easier to review than a blank. The flag tells the
  human to confirm it exists in the UI and check placement.
- **Prose conventions**: follow the `docs-page-writer` skill (frontmatter,
  terminology, forbidden words, sentence-case headings, relative `.md` links). Bump
  the page's `last_verified`.
- **Admin guide page patterns**: every admin guide page follows a consistent
  structure. Match these patterns exactly when writing new sections or pages:
  - **Grids** — every data grid gets a heading (`### … grid`) followed by a
    `| Column | Description |` table. Never describe grid columns in prose.
  - **Detail views** — organized by tabs, each with a `### Tab name` heading.
  - **Properties** — use a `| Field | Required | Editable | Description |` table.
  - **Create flows** — numbered steps with a
    `| Field | Required | Description |` table for the modal fields.
  - **Top bar controls** — `| Control | Description |` table.
  - **Actions** — `| Action | Description |` table (per-row actions, bulk actions,
    context menu items).
  - **Feature toggles** — `| Toggle | Description |` table.
  - **Binding types / source types** — `| Source type | Description |` table.
  See existing pages (`2.entities/2.applications.md`, `2.entities/1.models.md`,
  `4.assets.md`, `8.audit/2.monitoring-dashboards.md`) as the reference
  implementation. When in doubt, open the nearest sibling page and match its shape.
- **Stale-screenshot marker**: wherever an edit changes something a nearby
  screenshot shows, insert an HTML comment by the image so the divergence is visible
  in the diff and nothing silently contradicts an image:
  ```html
  <!-- SCREENSHOT OUTDATED: shows "Log in", text now says "Connect" -->
  ```
  The marker is removed when the screenshot is recaptured.
- **Never write an unverified claim as fact.** If a change can only be confirmed in
  the live UI, it goes in the Flag list, not into the page as settled text.

## 5. PR format (concise — humans won't read a lot)

Three sections, nothing else. One line per item: `page — what changed`. Counts in
the subtitle. Evidence lives in the diff/markers, not the PR body. Empty sections
are omitted.

```markdown
## Synced to chat <to> (DIAL <release>)
N pages updated · M need screenshots · K flagged

## Done
- toolsets.md — auth labels Log in→Connect; added API-key path
- conversations.md — new "Record voice" item in Add menu
- files.md — removed Compare mode (gone in migration)

## Recapture (M)
- toolsets.md — details panel (shows old "Log in")
- conversations.md — Add menu (missing "Record voice")

## Flag (K)
- agents.md — NEW "Scheduled runs" section drafted from source,
  unverified in UI — review placement + confirm it exists
```

Reviewer's job is a 30-second scan: read Done, recapture the flagged shots, decide
on the flags. Depth is in the diff for anyone who wants it.

## Boundaries (restate before building)

- **Text only.** Visual judgment is out of V1 → Recapture list.
- **Three buckets only.** Done / Recapture / Flag. An item that fits none doesn't
  go in the PR.
- **Self-contained.** No runtime dependency on `chat-guide-capture` or
  `docs-researcher`.
- **No commit/push beyond the PR branch** the pipeline is explicitly allowed to
  open; per repo `CLAUDE.md`, humans own merges.

## Harvest-before-delete

Before `chat-guide-capture` is removed, confirm these are carried into this skill
(above): the repo-layout facts (already in `manifest.yaml` + `source_roots`), the
migration check, and the four investigation heuristics. Nothing else from that
skill is needed at M2 runtime.
```
