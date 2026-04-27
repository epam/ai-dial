---
name: docs-page-writer
description: Use this skill whenever creating, editing, or reviewing Markdown documentation pages in the `docs/docs/` directory of the ai-dial repo. Triggers on any task involving writing docs content, editing existing docs pages, creating new documentation, reviewing docs for style compliance, or migrating content between sections. Also use when the user mentions "docs," "documentation," "write a page," "tutorial," "how-to," "reference page," "explanation page," or any Diátaxis content type. Use it even for small edits — the frontmatter, terminology, and structural rules apply to every change.
---

# DIAL Documentation Page Writer

This skill ensures every documentation page in `docs/docs/` follows the DIAL Documentation Style Guide and fits correctly into the Recommended Site Structure.

## Step 1: Determine the content type

Every page is **exactly one** Diátaxis type. Determine which before writing anything:

| Type | Reader's question | Voice | Structure |
|---|---|---|---|
| **Tutorial** | "Teach me to do this" | Second person, encouraging, low assumption | Prerequisites → Goal → Numbered steps → Verification → What you learned → Next steps |
| **How-to** | "Help me accomplish this task" | Imperative, terse, assumes familiarity | Goal → Prerequisites → Steps → Result → Related tasks |
| **Reference** | "Give me the details" | Third person, declarative, no opinions | Identifier → Description → Parameters → Returns → Errors → Example |
| **Explanation** | "Help me understand why" | Essayistic but precise, can use "we" for design intent | Thesis → Background → Discussion → Implications → Further reading |

**If a page feels like two types, split it into two pages.**

## Step 2: Add required frontmatter

Every page must start with:

```yaml
---
title: "Configure rate limits"   # imperative for how-tos, noun for reference
type: how-to                     # tutorial | how-to | reference | explanation
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

### Canonical names (always use these)

| Canonical term | Never say |
|---|---|
| DIAL | Dial, dial, DiAL |
| DIAL Core | "the backend," "the server," "dial core" |
| DIAL Chat | "the frontend," "the UI" (unless explaining) |
| Unified API | "DIAL API" (too vague) |
| Application | Addon (deprecated), Assistant (deprecated) |
| Adapter | "Application" when meaning a model adapter |
| Interceptor | "Adapter" when meaning middleware |
| Agent Builder | "application runner," "application builders," "Builders" (use whatever the glossary has canonicalized) |

### Forbidden phrases

Delete these — never use them:
- "simply," "just," "easily," "obviously"
- "please note that" (start with the thing)
- "our product" (say "DIAL")
- "AI-powered" (everything here is AI)
- "cutting-edge," "best-in-class"
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
- [ ] `last_verified` date is today

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