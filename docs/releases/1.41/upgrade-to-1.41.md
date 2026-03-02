# Instructions

## Versions

1. Helm chart versions:
   - dial: TBD
   - dial-core: TBD
   - dial-extension: TBD
   - dial-admin: TBD
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.37.0`
   - ai-dial-adapter-openai: `0.37.0`
   - ai-dial-adapter-vertexai: `0.33.0`
   - ai-dial-adapter-dial: `0.12.0`
   - ai-dial-auth-helper: `0.4.0`
   - ai-dial-chat-themes: `0.14.0`
   - ai-dial-chat: `0.43.1`
   - ai-dial-core: `0.41.0`
   - ai-dial-analytics-realtime: `0.21.0`
   - ai-dial-rag: `0.40.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.5.1`
   - mindmap-backend: `0.13.2`
   - mindmap-frontend: `0.9.15`
   - admin-backend: `0.14.0`
   - admin-frontend: `0.14.2`
   - ai-dial-admin-deployment-manager-backend: `0.14.0`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

## Config changes

### ai-dial-core

#### New Optional Environment Variable

| Environment Variable                 | Default Value | Required | Description |
|-------------------------------------|---------------|----------|------------|
| `identityProviders.*.userIdPath`    | `sub`         | No       | Path to the claim in the JWT token or user info response where the user ID can be taken. |

Changes in [DIAL Core](https://github.com/epam/ai-dial-core) configuration:

|Parameter|Required|Description|
|-|-|-|
|`dial:applicationTypeSchemaEndpoint`|No|URL to the application JSON schema endpoint of the custom application of given type|

### ai-dial-chat

Requires `ai-dial-chat-themes` **v0.14.0 or higher**
For more details of changes, see the [changelog](https://github.com/epam/ai-dial-chat-themes/blob/development/docs/CHANGELOG.md#0140).

#### New Environment Variable

| Environment Variable | Default Value | Required | Description | Allowed Values |
|----------------------|---------------|----------|------------|----------------|
| `AUTH_IDTOKEN_PROVIDERS` | - | No | Comma-separated list of identity provider IDs that will pass an **identity token** to the API instead of an access token. This is required for providers whose access tokens are not JWT (e.g., Google, GitLab). | Any string. Values must be separated by commas (e.g., `google,gitlab`). |

### ai-dial-chat-themes
Added new button colors and rename color tokens. If you are using a custom theme, please add the new color definitions to your theme configuration. For more details of changes, see the [changelog](https://github.com/epam/ai-dial-chat-themes/blob/development/docs/CHANGELOG.md#0140).


### ai-dial-adapter-openai

### ai-dial-adapter-bedrock

#### Deprecated Environment Variable

| Environment Variable       | Default Value | Description |
|----------------------------|---------------|------------|
| `COMPATIBILITY_MAPPING`    | `{}`           | **Deprecated** in favor of [compatibility configuration in DIAL Core config](https://github.com/epam/ai-dial-adapter-bedrock/tree/release-0.37?tab=readme-ov-file#compatibility-configuration-in-dial-core-config). For more details of changes, see [Adapter Bedrock Environment Variables](https://github.com/epam/ai-dial-adapter-bedrock/tree/development?tab=readme-ov-file#environment-variables) section. |

### ai-dial-adapter-vertexai

### admin-frontend

Requires `ai-dial-chat-themes` **v0.14.0 or higher**
For more details of changes, see the [changelog](https://github.com/epam/ai-dial-chat-themes/blob/development/docs/CHANGELOG.md#0140).

-  `DISABLE_MENU_ITEMS`: add ModelServings to hide the Model Service UI when model serving infrastructure is not ready.
 
#### New Environment Variable

| Environment Variable | Default Value | Required | Description | Allowed Values |
|----------------------|---------------|----------|------------|----------------|
| `AUTH_IDTOKEN_PROVIDERS` | - | No | Comma-separated list of identity provider IDs that will pass an **identity token** to the API instead of an access token. This is required for providers whose access tokens are not JWT (e.g., Google, GitLab). | Any string. Values must be separated by commas (e.g., `google,gitlab`). |

### admin-backend
#### GCP Database Setup

If you are using a **GCP Database**, follow the instructions in the [GCP Database Configuration Guide](https://github.com/epam/ai-dial-admin-backend/blob/development/docs/configuration.md#gcp-database-setup) to set it up properly.

#### Google Identity Setup

To configure **Google Identity** as an Identity Provider, follow the official guide: [Google Provider Configuration](https://github.com/epam/ai-dial-admin-backend/blob/development/docs/google-provider-configuration.md)

#### New Environment Variables

The following environment variables were introduced in version 1.41:

| Variable | Description |
|-----------|------------|
| `CORE_AUTH_METHOD` | Authentication method used to interact with DIAL Core. Supported values: `token`, `api-key`. |
| `CORE_AUTH_API_KEY_VALUE` | API key value used when `CORE_AUTH_METHOD=api-key`. |
| `SECURITY_REQUIRE_EMAIL` | If set to `true`, the `email` claim is required in the JWT token. |
| `providers.*.user-info-endpoint` | User info endpoint URI. Required for providers that use opaque tokens. |
| `providers.*.principal-claim` | Specifies which claim is used as the application principal. |
| `providers.*.email-claims` | Comma-separated list of JWT claim paths used to extract user email. |

For more details on authentication and security-related configuration, see the **Security Configuration** section in the Admin Backend configuration reference: [Security Configuration – Admin Backend](https://github.com/epam/ai-dial-admin-backend/blob/development/docs/configuration.md#security-configuration)

---

#### Updated Environment Variables


`DATASOURCE_AUTH_TYPE`

A new supported value has been added: `gcp`

> Note: The `gcp` authentication type is supported **only** when:
>
> ```text
> DATASOURCE_VENDOR=POSTGRES
> ```
>

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

###### Cilium configuration
Deployment manager supports usage of cilium policies: 
| Setting | Effect |
|--------|--------|
| `CILIUM_NETWORK_POLICIES_ENABLED=true` | Deployment Manager can enable Cilium network policies for image build and deployments |
| Required setup | Role + RoleBinding above in each target namespace (`mcp-namespace`, `nim-namespace`, `kserve-namespace`, etc.) |

Here is a guide how to enable cilium policy for Deployment manager with sample values [https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/development/docs/cilium-rbac-sample.md]

---

#### Removed Configuration

The following environment variables were removed:

- `DEPLOYMENT_RECONCILE_CRON`
- `DEPLOYMENT_RECONCILE_SCHEDULER_LOCK_AT_MOST_FOR`
- `WATCHER_FAILURE_RESET_INTERVAL_MS`

If these variables are still present in your environment, they should be removed to avoid confusion.

### ai-dial-rag

### Mind Map

### ai-dial-app-controller

### ai-dial-quickapps-backend

* env variable `PREDEFINED_BASE_PATH` [was deprecated](https://github.com/epam/ai-dial-quickapps-backend/tree/0.5.1?tab=readme-ov-file#deprecated-environment-variables). Migrate to `PREDEFINED_EXTRA_PATHS` by renaming env variable and formatting value as json list, if needed (`value` -> `["value"]`).
* [Instructions feature was deprecated](https://github.com/epam/ai-dial-quickapps-backend/tree/0.5.1?tab=readme-ov-file#deprecated-agent-instructions). If it was used, see [migration guide](https://github.com/epam/ai-dial-quickapps-backend/blob/0.5.1/docs/skills.md#migrating-from-agent-instructions) to new [Agent Skills](https://github.com/epam/ai-dial-quickapps-backend/blob/0.5.1/docs/skills.md) feature.
