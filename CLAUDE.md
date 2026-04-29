# CLAUDE.md

## Rules

- **Never commit or push.** Do not run `git commit`, `git push`, or any variant. The user handles all version control operations manually.

## What this repo is

This is the **documentation and meta repository** for AI DIAL — an open-source, enterprise-grade LLM orchestration platform by EPAM. It is NOT the application code. The platform code lives in 20+ sibling repositories.

This repo contains:
- `docs/` — Docusaurus 3 documentation site, published to https://docs.dialx.ai/
- `dial-docker-compose/` — minimal Docker Compose setups for quick start
- `dial-docker-compose-advanced/` — advanced Docker Compose configs (multiple providers, auth)
- `dial-cookbook/` — code examples and Jupyter notebooks
- `dial-samples/` — sample DIAL applications
- `dial-sdk` — git submodule pointing to https://github.com/epam/ai-dial-sdk

## Current initiative: documentation improvement

The docs site (https://docs.dialx.ai/) is undergoing a major restructuring. The current site has significant gaps: no in-depth tutorials, duplicate page titles pointing to different content, a mislabeled "Tutorials" section that contains no actual tutorials, canonical content redirected to GitHub READMEs, and the primary value surface (DIAL Apps, Tool Sets) is largely undocumented.

The improvement work is governed by four companion documents in `docs-planning/`:

- **Gap Analysis** (`docs-planning/gap-analysis.md`) — 25 evidenced gaps ranked by severity, with full URLs to every referenced page
- **Improvement Roadmap** (`docs-planning/improvement-roadmap.md`) — four-phase action plan (Foundation → Stop the bleeding → Depth and differentiation → Sustainability)
- **Recommended Site Structure** (`docs-planning/recommended-site-structure.md`) — target information architecture with page-by-page migration map from current state
- **Style Guide** (`docs-planning/style-guide.md`) — Diátaxis-based writing rules, terminology glossary, voice/tone per content type, review process
- **Glossary** (`docs-planning/glossary.md`) — Terminology glossary, use it to be consistent

Key structural changes in progress:
- Replacing the incoherent Platform/Tutorials split with journey-based sections: Understand DIAL, Building with DIAL, Operating DIAL, Administering DIAL
- Eliminating 7 duplicate-title pairs (Access Control ×2, About ×2, Deployment ×2, etc.)
- Flattening sidebar from 7 levels to max 4
- Creating the first real tutorials (Getting started with the API, Custom App, Quick App)
- Shipping DIAL Apps documentation as a unified section (Custom Apps, Quick Apps, Code Apps, Mind Map Studio, Tool Sets)
- Consolidating configuration reference on-site (currently redirects to 7+ GitHub READMEs)
- Splitting integrations by purpose: chatbot, productivity add-ins, workflow automation, orchestration patterns

**Sidebar structure: OLD and NEW sections.** The sidebar (`sidebars.js`) has exactly two top-level categories: `OLD` (legacy docs, being phased out) and `NEW` (restructured docs following the recommended site structure). All new documentation pages must go into the `NEW` section. Never add new content to `OLD`. When migrating an existing page, move or rewrite it into the appropriate place under `NEW`.

When working on docs content, always follow the Style Guide conventions and place content according to the Structure document.

## Docs site

The docs site is a Docusaurus 3 project in `docs/`.

```bash
cd docs
npm install
npm run start      # local dev server at http://localhost:3000
npm run build      # production build
npm run serve      # serve production build locally
```

Content lives in `docs/docs/` as Markdown files. Sidebar is configured in `docs/sidebars.js`. Site config is in `docs/docusaurus.config.js`.

## Key conventions

- **Always use "DIAL" in all-caps** when referring to the platform. Not "Dial" or "dial."
- Component names are capitalized: **DIAL Core**, **DIAL Chat**, **DIAL Admin**, **DIAL SDK**.
- The API is called the **Unified API** (not "DIAL API" which is too vague).
- **Application**, **Adapter**, **Interceptor** — these are distinct DIAL concepts with specific meanings. Don't conflate them.
- Deprecated concepts: **Assistant** (repo archived), **Addon** (ChatGPT plugin protocol, abandoned). Don't use in new content.

## All related repositories

### Core platform

| Component | URL | Description |
|---|---|---|
| DIAL Core | https://github.com/epam/ai-dial-core | Java 21 / Gradle. The main component — Unified API server for models, apps, and adapters |
| DIAL Chat | https://github.com/epam/ai-dial-chat | TypeScript / NX monorepo. Default web UI (includes Overlay, Theming, Visualizer Connector) |
| DIAL Admin Frontend | https://github.com/epam/ai-dial-admin-frontend | TypeScript / NX / Next.js. Admin Panel web application |
| DIAL Admin Backend | https://github.com/epam/ai-dial-admin-backend | Java. Admin Panel API for DIAL Core |
| DIAL Auth Helper | https://github.com/epam/ai-dial-auth-helper | AuthProxy service implementing OpenID-compatible endpoints |

### SDKs and frameworks

| Component | URL | Description |
|---|---|---|
| DIAL SDK | https://github.com/epam/ai-dial-sdk | Python ≥3.11 / Poetry. Framework for creating applications and model adapters |
| DIAL Interceptors SDK | https://github.com/epam/ai-dial-interceptors-sdk | Python. Framework for creating interceptors for chat completion and embedding models |

### Model adapters

| Component | URL | Description |
|---|---|---|
| OpenAI Adapter | https://github.com/epam/ai-dial-adapter-openai | Python. Adapter for Azure OpenAI, OpenAI, vLLM, and other OpenAI-compatible APIs |
| Bedrock Adapter | https://github.com/epam/ai-dial-adapter-bedrock | Python. Adapter for AWS Bedrock models |
| Vertex AI Adapter | https://github.com/epam/ai-dial-adapter-vertexai | Python. Adapter for Google Vertex AI models |

### Deployment

| Component | URL | Description |
|---|---|---|
| DIAL Helm | https://github.com/epam/ai-dial-helm | Helm charts for Kubernetes deployment. Stable assemblies are published here |

### Tools and utilities

| Component | URL | Description |
|---|---|---|
| DIAL RAG | https://github.com/epam/ai-dial-rag | Python. RAG project for retrieval-augmented generation |
| DIAL RAG Eval | https://github.com/epam/ai-dial-rag-eval | Python. Library for RAG evaluation (retrieval and generation metrics) |
| Analytics Realtime | https://github.com/epam/ai-dial-analytics-realtime | Real-time usage analytics. Transforms logs into InfluxDB metrics |
| Python Code Interpreter | https://github.com/epam/ai-dial-code-interpreter | Uses Jupyter Kernel to execute arbitrary Python code |
| DIAL-to-DIAL Adapter | https://github.com/epam/ai-dial-adapter-dial | Adapter for local development against a remote DIAL Core |
| Log Parser | https://github.com/epam/ai-dial-log-parser | Tool to parse DIAL log files and repack to parquet dataset |
| App Builder | https://github.com/epam/ai-dial-app-builder | Python. Downloads source from DIAL file storage and prepares container images |

### Infrastructure

| Component | URL | Description |
|---|---|---|
| DIAL CI | https://github.com/epam/ai-dial-ci | Reusable GitHub Actions workflows for all DIAL repos |

### Archived (do not use in new content)

| Component | URL | Description |
|---|---|---|
| DIAL Assistant | https://github.com/epam/ai-dial-assistant | **Archived.** ChatGPT plugin protocol implementation (abandoned) |

## Docker Compose quick start

```bash
cd dial-docker-compose/application
docker compose up
```

Opens DIAL Chat with an echo application at http://localhost:3000.

## Contributing

See `CONTRIBUTING.md`. Key points:
- DIAL is API-first. All components except Core are optional.
- Each component has its own release cadence and owner.
- Stable assemblies are published via the Helm chart.
- Biweekly releases (Wednesdays). Semantic versioning.
- Branch: `main`. PRs reviewed Thursdays.

## Gotchas

- The `dial-sdk` directory is a **git submodule**, not a regular folder. Run `git submodule update --init` after cloning.
- The docs site references pages in sibling repos. Broken links in docs often mean the sibling repo's README changed — check there.
- URL path `/video demos/` has a space. This is a known issue.
- Some docs pages link to GitHub as the authoritative source for configuration — this is being migrated to on-site docs (see Documentation Improvement Plan).

## Available tools

### Shell utilities
- `tree` — directory structure visualization. Use for exploring repo layouts.
- `git` — full git access. Use for: log, blame, diff, checking file history,
  finding when a page was last modified, listing contributors.

### Agent browser
[agent-browser](https://github.com/vercel-labs/agent-browser) is available
for headless web browsing. Use for:
- Fetching and parsing docs.dialx.ai pages
- Browse other github repos, if it's more efficient
- Verifying external links
- Crawling site structure
- Comparing rendered docs against source Markdown

Check capabilities: `agent-browser -h`

* * *

## When working with Claude Code Skills
- Always refer to https://code.claude.com/docs/en/skills