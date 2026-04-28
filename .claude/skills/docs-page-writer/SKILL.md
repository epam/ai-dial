---
name: docs-page-writer
description: Use this skill whenever creating, editing, or reviewing Markdown documentation pages in the `docs/docs/` directory of the ai-dial repo. Triggers on any task involving writing docs content, editing existing docs pages, creating new documentation, reviewing docs for style compliance, or migrating content between sections. Also use when the user mentions "docs," "documentation," "write a page," "tutorial," "how-to," "reference page," "explanation page," or any Diátaxis content type. Use it even for small edits — the frontmatter, terminology, and structural rules apply to every change.
---

# DIAL Documentation Page Writer

This skill ensures every documentation page in `docs/docs/` follows the DIAL Documentation Style Guide and fits correctly into the Recommended Site Structure.

## Editing existing pages vs. writing new ones

Most docs improvement work is editing existing pages, not creating new ones. When editing:

1. Read the current page with the `Read` tool
2. Compare against the self-check checklist (step 8)
3. Fix what's broken — don't rewrite what's fine
4. Preserve any content that's accurate and well-structured

Only follow the full step-by-step process below for new pages or major rewrites.

## Planning documents

Load selectively based on the task:

| Task | Required documents |
|---|---|
| Small edit | `docs-planning/glossary.md` (terminology) |
| New page | `glossary.md` + `style-guide.md` + `recommended-site-structure.md` |
| Migration / restructure | All of the above + `gap-analysis.md` + `improvement-roadmap.md` |

## Step 1: Determine the content type

Every page is **exactly one** Diátaxis type. Determine which before writing anything:

| Type | Reader's question | Voice | Structure |
|---|---|---|---|
| **Tutorial** | "Teach me to do this" | Second person, encouraging, low assumption | Prerequisites → Goal → Numbered steps → Verification → What you learned → Next steps |
| **How-to** | "Help me accomplish this task" | Imperative, terse, assumes familiarity | Goal → Prerequisites → Steps → Result → Related tasks |
| **Reference** | "Give me the details" | Third person, declarative, no opinions | Identifier → Description → Parameters → Returns → Errors → Example |
| **Explanation** | "Help me understand why" | Essayistic but precise, can use "we" for design intent | Thesis → Background → Discussion → Implications → Further reading |
| **User guide** | "Show me how to use the UI" | Second person, feature-organized, screenshot-heavy | Feature overview → UI walkthrough → Tips → Next steps |

**If a page feels like two types, split it into two pages.**

User guides document a UI for end users. They are distinct from how-tos (which are task-oriented for technical users) and tutorials (which teach from zero). The Chat User Guide section uses this type.

## Step 2: Add required frontmatter

Every page must start with:

```yaml
---
title: "Configure rate limits"   # imperative for how-tos, noun for reference
type: how-to                     # tutorial | how-to | reference | explanation | user-guide
persona: devops                  # end-user | app-dev | devops | admin | evaluator | architect
component: core                  # core | chat | admin | sdk | adapters | helm | apps
last_verified: 2026-04-27
owner: "@team-handle"
---
```

## Step 3: Write the opening

The **first 60 words** must answer three questions:
1. What will the reader accomplish or learn?
2. Who is this for?
3. What is the prerequisite knowledge?

If a reader can't tell from the top of the page whether they're in the right place, the page has failed.

## Step 4: Follow type-specific structure

Read the appropriate template in `references/` before writing:
- Tutorial → read `references/template-tutorial.md`
- How-to → read `references/template-howto.md`
- Reference → read `references/template-reference.md`
- Explanation → read `references/template-explanation.md`

## Step 5: Apply terminology rules

### Canonical names

Read `docs-planning/glossary.md` for all canonical terms, product names, component names, deprecated terms, and contested names. The glossary is the single source of truth. Key rules:

- **DIAL** in all-caps. Never "Dial" or "dial."
- Component names capitalized: **DIAL Core**, **DIAL Chat**, **DIAL Admin**, **DIAL SDK**
- Use the glossary's canonical name for contested terms (e.g., "Agent Builder" not "application runner")
- Don't use deprecated terms (Assistant, Addon) without a deprecation notice on the page
- Don't use vague references ("the backend," "the server") — use the glossary's component names

### Forbidden phrases

Delete these — never use them:
- "simply," "just," "easily," "obviously"
- "please note that" (start with the thing)
- "our product" (say "DIAL")
- "AI-powered" (everything here is AI)
- "cutting-edge," "best-in-class"
- "it should be noted that" (start with the thing)
- "as shown in the video" (text must stand alone)
- "click here" (describe the destination)

### Capitalization
- Product names: **DIAL**, **DIAL Core**, **DIAL Chat**, **DIAL Admin**, **DIAL SDK**
- Lowercase for generic nouns: "an application," "an adapter" (mid-sentence)
- HTTP verbs: uppercase (`GET`, `POST`)
- Environment variables: uppercase, underscored, code font (`DIAL_URL`)

## Step 6: Format code blocks correctly

- Always specify language: ` ```bash `, ` ```json `, ` ```python `, ` ```yaml `
- No shell prompts: not `$ docker compose up`, just `docker compose up`
- Variable placeholders in `ANGLE_BRACKETS`: `<YOUR_DIAL_API_KEY>`, `<YOUR_DIAL_HOST>`
- Pin versions in all runnable examples (except Quick Start)
- Comments explain *why*, not *what*

## Step 7: End with "Next steps"

**Every page must end with a "Next steps" or "What's next" section** containing 2–3 links to logical follow-up pages. No dead ends. Examples:

```markdown
## Next steps

- [Getting started with the DIAL API](/building/getting-started-api) — learn to call the Unified API programmatically
- [Build a RAG app](/building/custom-apps/tutorial-rag) — create your first Custom App with retrieval
- [Configuration reference](/operating/configuration/) — all configuration options for DIAL Core
```

## Step 8: Self-check before finishing

Run through this checklist:

- [ ] Page is exactly one Diátaxis type, declared in frontmatter
- [ ] Persona declared in frontmatter
- [ ] First 60 words answer: what, who, prerequisites
- [ ] Terminology follows the canonical names table
- [ ] No forbidden phrases
- [ ] Code blocks have language specified
- [ ] Version pins present in runnable examples
- [ ] Headings are sentence case, self-contained (not "Step 1" alone, but "Step 1: Install the Helm chart")
- [ ] Max heading depth: H3 in tutorials and how-tos, H4 in reference
- [ ] "Next steps" section at the end with 2–3 links
- [ ] No links to GitHub READMEs as authoritative source (link to docs site pages)
- [ ] `last_verified` date is today (only if you verified all code examples and links on the page)

## Admonitions

Use sparingly. Only four types:

```markdown
:::note
Incidental information.
:::

:::tip
A shortcut or better-practice pointer.
:::

:::warning
Something that could cause data loss, downtime, security exposure, or cost.
:::

:::info[Deprecated]
This feature is going away. Use [replacement](/path) instead. Removal planned for vX.Y.
:::
```

## Writing mechanics

- Sentence length: target 15–20 words. Hard ceiling: 30.
- Paragraph length: 2–4 sentences.
- Numbered lists for **ordered** sequences (steps). Bullets for **unordered** sets.
- Oxford comma, always.
- Dates: `2026-04-27` (ISO). Never `04/27/2026`.
- No emojis in docs content.
- Em dash `—` with no surrounding spaces.

## Where to place the page

Consult `docs-planning/recommended-site-structure.md` to determine the correct section and path. If the page doesn't have a clear home in the structure document, flag it — don't guess.

### Sidebar registration

After creating a new page or moving an existing one, update `docs/sidebars.js` to include the page in the position specified by the structure document. After moving a page, add a redirect in `docs/docusaurus.config.js` if the URL changed.

### Example URLs in templates

The "Next steps" examples in this skill and in the reference templates use target-structure URLs (e.g., `/building/getting-started-api`) that may not exist yet. Before using a path in a real page, verify the target page exists. If it doesn't, link to the closest existing equivalent or omit the link.

## Step 9: Verify the build

After writing or editing, run:

```bash
cd docs && npm run build
```

The Docusaurus config has `onBrokenLinks: 'throw'` — the build catches all broken internal links, anchors, and markdown references. Fix any errors before considering the page done.

## Frontmatter validation

The custom frontmatter fields (`type`, `persona`, `component`, `last_verified`, `owner`) are not validated by the Docusaurus build system. Enforcement comes from skill checks, the `docs-auditor` skill, and code review. A missing `type` field won't break the build but will fail audit.

## Quality verification

To verify a page meets all standards after writing, invoke the `docs-auditor` skill. The typical workflow is: write → build → audit → fix → re-audit.