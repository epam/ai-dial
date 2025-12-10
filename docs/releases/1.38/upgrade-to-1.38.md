# Instructions

## Versions

1. Helm chart versions:
   - dial: `5.18.0`
   - dial-core: `4.3.1`
   - dial-extension: `1.3.3`
   - dial-admin: `0.6.0`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.35.0`
   - ai-dial-adapter-openai: `0.34.0`
   - ai-dial-adapter-vertexai: `0.29.0`
   - ai-dial-adapter-dial: `0.10.0`
   - ai-dial-auth-helper: `0.4.0`
   - ai-dial-chat-themes: `0.12.0`
   - ai-dial-chat: `0.40.1`
   - ai-dial-core: `0.38.0`
   - ai-dial-analytics-realtime: `0.19.4`
   - ai-dial-rag: `0.36.0`
   - ai-dial-log-parser: `0.2.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.3.0`
   - ai-dial-app-builder-python: `0.1.0`
   - quick-apps: `0.8.2`
   - quick-apps-2.0: `0.2.0`
   - mindmap-backend: `0.11.6`
   - mindmap-frontend: `0.8.13`
   - admin-backend: `0.11.2`
   - admin-frontend: `0.11.2`
   - ai-dial-admin-mcp-manager-backend: `0.2.2`
   - ai-dial-admin-mcp-manager-frontend: `0.2.1`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.
- Verify `COMPATIBILITY_MAPPING` parameter of DIAL Adapters which are used in your DIAL installation and remove mappings for models that are natively supported by the adapters.

### Release-specific notes

If DIAL Admin Panel is used for managing the DIAL Core configuration, please consider the following order of updating the DIAL components:

1. Update DIAL Admin Panel using `dial-admin` Helm chart with the following parameters being set:
    1. Disable `ENABLE_CORE_CONFIG_VERSION_AUTO_DETECT`.
    2. Set `CORE_CONFIG_VERSION` to the version of DIAL Core you are going to update to (e.g. `0.38.0`).
2. Update DIAL using `dial` Helm chart.
3. Enable `ENABLE_CORE_CONFIG_VERSION_AUTO_DETECT` and disable `CORE_CONFIG_VERSION` parameters of DIAL Admin Panel.

## Config changes

### ai-dial-core

Changes in [DIAL Core](https://github.com/epam/ai-dial-core) configuration:

|Parameter|Required|Description|
|-|-|-|
|`supportCommentInRateResponse`|No|When enabled, it allows users to include a text comment along with their like/dislike feedback for this deployment. The comment is sent in the `comment` field of the rate response payload.|
|`globalInterceptors`|No|A list of [interceptors](https://github.com/epam/ai-dial-core/blob/development/docs/dynamic-settings/interceptors.md#local-interceptors) applicable for any deployment on you DIAL setup.|
|`dial:applicationTypeInterceptors`|No|A field that can be added to the application's JSON schema. This field can include a list of [interceptors](https://github.com/epam/ai-dial-core/blob/development/docs/dynamic-settings/interceptors.md#application-type-interceptors) that will apply to all applications created based on this schema.|
|`applications.features.addonsSupported`|No|The flag `addonsSupported` is removed from application's features.|
|`models.features.addonsSupported`|No|The flag `addonsSupported` is removed from model's features.|
|`addons`|No|The section is removed from the DIAL Core config.|
|`assistant`|No|The section is removed from the DIAL Core config.|

### ai-dial-chat

Changes in [DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md) configuration:

|Parameter|Required|Description|
|-|-|-|
|`code-interpreter`|No|Include this feature in [`ENABLED_FEATURES`](https://github.com/epam/ai-dial-chat/blob/development/libs/shared/src/types/features.ts) [environment variable](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) to enable Code Interpreter on the current DIAL setup.|
|`dislike-comment`|No|Include this feature in [`ENABLED_FEATURES`](https://github.com/epam/ai-dial-chat/blob/development/libs/shared/src/types/features.ts) [environment variable](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) to enable sending a comment in addition to a dislike feedback in the chat message.|

### ai-dial-chat-themes

Changes in [DIAL Chat Themes](https://github.com/epam/ai-dial-chat-themes) configuration:

- Icons were added for RAG (RAG_files_search.svg) and Echo (Echo.svg).
- The default icon was added for Toolsets (default-toolset.svg).
- The default icon for Addons (Addon_Wolfram.svg) was removed.

### ai-dial-adapter-openai

Changes in [DIAL OpenAI Adapter](https://github.com/epam/ai-dial-adapter-openai) configuration:

|Variable|Required|Default|Description|
|-|-|-|-|
|`AUDIO_AZURE_API_VERSION`|No|`2025-03-01-preview`|Include this [environment variable](https://github.com/epam/ai-dial-adapter-openai?tab=readme-ov-file#environment-variables) to specify the API version for requests to the [Azure Audio API](https://github.com/epam/ai-dial-adapter-openai?tab=readme-ov-file#azure-audio-api) endpoints.|

### ai-dial-adapter-bedrock

Changes in [DIAL Bedrock Adapter](https://github.com/epam/ai-dial-adapter-bedrock) configuration:

|Variable|Required|Description|
|-|-|-|
|`AWS_SESSION_TOKEN`|No|Include this [environment variable](https://github.com/epam/ai-dial-adapter-bedrock?tab=readme-ov-file#environment-variables) to add an alternative way to specify access credentials for the Bedrock service.|

- [Removed support](https://github.com/epam/ai-dial-adapter-bedrock/pull/335) of retired AI21 and Stability AI models. These models **MUST** be deleted from the adapter configuration before upgrade.

### ai-dial-adapter-vertexai

- Removed support of retired Gemini 1.5 models ([#309](https://github.com/epam/ai-dial-adapter-vertexai/pull/309), [#315](https://github.com/epam/ai-dial-adapter-vertexai/pull/315)). These models **MUST** be deleted from the adapter configuration before upgrade.

### admin-frontend

Changes in [DIAL Admin Frontend](https://github.com/epam/ai-dial-admin-frontend) configuration:

- The [environment variable](https://github.com/epam/ai-dial-admin-frontend?tab=readme-ov-file#environment-variables) `THEMES_CONFIG_IMAGES` was removed.

### admin-backend

Changes in [DIAL Admin Backend](https://github.com/epam/ai-dial-admin-backend) configuration:

#### Changes made to environment variables

|Previous Variable Name|New Variable Name|Description|
|-|-|-|
|`SECURITY_ALLOWED_ROLES`|`providers.<your_provider_name>.allowed-roles`|Comma-separated list of roles with access permissions defined for the specific identity provider.|
|`SECURITY_JWT_JWKS_URI`|`providers.<your_provider_name>.jwk-set-uri`|URI for JSON Web Key Set defined for the specific identity provider.|
|`SECURITY_JWT_ACCEPTED_ISSUERS`|`providers.<your_provider_name>.issuer`|List of accepted JWT token issuers defined for the specific identity provider.|
|`SECURITY_JWT_ACCEPTED_ISSUERS_ALIAS`|`providers.azure.aliases`|Aliases for accepted JWT token issuers (applicable only for Azure provider).|
|`DIAL_ADMIN_CLIENT_ID`|`providers.<your_provider_name>.audiences`|Previously used as a unique identifier of the DIAL Admin backend application. This environment variable was removed bacause it defined the same property as `SECURITY_JWT_ACCEPTED_AUDIENCES`.|
|`SECURITY_JWT_ACCEPTED_AUDIENCES`|`providers.<your_provider_name>.audiences`|List of accepted JWT token audiences. Defines the intended recipients of the claim `aud` in JWT.|
|`SECURITY_ROLES_CLAIM`|`providers.<your_provider_name>.role-claims`|JWT claim name for user roles defined for the specific identity provider.|

#### Added support for multiple identity providers

The DIAL Admin application now supports the use of multiple identity providers, which offers greater flexibility and integration with various identity services. Below is an example of configuration demonstrating how to set up multiple providers:

```properties
providers.auth0.jwk-set-uri: "https://example-auth0.com/.well-known/jwks.json"
providers.auth0.issuer: "https://example-auth0.com"
providers.auth0.role-claims: "example_roles"
providers.auth0.audiences: "example-audience-id"
providers.keycloak.jwk-set-uri: "https://example-keycloak.com/realms/Example/protocol/openid-connect/certs"
providers.keycloak.issuer: "https://example-keycloak.com/realms/Example"
providers.keycloak.role-claims: "example_roles"
providers.keycloak.audiences: "example-ui, example-admin"
providers.azure.jwk-set-uri: "https://example.microsoft.com/common/discovery/v2.0/keys"
providers.azure.issuer: "example-issuer-id"
providers.azure.role-claims: "example_groups"
providers.azure.audiences: "example-audience-id"
providers.azure.aliases: "login.microsoftonline.com, login.windows.net, login.microsoft.com, sts.windows.net, login.partner.microsoftonline.cn, login.chinacloudapi.cn, login.microsoftonline.de, login.microsoftonline.us, login.usgovcloudapi.net, login-us.microsoftonline.com"
providers.azure.allowed-roles: "example-role-id"
```
#### Detect dial-core versions changes

1. **Mandatory `CORE_CONFIG_VERSION`**:

The `CORE_CONFIG_VERSION` environment variable is now **required** to be set in case `ENABLE_CORE_CONFIG_VERSION_AUTO_DETECT` is set to `false`. To resolve any breaking changes in the DIAL Core JSON config (e.g. the deletion of any property), it is recommended to define `CORE_CONFIG_VERSION` environment variable even if `ENABLE_CORE_CONFIG_VERSION_AUTO_DETECT` is set to `true`.

2. **Handling of breaking changes in DIAL Core configuration**:

If a non-compatible JSON configuration is used with dial-core, the dial-admin application will not be able to start and connect with it to retrieve its config version. If the connection to the dial-core application cannot be established, the dial-admin application will apply the configuration version specified in the `CORE_CONFIG_VERSION` environment variable.


