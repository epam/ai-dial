# Branch Guide — `feature/doc_improvements`

A working map of this branch: how to control what the docs site shows, what the
`docs/` and `docs_v2/` trees are for, what each script in `scripts/` does (and which
ones were removed now that the migration is complete), and what lives in
`docs-planning/`.

This is the **documentation/meta repository** for AI DIAL — the Docusaurus 3 site is
rooted at the repo root (`docusaurus.config.js`, `sidebars.js`, `sidebars-v2.js`,
`package.json`, `docs.config.js` are all top-level, **not** inside `docs/`).

---

## 1. Configuring what the branch shows (OLD/NEW docs + sections)

[`docs.config.js`](./docs.config.js) (repo root) is the **single source of truth** for
build-time visibility. It is read by both `docusaurus.config.js` (which doc sets get
built/served) and `sidebars-v2.js` (which NEW sections appear in the menu).

There are two knobs. Each has a committed in-file default and a matching env var that
overrides it (**env always wins**):

| Knob | In-file default | Env var | Values |
|---|---|---|---|
| Which doc sets | `DEFAULT_VARIANT = 'both'` | `DOCS_VARIANT` | `both` \| `old` \| `new` |
| Which NEW sections | `DEFAULT_SECTIONS = 'all'` | `DOCS_V2_SECTIONS` | `all` \| comma-separated section keys |

**Committed default on this branch: `both` + `all`** — OLD and NEW are both served, and
every NEW section shows in the sidebar.

### `DOCS_VARIANT` — which doc sets

- `both` (default) — OLD served at `/`, NEW served at `/v2`. The navbar OLD/NEW switcher
  appears only in this mode.
- `old` — only `docs/`, served at `/`.
- `new` — only `docs_v2/`, served at `/` (the sole shown set owns the root).

The NEW instance has no page of its own at its root. An inline redirect plugin
(`docusaurus.config.js` → `src/components/RootRedirect.js`, target computed as
`NEW_ROOT_REDIRECT` in `docs.config.js`) sends the NEW root to the **first visible
section's landing page** (catalog order, per each section's `landing` in `V2_SECTIONS`).
So hiding the Home section just moves the landing to the next visible section.

### `DOCS_V2_SECTIONS` — which NEW sections show in the sidebar

Comma-separated **section keys** (catalog in `V2_SECTIONS` in `docs.config.js`):

```
home, understand-dial, building-with-dial, operating-dial,
administering-dial, chat-user-guide, reference, use-cases, demos
```

Hiding a section removes it from the **menu only** — its pages still build and stay
reachable, so cross-links don't break. A mistyped key prints a warning (it won't
silently drop a real section).

> Do **not** trim the `V2_SECTIONS` catalog to hide sections — that's reference data.
> Use `DEFAULT_SECTIONS` / `DOCS_V2_SECTIONS` instead.

### How to change it

For a **committed** change affecting every build (including production), edit the two
`DEFAULT_*` constants near the top of `docs.config.js`. For **one-off / local**
experiments, set the env vars:

```bash
# Defaults (both sets, all sections) — what this branch ships:
npm run start

# NEW only, served at /:
DOCS_VARIANT=new npm run build

# NEW sidebar shows just two sections:
DOCS_V2_SECTIONS="home,building-with-dial" npm run start
```

---

## 2. Role of `docs/` (OLD) and `docs_v2/` (NEW)

OLD and NEW are **two separate Docusaurus instances** — physically and structurally
distinct:

| | OLD (legacy, being phased out) | NEW (restructured) |
|---|---|---|
| Content folder | `docs/` | `docs_v2/` |
| Sidebar file | `sidebars.js` (`CustomSideBar`) | `sidebars-v2.js` (`v2Sidebar`) |
| Served at | `/` | `/v2` (in `both` mode) |
| Plugin | classic preset | second `@docusaurus/plugin-content-docs` instance (`id: v2`) |

**All new documentation goes into `docs_v2/`. Never add content to `docs/`.** When
migrating an OLD page, move/rewrite it into the right place under `docs_v2/` per the
recommended site structure. Page ids in `sidebars-v2.js` are relative to `docs_v2/`
(e.g. `building-with-dial/apps/index` — no `docs/NEW/` prefix).

**Link conventions** (`onBrokenLinks`, `onBrokenAnchors`, `onBrokenMarkdownLinks`,
`onBrokenMarkdownImages` are all `throw` — a broken link fails the build):

- Internal doc-to-doc links use a **relative path ending in `.md`**, including the
  numeric file prefix (e.g. `](../apps/0.index.md)`, `](./3.prompts.md#variables)`).
  Never use an absolute root path (`/v2/...` or `/platform/...`).
- Keep the NEW tree **self-contained** — `docs_v2/` pages link to other `docs_v2/`
  pages, not into OLD `docs/`. Cross-instance links can't be relative `.md` links.
- Index docs use a `0.index.md` filename (the numeric prefix prevents folder-collapsing).

---

## 3. The `scripts/` folder

Run via the npm scripts in `package.json` (all use `npx tsx`).

### Active scripts

| Script | npm script(s) | What it does |
|---|---|---|
| `build-changelog.ts` | `changelog:build` (also run by `start` / `build`) | Generates the on-site Changelog pages under `docs_v2/7.reference/changelog/` from `docs/releases/`. Idempotent, no network. |
| `check-references.ts` | `check:references`, `check:references:strict` | Scans `docs_v2/` for pinned PyPI/npm versions in sample code, crawls referenced GitHub sample repos, and writes `outdated_references.json`. `--strict` exits 1 on any outdated reference. |
| `references-shared.ts` | — (imported by the two reference scripts) | Shared types/helpers: resolves pinned versions against PyPI/npm and applies the freshness rule. |
| `render-outdated-references.ts` | `references:render-md` | Renders `outdated_references.json` into a human-readable `outdated_references.md`. Rendering only, no network. |
| `check-frontmatter.mts` | `lint:frontmatter`, `:strict`, `:fix` | Validates YAML frontmatter in every Markdown file under `docs/` and `docs_v2/` against the Style Guide. `--fix` inserts stub frontmatter. |

### Removed: obsolete progress-tracking scripts

Progress tracking existed to monitor the OLD → NEW migration. **All NEW docs are now
complete per the original plan, so progress tracking is obsolete** and the machinery was
removed. The build never depended on it (`build` / `start` only call `changelog:build`).

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
