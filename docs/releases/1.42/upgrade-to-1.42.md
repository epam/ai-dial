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
   - ai-dial-rag: `0.40.2`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.6.0`
   - dial-mind-map-backend: `0.13.3`
   - dial-mind-map-frontend: `0.9.22`
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


### ai-dial-quickapps-backend:

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
