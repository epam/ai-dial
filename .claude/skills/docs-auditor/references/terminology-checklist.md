# Terminology Checklist

This file covers the **audit mechanics** for terminology compliance: what to scan for, how to report violations, severity guide. For the **canonical terms themselves** (product names, component names, core concepts, deprecated terms, contested names), always read `docs-planning/glossary.md` — it is the single source of truth.

---

## What to scan for

### 1. Product and component name violations

Read `docs-planning/glossary.md` for the canonical forms. Scan the page for any variant that doesn't match. Common violations:

- Lowercase or mixed-case product names ("dial," "Dial," "DiAL" instead of "DIAL")
- Informal substitutions ("the backend," "the server," "the frontend" instead of the glossary's canonical component names)
- Vague references ("DIAL API" when "Unified API" is the canonical term)

### 2. Core concept conflation

Read the concept definitions in `docs-planning/glossary.md`. Flag when a page uses one concept where it means another (e.g., "adapter" when the page is describing an interceptor, or "application" when it means a model adapter).

### 3. Deprecated terms without marking

Read the deprecated terms section in `docs-planning/glossary.md`. If a page uses a deprecated term (e.g., "Assistant," "Addon"), check: is there a deprecation notice on the page? If not, flag as a violation.

### 4. Naming chaos (contested terms)

Read `docs-planning/glossary.md` for any term that has multiple variants listed (e.g., "Agent Builder" vs "application runner" vs "Application builders" vs "Builders"). Flag which variant the page uses. Until the glossary canonicalizes one, every occurrence should be noted for later alignment.

### 5. Forbidden phrases

These are independent of the glossary. Delete on sight:

| Phrase | Problem | Fix |
|---|---|---|
| "simply" | Gaslights stuck readers | Delete |
| "just" (as minimizer) | Same | Delete ("just run" → "run") |
| "easily" | Same | Delete |
| "obviously" | Same | Delete |
| "please note that" | Throat-clearing | Start with the thing |
| "it should be noted that" | Same | Start with the thing |
| "our product" | Marketing voice | "DIAL" |
| "AI-powered" | Everything here is AI | Delete |
| "cutting-edge" | Marketing | Delete |
| "best-in-class" | Marketing | Delete |
| "click here" | Inaccessible link text | Describe the destination |
| "as shown in the video" | Text must stand alone | Rewrite to be self-contained |

### 6. Capitalization violations

| Context | Rule | Example |
|---|---|---|
| Product names | Always capitalized as defined in glossary | DIAL Core, DIAL Chat |
| Generic concepts mid-sentence | Lowercase | "an application," "an adapter" |
| Start of sentence | Capitalize naturally | "Applications are extensions…" |
| HTTP verbs in reference docs | Uppercase | `GET`, `POST`, `DELETE` |
| Environment variables | Uppercase, underscored, code font | `DIAL_URL`, `DIAL_SERVER_PORT` |
| Config keys in reference docs | Code font | `server.port`, `auth.jwt.jwks-url` |
| Headings | Sentence case | "Configure the adapter" not "Configure The Adapter" |

### 7. Markdown formatting conventions

Scan for the site's Markdown-output conventions. The first three are exact grep checks; run them from the repo root against the page (or section):

```bash
grep -nE ':::'        <page>   # admonitions — must be bold label + blockquote
grep -n  'localhost'  <page>   # must be 0.0.0.0 in example hosts/URLs
grep -nE '\]\(/'      <page>   # absolute internal links — must be relative + .md
```

| Convention | Violation | Fix |
|---|---|---|
| Highlights | `:::note` / `:::tip` / `:::warning` / `:::info` admonition | Bold label line + blockquote (`**Warning**` then `> ...`) — labels: Note, Tip, Warning, Deprecated |
| Example host | `localhost` in a URL or code example | `0.0.0.0` (e.g., `http://0.0.0.0:8080`) |
| Internal links | Absolute root path (`](/section/page)`) or missing `.md` extension | Relative path ending in `.md` (`](../section/page.md)`) |
| Bold lead-in | Bold label introducing a block inline (`**Verify:** The adapter...`) | Blank line after the label; content as its own paragraph |
| Lists | Consecutive parallel standalone statements as bare paragraphs | Bullet list (`- ...`) |

---

## How to report violations

For each violation found, report:

```
- Line N: "the backend" → "DIAL Core" (product name — see glossary)
- Line N: "simply" → delete (forbidden phrase)
- Line N: "Builders" → flag for glossary canonicalization (naming chaos)
- Line N: "Addon" used without deprecation notice (deprecated term — see glossary)
```

Count total violations per page. Severity guide:

| Violations | Severity |
|---|---|
| 0 | ✅ Clean |
| 1–3 | Minor — fix during migration |
| 4–8 | Moderate — dedicated cleanup PR |
| 9+ | Major — full terminology pass needed |