# Instructions

## Before environment upgrade

**Please notice**:

1. ETA downtime: TBD
2. Helm chart versions:
   - dial TBD
   - dial-core TBD
   - dial-extension TBD
   - dial-admin TBD
3. Main components versions:
   - ai-dial-adapter-bedrock:`0.35.0`
   - ai-dial-adapter-openai:`0.34.0`
   - ai-dial-adapter-vertexai:`0.29.0`
   - ai-dial-adapter-dial:`0.10.0`
   - ai-dial-auth-helper:`0.4.0`
   - ai-dial-chat-themes:`0.12.0`
   - ai-dial-chat:`0.40.0`
   - ai-dial-core:`0.38.0`\
   - ai-dial-analytics-realtime:`0.19.4`
   - ai-dial-rag:`0.36.0`
   - ai-dial-log-parser:`0.2.0`
   - ai-dial-code-interpreter:`0.2.0`
   - ai-dial-app-controller:`0.3.0`
   - ai-dial-app-builder-python:`0.1.0`
   - quick-apps: `0.8.2`
   - quick-apps-2.0: `0.2.0`
   - mindmap-backend: `0.11.6`
   - mindmap-frontend: `0.8.13`
   - admin-backend : `0.11.1`
   - admin-frontend `0.11.1`
   - ai-dial-admin-mcp-manager-backend: `0.2.2`
   - ai-dial-admin-mcp-manager-backend: `0.2.1`

## Upgrade

TBD

## After environment upgrade

TBD

## Config changes

### ai-dial-core

Changes in [DIAL Core](https://github.com/epam/ai-dial-core) configuration:

|Parameter|Required|Description|
|---|---|---|
|`supportCommentInRateResponse`|No|When enabled, allows users to include a text comment along with their like/dislike feedback for this deployment. The comment is sent in the `comment` field of the rate response payload.|
|`globalInterceptors`|No|A list of [interceptors](https://github.com/epam/ai-dial-core/blob/development/docs/dynamic-settings/interceptors.md#local-interceptors) applicable for any deployment on setup.|
|`dial:applicationTypeInterceptors`|No|A field that can be added to the application's JSON schema. This field can include a list of [interceptors](https://github.com/epam/ai-dial-core/blob/development/docs/dynamic-settings/interceptors.md#application-type-interceptors) that will apply to all applications created based on this schema.|

### ai-dial-chat

Changes in [DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md) configuration:

|Parameter|Required|Description|
|---|---|---|
|`code-interpreter`|No|Include this feature in [`ENABLED_FEATURES`](https://github.com/epam/ai-dial-chat/blob/development/libs/shared/src/types/features.ts) [environment variable](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) to enable code interpreter on the current setup.|
|`dislike-comment`|No|Include this feature in [`ENABLED_FEATURES`](https://github.com/epam/ai-dial-chat/blob/development/libs/shared/src/types/features.ts) [environment variable](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) to enable sending a comment in addition to a dislike in the chat message.|

### ai-dial-chat-themes

Changes in [DIAL Chat Themes](https://github.com/epam/ai-dial-chat-themes) configuration:

- Icons were added for RAG (RAG_files_search.svg) and Echo (Echo.svg).
- The default icon was added for Toolset (default-toolset.svg).
- The default icon for Addon (Addon_Wolfram.svg) was  removed.

### ai-dial-adapter-openai

Changes in [DIAL OpenAI Adapter](https://github.com/epam/ai-dial-adapter-openai) configuration:

|Variable|Required|Default|Description|
|---|---|---|--|
|`AUDIO_AZURE_API_VERSION`|No|`2025-03-01-preview`|Include this [environment variable](https://github.com/epam/ai-dial-adapter-openai?tab=readme-ov-file#environment-variables) to specify the API version for requests to the [Azure Audio API](https://github.com/epam/ai-dial-adapter-openai?tab=readme-ov-file#azure-audio-api) endpoints.|

### ai-dial-adapter-bedrock

Changes in [DIAL Bedrock Adapter](https://github.com/epam/ai-dial-adapter-bedrock) configuration:

|Variable|Required|Description|
|---|---|---|
|`AWS_SESSION_TOKEN`|No|Include this [environment variable](https://github.com/epam/ai-dial-adapter-bedrock?tab=readme-ov-file#environment-variables) to add an alternative way to specify access credentials for the Bedrock service.|

### admin-frontend

Changes in [DIAL Admin Frontend](https://github.com/epam/ai-dial-admin-frontend) configuration:

- The [environment variable](https://github.com/epam/ai-dial-admin-frontend?tab=readme-ov-file#environment-variables) `THEMES_CONFIG_IMAGES` was removed.   

### admin-backend

Changes in [DIAL Admin Backend](https://github.com/epam/ai-dial-admin-backend) configuration:

#### Changes made to environment variables

| Previous Variable Name| New Variable Name| Description|
|-----------------------|------------------|------------|
| `SECURITY_ALLOWED_ROLES`| `providers.<your_provider_name>.allowed-roles` | Comma-separated list of roles with access permissions for the provider.        |
| `SECURITY_JWT_JWKS_URI` | `providers.<your_provider_name>.jwk-set-uri`   | URI for JSON Web Key Set for the provider.         |
| `SECURITY_JWT_ACCEPTED_ISSUERS`       | `providers.<your_provider_name>.issuer`        | List of accepted JWT token issuers for the provider.             |
| `SECURITY_JWT_ACCEPTED_ISSUERS_ALIAS` | `providers.azure.aliases`        | Aliases for accepted JWT token issuers (only applicable for Azure provider).   |
| `DIAL_ADMIN_CLIENT_ID`  | `providers.<your_provider_name>.audiences`          | Previously used as a unique identifier for the DIAL Admin backend application. This env defined the same property as SECURITY_JWT_ACCEPTED_AUDIENCES and was removed. |
| `SECURITY_JWT_ACCEPTED_AUDIENCES`     | `providers.<your_provider_name>.audiences`      | List of accepted JWT token audiences. Defines the intended recipients of the claim aud in JWT. |
| `SECURITY_ROLES_CLAIM`  | `providers.<your_provider_name>.role-claims`   | JWT claim name for user roles for the provider.    |

#### Added support for multiple identity providers

The DIAL Admin application now supports the use of multiple authentication providers, allowing for greater flexibility and integration with various identity services. Below is an example configuration demonstrating how to set up multiple providers:

Example configuration for multiple providers:

```properties
providers.auth0.jwk-set-uri: "https://example-auth0.com/.well-known/jwks.json"
providers.auth0.issuer: "https://example-auth0.com"
providers.auth0.role-claims: "example\\\_roles"
providers.auth0.audiences: "example-audience-id"
providers.keycloak.jwk-set-uri: "https://example-keycloak.com/realms/Example/protocol/openid-connect/certs"
providers.keycloak.issuer: "https://example-keycloak.com/realms/Example"
providers.keycloak.role-claims: "example\\\_roles"
providers.keycloak.audiences: "example-ui, example-admin"
providers.azure.jwk-set-uri: "https://example.microsoft.com/common/discovery/v2.0/keys"
providers.azure.issuer: "example-issuer-id"
providers.azure.role-claims: "example\\\_groups"
providers.azure.audiences: "example-audience-id"
providers.azure.aliases: "login.microsoftonline.com, login.windows.net, login.microsoft.com, sts.windows.net, login.partner.microsoftonline.cn, login.chinacloudapi.cn, login.microsoftonline.de, login.microsoftonline.us, login.usgovcloudapi.net, login-us.microsoftonline.com"
providers.azure.allowed-roles: "example-role-id"
```

## Release Notes

TBD




