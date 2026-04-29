# Instructions

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
2. Main components versions:
   - ai-dial-adapter-bedrock: `-`
   - ai-dial-adapter-openai: `-`
   - ai-dial-adapter-vertexai: `-`
   - ai-dial-adapter-dial: `-`
   - ai-dial-chat-themes: `0.14.0`
   - ai-dial-chat: `-`
   - ai-dial-core: `0.43.0-rc.0`
   - ai-dial-analytics-realtime: `-`
   - ai-dial-rag: `-`
   - ai-dial-log-parser: `-`
   - ai-dial-code-interpreter: `-`
   - ai-dial-app-controller: `-`
   - ai-dial-app-builder-python: `-`
   - ai-dial-quickapps-backend: `-`
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

### ai-dial-admin-frontend: 
#### Upgrade Notice

This release includes high-priority changes. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-frontend/blob/0.16.0-rc.0/docs/upgrade-plans/0.16.0.md) before proceeding.

> To enable the required preview features, set the following environment variables:
>
> * `MCP_REGISTRY_ENABLED`
> * `DIAL_EVAL_API_URL`
>
> See the upgrade guide for details.

### ai-dial-admin-frontend: 
#### Upgrade Notice

This release includes some changes. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-backend/blob/release-0.16/docs/upgrade-plans/0.16.0.md) before proceeding.


### ai-dial-admin-deployment-manager-backend: 
#### Upgrade Notice

This release includes high-priority changes. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.16.0-rc.0/docs/upgrade-plans/0.16.0.md) before proceeding.
