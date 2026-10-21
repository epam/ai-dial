# Capture & prose reference

Two bodies of hard-won knowledge harvested from the retired `chat-guide-capture`
skill, condensed for the incremental/CI world:

1. **Screenshot capture discipline** — not used in V1 (screenshots are flagged for
   a human via the PR's Recapture list), but required when the capture milestone
   (M3) automates or semi-automates shots. Don't re-derive it; it was expensive to
   learn.
2. **Write & structure lessons** — apply now, to sharpen M2's drafting quality.

---

## 1. Screenshot capture discipline (for M3)

Captured against the **live** app with a logged-in account. The scripts
`scripts/crop.py` and `scripts/mask.py` support this.

### Never harm or expose the live environment
- **Dedicated test/demo account only.**
- **Never delete, rename, or modify any pre-existing item** in the live UI — no
  existing conversation, prompt, folder, share, publication, or setting. To show a
  destructive action (e.g. Delete), open the confirmation dialog and **Cancel**.
- Content the user **explicitly designates** disposable is the only content yours to
  edit/fill/delete. Names don't reveal it — get the list from the user.
- **Plan disposable demo content before creating it**, itemized, and get a go-ahead.
  Keep it topical (don't attach an unrelated real asset to a themed demo).
- **Confirm an itemized teardown before deleting demo content**, per finished file.

### Mask sensitive data (`scripts/mask.py`)
- Redact any real name, email, avatar, API key/secret, or **environment hostname**
  that appears — even on a test account (other users' content shows up in
  Marketplace/Publications/Sharing screens).
- Hostnames matter on **Connect**-style panels: endpoint URLs and cURL snippets
  expose the internal host (`core.<env>.dial.parts`). Blur the host, keep the path
  and the `<key>` placeholder (the parts the reader needs).
- `mask.py` **blurs** (never a solid box — a hard box reads as a defect on a light
  UI). Keep the region tight around just the sensitive text.
- Prefer a **scoped/zoomed screenshot that excludes** the sensitive area when that's
  cleaner than masking.

### Never expose the account's real item lists
- Before any shot showing the `Chats` sidebar, `My chats`, or `Organization`
  sections: collapse those groups, or type in **Search** to filter down to the one
  disposable demo item. Navigating away/reloading re-expands groups — re-check
  immediately before each capture.

### Shot mechanics
- **screenshot (full) vs zoom (region):** zoom tightly around an isolated
  dialog/menu/icon-row (a full shot makes small UI illegible); use a wider region
  when the value is the whole-page context. Leave **breathing room on all four
  sides** — a flush crop looks cut off and often clips.
- **Prefer editing an already-saved capture over re-fetching.** Both `screenshot`
  and `zoom` are live round-trips costing real image tokens; if the pixels already
  exist on disk, reframe locally with `scripts/crop.py`.
- **One screenshot per step/page, not per field.** A builder with six sections gets
  one shot per step, fields in a table.
- Save to `docs_v2/chat-user-guide-new/img/` (and a section's own `img/`, e.g.
  `3.catalog/img/`), short descriptive names.

### The coordinate-convention trap (wastes whole passes)
- Browser `zoom` takes a **bounding box**: `[x0, y0, x1, y1]`.
- `crop.py` / `mask.py` take **origin + size**: `"x,y,w,h"`.
- Passing a zoom-style box to `mask.py` blurs a far larger region (it reads `x1,y1`
  as width/height) — the giveaway is a blur swallowing neighboring rows. Measure
  against the actual saved file (`Image.open(path).size`), not a downscaled preview.

### Live-UI gotchas
- The prompt/skill/Quick-App instruction fields are **Markdown editors that
  auto-continue lists**; typing your own `1.`/`2.` produces doubled markers. Let the
  editor number, or write prose paragraphs. Zoom in and read it back (duplication is
  invisible at small scale).
- A details panel **re-renders and shifts** a beat after opening — screenshot, *then*
  click, when acting inside it.
- To upload a demo file, target the hidden `<input type="file">` in the open dialog
  (not a native "Browse" button, which opens an unobservable OS picker). The source
  must be a path the session can already read (a repo-local temp file, `Read` once
  first).

### Verify a surprising negative twice
If an expected dialog/panel/step doesn't appear, retry the exact action once more
before concluding a feature was removed — a stale ref or a race produces false
negatives. (Also one of the M2 heuristics in `m2-verify-and-write.md`.)

---

## 2. Write & structure lessons (apply to M2 now)

Prose conventions live in the `docs-page-writer` skill; these are the extra lessons
specific to this guide that drafting should honor.

- **Enumerate every type and state before describing a shared surface.** One example
  is not the pattern. A details panel has a different tab set per entity type (models
  5, toolsets 4, agents 3, skills/prompts 2) and different buttons by
  ownership/state. Check each before writing "the panel has N tabs."
- **State rules by their real cause.** Edit = owner OR shared-with-edit-rights;
  Delete = owner only; Share = owner only. Frame by ownership, not publication state.
- **Say what a thing is for, not what category it is.** "Write the procedure once and
  the agent picks it up when a task matches" beats "reusable instruction module."
- **Describe actual behavior, not the button label.** "Use in chat" does different
  things per entity type — say what happens.
- **No em dashes.** Use a period, comma, or colon. Avoid the paired-dash aside.
- **Keep screenshot density uniform inside a list** — illustrate every item in a row
  of icons or none; prefer one image of the whole row.
- **When the user supplies a screenshot, write the section from the image**, not from
  a feature blurb. Read the file, then write.
- **When prose gains a menu item, confirm the cited screenshot shows it** — else flag
  it for recapture (don't leave the mismatch silent).
- **TOC renders only `##`/`###`.** Every action a reader might search for must be an
  `##` or `###` heading, not a list item. Shape: one `##` parent with an `###` per
  action — not a flat run of `##`, not actions buried in lists.
- **Organize by the thing being acted on, not by journey phase.** Section-name tests:
  does it name one unambiguous thing; is it a catch-all; are two sections the same
  action twice; does it earn its place or just narrate a screenshot; does it sit where
  the reader needs it.
- **Keep a one-sentence scope line, but don't pad it** (no restating audience /
  prerequisites on every subpage).
