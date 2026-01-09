# Instructions

## Versions

1. Helm chart versions:
   - dial: TBD
   - dial-core: TBD
   - dial-extension: TBD
   - dial-admin: TBD
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.36.0`
   - ai-dial-adapter-openai: `0.35.0`
   - ai-dial-adapter-vertexai: `0.31.0`
   - ai-dial-adapter-dial: `0.11.0`
   - ai-dial-auth-helper: `0.4.0`
   - ai-dial-chat-themes: `0.12.0`
   - ai-dial-chat: `0.41.3`
   - ai-dial-core: `0.39.1`
   - ai-dial-analytics-realtime: `0.20.0`
   - ai-dial-rag: `0.38.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.3.0`
   - ai-dial-app-builder-python: `0.1.0`
   - quick-apps: `0.8.2`
   - quick-apps-2.0: `0.3.1`
   - mindmap-backend: `0.12.3`
   - mindmap-frontend: `0.9.7`
   - admin-backend: `0.12.0`
   - admin-frontend: `0.12.4`
   - ai-dial-admin-mcp-manager-backend ->ai-dial-admin-deployment-manager-backend: `0.3.1`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.
- Verify `COMPATIBILITY_MAPPING` parameter of DIAL Adapters which are used in your DIAL installation and remove mappings for models that are natively supported by the adapters.

### Release-specific notes


## Config changes

### ai-dial-core

Added new optional parameter in application schema: assistantAttachmentsInRequestSupported with the meaning same as same field for application but for entire application type. Doesn't need to be specified by default.



### ai-dial-chat

Added new optional env variables

`NEXT_PUBLIC_STAGE_CONTENT_LIMIT`   - Sets the maximum size (in kilobytes) for stage content when rendered. If the content exceeds this limit, a download link will be shown instead.  Default value is 40.




### ai-dial-chat-themes


### ai-dial-adapter-openai


### ai-dial-adapter-bedrock

Added new optional env variables

|Variable|Default|Description|
|---|---|---|
|ANTHROPIC_MAX_RETRY_ATTEMPTS|0|How many times to retry Anthropic chat model requests when the provider returns a retriable error|
|BOTOCORE_MAX_RETRY_ATTEMPTS|0|How many times to retry chat model requests made via the Bedrock API or Converse API when the provider returns a retriable error|

To restore the behaviour **before** the fix, configure the env vars in the following way:

```ini
ANTHROPIC_MAX_RETRY_ATTEMPTS=2
BOTOCORE_MAX_RETRY_ATTEMPTS=4
```

### ai-dial-adapter-vertexai

Added new optional env variables

|Variable|Default|Description|
|---|---|---|
|ANTHROPIC_MAX_RETRY_ATTEMPTS|0|How many times to retry Anthropic chat model requests when the provider returns a retriable error|
|GOOGLE_GENAI_MAX_RETRY_ATTEMPTS|0|How many times to retry Google GenAI chat model requests when the provider returns a retriable error|

To restore the behaviour **before** the fix, configure the env vars in the following way:

```ini
ANTHROPIC_MAX_RETRY_ATTEMPTS=2
GOOGLE_GENAI_MAX_RETRY_ATTEMPTS=4
```


### admin-frontend


### admin-backend


#### Detect dial-core versions changes

1. **Mandatory `CORE_CONFIG_VERSION`**:

The `CORE_CONFIG_VERSION` environment variable is now **required** to be set in case `ENABLE_CORE_CONFIG_VERSION_AUTO_DETECT` is set to `false`. To resolve any breaking changes in the DIAL Core JSON config (e.g. the deletion of any property), it is recommended to define `CORE_CONFIG_VERSION` environment variable even if `ENABLE_CORE_CONFIG_VERSION_AUTO_DETECT` is set to `true`.

2. **Handling of breaking changes in DIAL Core configuration**:

If a non-compatible JSON configuration is used with dial-core, the dial-admin application will not be able to start and connect with it to retrieve its config version. If the connection to the dial-core application cannot be established, the dial-admin application will apply the configuration version specified in the `CORE_CONFIG_VERSION` environment variable.


### ai-dial-rag

Environment variables to configure embeddings thread pools DIAL_RAG__CPU_POOLS__INDEXING_EMBEDDINGS_POOL and DIAL_RAG__CPU_POOLS__QUERY_EMBEDDINGS_POOL are no longer used.


### ai-dial-admin-mcp-manager-frontend:

IMPORTANT (!!!)
The Deployment Manager FE is part of the Administration application FE.

### Mind Map:

The migration guide: https://github.com/epam/dial-mind-map-frontend/wiki/Migration-Guide-from-0.2-to-0.3

### quick-apps-2.0

Update schema to the recent one: [Quickapp2 Schema](./quickapp2-schema.json). Changes were done in `$defs` and `properties` sections.
Use admin panel to update existing quick apps to the recent schema version.
Add [Content Downloader](./content_downloader.json) to predefined quick app tools. This file should be available in `${PREDEFINED_BASE_PATH}/tool` folder.  
