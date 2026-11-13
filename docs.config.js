// @ts-check
/**
 * Build-time config for the docs site.
 *
 * Shared by `docusaurus.config.js` (home page redirects) and `sidebars-v2.js`
 * (which top-level sections appear in the menu).
 *
 * TO CHANGE WHICH SECTIONS SHOW, edit DEFAULT_SECTIONS just below, OR set the
 * matching env var at build time (env always wins over the in-file value):
 *   DOCS_V2_SECTIONS=all|key,key,...     (default: DEFAULT_SECTIONS)
 *
 * The in-file default is COMMITTED and affects every build (incl. production).
 * For one-off / local experiments, prefer the env var, e.g.:
 *   DOCS_V2_SECTIONS=building-with-dial npm run start
 *
 * Do NOT trim the V2_SECTIONS catalog to hide sections — that's the wrong knob.
 * Use DEFAULT_SECTIONS / DOCS_V2_SECTIONS instead.
 */

// ===== EDIT HERE: in-file default (the env var overrides it) ================
/**
 * Which sections show in the sidebar: 'all', or a comma-separated list of
 * section keys (see V2_SECTIONS below), e.g. 'building-with-dial' or
 * 'overview,building-with-dial'.
 */
const DEFAULT_SECTIONS = 'all';
// ============================================================================

// ---- Top-level sections CATALOG (reference data — do not subset to hide;
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
// The Overview doc (docs_v2/1.overview.md, `slug: /`) is the home page at '/'.
// Its earlier URLs, '/v2' and '/v2/overview' (published while the docs lived
// under '/v2'), redirect to it. Hiding the Overview entry with DOCS_V2_SECTIONS
// removes it from the menu only; the page still owns '/'.
export const ROOT_REDIRECT = { from: ['/v2', '/v2/overview'], to: '/' };
