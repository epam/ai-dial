# Interceptor Templates

## About Interceptor Templates

An **interceptor template** is a reusable blueprint for creating interceptors in DIAL. It allows to save time on similar interceptors configuration.

> Refer to [Interceptors](/docs/platform/3.core/6.interceptors.md) to learn more.


## Interceptor Templates List

In Interceptor Templates, you can add and manage Interceptor Templates you have in your DIAL instance.

### Interceptor Templates Grid

| Field            | Definition                                                                                                                                                         |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Display name** | A user-friendly label for the interceptor template (e.g. “PII Obfuscator”, "Words Blacklist", etc.). Helps you pick the right one when configuring an interceptor. |
| **ID**           | The unique identifier used internally.                                                                                                                             |
| **Description**  | Free-text notes about the interceptor template and how it can be used.                                                                                             |

![97.png](img/97.png)

## Create

1. Click **+ Create** to invoke the **Create Interceptor Template** modal.
2. Define key parameters for the new interceptor template:

| Field            | Required | Definition                                                                                                                                                          |
|------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **ID**           | **Yes**  | The unique identifier used internally.                                                                                                                              |
| **Display name** | No       | A user-friendly label for the interceptor template (e.g. “PII Obfuscator”, "Words Blacklist", etc.). Helps you pick the right one when configuring an interceptor.  |
| **Description**  | No       | Free-text notes about the interceptor template and how it can be used.                                                                                              |

3. Once all required fields are filled, click **Create**. The dialog closes and the new template [configuration screen](#configuration) is opened. A new template will appear immediately in the listing once created. It may take some time for the changes to take effect after saving.

![98.png](img/98.png)

## Configuration

##### Top Bar Controls

**Delete**: Permanently removes the selected interceptor template. 
> **IMPORTANT:** All related interceptors still bound to it will be deleted as well.

### Properties tab

In the Properties tab, you can define identity, metadata and endpoints of interceptor template.

Header (non-editable):

| Field             | Definition                                                                                               |
|-------------------|----------------------------------------------------------------------------------------------------------|
| **ID**            | Read-only unique ID of the template (copyable). Cannot be changed after interceptor template is created. |
| **Updated Time**  | Timestamp for changes tracking and audit evidence (e.g., to verify when the last change was done).       |
| **Creation Time** | Timestamp of when Interceptor Template was created.                                                      |

Fields: 

| Field                      | Required | Definition                                                                                                                                                         |
|----------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Display name**           | No       | A user-friendly label for the interceptor template (e.g. “PII Obfuscator”, "Words Blacklist", etc.). Helps you pick the right one when configuring an interceptor. |
| **Description**            | No       | Free-text notes about the interceptor template and how it can be used.                                                                                             |
| **Completion endpoint**    | No       | This is the endpoint used by DIAL Core to manage chat completion requests from interceptors.                                                                       |
| **Configuration endpoint** | No       | This endpoint is used to request interceptor's configuration parameters as a JSON schema.                                                                          |

![99.png](img/99.png)

### Interceptors tab

A **read-only** grid showing all interceptor **instances** created from this template. Use it to assess potential impact before template edits or deletion.

### Grid (non-editable)

| Field            | Definition                                                                           |
|------------------|--------------------------------------------------------------------------------------|
| **ID**           | Unique ID of the dependent Interceptor.                                              |
| **Display Name** | Display name of the interceptor instance that inherits this template.                |
| **Description**  | A free-text summary of the interceptor’s behavior and any configuration parameters.  |


### Audit

#### Activities

The Activities section under the Audit tab of a specific interceptor template provides detailed visibility into all changes made to it.

This section mimics the functionality available in the global [Audit → Activities](/docs/tutorials/3.admin/telemetry-activity-audit.md) menu, but is scoped specifically to the selected template.


##### Activities List Table

| **Field**         | **Definition**                                                                           |
|-------------------|------------------------------------------------------------------------------------------|
| **Activity type** | The type of action performed on the interceptor template (e.g., Create, Update, Delete). |
| **Time**          | Timestamp indicating when the activity occurred.                                         |
| **Initiated**     | Email address of the user who performed the activity.                                    |
| **Activity ID**   | A unique identifier for the logged activity, used for tracking and auditing.             |

##### Activity Details

The Activity Details view provides a detailed snapshot of a specific change made to an interceptor template.

To open Activity Details, click on the three-dot menu (⋮) at the end of a row in the Activities grid and select “View Details”.

| **Element/Section** | **Description**                                                                                                                                         |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Activity type**   | Type of the change performed (e.g., Update, Create, Delete).                                                                                            |
| **Time**            | Timestamp of the change.                                                                                                                                |
| **Initiated**       | Identifier of the user who made the change.                                                                                                             |
| **Activity ID**     | Unique identifier for the specific activity tracking.                                                                                                   |
| **View**            | Dropdown to switch between showing all parameter or changed only.                                                                                       |
| **Parameters Diff** | Side-by-side comparison of the fields values before and after the change. Color-coding is used to indicate the operation type (Update, Create, Delete). |

![100.png](img/100.png)
