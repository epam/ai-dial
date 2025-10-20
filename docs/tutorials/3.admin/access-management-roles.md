# Roles

## About Roles

Roles in DIAL are used to enable roles-based access to resources (applications, models, files, conversations, and prompts) and also for cost control. Here are the key aspects of roles in DIAL:

* **Resource Access Control**: Roles determine who can use specific resources like AI models or applications. For instance, you can grant "operator" users access to the "chat-gpt-35-turbo" model.
* **Usage Limits**: Roles can enforce limits on resource usage, preventing overuse and abuse. You can set daily, weekly, or monthly token limits for specific roles using a model.
* **Custom Application Logic**: Developers can leverage roles within their applications to create custom behaviors. By accessing role information from user tokens, applications can tailor responses or restrict access to internal assets.
* **System Feature Access**: Roles manage access to system-level features, ensuring only authorized users have access. For example, only users with the "admin" role might be able to access the administration console.

> * Refer to [Access & Cost Control](/docs/platform/3.core/2.access-control-intro.md) to learn more about how roles are used in DIAL.
> * Refer to [Tutorials](/docs/tutorials/2.devops/2.auth-and-access-control/0.api-keys.md) to learn how to configure roles for API keys.
> * Refer to [Tutorials](/docs/tutorials/2.devops/2.auth-and-access-control/1.jwt.md) to learn how to configure roles for JWT.
> * Refer to [IDP Configurations](/docs/tutorials/2.devops/2.auth-and-access-control/2.configure-idps/0.overview.md) to learn about the supported identity service providers and how to configure them.

## Roles List

In Roles, you can define and manage roles in DIAL. 

![](img/img_37.png)

##### Roles Grid

| Column           | Definition & Use Case                                                                              |
|------------------|----------------------------------------------------------------------------------------------------|
| **ID**           | This is a unique key under the Roles section of DIAL Admin.                                        |
| **Display Name** | A user-friendly name of a role (e.g. Data Extraction Admin, Analysts, Business User).              |
| **Description**  | A free-form description of a role (e.g. "Business User role for the Data Extraction application"). |

## Create Role

1. Click **Create** to invoke the **Create Role** modal.
2. Define role's parameters:

    | Column           | Required | Definition & Use Case                                                                              |
    |------------------|----------|----------------------------------------------------------------------------------------------------|
    | **ID**           | Yes      | This is a unique key under the Roles section of DIAL Admin.                                        |
    | **Display Name** | Yes      | A user-friendly name of a role (e.g. Data Extraction Admin, Analysts, Business User).              |
    | **Description**  | No       | A free-form description of a role (e.g. "Business User role for the Data Extraction application"). |

3. Once all required fields are filled, click **Create**. The dialog closes and the new [role configuration](#role-configuration) screen is opened. A new role entry will appear immediately in the listing once created.

![](img/img_38.png)

## Role Configuration

##### Top Bar Controls

* **Delete**: Permanently removes the selected role.
* **JSON Editor** (Toggle): Switch between the form-based UI and raw [JSON view](#json-editor) of the role's configuration. Use JSON mode for copy-paste or advanced edits.

### Properties

In the Properties tab, you can define the identity and metadata for the role. These settings determine how the role appears throughout DIAL and help administrators understand its purpose.

![](img/img_39.png)


| Field               | Required | Description                                                                                                                                                                                                                                                         |
|---------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **ID**              | -        | This is a unique key under the Roles section of DIAL Admin.                                                                                                                                                                                                         |
| **Updated Time**    | -        | Date and time when the role's configuration was last updated.                                                                                                                                                                                                       |
| **Creation Time**   | -        | Date and time when the role's configuration was created.                                                                                                                                                                                                            |
| **Display Name**    | Yes      | A unique identifier of the role, used in ACL selectors and in API calls.                                                                                                                                                                                            |
| **Description**     | No       | Optional free-form text describing the role’s intended audience or use.                                                                                                                                                                                             |
| **Set cost limits** | No       | Toggle **Set cost limits** to enable per-role usage caps, then configure optional quotas: **Tokens per minute**, **Tokens per day**, **Tokens per week**, **Tokens per month** (leave blank for unlimited).                                                         |
| **Sharing**         | No       | Per resource type (**Applications**, **Toolsets**, **Prompts**, **Files**, **Conversations**), set **Expiration time (hours)** for automatic expiry and **Max users** (or **No Limits**); use the **…** row menu for resetting to defaults or setting to no limits. |


### Entities

In the Entities tab, you can assign which [Models](/docs/tutorials/3.admin/entities-models.md), [Applications](/docs/tutorials/3.admin/entities-applications.md) or [Routes](/docs/tutorials/3.admin/entities-routes.md) this role can access, and within which rate limits.

![img_8.png](img/img_40.png)

| Column                | Definition                                                                                                                                                                                                |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **ID**                | This is a unique key under of the Entity (e.g., Model, Application).                                                                                                                                      |
| **Display Name**      | A user-friendly name of the resource (Model, Application, or Route) as shown in DIAL.                                                                                                                     |
| **Description**       | A brief description of the resource.                                                                                                                                                                      |
| **Type**              | Resource category: one of [Models](/docs/tutorials/3.admin/entities-models.md), [Applications](/docs/tutorials/3.admin/entities-applications.md) or [Routes](/docs/tutorials/3.admin/entities-routes.md). |
| **Tokens per minute** | Maximum number of tokens this role may consume per minute when calling this resource. <br />"Unlimited" if no limit is set.                                                                               |
| **Tokens per day**    | Maximum number of tokens this role may consume per day when calling this resource. <br />"Unlimited" if no limit is set.                                                                                  |
| **Tokens per week**   | Maximum number of tokens this role may consume per week when calling this resource. <br />"Unlimited" if no limit is set.                                                                                 |
| **Tokens per month**  | Maximum number of tokens this role may consume per month when calling this resource. <br />"Unlimited" if no limit is set.                                                                                |

#### Add

1. Click **+ Add** (top-right of the Entities Grid).
2. **Select** one or more applications/models in the modal window.
3. **Confirm** to insert them into the table.

#### Remove
 
1. Click the **actions** menu in the entity's line.
2. Choose **Remove** in the menu.

### Keys

In the Keys tab, you can assign [API keys](/docs/tutorials/3.admin/access-management-keys.md) for roles. API keys are defined in the [Access Management → Keys](/docs/tutorials/3.admin/access-management-keys.md) section.

![](img/img_41.png)

| Column                  | Definition                                                                                       |
|-------------------------|--------------------------------------------------------------------------------------------------|
| **ID**                  | A unique key under the Keys section of DIAL Admin.                                               |
| **Display Name**        | A user-friendly name of the Key.                                                                 |
| **Description**         | Additional key’s details, e.g., purpose  or usage context.                                       |
| **Key generation time** | A key's creation timestamp.                                                                      |
| **Expiration time**     | A key's expiration timestamp. Blank means no expiration (i.e. permanent until manually revoked). |
| **Status**              | The current state of the key.                                                                    |
| **Project**             | Project associated with the key for the costs tracking purpose.                                  |

#### Add

1. Click **+ Add** (top-right of the Keys Grid).
2. **Select** one or more keys in the modal. Available API keys are defined in the [Access Management → Keys](/docs/tutorials/3.admin/access-management-keys.md) section.
3. **Confirm** to insert them into the table.

#### Remove

Use to revoke an assigned API key. To delete API key, go to [Access Management → Keys](/docs/tutorials/3.admin/access-management-keys.md) section.
 
1. Click the **actions** menu in the key's line.
2. Choose **Remove** in the menu.

### Audit

In the **Audit** tab, you can monitor activities related to the selected role. 

#### Activities

The Activities section provides detailed visibility into all changes made to the selected role. This section mimics the functionality available in the global [Audit → Activities](/docs/tutorials/3.admin/telemetry-activity-audit.md) menu, but is scoped specifically to the selected role.

![](img/128.png)

##### Activities List Table

| **Field**         | **Definition**                                                                                                                                                                                                                                                                               |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Activity type** | The type of action performed on the role (e.g., Create, Update, Delete).                                                                                                                                                                                                                     |
| **Time**          | Timestamp indicating when the activity occurred.                                                                                                                                                                                                                                             |
| **Initiated**     | Email address of the user who performed the activity.                                                                                                                                                                                                                                        |
| **Activity ID**   | A unique identifier for the logged activity, used for tracking and auditing.                                                                                                                                                                                                                 |
| **Actions**       | Available actions:<br />- **View details**: Click to open a new screen with activity details. Refer to [Activity Details](#activity-details) to learn more.<br />- **Resource rollback**: click to restore a previous version. Refer to [Resource Rollback](#resource-rollback) for details. |

##### Activity Details

The Activity Details view provides a detailed snapshot of a specific change made to a role.

![](img/129.png)

To open Activity Details, click on the three-dot menu (⋮) at the end of a row in the Activities grid and select “View Details”.

| **Element/Section**  | **Description**                                                                                                                                          |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Activity type**    | Type of the change performed (e.g., Update, Create, Delete).                                                                                             |
| **Time**             | Timestamp of the change.                                                                                                                                 |
| **Initiated**        | Identifier of the user who made the change.                                                                                                              |
| **Activity ID**      | Unique identifier for the specific activity tracking.                                                                                                    |
| **Comparison**       | Dropdown to switch between showing all parameter or changed only.                                                                                        |
| **View**             | Dropdown to switch for selection between Before/After and Before/Current state.                                                                          |
| **Parameters Diff**  | Side-by-side comparison of role fields values before and after the change. Color-coding is used to indicate the operation type (Update, Create, Delete). |


### JSON Editor

For advanced scenarios of bulk updates, copy/paste between environments, or tweaking settings not exposed in the form UI—you can switch to the **JSON Editor** in any role's configuration page.

![](img/74.png)

##### Switching to the JSON Editor

1. Navigate to **Access Management → Roles**, then select the role you want to edit.
2. Click the **JSON Editor** toggle (top-right). The UI reveals the raw JSON.

> **TIP**: You can switch between UI and JSON only if there are no unsaved changes.

