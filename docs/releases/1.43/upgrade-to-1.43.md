# Instructions

## Versions

1. Helm chart versions:
   - dial: `6.2.0`
   - dial-core: `5.1.1`
   - dial-extension: `1.3.3`
   - dial-admin: `0.13.0`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.39.0`
   - ai-dial-adapter-openai: `0.39.0`
   - ai-dial-adapter-vertexai: `0.35.0`
   - ai-dial-adapter-dial: `0.14.0`
   - ai-dial-chat-themes: `0.15.0`
   - ai-dial-chat: `0.45.0`
   - ai-dial-core: `0.43.0`
   - ai-dial-analytics-realtime: `0.23.0`
   - ai-dial-rag: `0.42.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.7.0`
   - ai-dial-mind-map-backend: `0.13.4`
   - ai-dial-mind-map-frontend: `0.10.0`
   - ai-dial-admin-backend: `0.16.0`
   - ai-dial-admin-frontend: `0.16.0`
   - ai-dial-admin-deployment-manager-backend: `0.16.0`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

- Please note that DIAL Core 0.42.x is not compatible with new DIAL Admin Panel 0.16.0. The reason: DIAL Admin Panel produces config with `responsesDefaults` field, which is unknown for DIAL Core 0.42.x and triggers config reload failures.

## Config changes


### ai-dial-adapter-openai

#### New environment variables

| Setting                         | Default | Required | Description |
|----------------------------------|---------|---------|-------------|
| QWEN3_ASR_VLLM_DEPLOYMENTS       | ``      | No| Comma-separated list of [Qwen3-ASR deployments](#qwen3-asr) served via vLLM. Example: `qwen3-asr` |

### ai-dial-chat

#### New environment variables

| Setting        |  Default | Required | Description |
|-------------|----------|-------------|-----------------|
| `ASR_MODEL` | - | No       | Specifies the model used for automatic speech recognition (ASR). When set together with the `voice-input` feature flag, it enables transcription mode: recorded audio is sent to this model for speech-to-text conversion, and the resulting text is automatically sent as a message. If not set, voice recording works only as a native audio attachment (the selected model must support audio MIME types). |
| `DIAL_CORE_EXTERNAL_URL` | - | No       | DIAL Core external URL (Not used for API calls). |

### ai-dial-quickapps-backend

#### New environment variables

| Variable                       | Default | Description                                                                                                                                                                                                |
|--------------------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `DEFAULT_TOOL_TIMEOUT_SECONDS` | `300.0` | Deployment-wide default timeout (seconds, `0 < x ≤ 3600`) applied to every tool call (DIAL deployment, REST API, MCP, Python interpreter). Bounded by app config `tool_defaults.timeout_seconds` when set. |

#### Deprecated environment variables

> [!CAUTION]
> Still works, but will be removed in future versions.

| Variable                        | Replacement                                                       | Description                                                                                                                  |
|---------------------------------|-------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| `PY_INTERPRETER_CLIENT_TIMEOUT` | `DEFAULT_TOOL_TIMEOUT_SECONDS` or `tool_defaults.timeout_seconds` | When set, still controls the PyInterpreter client timeout (default `60.0`); the unified tool-timeout settings are preferred. |

### ai-dial-admin-frontend: 

This release includes high-priority changes. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-frontend/blob/0.16.0/docs/upgrade-plans/0.16.0.md) before proceeding.

> To enable the required preview features, set the following environment variables:
>
> * `MCP_REGISTRY_ENABLED`
> * `DIAL_EVAL_API_URL`
>
> See the upgrade guide for details.

### ai-dial-admin-deployment-manager-backend: 

This release includes high-priority changes. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.16.0/docs/upgrade-plans/0.16.0.md) before proceeding.

### ai-dial-admin-backend: 

This release includes low-priority changes in observability.

#### New environment variables

| Setting                                        | Default              | Required | Description                                    |
| ---------------------------------------------- | -------------------- | -------- | ---------------------------------------------- |
| `METRICS_INFLUX_CONNECT_TIMEOUT`               | `10`                 | No       | InfluxDB connection timeout.                   |
| `METRICS_INFLUX_READ_TIMEOUT`                  | `60`                 | No       | InfluxDB read timeout.                         |
| `METRICS_INFLUX_WRITE_TIMEOUT`                 | `60`                 | No       | InfluxDB write timeout.                        |
| `METRICS_STORAGE_ROUTES_ANALYTICS_BUCKET`      | `analytics-realtime` | No       | Storage bucket for routes analytics metrics.   |
| `METRICS_STORAGE_ROUTES_ANALYTICS_MEASUREMENT` | `routes_analytics`   | No       | Measurement name for routes analytics metrics. |
| `METRICS_STORAGE_ROUTES_ANALYTICS_TABLE`       | `routes_analytics`   | No       | Table name for routes analytics metrics.       |


