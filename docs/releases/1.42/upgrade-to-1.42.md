# Instructions

## Versions

1. Helm chart versions:
   - dial: `TBD`
   - dial-core: `TBD`
   - dial-extension: `TBD`
   - dial-admin: `TBD`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.38.0`
   - ai-dial-adapter-openai: `0.38.0`
   - ai-dial-adapter-vertexai: `0.34.0`
   - ai-dial-adapter-dial: `0.13.0`
   - ai-dial-auth-helper: `0.4.0`
   - ai-dial-chat-themes: `0.14.0`
   - ai-dial-chat: `0.44.0`
   - ai-dial-core: `0.42.0`
   - ai-dial-analytics-realtime: `0.22.0`
   - ai-dial-rag: `0.41.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.6.0`
   - ai-dial-mind-map-backend: `0.13.3`
   - ai-dial-mind-map-frontend: `0.9.22`
   - ai-dial-admin-backend: `0.15.0`
   - ai-dial-admin-frontend: `0.15.0`
   - ai-dial-admin-deployment-manager-backend: `0.15.0`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

## Config changes

### ai-dial-adapter-openai

New optional field - The [upstream `extra_data`](https://github.com/epam/ai-dial-core/blob/development/docs/dynamic-settings/models.md#modelsmodel_nameupstreams) field in the DIAL Core config allows specifying which incoming request headers the adapter should forward to the upstream. DIAL Core provides `extra_data` to the adapter inside the `X-UPSTREAM-EXTRA-DATA` request header. The adapter then attaches every header listed in `headers_to_proxy` that is present in the incoming request to the outgoing upstream call.

A practical use case is routing requests within a vLLM cluster: [DIAL Chat](https://github.com/epam/ai-dial-chat) generates an `x-conversation-id` header for every conversation, and a vLLM routing can use it as an affinity key to route all turns of the same conversation to the same worker.

#### New environment variables

|Variable|Default|Description|
|-|-|-|
|SSE_HEARTBEAT_INTERVAL||If set, the adapter inserts ping comments into streaming chat completion responses after the connection has been idle for the specified number of seconds, helping prevent read timeouts when the upstream is unresponsive.|
|VLLM_DEPLOYMENTS||Comma-separated list of deployments that use a vLLM OpenAI-compatible upstream. Example: vllm-llama3,vllm-qwen2|

### ai-dial-analytics-realtime

#### InfluxDB 3 Configuration

Set the following environment variables to connect to the InfluxDB instance:

| Variable       | Description |
|----------------|-------------|
| `INFLUX_URL`       | URL of the InfluxDB instance to write analytics data |
| `INFLUX_DATABASE`  | Name of the InfluxDB 3 database to write analytics data |
| `INFLUX_API_TOKEN` | InfluxDB API token with write access to the target database |

Refer to the [InfluxDB 3 documentation](https://docs.influxdata.com/influxdb3/core/get-started/) for instructions to set up InfluxDB locally and obtain the required configuration parameters.

> **Important:**  
> The `INFLUX_DATABASE` variable was introduced in version 0.22.0.  
> For earlier versions, set `INFLUX_BUCKET` to the target database name and `INFLUX_ORG` to any non-empty value (e.g., `"ignored"`) to enable InfluxDB 3 support.
-----
> [!IMPORTANT]
> Aggregated Dashboards are only supported for InfluxDB 2.

### ai-dial-rag

#### New environment variables

| Variable                  | Optional | Description                                                                            |
|---------------------------|---------|----------------------------------------------------------------------------------------|
| `DIAL_RAG__HEADERS_TO_PROXY` | `yes` | List of headers to proxy from the request to the dial core. |


### ai-dial-quickapps-backend:

#### QuickApps Schema Configuration

> [!IMPORTANT]
> Since version [0.42.0](https://github.com/epam/ai-dial-core/releases/tag/0.42.0) DIAL Core supports [app schema endpoint feature](https://github.com/epam/ai-dial-core/pull/1352).
> 
> Required components versions:
> * `ai-dial-core:0.42.0`
> * (if used) `ai-dial-admin-backend:0.15.0`
> * (if used) `ai-dial-admin-frontend:0.15.0`
>
> In setups with such versions QuickApps **must be configured to use schema endpoint** instead of putting whole schema to DIAL Core.
> In that way new schemas will be delivered along with the new Docker images of QuickApps, making process smooth and simple.
> Migration steps:
> * In DIAL Core config json or in DIAL Admin remove the following properties in configuration schema:
>     * `$defs`
>     * `type`
>     * `title`
>     * `propertires`
>     * `required`
> * Add new property, replacing `{quickapps_base_url}` with actual service's base URL:
>     * `dial:applicationTypeSchemaEndpoint": "{quickapps_base_url}/v1/configuration-support/application-schema"
> 
> Full schema configuration reference can be found [here](https://github.com/epam/ai-dial-quickapps-backend/blob/0.6.0/docs/application-schema.md#quickapps-application-schema)

#### New environment variables

| Variable                  | Default | Description                                                                            |
|---------------------------|---------|----------------------------------------------------------------------------------------|
| `ENABLE_PREVIEW_FEATURES` | `false` | Enable preview features across the deployment (schema visibility + runtime activation) |


#### Removed environment variables

| Variable                                   | Reason                                                    |
|--------------------------------------------|-----------------------------------------------------------|
| `PLOTLY_IMAGE_CONVERSION_LOG_LEVEL`        | Kaleido/Chromium dependency removed from Docker image     |
| `PY_INTERPRETER_ADDITIONAL_HANDLING_MODEL` | Title generation logic replaced with tool  [Changes](https://github.com/epam/ai-dial-quickapps-backend/pull/176)|


### ai-dial-admin-backend
#### Upgrade Notice

This release includes **many critical and high-priority changes**. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-backend/blob/0.15.0/docs/upgrade-plans/0.15.0.md) and the [infrastructure changelog](https://github.com/epam/ai-dial-admin-backend/blob/release-0.15/docs/INFRA-CHANGELOG.md) before proceeding.

### ai-dial-admin-deployment-manager-backend: 
#### Upgrade Notice

This release includes **many critical and high-priority changes**. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.15.0/docs/upgrade-plans/0.15.0.md) before proceeding.
