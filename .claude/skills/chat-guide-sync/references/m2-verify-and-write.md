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

## 2. Reconcile — the verdicts

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

## 6. Three-source completeness audit (mandatory, after all edits)

After all page edits are written, cross-check against two additional sources
beyond the git diff that drove the work list. Every item must reach a verdict
before the PR can be opened.

### Source 2: DIAL Chat release notes

Read the GitHub release page for `epam/ai-dial-chat` at the `to` tag. For each
user-facing item listed:
- If already covered by an M2 edit → **done**
- If chat-relevant but not in the diff (e.g. a config-flag feature) → investigate,
  then **write** / **flag** / **no-op**
- If not chat-guide-relevant (adapter, SDK, infra) → **no-op** with reason

### Source 3: DIAL platform release notes

Read `docs/releases/<dial-version>/` (both the release notes and upgrade guide).
For each item that mentions Chat or affects the Chat UI:
- Same verdict logic as Source 2.

### Recording

Append the audit results to the reconciliation scratchpad. The PR body's Done /
Recapture / Flag lists must reflect ALL three sources, not just the diff.

**The sync is not complete until every item across all three sources has a
verdict.** This is a hard gate, not optional polish.

## Boundaries (restate before building)

- **Text only.** Visual judgment is out of V1 → Recapture list.
- **Three buckets only.** Done / Recapture / Flag. An item that fits none doesn't
  go in the PR.
- **Self-contained.** No runtime dependency on `chat-guide-capture` or
  `docs-researcher`.
- **No commit/push beyond the PR branch** the pipeline is explicitly allowed to
  open; per repo `CLAUDE.md`, humans own merges.
- **Three-source completeness check is mandatory.** Do not open the PR until every
  item from the diff, the Chat release notes, and the DIAL platform release notes
  has a verdict.

## Harvest-before-delete

Before `chat-guide-capture` is removed, confirm these are carried into this skill
(above): the repo-layout facts (already in `manifest.yaml` + `source_roots`), the
migration check, and the four investigation heuristics. Nothing else from that
skill is needed at M2 runtime.
```
