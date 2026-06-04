---
title: "Manage AI model deployments"
type: how-to
persona: admin
component: admin
last_verified: 2026-06-04
owner: "@dial-docs-team"
---

# Manage AI model deployments

This page explains how administrators use DIAL Admin to add and configure AI model deployments. It covers creating a model, setting source types, configuring roles and rate limits, attaching interceptors, and using the JSON editor. You need access to DIAL Admin with administrator permissions.

DIAL allows you to access and use AI models from all major LLM providers, the open-source community, alternative vendors, and fine-tuned micro models, as well as self-hosted models or models listed on Hugging Face, NVIDIA NIM, or DeepSeek.

DIAL provides a single [Unified API](https://dialx.ai/dial_api), based on the OpenAI API, for accessing all AI models, embedding models, and applications. The key design principle is to create a unification layer that makes models and applications interchangeable, delivering a cohesive conversational experience and future-proof development of custom GenAI applications.

DIAL uses [AI model adapters](../3.builders.md), that unify the APIs of respective AI models to align with the Unified Protocol of DIAL Core. If a model is compatible with the DIAL Unified Protocol, it can be used directly without an adapter.

You can add AI models to DIAL via direct configuration of [DIAL Core](https://github.com/epam/ai-dial-core/blob/development/docs/dynamic-settings/models.md) or using DIAL Admin. This page describes how to add and manage AI models using DIAL Admin.

**Note**
> Refer to [Supported Models](/docs/platform/2.supported-models.md) to learn more about the supported AI models.

## Main screen

On this page, you can find all AI model deployments available on your DIAL instance. Here you can view, filter, and add new model definitions.

When a model deployment is successfully added, it can be accessed across the DIAL ecosystem including [DIAL Chat](https://dialx.ai/features/dial-chat), [DIAL Marketplace](https://dialx.ai/features/dial-marketplace), and via the [API](https://dialx.ai/dial_api#operation/sendChatCompletionRequest) for authorized [user roles](../access-management/roles.md).

**Tip**
> You can use the DIAL Core API to [access](https://dialx.ai/dial_api#tag/Deployment-listing/operation/getModels) available model deployments and to [send chat completion](https://dialx.ai/dial_api#operation/sendChatCompletionRequest) requests.

![Models main screen](../img/entities_models.png)

### Models grid

**Tip**
> Click **Columns** to open the column selector to define which columns to display and in which order.

The grid displays the main properties of models:

| Field | Description |
|-------|------------|
| **Display Name** | Model name (e.g. "GPT-4 Turbo"). Display name is shown in all DIAL client UI components for quick model identification. |
| **Version** | Version of a specific model deployment (e.g. `0613`, `v1`). Used to distinguish between "latest", "beta", or date-stamped builds. |
| **Description** | Description of the model's purpose including any relevant details. The description is displayed in DIAL Chat UI and Marketplace. |
| **ID** | Unique key under the `models` section of [DIAL Core's config](https://github.com/epam/ai-dial-core/blob/development/docs/dynamic-settings/models.md). Must match the upstream service's model or deployment name (e.g. `gpt-4-0613`). |
| **Source Type** | Source type of a model:<br />**Adapter**: Model is based on a [model adapter](../3.builders.md).<br />**External Endpoint**: Model is deployed outside DIAL infrastructure and exposes an endpoint DIAL Core uses for communication.<br />**Model Serving**: Model is based on a deployed [model serving container](../deployments/container-management.md). |
| **Source** | Adapter, Model Serving, or External endpoint depending on the selected source type. |
| **Author** | Email address of the user who created the model deployment. |
| **Topics** | Semantic tags associated with the model deployment. |
| **Attachment types** | Types of attachments this model can accept according to [MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types). |
| **Max attachment number** | Maximum number of attachments allowed in a single request. Blank for an unlimited number. |
| **Interaction limit** | The maximum number of tokens that can be transmitted in a completion request and response combined. This parameter ensures that the model does not exceed a specified token limit during interactions. |
| **Prompt price** | Cost per unit (according to **Cost unit**, typically "token" or "request") applied to the input portion of each call. Used by the [monitoring dashboards](../audit/monitoring-dashboards.md) to estimate spending in real time. |
| **Completion price** | Cost per unit charged for the output portion of each call. Combined with the prompt price, it determines per-model cost calculations. |
| **Creation Time** | Entity creation timestamp. |
| **Updated Time** | Timestamp of the latest update of the entity. |

## Create model

Follow these steps to add a new AI model to your DIAL instance:

1. Click **+ Create** to invoke a **Create Model** modal.
2. Define parameters for a new model:

    | Field | Required | Description |
    |-------|----------|-------------|
    | **ID** | Yes | Unique identifier used by the model adapter to invoke the model's backend. |
    | **Display Name** | Yes | Model name shown across the UI (e.g. "GPT-4 Turbo"). |
    | **Display version** | No | Optional tag to track releases when you register multiple variants of the same model (e.g. `2024-07-18`, `v1`). |
    | **Description** | No | Free-text note about the model's purpose or distinguishing traits. |
    | **Source type** | Yes | **Adapter**: Select the corresponding AI model adapter from the list of [available adapters](../3.builders.md). DIAL Core will use the adapter's endpoint URL to communicate with the model.<br />**Model Serving**: Select one of the available [model serving containers](../deployments/container-management.md) deployed in DIAL. DIAL Core will use the Model Serving container URL to communicate with the model.<br />**External Endpoint**: For externally-hosted models, provide the chat completion and/or responses endpoint URLs DIAL Core will use to communicate with the model directly (without model adapters). The model API must be compatible with the DIAL Core API. |

3. Click **Create** to close the dialog and open the [configuration screen](#configuration). When done with model configuration, click **Save**. It may take some time for the changes to take effect after saving. Once added, the model appears in the **Models** listing and becomes available to use across the DIAL ecosystem.

    ![Create model modal](../img/img_4.png)

## Configuration

You can access the model deployment configuration screen by clicking any model deployment on the main screen, or when adding a new model deployment. In this section, you can view and configure all settings for the selected model deployment.

- [Properties](#properties): Main definitions and runtime settings.
- [Features](#features): Optional capabilities and custom endpoints.
- [Roles](#roles): User groups that can invoke this model and their rate limits.
- [Interceptors](#interceptors): Custom logic to modify requests or responses.
- [Audit](#audit): Aggregated audit metrics and detailed logs of individual configuration changes.

### Properties

In the **Properties** tab, you can view and edit main definitions and runtime settings for a model deployment.

- [Basic information](#basic-information): Identification and basic information about the model and its author.
- [Source type](#source-type): Parameters associated with the way the model was created: Adapter, Model Container, or External Endpoint.
- [Personalization](#personalization): Parameters to customize the model's appearance on UI.
- [Attachments](#attachments): Define attachment types and maximum number of attachments the model can accept.
- [Default parameters](#default-parameters): Set default values for model parameters used in chat/completions and responses requests.
- [Upstream configuration](#upstream-configuration): Define upstream endpoints, authentication keys, weights, and extra data.
- [Advanced options](#advanced-options): Tokenizer model, forward auth token, interaction limits, retry attempts.
- [Cost configuration](#cost-configuration): Set cost unit, prompt price, and completion price for real-time billing.

#### Basic information

| Field | Required | Editable | Description |
|-------|----------|----------|-------------|
| **ID** | - | No | Unique key DIAL Core uses in the `models` section. Must match the upstream's deployment or model name (e.g. `gpt-4o`, `gpt-4-turbo`). Non-editable after the model is created. |
| **Updated Time** | - | No | Timestamp of the last update. |
| **Creation Time** | - | No | Model deployment creation timestamp. |
| **Sync with core** | - | No | Indicates the state of the entity's configuration synchronization between Admin and DIAL Core.<br />Synchronization occurs automatically every 2 mins (configurable via `CONFIG_AUTO_RELOAD_SCHEDULE_DELAY_MILLISECONDS`).<br />**Important**: Sync state is not available for sensitive information (API keys/tokens/auth settings).<br />**Synced**: Entity's states are identical in Admin and in Core for valid entities, or entity is missing in Core for invalid entities.<br />**In progress...**: Synced conditions are not met and changes were applied within last 2 mins (this period is configurable via `CONFIG_EXPORT_SYNC_DURATION_THRESHOLD_MS`).<br />**Out of sync**: Synced conditions are not met and changes were applied more than 2 mins ago (this period is configurable via `CONFIG_EXPORT_SYNC_DURATION_THRESHOLD_MS`).<br />**Unavailable**: Displayed when it is not possible to determine the entity's state in Core. This occurs if the config was not received from Core for any reason, or the configuration of entities in Core is not entirely compatible with the one in the Admin service. |
| **Display Name** | Yes | Yes | Model name shown in tables and dropdowns in DIAL clients (e.g. "GPT-4o"). Helps users identify and select models on UI. |
| **Display version** | No | Yes | Version tag for tracking releases (e.g. `0613`, `v1`). Useful for A/B testing or canary rollouts. |
| **Description** | No | Yes | Text describing the model's features, details, or other relevant information. |
| **Maintainer** | No | Yes | Name of the responsible person or team overseeing the model's configuration. |
| **Source type** | Yes | Yes | Source type indicates the way a model was created: [Adapter](#adapter), [Model Serving](#model-serving), [External Endpoint](#external-endpoint). |

![Model properties tab](../img/entities_models_properties.png)

#### Source type

The source type defines how the model is integrated into DIAL. Depending on the selected source type, different parameters need to be specified.

##### Adapter

Unless an AI model API is compatible with the DIAL Unified Protocol, you need adapters to use AI models in DIAL. Model adapters unify the APIs of respective AI models to align with the Unified Protocol of DIAL Core. If the source type of your model is Adapter, DIAL Core will use the adapter's endpoint to communicate with the model.

DIAL includes adapters for [Azure OpenAI](https://github.com/epam/ai-dial-adapter-openai) models, [GCP Vertex AI](https://github.com/epam/ai-dial-adapter-vertexai/?tab=readme-ov-file#supported-models) models, and [AWS Bedrock](https://github.com/epam/ai-dial-adapter-bedrock) models. You can also create custom adapters for other AI models with [DIAL SDK](https://github.com/epam/ai-dial-sdk).

Adapters can be added in [Builders](../3.builders.md).

The following properties need to be specified if the selected source type is Adapter:

| Field | Required | Description |
|-------|----------|-------------|
| **Adapter** | Yes | [Model adapter](../3.builders.md) that will be used to handle requests to this model deployment (e.g. **OpenAI**, **DIAL**). Adapter defines how to authenticate, format payloads, and parse responses. |
| **Type** | Yes | Select **Chat** or **Embedding** API.<br />**Chat**: Conversational chat completions.<br />**Embedding**: Vector generation (semantic search, clustering). |
| **Completion endpoint** | Yes | Endpoint URL that will be invoked to process chat completion requests. The base URL is determined by the selected adapter, while the path can be partially customized. |
| **Responses endpoint** | Yes | Endpoint of the model adapter that supports the OpenAI Responses API. The URL is read-only and is determined by the selected AI model adapter. Currently only [OpenAI adapters](https://github.com/epam/ai-dial-adapter-openai/blob/development/README.md) support this. When set, DIAL Core routes `POST /openai/v1/responses` requests to this endpoint. Only basic Responses API behavior is supported: background requests, `previous_request_id`, conversations, prompts, and files are not supported. |

![Adapter source type configuration](../img/source_type_adapter.png)

##### Model Serving

AI models can be deployed in DIAL using [Model Servings](../deployments/container-management.md). If the source type of the model deployment is Model Serving, DIAL Core will use its URL to communicate with the model deployment.

The following properties need to be specified if the selected source type is Model Serving:

| Field | Required | Description |
|-------|----------|-------------|
| **Container** | Yes | ID of one of the running [Model Serving](../deployments/container-management.md) containers. Click to select among the available containers. |
| **Type** | Yes | Select **Chat** or **Embedding** type of model.<br />**Chat**: Conversational chat completions.<br />**Embedding**: Vector generation (semantic search, clustering).<br />**Note**: This setting is available if the Model Serving container is set and running. |
| **Completion endpoint** | Yes | Endpoint URL that will be invoked to process chat completion requests. The base URL is determined by the selected Model Serving container, while the path can be partially customized: it starts with the URL of the Model Serving container and ends with `/chat/completion`. The middle part `openai/v1` can be manually edited. |
| **Responses endpoint** | Yes | Endpoint URL of the Model Serving container that supports the OpenAI Responses API. When set, DIAL Core routes `POST /openai/v1/responses` requests to this endpoint. Only basic Responses API behavior is supported: background requests, `previous_request_id`, conversations, prompts, and files are not supported. The base URL is determined by the selected Model Serving container, while the path can be partially customized: it starts with the URL of the Model Serving container and ends with `/responses`. The middle part can be manually edited. |

![Model Serving source type configuration](../img/source_type_container.png)

##### External Endpoint

DIAL allows using AI models deployed outside DIAL infrastructure that are compatible with the DIAL Core API. The External Endpoint source type is used for such AI models.

The following properties need to be specified if the selected source type is External Endpoint:

| Field | Required | Description |
|-------|----------|-------------|
| **Type** | Yes | Select **Chat** or **Embedding** API.<br />**Chat**: Conversational chat completions.<br />**Embedding**: Vector generation (semantic search, clustering). |
| **Completion endpoint** | Yes | Endpoint URL that will be invoked to process chat completion requests. |
| **Responses endpoint** | Yes | Endpoint URL that supports the OpenAI Responses API. When set, DIAL Core routes `POST /openai/v1/responses` requests to this endpoint. Only basic Responses API behavior is supported: background requests, `previous_request_id`, conversations, prompts, and files are not supported. |

![External Endpoint source type configuration](../img/source_type_endpoint.png)

#### Personalization

These parameters help customize how the model is presented in the DIAL UI.

| Field | Required | Description |
|-------|----------|-------------|
| **Override name** | Conditional | Custom display name for specific contexts.<br />**Note**: Override name is **required** for AI model deployments created based on Model Servings. When `Source Type = Model Serving`, Override name is pre-populated with the ID of the selected Model Serving container. If Source Type is changed from Model Serving to anything else, Override name must be populated manually for the model deployment to work properly. |
| **Icon** | No | Icon to visually distinguish model deployments in the UI. |
| **Topics** | No | Semantic tags associated with the model deployment. Click to display a list of available topics.<br />You can add your own custom topics to the list following these rules:<br />- The topic name must not exceed 255 characters.<br />- The topic name must not contain leading or trailing spaces. |

![Model personalization settings](../img/model_personalization.png)

#### Attachments

| Field | Required | Description |
|-------|----------|-------------|
| **Attachment types** | No | Defines the attachment types (images, files, etc.) this model can accept.<br />**No attachments**: Disables all attachment types.<br />**All attachments types**: Allows all types of file attachments. Optionally specify max number of attachments.<br />**Specific attachments types**: Enables the user to define/select specific [MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types). Start typing to see suggestions or use `<type>/<subtype>` format for a manual entry. |
| **Attachments max number** | No | Maximum number of input attachments. When **unset** (default), attachments are not allowed. |

![Model attachments settings](../img/models_attachments.png)

#### Default parameters

Default parameters can be used to pass additional parameters with the chat completion or responses requests.

| Field | Required | Description |
|-------|----------|-------------|
| **Completion Defaults** | No | Default parameters are applied if a request doesn't contain them in an OpenAI `chat/completions` API call. |
| **Responses Defaults** | No | Default parameters are applied if a request doesn't contain them in an OpenAI `openai/v1/responses` API call. Available if the OpenAI Responses API is supported. |

![Model default parameters](../img/model_defaults.png)

#### Upstream configuration

You can use upstream endpoints to provide alternative URLs DIAL Core will use to send chat completions and responses requests. This enables round-robin load balancing or fallback among multiple hosts. Refer to [Load Balancer](/docs/platform/3.core/5.load-balancer.md) to learn more. For example, you can provide a model's Docker container URI if the model's container is deployed in DIAL. Refer to [Model Servings](../deployments/container-management.md) to learn more about this use case.

| Field | Description |
|-------|-------------|
| **Chat completion endpoint** | The upstream backend URL for the chat completions API. Passed to the model adapter in the `X-UPSTREAM-ENDPOINT` header. The Responses API endpoint is recommended here for OpenAI models that support the Responses API. |
| **Responses endpoint** | The upstream backend URL for the Responses API. Passed to the model adapter in the `X-UPSTREAM-ENDPOINT` header when routing Responses API requests. |
| **Keys** | API key, token, or credential passed to the upstream. Stored securely and masked — click the eye icon to reveal. |
| **Weight** | Numeric [weight](/docs/platform/3.core/5.load-balancer.md#weights) for this endpoint in a multi-upstream scenario. Higher = more traffic share. |
| **Tier** | Specifies an endpoint group. In a regular scenario, all requests are routed to endpoints with the lowest tier, but in case of an outage or hitting the limits, the next one in the line helps to handle the load. |
| **Extra Data** | Free-form JSON or string metadata passed to the model adapter with each request. |

![Model upstream configuration](../img/model_upstreams.png)

#### Advanced options

| Field | Description |
|-------|-------------|
| **Tokenizer Model** | Identifies the specific model whose tokenization algorithm exactly matches that of the referenced model. This is typically the name of the earliest released model in a series of models sharing an identical tokenization algorithm. This parameter is essential for DIAL clients that reimplement tokenization algorithms on their side, instead of utilizing the tokenize endpoint provided by the model. |
| **Forward auth token** | Determines whether to forward an Auth Token to your model's endpoint. If enabled, the HTTP header with the authorization token is forwarded to the chat completion endpoint. |
| **Interaction limit** | Ensures that the model does not exceed a specified token limit during interactions.<br />**Available values**:<br />**None**: DIAL does not apply any additional interaction limits beyond limits that your model enforces natively. Ideal for early prototyping or when you trust the LLM's built-in safeguards.<br />**Total number of tokens**: Enforces a single, cumulative cap on the sum of all `prompt + completion` tokens across the entire chat.<br />**Separately Prompts & Completions**: Two independent limits: one on the sum of all input (prompt) tokens and another on the sum of all output (completion) tokens over the course of a conversation. |
| **Max retry attempts** | The number of times DIAL Core will retry a connection in case of upstream errors (e.g. on timeouts or 5xx responses). |
| **Hashing Order** | Specifies the order in which parts of a chat completion request — like the `tools` used and the chat `messages` — are combined to create a unique fingerprint (hash) for that request. By default, it checks `tools` first and then `messages`. This fingerprint helps the system recognize when different requests share the same beginning, so it can reuse previous work and speed things up through caching. Refer to [DIAL Core documentation](https://github.com/epam/ai-dial-core/blob/development/docs/dynamic-settings/models.md) for details. |

![Model advanced options](../img/model_advanced_params.png)

#### Cost configuration

Enables real-time cost estimation and quota enforcement. Powers the [monitoring dashboards](../audit/monitoring-dashboards.md) with per-model spending metrics.

| Field | Required | Description |
|-------|----------|-------------|
| **Cost unit** | Yes | Base unit for billing.<br />**Available values**:<br />**None**: Disables all cost tracking for this model.<br />**Tokens**: Every token sent or received by the model is counted towards your cost metrics.<br />**Char without whitespace**: Tells DIAL to count only non-whitespace characters (letters, numbers, punctuation) in each request as the billing unit. |
| **Prompt price** | Yes | Cost per unit for prompt tokens. |
| **Completion price** | Yes | Cost per unit for completion tokens (chat responses). |

![Model cost configuration](../img/model_cost.png)

### Features

In the **Features** tab, you can enable, disable, or override optional capabilities for a specific model. Use model features to tailor DIAL Core's [Unified Protocol](/docs/platform/3.core/0.about-core.md#unified-api) behavior — turning features on when your model supports them, or off when it doesn't.

Model features apply per AI model, controlling what the model endpoint itself supports (e.g. whether GPT-4 can accept system prompts or function calls).

**Tip**
> Enable only the features you need. Extra toggles can cause errors if the upstream doesn't support them. After setting a custom endpoint, test it via a simple API call to confirm accessibility and authentication.

![Model features tab](../img/entities_models_features.png)

#### Custom endpoints

Some model adapters expose specialized HTTP endpoints for tokenization, rate estimation, prompt truncation, or live configuration. You can override the default Unified Protocol calls by specifying them in this section.

| Field | Description |
|-------|-------------|
| **Rate endpoint** | URL to invoke the model's cost-estimation or billing API. Call an endpoint that returns token counts and credit usage. Override if your adapter supports a dedicated "rate" path. |
| **Tokenize endpoint** | URL to invoke a standalone tokenization service. Use when you need precise token counts before truncation or batching. Models without built-in tokenization require this. |
| **Truncate prompt endpoint** | URL to invoke a prompt-truncation API. Ensures prompts are safely cut to max context length. Useful when working with very long user inputs. |
| **Configuration endpoint** | URL to fetch JSON Schema describing settings of the DIAL model. DIAL Core exposes this endpoint to DIAL clients as `GET v1/deployments/<deployment name>/configuration`. DIAL client must provide a JSON value corresponding to the configuration JSON Schema in a chat completion request in the `custom_fields.configuration` field. |

#### Feature flags (toggles)

Model toggles ensure you don't accidentally send unsupported parameters to a given model.

Each toggle corresponds to a capability in the [Unified Protocol](/docs/platform/3.core/0.about-core.md#unified-api-features). Enable them only if your model and adapter fully support that feature.

| Toggle | Description |
|--------|-------------|
| **System prompt** | Allows injecting a system-level message (the "agent's instructions") at the start of every chat. Disable for models that ignore or block system prompts. |
| **Tools** | Enables the `tools` (a.k.a. functions) feature for safe external API calls. Enable if you plan to use DIAL tool sets or function calling. |
| **Temperature supported** | Enables the `temperature` parameter to control randomness in model deployment output. |
| **Seed** | Enables the `seed` parameter for deterministic output. If specified, the system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result. Determinism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend. |
| **URL Attachments** | Allows passing URLs as attachments (images, docs) to the model. Can be required for image-based or file-referencing prompts. |
| **Folder Attachments** | Enables attaching folders (batching multiple files). |
| **Assistant attachment in request** | Indicates whether the model deployment supports `attachments` in [chat completion request](https://dialx.ai/dial_api#operation/sendChatCompletionRequest) `messages` from `role=assistant`. When enabled, DIAL Chat must preserve `attachments` in `messages` from assistants, instead of removing them. This feature is especially useful for models that can generate attachments as well as take attachments as input. A typical example is an image-editing model. |
| **Accessible by request key** | Indicates whether the deployment is accessible using a [per-request API key](/docs/platform/3.core/3.per-request-keys.md). |
| **Content parts** | Indicates whether the model deployment supports requests with content parts. Content parts in a chat completion request allow sending a message consisting of different types of content, such as text, images, or other media, within a single request, which enables richer and more flexible interaction with a model. |
| **Cache** | Whether the deployment supports [LLM caching](/docs/tutorials/1.developers/6.prompt-caching.md). |
| **Auto caching** | Indicates whether the deployment supports [automatic caching](/docs/tutorials/1.developers/6.prompt-caching.md), where possible. |
| **Parallel tool calls** | Indicates whether the deployment supports `parallel_tool_calls` parameter in a [chat completion request](https://dialx.ai/dial_api#operation/sendChatCompletionRequest), which enables parallel `function` calling when using a `tool`. |
| **Support comment in rate response** | Indicates whether the model supports the field `comment` in the rate response payload. |

### Roles

**Note**
> You can create and manage roles in the [Access Management](../access-management/roles.md) section or via direct configuration of [DIAL Core](https://github.com/epam/ai-dial-core/blob/development/docs/dynamic-settings/roles.md).

In the **Roles** tab, you can define user groups that are authorized to use a specific model deployment and enforce role-based rate and usage limits. This is essential for multi-tenant governance, quota enforcement, and cost control across teams or customers.

**Important**: If roles are not specified for a specific model deployment, it is available to all users.

**Note**
> - Refer to [Access & Cost Control](/docs/platform/3.core/2.access-control-intro.md) to learn more about access control in DIAL.
> - Refer to [Roles](/docs/platform/0.architecture-and-concepts/6.access-control.md#roles) to learn more about roles in DIAL.
> - Refer to tutorials to learn how to use roles to define access and cost control for [JWT](/docs/tutorials/2.devops/2.auth-and-access-control/1.jwt.md) and [API keys](/docs/tutorials/2.devops/2.auth-and-access-control/0.api-keys.md).

![Model roles tab](../img/entities_models_roles.png)

#### Roles grid

| Column | Description |
|--------|-------------|
| **ID** | Unique role identifier. |
| **Display Name** | Unique role name displayed on UI. |
| **Description** | Description of the role's purpose (e.g., "DIAL Prompt Engineering Team"). |
| **Tokens per minute** | Per-minute token limit for a specific role. Blank = no limits. Inherits the [default value](#default-limits). Can be overridden. |
| **Tokens per day** | Daily token limit for a specific role. Blank = no limits. Inherits the [default value](#default-limits). Can be overridden. |
| **Tokens per week** | Weekly token limit for a specific role. Blank = no limits. Inherits the [default value](#default-limits). Can be overridden. |
| **Tokens per month** | Monthly token limit for a specific role. Blank = no limits. Inherits the [default value](#default-limits). Can be overridden. |
| **Actions** | Additional role-specific actions.<br />When **Make available to specific roles** toggle is off — opens the [Roles](../access-management/roles.md) section in a new tab.<br />When **Make available to specific roles** toggle is on, you can open the [Roles](../access-management/roles.md) section in a new tab, set **Set unlimited**, [Remove](#remove-a-role) the role from the list, or **Reset to default limits**. |

#### Set rate limits

The Roles grid lists the roles that can access a specific model. Here, you can also set individual limits for selected roles. For example, you can give the "Admin" role unlimited monthly tokens but throttle "Developer" to 100,000 tokens/day, or allow the "External Partner" role a small trial quota (e.g., 10,000 tokens/month) before upgrade.

##### To set or change rate limits for a role

1. Click in the desired cell (e.g., **Tokens per day** for the "ADMIN").
2. Enter a numeric limit or leave blank to enable unlimited access. Click **Reset to default limits** to restore [default settings](#default-limits) for all roles.
3. Click **Save** to apply changes.

![Model rate limits configuration](../img/model_roles.png)

#### Default limits

Default limits are set for all roles in the **Roles** grid by default; however, you can override them as needed.

| Field | Description |
|-------|-------------|
| **Default tokens per minute** | The maximum tokens any user can consume per minute unless a specific limit is in place. |
| **Default tokens per day** | The maximum tokens any user can consume per day unless a specific limit is in place. |
| **Default tokens per week** | The maximum tokens any user can consume per week unless a specific limit is in place. |
| **Default tokens per month** | The maximum tokens any user may consume per month unless a specific limit is in place. |

#### Role-specific access

Use the **Make available to specific roles** toggle to define access to the model:

- **Off**: Model is callable by any authenticated user. All existing user roles are in the grid.
- **On**: Model is restricted — only the roles you explicitly add to the grid can invoke it.

![Role-specific access toggle](../img/69.png)

#### Add a role

You can add a role only if the **Make available to specific roles** toggle is **On**.

1. Click **+ Add** (top-right of the Roles grid).
2. Select one or more roles in the modal. The list of roles is defined in the [Access Management](../access-management/roles.md) section.
3. Confirm to add role(s) to the table.

![Add role modal](../img/add_role.png)

#### Remove a role

You can remove a role only if the **Make available to specific roles** toggle is **On**.

1. Click the actions menu in the role's row.
2. Choose **Remove** in the menu.

![Remove role](../img/68.png)

### Interceptors

DIAL uses interceptors to add custom logic to inbound and outbound requests for models and applications, enabling PII obfuscation, guardrails, safety checks, and more.

**Note**
> Refer to [Interceptors](/docs/platform/3.core/6.interceptors.md) to learn more.

In the **Interceptors** tab, you can view configured [global interceptors](../1.config-backup-and-global-settings.md#system-properties) and define local interceptors that will be triggered for the selected model. You can define interceptors in the [Entities → Interceptors](./interceptors.md) section to add them to the processing pipeline of DIAL Core.

![Model interceptors tab](../img/entities_models_interceptors.png)

#### Interceptors grid

| Column | Description |
|--------|-------------|
| **ID** | Unique interceptor identifier. |
| **Order** | Execution sequence. Interceptors run in ascending order (1 → 2 → 3...). A request will flow through each interceptor in this order. Response interceptors are invoked in the reversed order. |
| **Display Name** | Alias of the interceptor, matching the **Name** field in its definition. |
| **Description** | Free-text summary from the interceptor's definition, explaining its purpose. |
| **Actions** | Additional actions: open interceptor in a new tab, or [Remove](#remove-interceptor) the selected interceptor from the model's configuration. |

#### Add an interceptor

Follow these steps to attach one or more interceptors to the model's configuration:

1. Click **+ Add** (in the upper-right of the interceptors grid).
2. In the **Add Interceptors** modal, choose one or more from the grid of [defined interceptors](./interceptors.md).
3. Click **Apply** to append them to the bottom of the list (added in the same order as selected in the modal).

**Tip**
> If you need a new interceptor, first create it under [Entities → Interceptors](./interceptors.md) and then revisit this tab to attach it to the model's configuration.

#### Reorder interceptors

1. Drag and drop the handle (⋮⋮⋮⋮) to reassign the order in which interceptors are triggered.
2. Release to reposition; order renumbers automatically.
3. Click **Save** to lock in the new execution sequence.

#### Remove an interceptor {#remove-interceptor}

1. Click the actions menu in the interceptor's row.
2. Choose **Remove** to detach it from this model.
3. Click **Save** to lock in the interceptors list.

### Audit

In the **Audit** tab, you can monitor key metrics, activities, and usage related to the selected AI model. This tab provides comprehensive insights into performance, user interactions, and operational changes. You can track real-time and historical data, identify usage patterns, and audit and roll back all modifications made to the selected AI model deployment for compliance and troubleshooting purposes.

**Note**
> This section mimics the functionality available in the global [Dashboard and Usage Logs](../audit/monitoring-dashboards.md) and [Activity](../audit/activity-and-rollback.md) sections, but is scoped specifically to the selected AI model.

![Model audit tab](../img/model-audit.png)

### JSON editor

Advanced users with technical expertise can work with the model properties in a JSON editor view mode. It is useful for advanced scenarios of bulk updates, copy/paste between environments, or tweaking settings not exposed on UI.

**Tip**
> You can switch between UI and JSON only if there are no unsaved changes.

In the JSON editor, you can use the view dropdown to select between Admin format and Core format. These formatting options are for your convenience only and do not render properties as they are defined in DIAL Core. After making changes, the **Sync with core** indicator on the main configuration screen will inform you about the synchronization state with DIAL Core.

![JSON editor for model properties](../img/entities_models_properties_json.png)

#### Working with the JSON editor

1. Navigate to **Entities → Models**, then select the model you want to edit.
2. Click the **JSON Editor** toggle (top-right). The UI reveals the raw JSON.
3. Choose between the Admin and Core format to see and work with properties in the necessary format. **Note**: Core format view mode does not render the actual configuration stored in DIAL Core but the configuration in the Admin service displayed in the DIAL Core format.
4. Make changes and click **Save** to apply them.
5. After making changes, the **Sync with core** indicator on the main configuration screen will inform you about the synchronization state with DIAL Core.

### Delete

Use the **Delete** button in the Configuration screen toolbar to permanently remove the selected language model.

![Delete model button](../img/125.png)

## Next steps

- [Manage applications](./applications.md) — configure application deployments that use models.
- [Manage interceptors](./interceptors.md) — create and attach interceptors for content filtering and compliance.
- [Manage roles and access control](../access-management/roles.md) — define who can access each model and at what rate limits.
