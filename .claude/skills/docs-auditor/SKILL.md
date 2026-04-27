---
name: docs-auditor
description: Audit DIAL documentation pages for quality, compliance, and structural placement. Use this skill when the user asks to audit, review, assess, evaluate, or inventory documentation pages — whether a single page, a section, or the full site. Also triggers on "content inventory," "docs quality check," "check this page," "what's wrong with this doc," "grade this page," "audit the docs," or any request to evaluate documentation against the style guide, structure, or Diátaxis standards. Use for Phase 0 inventory work, ongoing quality checks, and PR reviews of docs content.
---

# DIAL Documentation Auditor

This skill audits documentation pages against the DIAL Style Guide, Recommended Site Structure, and Gap Analysis. It produces structured assessments that feed directly into the content inventory spreadsheet.

## Audit modes

### Single page audit
The user provides a page path (e.g., `docs/docs/platform/core/about-core.md`) or a URL (e.g., `https://docs.dialx.ai/platform/core/about-core`). Produce a full assessment.

### Section audit
The user names a section (e.g., "audit the Platform > Core section"). Audit every page in that section, produce per-page assessments, then a section summary.

### Full inventory
The user asks for a complete content inventory. Walk every `.md` file in `docs/docs/`, produce per-page assessments, and output a summary table suitable for a spreadsheet.

---

## Audit procedure

For each page, run these checks in order. Read the page content first, then evaluate.

### 1. Identity

| Field | What to capture |
|---|---|
| **File path** | e.g., `docs/docs/platform/core/about-core.md` |
| **Published URL** | e.g., `https://docs.dialx.ai/platform/core/about-core` |
| **Menu path** | e.g., `Platform > Core > About` |
| **Page title** | The H1 or frontmatter title |
| **URL ↔ menu match** | Do the URL path segments match the sidebar placement? Flag mismatches. |

### 2. Diátaxis classification

Read the page and classify it as exactly one of: **tutorial**, **how-to**, **reference**, **explanation**, **user-guide**, **landing**, or **other**.

Then assess:
- Does the page's **actual content** match its **declared or implied type**? (e.g., a page under "Tutorials" that is actually a configuration reference)
- Does the page try to be **two types at once**? (e.g., explaining concepts mid-tutorial, embedding parameter tables in an explanation) If so, recommend splitting.
- Is the content type appropriate for its **sidebar location**?

Refer to `references/diataxis-signals.md` for classification heuristics.

### 3. Frontmatter check

Check for required fields. Current pages will almost certainly lack these — the point is to flag what needs adding during migration.

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | Should be imperative for how-tos, noun for reference |
| `type` | Yes | tutorial / how-to / reference / explanation |
| `persona` | Yes | end-user / app-dev / devops / admin / evaluator / architect |
| `component` | Yes | core / chat / admin / sdk / adapters / helm / apps |
| `last_verified` | Yes | ISO date |
| `owner` | Yes | GitHub team handle |

### 4. Content quality

Score 1–5 using the rubric in `references/quality-rubric.md`. Evaluate across five dimensions:

- **Completeness** — does the page cover its topic fully, or does it redirect to GitHub / leave gaps?
- **Accuracy** — are code examples runnable? Are version pins current? Are claims verifiable?
- **Clarity** — can the target persona understand this without external help?
- **Self-sufficiency** — can the reader accomplish the task without leaving the page for essential information?
- **Freshness** — are dependencies, screenshots, UI references, and API examples current?

Overall score = average of the five dimensions, rounded.

### 5. Terminology compliance

Scan for violations against two sources:
- **Canonical terms and definitions**: read `docs-planning/glossary.md` — this is the single source of truth for product names, component names, core concepts, deprecated terms, and the canonicalized name for contested terms (e.g., "Agent Builder" vs "application runner").
- **Audit mechanics** (forbidden phrases, capitalization rules, reporting format): read `references/terminology-checklist.md`.

Check for:
- **Incorrect product names**: any variant not matching `docs-planning/glossary.md` (e.g., "Dial" instead of "DIAL")
- **Vague component references**: "the backend," "the server," "the frontend" instead of the glossary's canonical component names
- **Deprecated terms**: terms marked as deprecated in the glossary used without a deprecation notice on the page
- **Naming chaos**: terms with multiple variants in the glossary — flag which variant the page uses
- **Forbidden phrases**: per `references/terminology-checklist.md`
- **Inconsistent capitalization**: per `references/terminology-checklist.md`

Report: number of violations, list of specific instances with line numbers.

### 6. Structural placement

Consult `docs-planning/recommended-site-structure.md` and assess:

- **Current location**: where this page lives now
- **Target location**: where the Structure document says it should live
- **Action needed**: keep / move / merge / split / rewrite / delete / redirect
- **Merge target**: if this page should be merged with another, name the other page
- **Is this a duplicate?**: check against the 7 known duplicate-title pairs from `docs-planning/gap-analysis.md` §1.1

### 7. Navigation quality

- **Sidebar depth**: count the levels from root to this page. Flag if > 4.
- **"What's next" links**: does the page end with follow-up links? (Almost certainly not — flag as missing.)
- **Dead-end check**: does the page link forward to any other docs page, or does it just... stop?
- **Misleading title**: does the sidebar label accurately describe the content? (See Gap Analysis §1.5 for known offenders.)
- **GitHub redirect**: does the page link to GitHub as the authoritative source for content that should be on-site?

### 8. Link health

- **Internal links**: do they resolve to existing pages?
- **External links**: note but don't validate (too slow for batch audits)
- **GitHub-as-authority links**: flag any link to a GitHub README that substitutes for on-site documentation (e.g., "Refer to the AI DIAL Core repository for full configuration details")

### 9. Code and example freshness

- **Pinned versions**: are dependencies pinned? How old are the pins?
- **Runnable examples**: could a reader copy-paste and run the code, or are there missing imports, undefined variables, placeholder-only snippets?
- **Language tags**: do code blocks specify a language (` ```python `, ` ```bash `)?
- **Shell prompts**: are there `$` prompts in copyable commands? (Should not be.)

### 10. Video assessment (if applicable)

If the page references or embeds a video:
- **Is the video supplementary or primary?** If primary (the page says "watch the video to learn X" without written equivalent), flag as content gap.
- **Is there a paired sample repo, sample data, and config?** If not, flag.
- **Is this a tutorial video or a demo?** Tutorial videos should be embedded on tutorial pages. Demos should be in the Demos section.

---

## Output format

### Single page assessment

```markdown
## Audit: [Page Title]

| Field | Value |
|---|---|
| File path | `docs/docs/platform/core/about-core.md` |
| Published URL | https://docs.dialx.ai/platform/core/about-core |
| Menu path | Platform > Core > About |
| URL ↔ menu match | ✅ Match / ⚠️ Mismatch: [details] |

### Classification
- **Declared type**: (from frontmatter or sidebar context)
- **Actual type**: (your assessment)
- **Mismatch?**: Yes/No — [explanation]
- **Should split?**: Yes/No — [what to split into]

### Frontmatter
- [ ] title
- [ ] type
- [ ] persona
- [ ] component
- [ ] last_verified
- [ ] owner
Missing: [list]

### Quality score: X/5
| Dimension | Score | Notes |
|---|---|---|
| Completeness | X/5 | |
| Accuracy | X/5 | |
| Clarity | X/5 | |
| Self-sufficiency | X/5 | |
| Freshness | X/5 | |

### Terminology: X violations
- Line N: "the backend" → should be "DIAL Core"
- Line N: "simply" → delete
- (list all)

### Structural placement
- **Current location**: Platform > Core > About
- **Target location**: Understand DIAL > Architecture highlights (absorbed)
- **Action**: merge
- **Merge target**: Architecture highlights page
- **Known duplicate?**: Yes — "About" ×2 (Gap Analysis §1.1)

### Navigation
- **Sidebar depth**: 3 ✅
- **"What's next" links**: ❌ Missing
- **Dead end?**: Yes — no forward links
- **Misleading title?**: Yes — "About" is generic
- **GitHub redirects**: 0

### Links
- Internal: X links, Y broken
- GitHub-as-authority: X instances

### Code freshness
- Pinned versions: [list with ages]
- Runnable: Yes/No
- Language tags: X missing

### Video
- (assessment or "No video referenced")

### Recommended action
**[KEEP / MOVE / MERGE / SPLIT / REWRITE / DELETE / REDIRECT]**
[One paragraph explaining the recommendation and what specifically needs to happen.]
```

### Batch summary (for section or full inventory)

After auditing multiple pages, produce a summary table:

```markdown
## Audit summary: [Section name or "Full site"]

| Page | Quality | Type match | Terminology | Action | Target location |
|---|---|---|---|---|---|
| About Core | 2/5 | ⚠️ Mixed | 4 violations | Merge | §2 Architecture highlights |
| Access Control | 3/5 | ⚠️ Ref as Expl | 2 violations | Merge | §2 Auth & access control |
| ... | | | | | |

### Key findings
- X pages total audited
- Average quality score: X/5
- Pages with type mismatch: X
- Pages with missing frontmatter: X (expected: all)
- Pages with "what's next" links: X
- Pages flagged as duplicates: X
- Pages with GitHub-as-authority links: X
- Pages with stale dependencies: X
- Recommended actions: X keep, X move, X merge, X split, X rewrite, X delete
```

---

## Integration with planning documents

The auditor reads these files when evaluating:

| Document | Path | Used for |
|---|---|---|
| Glossary | `docs-planning/glossary.md` | Canonical terms, product names, component names, deprecated terms, contested names |
| Gap Analysis | `docs-planning/gap-analysis.md` | Known issues, duplicate pairs, misleading labels |
| Recommended Structure | `docs-planning/recommended-site-structure.md` | Target placement, merge targets, action recommendations |
| Style Guide | `docs-planning/style-guide.md` | Voice rules, formatting standards, page structure requirements |
| Improvement Roadmap | `docs-planning/improvement-roadmap.md` | Priority context (which fixes matter most) |

When referencing a known gap, cite it: "This page is affected by Gap Analysis §1.1 (duplicate title: 'About' ×2)."