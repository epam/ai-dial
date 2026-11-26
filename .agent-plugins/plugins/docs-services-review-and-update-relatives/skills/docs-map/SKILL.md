---
name: docs-map
description: Use when working in the epam/ai-dial documentation repository during a guide alignment run and you need to know which docs_v2 paths may be edited, how numeric prefixes follow sidebars-v2.js, how to write a relative link or an anchor, which frontmatter values exist and must not change, what breaks the MDX build, or how to find every page that mentions a topic.
---

# Docs map for a guide alignment

The site is Docusaurus 3, rooted at the repository root and published to https://docs.dialx.ai/. All content is in `docs_v2/`, served at `/`. The menu is `sidebars-v2.js`. Every `.md` file is parsed as MDX.

## Sections and what this task may do

| Path | Menu | In an alignment run |
|---|---|---|
| `docs_v2/1.overview.md` | Overview, the site home (`slug: /`) | never edit; report a stale sentence |
| `docs_v2/2.understand-dial/` | Understand DIAL | **edit** |
| `docs_v2/3.connecting-to-dial/` | Connecting to DIAL | **edit** |
| `docs_v2/4.building-with-dial/` | Building with DIAL | **edit** |
| `docs_v2/5.operating-dial/` | Operating DIAL | **edit** |
| `docs_v2/6.administering-dial-new/` | Administering DIAL (the Admin user guide) | source; never edit; the `admin-guide-sync` skill owns it |
| `docs_v2/7.services/` | Services | source; never edit; the service sync owns it |
| `docs_v2/8.chat-user-guide/` | Chat User Guide | source; never edit; the `chat-guide-sync` skill owns it |
| `docs_v2/9.demos/` | Demos | source; never edit |
| `docs/releases/<N>/` | not served | source; read with `git show <BASE>:docs/releases/<N>/<FILE>` |
| `sidebars-v2.js` | the menu | only if a page is added, removed, or renamed, which this task doesn't do |

Never edit `package.json`, `package-lock.json`, `docusaurus.config.js`, `docs.config.js`, `src/`, `static/`, `scripts/`, `dial-samples/`, `outdated_references.*`, `CLAUDE.md`, `.claude/`, or `.github/`.

## Numbering and routes

- A file's or folder's `N.` prefix equals its position in `sidebars-v2.js`, counted per parent directory; files and folders share one sequence. `0.index.md` is the folder's landing.
- Docusaurus strips every prefix from the route id: `docs_v2/5.operating-dial/6.observability/1.tracing.md` is `operating-dial/observability/tracing`.
- Gaps stay as they are: `4.building-with-dial/` has no `6.`, and `5.operating-dial/` has no `4.`.
- `img/` folders and the images in them are not numbered.

This task adds, removes, and renames no page. If a fix would need that, `flag` it.

## Links and anchors

- Internal links are relative and end in `.md`, with the numeric prefixes: `](../../7.services/1.core/1.configuration/14.global-settings.md#spending-limits)`, `](./3.public-and-private-access.md)`.
- Never use absolute paths (`/services/...`), `https://docs.dialx.ai/...` URLs, or links into `docs/`. Release documents are linked on GitHub, as the upgrade page does: `https://github.com/epam/ai-dial/tree/main/docs/releases`.
- Some pages use extension-less route links, such as `](jwt)`. They build; leave them, and write new links with `.md`.
- Anchors are Docusaurus slugs: lowercase, backticks and punctuation dropped, spaces become hyphens. `## Sharing and org units` is `#sharing-and-org-units`; a repeated heading gets `-1`, `-2`.
- Before you link an anchor, open the target and confirm the heading exists at `<BASE>`.
- `onBrokenLinks`, `onBrokenAnchors`, `onBrokenMarkdownLinks`, and `onBrokenMarkdownImages` are all `throw`: one broken link fails the build.

## MDX hazards

- A bare `<PLACEHOLDER>` or `{...}` in prose or a table cell breaks the build. Put it in backticks or a code block.
- HTML comments that pages already have build fine; add none.

## Frontmatter

```yaml
---
title: "Control cost"
type: how-to
persona: devops
component: core
last_verified: 2026-06-03
owner: "@dial-docs-team"
---
```

An alignment run changes no frontmatter field, `last_verified` included. The repository's own rule (`docs-page-writer`) sets `last_verified` to today only when every example and link on the page was verified, and this task checks only the statements a change touched. The one exception is a run whose options include `set last_verified`.

`npm run lint:frontmatter` accepts these values: `type` tutorial, how-to, reference, explanation, landing; `persona` app-dev, devops, admin, evaluator, architect, end-user, all; `component` core, chat, admin, sdk, adapters, helm, platform, rag. In the four sections, 42 pages use other `component` values: `integrations` (16), `apps` (14), `deployment` (5), `interceptors-sdk` (3), `openai` (2), `vertexai` (1), `bedrock` (1). They predate this task; never change them.

## Find every mention of a topic

```bash
grep -rn -i --include='*.md' -e '<NAME>' -e '<identifier>' docs_v2/2.understand-dial docs_v2/3.connecting-to-dial docs_v2/4.building-with-dial docs_v2/5.operating-dial
grep -rn --include='*.md' '<file-name>.md' docs_v2/2.understand-dial docs_v2/3.connecting-to-dial docs_v2/4.building-with-dial docs_v2/5.operating-dial
```

Write the four paths out: zsh doesn't split a variable that holds them into words. Search for every old name of a renamed thing: the old name finds the stale text. Search for the page's file name to find every link to it.
