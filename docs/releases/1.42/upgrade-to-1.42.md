# Instructions

## Versions

1. Helm chart versions:
   - dial: `TBD`
   - dial-core: `TBD`
   - dial-extension: `TBD`
   - dial-admin: `TBD`
2. Main components versions:
   - ai-dial-adapter-bedrock: `-`// TODO: ???
   - ai-dial-adapter-openai: `-`// TODO: ???
   - ai-dial-adapter-vertexai: `-`// TODO: ???
   - ai-dial-adapter-dial: `-`// TODO: ???
   - ai-dial-auth-helper: `0.4.0`
   - ai-dial-chat-themes: `0.14.0`
   - ai-dial-chat: `0.44.0`
   - ai-dial-core: `0.42.0`
   - ai-dial-analytics-realtime: `-` // TODO: ???
   - ai-dial-rag: `0.40.2` // TODO: !!!
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
