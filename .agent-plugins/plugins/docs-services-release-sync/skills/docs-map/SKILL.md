---
name: docs-map
description: Use when working in the epam/ai-dial documentation repository and you need to know where a topic lives in docs_v2, whether a path may be edited during a service docs sync, how file prefixes follow sidebars-v2.js, how to write an internal link or anchor, which frontmatter values are valid, or how to add, remove, or rename a page.
---

# DIAL docs map

The site is Docusaurus 3, rooted at the repository root and published to https://docs.dialx.ai/. All content is in `docs_v2/`, served at `/`. The menu is `sidebars-v2.js`. `.md` files are parsed as MDX.

## Sections

| Path | Menu | Reader | Holds | In a service sync |
|---|---|---|---|---|
| `docs_v2/1.overview.md` | Overview, the site home (`slug: /`) | everyone | product overview; links every service | never edit; report a stale sentence under "Needs review" |
| `docs_v2/2.understand-dial/` | Understand DIAL | architects | foundations and the glossary (`2.foundations/2.glossary.md`), capabilities, architecture, security and governance | related: fix only what a release made false |
| `docs_v2/3.connecting-to-dial/` | Connecting to DIAL | app developers | agentic tools such as Claude Code and Codex, chatbot integrations, add-ins, workflow automation | related |
| `docs_v2/4.building-with-dial/` | Building with DIAL | app developers | apps (Quick, Code, Custom), toolsets, interceptors, adapters, SDK reference, chat customization, resource APIs, prompt caching | related |
| `docs_v2/5.operating-dial/` | Operating DIAL | platform engineers | local setup, cloud deployment, model deployment, auth and access control, observability, production readiness, troubleshooting | related |
| `docs_v2/6.administering-dial-new/` | Administering DIAL | administrators | the DIAL Admin user guide | never edit; the `admin-guide-sync` skill owns it; report |
| `docs_v2/7.services/` | Services | platform engineers | one folder per service; see the `docs-services-release-sync:services-section` skill | the synced folder: edit; the landing page and other folders: related |
| `docs_v2/8.chat-user-guide/` | Chat User Guide | end users | the DIAL Chat user guide | never edit; the `chat-guide-sync` skill owns it; report |
| `docs_v2/9.demos/` | Demos | everyone | demo videos | never edit |
| `docs/releases/<N>/` | not served | — | legacy folder; only platform release notes and upgrade notes remain | read only, with `git show` (see `docs-services-release-sync:release-research`) |

Never edit these in a sync: `package.json`, `package-lock.json`, `docusaurus.config.js`, `docs.config.js`, `src/`, `static/`, `scripts/`, `outdated_references.*`, `CLAUDE.md`, `.claude/`, `.github/`, `dial-samples/`, and any section not marked "related" above.

## Numbering and routes

- A file's or folder's `N.` prefix equals its position in `sidebars-v2.js`, counted per parent directory; files and sub-folders share one sequence. `0.index.md` is always the folder's landing.
- Docusaurus strips every prefix from the route id: `docs_v2/7.services/22.log-parser/1.configuration.md` is `services/log-parser/configuration`, and `.../0.index.md` is `services/log-parser/index`. Sidebar ids use these route ids.
- Renumbering changes no route id, but it breaks every relative link that spells out the old prefixed name.
- Known exceptions; leave them as they are:
  - `7.services/20.analytics/` and `21.analytics-enrichment-runner/` appear in the menu right after DIAL Admin.
  - Gaps left by deleted pages stay. For example, `5.operating-dial/` has no `4.`, and `4.building-with-dial/` has no `6.`. Never renumber to close a gap you didn't create.
  - `6.administering-dial-new/` has numbering mismatches that predate the sync.
- `img/` folders and images are not numbered.

## Sidebar entries

A service is a category inside the `"label": "Services"` category, in folder order:

```js
{
  "type": "category",
  "label": "DIAL <SERVICE>",
  "items": [
    { "type": "doc", "id": "services/<service>/index", "label": "Overview" },
    { "type": "doc", "id": "services/<service>/configuration", "label": "Configuration" }
  ]
}
```

Change `sidebars-v2.js` only when a page is added, removed, or renamed. A label change on its own is not part of a sync.

## Links

- Internal links are relative and end in `.md`, with the numeric prefixes: `](../20.analytics/0.index.md)`, `](./1.configuration.md#storage-credentials)`.
- Never use absolute paths (`/services/...`, `/v2/...`), `https://docs.dialx.ai/...` URLs, or links into the legacy `docs/` folder.
- Some older pages use extension-less route links, such as `](configure-metrics)`. They resolve and build; leave them, and write new links with `.md`.
- Anchors are Docusaurus slugs: lowercase, backticks and punctuation dropped, spaces become hyphens. `## Connect DIAL Admin` is `#connect-dial-admin`, `## 0.21.0` is `#0210`, and a repeated heading gets `-1`, `-2`.
- Renaming a heading changes its anchor. Avoid it. If a rename is unavoidable, find every link to the old anchor (`grep -rn '#<old-anchor>' docs_v2`) and fix them all.
- `onBrokenLinks`, `onBrokenAnchors`, `onBrokenMarkdownLinks`, and `onBrokenMarkdownImages` are `throw`, so one broken link fails the build.

## MDX hazards

Docusaurus 3 parses every `.md` file as MDX; `docusaurus.config.js` sets no `markdown.format`.

- A bare `<PLACEHOLDER>` or `{...}` in prose or a table cell breaks the build. Wrap it in backticks or put it in a code block.
- HTML comments already in pages build fine; don't add new ones.

## Frontmatter

```yaml
---
title: "DIAL Log Parser configuration"
sidebar_label: "Configuration"   # optional; only some pages have it
type: reference
persona: devops
component: platform
last_verified: 2026-11-08
owner: "@dial-docs-team"
---
```

`npm run lint:frontmatter` (`scripts/check-frontmatter.mts`) accepts these values:

| Field | Accepted values |
|---|---|
| `type` | `tutorial`, `how-to`, `reference`, `explanation`, `landing` |
| `persona` | `app-dev`, `devops`, `admin`, `evaluator`, `architect`, `end-user`, `all` |
| `component` | `core`, `chat`, `admin`, `sdk`, `adapters`, `helm`, `platform`, `rag` |
| `last_verified` | ISO date; older than 180 days is a warning |
| `owner` | in use: `"@dial-docs-team"`, `"@dial-core-team"`, `"@dial-chat-team"`, `"@dial-adapters-team"` |

Many existing pages use values outside this list, such as `component: apps` and `type: user-guide`, so the linter already reports errors before any sync. Never change those values in a sync; the errors predate it. A new page copies the frontmatter of a sibling page and sets its own `title`, `type`, and `last_verified`.

## Add, remove, or rename a page

Add or remove a page only when the `docs-services-release-sync:change-triage` skill allows it.

1. **Add.** Take the number of the menu slot. Rename every later sibling in that directory (files and folders) to the next number. Fix every relative link that spells out a renamed file (`grep -rn '<old-file-name>' docs_v2`). Add the sidebar entry. Add no redirect.
2. **Remove.** Delete the page and its sidebar entry. Leave the numeric gap. Fix or remove every link to it (`grep -rn '<file-name>' docs_v2`). Add no redirect.
3. **Rename.** Avoid it. If unavoidable, it is a remove and an add.

Plain `mv` and `rm` are enough; `git add` picks up the change when you commit.

## Find where a service is mentioned

```bash
grep -rln -i --include='*.md' -e 'DIAL <SERVICE NAME>' -e 'epam/<REPO>' -e '7.services/<N>.<service>/' \
  docs_v2/2.understand-dial docs_v2/3.connecting-to-dial docs_v2/4.building-with-dial docs_v2/5.operating-dial docs_v2/7.services
```

Search again for every renamed or removed setting, endpoint, and feature name; the old names find the stale text. The usual places that mention a service:

- the Services landing table, `docs_v2/7.services/0.index.md`;
- the glossary, `docs_v2/2.understand-dial/2.foundations/2.glossary.md`;
- `docs_v2/2.understand-dial/4.architecture/1.architecture-highlights.md` and `9.dial-stack.md`;
- the capability pages in `docs_v2/2.understand-dial/3.capabilities/`;
- the installation guides in `docs_v2/5.operating-dial/2.cloud-deployment/` and `3.model-deployment/`;
- the observability and production-readiness pages in `docs_v2/5.operating-dial/`;
- other services' dependency tables and configuration pages, and the Helm pages in `docs_v2/7.services/12.helm/`.
