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
   - quick-apps: `0.8.2` (deprecated, use ai-dial-quickapps-backend for new installations)
   - ai-dial-quickapps-backend: `0.4.0` (earlier known as quick-apps-2.0)
   - mindmap-backend: `0.13.0`
   - mindmap-frontend: `0.9.13`
   - admin-backend: `0.13.0`
   - admin-frontend: `0.13.3`
   - ai-dial-admin-deployment-manager-backend: `0.13.1`

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

#### Deployment manager FE configuration changes

-  Set `DEPLOYMENTS_ENABLED` to `true` to see the Deployment Manager.
-  `DISABLE_MENU_ITEMS`: add ModelDeployments to hide the Model Deployments UI when model serving infrastructure is not ready.
- `EMBEDDED_APPS` — removed, no longer used.
- `DEPLOYMENTS_PLUGIN_ENABLED` — removed, no longer used.
  

### admin-backend
#### S2S Admin Backend and core configuration 
  Here is the full instraction for dial admin s2s configuration :
  - keycloack provider - https://github.com/epam/ai-dial-admin-backend/blob/development/docs/keycloack-s2s.md
  - azure provider - https://github.com/epam/ai-dial-admin-backend/blob/development/docs/azure-s2s-config.md
 
### ai-dial-admin-deployment-manager-backend

- Deployment manager: migrate to open source epam/ai-dial-admin-deployment-manager-backend:0.13.0
- Proxy images for deployment manager migrate to opensource: https://github.com/epam/ai-dial-deployment-manager-mcp-proxy. Replace `MCP_PROXY_EXECUTABLE_IMAGE_ALPINE` with  `ghcr.io/epam/ai-dial-deployment-manager-mcp-proxy:0.1.0-alpine` and `MCP_PROXY_EXECUTABLE_IMAGE_DEBIAN` with  `ghcr.io/epam/ai-dial-deployment-manager-mcp-proxy:0.1.0-debian`

#### Changes made to environment variables

|Previous Variable Name|New Variable Name|Description|
|-|-|-|
|`SECURITY_ALLOWED_ROLES`|`providers.<your_provider_name>.allowed-roles`|Comma-separated list of roles with access permissions defined for the specific identity provider.|
|`SECURITY_JWT_JWKS_URI`|`providers.<your_provider_name>.jwk-set-uri`|URI for JSON Web Key Set defined for the specific identity provider.|
|`SECURITY_JWT_ACCEPTED_ISSUERS`|`providers.<your_provider_name>.issuer`|List of accepted JWT token issuers defined for the specific identity provider.|
|`SECURITY_JWT_ACCEPTED_ISSUERS_ALIAS`|`providers.azure.aliases`|Aliases for accepted JWT token issuers (applicable only for Azure provider).|
|`DIAL_ADMIN_CLIENT_ID`|`providers.<your_provider_name>.audiences`|Previously used as a unique identifier of the DIAL Admin Deployment Manager application. This environment variable was removed bacause it defined the same property as `SECURITY_JWT_ACCEPTED_AUDIENCES`.|
|`SECURITY_JWT_ACCEPTED_AUDIENCES`|`providers.<your_provider_name>.audiences`|List of accepted JWT token audiences. Defines the intended recipients of the claim `aud` in JWT.|
|`SECURITY_ROLES_CLAIM`|`providers.<your_provider_name>.role-claims`|JWT claim name for user roles defined for the specific identity provider.|
|`SECURITY_ROLES_CLAIM`|`providers.<your_provider_name>.principal-claim`|Specific claim that uniquely identifies the user or service (the "principal") for whom the token was issued.|

#### Added support for multiple identity providers

The DIAL Admin Deployment Manager application now supports the use of multiple identity providers, which offers greater flexibility and integration with various identity services. Below is an example of configuration demonstrating how to set up multiple providers:

```properties
providers.auth0.jwk-set-uri: "https://example-auth0.com/.well-known/jwks.json"
providers.auth0.issuer: "https://example-auth0.com"
providers.auth0.role-claims: "example_roles"
providers.auth0.principal-claim: "example_roles"
providers.auth0.audiences: "example-audience-id"
providers.keycloak.jwk-set-uri: "https://example-keycloak.com/realms/Example/protocol/openid-connect/certs"
providers.keycloak.issuer: "https://example-keycloak.com/realms/Example"
providers.keycloak.role-claims: "example_roles"
providers.keycloack.principal-claim: "example_roles"
providers.keycloak.audiences: "example-ui, example-admin"
providers.azure.jwk-set-uri: "https://example.microsoft.com/common/discovery/v2.0/keys"
providers.azure.issuer: "example-issuer-id"
providers.azure.role-claims: "example_groups"
providers.azure.principal-claim: "example_groups"
providers.azure.audiences: "example-audience-id"
providers.azure.aliases: "login.microsoftonline.com, login.windows.net, login.microsoft.com, sts.windows.net, login.partner.microsoftonline.cn, login.chinacloudapi.cn, login.microsoftonline.de, login.microsoftonline.us, login.usgovcloudapi.net, login-us.microsoftonline.com"
providers.azure.allowed-roles: "example-role-id"
```

### ai-dial-rag

### Mind Map

### ai-dial-quickapps-backend

- Now docker image for `ai-dial-quickapps-backend` is published to [Docker Hub](https://hub.docker.com/r/epam/ai-dial-quickapps-backend). Update your Helm chart values to use the new image location if you were using a custom image registry before.

