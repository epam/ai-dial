# Instructions

## Versions

1. Helm chart versions:
   - dial: TBD
   - dial-core: TBD
   - dial-extension: TBD
   - dial-admin: TBD
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.36.3`
   - ai-dial-adapter-openai: `0.36.1`
   - ai-dial-adapter-vertexai: `0.32.0`
   - ai-dial-adapter-dial: `0.11.0`
   - ai-dial-auth-helper: `0.4.0`
   - ai-dial-chat-themes: `0.13.0`
   - ai-dial-chat: `0.42.1`
   - ai-dial-core: `0.40.0`
   - ai-dial-analytics-realtime: `0.20.2`
   - ai-dial-rag: `0.39.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.3.0`
   - ai-dial-app-builder-python: `0.1.0`
   - quick-apps: `0.8.2`
   - quick-apps-2.0: `0.4.0`
   - mindmap-backend: `0.12.6`
   - mindmap-frontend: `0.9.8`
   - admin-backend: `0.13.0`
   - admin-frontend: `0.13.0`
   - ai-dial-admin-deployment-manager-backend: `0.13.0`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

## Config changes

### ai-dial-core


### ai-dial-chat

### ai-dial-chat-themes

### ai-dial-adapter-openai

### ai-dial-adapter-bedrock


### ai-dial-adapter-vertexai

- Deprecation of COMPATIBILITY_MAPPING env var in favour of per-upstream configuration (https://github.com/epam/ai-dial-adapter-vertexai?tab=readme-ov-file#compatibility-configuration-in-dial-core-config)

### admin-frontend

- add/update DISABLE_MENU_ITEMS env variable - add 'ModelDeployments' key

### admin-backend

### ai-dial-admin-deployment-manager-backend

- Deployment manager: migrate to open source epam/ai-dial-admin-deployment-manager-backend:0.13.0
- Proxy images for deployment manager migrate to opensource: https://github.com/epam/ai-dial-deployment-manager-mcp-proxy. Replace `MCP_PROXY_EXECUTABLE_IMAGE_ALPINE` with  `ghcr.io/epam/ai-dial-deployment-manager-mcp-proxy:0.1.0-alpine` and `MCP_PROXY_EXECUTABLE_IMAGE_DEBIAN` with  `ghcr.io/epam/ai-dial-deployment-manager-mcp-proxy:0.1.0-debian`

### ai-dial-rag

### Mind Map

### quick-apps-2.0

