# Applications

## About Applications

> Refer to [DIAL-Native Applications](/docs/platform/3.core/7.apps.md) to learn about applications in DIAL.

## Applications List

In Applications, you can see, create and manage applications deployed in your instance of DIAL.

![img.png](img/img_11.png)

##### Applications grid

> **TIP**: Use the **Columns** selector to customize which columns are visible in the grid.

| Field                     | Definition   |
|---------------------------|----------------|
| **Display Name**          | User-friendly name of the Application (e.g. "Data Clustering Application").                 |
| **Version**               | Version string or tag (e.g. v1, 2024-07-01) - bump this to publish updates without disrupting existing consumers.    |
| **Description**           | Brief free-text summary of the Application’s purpose (e.g. "Clusters incoming text into semantic groups").           |
| **Deployment ID**         | Unique identifier used in the DIAL [dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings) (e.g. dca, support-bot). This is the path segment of the Application’s HTTP endpoint.|
| **Endpoint**              | Full URL where the Application is exposed.     |
| **Topics**                | Tags or categories (e.g. "finance," "support," "image-capable") you can assign for discovery, filtering, or grouping in large deployments. Helps end users and admins find the right application by use case. |
| **Attachment types**      | Controls which file attachments this application can accept.        |
| **Max attachment number** | Maximum number of attachments allowed per single request.           |
| **Forward auth token**    | Whether Auth Token needs to be forwarded from the caller’s session into the upstream API call—enabling multi-tenant scenarios or pass-through authentication to downstream services. |


## Create Application

Use the **Create Application** dialog to register a new application in your DIAL instance. Once added, it appears in the **Applications** listing.

> It may take some time for the changes to take effect after saving.

> Refer to [Enable App](/docs/tutorials/1.developers/4.apps-development/3.enable-app.md) to learn more about enabling applications in DIAL.

![img_1.png](img/img_12.png)

##### To create application 

1. Click **Create** to invoke the **Create Application** modal.
2. Define application's parameters

    | Field                  | Required       | Definition & Guidance|
    |------------------------|-----------------|------------------------------------|
    | **Deployment ID**      | Yes         | A unique identifier under the applications section of DIAL Core’s [dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings) (e.g. support-bot, data-cluster).                    |
    | **Display Name**       | Yes         | User-friendly label (e.g. "Customer Support Bot") shown throughout the Admin UI.       |
    | **Version**            | No              | Optional version tag to track releases (e.g. `2024-07-18`, `v1`).     |
    | **Application Runner** | No              | Application type schema. Defined in [Application Runners](/docs/platform/11.admin-panel/builders-application-runners.md). |
    | **Description**        | No              | Free-text summary of what this Application does (e.g. supported inputs, business purpose).                       |
    | **Endpoint**           | Conditional | The full URL where this Application’s API will be exposed once created. Not needed if Application Runner is selected. Required otherwise.|

3. Once all required fields are filled click **Create**. The dialog closes and the new [application configuration](#application-configuration) screen is opened.

    > This entry will appear immediately in the listing once created.

## Application Configuration

##### Top Bar Controls

* **Delete**: Permanently removes this application. All clients calling its endpoint will receive errors until a replacement is published.
* **JSON Editor** (Toggle): Switch between the form-based UI and raw [JSON view](#json-editor) of the application’s configuration. Use JSON mode for copy-paste or advanced edits.

### Properties

In the Properties tab you can define its core identity, routing, UI metadata, and basic runtime controls. 

Once configured, your application is ready to orchestrate models and interceptors behind a single HTTP endpoint.

![img.png](img/img_13.png)

| Field             | Required | Description              |
|-------------------|-----------|---------------|
| **Deployment ID** | Yes       | Unique key under applications in DIAL Core’s [dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings) (e.g. data-clustering, support-bot).                 |
| **Display Name**  | Yes       | User-friendly label shown in the UI (e.g. "Data Clustering Application"). Helps to identify this application at a glance.                |
| **Version**       | No        | Version tag for rollout management (e.g. `v1.0`, `2024-07-15`). Bump this to publish a new iteration without breaking existing consumers. |
| **Description**   | No        | Free-text summary of the Application’s purpose (e.g. tooling, supported inputs/outputs, SLAs).                   |
| **Completion Endpoint** | Optional | URL where the app is exposed. Clients use this to integrate. Auto-populated if Application Runner is selected. Required if Application Runner is not selected.                     |
| **Application Runner**  | No          | Application type schema. Defined in [Application Runners](/docs/platform/11.admin-panel/builders-application-runners.md). |
| **Icon**          | No        | Choose a logo to visually distinguish apps in the UI.              |
| **Topics**        | No        | Tag this app with one or more topics or categories (e.g. "finance", "support").             |
| **Attachments**   | No        | Control which [attachment types](/docs/tutorials/1.developers/3.chat/0.chat-objects.md#attachments) (images, files) this app can process:  <br /> **None** – no attachments allowed.  <br /> **All** – unrestricted types. Optionally specify max number of attachments. <br /> **Custom** – enter specific MIME types. Optionally specify max number of attachments. |
| **Forward auth token** | No        | Select a downstream auth token to forward from the user’s session (for multi-tenant downstream). |
| **Max retry attempts** | No        | Number of times DIAL Core will [retry](/docs/platform/3.core/5.load-balancer.md#fallbacks) a failed run (due to timeouts or 5xx errors).               |
 
### Features

In the Features tab you can control optional capabilities at the application level. 

##### The difference between model and application features

While [Model feature flags](/docs/platform/11.admin-panel/entities-models.md#feature-flags-toggles) govern what each LLM integration can do, Application feature flags define which of those capabilities your orchestrated service exposes to clients—plus allow you to plug in custom preprocessing endpoints.

**Scope**

* **Model Features** apply *per LLM*, controlling what the model endpoint itself supports (e.g. whether GPT-4 can accept system prompts or function calls).
* **Application Features** apply *per orchestrated service*, governing what your composed workflow will accept and pass through—regardless of which models are called under the hood.

**Override Capability**

* At the **Application** level, you can disable a feature globally (even if models support it) or plug in custom endpoints that sit *above* all models.
* At the **Model** level, toggles only reflect the true capabilities of that specific LLM integration.

**Use Cases**

* **Model** toggles ensure you don’t accidentally send unsupported parameters to a given model.
* **Application** toggles let you present a consistent API to your clients (e.g. always accept `temperature` or never allow attachments), even if different underlying models behave differently.

![img_1.png](img/img_14.png)

#### Endpoints

Override or extend DIAL Core’s built-in protocol calls with your own HTTP services. These endpoints can be used by [Application Runners](/docs/platform/11.admin-panel/builders-application-runners.md) (e.g. a Python or Node Runner) to perform preprocessing or policy checks before delegating to your underlying models and workflows.

| Field                        | Description & When to Use        |
|------------------------------|------------------------------------------------|
| **Rate endpoint**            | URL to call a custom rate-estimation API. Use this to compute cost or quota usage based on your own logic (e.g. grouping by tenant, complex billing rules).             |
| **Tokenize endpoint**        | URL to call a custom tokenization service. When you need precise, app-wide token counting (for mixed-model or multi-step prompts) that the model adapter can’t provide. |
| **Truncate prompt endpoint** | URL to call your own prompt-truncation API. Handy if you implement advanced context-window management (e.g. dynamic summarization) before the actual model call.        |
| **Configuration endpoint**   | URL to fetch dynamic App-specific settings (e.g. per-tenant max tokens, allowed parameters). Use this to drive runtime overrides from a remote config store.            |

#### Feature Flags (Toggles)

Enable or disable per-request options that your Application accepts from clients and forwards to the underlying models. **Toggle On/Off** any feature as needed.

> **Note**: Changes take effect immediately after saving.

| Toggle                 | What It Does          |
|------------------------|----------------------------------------------------------|
| **Temperature**        | Enables the `temperature` parameter in API calls. Disable if you want fixed-deterministic outputs or you hard-code temperature in your workflow.            |
| **System prompt**      | Enables an initial "system" or "assistant instruction" message injection. Useful for orchestrating multi-step assistants where you need to enforce a global policy at the App level. |
| **Tools**              | Permits the use of `tools`/`functions` payloads in your API. Switch on if your Application invokes DIAL add-ons or external function calls (e.g. calendar lookup, database fetch).   |
| **Seed**               | Enables the `seed` parameter for reproducible results. Great for testing or deterministic pipelines; disable to ensure randomized creativity. f             |
| **URL Attachments**    | Accepts URL references (images, docs) as attachments in API requests. Must be enabled if your workflow downloads or processes remote assets via URL.        |
| **Folder Attachments** | Enables support for folder-level attachments (batching multiple files).                     |

### Roles

You can create and manage roles in the [Access Management](/docs/platform/11.admin-panel/access-management-roles.md) section.

In the **Roles** tab, you can define user groups that can use specific applications and define rate limits applicable to roles.

**Important**: if roles are not specified for a specific model, the model will be available to all users

> Refer to [Access & Cost Control](/docs/platform/3.core/2.access-control-intro.md) to learn more about roles and rate limits in DIAL.

![](img/img_15.png)

**Roles grid columns:**

| Column                | Description & Guidance        |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Name**              | Unique role identifier.       |
| **Description**       | User-friendly explanation of the role’s purpose (e.g., "Admin, Prompt Engineer, Developer"). |
| **Tokens per minute** | Minute tokens limit for specific role. Blank = no limits. Inherits default value (see above). Can be overridden.       |
| **Tokens per day**    | Daily tokens limit for specific role. Blank = no limits. Inherits default value (see above). Can be overridden.        |
| **Tokens per week**   | Weekly tokens limit for specific role. Blank = no limits. Inherits default value (see above). Can be overridden.       |
| **Tokens per month**  | Monthly tokens limit for specific role. Blank = no limits. Inherits default value (see above). Can be overridden.      |
| **Actions**     | Additional role-specific actions. <br /> Open role in a new tab. <br /> Make all restrictions unlimited for the given role |

#### Set Rate Limits

The grid on the Roles screen lists the roles that can access a specific application. Here, you can also set individual limits for selected roles. For example, you can the "Admin" role unlimited monthly tokens but throttle "Developer" to 100,000 tokens/day or allow the "External Partner" role a small trial quota (e.g., 10,000 tokens/month) before upgrade.

**To set or change rate limits for a role:**

1. **Click** in the desired cell (e.g., **Tokens per day** for the "ADMIN").
2. **Enter** a numeric limit or leave blank to set no limits.
3. Click **Reset to default limits** to restore default settings for all roles.
4. Click **Save** to apply changes.

#### Default Rate Limits

Default rate limits are set for all roles in the **Roles** grid by default, however you can override them for any role.

| Field| Description    |
|-------------------------------|---------------------------------------------------------------------------------------|
| **Default tokens per minute** | The maximum tokens any user may consume per minute if no role-specific limit applies. |
| **Default tokens per day**    | The maximum tokens any user may consume per day if no role-specific limit applies.    |
| **Default tokens per week**   | The maximum tokens any user may consume per week if no role-specific limit applies.   |
| **Default tokens per month**  | The maximum tokens any user may consume per month if no role-specific limit applies.  |

#### Role-Specific Access

Use **Make available to specific roles** toggle to define access to the application:

* **Off**: App is callable by any authenticated user. All existing roles are in the grid.
* **On**: App is restricted - only the roles you explicitly add to the grid below may invoke it.

#### Add

You can add a role only if **Make available to specific roles** toggle is **On**.

1. Click **+ Add** (top-right of the Roles Grid).
2. **Select** one or more roles in the modal.
3. **Confirm** to insert them into the table.

#### Remove

You can remove a role only if **Make available to specific roles** toggle is **On**.

1. Click the **actions** menu in the role's line.
2. Choose **Remove** in the menu.


### Interceptors

Use the **Interceptors** tab to attach reusable "hooks" that run custom logic before requests enter or after responses leave your Application’s orchestration pipeline.

Interceptors are lightweight plugins—defined under [Builders → Interceptors](/docs/platform/11.admin-panel/builders-interceptors.md) that hook into DIAL Core’s processing pipeline. 

Common use cases include use of interceptors to enforce PII policies, enrich or sanitize payloads, log data, or implement cross-cutting concerns without touching your core business code.

> Refer to [Interceptors](/docs/platform/3.core/6.interceptors.md) to learn more.

##### The difference between model and application interceptors

**Scope of Invocation**

* **Model** Interceptors fire around each individual model call (i.e. before/after the LLM invocation).
* **Application** Interceptors wrap the entire orchestrated workflow—including multi-model sequences, add-ons, and branching logic.

***Use Cases**

* **Model-level** hooks are ideal for prompt "pre-processing" or response transformations specific to a single LLM.
* **Application-level** hooks manage cross-cutting concerns across your whole Application (e.g., tenant-based routing, unified logging, end-to-end policy enforcement).

![img_3.png](img/img_16.png)

##### Interceptors Grid

| Column            | Description         |
| ----------------- |--------------------------------------------------------------------------------------------------------------|
| **Order**         | Execution sequence. Interceptors run in ascending order (1 → 2 → 3...). A request will flow through each interceptor’s in this order; for Response interceptors are invoked in reverse order.              |
| **Name**          | The interceptor’s alias, matching the **Name** field in its definition.             |
| **Description**   | Free-text summary from the interceptor’s definition, explaining its purpose.        |
| **Actions**  | Additional role-specific actions. <br /> Open interceptor in a new tab. <br /> Remove interceptor from the model |

#### Add

1. Click **+ Add** (in the upper-right of the interceptors grid).
2. In the **Add Interceptors** modal, choose one or more from the grid of [defined interceptors](/docs/platform/11.admin-panel/builders-interceptors.md).
3. **Apply** to append them to the bottom of the list (are added in the same order as selected in the modal).

> **TIP**: If you need a new interceptor, first create it under [Builders → Interceptors](/docs/platform/11.admin-panel/builders-interceptors.md) and then revisit this tab to attach it to the apps's configuration.

#### Reorder

1. **Drag & Drop** the handle (⋮⋮⋮⋮) on the left of the row to reassign its **Order**.
2. Release to reposition; order renumbers automatically.
3. **Save** to lock in the new execution sequence.

#### Remove

1. Click the **actions** menu in the interceptor's row.
2. Choose **Remove** in the menu to detach it from this app.
3. **Save** to lock in the interceptors list.


### Dashboard

In **Dashboard**, you can see real-time and historical metrics for the application. You can use it to monitor usage patterns, enforce SLAs, optimize costs, and troubleshoot anomalies.

![img_4.png](img/img_17.png)

##### Top Bar Controls


| Control                | What It Does          |
| ---------------------- |----------------------------------------------------------------------------------------------|
| **Time Period**        | Choose the date range for all charts and tables (e.g. last 15 min, 2 days, 7 days, 30 days). |
| **+ Add filter**       | Drill into specific subsets by adding filters on Projects.          |
| **Auto refresh**       | Set the dashboard to poll for new data (e.g. every 1 min) or turn off auto-refresh.          |

##### System Usage Chart

A time-series line chart of request throughput over time. You can use it to monitor traffic peaks and valleys, correlate spikes with deployments or feature roll outs.

##### Key Metrics

Four high-level metrics are displayed alongside the chart. All calculated for the user-selected period.

You can use them to:

* Chargeback to internal teams or external customers by "Money".
* Track adoption via "Unique Users".
* Monitor burst traffic with "Request Count".
* Watch token consumption to anticipate quota exhaustion.

| Metric            | Definition          |
|-------------------|-------------------------------------------------------------------|
| **Unique Users**  | Count of distinct user IDs or API keys that have called this app. |
| **Request Count** | Total number of chat or embedding calls routed to this app.       |
| **Total Tokens**  | Sum of prompt + completion tokens consumed by this app.           |
| **Money**         | Estimated spending on this app.          |


##### Projects Consumption Table

This table shows the KPIs breakdown by **Project**. You can use it to compare consumption across multiple projects.

| Column                | Description |
|-----------------------|-----------------------------------------------------------|
| **Project**           | The entity utilizing this app.   |
| **Request Count**     | Number of calls directed to the app.                      |
| **Prompt tokens**     | Total tokens submitted in the prompt portion of requests. |
| **Completion tokens** | Total tokens returned by the app as responses.            |
| **Money**             | Estimated cost.                  |


### JSON Editor

For advanced scenarios of bulk updates, copy/paste between environments, or tweaking settings not exposed in the form UI—you can switch to the **JSON Editor** in any app’s configuration page.

![img_5.png](img/img_18.png)

##### Switching to the JSON Editor

1. Navigate to **Entities → Applications**, then select the app you want to edit.
2. Click the **JSON Editor** toggle (top-right). The UI reveals the raw JSON.

> **TIP**: You can switch between UI and JSON only if there are no unsaved changes.

