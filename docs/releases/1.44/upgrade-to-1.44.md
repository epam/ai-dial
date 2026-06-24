# Instructions

## Versions

1. Helm chart versions:
   - dial: `6.4.0`
   - dial-core: `5.2.0`
   - dial-extension: `1.3.3`
   - dial-admin: `0.14.0`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.40.0`
   - ai-dial-adapter-openai: `0.40.0`
   - ai-dial-adapter-vertexai: `0.36.0`
   - ai-dial-adapter-dial: `0.15.0`
   - ai-dial-chat-themes: `0.16.0`
   - ai-dial-chat: `0.46.0`
   - ai-dial-core: `0.44.0`
   - ai-dial-analytics-realtime: `0.24.0`
   - ai-dial-rag: `0.42.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.8.0`
   - ai-dial-mind-map-backend: `0.14.0`
   - ai-dial-mind-map-frontend: `0.12.0`
   - ai-dial-admin-backend: `0.17.0`
   - ai-dial-admin-frontend: `0.17.1`
   - ai-dial-admin-deployment-manager-backend: `0.17.0`

 
## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.


## Config changes


### ai-dial-adapter-openai

#### Deprecated environment variables

| Variable | Description |
|----------|-------------|
| `DIAL_USE_FILE_STORAGE` | Deprecated. DIAL Storage is now enabled automatically when `DIAL_URL` is set, making this variable redundant. |

**Migration:**

| Previous configuration | Required action |
|------------------------|-----------------|
| `DIAL_URL` is set, `DIAL_USE_FILE_STORAGE` is `False` or unset | Remove `DIAL_URL` if you want to keep storage disabled |
| `DIAL_URL` is unset, `DIAL_USE_FILE_STORAGE=True` | No action needed; storage will be disabled (previously caused an error) |
| `DIAL_URL` is set, `DIAL_USE_FILE_STORAGE=True` | No changes required; behavior remains unchanged |

### ai-dial-chat

#### New environment variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `NEXT_PUBLIC_RESOURCE_MAX_SEGMENT_BYTES` | `255` | No | Maximum UTF-8 byte length of a single path segment in entity names (files, folders, conversations). Must be a positive integer less than 1024. Must be set at **build time** (Next.js public env). |

> [!NOTE]
> Entity name validation has changed: the previous 160-character limit is replaced by a UTF-8 byte-based constraint, configurable via `NEXT_PUBLIC_RESOURCE_MAX_SEGMENT_BYTES`.

### ai-dial-analytics-realtime

#### Removed environment variables

| Variable | Description |
|----------|-------------|
| `MODEL_RATES` | Removed. Was used to calculate pricing for chat and embeddings requests when prompt logs were missing pricing information. DIAL Core has reliably provided pricing information in prompt logs since version 0.7.0 (Feb 2024), making this variable redundant. When pricing information is unavailable, the service now defaults to a price of `0.0`. |

### ai-dial-admin-backend
This release includes **high-priority changes**. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-backend/blob/0.17.0-rc.0/docs/upgrade-plans/0.17.0.md) before proceeding.

### ai-dial-quickapps-backend

#### New environment variables

| Variable                          | Default    | Required | Description                                                                                                                                              |
|-----------------------------------|------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `DEFAULT_FILE_LOADING_SIZE_LIMIT` | `10485760` | No | Deployment-wide cap (bytes, `> 0`; default 10 MiB) on files the agent downloads. Overridden per-app by `features.file_loading.size_limit` in the manifest. |
| `DEFAULT_ORCHESTRATOR_DEPLOYMENT_ID` | —       | No | Default DIAL deployment id used as the orchestrator model when a QuickApp manifest omits `orchestrator.deployment`. Also surfaces as the JSON-schema `default` for that field so DIAL Core can pre-fill new manifests. Apps can override per-app. |
| `USE_SYSTEM_CA_CERTS`   | unset   | No | When set to `1`, merges every `*.crt` file under `/certificates/` with the Alpine system CA bundle at container startup and exports `SSL_CERT_FILE` to the merged path so outbound HTTP calls trust private/corporate root CAs. Opt-in; unset keeps existing behavior. |

> [!IMPORTANT]
> Operators must update DIAL Core's configuration when upgrading to this release. The `/v1/configuration-support/*` endpoints are no longer served via a global DIAL Core `routes` entry — they are declared on the QuickApps application type itself.
>
> **Required migration** (https://github.com/epam/ai-dial-quickapps-backend/pull/319):
>
> 1. **Remove** any `quick_apps2`-style entry from DIAL Core's global `routes` block (it will be ignored from now on).
> 2. **Add** the new `dial:applicationTypeRoutes` block to the QuickApps entry under `applicationTypeSchemas` — apply the schema snippet from [PR #319](https://github.com/epam/ai-dial-quickapps-backend/pull/319) verbatim.


### ai-dial-admin-deployment-manager-backend
This release includes **many critical and high-priority changes**. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.17.0-rc.0/docs/upgrade-plans/0.17.0.md) before proceeding.
