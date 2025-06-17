# Files

## About Files

Files in DIAL are arbitrary binary or text assets (JSON, CSV, PDF, images, etc.) your models and applications can reference at runtime.

> Refer to [User Guide](/docs/tutorials/0.user-guide.md#attachments) to learn more about attachments.

## Files List

In Files, you can manage all binary or document assets like JSON, CSV, PDF, images, etc.

![img.png](img/img_35.png)

### Grid and Folders

##### Folders Structure (Left Pane)

| Element                  | Behavior                                                                                |
|--------------------------|-----------------------------------------------------------------------------------------|
| **Public folder**        | Root folder visible to all users, containing shared files.                              |
| **User-defined folders** | Collapsible folders you create to group files by project, team, domain, or environment. |
| **⯈ Icons**              | Click to expand or collapse subfolders, drilling down to the set of files you need.     |

##### Files Grid (Right Pane)

| Column            | Definition                                                                      |
|-------------------|---------------------------------------------------------------------------------|
| **Name**          | Technical key for the file (e.g. `exclusion-words`).                            |
| **Extension**     | The original extension of the file.                                             |
| **Author**        | Username or system ID who created or last modified this file.                 |
| **(Actions)** | Row menu with actions: <br /> - Move to another folder<br />- Delete  |

## Export

Use Export to package one or more stored files into a downloadable archive. This is helpful for backup, sharing, or migrating supporting assets alongside your DIAL configuration.

![img.png](img/img_49.png)

##### To export files

1. Click the **Export** button in the toolbar to launch the export modal.
2. Select a folder from which you want to export files. Clicking a folder highlights it and lists its files in the right pane.
3. Choose the files you want to export by checking their boxes. Alternatively, use **Select All** checkbox in the header to export every file in the chosen folder.
4. Click **Export** to start the process. Files are downloaded as .zip archive with all selected files within it.

## Import

Use Import to upload external files into DIAL’s asset storage. This is useful for adding reference documents, data or other supporting assets.

![img_1.png](img/img_50.png)

##### To import files

1. Click the **Import** button in the toolbar to launch the import modal.
2. Select the type of files you want to import. Drag & drop files or archive into the drop zone, or click **Browse** to open your local file browser.
    * **Archive** (single ZIP file). Only 1 archive file can be imported at a time.
    * **Separate Files** (up to 30 individual files). Each file must be ≤ 512 MB.
3. Once files appear in the list, click **Next** to proceed.
4. Resolve any conflicts by choosing a strategy for handling files with the same name and path:
   * **Override**: Replace existing files with the new ones.
   * **Skip**: Do not import conflicting files; keep existing ones unchanged.
   * **Edit manually**: Rename incoming files one by one to avoid conflicts. Each conflicting file is flagged with red and becomes editable - update its **Name** to avoid conflict.
5. Once all conflicts are resolved, click **Finish** to complete the import.

    ![img_2.png](img/img_51.png)

## Configuration

##### Top Bar Controls

* **Delete**: Permanently removes this file from your DIAL instance.

### Properties

In the Properties tab, you can view and manage files, including moving them across folders.

![img_1.png](img/img_36.png)


| Field                | Required | Definition & Use Case    |
|----------------------|-----------|-------------------------------------|
| **Name**             | -         | The filename including extension (e.g. request.json, lookup.csv). Display-only but with a copy-to-clipboard button for easy reference. |
| **Source/Name**      | -         | The name of the file without the extension (e.g. request). To download, click on additional actions button.|
| **Source/Extension** | -         | The file type (e.g. .json, .csv, .pdf).   |
| **Storage Folder**   | Yes   | The actual path of the file in the folders hierarchy. Allows you to move the file across folders. |  
