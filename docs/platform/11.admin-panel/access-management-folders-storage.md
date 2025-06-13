# Folders

## What Is a “Folder” in DIAL?

The Folders Storage section of DIAL Admin lets you control which users or roles can browse and access different directories in the Assets (Prompts & Files) area. 
You define per-folder ACL rules - built on user groups, so only authorized principals see or upload assets in each folder.

## Folders Listing

The Folders Storage section is where you manage all folders and their hierarchy.

![img.png](img/img_46.png)

### 1. Navigate to Folders

In the sidebar, expand **Access Management** and click **Folders Storage**.

### 2. Folders Hierarchy

**Folders Structure (Left Pane)**: Shows a hierarchical view of all storage folders under the root.

| Element                  | Behavior                                                                                  |
|--------------------------|-------------------------------------------------------------------------------------------|
| **Public folder**        | Root folder visible to all users.                                                         |
| **User-defined folders** | Collapsible folders you create to group files by project, team, domain, or environment.   |
| **⯈ Icons**              | Click to expand or collapse subfolders, drilling down to the set of sub-folders you need. |

## Create Folder

Use the Create Folder dialog to add a new reusable folder to your DIAL instance. Once added, it appears in the **Folders** listing.

### 1. Select folder

Before clicking + Create, select the folder in the left tree which you want to be a parent folder. The new folder will be placed in that folder.

### 2. Hit **Create** button 

Opens the **Create File** modal.

### 4. Click Create 

Once all required fields are filled hit **Create** button. The dialog closes and the new folder appears in the hierarchy.

## Folders Permissions (Right Pane)

When a folder is selected, the right pane displays its access-control rules. These determine who can view or add assets within that folder.

Rules can be nested under And / Or blocks to form complex access policies:
* **And**: All rules must be satisfied.
* **Or**: At least one rule must be satisfied.

> Note: All the parent folders' access rules apply along with the rules to the current

### Adding & Removing Access Rules

Click the Add button beneath any rule node to append a new permission rule to the given folder. Specify attribute, operation and value. 

Click the trash-can icon on the right edge of any rule to remove it.