# Prompts

## Introduction

Prompts in DIAL can be stored in BLOB storage or a local file system.

Prompts are considered to be a protected resource. Refer to [Access Control](/docs/platform/3.core/2.access-control-intro.md) to learn how protected resources are handled in DIAL.

> Refer to [DIAL Chat User Guide](/docs/tutorials/0.user-guide.md#prompts) to learn more about prompts.

## Main Screen

In Prompts, you can access and manage all prompts in the Public folder. Prompts get to the Public folder if published by users or added by administrators.

![ ](img/img_32.png)

### Folders

Objects in the [Public folder](/docs/platform/3.core/2.access-control-intro.md) are arranged hierarchically, similar to a file system. 

- **Root folder**: Pubic is a root folder which can include sub-folders and prompts. Prompts in the root folder are visible to all authorized users.
- **Sub-folders**: Sub-folders can include uploaded or published prompts.

> **Note**, that access rules can be applied to sub-folders (manually or in publication request). You can view and manage access rules in [Folders Storage](/docs/tutorials/3.admin/access-management-folders-storage.md). The effective authorization rule for an object in a sub-folder includes restrictions applied to all parent sub-folders up to the root folder. Refer to [Tutorials](/docs/tutorials/1.developers/1.work-with-resources/0.work-with-publications.md#effective-rules) to learn about affective rules for folders.

You can perform various actions on folders:

| Available Actions | Description |
|-------------------|-------------|
| **Create folder + import objects** | Hover over any folder to display the **+** icon. It allows importing objects into new child or sibling folders. Same flow as [Import](#import), but requires providing a new folder name. **Note** that new folders can be added only via this method or along with the publication request if a new folder is defined in it. |
| **Actions** | Hover over any folder to view a context menu icon with actions you can perform in relation to the selected folder.<br /> - **Rename**: Use to rename the selected folder.<br />- **Move to**: Use to select a target location in the hierarchy to move the selected folder.<br />- **Manage permissions**: Redirects to [Folder Storage](/docs/tutorials/3.admin/access-management-folders-storage.md) to manage access to the folder.<br />- **Delete**: Use to delete the folder with objects inside it.|

![ ](img/folder-actions.png)

### Prompts

Click any folder in the hierarchy to display prompts stored in it.

##### Prompts grid

| Column | Description |
|--------|-------------|
| **Display Name** | Prompt name displayed on UI. |
| **Version** | Semantic version of this prompt template (e.g. `1.0.0`). |
| **Author** | Username or system ID associated with the user who created or last updated this file. |
| **Update time** | The timestamp of the last modification of the prompt. Use to track changes. |
| **Actions** | Actions you can perform on the selected prompt: <br /> - **Open in new tab**: Opens a new tab with prompt's properties. <br />- [Duplicate](/docs/tutorials/0.user-guide.md#duplicate-1): Click to duplicate a prompt.<br />- **Move to another folder**: Use to select the target folder in the hierarchy to move the file.<br />- **Delete**: Use to delete a prompt. Alternatively you can use **Bulk Actions** in the header to remove multiple prompts. |

#### Export

Use **Bulk Actions** in the toolbar to bulk download prompts. This is useful for migrating prompts between environments, sharing sets of prompts with other users, or keeping a point-in-time backup.

![ ](img/apps_bulk_actions.png)

##### To export prompts:

1. Click **Bulk Actions** button in the toolbar.
2. Select prompts by checking the boxes in each row. You can also select the version you want to export. 
3. Click **Export** in the bottom to launch the export modal. 
4. In the modal window select the export format: Archive or JSON.
5. Click **Export** to generate export file and start downloading.

![ ](img/img_47_1.png)

#### Import

Use **Import** in the toolbar to upload new or update existing prompts from external JSON files or ZIP archive. This is essential for migrating, restoring, or sharing prompt assets between DIAL users.

![ ](img/img_48.png)

##### To import prompts:

1. Click **Import** in the toolbar to launch the import modal.
2. Select the type of files you want to import. **Drag & Drop** your archive or JSON files into the files area or click **Browse** to open a file picker.
   * **Archive**: Select if you want to import a single ZIP or tarball containing multiple JSON files. **Note**: Only 1 archive can be imported at a time.
   * **JSON**: Select if you want to import JSON files. **Note**: Up to 30 files can be imported at once.
3. Select a Conflict resolution Strategy. It allows you to decide how to handle existing prompts with the same name and version in your workspace:
   * **Skip**: Leave existing prompts untouched, only new ones will be added.
   * **Override**: Replace prompts with the same name and version with the imported ones.
   * **Edit manually**: Resolve conflicts manually one by one.
4. Use **Ignore paths** toggle to skip folder structure from the imported files. When enabled, all prompts will be imported directly into the root folder without recreating the original folder hierarchy.
5. Click **Finish** to start.

#### Create

Follow these steps to add a new prompt:

1. Select a folder for a new prompt.
2. Click **Create** in the toolbar to invoke the **Create Prompt** modal.
3. Define prompt's parameters

   | Column | Required | Description |
   |--------|----------|-------------|
   | **Display Name** | Yes | Unique identifier for a prompt (e.g. reject-blacklisted-words, audit-logger). This key is used when you attach it to a Model or Application. |
   | **Version** | Yes | Semantic version string (e.g. 1.0.0, 0.1.2) that enables safe updates.|
   | **Description** | No | Free-form description.|

4. Once all required fields are filled, click **Create**. The dialog closes and the new prompt [configuration screen](#configuration) is opened. This entry will appear immediately in the listing once created.

   ![](img/img_33.png)

#### Delete

Click **Delete** in the toolbar on the Properties screen to permanently remove the selected prompt (or the selected versions) from your workspace. 

> **Note**: Any applications that reference it will break until you reattach a valid prompt.

You can also remove a prompt using the Delete option in the prompt context menu.

To remove multiple prompts at once, use **Bulk Actions** in the toolbar on the Main Screen.

## Properties

Click any prompt to open the Properties screen where you can see it's details and edit the selected properties.

| Field | Description |
|-------|-------------|
| **Display Name** | Immutable key for the prompt (e.g. `customer_base_growth`). It cannot be edited after the prompt is created. |
| **Update Time** | Read-only timestamp of the last save (e.g. `04.29.2025 00:14`). Helps you track when the prompt was last modified. |
| **Version** | Select the semantic version of this prompt (e.g. `1.0.0`, `0.1.2`).<br />Use **+ Create** button in the dropdown with versions to create a new version. |
| **Description** | Free-form summary of the prompt's intent, variables, or context requirements (e.g. "Extracts customer base growth; variables: `{{growth}}"`). |
| **Content** | Markdown editor with the prompt's text which supports:<br />- **Plain text** with Markdown formatting. <br />- **Mustache-style variables** `{{variableName}}` for dynamic substitution. Refer to [Chat User Guide](/docs/tutorials/0.user-guide.md#variables) to learn more about variables in prompts. |
| **Storage Folder** | The path to the prompt's location in the folders hierarchy. | 

![ ](img/prompts-properties.png)

### Edit Prompt

In the Properties tab, you can edit selected information. Once the prompt edited, top bar allows to:

* **Discard**: Use to discard changes made since last save.
* **Save**: Use to save changes to the current version of prompt.
* **Save as new version**: Use to save changes in a new version keeping the current version intact.

![](img/img_34_1.png)

### Compare Versions

When there are several versions of the same prompt, **Compare versions** is enabled. 

![](img/prompts-compare-versions.png)

Use it to compare the prompt's text across its versions. You can select versions you want to compare to see the changes highlighted.

![](img/img_34_2.png)

### JSON Editor

**Advanced users with technical expertise** can work with the prompt properties in a JSON editor view mode. It is useful for advanced scenarios of bulk updates, copy/paste between environments, or tweaking settings not exposed on UI.

> **TIP**: You can switch between UI and JSON only if there are no unsaved changes.

![](img/assets_prompts_json.png)

##### Switching to the JSON Editor

1. Navigate to **Assets → Prompts**, then select the prompt you want to edit.
2. Click the **JSON Editor** toggle (top-right). The UI reveals the raw JSON.





