# Keys

## What Is a “Key” in DIAL?

In DIAL, API Keys play a crucial role in managing access and ensuring security:

   * API keys are used for authentication and access control.
   * They can be configured to be secured and can have specific roles and limits assigned to them.
   * API keys are essential for external applications accessing language models and applications deployed in AI DIAL.

More information on the API keys in DIAL Core documentation: 

* https://docs.dialx.ai/platform/core/access-control-intro#api-keys

## Keys Listing

The Keys page provides a centralized view and management interface for all API keys in DIAL Admin.

![img.png](img/img_42.png)

### 1. Navigate to Keys

In the sidebar, expand **Access Management** and click **Keys**.

### 2. Keys Grid

**Filtering & Sorting**
* Each column header has sort arrows; click to reorder.
* Beneath each header is a filter box - type text to narrow the list in real time.

| Column                  | Definition                                                                                                                                  |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| **Name**                | Human-friendly identifier for the key (e.g. `analytics-service-key`). Names help you map keys to consumers or services in logs and configs. |
| **Description**         | Optional notes explaining the key’s purpose, owner/team, or special instructions.                                                           |
| **Key generation time** | Timestamp when the key was created. Useful for auditing and correlating key use with system changes or deployments.                         |
| **Expiration time**     | Timestamp when the key automatically becomes invalid. Setting expirations enforces regular key rotation.                                    |
| **Status**              | Current key's lifecycle state.                                                                                                              |


## Create Keys

Use the **Create Key** dialog to register a key in your DIAL instance. Once added, it appears in the **Keys** listing.

![img_1.png](img/img_43.png)

### 1. Hit **Create** button 

Opens the **Create Key** modal.

### 2. Define key parameters

In the modal, specify the following for the new key:

| Field               | Required | Description & Use Cases                                                                                                                                         |
|---------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Name**            | **Yes**   | A human-readable identifier for the key.   Use meaningful names to tie keys back to projects, environments, or teams.                                        |
| **Description**     | No        | Optional free-form text.   Document the key’s purpose, owner team, or usage context.                                                                         |
| **Project**         | **Yes**   | Logical project or department grouping (e.g. “AnalyticsTeam”).   Helps organize keys and apply cost/usage reporting by project.                              |
| **Key value**       | **Yes**   | The actual secret string used for authentication. Initially hidden; click **👁️** to reveal.   Press **Generate** to have its value automatically generated. |
| **Validity Period** | **Yes**   | The period after which the key will become invalid. Use to enforce credential rotation and retirement.                                                          |

### 3. Click Create 
Once all required fields are filled hit **Create** button. The dialog closes and the new role configuration screen is opened.

  > This entry will appear immediately in the listing once created.


## Key Configuration - Top Bar Controls

* **Delete**: Permanently removes this key definition. All related entities  still bound to it may fail.

* **JSON Editor** (Toggle): Switch between the form-based UI and raw JSON view of the key’s configuration. Use JSON mode for copy-paste or advanced edits.
* **Rotation** button lets you safely refresh an existing API key in one step: click Rotate, paste or auto-Generate a new secret in the Key value field, pick a Validity period—the default is three months.


## Key Configuration - Properties Tab

The Properties tab for a Key lets you view and manage all metadata and settings for a specific API key. 

![img_2.png](img/img_44.png)

### 1. Properties Fields

| Field                     | Required | Description & Use Cases                                                                                                                       |
| ------------------------- |----------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| **Name**                  | **Yes**  | A human-readable identifier for the key.   Use meaningful names to tie keys back to projects, environments, or teams.                      |
| **Description**           | No       | Free-form text.   Document the key’s purpose, owner team, or usage context (e.g. “Used by QH Data Ingestion pipeline”).                    |
| **Project**               | **Yes**  | Logical project or department grouping (e.g. “QH”, “AnalyticsTeam”).   Helps organize keys and apply cost/usage reporting by project.      |
| **Project contact point** | No       | Email of the responsible person or group.                                                                                                     |
| **Key value**             | **Yes**  | The actual secret string used for authentication. Initially hidden; click **👁️** to reveal.   Press **Copy** to copy it to your clipboard. |
| **Secured**               | **Yes**  | Toggle whether the key value is treated as a “secure” credential.                                                          |


## Key Configuration - Roles Tab

The Roles tab lets you grant or revoke access to this API key by associating it with one or more DIAL Roles. 
Only clients possessing this key and belonging to one of the assigned roles can invoke protected Models or Applications.

![img_3.png](img/img_45.png)

### 1. Roles List

| Column          | Description                                   |
| --------------- |-----------------------------------------------|
| **Name**        | Unique identifier of the Role.                |
| **Description** | Human-readable summary of the Role’s purpose. |


### 2. Adding Role

1. Click **+ Add** (top-right of the Roles Grid).
2. **Select** one or more role in the modal.
3. **Confirm** to insert them into the table.

### 3. Removing Role
 
1. Click the actions menu (•••) in the role's line.
2. Choose **Remove** in the menu.