# DIAL Documentation - Style Guide

> **Status:** Draft v1

* * *

## 1. Purpose and scope

This guide defines **how DIAL documentation is written, structured, and maintained**. It exists to make the docs consistent across contributors and components, reduce reviewer effort, and keep quality from decaying between releases.

It is complementary to — not a replacement for — the **Diátaxis** content framework (see §4). [Diátaxis](https://diataxis.fr/) decides *what kind of page* you are writing; this guide decides *how to write it*.

If a rule here conflicts with what you see in an existing page, the page is wrong. Open a PR.

* * *

## 2. Operating principles

Five rules that override local preferences:

1. **Docs are product.** A broken docs page is a broken feature. Treat doc PRs with the same rigor as code PRs.
2. **One canonical home per topic.** Content lives on `[docs.dialx.ai](http://docs.dialx.ai)`. GitHub READMEs link *to* the docs, not the other way around. No redirecting users to a README mid-journey.
3. **Self-contained pages.** A reader should complete the task described on a page without leaving it for a different repo. Supporting material (full projects, advanced configs) may link out — core instructions may not.
4. **Freshness is non-negotiable.** Code samples pin versions; a CI job fails if those versions are older than 12 months or reference a deprecated API.
5. **Write for a skimmer first, a reader second.** Most users scan. Headings, first sentences, and code blocks must carry the meaning.

* * *

## 3\. Audience and personas

Every page declares (in frontmatter) the persona it primarily serves. If it serves multiple, split it.

| Persona | Needs docs to help them… | Tone register | Persona | Needs docs to help them… | Tone register |
| :-- | :-- | :-- | :-- | :-- | :-- |
| App Developer | Build applications, adapters, and interceptors on top of DIAL | Conversational, code-dense |  |  |  |
| Platform/DevOps Engineer | Install, configure, scale, secure, and operate DIAL | Precise, checklist-driven |  |  |  |
| Admin / Governance owner | Manage users, access, quotas, publications, compliance | Plain, policy-aware |  |  |  |
| Evaluator / PoC lead | Decide whether DIAL fits and demo it quickly | Benefit-first, no jargon upfront |  |  |  |
| Solution Architect | Design reference architectures and integrations | Diagram-led, trade-off-aware |  |  |  |

  

When in doubt, write for the **App Developer** or the **DevOps Engineer** — they are the most frequent readers.

* * *

## 4. Content types (Diátaxis)

Every page is exactly **one** of four types. The type determines structure and voice.

### 4.1 Tutorial — *learning-oriented*

Takes a newcomer from zero to a working result on a guided rail.

* **Voice:** second person ("you will…"), encouraging, low assumption.
* **Structure:** Prerequisites → Goal (with screenshot of end state) → Numbered steps → Verification → What you learned → Next steps.
* **Rules:** Every step must be runnable as written. No "adapt this to your environment." If a command fails on a clean machine, the tutorial is broken.
* **Anti-pattern:** Explaining *why* mid-step. Defer to an Explanation page and link.

### 4.2 How-to guide — *task-oriented*

Helps a competent user accomplish a specific goal.

* **Voice:** imperative, terse, assumes baseline familiarity.
* **Structure:** Goal → Prerequisites → Steps → Result → Related tasks.
* **Rules:** One goal per page. Title starts with a verb: "Configure…", "Add a model to…", "Rotate an API key".
* **Anti-pattern:** Turning into a tutorial by explaining basics.

### 4.3 Reference — *information-oriented*

Exhaustive, neutral, authoritative description of an interface.

* **Voice:** third person, declarative, no second person, no opinions.
* **Structure:** Identifier → Description → Parameters (type, required, default, description) → Returns → Errors → Example.
* **Rules:** Every setting documented, including defaults and precedence. No narrative. Alphabetical or structural ordering, not "most useful first."
* **Anti-pattern:** Hidden behavior. If a setting has a side effect, document it.

### 4.4 Explanation — *understanding-oriented*

Discusses *why* something is the way it is. Context, trade-offs, design decisions.

* **Voice:** essayistic but precise, can use "we" for design intent.
* **Structure:** Thesis → Background → Discussion → Implications → Further reading.
* **Rules:** Never contains setup instructions. May link to How-tos for practical follow-up.
* **Anti-pattern:** Smuggling in reference details.

**If a page feels hard to structure, it is usually two pages fused into one.** Split it.

* * *

## 5. Voice and tone

### 5.1 Baseline voice

Clear, direct, technically confident. No marketing gloss. No apology. Respect the reader's time.

* **Do:** "DIAL Core stores chat history in Redis."
* **Don't:** "We're excited to share that DIAL Core is able to leverage Redis for best-in-class history storage."

### 5.2 Person and address

* Second person ("you") in tutorials and how-tos.
* Third person in reference.
* First person plural ("we") only in explanations about design intent.
* Never first person singular.

### 5.3 Tone by register

  

| Register | Where | Example | Register | Where | Example |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Warm | Tutorials, onboarding, release notes | "In the next step, you'll connect a model." |  |  |  |
| Neutral | How-tos, architecture pages | "Set aidial.server.port to the desired port." |  |  |  |
| Terse | Reference, API docs | "port — integer, default 8080. Listening port for the HTTP server." |  |  |  |
| Cautionary | Security, production hardening | "Warning: Rotating this key invalidates all active sessions." |  |  |  |

### 5.4 What DIAL docs don't do

* No humor or memes in core docs. Save them for blog posts.
* No "simply," "just," "easy," "obviously." They gaslight readers who are stuck.
* No exclamation marks outside release notes.
* No hedging ("might be possible to," "you may want to consider"). State the rule; note the exception.

* * *

## 6 Terminology

DIAL has many near-synonyms. Use the canonical term. Define it once in the glossary; link on first use per page.

### 6.1 Canonical glossary (abbreviated)

  

| Term | Definition | Not to be confused with | Term | Definition | Not to be confused with |
| :-- | :-- | :-- | :-- | :-- | :-- |
| DIAL | The platform as a whole. Always all-caps. | dial, Dial, DiAL |  |  |  |
| DIAL Core | The Java service exposing the Unified API. Not "the backend." | DIAL Chat, DIAL Admin |  |  |  |
| DIAL Chat | The default web UI. | DIAL Overlay, "the frontend" |  |  |  |
| Application | A first-class extension exposing chat-completion or embedding endpoints via DIAL SDK. | Addon, Assistant |  |  |  |
| Adapter | An application that translates an external provider's API (Azure OpenAI, Bedrock, Vertex) to the DIAL Unified API. | Application (generic), Interceptor |  |  |  |
| Interceptor | Middleware that modifies requests/responses in-flight. | Adapter, Addon |  |  |  |
| Addon | Deprecated/archived concept (ChatGPT plugin protocol). Do not use in new docs except to describe legacy. | Application, Interceptor |  |  |  |
| Assistant | Deprecated/archived. Same guidance as Addon. | Application |  |  |  |
| Unified API | The DIAL-defined, OpenAI-compatible chat/embeddings API exposed by Core. | "DIAL API" (too vague — use Unified API) |  |  |  |
| Deployment (config sense) | A named endpoint exposing a model or application through Core. | Helm deployment (k8s sense) — disambiguate. |  |  |  |
| Publication | The review-and-promote flow that shares content org-wide. | Sharing (user-to-user) |  |  |  |

Maintain the full glossary at `/platform/glossary` and auto-insert it into the site search index.

### 6.2 Capitalization rules

* Product and component names: **DIAL**, **DIAL Core**, **DIAL Chat**, **DIAL Admin**, **DIAL SDK**.
* Lowercase after the first word for generic nouns: "an application," "an adapter" (unless they're at the start of a sentence or in a UI label).
* HTTP verbs in reference: uppercase (`GET`, `POST`).
* Environment variables: uppercase, underscored, in code font (`DIAL_URL`).

### 6.3 Forbidden or controlled phrases

  

| Don't say | Say instead | Don't say | Say instead |
| :-- | :-- | :-- | :-- |
| "our product" | "DIAL" |  |  |
| "the backend" / "the server" | "DIAL Core" |  |  |
| "the frontend" | "DIAL Chat" (if that's what you mean) |  |  |
| "AI-powered" | (delete; everything here is AI) |  |  |
| "cutting-edge," "best-in-class" | (delete) |  |  |
| "simply," "just," "easily" | (delete) |  |  |
| "please note that" | (delete; start the sentence with the thing) |  |  |

* * *

## 7 Page structure and templates

### 7.1 Required frontmatter

```
Turn on wrapCopy as text--- title: "Configure rate limits" # imperative for how-tos, noun for reference type: how-to # tutorial | how-to | reference | explanation persona: devops # app-dev | devops | admin | evaluator | architect component: core # core | chat | admin | sdk | adapters | helm version_compat: ">=0.40" last_verified: 2026-04-01 owner: "@dial-core-team" ---
```

  

### 7.2 The first 60 words rule

The first paragraph must answer three questions:

1. What will the reader accomplish or learn?
2. Who is this for?
3. What is the prerequisite knowledge?

If a reader can't tell from the top of the page whether they're in the right place, the page has failed before it started.

### 7.3 Heading hierarchy

* `#` (H1) — page title, rendered once by the site framework. Do not repeat.
* `##` (H2) — major sections. Every H2 should be reachable directly via a stable anchor.
* `###` (H3) — subsections. Avoid going deeper than H3 in tutorials and how-tos.
* Headings are sentence case, not title case: "Configure the adapter," not "Configure The Adapter."
* Headings are self-contained — never "Step 1," always "Step 1: Install the Helm chart."

### 7.4 Admonitions

Use sparingly. Four types, no custom ones:

* **Note** — incidental information.
* **Tip** — a shortcut or better-practice pointer.
* **Warning** — something that could cause data loss, downtime, security exposure, or cost.
* **Deprecated** — the feature is going away; link to the replacement.

* * *

## 8\. Writing mechanics

### 8.1 Sentences and paragraphs

* Target sentence length: 15–20 words. Hard ceiling: 30.
* Target paragraph length: 2–4 sentences.
* Break a wall of text with a list only when items are genuinely parallel.

### 8.2 Lists

* Use numbered lists for **ordered** sequences (steps).
* Use bullets for **unordered** sets (options, features).
* Every list item starts with a capital and either a period (if a full sentence) or no terminal punctuation (if a fragment) — consistent within the list.

### 8.3 Numbers, dates, units

* Numerals for 10+ and any measurement: `5 seconds`, `64 GB`, `8080`.
* Words for 0–9 in prose, numerals always in technical contexts.
* Dates: `2026-04-16` (ISO). Never `04/16/2026`.
* Binary prefixes: `MiB`/`GiB` when the context is memory; `MB`/`GB` for storage marketing sizes. Be consistent.

### 8.4 Punctuation

* Oxford comma, always.
* Em dash `—` with no surrounding spaces for parenthetical breaks. No double hyphens.
* Smart quotes in prose, straight quotes inside code blocks.

* * *

## 9\. Code, commands, and technical examples

### 9.1 Code blocks

* Always specify the language: ` ```bash `, ` ```json `, ` ```python `, ` ```yaml `.
* No shell prompts in copyable commands. Not `$ docker compose up`, just `docker compose up`.
* Comments explain *why*, not *what*.
* Long outputs: truncate with `# …` and explain what was cut.

### 9.2 Variable placeholders

Use `ANGLE_BRACKETS` uppercase for things the reader must replace:  
   
   
bash

```bash
curl -H "Api-Key: <YOUR_DIAL_API_KEY>" https://<YOUR_DIAL_HOST>/...
```

Never `YOUR_API_KEY_HERE` or `xxx` — placeholders must be scannable.

### 9.3 Version pinning

All runnable examples pin an explicit version.  
   
   
python

```python
# pyproject.toml
aidial-sdk = "0.22.0"
```

Unpinned examples (`pip install aidial-sdk`) are allowed **only** in the Quick Start, and only when the next step produces a working system.

### 9.4 Sample repos

Every tutorial with more than ~50 lines of code has a companion repo at `github.com/epam/ai-dial-samples/<tutorial-slug>`. The repo's README points back to the doc page. CI runs the sample weekly against the latest stable DIAL release.

### 9.5 API examples

Provide at minimum: a `curl` example and one SDK example (Python unless the SDK is language-specific). Show both request and complete response. Redact keys with `sk-...` style truncation, not `REDACTED`.

* * *

## 10\. Links and cross-references

* **Internal links are relative:** `/platform/core/auth-intro`, never absolute `[https://docs.dialx.ai/](https://docs.dialx.ai/)...`. Makes the site portable and previewable.
* **Link text describes the destination.** Not "click \[here\]." Yes "see \[Authentication overview\]."
* **External links** open in the same tab unless going to a non-docs property (GitHub, cloud vendor docs).
* **GitHub links** are allowed only for:
  * Source code of a specific file or example.
  * Issue trackers and release tags.
  * Canonical Helm chart files. Never link to a GitHub README as the authoritative source of conceptual or configuration documentation. If a README is authoritative, migrate it to the docs site.
* **Anchor stability:** changing a heading changes its anchor and breaks every link to it. If you rename, add a redirect.

* * *

## 11\. Visuals

### 11.1 Screenshots

* Take on a standard 1440×900 viewport, light theme, default DIAL branding.
* Crop tightly to the element discussed; annotate with callouts (numbered circles) rather than red arrows scrawled on top.
* Store at 2x resolution as PNG. File name: `component-action-state.png` (e.g., `chat-marketplace-empty.png`).
* Every screenshot has alt text describing what it shows, not what it looks like.
* Re-take screenshots when the UI changes. CI flags screenshots older than 6 months.

### 11.2 Diagrams

* Architecture diagrams use Mermaid where possible so they diff cleanly in PRs.
* Complex system diagrams: Draw.io source committed alongside the PNG.
* One color per component category (Core=blue, Chat=green, Adapters=orange, External=gray). Document the palette in the contributing guide.

### 11.3 Videos

* Videos supplement, never replace, written instructions. Every video has a paired article with the same title and code.
* Videos include captions.
* In prose, never say "as shown in the video" — the text must stand alone.

* * *

## 12\. Accessibility and inclusive language

* All images have meaningful alt text; decorative images have `alt=""`.
* Never rely on color alone to convey meaning (e.g., "the red line"). Reference shape or label too.
* Avoid idioms that don't translate ("kill two birds," "low-hanging fruit") — this is a global developer audience.
* Use "allowlist/denylist," "primary/replica," "placeholder."
* Prefer singular "they."

* * *

## 13\. Review and maintenance

### 13.1 PR checklist (required in the docs PR template)

* Page type (tutorial / how-to / reference / explanation) declared in frontmatter and matches structure.
* Persona declared.
* Runnable examples tested on a clean environment.
* Version pins present and ≤12 months old.
* Terminology follows the glossary.
* Links work; no links to GitHub READMEs as authoritative sources.
* Screenshots match current UI.
* `last_verified` date updated.

### 13.2 Automated checks (CI)

* Link checker (internal + external).
* Vale with the DIAL rule pack (terminology, voice, forbidden phrases).
* Dependency freshness: fails if any pinned package in a sample is >12 months behind latest.
* Frontmatter completeness.
* Anchor-break detector on renamed headings.

### 13.3 Ownership and cadence

* Every page has an `owner` in frontmatter (a GitHub team). Un-owned pages block merge.
* Quarterly audit: `last_verified` > 180 days triggers a review task for the owner.
* Release notes entry required for any user-facing behavior change — in the same PR.

### 13.4 Deprecation

When deprecating content:

1. Add a **Deprecated** admonition at the top with the replacement link and removal date.
2. Keep the page for at least two minor releases.
3. Add a redirect at removal time. Never 404.

* * *

## Appendix A: Page templates

Stored in `templates/` and referenced by the contributing guide:

* `templates/[tutorial.md](http://tutorial.md)`
* `templates/[how-to.md](http://how-to.md)`
* `templates/[reference-api.md](http://reference-api.md)`
* `templates/[reference-config.md](http://reference-config.md)`
* `templates/[explanation.md](http://explanation.md)`

## Appendix B: Quick decision tree

`Is the reader new to DIAL? → Tutorial   Does the reader have a specific task? → How-to   Does the reader need to look up a detail? → Reference   Does the reader want to understand why? → Explanation`

  

If a page tries to be more than one of these, split it.

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)