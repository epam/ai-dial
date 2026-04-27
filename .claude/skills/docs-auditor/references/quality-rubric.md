# Quality Scoring Rubric

Score each dimension 1–5. Overall score = average, rounded to nearest integer.

---

## Completeness

*Does the page cover its topic fully, or does it redirect, leave gaps, or trail off?*

| Score | Criteria |
|---|---|
| **5** | Comprehensive. Every aspect of the topic is documented on this page. No "refer to GitHub for details." Reader never needs to leave. |
| **4** | Mostly complete. Minor subtopics may link elsewhere, but all core information is on-page. |
| **3** | Partial. Covers the main points but has visible gaps — some settings undocumented, some steps missing, some scenarios not addressed. |
| **2** | Stub-like. Introduces the topic but redirects to GitHub, another page, or external docs for most of the actual content. |
| **1** | Placeholder or link farm. The page is essentially "this exists, see [external link] for details." |

### DIAL-specific examples
- **Score 2**: Configuration Guide page that says "Refer to the AI DIAL Core repository" for 7 components — all real content is on GitHub
- **Score 3**: Access Control page that covers concepts but doesn't document all object types or configuration options
- **Score 5**: Chat User Guide that comprehensively covers every UI feature

---

## Accuracy

*Are code examples runnable? Are version pins current? Are claims verifiable?*

| Score | Criteria |
|---|---|
| **5** | All code examples run on a clean machine. Version pins are current (within 6 months). All claims are verifiable. |
| **4** | Examples are likely runnable with minor adjustments. Versions are within 12 months. |
| **3** | Examples are plausible but untested or missing imports/setup. Some versions are outdated. |
| **2** | Examples have visible errors (wrong API, missing params, broken imports). Versions are >12 months old. |
| **1** | Examples are clearly broken or use deprecated APIs. Version pins are >2 years old. Factual claims are outdated. |

### DIAL-specific examples
- **Score 1**: Cookbook examples pinning `openai-python-sdk` versions from 2+ years ago
- **Score 3**: Quick Start that works but pins no versions (will break unpredictably)
- **Score 4**: Deployment guide with current Helm chart versions and working commands

---

## Clarity

*Can the target persona understand this without external help?*

| Score | Criteria |
|---|---|
| **5** | Crystal clear for the target persona. Appropriate level of assumed knowledge. Jargon defined on first use or linked to glossary. Headings are scannable. |
| **4** | Clear with minor rough spots. Occasional undefined term or ambiguous sentence. |
| **3** | Understandable with effort. Some sections require re-reading. Assumed knowledge occasionally too high or too low for the target persona. |
| **2** | Confusing. Key concepts unexplained. Structure doesn't help the reader find what they need. Mixed audience signals (writing for developers and end users simultaneously). |
| **1** | Impenetrable. Wall of text, no structure, undefined acronyms, no clear audience. |

### DIAL-specific examples
- **Score 2**: "Apps Development" section whose first page is DIAL-to-DIAL Adapter — a reader looking to build apps is immediately confused
- **Score 3**: Quick App Configuration Guide — clear JSON schema docs, but the reader can't tell if this is the right place to learn about Quick Apps
- **Score 4**: Chat User Guide — well-structured product manual with clear sections

---

## Self-sufficiency

*Can the reader accomplish the goal without leaving the page for essential information?*

| Score | Criteria |
|---|---|
| **5** | Completely self-contained. Everything needed to accomplish the task or understand the concept is on this page. Links are supplementary, not essential. |
| **4** | Nearly self-contained. One or two essential pieces require following a link, but the link is to another docs page (not GitHub). |
| **3** | Partially self-contained. Reader must visit 2–3 other pages or repos to get the full picture. |
| **2** | Heavily dependent on external content. The page makes sense only if you've already read GitHub READMEs or other pages. |
| **1** | Not self-contained at all. The page is essentially a routing hub that links elsewhere for all real content. |

### DIAL-specific examples
- **Score 1**: DevOps sidebar entry that links directly to GitHub with no on-site content
- **Score 2**: Configuration Guide that sends readers to 7 GitHub repos for actual config documentation
- **Score 4**: Admin Panel User Guide that covers the full admin workflow on-site

---

## Freshness

*Are dependencies, screenshots, UI references, and API examples current?*

| Score | Criteria |
|---|---|
| **5** | Everything is current. Dependencies pinned within last 6 months. Screenshots match current UI. API examples use current endpoints and parameters. |
| **4** | Mostly current. Minor staleness (dependency 6–12 months old, screenshot slightly outdated but recognizable). |
| **3** | Noticeably stale. Dependencies 12–18 months old. Some UI references don't match. Still mostly functional. |
| **2** | Significantly stale. Dependencies >18 months old. Screenshots show old UI. Some examples may not work. |
| **1** | Abandonware signals. Dependencies >2 years old. UI completely redesigned since screenshots were taken. Examples are broken. |

### DIAL-specific examples
- **Score 1**: Cookbook page with 2+ year old `openai-python-sdk` dependency
- **Score 3**: Deployment guide referencing a Helm chart version from 12 months ago
- **Score 5**: Page verified within the last month with current dependency pins

---

## Interpreting the overall score

| Overall | Interpretation | Typical action |
|---|---|---|
| **5** | Excellent. Meets all standards. | Keep, minor updates only |
| **4** | Good. Needs polish but fundamentally sound. | Keep, update during migration |
| **3** | Acceptable. Usable but has clear gaps. | Rewrite specific sections |
| **2** | Poor. Misleads or frustrates readers. | Major rewrite or merge into a better page |
| **1** | Harmful. Actively wastes reader time or sends them to dead ends. | Delete, redirect, or rebuild from scratch |