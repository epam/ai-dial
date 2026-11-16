# Branch Guide — `feature/doc_improvements`

A working map of this branch: how to control what the docs site shows, what the
`docs_v2/` tree is for, what each script in `scripts/` does (and which ones were
removed now that the migration is complete), and what lives in `docs-planning/`.

This is the **documentation/meta repository** for AI DIAL — the Docusaurus 3 site is
rooted at the repo root (`docusaurus.config.js`, `sidebars-v2.js`, `package.json`,
`docs.config.js` are all top-level).

---

## 1. Configuring what the site shows (sections)

[`docs.config.js`](./docs.config.js) (repo root) is read by both `docusaurus.config.js`
(home page redirects) and `sidebars-v2.js` (which sections appear in the menu).

There is one knob, with a committed in-file default and a matching env var that
overrides it (**env always wins**):

| Knob | In-file default | Env var | Values |
|---|---|---|---|
| Which sections | `DEFAULT_SECTIONS = 'all'` | `DOCS_V2_SECTIONS` | `all` \| comma-separated section keys |

### Home page

`docs_v2/1.overview.md` has `slug: /`, so the Overview page is the site home at `/`. An
inline redirect plugin (`docusaurus.config.js` → `src/components/RootRedirect.js`,
routes and target from `ROOT_REDIRECT` in `docs.config.js`) sends `/v2` and
`/v2/overview`, the home URLs from before the docs moved to `/`, to `/`. Other
`/v2/...` URLs are not redirected.

### `DOCS_V2_SECTIONS` — which sections show in the sidebar

Comma-separated **section keys** (catalog in `V2_SECTIONS` in `docs.config.js`):

```
overview, understand-dial, building-with-dial, operating-dial,
administering-dial, services, chat-user-guide, use-cases, demos
```

Hiding a section removes it from the **menu only** — its pages still build and stay
reachable, so cross-links don't break. Hiding `overview` removes its menu entry; the
page still owns `/`. A mistyped key prints a warning (it won't silently drop a real
section).

> Do **not** trim the `V2_SECTIONS` catalog to hide sections — that's reference data.
> Use `DEFAULT_SECTIONS` / `DOCS_V2_SECTIONS` instead.

### How to change it

For a **committed** change affecting every build (including production), edit
`DEFAULT_SECTIONS` near the top of `docs.config.js`. For **one-off / local**
experiments, set the env var:

```bash
# Defaults (all sections):
npm run start

# Sidebar shows just two sections:
DOCS_V2_SECTIONS="overview,building-with-dial" npm run start
```

---

## 2. Role of `docs_v2/`

All documentation lives in `docs_v2/`, served at `/` by the
`@docusaurus/plugin-content-docs` instance with `id: v2` (the id and folder name are
historical; the classic preset's own docs instance is off). The legacy `docs/` site,
its `sidebars.js`, and the Quarto notebook rendering it used were removed; legacy URLs
return 404. Page ids in `sidebars-v2.js` are relative to `docs_v2/`
(e.g. `building-with-dial/apps/index`).

**Link conventions** (`onBrokenLinks`, `onBrokenAnchors`, `onBrokenMarkdownLinks`,
`onBrokenMarkdownImages` are all `throw` — a broken link fails the build):

- Internal doc-to-doc links use a **relative path ending in `.md`**, including the
  numeric file prefix (e.g. `](../apps/0.index.md)`, `](./3.prompts.md#variables)`).
  Never use an absolute root path (e.g. `/building-with-dial/...` or `/v2/...`).
- Never link to legacy `docs.dialx.ai` URLs (such as `/platform/...`) or to folders
  removed from this repo (`docs/`, `dial-cookbook/`, `dial-docker-compose*/`); they
  return 404. Link to the `docs_v2/` page instead.
- Index docs use a `0.index.md` filename (the numeric prefix prevents folder-collapsing).

---

## 3. The `scripts/` folder

Run via the npm scripts in `package.json` (all use `npx tsx`).

### Active scripts

| Script | npm script(s) | What it does |
|---|---|---|
| `check-references.ts` | `check:references`, `check:references:strict` | Scans `docs_v2/` for pinned PyPI/npm versions in sample code, crawls referenced GitHub sample repos, and writes `outdated_references.json`. `--strict` exits 1 on any outdated reference. |
| `references-shared.ts` | — (imported by the two reference scripts) | Shared types/helpers: resolves pinned versions against PyPI/npm and applies the freshness rule. |
| `render-outdated-references.ts` | `references:render-md` | Renders `outdated_references.json` into a human-readable `outdated_references.md`. Rendering only, no network. |
| `check-frontmatter.mts` | `lint:frontmatter`, `:strict`, `:fix` | Validates YAML frontmatter in every Markdown file under `docs_v2/` against the Style Guide. `--fix` inserts stub frontmatter. |

### Removed: obsolete progress-tracking scripts

Progress tracking existed to monitor the OLD → NEW migration. **All NEW docs are now
complete per the original plan, so progress tracking is obsolete** and the machinery was
removed. The build never depended on it.

Removed scripts:

- `scripts/sync-tracking.ts` — generated/updated `tracking.json` + `progress.md` from the sidebar + structure doc
- `scripts/validate-tracking-records.ts` — validated `tracking.json`
- `scripts/render-progress-table.ts` — rendered `tracking.json` into `docs_v2/progress.md`
- `scripts/upsert-remove-tracking-record.ts` — upsert/remove a single tracking record
- `scripts/tracking-shared.ts` — shared types/helpers for the four above

Removed npm scripts from `package.json`: `tracking:validate`, `tracking:sync`,
`tracking:progress`.

Removed data/artifacts: `docs-planning/tracking.json`, `docs-planning/tracking.schema.json`,
and the auto-generated `docs_v2/progress.md` page (and its hidden sidebar stub in
`sidebars-v2.js`).

---

## 4. Role of `docs-planning/`

The non-shipped working documents that **govern** the docs-improvement initiative. These
are planning/reference material — they are not part of the published site.

| File | Purpose |
|---|---|
| `gap-analysis.md` | 25 evidenced gaps in the current site, ranked by severity, with full URLs. |
| `improvement-roadmap.md` | Four-phase action plan (Foundation → Stop the bleeding → Depth and differentiation → Sustainability). |
| `recommended-site-structure.md` | Target information architecture with a page-by-page migration map from current state. |
| `style-guide.md` | Diátaxis-based writing rules, terminology, voice/tone per content type, review process. |
| `glossary.md` | Terminology glossary — use it for consistency. |
| `repositories.md` | Full list of DIAL component repositories. |
| `release-strategy-adr.md` | ADR on how/when to graduate the NEW docs to production. (References the old `tracking.json`/`progress.md` flow as historical record.) |

> Note: the former `tracking.json` and `tracking.schema.json` in this folder were removed
> along with the progress-tracking scripts (see §3).
