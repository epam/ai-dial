# File Publications

## Introduction

DIAL Core Publication API enables publication of files from private folders of users to make them available to other users and applications in the organization. Each publication request undergoes a review by DIAL administrators to ensure safety and security.

> You can access published files in [Assets/Files](/docs/tutorials/3.admin/assets-files.md) section. In this section, you can also access files [published with applications](/docs/tutorials/3.admin/approvals-application-publications.md#files).

In this section of the DIAL Admin panel, admins can access and approve or decline requests to publish files.

> * Refer to [Publications](/docs/platform/7.collaboration-intro.md#publication) to learn more about publications in DIAL.
> * Refer to [DIAL Chat User Guide](/docs/tutorials/0.user-guide.md#publications) to learn about the publication process from the perspective of a DIAL Chat end-user.
> * Refer to [Publication API](https://dialx.ai/dial_api#tag/Publications) for programmatic creation and management of publication requests.

## Main Screen

The File Publications screen shows all publish/unpublish requests submitted via [Publication API](https://dialx.ai/dial_api#tag/Publications). 

![](img/img_54.png)

##### File publications grid

| Column | Description |
|--------|-------------|
| **Name** | Title of the submitted publication request. |
| **Author** | The user who has submitted the publication request. |
| **Creation time** | Publication request submission's timestamp. |

## Review Publication Request

Click any publication request on the main screen to access the review page. On this page, you can inspect the selected request and decide whether to **Publish**, **Unpublish**, **Decline** or delete it.

**Note**, that administrators can also modify selected properties in the request and take action on the modified request.

### Actions

* **Publish**: Applies to publish requests. Use to approve the request.
* **Unpublish**: Applies to unpublish requests. Use to approve the request and remove the published files from the Public folder and make them inaccessible to other users and applications. **Note**, that deleting resources can break workflows that use them.
* **Decline**: Reject the publish/unpublish request. Prompts you to enter a decline reason that will be sent back to the request author.
* **Delete**: Deletes the publication request.

![](img/publication-actions.png)

![](img/publication-actions-unpublish.png)

### Properties

In this tab you can access and modify the selected properties of the publication request.

##### Publication request properties

| Property | Editable | Description | 
|----------|----------|-------------|
| **Action** | No | Action to be taken on this request: Publish (to publish files in the request) or Unpublish (to remove files in the request form the Public folder in DIAL file system). |
| **Creation Time** | No | Publication request creation timestamp. |
| **Author** | Yes | Name of the publication request creator. |
| **Folder Storage** | Yes | The path to the target folder in the Public file storage where the published files will be stored. <br /> Use **Move to** to change the initial setting provided in the publication request. |

![](img/file-publication-properties.png)

##### Available actions

> **Note**, some actions can be disabled for certain file types. The list of file extensions for which download and preview are enabled:  
`.html`, `.htm`, `.css`, `.js`, `.mjs`, `.json`, `.xml`, `.txt`, `.md`, `.csv`, `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.ico`, `.bmp`, `.avif`, `.mp3`, `.wav`, `.ogg`, `.mp4`, `.webm`, `.pdf`.

| Available Actions | Description |
|-------------------|-------------|
| **Download** | Use to download file(s). Can be disabled for selected types of files.|
| **Preview** | Use to preview the content of the file. Can be disabled for selected types of files. |
| **Remove** | Use to remove file from the publication request. |
| **Add** | Use to add files to publication request. |

![](img/publish-app-files-actions.png)

##### JSON Editor

**Advanced users with technical expertise** can work with files and publication request properties in the UI or a JSON editor view modes. It is useful for advanced scenarios of bulk updates, copy/paste between environments, or tweaking settings not exposed on UI.

> **TIP**: You can switch between UI and JSON only if there are no unsaved changes.

![](img/file-publication-json-editor.png)

### Permissions

If not defined otherwise, objects are published into the root (Public) folder in DIAL file storage by default. All authenticated users have access to this folder. To define access restrictions, publication request author can create a sub-folder and select it in the **Publish to** field in the publication request. Sub-folders can have access rules applied to them. Refer to [Access Rules](/docs/tutorials/3.admin/access-management-folders-storage.md#access-rules) to learn more.

In this section, you can see and modify access rules if they apply to the selected publication request.

![](img/file-publication-permissions.png)