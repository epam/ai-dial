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
const DEFAULT_VARIANT = 'new';
/**
 * Which NEW sections show in the sidebar: 'all', or a comma-separated list of
 * section keys (see V2_SECTIONS below), e.g. 'building-with-dial' or
 * 'overview,building-with-dial'.
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
//      keys/labels must match the top-level item labels in sidebars-v2.js —
//      categories, plus the Overview doc) ----
export const V2_SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'understand-dial', label: 'Understand DIAL' },
  { key: 'building-with-dial', label: 'Building with DIAL' },
  { key: 'operating-dial', label: 'Operating DIAL' },
  { key: 'administering-dial', label: 'Administering DIAL' },
  { key: 'services', label: 'Services' },
  { key: 'chat-user-guide', label: 'Chat User Guide' },
  { key: 'use-cases', label: 'Use Cases' },
  { key: 'demos', label: 'Demos' },
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

// ---- Home page redirects ----
// The NEW Overview doc (docs_v2/1.overview.md, `slug: /`) is the home page,
// served at the NEW instance root NEW_BASE. Its earlier URLs redirect to it:
// '/v2' and '/v2/overview' (published while NEW lived at '/v2'), plus the site
// root '/' when OLD is also built (no OLD doc owns '/'; the legacy home lives at
// OLD_HOME, set by the `slug` in docs/README.md). Hiding the Overview entry with
// DOCS_V2_SECTIONS removes it from the menu only; the page still owns NEW_BASE.
// With only OLD built, '/' redirects to the legacy home.
export const OLD_HOME = '/home';
export const ROOT_REDIRECT = SHOW_NEW
  ? { from: ['/', '/v2', '/v2/overview'].filter((p) => p !== NEW_BASE), to: NEW_BASE }
  : { from: ['/'], to: OLD_HOME };
