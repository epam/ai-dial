# Research Brief Template

Use this template for all research briefs saved to `.claude-workspace/research/`.

## Naming convention

```
<date>-<mode>-<slug>.md
```

- **date**: ISO format, e.g., `2026-04-28`
- **mode**: one of `component`, `feature`, `api`, `config`, `architecture`
- **slug**: kebab-case topic identifier

Examples:
- `2026-04-28-component-dial-core.md`
- `2026-04-28-feature-access-control.md`
- `2026-04-28-api-unified-api-endpoints.md`
- `2026-04-28-config-core-env-vars.md`
- `2026-04-28-architecture-app-lifecycle.md`

## Template

```markdown
---
topic: "<Topic name>"
mode: <component|feature|api|config|architecture>
date: <YYYY-MM-DD>
status: <complete|partial>
repos_consulted:
  - <repo-name>
gaps_addressed:
  - "#N: <gap title from gap-analysis.md>"
target_pages:
  - "<page path from recommended-site-structure.md>"
---

# Research: <Topic Name>

## Scope

What this research covers and what it explicitly does not cover.

## Sources consulted

| Source | Type | Path / URL | Notes |
|---|---|---|---|
| epam/ai-dial-core | README | README.md | |
| epam/ai-dial-core | Source | src/.../ConfigHandler.java | Config loading logic |
| dialx.ai | API docs | https://dialx.ai/dial_api | Endpoint reference |

## Findings

### <Subtopic 1>

Structured findings. Use tables for structured data (config keys, API endpoints).
Use prose for architectural explanations and design decisions.

### <Subtopic 2>

Continue as needed.

## Code examples found

Runnable examples discovered in source repos, READMEs, or test files.

Source: `<repo>/<path>`
```<language>
<code>
```

## Configuration details

| Key | Env var | Type | Default | Description | Source |
|---|---|---|---|---|---|
| | | | | | `<file path>` |

(Omit this section if not applicable to the research mode.)

## Documentation implications

What pages need to be written or updated, mapped to the recommended site structure.

| Target page | Diátaxis type | What this research provides | Priority |
|---|---|---|---|
| §X.Y Page name | reference | Complete config key listing | High |
| §X.Z Page name | explanation | Architecture diagram | Medium |

## Open questions

Things this research could not determine. Each should note where to look next.

- [ ] Question 1 — look in `<repo>/<path>` or ask `<team>`
- [ ] Question 2 — requires running the service to verify
```

## Index file

Maintain a research index at `.claude-workspace/research/_index.md`:

```markdown
# Research Index

| Date | Brief | Mode | Topic | Status | Gaps | Target pages |
|---|---|---|---|---|---|---|
| 2026-04-28 | [DIAL Core](2026-04-28-component-dial-core.md) | component | DIAL Core | complete | #2, #8, #15, #16 | §4.4, §4.8 |
```

Update this index every time a brief is created or updated.
