# Roles

## About Roles

Roles in DIAL are used to enable roles-based access to resources (applications, models, files, conversations, and prompts) and also for cost control. Here are the key aspects of roles in DIAL:

* **Resource Access Control**: Roles determine who can use specific resources like AI models or applications. For instance, you can grant "operator" users access to the "chat-gpt-35-turbo" model.
* **Usage Limits**: Roles can enforce limits on resource usage, preventing overuse and abuse. You can set daily, weekly, or monthly token limits for specific roles using a model.
* **Custom Application Logic**: Developers can leverage roles within their applications to create custom behaviors. By accessing role information from user tokens, applications can tailor responses or restrict access to internal assets.
* **System Feature Access**: Roles manage access to system-level features, ensuring only authorized users have access. For example, only users with the "admin" role might be able to access the administration console.

> * Refer to [Access & Cost Control](/docs/platform/3.core/2.access-control-intro.md) to learn more about how roles are used in DIAL.
> * Refer to [Tutorials](/docs/tutorials/2.devops/2.auth-and-access-control/1.api-key-roles.md) to learn how to configure roles for API keys.
> * Refer to [Tutorials](/docs/tutorials/2.devops/2.auth-and-access-control/2.chat-users-roles.md) to learn how to configure roles for JWT.
> * Refer to [IDP Configurations](/docs/tutorials/2.devops/2.auth-and-access-control/3.configure-idps/0.overview.md) to learn about the supported identity service providers and how to configure them.

## Roles List

In Roles, you can define and manage roles in DIAL. 

![](img/img_37.png)

##### Roles Grid

| Column          | Definition & Use Case|
|-----------------|-----------------------------------------------------------------------------------------------------------|
| **Name**        | A unique, user-friendly identifier of a role (e.g. Data Extraction Admin, Analysts, Business User).     |
| **Description** | A free-form description of a role (e.g. "Business User role for the Data Extraction application").  |

## Create Role

1. Click **Create** to invoke the **Create Role** modal.
2. Define role's parameters:

    | Column          | Definition & Use Case|
    |-----------------|-----------------------------------------------------------------------------------------------------------|
    | **Name**        | A unique, user-friendly identifier of a role (e.g. Data Extraction Admin, Analysts, Business User).     |
    | **Description** | A free-form description of a role (e.g. "Business User role for the Data Extraction application").  |

3. Once all required fields are filled, click **Create**. The dialog closes and the new [role configuration](#role-configuration) screen is opened. A new role entry will appear immediately in the listing once created.

        ![](img/img_38.png)

## Role Configuration

##### Top Bar Controls

* **Delete**: Permanently removes the selected role.
* **JSON Editor** (Toggle): Switch between the form-based UI and raw [JSON view](#json-editor) of the role's configuration. Use JSON mode for copy-paste or advanced edits.

### Properties

In the Properties tab, you can define the identity and metadata for the role. These settings determine how the role appears throughout DIAL and help administrators understand its purpose.

![](img/img_39.png)


| Field           | Required | Description                                                                 |
|-----------------|-----------|-----------------------------------------------------------------------------|
| **Name**        | Yes   | A unique identifier of the role, used in ACL selectors and in API calls. |
| **Description** | No        | Optional free-form text describing the role’s intended audience or use.     |


### Entities

In the Entities tab, you can assign which [Models](/docs/platform/11.admin-panel/entities-models.md), [Applications](/docs/platform/11.admin-panel/entities-applications.md) or [Routes](/docs/platform/11.admin-panel/entities-routes.md) this role can access, and within which rate limits.

![img_8.png](img/img_40.png)

| Column                | Definition                       |
| --------------------- |-----------------------------------------------------------------------------------------------------------------------|
| **Display Name**      | A user-friendly name of the resource (Model, Application, or Route) as shown in DIAL.                                    |
| **Version**           | Version tag of the resource (e.g. `v1.2`, `1.0.0`).                                                                     |
| **Description**       | A brief description of the resource.                                                                             |
| **Deployment ID**     | A unique internal identifier used by DIAL to call the resource's endpoint.                                          |
| **Type**              | Resource category: one of [Models](/docs/platform/11.admin-panel/entities-models.md), [Applications](/docs/platform/11.admin-panel/entities-applications.md) or [Routes](/docs/platform/11.admin-panel/entities-routes.md).                                                |
| **Tokens per minute** | Maximum number of tokens this role may consume per minute when calling this resource. <br />"Unlimited" if no limit is set. |
| **Tokens per day**    | Maximum number of tokens this role may consume per day when calling this resource. <br />"Unlimited" if no limit is set.    |
| **Tokens per week**   | Maximum number of tokens this role may consume per week when calling this resource. <br />"Unlimited" if no limit is set.   |
| **Tokens per month**  | Maximum number of tokens this role may consume per month when calling this resource. <br />"Unlimited" if no limit is set.  |

#### Add

1. Click **+ Add** (top-right of the Entities Grid).
2. **Select** one or more applications/models in the modal window.
3. **Confirm** to insert them into the table.

#### Remove
 
1. Click the **actions** menu in the entity's line.
2. Choose **Remove** in the menu.

### Keys

In the Keys tab, you can assign [API keys](/docs/platform/11.admin-panel/access-management-keys.md) for roles. API keys are defined in the [Access Management → Keys](/docs/platform/11.admin-panel/access-management-keys.md) section.

![](img/img_41.png)

| Column                  | Definition      |
|-------------------------|------|
| **Name**                | A user-friendly identifier for an API key. Typically, reflects the intended consumer or purpose<br />(e.g. `mobile-sdk-key`, `data-extraction-worker`). |
| **Description**         | An optional free-text notes about this key’s purpose or scope.     |
| **Key generation time** | A key's creation timestamp.|
| **Expiration time**     | A key's expiration timestamp. Blank means no expiration (i.e. permanent until manually revoked).             |
| **Status**              | The current state of the key.|

#### Add

1. Click **+ Add** (top-right of the Keys Grid).
2. **Select** one or more keys in the modal. Available API keys are defined in the [Access Management → Keys](/docs/platform/11.admin-panel/access-management-keys.md) section.
3. **Confirm** to insert them into the table.

#### Remove

Use to revoke an assigned API key. To delete API key, go to [Access Management → Keys](/docs/platform/11.admin-panel/access-management-keys.md) section.
 
1. Click the **actions** menu in the key's line.
2. Choose **Remove** in the menu.

### JSON Editor

For advanced scenarios of bulk updates, copy/paste between environments, or tweaking settings not exposed in the form UI—you can switch to the **JSON Editor** in any role's configuration page.

![](img/74.png)

##### Switching to the JSON Editor

1. Navigate to **Access Management → Roles**, then select the role you want to edit.
2. Click the **JSON Editor** toggle (top-right). The UI reveals the raw JSON.

> **TIP**: You can switch between UI and JSON only if there are no unsaved changes.

