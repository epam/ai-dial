# Audit: docs_v2/chat-user-guide-new/ (full rebuild)

Audited 2026-09-21. Scope: all 11 files — `0.index.md`, `1.conversations.md`, `2.catalog/{0.index,1.models,2.agents,3.toolsets,4.skills,5.prompts}.md`, `3.files.md`, `4.sharing-and-publishing.md`, `5.usage-and-settings.md`. Not yet wired into `sidebars-v2.js`.

## Summary

| Page | Quality | Type match | Term. violations | Action | Notes |
|---|---|---|---|---|---|
| Overview and interface | 4/5 | user-guide (see note) | 0 | Fix | `last_verified` stale after today's edits |
| Conversations | 4/5 | user-guide | 1 | Fix | "on the server" (vague); stale `last_verified` |
| Catalog | 5/5 | user-guide | 0 | Keep | |
| Models | 5/5 | user-guide | 0 | Keep | Correctly enumerates all 5 tabs |
| Agents | 5/5 | user-guide | 0 | Keep | Minor: "Step 1 — General" heading style |
| Toolsets | 5/5 | user-guide | 0 | Keep | |
| Skills | 5/5 | user-guide | 0 | Keep | |
| Prompts | 4/5 | user-guide | 1 | Fix | "on the server" (vague) |
| File Manager | 5/5 | user-guide | 0 | Keep | |
| Sharing and publishing | 4/5 | user-guide | 1 | Fix | "easy" (forbidden word) |
| Usage and settings | 5/5 | user-guide | 0 | Keep | |

**11 pages audited. Average quality: 4.6/5. 3 pages need a small text fix; 0 need structural rework.**

## Findings that need fixing

1. **Forbidden word "easy"** — `4.sharing-and-publishing.md`, in the Publish warning: *"...so it's easy to click before you've scrolled down..."* Style guide §5.4 forbids "simply/just/easily/easy" (they gaslight readers who are stuck). Reword to state the risk directly, e.g. "...so you can click it before you've scrolled down and checked the author and rules."

2. **Vague "the server"** — two instances:
   - `1.conversations.md:17` — *"All your conversations are stored on the server..."*
   - `2.catalog/5.prompts.md:14` — *"Prompts are stored on the server..."*
   Style guide §6.3 flags "the server" as a forbidden vague synonym (should name the actual component, or avoid the jargon). For an end-user audience, DIAL Core/File Storage is too technical — better to just drop the noun: "All your conversations are stored in DIAL, so..." / "Prompts are stored in DIAL, so...".

3. **Stale `last_verified` dates** — `0.index.md` and `1.conversations.md` both still say `last_verified: 2026-09-15`, but both had content edited today (2026-09-21, the "File Manager" terminology sweep touched both). Bump both to `2026-09-21`.

## Notes, not defects (flagging for awareness, not fixing here)

- **`type: user-guide` isn't one of the four types `docs-planning/style-guide.md` §4 declares** ("every page is exactly one of tutorial/how-to/reference/explanation"). This is inherited from the pre-existing `docs_v2/6.chat-user-guide/` convention (already used `type: user-guide` sitewide before this rebuild), not something introduced here. Individual pages are genuine how-to/reference hybrids per entity type (e.g. `2.catalog/3.toolsets.md` mixes task steps with a field-reference table) — that's normal for this genre, but it means the style guide's "split it" rule for mixed pages doesn't cleanly apply. Worth resolving at the style-guide level, not per-page.
- **`recommended-site-structure.md` §6 tags the whole "Chat User Guide" section `[Tutorial]`**, but no page here is tutorial-shaped (learning-oriented, guided rail to a single outcome) — they're task-oriented how-tos and reference tables. Same root cause as above; the section-level Diátaxis tag in the planning doc doesn't match what "keep structure largely as-is" actually produces.
- **Terminology deviates from `docs-planning/glossary.md` in two deliberate, consistent ways**, both already flagged to the user in earlier sessions rather than silently applied:
  - "Toolset" (one word) throughout, where the glossary mandates "Tool Set" (two words) in prose. The live rewritten UI's own label is "Toolset," and the glossary predates the rewrite.
  - "Catalog" throughout, where the glossary's canonical term is "Marketplace." Same reason — the rewritten UI renamed it.
  Both are used 100% consistently across all 11 files (verified by grep — zero instances of "Tool Set" or "Marketplace" anywhere in the folder). The glossary itself needs a follow-up update; not an error in this guide.
- **`2.catalog/2.agents.md` uses "Step 1 — General" / "Step 2 — Settings"** for wizard steps, an em dash rather than the style guide's suggested colon format ("Step 1: Install the Helm chart," §7.3). This mirrors the live UI's own step labels exactly. Low-severity, defensible as-is; flagging only in case the site wants strict colon-format uniformity.

## Clean checks (no action needed)

- **Frontmatter**: all 11 files have complete, correctly-typed `title`/`type`/`persona`/`component`/`last_verified`/`owner`.
- **Admonitions**: 100% use the bold-label + blockquote pattern (`**Note**`, `**Warning**`) — zero `:::` Docusaurus syntax anywhere.
- **Heading case**: every H2/H3 across all 11 files is sentence case. No title-case violations.
- **Links**: zero absolute root-path links (`/v2/...`), zero extension-less internal links, zero broken links, zero orphaned images (full-folder script check, run twice).
- **Structural placement**: matches `recommended-site-structure.md` §6 scope exactly — conversations, Catalog (models/agents/toolsets/skills/prompts), files, sharing, publications, settings are all covered; nothing extra, nothing missing.
- **Cross-page "Next steps" web**: traced all 11 lists — every page links forward to at least 2 related pages, no dead ends, no page just re-links its own parent. Coherent graph.
- **`localhost`, exclamation marks, `AI-powered`/`cutting-edge`/`best-in-class`, "please note that", "our product"**: zero instances anywhere in the folder.
