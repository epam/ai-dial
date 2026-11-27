---
name: repo-research
description: Use when researching one of epam/ai-dial-chat, epam/ai-dial-quickapps-frontend, or epam/ai-dial-quickapps-backend for a DIAL Chat User Guide update plan, as the release-researcher subagent. Covers the clone, ui_changes.py (UI text, user-visible files, specs, routes, feature flags, packages, the Quick Apps schema, tools, and stage names, and release notes, per release window), what counts as visible to a chat user, where each repository keeps its UI and what is internal, proving a change at the target tag, routing it to guide pages, and the findings file format.
user-invocable: false
---

# Research one repository

You get one repository, and one window per `last_verified` date of the guide. Each window runs from the newest stable release published before that date to the target, the newest stable release. The windows file (`release_windows.py` output) has, per repository, the baselines, the target, and every reviewed release with its notes. You return a findings file: every change a DIAL Chat user can see in a window, proven at the target, and mapped to the guide.

Keep notes in `<WORK>/research/<NAME>/notes.md` as you go, where `<NAME>` is the repository name without `epam/`. After a context compaction, re-read them and the findings file instead of starting over.

## 1. Clone

```bash
git clone --filter=blob:none --no-checkout https://github.com/<REPO>.git <WORK>/repos/<NAME>
git -C <WORK>/repos/<NAME> fetch --tags --force
```

A blobless clone has every commit and tree, and fetches file contents on demand. Read files with `git -C <WORK>/repos/<NAME> show <TAG>:<PATH>`, and number lines with `| grep -n` or `| sed -n`. `git log -S`, `git grep` over history, and `git blame` fail in this clone with "missing object"; use `git log --format='%h %s' <FROM>..<TO> -- <PATH>` and `git show <TAG>:<PATH>` instead.

## 2. Run the change list

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/ui_changes.py" --repo <REPO> --clone <WORK>/repos/<NAME> \
  --windows <WORK>/windows.json --out <WORK>/research/<NAME>/ui_changes.json \
  > <WORK>/research/<NAME>/ui_changes.txt 2>&1; echo "exit=$?"; cat <WORK>/research/<NAME>/ui_changes.txt
```

It compares each window on its own: a setting added and removed again between two baselines shows only in the newer window. Every change carries `first`, the first release of its window that ships it as the target has it, and `date`, the day that release was published. A `STOP:` line means a tag is missing from the clone (fetch the tags again) or the repository has no profile: report it in your answer, and write no findings.

The output is large. Query it instead of reading it whole:

```bash
python3 -I -c 'import json,sys; w=json.load(open(sys.argv[1]))["windows"]["<DATE>"]
for x in w["strings"]["changed"]: print(x["key"], "|", x["old"], "->", x["new"], "|", x["first"])' \
  <WORK>/research/<NAME>/ui_changes.json
```

The same pattern reads `strings.added`, `strings.removed`, `strings.values_removed`, `files` (by area), `specs`, `archived_changes`, `watch`, `packages`, and for the backend `schema`, `tools`, and `stage_text`. `notes` (top level) holds the release-note bullets, one per PR, in the release that lists it first.

## 3. Find the changes a user can see

Work window by window, newest start date first: it covers most pages. In each window, go through these, in this order:

1. **Release notes** (`notes`): every Features, Fixes, Breaking Changes, and Deployment Changes bullet of the window's releases. Notes point at changes and omit some; they are never proof.
2. **UI text** (`strings`): every changed, added, and removed text. When `layout_changed` is true, the string files differ between the two tags, so use `values_removed` and `values_added`.
3. **Specs** (`specs`, `archived_changes`): a new or changed `openspec/specs/<name>/spec.md` describes a feature's behavior; a new archive folder names a finished change.
4. **Files** (`files`): areas the first three didn't explain, such as a component that changed with no text change.
5. **Watch and packages**: new routes and feature flags, and `@epam/*` dependency bumps, whose components the UI renders.
6. **Backend only**: `schema` (fields, defaults, allowed values, preview markers), `tools`, and `stage_text`.

A change counts when a DIAL Chat user would see it or do something differently: a label, button, menu item, tab, field, dialog, column, message, or stage name that is new, gone, renamed, or moved; a changed default; a step that works differently; a feature shown or hidden by a toggle. It doesn't count when it is a refactor, a test, CI, a dependency bump with no visible effect, performance, an internal API, a log message, or an admin-only configuration with no change in the chat. Record those under "Reviewed, not user-visible", grouped, with their PRs.

For each change that counts:

- **Prove it at the target tag**: the file and line that render it or hold its text (`git show <TARGET>:<PATH> | grep -n '<TEXT>'`). Find the PR from the notes, or from the commit subjects: `git log --format='%h %s' <FROM>..<TARGET> -- <PATH>` (subjects end in `(#<PR>)`).
- **Name the release**: `first` and `date` from the script, or the first release whose notes list it.
- **State the condition**: always, behind a toggle (`ENABLED_UI_FEATURES` value, feature flag, environment variable, with its default), or a preview (`[Preview]` in the notes, `x-preview` in the backend schema).
- **Write the UI path** the user clicks, joined by `→`, in the target's own words (`docs-chat-guide-update-plan:guide-map`, section 1).
- **Map it to the guide**: the routing in `guide-map` section 2 gives the candidate pages. Read the candidate section in the checkout, read only, and find what the page says and shows now: the line, the bold label, the image and its alt text (`<WORK>/guide.json`). The guide is sometimes ahead of the stable release; when the page already matches the target, the proposed item is "none".
- **Check the page's window**: a change matters for a page only in the window of that page's `last_verified` date. A change shipped before a page's date is already covered there.

## 4. Repository notes

**epam/ai-dial-chat** (the 1.x line; 0.x is the legacy chat, never reviewed)
- UI text: `apps/chat/src/i18n/locales/en.json`, about 60 namespaces, with `{{var}}` placeholders and `_one`/`_other` plural keys. Libraries carry English defaults in `*Labels` props that the app fills from en.json.
- UI: `apps/chat/src/pages/`, `apps/chat/src/components/`, `libs/*`; routes in `apps/chat/src/types/routes.ts`; server behavior the user sees (naming, transcription, usage) in `apps/chat-api/src/`.
- Toggles: `apps/chat-api/src/app-config/known-ui-features.constants.ts` (`ENABLED_UI_FEATURES`), `apps/chat-api/src/app-config/feature-flags/feature-key.enum.ts`, and environment variables such as `SPENDING_LIMITS_MODE` and `PROJECTS_ENABLED`.
- Internal: tests, `*.spec.*`, `*.stories.*`, `.github`, `.claude`, `.agents`, `tools/`, `scripts/`, `docs/`, `libs/chat-api-client` (generated), `openspec/changes/`, and the sandbox apps.
- Several stable lines ship at once (1.1, 1.2, and 1.3 patches in the same weeks). A backport to an older line repeats a change already in a newer one, so its notes add nothing new. Notes are written by hand: `* (scope) text (Issue #N) (#PR)`, with `[Preview]` for preview features. Release `target_commitish` always reads `development`; trust the tags.

**epam/ai-dial-quickapps-frontend** (the Quick App editor in an iframe inside DIAL Chat)
- UI text: `src/i18n/locales/en.json` from 0.3.2. Through 0.3.1 it was `src/i18n/locales/common.json` and `quick-app-editor.json`, keyed by the English text; across that change, compare values, not keys.
- UI: `src/components/` (`InstructionsSection`, `AddOns`, `Toolsets`, `Skills`, `AgentSkills`, `Agents`, `KnowledgeBase`, `ConversationStarters`, `Orchestrator`, `Settings`, `EditJson`, `LoginScreen`), laid out by `src/components/QuickApp2Form/QuickApp2Form.tsx`.
- It renders pickers and cards from DIAL Chat's packages (`@epam/ai-dial-catalog`, `@epam/ai-dial-skill-editor`, `@epam/ai-dial-ui-kit`, …), so a package bump can change the editor with no change in `src/`. Say which package and version.
- The compare API caps files at 300 and diffs diverged lines from their merge base; trust the tree diff of the script. Notes repeat items of earlier releases; the script keeps the first.

**epam/ai-dial-quickapps-backend** (the Quick App runtime)
- What a chat user sees of it: the fields, defaults, and allowed values behind the editor (`docs/generated-app-schema.json`, from `src/quickapp/config/`); the built-in tools (`docs/generated-internal-tools.json`); the stage names a response shows (`name=` in `src/quickapp/**/_tool_configs.py`, such as "Reading Skill: " and "Searching tools"); and the predefined tools, toolsets, and skills in `config/predefined/`.
- The editor's labels are not in the backend: the schema's `title`s are generated and the editor doesn't show them. A schema change matters when the editor shows the field, or when a default or allowed value changes what a user gets.
- The generated files are dumped with preview features on; a field marked `x-preview: true` is a preview. Notes have "Behavioral changes" under Deployment Changes, which are often visible.
- Some releases are one squashed integration commit, so the PRs appear only in the notes.

## 5. Findings file

Write `<WORK>/research/<NAME>/findings.md`:

````markdown
# Findings: <REPO>

Windows: <DATE>: <FROM> → <TARGET> (<N> releases); <DATE>: …
Script: ui_changes.py exit <CODE>

## F1. <A short title in the user's words>

- Kind: added | removed | renamed | changed | moved | behavior
- What a user sees: <before> → <after>
- UI path: <Sidebar or Catalog → … → …>
- Shipped in: <TAG> (<YYYY-MM-DD>); window <DATE>
- Condition: always | only when <TOGGLE> (default <VALUE>) | preview
- Evidence: [<REPO>#<PR>](https://github.com/<REPO>/pull/<PR>), [`<FILE>#L<A>-L<B>`](https://github.com/<REPO>/blob/<TARGET>/<FILE>#L<A>-L<B>), [<TAG> notes](https://github.com/<REPO>/releases/tag/<TAG>)
- Strings: `<KEY>`: "<OLD>" → "<NEW>"
- Guide: `<PAGE>`, section "<HEADING>", line <N>: says "<TEXT>"; image `<IMAGE>` (alt "<ALT>")
- Proposed item: Replace text | Remove text | Add text | Retake a screenshot | Add a screenshot | Remove a screenshot | none (<why>) | Needs review (<why>)

## Reviewed, not user-visible

- <Group, such as "Fixes with no visible change">: <REPO>#<PR>, <REPO>#<PR>

## Not settled

- <What>: <why it couldn't be proven, and what would settle it>
````

- One finding per change a user sees. A change that touches two pages is one finding with two Guide lines.
- Leave out a line that doesn't apply, such as Strings for a moved button. Never leave out Evidence, Shipped in, or Guide.
- "Guide: no page" goes with "Proposed item: Needs review (no page covers <AREA>)".

## 6. Your answer

Answer with the path of the findings file, and one line of counts: findings by proposed item, "none" items, "Needs review" items, "Not settled" items, and the releases reviewed. If something stopped you, say what, and what you finished.
