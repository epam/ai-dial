# Adapters

## About Adapters

In DIAL, **model adapters** unify provider-specific model APIs with the **Unified Protocol** of DIAL Core. Each adapter consists of:

* **Coded implementation** that talks to the AI model and implements the Unified Protocol.
* **Metadata object** that you manage in **Builders → Adapters**, which establishes the relationship to the **models**.

> Refer to [Adapters documentation](/docs/platform/0.architecture-and-concepts/3.components.md#model-adapters) to learn more.

## Adapters Main Screen

The main screen displays all registered adapters in your DIAL instance.

![](img/89.png)

##### Adapters Grid

| Column            | Definition        |
|-------------------|---------------------|
| **ID**          | The adapter’s unique name (identifier).      |
| **Display Name**  | A user-friendly label for the adapter. Helps you pick the right adapter when creating a new model. |
| **Description**   | Free-text notes about the adapter’s purpose (e.g., “Adapter for OpenAI models”).                   |
|**Updated time**|Timestamp of the last update to this adapter's configuration. Useful to track recent changes. |

## Create

On the main scree, you can add new adapters to your instance of DIAL:

1. Click **+ Create** to invoke the **Adapter** modal.
2. Define key parameters for the new adapter:

    | Field                 | Required | Definition                    |
    |-----------------------|----------|-------------------|
    | **ID**              | Yes      | A unique identifier for this adapter.                    |
    | **Display name**      | No       | A user-friendly name of the adapter.                     |
    | **Description**       | No       | Free-text notes about what this adapter is for.          |
    | **Base endpoint**     | Yes      | The base URL of the adapter service that implements the Unified Protocol. Is the base URL part of the model completion endpoint if one created based on the adapter. |

3. Once all required fields are filled, click **Create**. The dialog closes and the new adapter's configuration screen is opened. A new adapter will appear immediately on the main screen once it is created.

    ![](img/90.png)

## Configuration

Click any adapter on the main screen to open its configuration page.

##### Top Bar Controls

* **Create Model**: Use to create a model deployment using the selected model adapter. Created models will be available in the [Entities → Models](/docs/tutorials/3.admin/entities-models.md) section.
* **Delete**: Use to remove the adapter itself and all models utilizing it. After confirmation - the adapter and all related models are deleted.
* **JSON Editor** (Toggle): Switch between the form-based UI and raw [JSON view](#json-editor) of the adapter's configuration. Use JSON mode for copy-paste or advanced edits.

### Properties

In the Properties tab, you can view and define identity and metadata of the selected adapter.

| Field                 | Required | Editable|Definition                |
|-----------------------|----------|------|------------|
| **ID**              | -      | No|A unique identifier for this adapter.                |
|**Updated Time**|-|No|Timestamp of the last update to this adapter's configuration. Useful to track recent changes. |
|**Creation Time**|-|No|Adapter creation timestamp.|
| **Display name**      | Yes       | Yes |A user-friendly name of the adapter.                 |
| **Description**       | No       | Yes |Free-text notes about what this adapter is for.      |
| **Base endpoint**     | Yes      | Yes |The base URL of the adapter service that implements the Unified Protocol. Is the base URL part of the model completion endpoint if created based on the adapter. |

![](img/91.png)

### Models

In the **Models** tab, you can manage all models this adapter exposes.

| Column            | Description                                                                               |
|-------------------|-------------------------------------------------------------------------------------------|
| **ID**            | Model's identifier.                                                                       |
| **Display Name**  | A user-friendly name of the model that will be displayed on UI.                           |
| **Description**   | A free-text description of the model                                                      |

![](img/92.png)

#### Add

You can add new models that will be processed by the selected adapter. 

1. Click **+ Add**.
2. **Select** one or more available models in the modal window. You can check all the available models in the [Entities → Models](/docs/tutorials/3.admin/entities-models.md) section. You can also use **+ Create Model** button [on this screen](#top-bar-controls) to create a new model on the fly.
3. **Confirm** to insert them into the table.

#### Remove

You can remove models processed by the adapter.
 
1. Click the **actions** menu in the model’s line.
2. Choose **Remove** in the menu.

### Audit

In the **Audit** tab, you can monitor activities related to the selected adapter.

#### Activities

The Activities section provides detailed visibility into all changes made to the selected adapter. This section mimics the functionality available in the global [Audit → Activities](/docs/tutorials/3.admin/telemetry-activity-audit.md) menu, but is scoped specifically to the selected adapter.

### JSON Editor

For advanced scenarios of bulk updates, copy/paste between environments, or tweaking settings not exposed in the form UI—you can switch to the **JSON Editor** in any adapter's configuration page.

##### Switching to the JSON Editor

1. Navigate to **Builders → Adapters**, then select the adapter you want to edit.
2. Click the **JSON Editor** toggle (top-right). The UI reveals the raw JSON.

> **TIP**: Switching modes is disabled if there are any unsaved changes.
