# Keys

## About API Keys

In DIAL, API Keys play a crucial role in managing access and ensuring security:

* API keys are used for authentication and access control.
* They can be configured to be secured and can have specific roles and limits assigned to them.
* API keys are essential for external applications accessing language models and applications deployed in DIAL.

> Refer to [Access & Cost Control](/docs/platform/3.core/2.access-control-intro.md#api-keys) to learn more. 

## Keys List

The Keys page provides a centralized view and management interface for all API keys in DIAL.

![](img/img_42.png)

##### Keys Grid

> **TIP**: Use the **Columns** selector to customize which columns are visible in the grid.

| Column | Definition |
|-------------------------|------------|
| **Name**     | A user-friendly identifier of a key (e.g. `analytics-service-key`). Names help you map keys to consumers or services in logs and configs. |
| **Description**   | Optional notes explaining the key’s purpose, owner/team, or special instructions.   |
| **Key generation time** | A key's creation timestamp. Useful for auditing and correlating the key's usage with system changes or deployments.|
| **Expiration time**     | A key's expiration timestamp. Setting expirations enforces regular key rotation. |
| **Status**   | The current state of the key.|
| **Project**   | The name of the project the key is associated with.|
| **Project Contact Point**   | The contact person on a project.|
| **Secured**   | A flag that identifies [secured API keys](/docs/platform/3.core/4.privacy.md#applications-audit-logs).|


## Create Keys

1. Click **Create** to invoke the **Create Key** modal.
2. In the modal, specify the following parameters for the new key:

    | Field    | Required | Description & Use Cases|
    |---------------------|-----------|--------------|
    | **Name** | Yes   | A user-friendly identifier for the key.<br />Use meaningful names to associate keys with projects, environments, or teams.     |
    | **Description**     | No  | An optional free-form text.<br />Use to document the key’s purpose, owner team, or usage context.   |
    | **Project**   | Yes   | Logical project or department grouping (e.g. "AnalyticsTeam").<br />Helps organize keys and apply cost/usage reporting by project.     |
    | **Key value** | Yes   | The actual secret string used for authentication.<br />Initially hidden; click **👁️** to reveal.<br />Press **Generate** to have its value automatically generated. |
    | **Validity Period** | Yes   | A key's expiration time period. Use to enforce credential rotation and retirement.  |

3. Once all required fields are filled, click **Create**. The dialog closes and the new [key configuration](#key-configuration) screen is opened. A new key entry will appear immediately in the listing once created.

        ![](img/img_43.png)


## Key Configuration

##### Top Bar Controls

* **Delete**: Permanently removes the selected key. All related entities (applications, models, routes) bound to it may fail.
* **JSON Editor** (Toggle): Switch between the form-based UI and raw [JSON view](#json-editor) of the key’s configuration. Use JSON mode for copy-paste or advanced edits.

### Keys Rotation

Use **Rotation** to refresh an existing API key.

1. Click any API key to invoke the configuration screen
2. Click **Rotate**.
3. Paste or auto-generate a new secret in the **Key value** field.
4. Pick the **Validity period**. The default expiration period is three months.
5. Click **Rotate** to apply the changes.

### Properties

In the Properties tab, you can view and manage all metadata and settings for a specific API key. 

![](img/img_44.png)

| Field| Required | Description & Use Cases |
| -----|----------|--------------------|
| **Name** | Yes  | A user-friendly identifier of a key.<br />Use meaningful names to tie keys back to projects, environments, or teams. |
| **Description**| No | A free-form text.<br />Use to document the key’s purpose, owner team, or usage context (e.g. "Used by QH Data Ingestion pipeline").   |
| **Project**    | Yes  | Logical project or department grouping (e.g. "QH", "AnalyticsTeam").<br />Helps organize keys and apply cost/usage reporting by project.|
| **Project contact point** | No | Email of the responsible person or group.     |
| **Key value**  | Yes  | The actual secret string used for authentication.<br />Initially hidden - click **👁️** to reveal.<br />Press **Copy** to copy it to clipboard. |
| **Secured**    | Yes  | Toggle to make the key a [secured API key](/docs/platform/3.core/4.privacy.md#applications-audit-logs). |


### Roles

In the Roles tab, you can grant or revoke access to DIAL resources for API keys by associating them with [roles](/docs/tutorials/3.admin/access-management-roles.md). Only clients possessing this key and belonging to one of the assigned roles can invoke protected Models or Applications.

![](img/img_45.png)

| Column    | Description|
| --------------- |-----------------------------------------------|
| **Name**  | A unique identifier of the role.     |
| **Description** | User-friendly summary of the Role’s purpose. |

#### Add

1. Click **+ Add** (top-right of the Roles Grid).
2. **Select** one or more role in the modal window. Roles are defined in the [Access Management → Roles](/docs/tutorials/3.admin/access-management-roles.md) section.
3. **Confirm** to insert them into the table.

#### Remove

Use to stop associating API keys with roles. To delete a role, go to the [Access Management → Roles](/docs/tutorials/3.admin/access-management-roles.md) section.
 
1. Click the **actions** menu in the role's line.
2. Choose **Remove** in the menu.

![](img/83.png)

### JSON Editor

For advanced scenarios of bulk updates, copy/paste between environments, or tweaking settings not exposed in the form UI—you can switch to the **JSON Editor** in any key's configuration page.

![](img/75.png)

##### Switching to the JSON Editor

1. Navigate to **Access Management → Keys**, then select the key you want to edit.
2. Click the **JSON Editor** toggle (top-right). The UI reveals the raw JSON.

> **TIP**: You can switch between UI and JSON only if there are no unsaved changes.

