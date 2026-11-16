# CLAUDE.md

## Rules

- **Do not commit or push without explicit permission.** Only run `git commit` / `git push` (or any variant) when the user has explicitly authorized that specific action. Absent such authorization, the user handles version control manually.
- **Never upgrade or install packages without explicit permission.** Do not run `npm install` / `npm ci` / `npm update` (or any variant) to add, upgrade, or change dependencies, and do not edit `package.json` / `package-lock.json`, unless the user has explicitly authorized it. A build that fails on a dependency issue is a finding to report, not a license to change packages.
- **Never assume redirects are necessary after a rename or path change.** Renaming files/folders or changing routes does not automatically require adding redirects (e.g. `@docusaurus/plugin-client-redirects`). Only add redirects when the user explicitly asks for them, and if you do, wire the targets to real, existing routes and verify with a full build.
- **Never edit or create files without explicit approval.** Propose the change first — what you'll change and the exact source line that backs it — then wait for the go-ahead before touching any file.
- **Never make things up. Prove everything in the source.** Ground every statement and change in solid evidence from source code or authoritative docs. Cite the exact source. Clearly separate what is proven from what is inferred; never state an inference as fact.
- **Keep replies concise and precise — no walls of text, no visible reasoning dumps.** Give the informative result, not the thought process behind it.

## What this repo is

This is the **documentation and meta repository** for AI DIAL — an open-source, enterprise-grade LLM orchestration platform by EPAM. It is NOT the application code. The platform code lives in 20+ sibling repositories.

This repo contains:
- A **Docusaurus 3** documentation site **rooted at the repo root** (`docusaurus.config.js`, `sidebars-v2.js`, `docs.config.js`, `package.json` are all at the top level), published to https://docs.dialx.ai/. All content lives in `docs_v2/` and is served at the site root `/`. The legacy `docs/` site was removed; its URLs return 404.
- `dial-samples/` — sample DIAL applications

## Current initiative: documentation improvement

The docs site (https://docs.dialx.ai/) is undergoing a major restructuring. The current site has significant gaps: no in-depth tutorials, duplicate page titles pointing to different content, a mislabeled "Tutorials" section that contains no actual tutorials, canonical content redirected to GitHub READMEs, and the primary value surface (DIAL Apps, Toolsets) is largely undocumented.

Key structural changes in progress:
- Replacing the incoherent Platform/Tutorials split with journey-based sections: Understand DIAL, Building with DIAL, Operating DIAL, Administering DIAL
- Eliminating 7 duplicate-title pairs (Access Control ×2, About ×2, Deployment ×2, etc.)
- Flattening sidebar from 7 levels to max 4
- Creating the first real tutorials (Getting started with the API, Custom App, Quick App)
- Shipping DIAL Apps documentation as a unified section (Custom Apps, Quick Apps, Code Apps, Mind Map Studio, Toolsets)
- Consolidating configuration reference on-site (currently redirects to 7+ GitHub READMEs)
- Splitting integrations by purpose: chatbot, productivity add-ins, workflow automation, orchestration patterns

**All documentation lives in `docs_v2/`**, served at `/` by the `@docusaurus/plugin-content-docs` instance with `id: v2` in `docusaurus.config.js` (the id and folder name are historical; the classic preset's own docs instance is off). The legacy `docs/` site, its `sidebars.js`, and the Quarto notebook rendering were removed. Page ids in `sidebars-v2.js` are relative to `docs_v2/` (e.g. `building-with-dial/apps/index`).

## Docs site

The Docusaurus 3 project lives at the **repo root**. Run all commands from there:

```bash
npm install
npm run start      # local dev server at http://localhost:3000
npm run build      # production build
npm run serve      # serve production build locally
```

Content lives in `docs_v2/` as Markdown files. Sidebar: `sidebars-v2.js`. Site config: `docusaurus.config.js`.

### Home page and section toggles

`docs.config.js` (repo root) is read by both `docusaurus.config.js` and `sidebars-v2.js`.

- **Home page:** `docs_v2/1.overview.md` has `slug: /`, so the Overview page is served at `/`. An inline redirect plugin (`docusaurus.config.js` → `src/components/RootRedirect.js`, routes and target from `ROOT_REDIRECT` in `docs.config.js`) sends `/v2` and `/v2/overview`, the home URLs from before the docs moved to `/`, to `/`. Other `/v2/...` URLs are not redirected.
- **`DOCS_V2_SECTIONS`** = `all` (default) | comma-separated section keys — which top-level sections show in the sidebar. Keys: `overview, understand-dial, building-with-dial, operating-dial, administering-dial, services, chat-user-guide, use-cases, demos`. Hiding a section removes it from the menu only; its pages still build and stay reachable (so cross-links don't break). Hiding `overview` removes its menu entry; the page still owns `/`.

```bash
DOCS_V2_SECTIONS="overview,building-with-dial" npm run start # sidebar shows two sections
```

### Links

`onBrokenLinks`, `onBrokenAnchors`, `onBrokenMarkdownLinks`, and `onBrokenMarkdownImages` are all set to `throw` — a broken link fails the build. Conventions:
- Internal doc-to-doc links use a **relative path ending in `.md`**, including the numeric file prefix (e.g. `](../apps/0.index.md)`, `](./3.prompts.md#variables)`). **Never use an absolute root path** (e.g. `/building-with-dial/...` or `/v2/...`).
- Never link to legacy `docs.dialx.ai` URLs (such as `/platform/...`) or to folders removed from this repo (`docs/`, `dial-cookbook/`, `dial-docker-compose*/`); they return 404. Link to the `docs_v2/` page instead.
- Index docs use a `0.index.md` filename and route to `…/index` (the numeric prefix prevents folder-collapsing).

### File naming and numbering (keep the tree in sync with the menu)

**Invariant: a file's/folder's numeric `N.` prefix MUST equal its position in `sidebars-v2.js`.** Docusaurus strips the leading `N.` from every path segment (file *and* directory) when computing a route id, so the prefix is purely organizational — but the file tree must still read in menu order. Keep them aligned:

- **Every content file and folder under `docs_v2/` carries a numeric prefix that matches its order in the menu**, at every level: the entry page (`1.overview.md`) and the top-level sections (`2.understand-dial/`, … `10.demos/` — in `V2_SECTIONS` catalog order; top-level prefix `8.` is intentionally unused since the Reference section was removed, and `9.use-cases/` / `10.demos/` keep their numbers), sub-folders, and files. Numbering is **per parent directory**: files and sub-folders that share a parent draw from one sequence in their first menu appearance order.
- **`0.index.md`** is the section/category landing (route `…/index`). It is always `0.`.
- When you **add** a page: give it the prefix of its menu slot and **bump the prefixes of every sibling that comes after it** (files *and* sub-folders in that directory). When you **reorder** the menu, renumber the affected files to match. When you **remove** a page, prefer closing the numeric gap.
- **Renaming a file's prefix does NOT change its route id** (the prefix is stripped), so `sidebars-v2.js` needs no edit for a pure renumber. But it **does** change any relative `.md`/image link that spells out the old prefixed name — fix those (see Links above) and let the build verify.

**Things that are NOT numbered** (leave them alone):
- `img/` asset folders and the images inside them.
- Extension-less links are Docusaurus **route** paths (already prefix-stripped); never add a numeric prefix to them.

**Before finishing any structural change, run `npm run build`** — `onBroken*` are all `throw`, so it is the authoritative check that the tree, the menu, and every link still agree.

## Key conventions

- **Always use "DIAL" in all-caps** when referring to the platform. Not "Dial" or "dial."
- Component names are capitalized: **DIAL Core**, **DIAL Chat**, **DIAL Admin**, **DIAL SDK**.
- The API is called the **Unified API** (not "DIAL API" which is too vague).
- **Application**, **Adapter**, **Interceptor** — these are distinct DIAL concepts with specific meanings. Don't conflate them.
- **Toolset** / **Toolsets** — one word, not "Tool Set". This matches the name used in DIAL Chat and DIAL Admin. Use it consistently (code identifiers such as `tool_sets`, `client_toolset` are unaffected).
- Deprecated concepts: **Assistant** (repo archived), **Addon** (ChatGPT plugin protocol, abandoned). Don't use in new content.
- **Closing links:** a page ends with at most one `## Further reading` block (2–6 relevant links, `./x.md` format); `0.index.md` pages have none. No `Next steps` / `Related tasks`.

## Contributing

See `CONTRIBUTING.md`. Key points:
- DIAL is API-first. All components except Core are optional.
- Each component has its own release cadence and owner.
- Stable assemblies are published via the Helm chart.
- Biweekly releases (Wednesdays). Semantic versioning.
- Branch: `main`. PRs reviewed Thursdays.

## Gotchas

- The docs site references pages in sibling repos. Broken links in docs often mean the sibling repo's README changed — check there.
- Some docs pages link to GitHub as the authoritative source for configuration — this is being migrated to on-site docs.

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