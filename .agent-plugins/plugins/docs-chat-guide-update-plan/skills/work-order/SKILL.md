---
name: work-order
description: Use when turning the release researchers' findings into the DIAL Chat User Guide work order, the file the plan pull request adds as .research/chat-user-guide-<DATE>.md, and when writing that PR's short body. Covers merging findings across repositories, checking each against the page at the base, the six item types (retake, add, or remove a screenshot; replace, add, or remove text), the exact item format plan_checks.py parses, UI paths, screenshot capture rules for writers, the work order file (Summary, Manual updates, Changes in the releases with links, Reviewed no guide impact, Needs review), ordering, and the PR body (Summary with the link to the work order and the not-ready line, Verification).
user-invocable: false
---

# The work order

The work order is a Markdown file that the plan pull request adds as `.research/chat-user-guide-<DATE>.md`. Writers follow it to update `docs_v2/8.chat-user-guide/`. They take each screenshot, edit each line, tick the item's box in the file, and push to the PR's branch. It has to be exact enough that a writer who hasn't read the releases can do every item without research, and short enough to scan.

It has two parts the writers asked for:

- **Manual updates**: what to change, where, and how, item by item.
- **Changes in the releases**: what changed for users and why it matters to the guide, with the links that show it.

Write it to `<WORK>/work-order.md` at step 6, then check it with `plan_checks.py` (`docs-chat-guide-update-plan:checks`). Step 9 copies it into the branch unchanged (`docs-chat-guide-update-plan:pr`, section 4). The PR body is separate and short (section 7): it links the file and holds Verification.

## 1. From findings to items

1. **Collect** every finding of every `<WORK>/research/<NAME>/findings.md`, and every hit of `<WORK>/text_hits.json`.
2. **Merge duplicates.** One UI change can come from two repositories: the Quick App editor renders DIAL Chat's packages, and DIAL Chat hosts the editor. Two findings that change the same element on the same screen become one item, with both sources.
3. **Keep each page's window.** A finding counts for a page only when it shipped on or after that page's `last_verified` date. That is the window the researcher reported it in.
4. **Check the page at `<BASE>`.** Read the section the finding names, and confirm what it says or shows now. An item exists only when the page says or shows something the target doesn't match. When the page already matches, the finding goes to "Reviewed, no guide impact" with the reason "the guide already matches".
5. **Match the text hits.** Every strong hit, and every weak hit that is the UI text in prose, is either an item or a line under "Reviewed, no guide impact". A hit no finding explains is a lead: look at the string's key in the target's string file before you decide.
6. **Decide the type** (section 2). Several actions on one screen are separate items, in reading order, such as a text replacement and a retake of the same screenshot. The writer ticks them one by one.
7. **Send the rest to "Needs review"**: a finding marked "Needs review", a "Not settled" item, a change with no page, and anything that needs a decision, such as a new feature that may deserve a section.

## 2. Item types

| Type | When | Fields after Where |
|---|---|---|
| **Retake a screenshot** | an existing image shows a screen that gained, lost, renamed, or moved something the image would show | Image, Capture, Source |
| **Add a screenshot** | a new screen, dialog, or menu that the section describes, or should, and no image shows | New image, Capture, Source |
| **Remove a screenshot** | the screen an image shows is gone | Image, Source |
| **Replace text** | a quoted label, value, or sentence no longer matches the UI | Replace, Source |
| **Add text** | a section's topic gained something a user sees or does: a field, a button, a menu item, a step | Text, Source |
| **Remove text** | a section describes something that is gone | Remove, Source |

A retake keeps the file name, so it needs no edit to the page, unless the alt text names something that changed; then add a "Replace text" item for the alt text. Write "Add text" only into a section that already covers the topic, as a draft the writer checks in the UI. A new section or page is a decision, so it goes to "Needs review".

## 3. UI paths

The UI path is the clicks a user makes to reach the screen, from the sidebar, joined by `→`, in the target's own words: `Catalog → Create → Quick App → Configuration → Advanced settings`. Name a click on an item by its kind: `Catalog → Toolsets → any toolset → ··· → Edit`. Name the condition when one applies: `Sidebar → Scheduled tasks (when your deployment enables them) → New task`. The UI paths of the guide's pages are in `docs-chat-guide-update-plan:guide-map`, section 1.

## 4. Item format

`plan_checks.py` parses this format; keep it word for word:

```markdown
- [ ] **<N>. <Type>.** <UI path>
  - **What changed:** <one sentence, in the user's words, with the release>
  - **Where:** `<PAGE>`, section "<HEADING>", line <LINE>
  - **Image:** `<IMAGE>`
  - **New image:** `<IMAGE>`
  - **Capture:** <what the new screenshot must show>; alt text: "<ALT>"
  - **Replace:** `<OLD>` → `<NEW>`
  - **Text:** <the draft sentence or table row, ready to paste>
  - **Remove:** lines <A>–<B>, <what they hold>
  - **Source:** [<REPO>#<PR>](<URL>), [`<FILE>#L<A>`](<URL at the tag>) · <TAG> (<YYYY-MM-DD>)
```

- `<N>` runs from 1 through the whole work order, with no gaps, so a review comment can say "item 7".
- Use only the fields the type needs (section 2), plus "What changed", which every item has.
- **Where:** `<PAGE>` is relative to `docs_v2/8.chat-user-guide/`, such as `3.catalog/2.agents.md`. `<HEADING>` is the nearest heading above the line, word for word, without `#`. `<LINE>` is at `<BASE>`: the line the writer edits, or for a screenshot, the line of its `![…](…)`. For a new screenshot or text, it is the line after which it goes. Take the lines from `<WORK>/guide.json` or `grep -n`, never from memory.
- **Image** and **New image** are relative to the guide folder too: `3.catalog/img/quickapp-advanced-settings.png`. A new image goes in the page's own `img/` folder, with a short kebab-case name.
- **Replace:** `<OLD>` is copied from the line, character for character, and is long enough to be unique on it; `<NEW>` is the target's text. Quote the UI's text, not a paraphrase.
- **Source:** at least one link to the PR, the release page, or the file at the target tag, and the release that shipped it as `X.Y.Z (YYYY-MM-DD)`. File links are pinned to a tag: `https://github.com/<REPO>/blob/<TAG>/<FILE>#L<N>`.

## 5. Screenshot rules for the writers

The Summary carries these once, so items don't repeat them:

- Use a test account and demo content. Don't change or delete existing items; to show a destructive action, open its dialog and cancel.
- Blur real names, emails, avatars, keys, and environment host names, such as the host in a **Connect** tab's endpoint. Collapse or filter the **Chats** list so no real conversation shows.
- Crop to the screen, dialog, or menu the item names, with a margin on every side. Match the size and framing of the image you replace.
- Save as PNG under the file name the item gives. A retake overwrites the old file.

## 6. The work order file

Omit nothing: a section with nothing in it says "None." `plan_checks.py` requires these five headings, in this order, under one H1.

````markdown
# DIAL Chat User Guide update proposal: releases from <START> to <DATE>

## Summary

<One or two sentences: the releases reviewed, how many items, and the pages they touch.>

| Repository | Pages verified on | Previously | Reviewed up to | Stable releases reviewed |
|---|---|---|---|---|
| `epam/ai-dial-chat` | 2026-10-29 (11 pages) | 1.2.17 | 1.3.7 | 15: [1.2.18](<URL>), …, [1.3.7](<URL>) |
| | 2026-09-21 (`3.catalog/1.models.md`) | 1.0.18 | 1.3.7 | 57 ([all releases](https://github.com/epam/ai-dial-chat/releases)) |

Release candidates (`-rc.N`) and backports to older lines were not reviewed. The latest DIAL platform release, <N>, pins <VERSIONS>; the plan covers newer stable releases too.

**How to use this file.** Work on the branch of the pull request that adds this file. For each item, make the change, tick its box here (`- [ ]` becomes `- [x]`), and push to that branch. When every box is ticked, mark the PR ready for review. The same pull request sets `last_verified: <DATE>` on every page of the guide, so merging it records that the guide matches the releases through <DATE>.

<The screenshot rules of section 5.>

<Open PRs that change the guide, from `docs-chat-guide-update-plan:pr` section 1, if any: their merge can move the lines below. Or that open PRs couldn't be checked.>

## Manual updates

### <Page title> — `<PAGE>`

- [ ] **1. …**

### <Next page title> — `<PAGE>`

- [ ] **4. …**

## Changes in the releases

### DIAL Chat — `epam/ai-dial-chat` <FROM> → <TARGET>

- **<Change, in the user's words>** (<TAG>, <YYYY-MM-DD>): <what users see now, and the condition if any>. Guide: items 3, 4. [<REPO>#<PR>](<URL>), [release notes](<URL>)

### DIAL Quick Apps editor — `epam/ai-dial-quickapps-frontend` <FROM> → <TARGET>

### DIAL Quick Apps runtime — `epam/ai-dial-quickapps-backend` <FROM> → <TARGET>

## Reviewed, no guide impact

- The guide already matches: <change> ([<REPO>#<PR>](<URL>)), …
- Not visible to chat users: <N> PRs, such as <REPO>#<PR> (<what>)
- Up to date: <REPO>, no stable release since <TAG>

## Needs review

- **<What>** (<page or "no page">): <why it needs a decision, and the source>
````

- **Order:** items by page in menu order (the inventory's order), and within a page by line.
- **Changes in the releases** lists every user-visible change, including the ones the guide already matches. Each links the PR and the release. A change behind a toggle names the toggle and its default. One bullet per change; a long run of fixes becomes one bullet with their PRs.
- **Reviewed, no guide impact** gives the reason for each group. Cite PRs as `epam/<REPO>#<N>`, because a bare `#<N>` links to `epam/ai-dial`.
- **No Verification here.** The file is final at step 7 and goes into the branch unchanged; the check results go into the PR body.
- **Wording:** plain instructions for writers, in the guide's terms. No praise or hedging, and no mention of how the plan was made.

## 7. The PR body

Write it to `<WORK>/pr-body.md` at step 9, after the branch check (`docs-chat-guide-update-plan:pr`, section 5). It is a pointer to the work order, not a copy: the items live only in the file, so the two never disagree. `plan_checks.py` requires these two headings, in this order.

````markdown
## Summary

<Only when the work order has manual updates and the PR route can't open a draft:>
**Not ready to merge.** Writers still have <N> items to do in the work order. When every box is ticked, delete this line.

<One or two sentences: the releases reviewed per repository (baseline → target), how many items on how many pages, and how many entries under "Needs review".>

**Work order:** [`<RESEARCH>`](https://github.com/epam/ai-dial/blob/<BRANCH>/<RESEARCH>). Make each change on this branch, tick its box in that file, and push. When every box is ticked, mark the PR ready for review.

| Page | Items |
|---|---|
| `3.catalog/2.agents.md` | 7 |

This PR sets `last_verified: <DATE>` on all <N> pages of the guide and adds the work order. <When `<BASE>` wasn't fetched: the local `development` it started from, and its commit.>

## Verification

- `python3 -I plan_checks.py --work-order <WORK>/work-order.md --title '<TITLE>'` (step 7): <result>
- `python3 -I plan_checks.py --work-order <RESEARCH> … --base <BASE> --date <DATE>`: <result>
- `python3 -I plan_checks.py --work-order <RESEARCH> --body <WORK>/pr-body.md …`: <result>
- `npm run lint:frontmatter`: <result, or "not run: no node_modules">
````

- With no manual updates, the Summary says the PR records that the guide matches the releases through `<DATE>`, the table says "None.", and the work order link stays.
- The link to the work order is the one link in the body to `epam/ai-dial` at a branch; the tag rule of section 4 applies to the work order, not here.
- **Paths in Verification:** write the run's folder as the literal `<WORK>`, never the absolute path `mktemp -d` printed. That path is local to the run, and it can name the tool the session runs in, which the attribution check rejects.
- **Wording:** the same as the work order's. No item text: a reviewer opens the file.

## 8. Examples

From the review of releases through 2026-11-27, at `docs_v2/8.chat-user-guide/3.catalog/2.agents.md`:

```markdown
- [ ] **1. Replace text.** Catalog → Create → Quick App → Configuration → Advanced settings
  - **What changed:** the Temperature setting's ends are labeled Cold and Hot, with Neutral in the middle (quickapps-frontend 0.3.2).
  - **Where:** `3.catalog/2.agents.md`, section "Configuration", line 280
  - **Replace:** `from Precise to Creative` → `from Cold to Hot`
  - **Source:** [epam/ai-dial-quickapps-frontend#275](https://github.com/epam/ai-dial-quickapps-frontend/pull/275), [`en.json#L283-L284`](https://github.com/epam/ai-dial-quickapps-frontend/blob/0.4.0/src/i18n/locales/en.json#L283-L284) · 0.3.2 (2026-11-06)
- [ ] **2. Remove text.** Catalog → Create → Quick App → Configuration → Advanced settings
  - **What changed:** the Built-in file tools switch is gone; file tools are on by default (quickapps-frontend 0.4.0, quickapps-backend 0.14.0).
  - **Where:** `3.catalog/2.agents.md`, section "Configuration", line 283
  - **Remove:** lines 283–283, the Built-in file tools row of the Advanced settings table
  - **Source:** [epam/ai-dial-quickapps-frontend#335](https://github.com/epam/ai-dial-quickapps-frontend/pull/335), [epam/ai-dial-quickapps-backend#710](https://github.com/epam/ai-dial-quickapps-backend/pull/710) · 0.4.0 (2026-11-12)
- [ ] **3. Retake a screenshot.** Catalog → Create → Quick App → Configuration → Advanced settings
  - **What changed:** the window lost the Built-in file tools switch, and Temperature shows Cold, Neutral, and Hot.
  - **Where:** `3.catalog/2.agents.md`, section "Configuration", line 276
  - **Image:** `3.catalog/img/quickapp-advanced-settings.png`
  - **Capture:** the whole Advanced settings window of a new Quick App, with the Temperature slider visible; alt text: "The Advanced settings window"
  - **Source:** [epam/ai-dial-quickapps-frontend#335](https://github.com/epam/ai-dial-quickapps-frontend/pull/335) · 0.4.0 (2026-11-12)
```

These examples show the format. Each run writes its own items from its own findings; never copy these without the evidence.
