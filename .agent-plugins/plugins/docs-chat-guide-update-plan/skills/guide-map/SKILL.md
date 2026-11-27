---
name: guide-map
description: Use when planning DIAL Chat User Guide updates (docs_v2/8.chat-user-guide/), to know the guide's pages and how a user reaches each part of the UI they describe, which source areas of epam/ai-dial-chat, epam/ai-dial-quickapps-frontend, and epam/ai-dial-quickapps-backend each page depends on, the UI with no page yet, where screenshots live, and how to run guide_inventory.py (pages, last_verified, headings, images, bold labels) and text_hits.py (guide lines that quote changed or removed UI text).
user-invocable: false
---

# The DIAL Chat User Guide

The guide is a click-through guide of DIAL Chat for end users: what each screen shows, and the steps to do something on it, with a screenshot per screen or dialog. It names UI elements in **bold**, exactly as the UI writes them. A change in the UI makes a page wrong in three ways: a label it quotes, a step it describes, or a screenshot it shows.

The routing below is a hint of where to look, never proof: the source at the target tag, and the page text at `<BASE>`, decide. Over-include: a false lead costs one look, a missed one leaves a page stale.

## 1. Pages and how a user reaches them

| Page | Title | How a user gets there |
|---|---|---|
| `0.index.md` | Overview and interface | the sidebar: **New chat**, **Chats**, **Scheduled tasks**, **Catalog**, **File Manager**; account, **Settings**, and **Usage** at the bottom; the collapse icon at the top |
| `1.conversations.md` | Conversations | Sidebar → **New chat**, or a conversation in **Chats and tasks**; the composer and its Add menu (**+**); a response's action icons and stages; a conversation's actions menu in the list |
| `2.scheduled-tasks.md` | Scheduled tasks | Sidebar → **Scheduled tasks** → **New task**, or a task card; banners when **Dial native** is not logged in |
| `3.catalog/0.index.md` | Catalog | Sidebar → **Catalog**: **Your Favorites**, **Browse** (search, filter, sort, grid or list), **Create** |
| `3.catalog/1.models.md` | Models | Catalog → a model's card → details panel: **About**, **Overview**, **Pricing**, **Limits**, **Connect** |
| `3.catalog/2.agents.md` | Agents | Catalog → an agent's card → details panel; Catalog → **Create** → **Quick App** or **Custom App** (the editors); an agent's **···** menu → **Edit**, **Delete** |
| `3.catalog/3.toolsets.md` | Toolsets | Catalog → **Toolsets** → a card → details panel (**About**, **Overview**, **Tools**, **Connect**); **Log in** or **API key**; Catalog → **Create** → **Toolset** |
| `3.catalog/4.skills.md` | Skills | Catalog → a skill's card; Catalog → **Create** → **Skill** → **Write instructions** or **Upload** |
| `3.catalog/5.prompts.md` | Prompts | Catalog → a prompt's card; Catalog → **Create** → **Prompt** |
| `4.files.md` | File Manager | Sidebar → **File Manager**: tabs **All**, **My files**, **Shared**, **Organization**; **Add**, **Sort**, an item's menu |
| `5.sharing-and-publishing.md` | Sharing and publishing | an item's menu (in **Chats and tasks**, or **···** in a Catalog details panel) → **Share**, **Publish**, **Revoke access**, **Unpublish** |
| `6.usage-and-settings.md` | Usage and settings | Sidebar bottom → your name → **Settings** (**Preferences**, **Extensions**); the bar-chart icon → **Usage** |

Write a UI path as the clicks a user makes, joined by `→`, with the UI's own words: `Catalog → Create → Quick App → Configuration → Advanced settings`. Take the words from the target's string file, not from the page, because the page may be the stale part.

The Quick App editor (`3.catalog/2.agents.md`, "Build a Quick App") is two apps in one screen:

- **DIAL Chat** draws the top bar (**Preview**, **Cancel**, **Save**) and the **Metadata** column. The quickapps-frontend spec `openspec/specs/host-integration/spec.md` has the host own Save, and quickapps-frontend has no metadata component.
- **ai-dial-quickapps-frontend**, in an iframe, draws **Instructions**, **Add-ons**, and **Configuration**: **Default model**, **Settings**, **Advanced settings**, **Edit JSON** (`src/components/QuickApp2Form/QuickApp2Form.tsx`).
- **ai-dial-quickapps-backend** decides the fields behind them, their defaults and allowed values, and the names of the steps a Quick App shows in a response (`1.conversations.md`, "Stages").

## 2. Source areas per page

Paths are at the `1.3.7` tag of ai-dial-chat, `0.4.0` of ai-dial-quickapps-frontend, and `0.14.2` of ai-dial-quickapps-backend. "Strings" are the top-level namespaces of the string file (`apps/chat/src/i18n/locales/en.json` in chat).

| Page | ai-dial-chat strings | ai-dial-chat code | Quick Apps |
|---|---|---|---|
| `0.index.md` | `basic`, `buttons`, `navigation`, `sidebar`, `footerMessage`, `announcementBanner`, `announcementsPopover`, `appUpdate`, `errorBoundary`, `notFound`, `notification`, `entityNotifications`, `onboardingTour` | `libs/sidebar`, `libs/navigation-panel`, `libs/onboarding-tour`, `apps/chat/src/pages/NotFound` | |
| `1.conversations.md` | `chat`, `conversation`, `conversationPanel`, `conversationInput`, `conversationExport`, `conversationImport`, `deploymentSelector`, `promptSelector`, `skillSelector`, `rate`, `citations`, `attachments`, `voiceRecording`, `tools`, `attachmentCanvas`, `customViewer` | `libs/conversation-*`, `libs/quotations`, `libs/source-panel`, `libs/mcp-apps`, `libs/attachment-*`, `apps/chat/src/pages/Conversation*`, `apps/chat-api` (naming, transcription) | backend: stage names, "Stages" |
| `2.scheduled-tasks.md` | `scheduledTasks`, `extensions` | `libs/scheduled-tasks`, `apps/chat/src/pages/ScheduledTask*` | |
| `3.catalog/0.index.md` | `catalog`, `favorites`, `textRefinement`, `unsavedChanges`, `resourceSavePanel` | `libs/catalog` | |
| `3.catalog/1.models.md` | `catalog`, `deploymentSelector`, `usage` | `libs/catalog`, `libs/usage-dashboard` | |
| `3.catalog/2.agents.md` | `catalog`, `appsEditor`, `applicationEditor`, `customApp`, `editor`, `applicationCredentials` | `apps/chat/src/pages/ApplicationEditor`, `libs/builder-form`, `libs/catalog` | frontend: all of `src/`; backend: `docs/generated-app-schema.json`, `config/predefined/` |
| `3.catalog/3.toolsets.md` | `catalog`, `toolsetEditor`, `toolsetSignin`, `tools` | `libs/toolset-editor`, `apps/chat/src/pages/ToolsetAuthCallback` | frontend: `src/components/Toolsets` |
| `3.catalog/4.skills.md` | `catalog`, `skillEditor`, `skillArchiveImport`, `skillSelector` | `libs/skill-editor`, `libs/skills`, `apps/chat/src/pages/SkillEditor` | frontend: `src/components/Skills`, `AgentSkills` |
| `3.catalog/5.prompts.md` | `catalog`, `promptEditor`, `promptSelector` | `libs/prompt-editor`, `libs/prompts`, `apps/chat/src/pages/PromptEditor` | |
| `4.files.md` | `dialFileManager`, `fileDnd`, `attachments` | `apps/chat/src/pages/DialFileManagerPage`, the `@epam/ai-dial-react-file-manager` package | frontend: `src/components/common/FileManagerModal` |
| `5.sharing-and-publishing.md` | `share`, `publish`, `publishAccessRules`, `conversationPublish`, `conversationUnpublish` | `libs/share`, `libs/publish-panel`, `apps/chat/src/pages/*SharedInvitation` | |
| `6.usage-and-settings.md` | `settings`, `chatSettings`, `usage`, `auth`, `userConfig`, `extensions`, `halloween`, `newYear` | `libs/settings-panel`, `libs/usage-dashboard`, `libs/celebrations`, `apps/chat/src/pages/SettingsPage` | |

Every page also depends on the shared namespaces `basic` and `buttons`, and on `@epam/ai-dial-ui-kit`, whose version bump can restyle every screenshot.

Feature toggles decide whether a user sees a part of the UI at all: `ENABLED_UI_FEATURES` values in `apps/chat-api/src/app-config/known-ui-features.constants.ts`, feature flags in `apps/chat-api/src/app-config/feature-flags/feature-key.enum.ts`, and environment variables such as `SPENDING_LIMITS_MODE` and `PROJECTS_ENABLED`. A change behind a toggle that is off by default still belongs in the plan, with the condition stated, because the guide says "shown only when your deployment enables it" for such parts.

## 3. UI with no page

These areas of ai-dial-chat have no page in the guide at `1.3.7`: **Projects** (`projects` strings, `libs/projects`, `apps/chat/src/pages/Project*`, behind `PROJECTS_ENABLED`) and the URL preselection (`urlPreselection`). A change there goes under "Needs review" as "no page covers <AREA>", never into a work-order item: adding a page is a decision for the guide's owners. When a new namespace, page folder, or lib appears in a release and fits no row of section 2, treat it the same way, and name it.

## 4. Screenshots

- Images live next to the pages: `docs_v2/8.chat-user-guide/img/` for the top-level pages, `docs_v2/8.chat-user-guide/3.catalog/img/` for the Catalog pages. They are PNG files with short kebab-case names, such as `quickapp-advanced-settings.png`.
- A page shows one screenshot per screen, dialog, or menu, not one per field. Its alt text says what the image shows, in the UI's words: `![The Advanced settings window](img/quickapp-advanced-settings.png)`.
- A retaken screenshot keeps its file name, so the page needs no edit unless its alt text names something that changed.
- `guide_inventory.py` lists every image with its line and alt text. A screenshot is stale when the screen it shows gained, lost, renamed, or moved something the image would show. A color or spacing change of the whole UI (a `@epam/ai-dial-ui-kit` bump) is noted once in "Changes in the releases", not as one item per image.

## 5. Inventory

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/guide_inventory.py" --out <WORK>/guide.json \
  > <WORK>/guide.txt 2>&1; echo "exit=$?"; cat <WORK>/guide.txt
```

It prints one line per page (its `last_verified`, and the number of headings, images, and bold labels) and the distinct dates. Those dates are the start dates of the release windows (`docs-chat-guide-update-plan:releases`). A `warning` line names an image a page shows that doesn't exist: put it under "Needs review". A `STOP:` line means the folder has no pages: stop the run.

`<WORK>/guide.json` has, per page, the headings with their lines and anchors, the images with their alt text, and every bold label with its line. Use it to find the section and line of a work-order item, instead of guessing from memory.

## 6. Text hits

After the researchers finish, find the lines that quote changed or removed UI text:

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/text_hits.py" --inventory <WORK>/guide.json --windows <WORK>/windows.json \
  --changes <WORK>/research/ai-dial-chat/ui_changes.json \
  --changes <WORK>/research/ai-dial-quickapps-frontend/ui_changes.json \
  --changes <WORK>/research/ai-dial-quickapps-backend/ui_changes.json \
  --out <WORK>/text_hits.json > <WORK>/text_hits.txt 2>&1; echo "exit=$?"; cat <WORK>/text_hits.txt
```

Pass only the files that exist: a repository that was up to date has none. Each hit is a lead, printed as line, strength, where, the text, and the replacement or "(gone)":

- **strong** hits are the text as a bold label, in code, in quotes, in alt text, or in a heading. Most become a "Replace text" or "Remove text" item.
- **weak** hits are the text inside a sentence, such as "from Precise to Creative". Read the sentence: it is either the same UI text described in prose, or an ordinary word.
- A hit that the guide already has right is not an item. The guide is sometimes ahead of the last stable release; check the line, the release that changed it, and the target's text.
- The script searches only text the releases changed. A page can still be wrong where the code changed and the text didn't, such as a new field or a moved button: the researchers' findings cover those.
