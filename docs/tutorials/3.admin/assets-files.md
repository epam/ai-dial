# Files

## About Files

Files in DIAL are arbitrary binary or text assets (JSON, CSV, PDF, images, etc.) your models and applications can reference at runtime.

> Refer to [User Guide](/docs/tutorials/0.user-guide.md#attachments) to learn more about attachments.

## Files List

In Files, you can manage all binary or document assets like JSON, CSV, PDF, images, etc.

![ ](img/img_35.png)

### Grid and Folders

##### Folders Structure (Left Pane)


| Element                | Behavior                                                                                                                                      |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| **Root folder**        | A root folder with assets and subfolders. It is visible to all users.                                                                         |
| **Sub-folders**        | Collapsible folders you create to group assets by application, project, team, domain, or environment.                                         |
| **Collapse All**       | Button in the bottom of Files pane. Allows collapsing all expanded folders in the folders tree.                                               |
| **Context actions**    | Hover over the folder to view additional actions.                                                                                             |
| **+ (Create)**         | Allows to create new child or sibling folder and import DIAL assets into it. Same flow as [Import](#import), but also requires a folder name. |
| **Rename**             | Allows to rename the folder. Requires folder name to be provided.                                                                             |
| **Move to**            | Allows moving the folder to another place in the folders tree.                                                                                |
| **Manage permissions** | Redirects to [Folder Storage](/docs/tutorials/3.admin/access-management-folders-storage.md) to manage access to the folder.                   |
| **Delete**             | Deletes the folder and all its assets. Requires confirmation.                                                                                 |

![ ](img/img_35_1.png)

##### Files Grid (Right Pane)

| Column           | Definition                                                                                          |
|------------------|-----------------------------------------------------------------------------------------------------|
| **Display Name** | A technical key for the file (e.g. `exclusion-words`).                                              |
| **Extension**    | The original extension of the file.                                                                 |
| **Author**       | The username or system ID associated with the user who created or last updated this application.    |
| **Actions**      | Row menu with actions: <br /> - Open asset in new tab <br /> - Move to another folder<br />- Delete |

## Export

Use Export to bulk download files. This is helpful for backup, sharing, or migrating supporting assets alongside your DIAL configuration.

![ ](img/img_49.png)

##### To export files:

1. Click **Bulk Actions**.
2. Select files by checking the boxes in each row.
3. Click **Export** to download a ZIP archive with files.

## Import

Use Import to upload external files into DIAL’s assets storage. This is useful for adding reference documents, data or other supporting assets.

![](img/img_50.png)

##### To import files:

1. Click **Import** in the toolbar to launch the import modal.
2. Select the type of files you want to import. Drag & drop files or an archive into the drop zone, or click **Browse** to open your local file browser.
    * **Archive** (single ZIP file). Only 1 archive file can be imported at a time.
    * **Separate Files** (up to 30 individual files). Each file must be ≤ 512 MB.
3. Once files appear in the list, click **Next** to proceed.
4. Resolve any conflicts by choosing a strategy for handling files with the same name and path:
   * **Override**: Replace existing files with the new ones.
   * **Skip**: Do not import conflicting files and keep existing files unchanged.
   * **Edit manually**: Rename incoming files one by one to avoid conflicts. Each conflicting file is flagged with red color and becomes editable - update its **Name** to avoid conflicts.
5. Once all conflicts are resolved, click **Finish** to complete the import.

    ![](img/img_51.png)

## Configuration

##### Top Bar Controls

* **Delete**: Permanently removes the selected file from your DIAL instance.

### Properties

In the Properties tab, you can view and manage files, including moving them across folders.

![](img/img_36.png)


| Field                | Required | Definition & Use Case                                                                                                                  |
|----------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Display Name**     | -        | The filename including extension (e.g. request.json, lookup.csv). Display-only but with a copy-to-clipboard button for easy reference. |
| **Source/Name**      | -        | The name of the file without the extension (e.g. request). To download, click on the Additional Actions button.                        |
| **Source/Extension** | -        | The file type (e.g. .json, .csv, .pdf).                                                                                                |
| **Storage Folder**   | Yes      | The actual path of the file in the folders hierarchy. Use for moving files between folders.                                            |  
