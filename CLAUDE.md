# CLAUDE.md

## Rules

- **Never commit or push.** Do not run `git commit`, `git push`, or any variant. The user handles all version control operations manually.

## What this repo is

This is the **documentation and meta repository** for AI DIAL — an open-source, enterprise-grade LLM orchestration platform by EPAM. It is NOT the application code. The platform code lives in 20+ sibling repositories.

This repo contains:
- A **Docusaurus 3** documentation site **rooted at the repo root** (`docusaurus.config.js`, `sidebars.js`, `sidebars-v2.js`, `package.json` are all at the top level — NOT inside `docs/`), published to https://docs.dialx.ai/. It serves two doc instances:
  - `docs/` — **OLD** (legacy) content, served at `/`
  - `docs_v2/` — **NEW** (restructured) content, served at `/v2`
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

**OLD and NEW are two separate Docusaurus instances.** The legacy site and the restructured site are physically and structurally separated:

| | OLD (legacy, being phased out) | NEW (restructured) |
|---|---|---|
| Content folder | `docs/` | `docs_v2/` |
| Sidebar file | `sidebars.js` (`CustomSideBar`) | `sidebars-v2.js` (`v2Sidebar`) |
| Served at | `/` | `/v2` |
| Plugin | classic preset | second `@docusaurus/plugin-content-docs` instance (`id: v2`) in `docusaurus.config.js` |

**All new documentation goes into `docs_v2/`. Never add new content to `docs/` (OLD).** When migrating an existing OLD page, move or rewrite it into the appropriate place under `docs_v2/` per the Structure document. Page ids in `sidebars-v2.js` are relative to `docs_v2/` (e.g. `building-with-dial/apps/index`, no `docs/NEW/` prefix).

When working on docs content, always follow the Style Guide conventions and place content according to the Structure document.

## Docs site

The Docusaurus 3 project lives at the **repo root**. Run all commands from there:

```bash
npm install
npm run start      # local dev server at http://localhost:3000
npm run build      # production build (also regenerates changelog, tracking.json, progress.md)
npm run serve      # serve production build locally
```

NEW content lives in `docs_v2/` as Markdown files; OLD content in `docs/`. Sidebars: `sidebars.js` (OLD) and `sidebars-v2.js` (NEW). Site config: `docusaurus.config.js`.

### Links

`onBrokenLinks`, `onBrokenAnchors`, `onBrokenMarkdownLinks`, and `onBrokenMarkdownImages` are all set to `throw` — a broken link fails the build. Conventions:
- Internal doc-to-doc links use a **relative path ending in `.md`**, including the numeric file prefix (e.g. `](../apps/0.index.md)`, `](./3.prompts.md#variables)`). **Never use an absolute root path** (`/v2/...` or `/platform/...`).
- Keep the NEW tree **self-contained** — `docs_v2/` pages should link to other `docs_v2/` pages, not into OLD `docs/`. Cross-instance links can't be relative `.md` links (Docusaurus won't resolve across instances); avoid creating them.
- Index docs use a `0.index.md` filename and route to `…/index` (the numeric prefix prevents folder-collapsing).

## Key conventions

- **Always use "DIAL" in all-caps** when referring to the platform. Not "Dial" or "dial."
- Component names are capitalized: **DIAL Core**, **DIAL Chat**, **DIAL Admin**, **DIAL SDK**.
- The API is called the **Unified API** (not "DIAL API" which is too vague).
- **Application**, **Adapter**, **Interceptor** — these are distinct DIAL concepts with specific meanings. Don't conflate them.
- Deprecated concepts: **Assistant** (repo archived), **Addon** (ChatGPT plugin protocol, abandoned). Don't use in new content.

## All related repositories

See [`docs-planning/repositories.md`](docs-planning/repositories.md) for the full list of DIAL component repositories.

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