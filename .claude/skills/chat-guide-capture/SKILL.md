---
name: chat-guide-capture
description: >-
  Create the rebuilt DIAL Chat User Guide from scratch in `docs_v2/chat-user-guide-new/`,
  grounded in both the live app and the `epam/ai-dial-chat` source code, reusing salvageable
  prose from the outdated `docs_v2/6.chat-user-guide/`. Use this whenever the user asks to
  redo, rebuild, or draft an updated Chat User Guide, to verify a chat-guide claim against the
  chat app's actual source, or to capture fresh screenshots for it — even when phrased loosely
  ("the chat guide is outdated", "rebuild the user guide", "start the new chat guide folder").
  Hands off prose conventions to `docs-page-writer` and QA to `docs-auditor`; hands off source
  investigation to `docs-researcher`.
compatibility: >-
  The native `claude-in-chrome` browser tools (navigate, click, screenshot with
  `save_to_disk`), with a logged-in DEDICATED TEST ACCOUNT; a python with Pillow installed for
  redaction and local cropping.
---

# DIAL Chat User Guide Rebuild

The current `docs_v2/6.chat-user-guide/` documents the **pre-rebrand** DIAL Chat app. This skill
builds its replacement in a **new, separate folder** — `docs_v2/chat-user-guide-new/` — so the
live guide stays untouched until the user explicitly decides to swap it in later. It does not
own writing style or QA; it owns getting the *content* right (what's true about the current app)
and capturing the screenshots. Once a file's content is solid, finish it with the repo's existing
skills:

**source research (`docs-researcher`) → old-guide harvest (this skill) → UI capture (this skill)
→ prose (`docs-page-writer`) → QA (`docs-auditor`)**

## Hard constraints (non-negotiable unless the user explicitly relaxes one)

- **Never commit or push in this repo.** Per this repo's `CLAUDE.md`, the user handles all git
  operations manually. Prepare and describe changes; never run `git commit`/`git push`/any
  variant here.
- **Dedicated test/demo account only**, logged into the Chrome window the browser tools drive.
- **Never delete, rename, or modify any pre-existing element in the live chat UI** — no existing
  conversation, prompt, folder, share, publication, or setting gets touched. If a flow needs
  something to interact with (e.g. a conversation to demonstrate a context menu on), create new,
  disposable, synthetic content for that purpose only — never touch what was already there. To
  illustrate a destructive action (e.g. Delete), open the confirmation dialog and Cancel rather
  than confirming it. The exception is content the user **designates** as disposable: those items
  are yours to edit, fill in, and delete. Get the list from the user explicitly — names do not
  reveal it (an account can hold a "Jira agent" that is a throwaway and a "DIALX Landing Mind Map"
  that must not be touched).
- **Plan disposable demo content before creating it, itemized, and get the user's go-ahead.**
  Before touching the live UI to create anything (a conversation, prompt, skill, toolset, file,
  folder), list exactly what will be created, what each item is for, and confirm it fits the
  scenario topically (e.g. don't attach an unrelated real asset like a logo file to a "recipe"
  demo conversation — create or reuse something that matches the demo's own topic). Wait for
  confirmation before creating.
- **Confirm an itemized teardown before deleting demo content**, per file finished (not batched at
  the very end of the whole guide): list every demo conversation/prompt/skill/toolset/file/folder
  created for that file's screenshots and wait for the user's go-ahead before deleting each one.
  This keeps any single mistake scoped to one file's worth of throwaway content.
- **Mask sensitive information in screenshots**: any real name, email, avatar, API key/secret, or
  **environment hostname** that appears — even from a test account, e.g. because other real users'
  content is visible in Marketplace, Publications, or Sharing screens — gets redacted with
  `scripts/mask.py` before the image is used. Hostnames matter on any **Connect**-style panel:
  endpoint URLs and cURL snippets expose the deployment's internal host (`core.<env>.dial.parts`),
  which does not belong in public docs — blur the host but leave the path and the `<key>`
  placeholder visible, since those are the parts the reader needs. `mask.py` **blurs** the region (never a solid fill/black box — the UI is light,
  and a hard box reads as a defect, not a redaction); keep the blurred region tight around just
  the sensitive text itself (e.g. a name), not the whole surrounding sentence. Prefer a
  **scoped/zoomed screenshot** (the `zoom` action) that simply excludes the sensitive area when
  that's cleaner than masking.
- **Never expose the account's real conversation/prompt/agent/toolset list.** Even on a dedicated
  test account, real items accumulate messy or unprofessional names over time. Before any
  screenshot that would show the `Chats` sidebar, `My chats`, or `Organization` sections: either
  collapse those groups (click the section header), or type into the **Search** box to filter the
  list down to just the disposable demo item being illustrated. Note that navigating away and
  back (or a page reload) re-expands collapsed groups — re-check immediately before every capture
  that depends on this, don't assume a collapse from three steps ago still holds.
- **Verify a surprising negative result twice before writing it down.** If an expected dialog,
  panel, or confirmation step doesn't appear, don't conclude the feature was removed on the first
  try — retry the exact action once more (a double-click, a stale ref, or a race with a toggle
  can silently produce a false negative) and only report "this no longer exists" once reproduced.
- **Output stays inside `docs_v2/chat-user-guide-new/`** (`.md` files + its own `img/`
  subfolder). Don't edit `docs_v2/6.chat-user-guide/` or `sidebars-v2.js` — wiring the new folder
  into the site is a separate, later, explicit step the user decides on.

## Connecting the browser tools

The `mcp__claude-in-chrome__*` tools are usually deferred — load them in one `ToolSearch` call
before Phase 4 (or earlier, if Phase 1 also needs to browse):

```
ToolSearch: select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp
```

If `ToolSearch` finds nothing, the extension isn't connected in this session yet. `/chrome` may
not exist in every environment (observed on at least one managed/enterprise deployment) — if so,
don't rely on it. Instead, ask the user to send a message that mentions `@browser` (this reliably
triggered the connection in practice), then retry the `ToolSearch` call above. If that still finds
nothing, stop and tell the user Chrome integration isn't available here rather than guessing
further.

Once loaded: call `tabs_context_mcp {createIfEmpty: true}` once to get a tab, then drive/capture
with `browser_batch` as described in Phase 4.

## Step 0 — Gather inputs

Confirm before starting:

1. **Scope** — full guide (all files, see Phase 3) or a named subset/trial file first.
2. **Live DIAL Chat URL**, and confirmation the browser's logged-in session is the dedicated test
   account.

## Phase 1 — Learn the current UI from source

Don't rely on clicking alone for behavioral details (limits, validation rules, exact logic) —
verify them against the source. Use the `docs-researcher` skill's approach for `epam/ai-dial-chat`
(already catalogued in its `references/repo-map.md`: TypeScript, NX monorepo, main app under
`apps/chat/`, shared libs under `libs/`, including `libs/overlay/` and `libs/theming/`). A quick
lookup (a few files) can be answered inline; anything broader is worth a real `docs-researcher`
brief, since later phases will keep needing to check specific claims against it.

**Check migration status before writing anything down as current.** `ai-dial-chat` (routes under
`chat-ng` in some deployments) is a ground-up rewrite, not just a UI refresh — plenty of
old-guide features are temporarily or permanently absent, not renamed. Before assuming an old
guide feature still applies:

- Check the repo's open issues labeled `in-migration`:
  `https://api.github.com/search/issues?q=repo:epam/ai-dial-chat+is:issue+state:open+label:in-migration`
  (via `WebFetch`). Each title names a legacy feature not yet shipped in the new chat (e.g.
  "Compare Mode", "Playback Mode", "Replay Mode", "Conversation Drag & drop and folders",
  "Conversation Panel - Select mode", "Support dark theme for new chat" were all found this way).
- Check for a migration-guide doc in the repo, e.g.
  `github.com/epam/ai-dial-chat/blob/development/docs/legacy-chat-migration-guide.md` — it lists
  features migrated, features with no successor planned, and renamed concepts (e.g.
  `marketplace` → `catalog`) directly.
- Treat a UI element's absence (checked live, twice — see the hard constraints) as corroborating
  evidence, not the primary signal; the migration issues/doc are authoritative for "coming later"
  vs. "gone for good", which the UI alone can't distinguish.
- **Tooling note**: `gh` CLI is not available in this environment, and a `GITHUB_TOKEN` env var
  may not authenticate against `api.github.com` (observed: "Bad credentials" even against
  `/user`) — don't spend long debugging that. `WebFetch` against `github.com` HTML pages and
  `raw.githubusercontent.com` file URLs works reliably for public repos and is the fallback.
- **Terminology**: don't carry old-guide capitalization/spacing forward uninspected — confirm the
  exact live label (e.g. the live UI's Catalog tab and card badge read "Toolset", one word, not
  the old guide's "Tool Set"). **The live UI and the user's instruction outrank
  `docs-planning/glossary.md`**, which still reflects the pre-rewrite app (it mandates "tool set"
  and has no Skill entry at all). Follow the live label, and tell the user the glossary entry is
  stale rather than silently complying with either side.
- **After a terminology correction, sweep the whole output folder** —
  `grep -rn -i "<old spelling>" docs_v2/chat-user-guide-new/` — before replying. Corrected terms
  reappear in the places prose review skips: link labels, table cells, image alt text, and
  "Next steps" lists. Being told the same correction twice is the failure mode to avoid.

## Phase 2 — Harvest the old guide

There are **two** legacy sources, and the second is the better one:

1. `docs_v2/6.chat-user-guide/` (`0.index.md` … `7.settings.md`) — the restructured but outdated
   copy. Closest to the target file layout.
2. **`docs/tutorials/0.user-guide.md`** — the original single-file guide (~2000 lines). It is
   wordier, but it carries the *reasoning* the restructured copy dropped: why a feature exists,
   what breaks without it, and definitions worth adapting. Read the sections relevant to the file
   you are writing before drafting it — for example, its Toolsets section explains that an agent
   using an un-authenticated toolset fails with an authentication error, and distinguishes
   personal from organization credentials in terms of *who the connection belongs to*. Adapt the
   substance into the new guide's voice; never paste its prose or its heading style.

For each described feature/section, classify it:

- **Still accurate** — reuse the prose as-is (or nearly) in the new file.
- **Still present, but changed** — reuse the surrounding structure/wording as a starting point,
  rewrite the parts that no longer match, and verify against Phase 1 findings.
- **No longer exists** — drop it; note it so it isn't accidentally reintroduced.
- **New in the app, no old equivalent** — write fresh; nothing to reuse.

## Phase 3 — File structure for the new guide

Start from the old guide's breakdown and the heading style, tone, and conventions of `docs_v2`.
Deviate where Phase 1/2 show the live UI has no equivalent for an old file (drop or merge it) or
a feature area with no home (add one). **Propose any delta to the user before creating files** —
don't silently redesign the structure.

The structure agreed and built so far:

```
0.index.md            Overview and interface
1.conversations.md    Conversations
2.catalog/            Catalog — a section, not one page
  0.index.md          what the Catalog is, favorites, browse/filter/sort, Create menu
  1.models.md  2.agents.md  3.toolsets.md  4.skills.md  5.prompts.md
  img/
3.files.md  4.sharing-and-publishing.md  5.usage-and-settings.md
```

Two lessons behind that shape:

- **One page per entity type, not one page covering all of them.** The Catalog started as a
  single flat page and had to be split: each entity type has its own details panel, its own
  actions, and its own builder, so they do not compress into shared sections without going vague.
  When a page starts needing "this differs by type" qualifiers in several sections, that is the
  signal to split it — propose the split before writing another long draft.
- **Renumber downstream files when the shape changes.** This repo requires a file's numeric
  prefix to equal its position in the menu (`CLAUDE.md`), so inserting or nesting a section
  renumbers everything after it, and every `./N.name.md` link in already-written pages has to be
  updated. Verify with a link check (see Phase 4b) rather than by eye.
- **A section folder keeps its own `img/`** (`2.catalog/img/`), matching how `docs_v2` sections
  already do it. Pages inside reference `img/...`; pages a level up reference `2.catalog/img/...`.

## Phase 4 — Per file: capture, then write

**This discipline applies to *every* subsection of a file, including ones that feel "obviously
unchanged" from the old guide** — not just the exciting new features. The failure mode observed
in practice: once a few genuinely new features (e.g. a new panel, a new entity type) were
carefully verified live, everything assumed "carried over from the old guide" got written from
memory/old-guide prose instead of being re-screenshotted and re-verified — including things that
had in fact changed (a naming rule, a dialog's exact fields, whether a menu item still exists).
Treat "I looked at this earlier while checking something else" as equivalent to "not yet
captured for this file" unless the resulting image is already saved into `img/` and cited in the
prose. Before considering a file's capture pass done, walk its planned section list one by one
and confirm each has either a saved image or an explicit "no screenshot needed" reason.

**Enumerate every type and state before describing a shared surface.** One example is not the
pattern. The details panel looked like "About / Overview / Connect" from the first agent opened,
and that went into the draft as "the panel has up to three tabs" — wrong for four of the five
types (models have 5: About, Overview, Pricing, Limits, Connect; toolsets have 4, including
Tools; skills and prompts have 2: Details, Overview). The same applies to a panel's buttons:
they change with ownership and state (an org-published agent offers only **Use in chat**; your
own adds **Share** and a **...** menu; an unauthenticated toolset shows **Manage credentials**,
the same toolset signed in shows **Log out**; a skill shows **Download**). Open one of *each*
type, and both an owned and a not-owned example, before writing the section.

**Choose the example deliberately, and keep it consistent within a section.** Don't tour a panel
with one item and then switch subjects mid-section. Use a real, richly-filled organization item
for "what this panel shows" (empty dummy items make the tabs look empty and teach nothing), and
switch to the user's own disposable item only where ownership-specific actions are the point —
that contrast is itself worth showing. Ask the user which items are safe to touch rather than
inferring it from names; and if the dummy items exist but hold placeholder text, ask to fill
them with meaningful content **before** capturing, not after.

**One screenshot per step or page, not per field.** A builder with six sections needs one shot of
each wizard step, with the fields themselves in a table. Per-field screenshots bloat the page and
rot as soon as a label changes.

**Verify that Cancel actually discarded something.** A create flow can persist a draft the moment
you advance past step 1 — the Quick App builder did, and the item appeared in the Catalog with a
real id even though Cancel was clicked. Checking the count immediately after the click is not
enough; the list can still be cached. Reload the Catalog, re-check the count, and if a draft
survived, delete it and record the behavior in the page as a caution to readers.

For each target file:

1. **Drive the live UI** with the native browser tools (`tabs_context_mcp` once per session to
   get a tab, then `browser_batch` of `navigate`/`computer` clicks to reach each state that needs
   a screenshot).
2. **Capture**: `computer` with `action: "screenshot"` (full page) or `action: "zoom"` (a region).
   Pick based on what the screenshot needs to prove, not out of habit:
   - **The value is the whole page context** (e.g. a response together with its action icons, so
     the reader sees where things sit) → `zoom` a region that excludes only the sidebar column
     (roughly `x < 290` in a 1568-wide viewport) and keeps the rest full-context. Don't narrow
     further than that.
   - **The value is one isolated dialog/menu/control** (e.g. a dropdown's contents, an icon row)
     → `zoom` tightly around just that element. A full-page screenshot makes small UI (icon rows,
     menu items) illegible — always zoom for these rather than shipping a full screenshot where
     the actual subject is a few pixels tall.
   - Either way, **leave breathing room on all four sides**. A crop that ends flush against the
     subject looks cut off and often does clip something — a button's edge, the first letters of
     a label, the last line of a paragraph. Include the surrounding whitespace, then look at the
     returned image (not just the region numbers) before saving.
   - Use `save_to_disk: true` and read the saved file back to confirm it looks right before using
     it.
3. **Prefer editing an already-saved capture over re-fetching from the browser.** `zoom` is not
   "cheaper" than `screenshot` — both are live round-trips that cost real image tokens. If a
   screenshot taken this session (or earlier) already contains the pixels needed, just reframe it
   locally: `<python-with-pillow> scripts/crop.py <src> <dst> "x,y,w,h"`. Only go back to the live
   browser when the actual page content/state needs to change (reopening a dialog, a different
   hover state, etc.).
4. **Redact if needed**: if anything sensitive is visible, measure the region from the saved file
   (not a downscaled preview) and run
   `<python-with-pillow> scripts/mask.py <src> <dst> "x,y,w,h" [more regions...]` — this blurs the
   region (see the hard constraints above for what counts as sensitive and how tight to keep it).
   Verify the masked result before moving on.

   **Mind the coordinate convention — the two tools disagree, and this wastes whole passes.**
   The browser `zoom` action takes a *bounding box*, `[x0, y0, x1, y1]`. `mask.py` and `crop.py`
   take *origin plus size*, `"x,y,w,h"`. Passing a `zoom`-style box to `mask.py` silently blurs a
   region far larger than intended (it reads `x1,y1` as width and height) — the giveaway is a
   blur that swallows neighbouring rows and leaves a hard smear at the image edge. Also note the
   saved file's pixel size equals the `zoom` region's size, so measure against that, and confirm
   with `Image.open(path).size` rather than assuming.

   Re-masking an already-masked file to widen a region is fine, and is usually quicker than
   recapturing. Leftover characters at a blur's edge (the tail of a hostname, say) mean the box
   was too narrow — widen and re-run.
5. **Place the image**: move/rename the saved file into `docs_v2/chat-user-guide-new/img/` with a
   short, descriptive name (e.g. `conversation-context-menu.png`), matching the naming style
   already used in `docs_v2/6.chat-user-guide/img/`.
6. **Write the file**: combine Phase 2's salvageable prose, Phase 1's source-verified facts
   (including anything the migration-status check ruled out), and what Phase 4 just captured.
   Reference images the same way the current guide does (`![description](img/filename.png)`,
   inline near the relevant step). Hand off structural/style correctness to the `docs-page-writer`
   skill (`user-guide` type: frontmatter, terminology, "Feature overview → UI walkthrough → Tips →
   Next steps", no forbidden phrases, relative `.md` links, "Next steps" section).

## Phase 4b — Write for a person, then read it back

Capture accuracy is not enough: a page can be entirely correct and still be rejected for reading
like generated filler. The repeated feedback on the first Catalog draft was "it does not sound
natural" and "it feels like you do not see your own work". Concrete rules that came out of it:

- **Lead with substance, not a summary of the page's own contents.** An opening that lists what
  the page will cover ("This page shows you how to find, favorite, and use…") tells the reader
  nothing they cannot see from the headings. Open with what the thing *is* and what it is *for*.
- **Don't restate the title as the first section.** `# Catalog` followed by `## The Catalog` is a
  structural tell that the intro paragraph was filler — if the section under the title says it
  better, delete the intro and promote the section's text.
- **Explain a concept before you reference it.** Mentioning **Share** in the Models section when
  sharing is only introduced two pages later reads as though the pages were written out of order
  (they were).
- **State rules by their real cause.** "You can edit and delete only items you created" is the
  actual rule — ownership. Framing it around publication state ("for an agent you own and haven't
  published, the menu offers Edit, Publish, Delete") buries the rule and implies things that
  aren't true.
- **Say what a thing is for, not what category it belongs to.** "Reusable instruction modules an
  agent loads on demand" is vocabulary. "Write the procedure once — how your company processes a
  claim — and the agent picks it up when a task matches" is a definition a user can act on.
- **Prefer the user's vocabulary over your own paraphrase.** "AI models available in your
  environment" beat "language and image models"; "all AI agents you can use — your own and those
  published organization-wide" beat "models and applications configured for conversation".

Then **actually re-read the finished page top to bottom** before reporting it done — as a reader
who has not seen the app, not as the author checking off sections. Confirm:

1. Every claim about a panel, menu, or field matches a screenshot you captured, for *every* type
   it applies to (see the enumeration rule in Phase 4).
2. No term the user has corrected survives anywhere, link labels and tables included.
3. Links and images resolve. Walk every relative target and report anything unresolved that is
   not a deliberate forward reference to an unwritten page:

   ```
   python - <<'EOF'
   import pathlib, re
   root = pathlib.Path("docs_v2/chat-user-guide-new")
   for md in sorted(root.rglob("*.md")):
       for t in re.findall(r"\]\(([^)]+)\)", md.read_text(encoding="utf-8")):
           if t.startswith(("http", "#")): continue
           p = t.split("#")[0]
           if p and not (md.parent / p).resolve().exists(): print(md, "->", t)
   EOF
   ```

   The same script, inverted, finds images in `img/` that nothing references — usually leftovers
   from a superseded draft that should be deleted.
4. Anything you could not verify live is either omitted or flagged to the user — never written as
   though it were confirmed, and never hedged into vagueness inside the page itself.

## Phase 5 — Audit

Run the `docs-auditor` skill on each finished file (or the whole new folder) before calling it
done.

## Phase 6 — Handoff

Summarize what was created/changed. **Do not commit or push.** Flag explicitly that
`docs_v2/chat-user-guide-new/` is a draft sitting outside the built site (not in
`sidebars-v2.js`) — folding it in to replace `docs_v2/6.chat-user-guide/` is a separate step for
the user to request explicitly when ready.

## Key paths

- New guide: `docs_v2/chat-user-guide-new/*.md` + `img/`, with a section folder keeping its own
  `img/` (e.g. `2.catalog/img/`).
- Old guide (read-only reference): `docs_v2/6.chat-user-guide/*.md` + its `img/`.
- Original single-file guide (richer reference): `docs/tutorials/0.user-guide.md`.
- Source repo for verification: `github.com/epam/ai-dial-chat` (via `docs-researcher`).
- Companion skills: `docs-researcher` (source investigation), `docs-page-writer`
  (prose/structure/terminology), `docs-auditor` (QA).
- Bundled scripts (capture itself uses the native browser tools directly):
  - `scripts/mask.py` — redaction (blurs a region; see hard constraints).
  - `scripts/crop.py` — reframe an already-saved screenshot without a live re-fetch.

## Typing into the app's editors

The prompt, skill, and Quick App instruction fields are Markdown editors that **auto-continue
lists**. Typing your own `1.` / `2.` numbering produces doubled markers (`2. 2.`) and drags the
following paragraph into the list. Either type the first marker and let the editor number the
rest, or — simpler when filling demo content — write prose paragraphs and avoid list syntax
entirely. Always zoom in on the result and read it back; at 0.6 scale the duplication is
invisible.

Note also that the panel re-renders and shifts horizontally a beat after it opens, so a click
queued in the same `browser_batch` as the one that opened it often lands on the old position (or
on a card behind the panel). Take a screenshot, then click, when acting inside a details panel.

## Uploading a disposable demo file

To attach a file to a demo conversation, use `mcp__claude-in-chrome__file_upload` against the
hidden file input inside the currently-open attach dialog (`find`/`read_page` to get its `ref` —
there may be more than one file input on the page; pick the one scoped to the open dialog, not one
in the header/nav). The source file must be a path this session can already read — a path under
the project's working directory (e.g. a scratch file under a repo-local temp folder, `Read` it
once first) works; an arbitrary OS temp/scratchpad path may be rejected with "only files this
session is allowed to read can be uploaded" even though it looks like the same kind of path.
Never click a native "Upload files"/"Browse" button directly — that opens an unobservable OS file
picker; go straight for the underlying `<input type="file">` via `file_upload`.
