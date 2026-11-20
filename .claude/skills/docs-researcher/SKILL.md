---
name: docs-researcher
description: >
  Research DIAL component repositories and external sources to produce
  structured technical briefs that feed into the docs-page-writer workflow.
  Use this skill when preparing to write documentation that requires
  understanding source code, APIs, configuration schemas, or architecture
  from any of the 20+ DIAL repositories. Triggers on: "research",
  "investigate", "find out how X works", "what does the code say about",
  "extract config from", "map the API for", "how does X connect to Y",
  "deep dive into", "what env vars does X have", "what endpoints does X expose",
  or any request to gather technical information from DIAL source repos
  before writing docs. Also use when the user references a gap from
  docs-planning/gap-analysis.md that requires source code investigation.
  For quick targeted questions, answers inline without saving a file.
  For substantial investigations, produces a research brief saved to
  .claude-workspace/research/. Do not use for writing docs pages
  (use docs-page-writer) or auditing existing docs (use docs-auditor).
---

# DIAL Documentation Researcher

This skill gathers technical information from DIAL component repositories and external sources. It produces structured research briefs that feed into the `docs-page-writer` workflow, bridging the gap between the gap analysis (what's missing) and documentation writing (filling the gaps).

## Tools

| Step | Tool | Purpose |
|---|---|---|
| Read local files | `Read` | Load files from this repo: docs-planning/, existing docs, CLAUDE.md |
| Read GitHub files | `Bash` with `gh api` | Fetch individual files: `gh api repos/epam/<repo>/contents/<path> -q .content \| base64 -d` |
| Browse repo tree | `Bash` with `gh api` | List repo structure: `gh api repos/epam/<repo>/git/trees/main?recursive=1 -q '.tree[].path'` |
| Fetch rendered content | `WebFetch` | Read docs site pages, GitHub rendered content, or external sources |
| Search code on GitHub | `Bash` with `gh api` | Search across repos: `gh api -X GET '/search/code?q=org:epam+repo:ai-dial-core+getenv' -q '.items[].path'` |
| Browse UI | `agent-browser` | Navigate docs.dialx.ai, dialx.ai/dial_api, or GitHub web UI for complex browsing |
| Save research brief | `Write` | Write results to `.claude-workspace/research/<date>-<mode>-<slug>.md` |
| Update research index | `Edit` | Update `.claude-workspace/research/_index.md` |

## Planning documents

Load selectively based on the research mode:

| Research mode | Required documents |
|---|---|
| Component deep-dive | `CLAUDE.md`, `references/repo-map.md`, `docs-planning/gap-analysis.md` |
| Feature investigation | `CLAUDE.md`, `references/repo-map.md`, `docs-planning/gap-analysis.md`, `docs-planning/recommended-site-structure.md` |
| API mapping | `CLAUDE.md`, `references/repo-map.md` |
| Config extraction | `CLAUDE.md`, `references/repo-map.md` |
| Architecture mapping | `CLAUDE.md`, `references/repo-map.md`, `docs-planning/recommended-site-structure.md`, `docs-planning/glossary.md` |

## Reference files

| File | Purpose |
|---|---|
| `references/repo-map.md` | Structured map of all 20+ DIAL repos with URLs, languages, key files, related components, and known documentation gaps |
| `references/research-brief-template.md` | Output template for research briefs including naming convention, frontmatter, section structure, and index format |

---

## Operating modes

### Quick lookup

For narrow, targeted questions: "what env vars does DIAL Core have?", "where is the auth middleware defined?", "what's the SDK base class for apps?"

**Behavior:**
1. Identify the relevant repo(s) from the repo map
2. Fetch the specific files needed to answer the question
3. Answer inline — no file saved
4. If the question reveals a topic worth deeper investigation, suggest a full research brief

### Full research brief

For substantial investigations that will feed into documentation writing. Produces a saved brief at `.claude-workspace/research/<date>-<mode>-<slug>.md`.

Five sub-modes:

1. **Component deep-dive** — Research a specific DIAL component
2. **Feature investigation** — Cross-cutting research across multiple repos
3. **API mapping** — Extract API surface and compatibility information
4. **Config extraction** — Pull configuration schemas, env vars, defaults
5. **Architecture mapping** — Map component relationships and data flows

**When to use which:** Use quick lookup for questions answerable by reading 1–3 files. Use full brief when the topic is broad, touches multiple repos, or will directly feed a documentation page.

---

## Repo access strategy

Use a tiered approach, starting with the lightest-weight method:

### Tier 1: `gh api` (default)

For reading specific files and listing repo structure. Fast, no disk usage.

```bash
# List full file tree
gh api repos/epam/ai-dial-core/git/trees/main?recursive=1 -q '.tree[].path'

# Filter for specific patterns
gh api repos/epam/ai-dial-core/git/trees/main?recursive=1 -q '.tree[].path' | grep -E '(Config|Setting|Properties)'

# Read a specific file
gh api repos/epam/ai-dial-core/contents/README.md -q .content | base64 -d

# Read from a subdirectory
gh api repos/epam/ai-dial-core/contents/src/main/resources -q '.[].name'
```

### Tier 2: `WebFetch`

For rendered content, docs site pages, and external sources.

```
WebFetch: https://raw.githubusercontent.com/epam/ai-dial-core/main/README.md
WebFetch: https://docs.dialx.ai/platform/core/about-core
```

### Tier 3: GitHub code search

When searching across many files is needed (e.g., "find all environment variables in DIAL Core"). Use the GitHub search API — no cloning required.

```bash
# Search for env vars in a Java repo
gh api -X GET '/search/code?q=System.getenv+repo:epam/ai-dial-core+language:java' -q '.items[] | "\(.path):\(.name)"'

# Search for env vars in a Python repo
gh api -X GET '/search/code?q=os.environ+repo:epam/ai-dial-sdk+language:python' -q '.items[] | "\(.path):\(.name)"'

# Then fetch the specific files you need
gh api repos/epam/ai-dial-core/contents/src/main/java/com/epam/aidial/core/config/Config.java -q .content | base64 -d
```

If GitHub search rate limits are hit, fall back to listing the repo tree and fetching files individually:

```bash
# List all files in a repo
gh api repos/epam/ai-dial-core/git/trees/main?recursive=1 -q '.tree[] | select(.path | test("Config|config|settings")) | .path'

# Read a specific file
gh api repos/epam/ai-dial-core/contents/<path> -q .content | base64 -d
```

### Tier 4: `agent-browser`

For complex browsing tasks: navigating the rendered docs site structure, reading API docs at `dialx.ai/dial_api`, or exploring GitHub UI when `gh api` output is hard to parse.

---

## Research procedures

### Mode 1: Component deep-dive

The user names a specific DIAL component (e.g., "research DIAL Core", "deep dive into the SDK").

**Procedure:**

1. Load `references/repo-map.md`. Identify the repo URL, language, build system, key files, and known documentation gaps.
2. Read the repo's README via `gh api`.
3. List the file tree via `gh api` to understand the codebase layout.
4. Identify and read key source files:
   - Entry points and main classes
   - Configuration loading (config classes, env var reads, default values)
   - API route definitions (handlers, controllers, decorators)
   - Test files (reveal expected behavior and edge cases)
5. Cross-reference with `docs-planning/gap-analysis.md` — which gaps does this component address?
6. Cross-reference with `docs-planning/recommended-site-structure.md` — which planned pages does this research feed?
7. Write the research brief using the template.
8. Update the research index.

### Mode 2: Feature investigation

The user names a cross-cutting feature (e.g., "how does access control work?", "how do Tool Sets work?").

**Procedure:**

1. Determine which repos are involved using the repo map and architectural knowledge. Most features touch 2–4 repos.
2. For each relevant repo, do a targeted investigation focused on the feature:
   - Search for relevant classes, functions, config keys
   - Read the implementation to understand behavior
3. Trace the feature flow across components. Document the sequence:
   - Who initiates? (client, admin, system)
   - What passes through Core?
   - What touches storage, auth, or external services?
4. Synthesize findings into a "Component interactions" section showing data flow.
5. Write the brief with a cross-component synthesis, not just per-repo findings.
6. Update the index.

### Mode 3: API mapping

Extract the API surface for a specific area (e.g., Unified API, Admin API, file management).

**Procedure:**

1. Identify where API routes are defined in the source code:
   - DIAL Core (Java): handler/controller classes, route registrations
   - SDK-based components (Python): route decorators, endpoint definitions
2. Read route definitions to extract: method, path, parameters, request/response bodies.
3. Cross-reference with the external API docs at `dialx.ai/dial_api` via WebFetch.
4. Document OpenAI compatibility: which endpoints match the OpenAI spec, which are DIAL extensions, which parameters are unsupported.
5. Write the brief with endpoint tables.
6. Update the index.

### Mode 4: Config extraction

Pull configuration details from source code for a specific component.

**Procedure:**

1. Identify the component and repo.
2. Shallow clone — config extraction almost always requires grep across many files.
3. Search for configuration patterns by language:
   - **Java** (Core, Admin Backend): `System.getenv`, `@Value("${...}")`, `@ConfigProperty`, HOCON/YAML loading, `*Config*` classes
   - **Python** (SDK, Adapters, RAG): `os.environ`, `os.getenv`, `pydantic.BaseSettings`, `.env` file loading, `*Settings*` classes
   - **TypeScript** (Chat, Admin Frontend): `process.env`, `.env.*` files, config modules
4. For each config key found, extract: key name, env var, type, default value, description (from comments or variable names), source file.
5. Compile into a configuration table.
6. Clean up the clone.
7. Write the brief.
8. Update the index.

### Mode 5: Architecture mapping

Map component relationships, data flows, and extension points.

**Procedure:**

1. Read architecture-related source from multiple repos:
   - Entry points that show startup and component wiring
   - Client libraries that show inter-service communication
   - Protocol definitions (SDK base classes, API contracts)
2. Trace the primary request flow: client → Core → interceptors → model/application → response.
3. Identify extension points — where custom code can be injected:
   - Application (via SDK)
   - Adapter (via SDK)
   - Interceptor (via Interceptors SDK)
   - Quick App / Code App (via App Builder)
   - Tool Set (MCP server)
   - Overlay, Visualizer, Theme (Chat extensions)
4. Use canonical terms from `docs-planning/glossary.md`.
5. Include a Mermaid diagram in the brief showing component relationships.
6. Write the brief.
7. Update the index.

---

## Output format

### Quick lookup

Answer inline. Use code blocks, tables, or bullet lists as appropriate. End with a note if a full research brief would be valuable:

> This covers the quick answer. For a comprehensive research brief on [topic], I can run a full [mode] investigation.

### Full research brief

Follow the template in `references/research-brief-template.md`. Key requirements:

- **Naming**: `<date>-<mode>-<slug>.md` in `.claude-workspace/research/`
- **Frontmatter**: topic, mode, date, status, repos_consulted, gaps_addressed, target_pages
- **Sections**: Scope → Sources consulted → Findings → Code examples → Config details → Documentation implications → Open questions
- **Tables**: Use tables for structured data (config keys, API endpoints, sources)
- **Terminology**: Use canonical terms from `docs-planning/glossary.md`

### Research index

Maintain `.claude-workspace/research/_index.md` — a markdown table tracking all briefs. Update it every time a brief is created or modified.

---

## Multi-session research

Large topics may require multiple sessions.

1. **Before starting**: Check `.claude-workspace/research/` for existing briefs on the same topic. Read them to avoid duplicate work.
2. **Partial briefs**: Set `status: partial` in frontmatter. Add an "Open questions / Remaining work" section listing what's been covered and what remains.
3. **Resuming**: When the user says "continue research on X", read the existing partial brief, pick up from the "Remaining work" list, and update the brief in place.
4. **Completion**: Change status to `complete` when all planned subtopics are covered and open questions are either resolved or explicitly deferred.

---

## Integration with other skills

| Skill | Integration |
|---|---|
| `docs-page-writer` | Writer reads research briefs as input context when creating documentation pages. The "Documentation implications" section maps directly to target pages. |
| `docs-auditor` | Research briefs use canonical terminology. The auditor can verify that pages written from briefs accurately reflect source material. |
| `docs-planning/` | Every brief links to specific gaps in `gap-analysis.md` and target pages in `recommended-site-structure.md`. |

**Workflow**: gap analysis → **research** → page writing → audit → iteration
