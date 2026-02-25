# Instructions

## Versions

1. Helm chart versions:
   - dial: TBD
   - dial-core: TBD
   - dial-extension: TBD
   - dial-admin: TBD
2. Main components versions:
   - ai-dial-adapter-bedrock: TBD
   - ai-dial-adapter-openai: TBD
   - ai-dial-adapter-vertexai: TBD
   - ai-dial-adapter-dial: TBD
   - ai-dial-auth-helper: TBD
   - ai-dial-chat-themes: `0.14.0`
   - ai-dial-chat: `0.43.0`
   - ai-dial-core: TBD
   - ai-dial-analytics-realtime: TBD
   - ai-dial-rag: TBD
   - ai-dial-log-parser: TBD
   - ai-dial-code-interpreter: TBD
   - ai-dial-app-controller: TBD
   - ai-dial-app-builder-python: TBD
   - quick-apps: TBD
   - ai-dial-quickapps-backend: `0.5.0`
   - mindmap-backend: TBD
   - mindmap-frontend: TBD
   - admin-backend: `0.14.0`
   - admin-frontend: `0.14.0`
   - ai-dial-admin-deployment-manager-backend: `0.14.0`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

## Config changes

### ai-dial-core


### ai-dial-chat

- Requires `ai-dial-chat-themes` **v0.14.0 or higher**

#### New Environment Variable

| Environment Variable | Default Value | Required | Description | Allowed Values |
|----------------------|---------------|----------|------------|----------------|
| `AUTH_IDTOKEN_PROVIDERS` | - | No | Comma-separated list of identity provider IDs that will pass an **identity token** to the API instead of an access token. This is required for providers whose access tokens are not JWT (e.g., Google, GitLab). | Any string. Values must be separated by commas (e.g., `google,gitlab`). |

> ℹ️ Example:
>
> ```
> AUTH_IDTOKEN_PROVIDERS=google,gitlab
> ```

### ai-dial-chat-themes
Added new button colors and rename color tokens. If you are using a custom theme, please add the new color definitions to your theme configuration. (https://github.com/epam/ai-dial-chat-themes/blob/development/docs/CHANGELOG.md#0140)

### ai-dial-adapter-openai

### ai-dial-adapter-bedrock

### ai-dial-adapter-vertexai

### admin-frontend

- Requires `ai-dial-chat-themes` **v0.14.0 or higher**

#### New Environment Variable

| Environment Variable | Default Value | Required | Description | Allowed Values |
|----------------------|---------------|----------|------------|----------------|
| `AUTH_IDTOKEN_PROVIDERS` | - | No | Comma-separated list of identity provider IDs that will pass an **identity token** to the API instead of an access token. This is required for providers whose access tokens are not JWT (e.g., Google, GitLab). | Any string. Values must be separated by commas (e.g., `google,gitlab`). |

> ℹ️ Example:
>
> ```
> AUTH_IDTOKEN_PROVIDERS=google,gitlab
> ```

### admin-backend

#### New Environment Variables

The following environment variables were introduced in version 1.41:

| Variable | Description |
|-----------|------------|
| `CORE_AUTH_METHOD` | Authentication method used to interact with DIAL Core. Supported values: `token`, `api-key`. |
| `CORE_AUTH_API_KEY_VALUE` | API key value used when `CORE_AUTH_METHOD=api-key`. |
| `SECURITY_REQUIRE_EMAIL` | If set to `true`, the `email` claim is required in the JWT token. |
| `providers.*.user-info-endpoint` | User info endpoint URI. Required for providers that use opaque tokens. |
| `providers.*.principal-claim` | Specifies which claim is used as the application principal. |

For more details on authentication and security-related configuration, see the Security Configuration section in the Admin Backend configuration reference:

https://github.com/epam/ai-dial-admin-backend/blob/development/docs/configuration.md#security-configuration
---

#### Updated Environment Variables

###### `DATASOURCE_AUTH_TYPE`

A new supported value has been added:

- `gcp`

> The `gcp` authentication type is supported **only** when `DATASOURCE_VENDOR=POSTGRES`.

If `DATASOURCE_VENDOR` is set to any other value, `gcp` is not supported.

### ai-dial-admin-deployment-manager-backend

####  New Configuration Properties

###### Build and Deployment Configuration

| Property | Environment Variable | Default Value | Required | Applied when | Description |
|-----------|----------------------|---------------|----------|--------------|------------|
| `app.image-name-format` | `IMAGE_NAME_FORMAT` | `app-%s` | No | - | Name format for images built using Deployment Manager. Must contain `%s` which will be replaced by the image definition ID. |
| `app.resource-name-prefix` | `RESOURCE_NAME_PREFIX` | - | No | - | Prefix added to all resources produced by image builds and deployments. ⚠️ Do not change this value in existing setups — otherwise previously created images and Kubernetes resources may become inaccessible. |

---

###### Hugging Face Configuration

| Property | Environment Variable | Default Value | Required | Applied when | Description |
|-----------|----------------------|---------------|----------|--------------|------------|
| `huggingface.base-url` | `HUGGINGFACE_BASE_URL` | `https://huggingface.co` | No | - | Base URL for Hugging Face API |
| `huggingface.api-token` | `HUGGINGFACE_API_TOKEN` | - | No | - | API token used for authentication |
| `huggingface.tag-cache-duration` | `HUGGINGFACE_TAG_CACHE_DURATION` | `24h` | No | - | Duration for caching tag data (e.g., `24h`, `60m`) |

---

###### Validation Configuration

| Property | Environment Variable | Default Value | Required | Applied when | Description |
|-----------|----------------------|---------------|----------|--------------|------------|
| `app.resources.max-cpu-in-cores` | `RESOURCES_MAX_CPU_IN_CORES` | `10` | No | - | Maximum allowed CPU value (in cores) |
| `app.resources.max-memory-in-mb` | `RESOURCES_MAX_MEMORY_IN_MB` | `100000` | No | - | Maximum allowed memory value (in MB) |
| `app.resources.max-nvidia-gpu` | `RESOURCES_MAX_NVIDIA_GPU` | `5` | No | - | Maximum allowed value for `nvidia.com/gpu` resource |

---

#### Modified Configuration

###### Default Values Changed

- `K8S_NIM_ENABLED`: `true` → `false`
- `K8S_KSERVE_ENABLED`: `true` → `false`
- `DEPLOYMENT_HEALTHCHECK_ENABLED`: `false` → `true`

---

###### Renamed Environment Variables

| Old Name | New Name |
|----------|----------|
| `DEPLOYMENT_PENDING_CHECK_CRON` | `DEPLOYMENT_RECONCILE_BACKGROUND_CRON` |
| `DEPLOYMENT_PENDING_CHECK_SCHEDULER_LOCK_AT_MOST_FOR` | `DEPLOYMENT_RECONCILE_BACKGROUND_LOCK_AT_MOST` |
| `DEPLOYMENT_RECONCILE_PENDING_CUT_OFF_MINS` | `DEPLOYMENT_RECONCILE_BACKGROUND_STALE_THRESHOLD_MINS` |
| `DEPLOYMENT_BOOTSTRAP_ENABLED` | `DEPLOYMENT_RECONCILE_ON_STARTUP_ENABLED` |
| `DEPLOYMENT_BOOTSTRAP_BATCH_SIZE` | `DEPLOYMENT_RECONCILE_ON_STARTUP_BATCH_SIZE` |
| `DEPLOYMENT_BOOTSTRAP_THREADS` | `DEPLOYMENT_RECONCILE_ON_STARTUP_CONCURRENCY` |

> Old variable names are no longer supported. Please update your configuration accordingly.

---

#### Removed Configuration

The following environment variables were removed:

- `DEPLOYMENT_RECONCILE_CRON`
- `DEPLOYMENT_RECONCILE_SCHEDULER_LOCK_AT_MOST_FOR`
- `WATCHER_FAILURE_RESET_INTERVAL_MS`

If these variables are still present in your environment, they should be removed to avoid confusion.

### ai-dial-rag

### Mind Map

### ai-dial-quickapps-backend
