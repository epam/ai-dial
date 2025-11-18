# Applications

## About Applications

DIAL-native applications adhere to the [unified protocol](/docs/platform/3.core/0.about-core.md#unified-api) of DIAL, a single protocol for all applications and models deployed in a specific DIAL instance.

> Refer to [DIAL Core](/docs/platform/3.core/7.apps.md) to learn more about applications in DIAL.

## Applications Main Screen

Applications, when added via DIAL Core configuration files or published by users are placed in the Public folder. The main screen displays all the applications available in Public folder in DIAL.

> Refer to [Access Control](/docs/platform/3.core/2.access-control-intro.md) to lean more about Private and Public logical spaces for objects storage in DIAL.

![ ](img/121.png)

### Folders Structure

Objects in the [Public space](/docs/platform/3.core/2.access-control-intro.md) are arranged hierarchically, similar to a file system. In this part of the screen, you can see the hierarchical structure of folders in the Public space.

| Element         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Root folder** | A root folder. Contains the sub-folders and applications. It is visible to all users. Applications when added via the DIAL Core configuration file, are automatically placed in the root folder.                                                                                                                                                                                                                                                                                                                |
| **Sub-folders** | Applications can be placed in a specific sub-folder for logical organization purposes.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Actions**     | Hover over any folder to view a context menu icon with actions you can perform in relation to the selected folder.<br /> - **Rename**: Use to rename the selected folder.<br />- **Move to**: Use to select a target location in the hierarchy to move the selected folder.<br />- **Manage permissions**: Redirects to [Folder Storage](/docs/tutorials/3.admin/access-management-folders-storage.md) to manage access to the folder.<br />- **Delete**: Use to delete the folder with applications inside it. |

![ ](img/122.png)

### Applications Grid

Click on any folder to display applications in the applications grid.

| Column           | Definition                                                                                                                                                                                                                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Display Name** | Along with the version, it makes up the application’s unique key.                                                                                                                                                                                                                                                           |
| **Version**      | Version of the application.                                                                                                                                                                                                                                                                                                 |
| **Author**       | The username or system ID associated with the user who created or last updated this application.                                                                                                                                                                                                                            |
| **Updated time** | The timestamp of the last modification of the application. Use to track changes.                                                                                                                                                                                                                                            |
| **Actions**      | Actions you can perform on the selected application: <br /> - **Open in new tab**: Opens a new tab with application's properties, features and parameters. <br /> - **Move to another folder**: Use to select the target folder in the hierarchy to move the application.<br />- **Delete**: Use to delete the application. |

## Configuration Screen

Click any application to open a screen with information about the selected application and its configuration details.

### Properties

In the Properties tab, you can see all and define selected application's basic properties.

![](img/123.png)

| Field              | Definition & Use Case                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Display Name**   | The name of the application assigned by the author. It is read-only but includes a copy-to-clipboard button for easy reference.                                                      |
| **Runner**         | [Application Runner](/docs/tutorials/3.admin/builders-application-runners.md) the application is based upon. NULL if the application was not created based on a runner.              |
| **Author**         | The username or system ID associated with the user who created or last updated this application.                                                                                     |
| **Creation Time**  | The timestamp of when the application was created.                                                                                                                                   |
| **Updated Time**   | Date and time when the app's configuration was last updated.                                                                                                                         |
| **Version**        | Version of the application. Can be selected from the dropdown to display information for different versions.                                                                         |
| **Description**    | A free-text summary describing the application (e.g. tooling, supported inputs/outputs, SLAs).                                                                                       |
| **Icon**           | A logo to visually distinguish the app on the UI. Maximum size: 512 MB. Supported types: .jpeg, .jpg, .jpe, .png, .gif, .apng, .webp, .avif, .svg, .svgz, .bmp, .ico. Up to 1 files. |
| **Topics**         | Tags that you can assign to apps (e.g. "finance", "support"). Helps to assign categories for better navigation on UI.                                                                |
| **Storage Folder** | The path to the application's location in the hierarchy of folders. It allows you to move the application between folders.                                                           |

### Features

In the Features tab, you can control optional capabilities of the selected application.

![](img/124.png)

#### Endpoints

Use these fields to apply optional service endpoints that extend the app’s runtime behavior.
By providing URLs for rating, tokenization, prompt truncation, and dynamic configuration, the application can delegate cost/quota calculations, precise token counting, context-window management, and JSON-schema–driven settings to external services.
Endpoints specified here override endpoints in [Application Runner](/docs/tutorials/3.admin/builders-application-runners.md#properties).

| Field                        | Description                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rate endpoint**            | A URL to call a custom rate-estimation API. Use this to compute cost or quota usage based on your own logic (e.g. grouping by tenant, complex billing rules).                                                                                                                                                                                  |
| **Tokenize endpoint**        | A URL to call a custom tokenization service. When you need precise, app-wide token counting (for mixed-model or multi-step prompts) that the model adapter can’t provide.                                                                                                                                                                      |
| **Truncate prompt endpoint** | A URL to call your own prompt-truncation API. Handy if you implement advanced context-window management (e.g. dynamic summarization) before the actual app call.                                                                                                                                                                               |
| **Configuration endpoint**   | A URL to fetch JSON Schema describing settings of the DIAL application. DIAL Core exposes this endpoint to DIAL clients as `GET v1/deployments/<deployment name>/configuration`. DIAL client must provide a JSON value corresponding to the configuration JSON Schema in a chat completion request in the `custom_fields.configuration` field. |

#### Feature Flags (Toggles)

Enable or disable per-request options that your application accepts from clients and forwards to the underlying models. **Toggle On/Off** any feature as needed.

| Toggle                        | What It Does                                                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **System prompt**             | Enables an initial "system" message injection. Useful for orchestrating multi-step agents where you need to enforce a global policy at the application level. |
| **Tools**                     | Enables `tools`/`functions` payloads in API calls. Switch on if your application makes external function calls (e.g. calendar lookup, database fetch).        |
| **Seed**                      | Enables the `seed` parameter for reproducible results. Great for testing or deterministic pipelines. Disable to ensure randomized creativity.                 |
| **URL Attachments**           | Enables URL references (images, docs) as attachments in API requests. Must be enabled if your workflow downloads or processes remote assets via URLs.         |
| **Folder Attachments**        | Enables attachments of folders (batching multiple files).                                                                                                     |
| **Accessible by request key** | Indicates whether the deployment is accessible using a [per-request API key](/docs/platform/3.core/3.per-request-keys.md).                                    |
| **Content parts**             | Indicates whether the deployment supports requests with content parts or not.                                                                                 |
| **Consent required**          | Indicates whether the application requires [user consent](https://dialx.ai/dial_api#tag/User-Consent) before use.                                             |

### JSON Editor

For advanced scenarios of bulk updates, copy/paste between environments, or tweaking settings not exposed in the form UI—you can switch to the **JSON Editor**.

![](img/json-editor-apps.png)

##### Switching to the JSON Editor

1. Navigate to **Assets → Applications**, then select the application you want to edit.
2. Click the **JSON Editor** toggle (top-right). The UI reveals the raw JSON.

> **TIP**: You can switch between UI and JSON only if there are no unsaved changes.

## Delete

Click **Delete** in the toolbar on the Configuration screen to permanently remove the selected application from your DIAL instance.

You can also delete an application using the Delete option in the application context menu or by deleting the related folder.
