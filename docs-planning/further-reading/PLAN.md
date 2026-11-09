# docs_v2 entry page and closing-links restructure — Implementation Plan

> **For agentic workers:** execute the tasks in order, one at a time. Steps use checkbox (`- [ ]`) syntax. Do **not** commit or push (see Global constraints). Stop at every **STOP** marker and report to the user.

**Goal:** (1) replace the `Home` section with a single top-level entry page; (2) remove every `Next steps` / `Where to go next` block, and merge the other "Related …" blocks, so each page ends with at most one `Further reading` block; (3) give every non-index page that has at least 2 relevant docs a `Further reading` block of 2–6 links that are relevant to what the page covers. `0.index.md` pages get no closing block.

**Approach:** task 1 is a hand edit of 5 files. The closing-block change touches all 374 docs_v2 pages, so a one-off Python tool (`apply_blocks.py`) does it. The tool is driven by reviewed data: `map.txt` (page → ordered links), `desc.tsv` (descriptions) and `labels.tsv` (link text for ambiguous titles). Afterwards two checkers prove the result: `verify_blocks.py` checks the rules (V1–V9) and `check_bodies.py` proves nothing above the closing block changed. Relevance, the part that matters most, is judged in task 2, before any page is written, against an explicit rubric (R1–R5).

**Tech stack:** Docusaurus 3.9.2 (two docs instances); Markdown; Python 3 standard library only (always `python3 -I`); Node, using the existing local `tsx` and `docusaurus` binaries.

**Spec:** the user's request (decisions below); repo rules in `CLAUDE.md`; writing rules in `docs-planning/style-guide.md`.

## Global constraints

These bind every task and every reviewer.

- **Approval first.** CLAUDE.md requires explicit approval before any file is created or edited. Before task 1, show the user the task list and the "Files" lists below and wait for a go-ahead. That go-ahead covers only the edits listed in this plan. Anything else needs a new proposal.
- **No version control actions.** No `git commit`, `push`, `add`, `mv`, `stash`, `checkout`, `restore`, and no branch changes. Use plain `mv`/`rmdir` for the rename. Read-only git (`status`, `diff`, `show`, `log`) is fine.
- **No package changes.** No `npm install` / `ci` / `update`; do not touch `package.json` / `package-lock.json`. A dependency failure is a finding to report.
- **No redirects.** Add none; the user declined one for `/v2/home/index`. Leave the existing `'home/architect-overview'` entry in `docusaurus.config.js` untouched.
- **Scope.** Only `docs_v2/` plus the files named in tasks 1, 4 and 6. Do not edit OLD `docs/`, `dial-cookbook/`, `dial-sdk`, the untracked scratch files in the repo root, `landing-docs/`, or `.claude/settings.local.json`.
- **Front matter stays as it is** on every page (`title`, `type`, `persona`, `component`, `last_verified`, `owner`). In particular, do not bump `last_verified`: it means every example and link on the page was re-verified, and this work does not do that.
- **Link format** for every new or rewritten link: a relative path ending in `.md`, numeric prefixes included, written `./x.md`, `./sub/x.md` or `../x.md`, optionally with `#anchor`. Never `/v2/...`, never an extension-less route. Keep `docs_v2/` self-contained: no links into OLD `docs/`.
- **Terminology:** `DIAL` in capitals; `Toolset`/`Toolsets` as one word; never introduce *Assistant* or *Addon*.
- **No fabrication.** Every link must pass rubric R1–R4. Every description must be true of the target page, so read the target's title and H2s before writing one.
- **Never run `npm run build`.** It starts with `quarto`, which is not installed here, so it exits 127. Use the commands in task 7. A build also rewrites the shared `.docusaurus/` folder, which breaks a running dev server; restart it afterwards.
- Shell output here can be collapsed or garbled. `Read` the exact lines before editing a file, and trust the checker scripts over a compressed `diff`.

## User decisions (already made — do not re-ask)

1. Drop the `Home` folder. Its overview page becomes a top-level page, and its **sidebar name stays "Overview"**.
2. Remove every `Next steps` / `Where to go next` block on all pages; keep only `Further reading`.
3. On every `0.index.md`, delete **both** `Next steps` and `Further reading`, because the overview already links to related docs.
4. Add `Further reading` to non-index pages that have **2+ relevant docs**, with a **maximum of 6 links**. Relevance to what the page covers is the top priority.
5. `Related tasks` (41 pages), `Related troubleshooting` (1) and `Related pages` (1) are **merged into `Further reading`**: their links are candidates, and the blocks themselves disappear.
6. **No redirect** for the old `/v2/home/index` URL.
7. **Update the writing rules** (style guide, docs-page-writer skill and its 4 templates, docs-auditor skill, CLAUDE.md) so new pages follow the new convention.

Open point for the final report, not a blocker: the entry page's front-matter title and H1 stay "Get Started with DIAL" (decision 1 named only the sidebar entry). Tell the user and let them decide.

## Measured facts (baseline, before any change)

| Fact | Value |
|---|---|
| docs_v2 Markdown pages, excluding generated `8.reference/changelog/` | 374: 81 `0.index.md` (the Home page is one of them) and 293 others |
| Pages with `## Next steps` | 367. Seven pages have none: four have only `Related tasks`, one only `Related pages`, one only `Further reading`, one only `Where to go next` |
| Pages with `## Further reading` | 118: 80 index and 38 others. One has 7 links (`2.understand-dial/3.capabilities/6.tools-and-enterprise-data.md`) |
| Pages with `## Related tasks` / `Related pages` / `Related troubleshooting` / `Where to go next` | 41 / 1 / 1 / 1 |
| Where the closing blocks sit | Always at the end of the file: on all 374 pages, only closing blocks follow the first closing heading. `apply_blocks.py` re-checks this and aborts otherwise |
| Old links with an anchor (for example `2.agents.md#build-a-quick-app`) | 54. The tool keeps the anchor when it reuses such a link |
| Relative links in the Home page | 119 `](../` links (3 of them in its `Where to go next` block) and 1 `](#documentation-directory)` |
| Generated `8.reference/changelog/index.md` | Has `## Further reading` + `## Next steps`, emitted by `scripts/build-changelog.ts`: comment on line 327, `const outro` on lines 328–338, `return` on line 340. The generator deletes and rewrites the whole folder on every run (line 379) |
| Anchors pointing at the removed headings (`#next-steps`, …) | None, so `onBrokenAnchors: throw` is safe |
| Pre-existing route-style links without `.md` (out of scope) | 125 links in 31 files, mostly in `4.operating-dial/6.observability/*` and `4.operating-dial/5.auth-and-access-control/4.sso-idp/*`. Those inside closing blocks are rewritten to `.md` form by the tool |
| `verify_blocks.py` on the current tree | `violations: 613` |

The draft result was rehearsed end to end on a scratch copy: task 1, task 3 with placeholder descriptions, task 4, then both checkers, giving `violations: 0` and `differences: 0`. It puts `Further reading` on 293 pages. Block sizes: 4 pages with 2 links, 46 with 3, 83 with 4, 61 with 5, 99 with 6. That is 1,377 links in total, 26 of them external. **504 links still need a description** (listed in `missing.tsv`); 11 are already seeded in `desc.tsv`.

## Relevance rubric (R1–R5) — used in task 2 and in review

A link stays only if **all** of R1–R4 hold. R5 decides the order.

- **R1 Topic anchor.** The target covers a concept, component, setting, API or task that *this page itself* explains or uses. You can point at the sentence, heading, table row or code sample on the current page that the target extends. "Same folder" or "same product" alone fails.
- **R2 Direction of value.** After reading this page, the target *deepens, applies or looks up* what was just read:
  - explanation → the how-to or reference that applies it, or a deeper explanation;
  - how-to → the reference for the settings used, the concept behind it, or a sibling how-to in the same task family;
  - tutorial → the concept behind it, the reference for what it used, or the next tutorial in level;
  - reference → a how-to that uses it, a sibling reference, or the concept;
  - user guide → neighbouring user-guide pages, or the admin/developer page that governs the feature.
- **R3 Not navigation.** Not the page itself, not a duplicate, and not the page's own folder hub (the `0.index.md` in the same directory, which the breadcrumbs and sidebar already cover). Not a generated changelog sub-page (`changelog/release-notes-*`, `changelog/upgrade-to-*`); `changelog/index.md` is allowed.
- **R4 Not a bare next action.** An action link unrelated to the page's subject fails, for example "Local setup" at the end of an architecture page.
- **R5 Order.** Closest peer (same task, or next in a series) first; then the reference or configuration for what the page used; then the concept page; then broader hubs. External links go last.

**Count:** 2–6 links, at least 2 of them internal. If fewer than 2 pass, **omit the block**, remove the page from `map.txt`, and record it in `skipped.md` with its path and a one-line reason. Never pad to reach 2.

**Descriptions.** Format: `- [Link text](./x.md) — description`, one line per bullet.
- A reused link keeps its old description unless `desc.tsv` overrides it.
- New descriptions: at most 14 words; start lower-case unless a proper noun; no trailing period.
- Say what the reader gets from the **target**, and do not repeat the link text.
- Never use *next / now / continue / start here / this page / this guide / this tutorial*.

**Link text.**
- A reused link keeps its old link text.
- A new link uses the target's front-matter `title`.
- When either would be a title shared by several docs_v2 pages (for example "Models", "Toolsets", "Configuration"), the label from `labels.tsv` is used instead (for example "DIAL Admin: Models" or "DIAL Core configuration: Models"). `labels.tsv` already covers all 42 such pages.
- A 4th column in `desc.tsv` overrides the link text of a single link.

## File structure

**Planning artefacts.** These are saved to `docs-planning/further-reading/` in task 0 (with the user's approval). Docusaurus never publishes them.

| File | Role |
|---|---|
| `PLAN.md` | this document |
| `map.txt` | the proposed links: `page-id => target; target; …`, 2–6 per page, in display order. A target is a route id, a route id with a `+` prefix (informational: "not in the page's old blocks"), or `EXT:<substring>` (keep the old external link whose URL contains it) |
| `desc.tsv` | `page-id TAB target-id TAB description [TAB link text]`. It overrides the old description and, with a 4th column, the link text. Seeded with 11 rows from the plan review |
| `labels.tsv` | `target-id TAB link text`: qualified labels for the 42 pages whose title is shared |
| `missing.tsv` | the 504 `page TAB target TAB target title TAB description` rows that still need a description |
| `apply_blocks.py` | removes all closing blocks and writes the new `Further reading`. A dry run unless `--write` is given; exit code 1 while anything is missing |
| `verify_blocks.py` | checks rules V1–V9 (listed in its docstring) |
| `check_bodies.py` | compares each page's text above the closing block with `git HEAD`; the moved overview is compared with its old path |

**Modified:**
- `docs_v2/`: all 374 pages (closing blocks) and the renamed entry page.
- Elsewhere: `sidebars-v2.js`, `docs.config.js`, `CLAUDE.md` and `BRANCH_GUIDE.md` (task 1); `scripts/build-changelog.ts` and `docs_v2/8.reference/changelog/index.md` (task 4); `docs-planning/style-guide.md`, `.claude/skills/docs-page-writer/SKILL.md` with its four `references/template-*.md`, and `.claude/skills/docs-auditor/SKILL.md` (task 6).

`page-id` / `target-id` is the Docusaurus route id: the path under `docs_v2/` without `.md` and with every numeric `N.` prefix removed. So `4.operating-dial/6.observability/1.tracing.md` becomes `operating-dial/observability/tracing`, and `…/0.index.md` becomes `…/index`.

---

### Task 0: Preflight

**Goal:** an approved scope, a recorded baseline, and tools that run in this environment.

**Files:**
- Create: `docs-planning/further-reading/{PLAN.md,map.txt,desc.tsv,labels.tsv,missing.tsv,apply_blocks.py,verify_blocks.py,check_bodies.py}`, copied from the plan author's delivery folder (only if they are not there yet).

**Acceptance criteria:**
- [ ] the user approved the scope (see Global constraints)
- [ ] `git status --short` snapshot saved; the pre-existing changes and untracked files are not yours, so do not touch them
- [ ] `verify_blocks.py` on the current tree prints `violations: 613`
- [ ] the scratch dry run prints `errors: 0   warnings: 0   missing descriptions: 504   missing labels: 0`

**Steps:**
- [ ] **Step 1:** get the approval and copy the artefacts. Run every command from the repo root.
- [ ] **Step 2: Baseline.**
  ```bash
  W=docs-planning/further-reading
  git status --short > "$TMPDIR/before.status"
  python3 -I $W/verify_blocks.py --root docs_v2 --overview 1.home/0.index.md | head -1
  ```
- [ ] **Step 3: Scratch dry run.** It proves the tool works; nothing in the repo changes.
  ```bash
  R=$(pwd); W=$R/docs-planning/further-reading; S=$(mktemp -d)
  rsync -a --include='*/' --include='*.md' --exclude='*' docs_v2/ "$S/docs_v2/"
  mv "$S/docs_v2/1.home/0.index.md" "$S/docs_v2/1.overview.md" && rmdir "$S/docs_v2/1.home"
  cd "$S" && python3 -I "$W/apply_blocks.py" --root docs_v2 --map "$W/map.txt" --desc "$W/desc.tsv" \
      --labels "$W/labels.tsv" --no-fr overview --list-missing "$S/missing.tsv"; cd "$R"
  diff "$S/missing.tsv" "$W/missing.tsv" && echo identical
  ```
  Expected: the counts above, then `identical`. Exit status 1 is expected here, because descriptions are still missing.

---

### Task 1: Replace the Home section with the top-level "Overview" page

**Goal:** `docs_v2/1.home/` disappears. The overview becomes `docs_v2/1.overview.md` with route `/v2/overview`: the first sidebar item and the `/v2` redirect target.

**Files:**
- Move: `docs_v2/1.home/0.index.md` → `docs_v2/1.overview.md`, then `rmdir docs_v2/1.home`
- Modify:
  - `docs_v2/1.overview.md`: relative links only
  - `sidebars-v2.js:5-15`
  - `docs.config.js`: lines 29, 45 and 50
  - `CLAUDE.md`: lines 77, 78, 82 and 96
  - `BRANCH_GUIDE.md`: lines 42, 49 and 74

**Why this shape:**
- The new page takes menu slot `1.`, so the top-level prefixes `2.`–`10.` stay valid (the CLAUDE.md invariant is prefix = menu position). **No renumbering.**
- `docs.config.js` derives the `/v2` redirect from the first visible `V2_SECTIONS` entry. Registering the page there keeps both the redirect and the `DOCS_V2_SECTIONS` toggle working; the sidebar filter matches `item.label`, which also works for a top-level doc.
- Tested on scratch copies of both files:
  - sidebar = `doc:overview | Understand DIAL | … | Demos`
  - `NEW_ROOT_REDIRECT = {from:'/v2', to:'/v2/overview'}`
  - `DOCS_V2_SECTIONS=overview,building-with-dial` gives two entries
  - the old key `home` now prints the existing "Unknown DOCS_V2_SECTIONS key" warning

**Acceptance criteria:**
- [ ] `ls docs_v2` shows `1.overview.md` and no `1.home`
- [ ] `grep -rn -E '1\.home|home/index|\bhome,|Home section|key: .home' docs_v2 sidebars-v2.js docs.config.js docusaurus.config.js src CLAUDE.md BRANCH_GUIDE.md` prints nothing. (Before the edits it matches `docs.config.js:29,50`, `sidebars-v2.js:11`, `CLAUDE.md:77,78,82,96` and `BRANCH_GUIDE.md:42,49,74`.) The unrelated `'home/architect-overview'` redirect does not match and stays.
- [ ] every relative link in `1.overview.md` resolves (step 2)
- [ ] the page's front matter is byte-identical to before

**Steps:**
- [ ] **Step 1: Move.** `mv docs_v2/1.home/0.index.md docs_v2/1.overview.md && rmdir docs_v2/1.home`
- [ ] **Step 2: Fix the relative links.** The page moved one level up, so every `](../` becomes `](./`. There are 119 of them, including the 3 in its `Where to go next` block, which task 3 removes. The `](#documentation-directory)` link is untouched.
  ```bash
  python3 -I - <<'EOF'
  import os, posixpath, re
  p = 'docs_v2/1.overview.md'; t = open(p, encoding='utf-8').read()
  assert t.count('](../') == 119, t.count('](../')
  t = t.replace('](../', '](./'); open(p, 'w', encoding='utf-8').write(t)
  bad = [h for h in re.findall(r'\]\((\./[^)#\s]+)', t) if not os.path.exists(posixpath.normpath(posixpath.join('docs_v2', h)))]
  print('broken:', bad)
  EOF
  ```
  Expected: `broken: []`.
- [ ] **Step 3: `sidebars-v2.js`.** Replace the whole `Home` category object (lines 5–15: the `{` that opens `"type": "category", "label": "Home"`, through its closing `},`) with:
  ```js
      {
        "type": "doc",
        "id": "overview",
        "label": "Overview"
      },
  ```
- [ ] **Step 4: `docs.config.js`.**
  - Line 50: `{ key: 'home', label: 'Home', landing: 'home/index' },` → `{ key: 'overview', label: 'Overview', landing: 'overview' },`
  - Line 29 (comment): `'home,building-with-dial'` → `'overview,building-with-dial'`
  - Line 45 (comment): `keys/labels must match the top-level category labels in sidebars-v2.js` → `keys/labels must match the top-level item labels in sidebars-v2.js — categories, plus the Overview doc`
- [ ] **Step 5: `CLAUDE.md`.**
  - Line 77: `So hiding the Home section just moves the landing to the next visible section.` → `So hiding the Overview entry just moves the landing to the next visible section.`
  - Line 78: in the key list, `` `home, understand-dial, …` `` → `` `overview, understand-dial, …` ``
  - Line 82: `DOCS_V2_SECTIONS="home,building-with-dial" npm run start` → `DOCS_V2_SECTIONS="overview,building-with-dial" npm run start`
  - Line 96: ``top-level sections (`1.home/`, `2.understand-dial/`, … `10.demos/` — in `V2_SECTIONS` catalog order)`` → ``the entry page (`1.overview.md`) and the top-level sections (`2.understand-dial/`, … `10.demos/` — in `V2_SECTIONS` catalog order)``
- [ ] **Step 6: `BRANCH_GUIDE.md`.**
  - Line 42: `So hiding the Home section just moves the landing to the next visible section.` → `So hiding the Overview entry just moves the landing to the next visible section.`
  - Line 49: `home, understand-dial, …` → `overview, understand-dial, …`. The list there already lacks `services`; leave that pre-existing gap and mention it in the report.
  - Line 74: `DOCS_V2_SECTIONS="home,building-with-dial"` → `DOCS_V2_SECTIONS="overview,building-with-dial"`
- [ ] **Step 7: Sanity check.**
  ```bash
  node --input-type=module -e "import('./sidebars-v2.js').then(m=>console.log(m.default.v2Sidebar.map(x=>x.type==='doc'?'doc:'+x.id:x.label).join(' | ')))"
  node --input-type=module -e "import('./docs.config.js').then(c=>console.log(JSON.stringify(c.NEW_ROOT_REDIRECT)))"
  ```
  Expected: the first line starts with `doc:overview | Understand DIAL`, and the second prints `{"from":"/v2","to":"/v2/overview"}`.

**Verify:** the grep in the acceptance criteria and the two node one-liners.

---

### Task 2: Relevance gate and descriptions (data only — no docs page changes)

**Goal:** a reviewed `map.txt`, in which every link passes R1–R4 and follows R5 order, and a complete `desc.tsv`.

**Files:** edit `map.txt`; append to `desc.tsv`; create `skipped.md` (all in `docs-planning/further-reading/`).

**Acceptance criteria:**
- [ ] every page in `map.txt` was opened, its H1, intro and H2s read, and each link checked against R1–R4
- [ ] each page has 2–6 links. Pages with fewer than 2 passing links are removed from `map.txt` **and** listed in `skipped.md`
- [ ] `desc.tsv` has a row for every link the dry run reports as missing, and each row follows the description rules
- [ ] the dry run prints `errors: 0 … missing descriptions: 0   missing labels: 0`

**Steps:**
- [ ] **Step 1: Work in section batches.** Pages and descriptions to write per section:

  | Section | Pages | Descriptions |
  |---|---|---|
  | Understand DIAL | 29 | 58 |
  | Building with DIAL | 67 | 104 |
  | Operating DIAL | 51 | 64 |
  | Administering DIAL | 31 | 63 |
  | Services | 88 | 179 |
  | Chat User Guide | 10 | 19 |
  | Reference | 2 | 3 |
  | Use Cases | 9 | 2 |
  | Demos | 6 | 12 |

- [ ] **Step 2: Per page**, in this order:
  1. Read the page's H1, intro and every H2/H3.
  2. For each mapped target, read its `title` and H2 list.
  3. Apply R1–R4 to each link, and note the anchor (sentence, heading, table row) for every `+` link. A `+` link without a concrete anchor is removed.
  4. If a link fails, look for a replacement in this order: links in the page body; targets of the page's old closing blocks; siblings in the same folder; pages that link *to* this page.
  5. Reorder per R5.

  The plan review already applied this to the weakest links. 201 new links are not linked from the page body; the 29 of those with no word overlap with the body were read, and 7 map entries were fixed:
  - time-awareness: dropped Hooks
  - OpenAPI-to-MCP env vars: Toolsets security → Tracing
  - RAG Eval: dropped the DIAL Evaluations service
  - Admin Translators: dropped Interceptors
  - Supported providers: Services hub → the three adapter pages
  - Azure local tutorial: the wrong "Adapter configuration" link → OpenAI Adapter configuration
  - Upgrade: dropped the GitHub copy of the release notes, since the on-site Changelog is already listed

  Still re-check the remaining 172 new links that are not linked from the body.
- [ ] **Step 3: Descriptions.** Add a row `page-id<TAB>target-id<TAB>description` to `desc.tsv` for every row of the dry run's `--list-missing` output. A replaced or added link appears there automatically. The 11 seeded rows already fix the six reused descriptions that read like next steps (glossary → What is DIAL, Grafana → Alerting, Azure secrets → Azure deployment, three UI-library release pages) and describe the links added in review. To reword any other reused description, add a row; `desc.tsv` wins over the old text.
- [ ] **Step 4: Dry run** (this needs task 1 done: `1.overview.md` exists).
  ```bash
  W=docs-planning/further-reading
  python3 -I $W/apply_blocks.py --root docs_v2 --map $W/map.txt --desc $W/desc.tsv --labels $W/labels.tsv \
      --no-fr overview --list-missing $W/missing.tsv
  ```
  Expected: `errors: 0   warnings: 0   missing descriptions: 0   missing labels: 0`, then `files rewritten: 374   with Further reading: <N>   (dry run, nothing written)`. `<N>` is the number of pages in `map.txt`. If a new target's title is shared, the tool reports `missing labels`; add that target to `labels.tsv`.

**Verify:** step 4 output.

**STOP — report to the user and wait for go-ahead.** Report:
- pages kept and pages skipped (with reasons)
- every link you removed, replaced or added relative to the delivered `map.txt` (`diff` it)
- 20 sample bullets from different sections

---

### Task 3: Apply the closing-block change

**Goal:** all closing blocks rewritten in one reproducible pass.

**Files:** all 374 non-generated pages under `docs_v2/`.

**What the tool does:**
1. Finds every level-2 heading named `Next steps`, `Where to go next`, `Further reading`, `Related tasks`, `Related pages` or `Related troubleshooting`, ignoring code fences.
2. Aborts if any other content follows those blocks.
3. Cuts from the first such heading to the end of the file.
4. On non-index pages, appends `## Further reading` and the bullets built from the map.
5. On `0.index.md` and `--no-fr` pages, appends nothing.
6. Ends each file with exactly one newline.

It never edits anything above the first closing heading.

**Acceptance criteria:**
- [ ] `verify_blocks.py` reports only the 2 violations on `8.reference/changelog/index.md` (fixed in task 4)
- [ ] `check_bodies.py` reports `differences: 0`
- [ ] the 80 `0.index.md` pages and the overview have neither `Next steps` nor `Further reading`

**Steps:**
- [ ] **Step 1:** run the task 2 step 4 command with `--write` appended.
- [ ] **Step 2:** `python3 -I docs-planning/further-reading/verify_blocks.py --root docs_v2`
- [ ] **Step 3:** `python3 -I docs-planning/further-reading/check_bodies.py --root docs_v2`. This compares every page with `git HEAD` above the first closing heading; the overview is compared with `1.home/0.index.md` after the expected `](../` → `](./` rewrite.
- [ ] **Step 4: Spot read** 30 pages, 3 per section, including at least one tutorial, how-to, reference, explanation and user-guide page. Re-apply R1–R4 to the final text.

---

### Task 4: Generated changelog landing

**Goal:** `8.reference/changelog/index.md`, a landing page, has neither block, and the generator keeps it that way.

**Files:**
- Modify: `scripts/build-changelog.ts`. Delete the comment on line 327, the `const outro = [...]` on lines 328–338, and the blank line 339; rewrite the `return` on line 340.
- Modify: `docs_v2/8.reference/changelog/index.md`. It is tracked and is regenerated on every build.

**Acceptance criteria:**
- [ ] the generator no longer emits `## Further reading` or `## Next steps`
- [ ] `verify_blocks.py` prints `violations: 0`
- [ ] after the task 7 build, the changelog `index.md` still has no closing blocks

**Steps:**
- [ ] **Step 1: Edit the generator.** This was rehearsed on a scratch copy; the generator then wrote an `index.md` with no closing blocks.
  ```bash
  python3 -I - scripts/build-changelog.ts <<'EOF'
  import sys
  p = sys.argv[1]; L = open(p, encoding='utf-8').read().split('\n')
  s = L.index('    // Links are relative to docs_v2/8.reference/changelog/.')
  assert L[s + 1] == '    const outro = [', L[s + 1]
  e = L.index('    ].join("\\n");', s)
  old = '    return `${fm}# Changelog\\n\\n${intro}\\n\\n${sections.join("\\n\\n")}\\n\\n${outro}\\n`;'
  assert L[e + 1] == '' and L[e + 2] == old, L[e + 2]
  L[e + 2] = '    return `${fm}# Changelog\\n\\n${intro}\\n\\n${sections.join("\\n\\n")}\\n`;'
  del L[s:e + 2]
  open(p, 'w', encoding='utf-8').write('\n'.join(L))
  print('removed lines', s + 1, '-', e + 2)
  EOF
  ```
  Expected: `removed lines 327 - 339`: the comment (327), `const outro` (328–338) and the blank line (339). 1-based, inclusive; the old `return` moves up to line 327. `git diff scripts/build-changelog.ts` must show exactly those 13 removed lines and the changed `return`.
- [ ] **Step 2: Update the generated file.** Remove everything from the blank line before `## Further reading` to the end of `docs_v2/8.reference/changelog/index.md`, leaving one trailing newline. This is exactly what the generator now produces, and the checkers need it before the build.
- [ ] **Step 3:** `python3 -I docs-planning/further-reading/verify_blocks.py --root docs_v2` → `violations: 0`.

---

### Task 5: Edge-case review

**Goal:** the pages whose old blocks were not plain link lists are checked by eye.

**Checks.** Open each page's final bottom section and confirm:
- [ ] `4.operating-dial/8.troubleshooting.md`: the sentence "Component-specific failure tables live alongside the features they cover:" belonged to the removed `Related troubleshooting` block and is intentionally gone. Further reading holds the 6 mapped links.
- [ ] `5.administering-dial-new/6.governance/5.publications-and-review.md`: the old link-less bullet "Activities and rollback — audit publication approvals and other admin actions" is intentionally dropped.
- [ ] Pages whose old blocks had several links per bullet (`10.demos/3`, `4`, `5`, `6`, `2.understand-dial/4.architecture/7.ai-api-overview.md`, `6.services/1.core/1.configuration/4.models.md`): each bullet now holds one link, with a description from `desc.tsv`.
- [ ] `8.reference/1.unified-api.md`: the old `Related pages` used bold links wrapped over two lines; the new bullets are single lines.
- [ ] `2.understand-dial/3.capabilities/6.tools-and-enterprise-data.md`: 6 links (was 7).
- [ ] `3.building-with-dial/4.adapters/2.supported-providers.md`: links to the three adapter service pages, with "DIAL Core configuration: Models" and "DIAL Admin: Models" as distinct labels.
- [ ] `4.operating-dial/1.local-setup/4.docker-compose-with-azure-model.md`: "DIAL OpenAI Adapter configuration" replaces the old mislabelled "Adapter configuration" link.
- [ ] Release pages `3.building-with-dial/6.developer-tools/3.ui-libraries/4.releases/*`: each ends with the library page, the neighbouring release and the external releases link.
- [ ] `verify_blocks.py` has no V8 or V9 lines.

---

### Task 6: Update the writing rules

**Goal:** new pages follow the new convention, and no rule or template reintroduces the removed blocks.

**Files:**
- `docs-planning/style-guide.md`: lines 56, 65 and 74, plus a new subsection after §7.4 (before line 218 `## 8. Writing mechanics`)
- `.claude/skills/docs-page-writer/SKILL.md`: lines 37–41, 134–144, 164 and 222
- `.claude/skills/docs-page-writer/references/`:
  - `template-tutorial.md` (88–92, 101)
  - `template-howto.md` (64–72, 79)
  - `template-reference.md` (62–65)
  - `template-explanation.md` (60–63)

  The sample blocks in the templates sit inside a ```` ```markdown ```` fence; edit them inside the fence and keep the closing ```` ``` ```` (tutorial line 93, how-to line 73, reference line 66).
- `.claude/skills/docs-auditor/SKILL.md`: lines 129, 228, 229 and 280
- `CLAUDE.md`: one new bullet under "Key conventions"

**Rule text** (use verbatim wherever a rule is stated):
> Every page except `0.index.md` ends with **one** optional `## Further reading` block: 2–6 links to docs that are relevant to what the page covers, formatted `- [Title](./relative.md) — what the reader gets`. Omit the block when fewer than 2 docs are relevant. `0.index.md` pages have no closing link block, because the overview itself links to related docs. Do not write `## Next steps`, `## Where to go next`, `## Related tasks`, `## Related pages` or `## Related troubleshooting`.

**Steps:**
- [ ] **Step 1: Style guide.**
  - Line 56 (tutorial): `→ What you learned → Next steps.` → `→ What you learned → Further reading (optional).`
  - Line 65 (how-to): `→ Result → Related tasks.` → `→ Result → Further reading (optional).`
  - Line 74 (reference): `→ Errors → Example.` → `→ Errors → Example → Further reading (optional).`
  - Line 83 (explanation) already ends with `Further reading`.
  - Add `### 7.5 Closing links` after §7.4 with the rule text.
- [ ] **Step 2: docs-page-writer `SKILL.md`.**
  - In the type table (lines 37–41), end each Structure cell with `→ Further reading` instead of `→ Next steps` or `→ Related tasks`, and append it to the Reference row.
  - Replace "## Step 7: End with "Next steps"" (lines 134–144, up to the blank line before `## Step 8`) with "## Step 7: End with "Further reading" (optional)". Use the rule text, plus an example block of 3 real docs_v2 links in `./x.md` form.
  - Line 164: `- [ ] Optional "Further reading" at the end: 2–6 relevant links (none on 0.index.md)`.
  - Line 222: `The "Next steps" examples` → `The "Further reading" examples`.
- [ ] **Step 3: The four templates.**
  - Delete the sample `## Next steps` and `## Related tasks` sections, and keep or add one `## Further reading` sample with 2–3 bullets.
  - In tutorial line 101, `Ending without "What you learned" and "Next steps."` → `Ending without "What you learned."`
  - Delete how-to line 79, `Missing the "Related tasks" section.`
- [ ] **Step 4: docs-auditor `SKILL.md`.**
  - Line 129 → `- **Further reading**: a non-index page ends with one Further reading block of 2–6 relevant links, or none when fewer than 2 docs are relevant; index pages and the overview have none. Flag Next steps / Related tasks blocks, irrelevant links, and blocks over 6 links.`
  - Line 228 → `- **Further reading**: ❌ Missing (relevant docs exist)`
  - Line 229 → `- **Legacy closing blocks**: ❌ "Next steps" present`
  - Line 280 → `- Pages with Further reading: X`
- [ ] **Step 5: `CLAUDE.md`.** Add under "Key conventions":
  ``- **Closing links:** a page ends with at most one `## Further reading` block (2–6 relevant links, `./x.md` format); `0.index.md` pages have none. No `Next steps` / `Related tasks`.``
- [ ] **Step 6: Check.** `grep -rn -i -E "next steps|related tasks|where to go next|what's next" docs-planning/style-guide.md .claude/skills/docs-page-writer .claude/skills/docs-auditor CLAUDE.md` must find no rule that still requires those blocks. Historical audit reports under `docs-planning/audit-results/` are left alone.

---

### Task 7: Full build and final verification

**Goal:** prove that the tree, the sidebar and every link still agree; all `onBroken*` options are `throw`.

**Steps:**
- [ ] **Step 1: Checkers.** `verify_blocks.py` → `violations: 0`; `check_bodies.py` → `differences: 0`.
- [ ] **Step 2: Build.** No package changes; if a dependency error appears, stop and report it. The build clears `build/` first (Docusaurus 3.9 `clearPath(outDir)`), so stale files cannot hide a problem.
  ```bash
  ./node_modules/.bin/tsx scripts/build-changelog.ts && ./node_modules/.bin/docusaurus build
  ```
  The log must contain `[SUCCESS] Generated static files` and no `Broken link`, `Broken anchor` or `Duplicate routes`.
- [ ] **Step 3: Routes.**
  ```bash
  test -f build/v2/overview.html && echo overview-ok
  test ! -e build/v2/home/index.html && echo old-home-gone
  test -f build/v2/home/architect-overview.html && echo old-redirect-kept
  grep -o 'url=[^"]*' build/v2.html
  ```
  Expected: `overview-ok`, `old-home-gone`, `old-redirect-kept`, `url=/v2/overview`. Before the change, the last one prints `url=/v2/home/index`.
- [ ] **Step 4: Build side effects.** The changelog step regenerates every file under `docs_v2/8.reference/changelog/`. On macOS it also rewrites the `Generated by … from docs\releases\…` header (backslashes become slashes) in about 22 of them. Run `git diff --stat -- docs_v2/8.reference/changelog`. For every file except `index.md`, confirm the diff is only that header line, and **report** it. Do not revert anything: offer to restore those files, and do it only if the user agrees. `index.md` must keep the task 4 change.
- [ ] **Step 5: Numbers for the report.**
  - pages with `Further reading`, and the links-per-block histogram (printed by `verify_blocks.py`)
  - pages without one (from `skipped.md`)
  - links added and removed per section compared with the delivered map
  - `git status --short` compared with the saved baseline
- [ ] **Step 6: Final report to the user** (no commit):
  - what changed
  - the skipped pages and why
  - the descriptions you rewrote
  - pre-existing issues you noticed but did not touch: 125 route-style links in 31 files; the `BRANCH_GUIDE.md` section list lacks `services`
  - the open point that the entry page's title and H1 are still "Get Started with DIAL"

**Done when:** steps 1–3 pass and the report is delivered.

---

## Self-review against the request

| Request | Where |
|---|---|
| 1. Drop the Home folder; give the entry page a proper name | Task 1 (the name stays "Overview" per the user's answer; title/H1 raised in the report) |
| 2. Remove `Where to go next` / `Next steps` everywhere, keeping only `Further reading`; index pages lose both | Tasks 2–3 (tool) and task 4 (changelog landing); checked by V1–V3 |
| 3. Add relevant `Further reading` where 2+ docs are relevant, at most 6, no index pages | Rubric R1–R5; task 2 gate with an anchor for every link and a STOP for user review; V4–V9; task 3 spot read |
| Related blocks (decision 5) | Merged by the tool; their links are candidates in `map.txt` |
| No redirect (decision 6) | Global constraints; task 7 step 3 confirms the old route is gone |
| Writing rules (decision 7) | Task 6, including the docs-auditor skill |
