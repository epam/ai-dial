# DIAL Chat User Guide update plan, 2026-11-27

## Summary

Stable releases published from 2026-11-05 through 2026-11-27 of DIAL Chat, the Quick Apps editor, and the Quick Apps runtime were reviewed against the guide at `development` (`02afb61`). The plan has 56 items on 10 of the 12 pages. The two other pages, `0.index.md` and `3.catalog/0.index.md`, have no item; their open questions are under "Needs review".

| Repository | Pages verified on | Previously | Reviewed up to | Stable releases reviewed |
|---|---|---|---|---|
| `epam/ai-dial-chat` | all 12 pages (window from 2026-11-05; the pages are dated 2026-10-29 and 2026-09-21) | 1.2.22 | 1.3.7 | 10: [1.2.23](https://github.com/epam/ai-dial-chat/releases/tag/1.2.23), [1.2.24](https://github.com/epam/ai-dial-chat/releases/tag/1.2.24), [1.3.0](https://github.com/epam/ai-dial-chat/releases/tag/1.3.0), [1.3.1](https://github.com/epam/ai-dial-chat/releases/tag/1.3.1), [1.3.2](https://github.com/epam/ai-dial-chat/releases/tag/1.3.2), [1.3.3](https://github.com/epam/ai-dial-chat/releases/tag/1.3.3), [1.3.4](https://github.com/epam/ai-dial-chat/releases/tag/1.3.4), [1.3.5](https://github.com/epam/ai-dial-chat/releases/tag/1.3.5), [1.3.6](https://github.com/epam/ai-dial-chat/releases/tag/1.3.6), [1.3.7](https://github.com/epam/ai-dial-chat/releases/tag/1.3.7) |
| `epam/ai-dial-quickapps-frontend` | same window | 0.3.1 | 0.4.0 | 2: [0.3.2](https://github.com/epam/ai-dial-quickapps-frontend/releases/tag/0.3.2), [0.4.0](https://github.com/epam/ai-dial-quickapps-frontend/releases/tag/0.4.0) |
| `epam/ai-dial-quickapps-backend` | same window | 0.13.2 | 0.14.2 | 4: [0.14.0](https://github.com/epam/ai-dial-quickapps-backend/releases/tag/0.14.0), [0.13.3](https://github.com/epam/ai-dial-quickapps-backend/releases/tag/0.13.3), [0.14.1](https://github.com/epam/ai-dial-quickapps-backend/releases/tag/0.14.1), [0.14.2](https://github.com/epam/ai-dial-quickapps-backend/releases/tag/0.14.2) |

**Window.** The run used `since 2026-11-05`, so every page was reviewed from that day, not from its own `last_verified` (2026-10-29 on 11 pages, 2026-09-21 on `3.catalog/1.models.md`). Stable releases published between those dates and 2026-11-05 were not reviewed, yet the commit sets `last_verified: 2026-11-27` on every page. The models page is the furthest behind, by about six weeks of releases. Review them, or move the dates back, before this merges.

Release candidates (`-rc.N`) and backports to older lines (`epam/ai-dial-chat` 1.1.20, 0.49.10, 0.45.5) were not reviewed. The latest DIAL platform release, 1.50, pins `epam/ai-dial-chat` 1.3.1, `epam/ai-dial-quickapps-backend` 0.14.0, and `epam/ai-dial-quickapps-frontend` 0.4.0; a deployment on 1.50 lacks the later changes (for example Deprecation date, End of service, and Budgets).

**Sources.** The GitHub API was not reachable, so release dates and notes come from the public release pages, and evidence from clones of the three repositories at the tags. `origin` is not configured here, so the base is the local `development` branch (`02afb61`), not a fetched copy. Open PRs could not be listed; `git ls-remote` shows no `docs/chat-guide-plan-*` or `docs/loop-aggregate-*` branch on `epam/ai-dial`. Check the open PRs that change `docs_v2/8.chat-user-guide/` before merging: a merged one can move the lines below.

**How to use this file.** It is the work order for the guide updates. For each item, make the change on a branch from `development`, and tick its box here. The commit that added this file sets `last_verified: 2026-11-27` on every page of the guide, which records that the guide matches the releases through 2026-11-27 only once every item is done (see Window above).

Screenshot rules:

- Use a test account and demo content. Don't change or delete existing items; to show a destructive action, open its dialog and cancel.
- Blur real names, emails, avatars, keys, and environment host names, such as the host in a **Connect** tab's endpoint. Collapse or filter the **Chats** list so no real conversation shows.
- Crop to the screen, dialog, or menu the item names, with a margin on every side. Match the size and framing of the image you replace.
- Save as PNG under the file name the item gives. A retake overwrites the old file.
- Compare each existing image with 1.3.7 first. The guide is sometimes ahead of the last stable release, so an image may already show the new screen; then tick the item and say so.
- `@epam/ai-dial-ui-kit` moved from 0.15.4 to 0.16.x, which restyles every screen. Retake the other screenshots only when you see a difference.

## Manual updates

### Conversations — `1.conversations.md`

- [ ] **1. Add text.** Sidebar → Chats and tasks → a conversation → composer
  - **What changed:** Text typed in the composer but not sent is kept for each conversation and is still there when you return (ai-dial-chat 1.3.0).
  - **Where:** `1.conversations.md`, section "Send a message", line 51
  - **Text:** Text you type in the composer but do not send is kept for that conversation, and is still there when you come back to it. This works only when your deployment turns on conversation drafts.
  - **Source:** [epam/ai-dial-chat#9450](https://github.com/epam/ai-dial-chat/pull/9450), [`useConversationDraftStore.ts#L31`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/hooks/conversation/useConversationDraftStore.ts#L31) · 1.3.0 (2026-11-12)

- [ ] **2. Add text.** Sidebar → Chats and tasks → a conversation
  - **What changed:** A conversation you open shows when it started above its first message, such as "Today 11:51 AM" or "Yesterday 3:24 PM" (ai-dial-chat 1.3.0).
  - **Where:** `1.conversations.md`, section "Send a message", line 51
  - **Text:** When you open an existing conversation, a label above its first message shows when it started, for example **Today 11:51 AM** or **Yesterday 3:24 PM**, or the full date for older conversations.
  - **Source:** [epam/ai-dial-chat#9471](https://github.com/epam/ai-dial-chat/pull/9471), [`conversation-start-timestamp/spec.md#L1-L22`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/conversation-start-timestamp/spec.md#L1-L22) · 1.3.0 (2026-11-12)

- [ ] **3. Retake a screenshot.** Sidebar → Chats and tasks → a conversation with a PDF citation
  - **What changed:** A citation to a PDF page now shows the page, so the citation buttons in the image read, for example, "report.pdf, p. 3" (ai-dial-chat 1.3.0).
  - **Where:** `1.conversations.md`, section "Citations", line 221
  - **Image:** `img/citations.png`
  - **Capture:** a response with inline citations, at least one to a PDF page (button text like "report.pdf, p. 3"), and an open citation card with its Preview button; alt text: "A response with inline citations, and an open citation card showing the source passage and a Preview button"
  - **Source:** [epam/ai-dial-chat#9710](https://github.com/epam/ai-dial-chat/pull/9710), [`citation-labels.ts#L14-L37`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/components/ConversationView/utils/citation-labels.ts#L14-L37) · 1.3.0 (2026-11-12)

- [ ] **4. Replace text.** Sidebar → Chats and tasks → a conversation with a PDF citation
  - **What changed:** A citation button names the PDF page when the passage is on a page (ai-dial-chat 1.3.0).
  - **Where:** `1.conversations.md`, section "Citations", line 223
  - **Replace:** `such as **report.pdf +2**.` → `such as **report.pdf +2**. When the passage is on a PDF page, the button also names the page, for example **report.pdf, p. 3**.`
  - **Source:** [epam/ai-dial-chat#9710](https://github.com/epam/ai-dial-chat/pull/9710), [`citation-marker/spec.md#L337-L350`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/citation-marker/spec.md#L337-L350) · 1.3.0 (2026-11-12)

- [ ] **5. Add text.** Sidebar → Chats and tasks → a conversation → a message
  - **What changed:** Each message has a send time in its action row: a relative time such as "3 hours ago", with the full date in a tooltip (ai-dial-chat 1.3.0).
  - **Where:** `1.conversations.md`, section "Work with your messages", line 248
  - **Text:** Next to the icons, the message shows when you sent it, for example **3 hours ago**. Hover over or focus the time to see the full date. On devices without hover, the time is always visible.
  - **Source:** [epam/ai-dial-chat#9471](https://github.com/epam/ai-dial-chat/pull/9471), [`message-hover-timestamp/spec.md#L1-L24`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/message-hover-timestamp/spec.md#L1-L24) · 1.3.0 (2026-11-12)

- [ ] **6. Retake a screenshot.** Sidebar → Chats and tasks → a conversation → a sent message
  - **What changed:** The action row under a sent message now includes the relative send time.
  - **Where:** `1.conversations.md`, section "Work with your messages", line 250
  - **Image:** `img/message-edit-delete.png`
  - **Capture:** a sent message with its Copy, Edit, and Delete icons and the send time visible; alt text: "Copy, edit, and delete icons and the send time under a sent message"
  - **Source:** [epam/ai-dial-chat#9471](https://github.com/epam/ai-dial-chat/pull/9471), [`message-hover-timestamp/spec.md#L1-L24`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/message-hover-timestamp/spec.md#L1-L24) · 1.3.0 (2026-11-12)

- [ ] **7. Replace text.** Sidebar → Chats and tasks → a conversation → a sent message
  - **What changed:** Alt text of the retaken image names the send time.
  - **Where:** `1.conversations.md`, section "Work with your messages", line 250
  - **Replace:** `Copy, edit, and delete icons under a sent message` → `Copy, edit, and delete icons and the send time under a sent message`
  - **Source:** [epam/ai-dial-chat#9471](https://github.com/epam/ai-dial-chat/pull/9471) · 1.3.0 (2026-11-12)

### Scheduled tasks — `2.scheduled-tasks.md`

- [ ] **8. Replace text.** Sidebar → Scheduled tasks
  - **What changed:** Custom has no "every N weeks" interval, so a task card cannot read "Every 2 weeks on Monday" (ai-dial-chat 1.3.0).
  - **Where:** `2.scheduled-tasks.md`, section "The task list", line 47
  - **Replace:** `**Every 2 weeks on Monday at 9:00 AM**` → `**Every Monday at 9:00 AM**`
  - **Source:** [epam/ai-dial-chat#9728](https://github.com/epam/ai-dial-chat/pull/9728), [`en.json#L1047`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/i18n/locales/en.json#L1047) · 1.3.0 (2026-11-12)

- [ ] **9. Replace text.** Sidebar → Scheduled tasks → New task → Repeat → Custom
  - **What changed:** Start date and End date show for every repeat except One-time, Custom included (ai-dial-chat 1.3.0).
  - **Where:** `2.scheduled-tasks.md`, section "Details", line 67
  - **Replace:** `Hourly, daily, weekly, and monthly tasks only.` → `Every repeating task, including **Custom**.`
  - **Source:** [epam/ai-dial-chat#9728](https://github.com/epam/ai-dial-chat/pull/9728), [`ScheduledTaskCreateForm.tsx#L632-L633`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/scheduled-tasks/src/components/ScheduledTaskCreateForm/ScheduledTaskCreateForm.tsx#L632-L633) · 1.3.0 (2026-11-12)

- [ ] **10. Replace text.** Sidebar → Scheduled tasks → New task → Repeat → Custom
  - **What changed:** Custom now has the start and end window, so "Custom has no window" is wrong (ai-dial-chat 1.3.0).
  - **Where:** `2.scheduled-tasks.md`, section "Details", line 67
  - **Replace:** `neither can be in the past. **Custom** has no window.` → `neither can be in the past.`
  - **Source:** [epam/ai-dial-chat#9728](https://github.com/epam/ai-dial-chat/pull/9728), [`scheduled-task-create-form/spec.md#L98-L107`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/scheduled-task-create-form/spec.md#L98-L107) · 1.3.0 (2026-11-12)

- [ ] **11. Replace text.** Sidebar → Scheduled tasks → New task → Repeat → Custom
  - **What changed:** Custom has Time, then Days (one or more day buttons), then Start date and End date; the Every field is gone (ai-dial-chat 1.3.0).
  - **Where:** `2.scheduled-tasks.md`, section "Details", line 78
  - **Replace:** `**Every**: 1 to 10 weeks. **Time**. **Day**: one day of the week, chosen with the day buttons.` → `**Time**. **Days**: one or more days of the week, chosen with the day buttons; at least one day must stay selected. **Start date** and **End date** are optional.`
  - **Source:** [epam/ai-dial-chat#9728](https://github.com/epam/ai-dial-chat/pull/9728), [`scheduled-task-create-form/spec.md#L98-L107`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/scheduled-task-create-form/spec.md#L98-L107) · 1.3.0 (2026-11-12)

- [ ] **12. Retake a screenshot.** Sidebar → Scheduled tasks → New task → Repeat → Custom
  - **What changed:** The Custom repeat fields are now Time, Days, Start date, and End date.
  - **Where:** `2.scheduled-tasks.md`, section "Details", line 82
  - **Image:** `img/scheduled-task-custom-repeat.png`
  - **Capture:** the Custom repeat fields of the task form: Time, Days with two or more day buttons selected, Start date, and End date; alt text: "The Custom repeat fields: Time, Days, Start date, and End date"
  - **Source:** [epam/ai-dial-chat#9728](https://github.com/epam/ai-dial-chat/pull/9728), [`scheduled-task-create-form/spec.md#L98-L107`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/scheduled-task-create-form/spec.md#L98-L107) · 1.3.0 (2026-11-12)

- [ ] **13. Replace text.** Sidebar → Scheduled tasks → New task → Repeat → Custom
  - **What changed:** Alt text of the retaken image no longer names Every.
  - **Where:** `2.scheduled-tasks.md`, section "Details", line 82
  - **Replace:** `The Custom repeat fields: Every, Time, and the day buttons` → `The Custom repeat fields: Time, Days, Start date, and End date`
  - **Source:** [epam/ai-dial-chat#9728](https://github.com/epam/ai-dial-chat/pull/9728), [`scheduled-task-create-form/spec.md#L98-L107`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/scheduled-task-create-form/spec.md#L98-L107) · 1.3.0 (2026-11-12)

- [ ] **14. Replace text.** Sidebar → Scheduled tasks → New task → Repeat → Custom
  - **What changed:** A Custom task repeats weekly on each chosen day, with optional start and end dates; the 1 to 10 week interval and its calendar-week note are gone (ai-dial-chat 1.3.0).
  - **Where:** `2.scheduled-tasks.md`, section "Details", line 84
  - **Replace:** `A **Custom** task runs on the chosen weekday every 1 to 10 weeks, with no start or end date, until you pause or delete it. It counts calendar weeks of the year, so the count restarts every January. For intervals of three weeks or more, the gap across New Year can be shorter than the interval you chose.` → `A **Custom** task runs every week on each chosen weekday, between its optional start and end dates, until you pause or delete it.`
  - **Source:** [epam/ai-dial-chat#9728](https://github.com/epam/ai-dial-chat/pull/9728), [`scheduled-task-create-form/spec.md#L98-L107`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/scheduled-task-create-form/spec.md#L98-L107) · 1.3.0 (2026-11-12)

- [ ] **15. Add text.** Sidebar → Scheduled tasks → a task → Edit
  - **What changed:** When the saved model, agent, or skill was deleted or access was revoked, the field shows its name with "(unavailable)" and a tooltip (ai-dial-chat 1.3.0).
  - **Where:** `2.scheduled-tasks.md`, section "Configuration", line 96
  - **Text:** - If the model, agent, or skill saved in a task was deleted, or your access to it was revoked, the field shows its name followed by **(unavailable)**. Point the cursor at it to read why: "The model or agent has been deleted or access revoked" or "The skill has been deleted or access revoked".
  - **Source:** [epam/ai-dial-chat#9699](https://github.com/epam/ai-dial-chat/pull/9699), [`scheduled-task-resource-availability/spec.md#L1-L24`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/scheduled-task-resource-availability/spec.md#L1-L24) · 1.3.0 (2026-11-12)

### Models — `3.catalog/1.models.md`

- [ ] **16. Add text.** Sidebar → Catalog → Models → a model → Overview
  - **What changed:** The Specification list gains Deprecation date when DIAL Core reports one (ai-dial-chat 1.3.2).
  - **Where:** `3.catalog/1.models.md`, section "Overview", line 54
  - **Text:** | **Deprecation date** | When the model is due to be deprecated. It appears only when your DIAL Core reports a date. |
  - **Source:** [epam/ai-dial-chat#9862](https://github.com/epam/ai-dial-chat/pull/9862), [`map-entity-details-to-catalog.ts#L152-L222`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/chat-hooks/src/catalog/map-entity-details-to-catalog.ts#L152-L222) · 1.3.2 (2026-11-16)

- [ ] **17. Add text.** Sidebar → Catalog → Models → a model → Overview
  - **What changed:** The Specification list gains End of service when DIAL Core reports one (ai-dial-chat 1.3.2).
  - **Where:** `3.catalog/1.models.md`, section "Overview", line 54
  - **Text:** | **End of service** | When the model stops being served. It appears only when your DIAL Core reports a date. |
  - **Source:** [epam/ai-dial-chat#9862](https://github.com/epam/ai-dial-chat/pull/9862), [`map-entity-details-to-catalog.ts#L152-L222`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/chat-hooks/src/catalog/map-entity-details-to-catalog.ts#L152-L222) · 1.3.2 (2026-11-16)

- [ ] **18. Retake a screenshot.** Sidebar → Catalog → Models → a model → Overview
  - **What changed:** The Overview tab can show Deprecation date and End of service in its Specification list.
  - **Where:** `3.catalog/1.models.md`, section "Overview", line 56
  - **Image:** `3.catalog/img/catalog-model-overview-tab.png`
  - **Capture:** the Overview tab of a model that reports a deprecation date and an end of service, with Capabilities and the whole Specification list visible; alt text: "The Overview tab with capabilities and specification"
  - **Source:** [epam/ai-dial-chat#9862](https://github.com/epam/ai-dial-chat/pull/9862), [`map-entity-details-to-catalog.ts#L152-L222`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/chat-hooks/src/catalog/map-entity-details-to-catalog.ts#L152-L222) · 1.3.2 (2026-11-16)

- [ ] **19. Add text.** Sidebar → Catalog → Models → a model → Limits
  - **What changed:** The Limits tab ends with a note that these are model-specific limits and links to the Usage page (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/1.models.md`, section "Limits", line 75
  - **Text:** The tab ends with a note, "Model-specific limits only. To view your full usage limits, go to the Usage limits page." Its **Usage limits** link opens the [Usage](../6.usage-and-settings.md#usage) page.
  - **Source:** [`CatalogView.tsx#L788-L795`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/components/CatalogView/CatalogView.tsx#L788-L795) · 1.3.0 (2026-11-12)

- [ ] **20. Retake a screenshot.** Sidebar → Catalog → Models → a model → Limits
  - **What changed:** The Limits tab ends with the new note.
  - **Where:** `3.catalog/1.models.md`, section "Limits", line 77
  - **Image:** `3.catalog/img/catalog-model-limits-tab.png`
  - **Capture:** the Limits tab with token usage for today, this week, and this month, and the closing note with its Usage limits link; alt text: "The Limits tab with token usage for today, this week, and this month"
  - **Source:** [`Limits.tsx#L56`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/catalog/src/components/Details/TabsContent/Limits/Limits.tsx#L56) · 1.3.0 (2026-11-12)

### Agents — `3.catalog/2.agents.md`

- [ ] **21. Replace text.** Catalog → Create → Quick App → Configuration → Settings → Advanced
  - **What changed:** The Built-in file tools switch is gone, so the "where to find what" row no longer lists file tools (quickapps-frontend 0.3.2).
  - **Where:** `3.catalog/2.agents.md`, section "Build a Quick App", line 151
  - **Replace:** `Set the temperature, time awareness, file tools, or web access` → `Set the temperature, time awareness, file processing, or web access`
  - **Source:** [epam/ai-dial-quickapps-frontend#335](https://github.com/epam/ai-dial-quickapps-frontend/pull/335), [`AdvancedSettingsPopup.tsx#L157-L234`](https://github.com/epam/ai-dial-quickapps-frontend/blob/0.4.0/src/components/Settings/AdvancedSettingsPopup/AdvancedSettingsPopup.tsx#L157-L234) · 0.3.2 (2026-11-06)

- [ ] **22. Add text.** Catalog → Create → Quick App → Add-ons → Toolsets → a toolset defined in Edit JSON
  - **What changed:** A toolset that exists only in the app's JSON now opens its details, with the Tools tab and no About tab (quickapps-frontend 0.4.0).
  - **Where:** `3.catalog/2.agents.md`, section "Add toolsets", line 211
  - **Text:** A toolset that exists only in the agent's JSON, for example one added through [Edit JSON](#edit-json), opens a details window with the **Tools** tab only. If the JSON has no usable definition, the window says "This toolset is defined in the application's JSON configuration and has no catalog details."
  - **Source:** [epam/ai-dial-quickapps-frontend#338](https://github.com/epam/ai-dial-quickapps-frontend/pull/338), [`ToolsetDetailsPopup.tsx#L71-L85`](https://github.com/epam/ai-dial-quickapps-frontend/blob/0.4.0/src/components/Toolsets/ToolsetDetailsPopup/ToolsetDetailsPopup.tsx#L71-L85) · 0.4.0 (2026-11-12)

- [ ] **23. Add text.** Catalog → Create → Quick App → Configuration → Settings → Advanced
  - **What changed:** A new Quick App starts with Time awareness, Process files, Add attachments to the orchestrator response, and Fetch web resources on (quickapps-frontend 0.3.2).
  - **Where:** `3.catalog/2.agents.md`, section "Advanced settings", line 274
  - **Text:** A new Quick App starts with **Time awareness**, **Process files**, **Add attachments to the orchestrator response**, and **Fetch web resources** turned on, unless the app type sets other defaults. **Process files** appears only for a model that accepts attachments, and the last two appear only when your deployment enables them.
  - **Source:** [epam/ai-dial-quickapps-frontend#310](https://github.com/epam/ai-dial-quickapps-frontend/pull/310), [epam/ai-dial-quickapps-frontend#304](https://github.com/epam/ai-dial-quickapps-frontend/pull/304), [`quick-app-form-data.ts#L98-L123`](https://github.com/epam/ai-dial-quickapps-frontend/blob/0.4.0/src/form/quick-app-form-data.ts#L98-L123) · 0.3.2 (2026-11-06)

- [ ] **24. Retake a screenshot.** Catalog → Create → Quick App → Configuration → Settings → Advanced
  - **What changed:** The Advanced settings window lost the Built-in file tools switch (quickapps-frontend 0.3.2).
  - **Where:** `3.catalog/2.agents.md`, section "Advanced settings", line 276
  - **Image:** `3.catalog/img/quickapp-advanced-settings.png`
  - **Capture:** the whole Advanced settings window of a new Quick App with the Temperature slider and every switch visible; use a model that accepts attachments and a deployment that enables adding attachments and web fetch, so no row is missing; alt text: "The Advanced settings window"
  - **Source:** [epam/ai-dial-quickapps-frontend#335](https://github.com/epam/ai-dial-quickapps-frontend/pull/335), [`AdvancedSettingsPopup.tsx#L128-L156`](https://github.com/epam/ai-dial-quickapps-frontend/blob/0.4.0/src/components/Settings/AdvancedSettingsPopup/AdvancedSettingsPopup.tsx#L128-L156) · 0.3.2 (2026-11-06)

- [ ] **25. Replace text.** Catalog → Create → Quick App → Configuration → Settings → Advanced → Temperature
  - **What changed:** The Temperature slider is labeled Cold, Neutral, and Hot (quickapps-frontend 0.3.2).
  - **Where:** `3.catalog/2.agents.md`, section "Advanced settings", line 280
  - **Replace:** `from Precise to Creative` → `from Cold to Hot`
  - **Source:** [epam/ai-dial-quickapps-frontend#275](https://github.com/epam/ai-dial-quickapps-frontend/pull/275), [`en.json#L283-L284`](https://github.com/epam/ai-dial-quickapps-frontend/blob/0.4.0/src/i18n/locales/en.json#L283-L284) · 0.3.2 (2026-11-06)

- [ ] **26. Remove text.** Catalog → Create → Quick App → Configuration → Settings → Advanced
  - **What changed:** The Built-in file tools switch is gone; the Quick App backend gives every app its file tools by default (quickapps-frontend 0.3.2, quickapps-backend 0.14.0).
  - **Where:** `3.catalog/2.agents.md`, section "Advanced settings", line 283
  - **Remove:** lines 283–283, the Built-in file tools row of the Advanced settings table
  - **Source:** [epam/ai-dial-quickapps-frontend#335](https://github.com/epam/ai-dial-quickapps-frontend/pull/335), [epam/ai-dial-quickapps-backend#710](https://github.com/epam/ai-dial-quickapps-backend/pull/710), [0.14.0 notes](https://github.com/epam/ai-dial-quickapps-backend/releases/tag/0.14.0), [`application.py#L219-L227`](https://github.com/epam/ai-dial-quickapps-backend/blob/0.14.2/src/quickapp/config/application.py#L219-L227) · 0.3.2 (2026-11-06), 0.14.0 (2026-11-12)

- [ ] **27. Add text.** Catalog → Create → Quick App → Save
  - **What changed:** Save opens a Save panel with a folder and a version choice before the agent is saved (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/2.agents.md`, section "Preview and save", line 306
  - **Text:** **Save** opens a **Save** panel. **Save to folder** shows where the agent will be stored; click **Change** to pick another folder. **Version** offers **Keep version** with the current version, or **Save as new version**, which asks for a **New version**. The panel opens when you create an agent or edit one you own; an agent shared with you saves in place.
  - **Source:** [epam/ai-dial-chat#9730](https://github.com/epam/ai-dial-chat/pull/9730), [`resource-save-panel/spec.md#L6-L12`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/resource-save-panel/spec.md#L6-L12) · 1.3.0 (2026-11-12)

- [ ] **28. Add a screenshot.** Catalog → Create → Quick App → Save
  - **What changed:** The new Save panel has no screenshot.
  - **Where:** `3.catalog/2.agents.md`, section "Preview and save", line 306
  - **New image:** `3.catalog/img/quickapp-save-panel.png`
  - **Capture:** the Save panel of a Quick App you own, opened with Save, with Save as new version selected so New version shows, and the Save to folder row with Change; alt text: "The Save panel with a folder and a version choice"
  - **Source:** [epam/ai-dial-chat#9730](https://github.com/epam/ai-dial-chat/pull/9730), [`resource-save-panel/spec.md#L47-L61`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/resource-save-panel/spec.md#L47-L61) · 1.3.0 (2026-11-12)

- [ ] **29. Replace text.** Catalog → Create → Quick App → Metadata → Name and Version → Save
  - **What changed:** The duplicate message names the agent and the folder (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/2.agents.md`, section "Preview and save", line 309
  - **Replace:** `An application with this name and version already exists.` → `An agent with this name and version already exists in this folder.`
  - **Source:** [epam/ai-dial-chat#9762](https://github.com/epam/ai-dial-chat/pull/9762), [`resource-name-conflict.ts#L9-L14`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/utils/resource-name-conflict.ts#L9-L14) · 1.3.0 (2026-11-12)

- [ ] **30. Add text.** Catalog → Create → Custom App → Setup → Create
  - **What changed:** Create opens the same Save panel for a Custom App (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/2.agents.md`, section "Setup", line 344
  - **Text:** **Create** opens the same **Save** panel as a Quick App; see [Preview and save](#preview-and-save).
  - **Source:** [epam/ai-dial-chat#9730](https://github.com/epam/ai-dial-chat/pull/9730), [`resource-save-panel/spec.md#L6-L12`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/resource-save-panel/spec.md#L6-L12) · 1.3.0 (2026-11-12)

### Toolsets — `3.catalog/3.toolsets.md`

- [ ] **31. Replace text.** Catalog → Create → Toolset → Version
  - **What changed:** Version accepts only letters, digits, dots, underscores, and dashes (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/3.toolsets.md`, section "Create a toolset", line 146
  - **Replace:** `Defaults to `0.0.1`.` → `Defaults to `0.0.1`. Use only letters, digits, dots, underscores, and dashes.`
  - **Source:** [epam/ai-dial-chat#9702](https://github.com/epam/ai-dial-chat/pull/9702), [`ToolsetEditor.tsx#L482`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/toolset-editor/src/components/ToolsetEditor/ToolsetEditor.tsx#L482) · 1.3.0 (2026-11-12)

- [ ] **32. Retake a screenshot.** Catalog → Create → Toolset → Authentication → OAuth → Custom login
  - **What changed:** Custom login has a new Resource field after Scopes.
  - **Where:** `3.catalog/3.toolsets.md`, section "Choose how it authenticates", line 165
  - **Image:** `3.catalog/img/toolset-editor-oauth.png`
  - **Capture:** the OAuth authentication mode with Custom login chosen and every field visible, Scopes and Resource included; alt text: "The OAuth authentication mode, with custom login fields"
  - **Source:** [epam/ai-dial-chat#9702](https://github.com/epam/ai-dial-chat/pull/9702), [`AuthSection.tsx#L388-L398`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/toolset-editor/src/components/AuthSection/AuthSection.tsx#L388-L398) · 1.3.0 (2026-11-12)

- [ ] **33. Replace text.** Catalog → Create → Toolset → Authentication → OAuth → Custom login
  - **What changed:** Authorization endpoint is required for Custom login (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/3.toolsets.md`, section "Choose how it authenticates", line 171
  - **Replace:** `Authorization endpoint | No |` → `Authorization endpoint | Yes |`
  - **Source:** [epam/ai-dial-chat#9702](https://github.com/epam/ai-dial-chat/pull/9702), [`ToolsetEditor.tsx#L312-L336`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/toolset-editor/src/components/ToolsetEditor/ToolsetEditor.tsx#L312-L336) · 1.3.0 (2026-11-12)

- [ ] **34. Replace text.** Catalog → Create → Toolset → Authentication → OAuth → Custom login
  - **What changed:** Token endpoint is required for Custom login (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/3.toolsets.md`, section "Choose how it authenticates", line 172
  - **Replace:** `Token endpoint | No |` → `Token endpoint | Yes |`
  - **Source:** [epam/ai-dial-chat#9702](https://github.com/epam/ai-dial-chat/pull/9702), [`ToolsetEditor.tsx#L312-L336`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/toolset-editor/src/components/ToolsetEditor/ToolsetEditor.tsx#L312-L336) · 1.3.0 (2026-11-12)

- [ ] **35. Add text.** Catalog → Create → Toolset → Authentication → OAuth → Custom login → Resource
  - **What changed:** A new optional Resource field follows Scopes (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/3.toolsets.md`, section "Choose how it authenticates", line 173
  - **Text:**   | Resource | No | The resource the token is requested for: an absolute URI without a fragment. |
  - **Source:** [epam/ai-dial-chat#9702](https://github.com/epam/ai-dial-chat/pull/9702), [`AuthSection.tsx#L388-L398`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/toolset-editor/src/components/AuthSection/AuthSection.tsx#L388-L398) · 1.3.0 (2026-11-12)

- [ ] **36. Add text.** Catalog → Create → Toolset → Create
  - **What changed:** Create opens the Save panel with a folder and a version choice (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/3.toolsets.md`, section "Choose how it authenticates", line 177
  - **Text:** **Create** opens the **Save** panel, where you pick the folder and, when you edit a toolset you own, whether to keep the version or save a new one. See [Preview and save](./2.agents.md#preview-and-save).
  - **Source:** [epam/ai-dial-chat#9730](https://github.com/epam/ai-dial-chat/pull/9730), [`ToolsetApplicationEditor.tsx#L552`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/pages/ApplicationEditor/toolset/ToolsetApplicationEditor.tsx#L552) · 1.3.0 (2026-11-12)

### Skills — `3.catalog/4.skills.md`

- [ ] **37. Retake a screenshot.** Catalog → Skills → a skill → Overview
  - **What changed:** The Overview tab labels the author "Created by" (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/4.skills.md`, section "Details panel", line 37
  - **Image:** `3.catalog/img/catalog-skill-overview-tab.png`
  - **Capture:** the Overview tab of a skill, with Created by, last updated, and file count; alt text: "The Overview tab with Created by, last updated, and file count"
  - **Source:** [`catalog.ts#L122`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/utils/catalog.ts#L122) · 1.3.0 (2026-11-12)

- [ ] **38. Replace text.** Catalog → Skills → a skill → Overview
  - **What changed:** Alt text of the retaken image names Created by.
  - **Where:** `3.catalog/4.skills.md`, section "Details panel", line 37
  - **Replace:** `with author, last updated` → `with Created by, last updated`
  - **Source:** [`catalog.ts#L122`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/utils/catalog.ts#L122) · 1.3.0 (2026-11-12)

- [ ] **39. Add text.** Catalog → Create → Skill → Create
  - **What changed:** Create opens the Save panel with a folder choice (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/4.skills.md`, section "Create a skill", line 104
  - **Text:** **Create** opens the **Save** panel, where you pick the folder. See [Preview and save](./2.agents.md#preview-and-save).
  - **Source:** [epam/ai-dial-chat#9730](https://github.com/epam/ai-dial-chat/pull/9730), [`SkillEditor.tsx#L718`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/pages/SkillEditor/SkillEditor.tsx#L718) · 1.3.0 (2026-11-12)

- [ ] **40. Add text.** Catalog → Skills → a skill → ··· → Edit
  - **What changed:** In the skill editor, Name cannot be changed after creation (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/4.skills.md`, section "Edit a skill", line 108
  - **Text:** The **Name** is fixed after you create the skill, so the editor shows it read-only: "The skill name can't be changed after creation".
  - **Source:** [`SkillEditor.tsx#L1053`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/skill-editor/src/components/SkillEditor/SkillEditor.tsx#L1053) · 1.3.0 (2026-11-12)

### Prompts — `3.catalog/5.prompts.md`

- [ ] **41. Retake a screenshot.** Catalog → Prompts → a prompt → Overview
  - **What changed:** The Overview tab labels the author "Created by" (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/5.prompts.md`, section "Details panel", line 34
  - **Image:** `3.catalog/img/catalog-prompt-overview-tab.png`
  - **Capture:** the Overview tab of a prompt, with Created by and last updated; alt text: "The Overview tab with Created by and last updated"
  - **Source:** [`catalog.ts#L122`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/utils/catalog.ts#L122) · 1.3.0 (2026-11-12)

- [ ] **42. Replace text.** Catalog → Prompts → a prompt → Overview
  - **What changed:** Alt text of the retaken image names Created by.
  - **Where:** `3.catalog/5.prompts.md`, section "Details panel", line 34
  - **Replace:** `with author and last updated` → `with Created by and last updated`
  - **Source:** [`catalog.ts#L122`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/utils/catalog.ts#L122) · 1.3.0 (2026-11-12)

- [ ] **43. Add text.** Catalog → Create → Prompt → Save
  - **What changed:** Save opens the Save panel with a folder choice (ai-dial-chat 1.3.0).
  - **Where:** `3.catalog/5.prompts.md`, section "Create a prompt", line 80
  - **Text:** **Save** opens the **Save** panel, where you pick the folder. A prompt has no version choice. See [Preview and save](./2.agents.md#preview-and-save).
  - **Source:** [epam/ai-dial-chat#9730](https://github.com/epam/ai-dial-chat/pull/9730), [`PromptEditor.tsx#L419`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/pages/PromptEditor/PromptEditor.tsx#L419) · 1.3.0 (2026-11-12)

### File Manager — `4.files.md`

- [ ] **44. Retake a screenshot.** Sidebar → File Manager → a file → ···
  - **What changed:** A file's ··· menu has a new Preview action (ai-dial-chat 1.3.0).
  - **Where:** `4.files.md`, section "File and folder actions", line 64
  - **Image:** `img/file-actions-menu.png`
  - **Capture:** the ··· menu of a file that can be previewed, such as a .pdf or .md file, with Preview in the list; alt text: "The actions menu for a file: Duplicate, Copy to, Move to, Download, Preview, Delete, Rename, Info, Remove access" (list the items in the order the menu shows them)
  - **Source:** [epam/ai-dial-chat#9488](https://github.com/epam/ai-dial-chat/pull/9488), [`DialFileManagerPage.tsx#L294`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/pages/DialFileManagerPage/DialFileManagerPage.tsx#L294) · 1.3.0 (2026-11-12)

- [ ] **45. Replace text.** Sidebar → File Manager → a file → ···
  - **What changed:** Alt text of the retaken image lists Preview; put it where the menu shows it.
  - **Where:** `4.files.md`, section "File and folder actions", line 64
  - **Replace:** `Download, Delete, Rename, Info, Remove access` → `Download, Preview, Delete, Rename, Info, Remove access`
  - **Source:** [epam/ai-dial-chat#9488](https://github.com/epam/ai-dial-chat/pull/9488), [`DialFileManagerPage.tsx#L294`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/pages/DialFileManagerPage/DialFileManagerPage.tsx#L294) · 1.3.0 (2026-11-12)

- [ ] **46. Add text.** Sidebar → File Manager → a file → ··· → Preview
  - **What changed:** Preview opens a text, data, HTML, PDF, Office, or image file in a side panel, and clicking a file row opens the same preview (ai-dial-chat 1.3.0).
  - **Where:** `4.files.md`, section "File and folder actions", line 68
  - **Text:** - **Preview** — opens the file in a side panel. It works for text and data files, HTML, PDF, Office files, and images. Clicking a file's row opens the same preview.
  - **Source:** [epam/ai-dial-chat#9488](https://github.com/epam/ai-dial-chat/pull/9488), [`DialFileManagerPage.tsx#L294`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/pages/DialFileManagerPage/DialFileManagerPage.tsx#L294) · 1.3.0 (2026-11-12)

### Sharing and publishing — `5.sharing-and-publishing.md`

- [ ] **47. Replace text.** Sidebar → Chats and tasks → a conversation → ··· → Share
  - **What changed:** The expiry note counts hours when the link has less than a day left (ai-dial-chat 1.3.0).
  - **Where:** `5.sharing-and-publishing.md`, section "Share an item", line 45
  - **Replace:** `the panel shows how many days.` → `the panel shows how many days it stays active, or how many hours when less than a day is left.`
  - **Source:** [epam/ai-dial-chat#9454](https://github.com/epam/ai-dial-chat/pull/9454), [`share.ts#L13-L25`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/utils/share.ts#L13-L25) · 1.3.0 (2026-11-12)

- [ ] **48. Replace text.** Another account → open a share link
  - **What changed:** A share link at its limit names the item; an expired or revoked link has its own message (ai-dial-chat 1.3.0).
  - **Where:** `5.sharing-and-publishing.md`, section "Share an item", line 51
  - **Replace:** `further people see "This share link is invalid or has expired."` → `further people see "<item name>" has already been shared with the maximum specified number of users. A link that has expired or was revoked shows "We are sorry, but the link you are trying to access has expired or does not exist."`
  - **Source:** [epam/ai-dial-chat#9444](https://github.com/epam/ai-dial-chat/pull/9444), [`share-invitation-error.ts#L35-L66`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/chat-hooks/src/share-invitation/share-invitation-error.ts#L35-L66) · 1.3.0 (2026-11-12)

- [ ] **49. Retake a screenshot.** Sidebar → Chats and tasks → an item → ··· → Publish
  - **What changed:** The Publish form has a destination row with Choose or Change, an admin-approval notice, and a Private dependencies list (ai-dial-chat 1.3.0, 1.3.1).
  - **Where:** `5.sharing-and-publishing.md`, section "Publish an item", line 118
  - **Image:** `img/publish-form.png`
  - **Capture:** the Publish form of an agent that depends on a private toolset, with Publish to folder and its row, Author, the access rules, Private dependencies, and the Admin approval required notice; alt text: "The Publish form: folder row, author field, access rules, and private dependencies"
  - **Source:** [epam/ai-dial-chat#9743](https://github.com/epam/ai-dial-chat/pull/9743), [epam/ai-dial-chat#9812](https://github.com/epam/ai-dial-chat/pull/9812), [`PublishPanel.tsx#L461-L505`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/publish-panel/src/components/PublishPanel/PublishPanel.tsx#L461-L505) · 1.3.1 (2026-11-12)

- [ ] **50. Replace text.** Sidebar → Chats and tasks → an item → ··· → Publish
  - **What changed:** Alt text of the retaken image names the new parts.
  - **Where:** `5.sharing-and-publishing.md`, section "Publish an item", line 118
  - **Replace:** `The Publish form: folder picker, author field, and access rules` → `The Publish form: folder row, author field, access rules, and private dependencies`
  - **Source:** [epam/ai-dial-chat#9743](https://github.com/epam/ai-dial-chat/pull/9743), [`PublishPanel.tsx#L461-L505`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/publish-panel/src/components/PublishPanel/PublishPanel.tsx#L461-L505) · 1.3.1 (2026-11-12)

- [ ] **51. Replace text.** Sidebar → Chats and tasks → an item → ··· → Publish → Publish to folder
  - **What changed:** The destination is a row with the chosen path and a Choose or Change button that opens a folder view (ai-dial-chat 1.3.0).
  - **Where:** `5.sharing-and-publishing.md`, section "Publish an item", line 124
  - **Replace:** `Search the tree, or use **Create new folder**.` → `The row shows the chosen path. Click **Choose**, or **Change** once a folder is set, to open the folder view, where you can search, use **Create new folder**, or add a sibling or child folder.`
  - **Source:** [epam/ai-dial-chat#9743](https://github.com/epam/ai-dial-chat/pull/9743), [`PublishPanel.tsx#L461-L505`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/publish-panel/src/components/PublishPanel/PublishPanel.tsx#L461-L505) · 1.3.0 (2026-11-12)

- [ ] **52. Add text.** Sidebar → Chats and tasks → an item → ··· → Publish → Private dependencies
  - **What changed:** When the item uses your private resources, a Private dependencies list follows the access rules (ai-dial-chat 1.3.0).
  - **Where:** `5.sharing-and-publishing.md`, section "Publish an item", line 127
  - **Text:** If the item depends on your private resources, such as a toolset only you can see, a **Private dependencies** list follows the access rules and shows the type of each dependency.
  - **Source:** [epam/ai-dial-chat#9812](https://github.com/epam/ai-dial-chat/pull/9812), [`en.json#L623`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/i18n/locales/en.json#L623) · 1.3.0 (2026-11-12)

- [ ] **53. Add text.** Sidebar → Chats and tasks → an item → ··· → Publish
  - **What changed:** An "Admin approval required" notice says the request goes to your organization's admin (ai-dial-chat 1.3.1).
  - **Where:** `5.sharing-and-publishing.md`, section "Publish an item", line 127
  - **Text:** An **Admin approval required** notice says that a request goes to your organization's admin, and that the item appears in the folder once it is approved.
  - **Source:** [epam/ai-dial-chat#9843](https://github.com/epam/ai-dial-chat/pull/9843), [`en.json#L610-L612`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/i18n/locales/en.json#L610-L612) · 1.3.1 (2026-11-12)

- [ ] **54. Add text.** Sidebar → Chats and tasks → an item → ··· → Publish
  - **What changed:** The form warns when the folder already has the version or you cannot publish to it (ai-dial-chat 1.3.0).
  - **Where:** `5.sharing-and-publishing.md`, section "Publish an item", line 127
  - **Text:** The form warns you when the folder already holds this version ("Version <version> is already published in <folder>.") or when you cannot publish there ("You don't have permission to publish to <folder>. Pick another, or ask an owner for access."). Choose another folder or version.
  - **Source:** [epam/ai-dial-chat#9743](https://github.com/epam/ai-dial-chat/pull/9743), [`en.json#L610-L636`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/i18n/locales/en.json#L610-L636) · 1.3.0 (2026-11-12)

### Usage and settings — `6.usage-and-settings.md`

- [ ] **55. Add text.** Sidebar → bar-chart icon → Usage → Budgets (when your deployment enables spending budgets)
  - **What changed:** The Usage page can show a Budgets section when spending limits are on (ai-dial-chat 1.3.5).
  - **Where:** `6.usage-and-settings.md`, section "Usage", line 69
  - **Text:** When your administrator turns on spending budgets, a **Budgets** section appears under the cost cards. It lists each budget with the models it covers (**All models** or **Models:** and names). Each request is charged to the first budget in the list that covers the model and has not run out. In test mode a notice says the budgets do not limit requests yet and the limits above still apply. When budgets are enforced, only the budgets show, and your role's cost limits no longer appear on the cards, the model rows, the usage banner, or the usage dial. With no budget assigned, requests to models are rejected.
  - **Source:** [1.3.5 release notes](https://github.com/epam/ai-dial-chat/releases/tag/1.3.5), [`UsageTab.tsx#L303-L320`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/pages/SettingsPage/UsageTab/UsageTab.tsx#L303-L320) · 1.3.5 (2026-11-17)

- [ ] **56. Add a screenshot.** Sidebar → bar-chart icon → Usage → Budgets (when your deployment enables spending budgets)
  - **What changed:** The Budgets section has no screenshot.
  - **Where:** `6.usage-and-settings.md`, section "Usage", line 69
  - **New image:** `img/usage-budgets.png`
  - **Capture:** the Usage page of a deployment with spending budgets in test mode (SPENDING_LIMITS_MODE=shadow), with the cost cards and the Budgets section and its notice; alt text: "The Usage page with the Budgets section under the cost cards"
  - **Source:** [1.3.5 release notes](https://github.com/epam/ai-dial-chat/releases/tag/1.3.5), [`config-registry.constants.ts#L794-L812`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat-api/src/app-config/config-registry/config-registry.constants.ts#L794-L812) · 1.3.5 (2026-11-17)

## Changes in the releases

### DIAL Chat — `epam/ai-dial-chat` 1.2.22 → 1.3.7

- **Scheduled tasks: **Custom** repeat picks one or more weekdays, has **Start date** and **End date**, and no **Every** field** (1.3.0, 2026-11-12): The task card reads like a weekly task. Guide: items 8, 9, 10, 11, 12, 13, 14. [epam/ai-dial-chat#9728](https://github.com/epam/ai-dial-chat/pull/9728), [1.3.0](https://github.com/epam/ai-dial-chat/releases/tag/1.3.0)
- **Scheduled tasks: a deleted or unshared model, agent, or skill shows "(unavailable)"** (1.3.0, 2026-11-12): Guide: item 15. [epam/ai-dial-chat#9699](https://github.com/epam/ai-dial-chat/pull/9699)
- **A **Save** panel opens when you save an agent, toolset, prompt, or skill, with **Save to folder** and, for agents and toolsets, a version choice** (1.3.0, 2026-11-12): Guide: items 27, 28, 30, 36, 39, 43. [epam/ai-dial-chat#9730](https://github.com/epam/ai-dial-chat/pull/9730), [1.3.0](https://github.com/epam/ai-dial-chat/releases/tag/1.3.0)
- **Duplicate agent or toolset names are refused with "…already exists in this folder."** (1.3.0, 2026-11-12): Guide: item 29. [epam/ai-dial-chat#9762](https://github.com/epam/ai-dial-chat/pull/9762)
- **Toolset editor: **Custom login** needs both endpoints, has a **Resource** field, and **Version** has a character rule** (1.3.0, 2026-11-12): Guide: items 31, 32, 33, 34, 35. [epam/ai-dial-chat#9702](https://github.com/epam/ai-dial-chat/pull/9702)
- **Publish form: a destination row with **Choose** or **Change**, a folder view, a **Private dependencies** list, an **Admin approval required** notice, and version and permission warnings** (1.3.0 to 1.3.2, 2026-11-12 to 2026-11-16): The **Publish** button became the primary button in 1.3.2. Guide: items 49, 50, 51, 52, 53, 54. [epam/ai-dial-chat#9743](https://github.com/epam/ai-dial-chat/pull/9743), [epam/ai-dial-chat#9812](https://github.com/epam/ai-dial-chat/pull/9812), [epam/ai-dial-chat#9829](https://github.com/epam/ai-dial-chat/pull/9829), [epam/ai-dial-chat#9843](https://github.com/epam/ai-dial-chat/pull/9843), [epam/ai-dial-chat#9861](https://github.com/epam/ai-dial-chat/pull/9861), [1.3.1](https://github.com/epam/ai-dial-chat/releases/tag/1.3.1), [1.3.2](https://github.com/epam/ai-dial-chat/releases/tag/1.3.2)
- **Share panel counts hours when under a day, and a full share link names the item** (1.3.0, 2026-11-12): Guide: items 47, 48. [epam/ai-dial-chat#9454](https://github.com/epam/ai-dial-chat/pull/9454), [epam/ai-dial-chat#9444](https://github.com/epam/ai-dial-chat/pull/9444)
- **Usage page: **Budgets** section when spending limits are on** (1.3.5, 2026-11-17): Only when `SPENDING_LIMITS_MODE` is `shadow` or `enforce` (default `off`; it must match DIAL Core). Guide: items 55, 56. [1.3.5](https://github.com/epam/ai-dial-chat/releases/tag/1.3.5)
- **Model **Overview**: **Deprecation date** and **End of service**** (1.3.2, 2026-11-16): Each shows only when DIAL Core reports a value. Guide: items 16, 17, 18. [epam/ai-dial-chat#9862](https://github.com/epam/ai-dial-chat/pull/9862)
- **Model **Limits** tab ends with a note that links to the Usage page** (1.3.0, 2026-11-12): Guide: items 19, 20
- **Prompt and skill **Overview** tabs say **Created by**, not **Author**** (1.3.0, 2026-11-12): Guide: items 37, 38, 41, 42. The publish form still says **Author**.
- **A conversation shows when it started, and each message shows its send time** (1.3.0, 2026-11-12): Guide: items 2, 5, 6, 7. [epam/ai-dial-chat#9471](https://github.com/epam/ai-dial-chat/pull/9471)
- **Citations name the PDF page** (1.3.0, 2026-11-12): Guide: items 3, 4. [epam/ai-dial-chat#9710](https://github.com/epam/ai-dial-chat/pull/9710)
- **File Manager: **Preview** action, and a click on a file row opens the preview** (1.3.0, 2026-11-12): Guide: items 44, 45, 46. [epam/ai-dial-chat#9488](https://github.com/epam/ai-dial-chat/pull/9488)
- **Unsent composer text is kept per conversation** (1.3.0, 2026-11-12): Only when `conversation-drafts` is in `ENABLED_UI_FEATURES` (on in the 1.3.7 defaults). Guide: item 1. [epam/ai-dial-chat#9450](https://github.com/epam/ai-dial-chat/pull/9450)
- **Skill editor: **Name** is read-only after creation; skill folders open as a list; an upload of an existing name asks "Replace or duplicate it?"** (1.3.0, 2026-11-12): Guide: item 40; the other two are under Needs review.
- **Projects: sidebar entry, project pages, sharing and publishing a project** (1.3.0 and 1.3.1): Only when `PROJECTS_ENABLED` is true (default `false`). No page covers it; see Needs review.
- **A link can preselect a model, skill, or prompt (`deployment-id`, `skill-id`)** (1.3.0, 2026-11-12): No page covers it; see Needs review. [epam/ai-dial-chat#9627](https://github.com/epam/ai-dial-chat/pull/9627)
- **First-visit onboarding tour (preview)** (1.3.4, 2026-11-17): Only when `ONBOARDING_HINTS` holds hints (default `[]`). See Needs review. [epam/ai-dial-chat#9815](https://github.com/epam/ai-dial-chat/pull/9815)
- **Announcements can carry a severity (`info` or `warning`)** (1.3.2, 2026-11-16): See Needs review. [epam/ai-dial-chat#9851](https://github.com/epam/ai-dial-chat/pull/9851)
- **Quick App and toolset editors have a draggable divider between **Metadata** and the setup area** (1.3.0, 2026-11-12): See Needs review. [epam/ai-dial-chat#9461](https://github.com/epam/ai-dial-chat/pull/9461)
- **Applications with a custom viewer open in an embedded frame** (1.3.0, 2026-11-12): See Needs review.

### DIAL Quick Apps editor — `epam/ai-dial-quickapps-frontend` 0.3.1 → 0.4.0

- ****Temperature** is labeled **Cold**, **Neutral**, and **Hot**** (0.3.2, 2026-11-06): Guide: item 25. [epam/ai-dial-quickapps-frontend#275](https://github.com/epam/ai-dial-quickapps-frontend/pull/275), [0.3.2](https://github.com/epam/ai-dial-quickapps-frontend/releases/tag/0.3.2)
- **The **Built-in file tools** switch is gone** (0.3.2, 2026-11-06): The editor no longer writes `features.dial_files`; the backend default applies (see the runtime below). Guide: items 21, 24, 26. [epam/ai-dial-quickapps-frontend#335](https://github.com/epam/ai-dial-quickapps-frontend/pull/335)
- **A new Quick App starts with **Time awareness**, **Process files**, **Add attachments to the orchestrator response**, and **Fetch web resources** on** (0.3.2, 2026-11-06): The last two show only when the host enables them. Guide: item 23. [epam/ai-dial-quickapps-frontend#310](https://github.com/epam/ai-dial-quickapps-frontend/pull/310), [epam/ai-dial-quickapps-frontend#304](https://github.com/epam/ai-dial-quickapps-frontend/pull/304), [epam/ai-dial-quickapps-frontend#305](https://github.com/epam/ai-dial-quickapps-frontend/pull/305)
- **A toolset defined only in the app's JSON opens its details window** (0.4.0, 2026-11-12): Guide: item 22. [epam/ai-dial-quickapps-frontend#338](https://github.com/epam/ai-dial-quickapps-frontend/pull/338), [0.4.0](https://github.com/epam/ai-dial-quickapps-frontend/releases/tag/0.4.0)

### DIAL Quick Apps runtime — `epam/ai-dial-quickapps-backend` 0.13.2 → 0.14.2

- **File tools are on by default, with write, edit, delete, copy, and move; `enabled_tools: "read_only"` limits them** (0.14.0, 2026-11-12): Guide: item 26. [epam/ai-dial-quickapps-backend#710](https://github.com/epam/ai-dial-quickapps-backend/pull/710), [0.14.0](https://github.com/epam/ai-dial-quickapps-backend/releases/tag/0.14.0)
- **The agent's date and time follow your time zone (`X-Timezone` header)** (0.14.0, 2026-11-12): The guide line still holds; see Needs review. [epam/ai-dial-quickapps-backend#705](https://github.com/epam/ai-dial-quickapps-backend/pull/705)
- **A new step, **Read file characters**, shows in a response when an agent reads a file by characters** (0.14.0, 2026-11-12): The guide lists no file-tool step names. [epam/ai-dial-quickapps-backend#677](https://github.com/epam/ai-dial-quickapps-backend/pull/677)
- **The **Initialization issues** step no longer has a **Deployment parameters** section** (0.14.2, 2026-11-19): The guide never mentions that step. [epam/ai-dial-quickapps-backend#763](https://github.com/epam/ai-dial-quickapps-backend/pull/763)
- **A temperature or reasoning effort the model does not support is no longer sent** (0.14.2, 2026-11-19): The guide already says **Temperature** is only for models that allow it. [epam/ai-dial-quickapps-backend#763](https://github.com/epam/ai-dial-quickapps-backend/pull/763)
- **Preview features became general availability (web fetch, tool discovery, skills, hooks, folder context)** (0.14.0, 2026-11-12): `tools_config` and `tool_call_result_offload` stay preview. The guide describes the two switches without a preview caveat. [epam/ai-dial-quickapps-backend#693](https://github.com/epam/ai-dial-quickapps-backend/pull/693)
- **Tool discovery: `strategy`, a required `service_model`, found tools stay loaded** (0.14.1, 2026-11-18): JSON only (`orchestrator.tool_discovery`, off by default). The guide has no statement about it. [0.14.1](https://github.com/epam/ai-dial-quickapps-backend/releases/tag/0.14.1)
- **Clearer errors: rate limit, context overflow, MCP sign-in** (0.14.0, 2026-11-12): The guide quotes none. Based on the release notes, not read in source. [epam/ai-dial-quickapps-backend#702](https://github.com/epam/ai-dial-quickapps-backend/pull/702), [epam/ai-dial-quickapps-backend#699](https://github.com/epam/ai-dial-quickapps-backend/pull/699), [epam/ai-dial-quickapps-backend#701](https://github.com/epam/ai-dial-quickapps-backend/pull/701)
- **Pinned tool arguments, `tools_config.fixed_arguments` (preview)** (0.14.0, 2026-11-12): JSON only. [epam/ai-dial-quickapps-backend#642](https://github.com/epam/ai-dial-quickapps-backend/pull/642)
- ****Usage Statistics** step counts tool spending** (0.14.0, 2026-11-12): Only when `SHOW_USAGE_STATISTICS=true`. The guide does not describe that step. [epam/ai-dial-quickapps-backend#654](https://github.com/epam/ai-dial-quickapps-backend/pull/654)

## Reviewed, no guide impact

- The guide already matches: Edit JSON and its messages ([#308](https://github.com/epam/ai-dial-quickapps-frontend/pull/308)); the **Configuration** column, **Default model**, and **Change** picker ([#304](https://github.com/epam/ai-dial-quickapps-frontend/pull/304)); **Date and time**, **Restore original**, **Discard changes**, **Limited access**, **Dial native**, **Chats and tasks**, and **Usage** as its own page. The Add-ons row message "…is not available and needs to be removed." already existed at 0.3.1, and "This skill/toolset/agent is no longer available" is still the details text at 0.4.0, so `3.catalog/2.agents.md` line 190 holds.
- Text hits that are not changes: `3.catalog/2.agents.md` line 202 is prose, not a UI label; `5.sharing-and-publishing.md` line 125 **Author** is the publish form label, still "Author" at 1.3.7.
- Reworded empty-state messages ("No chats yet", "No items found", "No scheduled tasks found") are not quoted by the guide.
- Not visible to chat users: `epam/ai-dial-chat` fixes, chores, admin and API changes (#9831, #9833, #9835, #9837, #9826, #9850, #9852, #9874, #9877, #9869, #9868, #9865, #9910, #9978, #9787, #9842, #9848, #9863, #9882, #9838, #9820, #9832, #9858, #9860) and the 1.2.23 and 1.2.24 backports; in the Quick Apps editor the host connector and origin check (#292), client config read once (#263), and 15 pull requests with no visible change; in the Quick Apps runtime prompt caching (#696), deferred toolset summaries (#715), oversized tool responses (#677), offloaded results (#695), fetch User-Agent (#653), execution time milestones (#669), dependency bumps, and the local dev stack.

## Needs review

- **Projects** (no page): `epam/ai-dial-chat` 1.3.0 and 1.3.1 add a **Projects** sidebar entry, project pages, project chats, and sharing and publishing a project, behind `PROJECTS_ENABLED` (default `false`). Adding a page is a decision for the guide's owners. Source: [`feature-flags.env.ts#L134`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat-api/src/config/env/feature-flags.env.ts#L134), [`routes.ts#L33-L48`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/types/routes.ts#L33-L48).
- **URL preselection** (no page): A link with `deployment-id`, `skill-id`, or a prompt opens the chat with those chosen, with notices such as "Deployment not found" when one cannot be used. No page covers it. Source: [#9627](https://github.com/epam/ai-dial-chat/pull/9627), [`url-entity-preselection/spec.md#L5`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/url-entity-preselection/spec.md#L5).
- **Onboarding tour (preview, 1.3.4)** (`0.index.md`): Operators define hints that point at the sidebar toggle, **New chat**, **Projects**, and **Scheduled tasks**, with **Next**, **Skip tour**, and **Done**. Only when `ONBOARDING_HINTS` holds hints. Whether the overview mentions a tour is a decision. Source: [#9815](https://github.com/epam/ai-dial-chat/pull/9815).
- **Announcement severity (1.3.2)** (no page): An `ANNOUNCEMENTS` entry can be `info` or `warning`. The guide has no section on announcements, and what the warning style looks like is not proven. Source: [#9851](https://github.com/epam/ai-dial-chat/pull/9851).
- **Custom viewers** (`0.index.md` line 33): The guide has one sentence about custom UIs. Applications with a viewer open in an embedded frame, with "Loading viewer…" and a start gate. Whether to say more is a decision. Source: [`custom-viewers/spec.md#L1-L5`](https://github.com/epam/ai-dial-chat/blob/1.3.7/openspec/specs/custom-viewers/spec.md#L1-L5).
- **Catalog filter button label** (`3.catalog/0.index.md` line 52): The guide calls the button **Filter**; the source labels it **From** (`catalog.browseSettings.from`), unchanged since 1.2.22. Confirm the label in the UI and decide whether to rename it in the guide. Source: [`Filter.tsx#L96-L118`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/catalog/src/components/Filter/Filter.tsx#L96-L118).
- **Settings **General** heading** (`6.usage-and-settings.md` line 23): The **Preferences** pane starts with a **General** heading (1.3.0). Compare the screenshot `img/settings-preferences.png` with 1.3.7; retake it and mention the heading only if it differs. Source: [`SettingsModal.tsx#L137-L141`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/components/SettingsModal/SettingsModal.tsx#L137-L141).
- **Model Overview rows the guide never listed** (`3.catalog/1.models.md` lines 44–54): **Provider**, **Vendor**, **License**, **Knowledge cutoff date**, **Parameters**, and **Reasoning efforts** under **Capabilities** were already shown at 1.2.22 and the guide does not list them. Adding them is a content decision. Source: [`map-entity-details-to-catalog.ts#L152-L222`](https://github.com/epam/ai-dial-chat/blob/1.3.7/libs/chat-hooks/src/catalog/map-entity-details-to-catalog.ts#L152-L222).
- **Skill editor folder preview and upload conflicts (1.3.0)** (`3.catalog/4.skills.md` lines 98–108): A skill folder opens as a list with a path bar and "This folder is empty", and uploading an existing name asks "Replace or duplicate it?". The page describes **Write instructions** and **Upload** but not these. Source: [`en.json#L1783-L1795`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/i18n/locales/en.json#L1783-L1795), [`en.json#L1848-L1852`](https://github.com/epam/ai-dial-chat/blob/1.3.7/apps/chat/src/i18n/locales/en.json#L1848-L1852). The PR is not identified.
- **Editor resize handle (1.3.0)** (`3.catalog/2.agents.md` lines 134 and 321, `3.catalog/3.toolsets.md` line 136): A draggable divider ("Drag to resize") sits between **Metadata** and the setup area. A one-line mention is optional. Source: [#9461](https://github.com/epam/ai-dial-chat/pull/9461).
- **Time zone for **Time awareness**** (`3.catalog/2.agents.md` line 282): The line "Gives the agent the current date and time" still holds. Since `epam/ai-dial-quickapps-backend` 0.14.0 the time follows the user's time zone (`X-Timezone`, UTC as fallback). Whether to add "in your time zone" is a writer decision. Source: [#705](https://github.com/epam/ai-dial-quickapps-backend/pull/705).
- **Restricting file tools through Edit JSON** (`3.catalog/2.agents.md` lines 288–296): The 0.3.2 release notes of `epam/ai-dial-quickapps-frontend` say to use Edit JSON to restrict the file tools (`features.dial_files`, `enabled_tools`: `read_only`). The editor code that builds this document was not traced, so no text is proposed. Source: [`application.py#L219-L227`](https://github.com/epam/ai-dial-quickapps-backend/blob/0.14.2/src/quickapp/config/application.py#L219-L227).
- **Model picker rows** (`3.catalog/2.agents.md` line 262): The picker is the `CatalogPickerModal` of `@epam/ai-dial-catalog` 1.3.0. Whether a row click still shows pricing and limits, as the guide says, was not checked in that package. Source: [#304](https://github.com/epam/ai-dial-quickapps-frontend/pull/304).
- **Knowledge base file picker and folder drop** (`3.catalog/2.agents.md` "Add a knowledge base", `4.files.md` "Add a file or folder"): `@epam/ai-dial-react-file-manager` moved to 0.4.1 in the editor and 0.4.2 in the chat. The 1.3.3 notes say dropping a folder shows "Folder upload is not supported" and uploads only the files; that text lives in the package, not in the repository. Look at both windows in the UI and decide. Source: [#9871](https://github.com/epam/ai-dial-chat/pull/9871).
- **Organization units in the file manager and publish trees** (`4.files.md`, `5.sharing-and-publishing.md`): 1.3.2 marks units in these trees when `features.orgUnitsEnabled` is on. Which screen shows the mark was not found in source. Source: [#9766](https://github.com/epam/ai-dial-chat/pull/9766).

## Verification

- `python3 -I plan_checks.py --body pr-body.md --title '[DIAL Loop]: plan …'`: all checks ok (56 items, under 65,536 characters)
- `python3 -I plan_checks.py … --base development --date 2026-11-27 --inventory guide.json`: ok, 12 pages, only `last_verified: 2026-11-27` changed
- `npm run lint:frontmatter`: not run: no node_modules (the checkout has none, and installing packages is not allowed)
- Source claims checked at the tags: strings and code lines for the Custom repeat, Save panel, name conflict, toolset OAuth, publish, share, Usage budgets, model Overview and Limits, citations, File Manager preview, Cold/Hot, and the removed file tools switch exist at `epam/ai-dial-chat` 1.3.7 and `epam/ai-dial-quickapps-frontend` 0.4.0; PR numbers match each repository's history from the baseline tag to the target.
