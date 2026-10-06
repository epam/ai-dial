# Audit: Chat User Guide section

**Date:** 2026-10-06
**Auditor:** docs-auditor skill (automated)
**Scope:** All 12 `.md` files under `docs_v2/chat-user-guide-new/`
**Reference documents:** glossary.md, style-guide.md, recommended-site-structure.md

---

## Per-page assessments (abbreviated — all pages score 3/5+)

| Page title | File path | Quality | Type | Type match | Term. violations | Formatting issues | Action | Notes |
|---|---|---|---|---|---|---|---|---|
| Overview and interface | `docs_v2/chat-user-guide-new/0.index.md` | 4/5 | user-guide | OK | 0 | 0 | KEEP | Clean landing page with next-steps links. |
| Conversations | `docs_v2/chat-user-guide-new/1.conversations.md` | 4/5 | user-guide | OK | 0 | 0 | KEEP | Thorough coverage of messaging, voice input, citations, stages, MCP apps, conversation management. |
| Scheduled tasks | `docs_v2/chat-user-guide-new/2.scheduled-tasks.md` | 4/5 | user-guide | OK | 0 | 0 | KEEP | Well-structured, covers create/edit/pause/delete/results workflow. |
| Catalog | `docs_v2/chat-user-guide-new/3.catalog/0.index.md` | 4/5 | user-guide | OK | 0 | 0 | KEEP | Good overview with links to all sub-pages, filter/sort/view docs. |
| Models | `docs_v2/chat-user-guide-new/3.catalog/1.models.md` | 4/5 | user-guide | OK | 0 | 0 | KEEP | Clear panel-by-panel walkthrough (About, Overview, Pricing, Limits, Connect). |
| Agents | `docs_v2/chat-user-guide-new/3.catalog/2.agents.md` | 4/5 | user-guide | OK | 1 | 0 | KEEP | Comprehensive Quick App + Custom App builder docs. One term violation (see below). |
| Toolsets | `docs_v2/chat-user-guide-new/3.catalog/3.toolsets.md` | 4/5 | user-guide | OK | 0 | 0 | KEEP | Covers auth modes (none, OAuth, API key), create/edit/delete. |
| Skills | `docs_v2/chat-user-guide-new/3.catalog/4.skills.md` | 4/5 | user-guide | OK | 0 | 0 | KEEP | Clear skill lifecycle: create (write or upload), use, edit, delete. |
| Prompts | `docs_v2/chat-user-guide-new/3.catalog/5.prompts.md` | 4/5 | user-guide | OK | 0 | 0 | KEEP | Covers variables syntax, create/edit/delete. |
| File Manager | `docs_v2/chat-user-guide-new/4.files.md` | 4/5 | user-guide | OK | 0 | 0 | KEEP | Tabs, file actions, hidden files, how files arrive. |
| Sharing and publishing | `docs_v2/chat-user-guide-new/5.sharing-and-publishing.md` | 4/5 | user-guide | OK | 0 | 0 | KEEP | Thorough side-by-side treatment. Access rules well explained. |
| Usage and settings | `docs_v2/chat-user-guide-new/6.usage-and-settings.md` | 4/5 | user-guide | OK | 0 | 0 | KEEP | Preferences + Usage tabs, cost/token limit mechanics. |

---

## Detailed findings

### 1. Frontmatter

All 12 pages have complete frontmatter with all six required fields: `title`, `type`, `persona`, `component`, `last_verified`, `owner`. All pages declare `type: user-guide`, `persona: end-user`, `component: chat`, and `owner: "@dial-docs-team"`.

`last_verified` dates range from 2026-09-15 to 2026-10-05 — all within 30 days. No freshness concern.

### 2. Diataxis classification

All pages are classified as `user-guide`, which is appropriate for the Chat User Guide section (end-user product manual). The content consistently matches the user-guide type: it walks users through features with screenshots and UI grounding. No pages try to be two types at once. No pages should be split.

### 3. Terminology compliance

**Total violations: 1**

| File | Line | Issue | Severity |
|---|---|---|---|
| `3.catalog/2.agents.md` | 12 | "An agent is an **AI-powered** application" — "AI-powered" is a forbidden phrase per style guide section 6.3 | Low |

All other terminology checks pass:
- "DIAL" is consistently all-caps (lowercase `dial` appears only in `@dial-docs-team` owner field and in `dial_roles` UI label context — both correct)
- "Toolset" / "Toolsets" — correct throughout, never "Tool Set"
- "DIAL Chat", "DIAL Core", "DIAL SDK" — correctly capitalized where used
- "Unified API" — used correctly (agents.md line 209)
- No deprecated terms ("Addon", "Assistant") used
- No "the backend", "the frontend", "our product", "please note"
- No "simply", "easily", "obviously"
- "just" appears three times but always in conversational/legitimate usage (e.g., "not just a file"), not as a minimizing word

### 4. Formatting conventions

**`:::` admonitions:** 0 instances. All admonitions use the correct bold-label + blockquote format.

**`localhost` in examples:** 0 instances.

**Bold lead-in labels:** All admonitions follow the correct pattern (bold label on its own line, content in blockquote on the next line). No inline bold lead-in violations found.

**Parallel statements as bullets:** No violations found. Lists are consistently used for parallel items.

### 5. Structural placement

The Chat User Guide corresponds to **section 6** in the recommended site structure. The structure document says: "keep structure largely as-is, updated for current UI." The current implementation follows this guidance.

The section order in the sidebar matches the file numbering:
1. Overview and interface (0.index.md)
2. Conversations (1.conversations.md)
3. Scheduled tasks (2.scheduled-tasks.md)
4. Catalog (3.catalog/) — with sub-pages for Models, Agents, Toolsets, Skills, Prompts
5. File Manager (4.files.md)
6. Sharing and publishing (5.sharing-and-publishing.md)
7. Usage and settings (6.usage-and-settings.md)

File numbering is consistent with sidebar order. No mismatches.

### 6. Navigation quality

**Sidebar depth:** Maximum depth is 3 (Chat User Guide > Catalog > Models/Agents/etc.). Well within the max-4 budget.

**"What's next" links:** All 12 pages have a "Next steps" section at the end with relevant forward links. No dead ends.

**Misleading titles:** None. All sidebar labels accurately describe page content.

**GitHub-as-authority redirects:** 0. No pages redirect to GitHub READMEs for content that should be on-site.

### 7. Link health

**Internal link format:** All internal doc-to-doc links use relative paths ending in `.md` — the correct convention. No absolute root paths (`]/...`), no extension-less internal links.

**Cross-section links (to other v2 sections):** Several pages link outside the guide to other v2 sections. These are relative `.md` links, which is correct. Key cross-links:
- `3.catalog/0.index.md` → `../../2.understand-dial/4.security-and-governance/1.authentication-and-access-control.md`
- `3.catalog/1.models.md` → `../../3.building-with-dial/3.adapters/2.supported-providers.md`
- `3.catalog/1.models.md` → `../../2.understand-dial/4.security-and-governance/3.usage-limits-and-cost-control.md`
- `3.catalog/2.agents.md` → `../../3.building-with-dial/1.apps/2.quick-apps/0.index.md`
- `3.catalog/2.agents.md` → `../../3.building-with-dial/1.apps/5.custom-apps/0.index.md`
- `3.catalog/3.toolsets.md` → `../../3.building-with-dial/1.apps/2.quick-apps/1.quick-app-2/9.toolsets/0.index.md`
- `3.catalog/3.toolsets.md` → `../../3.building-with-dial/1.apps/2.quick-apps/1.quick-app-2/9.toolsets/1.define-and-register.md`
- `5.sharing-and-publishing.md` → `../4.operating-dial/4.configuration/8.enable-publications.md`
- `5.sharing-and-publishing.md` → `../3.building-with-dial/7.working-with-dial-resources/2.publications-api.md`
- `5.sharing-and-publishing.md` → `../2.understand-dial/3.capabilities/4.collaboration-and-sharing.md`
- `5.sharing-and-publishing.md` → `../5.administering-dial/7.publications-and-review.md`

These cross-links are appropriate (developer docs, access control, admin docs) and correctly use relative `.md` paths. Whether the target files actually exist at those paths was not validated by a build in this audit.

**External links:** One external link to `https://dialx.ai/dial_api#operation/sendChatCompletionRequest` in agents.md (line 209) — this is a direct API reference link, which is acceptable. One external link to `https://modelcontextprotocol.io/` in toolsets.md (line 12) — appropriate for the MCP specification. One external link to MDN for MIME types in agents.md and toolsets.md — appropriate.

### 8. Code and example freshness

No code blocks with version pins exist in this section — expected for an end-user guide (no runnable code). The one `yaml` code block (skills.md, lines 81-88) shows SKILL.md frontmatter format, which is a format example rather than a runnable snippet. It has a language tag (`yaml`). No shell prompts in copyable commands.

### 9. Video assessment

No videos referenced or embedded in any page. Not applicable.

### 10. Tutorial structure

No pages are classified as tutorials. Not applicable.

---

## Batch summary

| Page | Quality | Type match | Terminology | Formatting | Action | Notes |
|---|---|---|---|---|---|---|
| Overview and interface | 4/5 | OK | 0 violations | 0 issues | KEEP | — |
| Conversations | 4/5 | OK | 0 violations | 0 issues | KEEP | — |
| Scheduled tasks | 4/5 | OK | 0 violations | 0 issues | KEEP | — |
| Catalog (index) | 4/5 | OK | 0 violations | 0 issues | KEEP | — |
| Models | 4/5 | OK | 0 violations | 0 issues | KEEP | — |
| Agents | 4/5 | OK | 1 violation | 0 issues | KEEP | "AI-powered" on line 12 |
| Toolsets | 4/5 | OK | 0 violations | 0 issues | KEEP | — |
| Skills | 4/5 | OK | 0 violations | 0 issues | KEEP | — |
| Prompts | 4/5 | OK | 0 violations | 0 issues | KEEP | — |
| File Manager | 4/5 | OK | 0 violations | 0 issues | KEEP | — |
| Sharing and publishing | 4/5 | OK | 0 violations | 0 issues | KEEP | — |
| Usage and settings | 4/5 | OK | 0 violations | 0 issues | KEEP | — |

### Key findings

- **12 pages** total audited
- **Average quality score: 4/5** — the section is well-written, consistently structured, and follows conventions
- Pages with type mismatch: **0**
- Pages with missing frontmatter: **0** (all 6 required fields present on all pages)
- Pages with "What's next" links: **12 of 12** (100%)
- Pages flagged as duplicates: **0**
- Pages with GitHub-as-authority links: **0**
- Pages with `:::` admonitions: **0**
- Pages with non-relative or missing-`.md` internal links: **0**
- Pages using `localhost` in examples: **0**
- Pages with stale dependencies: **0** (no runnable code)
- Tutorials missing project structure diagram: **0** (no tutorials)
- **Terminology violations: 1** — "AI-powered" in `3.catalog/2.agents.md` line 12
- Recommended actions: **12 keep**, 0 move, 0 merge, 0 split, 0 rewrite, 0 delete

### Section-level observations

1. **High consistency.** All 12 pages follow the same structural pattern: frontmatter, intro paragraph, feature walkthrough with screenshots, and "Next steps." The voice is consistently second-person, clear, and action-oriented.

2. **Good cross-linking.** Every page links to related pages both within the guide and to relevant developer/admin docs. The guide is self-contained for end users while providing clear off-ramps to technical content.

3. **Single terminology fix needed.** Replace "AI-powered application" with "application" or "AI application" in `3.catalog/2.agents.md` line 12, per style guide section 6.3 (forbidden phrase: "AI-powered" — everything in DIAL is AI, making the qualifier redundant).

4. **Cross-section link targets unverified.** Eleven links point to other v2 sections (understand-dial, building-with-dial, operating-dial, administering-dial). Their paths are correctly formed as relative `.md` links, but whether the target files exist at those exact paths was not validated with a build. A `npm run build` would confirm.

5. **Scheduled tasks is new content not in the structure document.** The recommended-site-structure.md does not explicitly mention "Scheduled tasks" under the Chat User Guide. This is net-new functionality documentation. It is well-placed and well-written; the structure document should be updated to reflect it.
