# Instructions

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.39.0-rc.0`
   - ai-dial-adapter-openai: `0.39.0-rc.0`
   - ai-dial-adapter-vertexai: `0.35.0-rc.0`
   - ai-dial-adapter-dial: `0.14.0-rc.0`
   - ai-dial-chat-themes: `0.14.0`
   - ai-dial-chat: `0.45.0-rc.55`
   - ai-dial-core: `0.43.0-rc.0`
   - ai-dial-analytics-realtime: `0.23.0-rc.0`
   - ai-dial-rag: `0.42.0-rc.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.7.0-rc.1`
   - ai-dial-mind-map-backend: `0.13.4`
   - ai-dial-mind-map-frontend: `0.10.0`
   - ai-dial-admin-backend: `0.16.0-rc.0`
   - ai-dial-admin-frontend: `0.16.0-rc.0`
   - ai-dial-admin-deployment-manager-backend: `0.16.0-rc.0`
   - ai-dial-admin-evaluation-framework-backend: `0.1.0`
   - ai-dial-admin-evaluation-framework-metrics: `0.1.0`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

## Config changes


### ai-dial-adapter-openai

#### New environment variables

| Variable                         | Default | Description |
|----------------------------------|---------|-------------|
| QWEN3_ASR_VLLM_DEPLOYMENTS       | ``      | Comma-separated list of [Qwen3-ASR deployments](#qwen3-asr) served via vLLM. Example: `qwen3-asr` |

### ai-dial-chat

#### New environment variables

| Name        | Required | Description | Possible Values |
|-------------|----------|-------------|-----------------|
| `ASR_MODEL` | No       | Specifies the model used for automatic speech recognition (ASR). When set together with the `voice-input` feature flag, it enables transcription mode: recorded audio is sent to this model for speech-to-text conversion, and the resulting text is automatically sent as a message. If not set, voice recording works only as a native audio attachment (the selected model must support audio MIME types). | Any string |


### ai-dial-admin-frontend: 

This release includes high-priority changes. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-frontend/blob/0.16.0-rc.0/docs/upgrade-plans/0.16.0.md) before proceeding.

> To enable the required preview features, set the following environment variables:
>
> * `MCP_REGISTRY_ENABLED`
> * `DIAL_EVAL_API_URL`
>
> See the upgrade guide for details.

### ai-dial-admin-frontend: 

This release includes some changes. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-backend/blob/release-0.16/docs/upgrade-plans/0.16.0.md) before proceeding.


### ai-dial-admin-deployment-manager-backend: 

This release includes high-priority changes. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.16.0-rc.0/docs/upgrade-plans/0.16.0.md) before proceeding.
