// @ts-check
/**
 * Build-time visibility config for the docs site.
 *
 * Single source of truth shared by `docusaurus.config.js` (which docs sets are
 * built/served) and `sidebars-v2.js` (which NEW sections appear in the menu).
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ TO CHANGE WHAT SHOWS, edit the two DEFAULT_* knobs just below, OR set the │
 * │ matching env var at build time (env always wins over the in-file value):  │
 * │   DOCS_VARIANT=both|old|new            (default: DEFAULT_VARIANT)          │
 * │   DOCS_V2_SECTIONS=all|key,key,...     (default: DEFAULT_SECTIONS)         │
 * │                                                                           │
 * │ In-file defaults are COMMITTED and affect every build (incl. production). │
 * │ For one-off / local experiments, prefer the env vars, e.g.:               │
 * │   DOCS_VARIANT=new DOCS_V2_SECTIONS=building-with-dial npm run start       │
 * │                                                                           │
 * │ Do NOT trim the V2_SECTIONS catalog to hide sections — that's the wrong   │
 * │ knob. Use DEFAULT_SECTIONS / DOCS_V2_SECTIONS instead.                     │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// ===== EDIT HERE: in-file defaults (env vars override these) ================
/** Which docs sets to build/serve: 'both' | 'old' | 'new'. */
const DEFAULT_VARIANT = 'both';
/**
 * Which NEW sections show in the sidebar: 'all', or a comma-separated list of
 * section keys (see V2_SECTIONS below), e.g. 'building-with-dial' or
 * 'home,building-with-dial'.
 */
const DEFAULT_SECTIONS = 'all';
// ============================================================================

// ---- Which docs sets: 'both' | 'old' | 'new' ----
export const DOCS_VARIANT = (process.env.DOCS_VARIANT || DEFAULT_VARIANT).trim();
export const SHOW_OLD = DOCS_VARIANT !== 'new';
export const SHOW_NEW = DOCS_VARIANT !== 'old';

// Route bases. OLD owns '/'; NEW lives at '/v2' only when OLD is also shown,
// otherwise the sole shown set owns the site root.
export const OLD_BASE = '/';
export const NEW_BASE = SHOW_OLD ? '/v2' : '/';

// ---- NEW top-level sections CATALOG (reference data — do not subset to hide;
//      keys/labels must match the top-level category labels in sidebars-v2.js) ----
// `landing` is the in-instance route of each section's first page (no leading
// slash, no instance base). Used to point the instance root at the first
// visible section. Verify against the sitemap if a section's first page moves.
export const V2_SECTIONS = [
  { key: 'home', label: 'Home', landing: 'home/index' },
  { key: 'understand-dial', label: 'Understand DIAL', landing: 'understand-dial/positioning/what-is-dial' },
  { key: 'building-with-dial', label: 'Building with DIAL', landing: 'building-with-dial/index' },
  { key: 'operating-dial', label: 'Operating DIAL', landing: 'operating-dial/local-setup/index' },
  { key: 'administering-dial', label: 'Administering DIAL', landing: 'administering-dial/index' },
  { key: 'chat-user-guide', label: 'Chat User Guide', landing: 'chat-user-guide/index' },
  { key: 'reference', label: 'Reference', landing: 'reference' },
  { key: 'use-cases', label: 'Use Cases', landing: 'use-cases/index' },
  { key: 'demos', label: 'Demos', landing: 'demos/index' },
];

const ALL_KEYS = V2_SECTIONS.map((s) => s.key);

// ---- Resolve the selected sections (env overrides the in-file default) ----
const sectionsRaw = (process.env.DOCS_V2_SECTIONS || DEFAULT_SECTIONS).trim();
export const V2_SECTION_KEYS =
  sectionsRaw === '' || sectionsRaw === 'all'
    ? ALL_KEYS
    : sectionsRaw.split(',').map((s) => s.trim()).filter(Boolean);

// Warn on typos so a mistyped key doesn't silently drop a real section.
const unknown = V2_SECTION_KEYS.filter((k) => !ALL_KEYS.includes(k));
if (unknown.length) {
  console.warn(
    `[docs.config] Unknown DOCS_V2_SECTIONS key(s): ${unknown.join(', ')}. ` +
    `Valid keys: ${ALL_KEYS.join(', ')}.`,
  );
}

// ---- Instance-root redirect ----
// The NEW instance has no doc at its root (no page uses `slug: /`). Point the
// root at the FIRST VISIBLE section's landing page (catalog order). This keeps
// the landing meaningful — and always inside the sidebar — regardless of which
// sections are hidden. Null when NEW isn't built.
const joinUrl = (base, p) => (base === '/' ? `/${p}` : `${base}/${p}`);
const firstVisible = V2_SECTIONS.find((s) => V2_SECTION_KEYS.includes(s.key));
export const NEW_ROOT_REDIRECT =
  SHOW_NEW && firstVisible
    ? { from: NEW_BASE, to: joinUrl(NEW_BASE, firstVisible.landing) }
    : null;
