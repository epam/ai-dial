# Prompts

## Introduction

In DIAL, prompts created by users (either using [DIAL Core API](https://dialx.ai/dial_api#tag/Prompts) or [UI](/docs/tutorials/0.user-guide.md#prompts)) are stored in a private folder of a dedicated user in the DIAL file storage and are not accessible to anyone but the prompt author (owner). To enable access for other users, prompts owners can publish them or DIAL administrators can manually add them to the Public folder, where all published resources are stored.

> * Prompts are considered to be a protected resource. Refer to [Access Control](/docs/platform/3.core/2.access-control-intro.md) to learn how protected resources are handled in DIAL.
> * Refer to [DIAL Chat User Guide](/docs/tutorials/0.user-guide.md#prompts) to learn more about prompts.

## Main Screen

The main screen displays all prompts located in the Public folder in DIAL file storage. Prompts get to the Public folder when published by users or added by administrators.

> **Note**: This screen, does not give access to private prompts of users.

> * Refer to [Access Control](/docs/platform/3.core/2.access-control-intro.md) to learn more about Private and Public logical spaces for objects storage in DIAL.
> * Refer to [Chat User Guide](/docs/tutorials/0.user-guide.md#publish-1) to learn how end users can publish prompts and to [DIAL Core API Publications](https://dialx.ai/dial_api#tag/Publications) to learn how to create and manage publication requests via API.

![ ](img/assets-prompts.png)

### Folders

Objects in the [Public folder](/docs/platform/3.core/2.access-control-intro.md) are arranged hierarchically, similar to a file system. 

- **Root folder**: Public is a root folder with sub-folders. It is visible to all authorized users. If a sub-folder is not specified for the new object being published, it is placed in the root folder by default.
- **Sub-folders**: Objects can be placed in sub-folders for logical organization purposes and also to apply access rules.

> **Note**, that access rules can be applied to sub-folders (manually or in publication request). You can view and manage access rules in [Folders Storage](/docs/tutorials/3.admin/access-management-folders-storage.md). The effective authorization rule for an object in a sub-folder includes restrictions applied to all parent sub-folders up to the root folder. Refer to [Tutorials](/docs/tutorials/1.developers/1.work-with-resources/0.work-with-publications.md#effective-rules) to learn about affective rules for folders.

#### Actions

Hover over any folder in the right or left panel to display the actions menu.

| Available Actions | Description |
|-------------------|-------------|
| **Create sub-folders** |  Use to add new child or sibling sub-folders. |
| **Move to** | Use to select a target location in the hierarchy to move the selected folder. | 
| **Export** | Use to download the content of the selected folder with objects inside it as a ZIP archive or raw JSON file. |
| **Rename** | Use to rename the selected folder. | 
| **Manage permissions** | Redirects to [Folder Storage](/docs/tutorials/3.admin/access-management-folders-storage.md) to manage access to the folder. |
| **Delete** | Use to delete the folder with objects inside it.|

![ ](img/files-folders-actions.png)

#### Add Folders

Prompts can be placed in sub-folders. 

In the actions menu of each existing folder, select **Add sibling** or **Add child** to create new sub-folders.

> **Note**: The name of the folder must not exceed 160 characters.

![ ](img/assets-files-folder-actions.png)

You can also navigate to a specific folder and use the **Create** dropdown in the toolbar to add sub-folders.

![ ](img/prompts-add-folder.png)

### Prompts

Click any folder in the hierarchy to display prompts (and sub-folders) stored in it.

##### Fields description

| Column | Description |
|--------|-------------|
| **Display Name** | Prompt name displayed on UI. |
| **Version** | Version of the prompt (e.g. `1.0.0`). |
| **Author** | Username or system ID associated with the user who created or last updated this file. |
| **Updated time** | Timestamp of the last modification of the prompt. |
| **Actions** | Actions you can perform on the selected prompt:<br />- **Duplicate**: Create a copy of the prompt in one of two ways:<br />**New version**: Creates another version of the selected prompt. You can also quickly add a new version on the [Properties](#properties) screen by clicking **Create** in the **Version** dropdown.<br />**New prompt**: Clones the selected prompt as a new one.<br />- **Move to**: Select a target folder in the hierarchy to move the prompt. To move more than one prompt, select them and click **Move to** in the toolbar.<br />- **Export**: Use to download the selected prompt. Refer to [Export](#export) to learn more.<br />- **Open in a new tab**: Opens the prompt's properties in a new tab.<br />- **Delete**: Remove the prompt. You can also select prompts you want to delete and click **Delete** in the toolbar to delete them all at once. Refer to [Delete](#delete) to learn more.<br /> |

![ ](img/assets-prompts-actions.png)

#### Export

You can export individual prompts or folders with prompts (including nested folders). Assets can be exported as ZIP archive or raw JSON files.

* To export a folder, click **Export** in the actions menu of a specific folder to export its content.
* To export a specific prompt, select it and click **Export** in its actions menu.

![ ](img/export-prompts.png)

* To export several prompts, select them and click **Export** in the top toolbar.

![ ](img/export-prompts-bulk.png)

#### Import

You can upload ZIP archives or raw JSON files with prompts. This is essential for migrating, restoring, or sharing prompt assets between DIAL users.

![ ](img/import-prompts.png)

##### To import prompts:

1. Click **Create** in the toolbar and select **Import**.
2. Select the type of files you want to import. **Drag & Drop** your ZIP archive or JSON files into the files area or click **Browse** to open a file picker.
   * **Archive**: Select if you want to import a single ZIP or tarball containing multiple JSON files. **Note**: Only 1 archive can be imported at a time.
   * **JSON**: Select if you want to import JSON files. **Note**: Up to 30 files can be imported at once.
3. Select a Conflict resolution Strategy. It allows you to decide how to handle existing prompts with the same name and version in your workspace:
   * **Skip**: Leave existing prompts untouched, only new ones will be added.
   * **Override**: Replace prompts with the same name and version with the imported ones.
   * **Edit manually**: Resolve conflicts manually one by one.
4. Use **Ignore paths** toggle to skip folder structure from the imported files. When enabled, all prompts will be imported directly into the root folder without recreating the original folder hierarchy.
5. Click **Finish** to start.

#### Create

Follow these steps to manually add a single prompt to the Public folder:

1. Select a target folder for a new prompt.
2. Click **Create** in the toolbar and select **Prompt** to invoke the **Create Prompt** modal.
3. Define prompt's parameters

   | Column | Required | Description |
   |--------|----------|-------------|
   | **Display Name** | Yes | Prompt name displayed on UI. |
   | **Version** | Yes | Version of the prompt (e.g. `1.0.0`).|
   | **Description** | No | Free-form description of the prompt.|

4. Once all required fields are filled, click **Create**. The dialog closes and the new prompt [properties](#properties) screen is opened. This entry will appear immediately in the listing once created.

   ![](img/create-prompt.png)

#### Delete

There are several ways to delete a prompt or a specific version of it:

> **Note**: Any applications that reference it will break until you reattach a valid prompt.

* Click **Delete** in the toolbar on the Properties screen to permanently remove the selected prompt from your DIAL instance.
* Use the Delete option in the prompt context menu.
* Delete the related folder where the prompt is located.
* Use **Bulk Actions** on the main screen to delete more than one prompt.

![](img/assets-delete-prompt.png)

## Properties

Click any prompt to open the Properties screen where you can see it's details and edit the selected properties.

##### Available actions

You can find the following action buttons in the screen header:

| Action | Description |
|--------|-------------|
| **Version**  | Version of the prompt. Can be selected from the dropdown to display properties for different versions of prompt. <br /> In the dropdown, click **Create** to add a new version of the prompt. |
| **Delete** | Use to delete the selected prompt. |

##### Fields description

| Field | Description |
|-------|-------------|
| **Display Name** | Read-only key for the prompt (e.g. `customer_base_growth`). Display Name cannot be edited after the prompt is created. |
| **Updated Time** | Read-only timestamp of the last update (e.g. `04.29.2025 00:14`). |
| **Storage Folder** | The path to the prompt's location in the folders hierarchy. <br />Click to navigate to [Folders Storage](/docs/tutorials/3.admin/access-management-folders-storage.md). | 
| **Description** | Description of a prompt. |
| **Content** | Markdown editor with the prompt's content which supports:<br />- **Plain text** with Markdown formatting. <br />- **Mustache-style variables** `{{variableName}}` for dynamic substitution.<br />- **JSON** editor. <br /> Refer to [Chat User Guide](/docs/tutorials/0.user-guide.md#variables) to learn more about variables in prompts. |
| **Storage Folder** | The path to the prompt's location in the folders hierarchy. <br />Use **Move to** to change the folder. |


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





