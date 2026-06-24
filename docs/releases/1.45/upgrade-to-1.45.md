# Instructions

## Versions

1. Helm chart versions:
   - dial: `6.4.0`
   - dial-core: `6.0.0`
   - dial-extension: `3.1.1`
   - dial-admin: `0.15.0`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.40.0`
   - ai-dial-adapter-openai: `0.40.0`
   - ai-dial-adapter-vertexai: `0.36.0`
   - ai-dial-adapter-dial: `0.15.0`
   - ai-dial-chat-themes: `0.16.0`
   - ai-dial-chat: `0.46.3`
   - ai-dial-core: `0.45.0-rc.0`
   - ai-dial-analytics-realtime: `0.24.2`
   - ai-dial-rag: `0.42.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.9.0-rc.1`
   - ai-dial-mind-map-backend: `0.14.1`
   - ai-dial-mind-map-frontend: `0.13.0`
   - ai-dial-admin-backend: `0.18.0-rc.0`
   - ai-dial-admin-frontend: `0.18.0-rc.0`
   - ai-dial-admin-deployment-manager-backend: `0.18.0-rc.0`
   - ai-dial-admin-evaluation-framework-backend: `0.1.0-rc.0`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

#### ai-dial-admin-deployment-manager-backend `0.18.0-rc.0`

> [!CAUTION]
> This release includes high-priority changes. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.18.0-rc.0/docs/upgrade-plans/0.18.0.md) before proceeding.

##### Breaking changes

**Spring Boot upgraded from 3.5 to 4.0.6 (Spring Framework 7, Hibernate 7.2) with Jackson 3 JSON serialization**

Major framework version bump. JSON serialization migrated to Jackson 3. Known regression: image entrypoint/cmd binding from container config blob was broken by Jackson 3 migration (fixed in this release). Full impact of framework upgrade may require review of custom configs or extensions.

| Previous configuration | Required action |
|---|---|
| Running on Spring Boot 3.5 / Jackson 2 | Review the full upgrade guide at the external_upgrade_plan URL before upgrading. Verify any custom Spring/Hibernate/Jackson configuration is compatible with Spring Boot 4.0.6 / Spring Framework 7 / Hibernate 7.2 / Jackson 3. |

**OpenTelemetry env vars renamed/removed and default changed: OTEL export is now OFF by default**

Three breaking changes to OTel configuration: (1) OTEL_SDK_DISABLED replaced by OTEL_EXPORT_ENABLED with inverted semantics; (2) OTEL_EXPORTER_OTLP_PROTOCOL replaced by OTEL_EXPORTER_OTLP_TRANSPORT; (3) OTEL_EXPORTER_OTLP_HEADERS removed entirely. Existing telemetry exporters will stop silently until migrated.

| Previous configuration | Required action |
|---|---|
| OTEL_SDK_DISABLED=false (telemetry enabled) | Replace with OTEL_EXPORT_ENABLED=true (inverted logic) |
| OTEL_SDK_DISABLED=true (telemetry disabled) | Remove OTEL_SDK_DISABLED; telemetry export is now off by default, so no replacement needed unless you want to explicitly set OTEL_EXPORT_ENABLED=false |
| OTEL_EXPORTER_OTLP_PROTOCOL set to any value | Rename to OTEL_EXPORTER_OTLP_TRANSPORT with the same value |
| OTEL_EXPORTER_OTLP_HEADERS set with header values | OTEL_EXPORTER_OTLP_HEADERS is removed; review the full upgrade guide for the replacement mechanism |

##### Removed environment variables

| Variable | Description |
|---|---|
| `OTEL_SDK_DISABLED` | Replaced by OTEL_EXPORT_ENABLED with inverted semantics. Existing telemetry exporters will stop silently if not migrated. |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Replaced by OTEL_EXPORTER_OTLP_TRANSPORT. |
| `OTEL_EXPORTER_OTLP_HEADERS` | Removed entirely. No direct replacement mentioned in release notes. Review full upgrade guide. |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `OTEL_EXPORT_ENABLED` | `enabled (via OTEL_SDK_DISABLED=false or unset)` | `false (off by default)` | OpenTelemetry export is now off by default. Previously controlled by OTEL_SDK_DISABLED which defaulted to SDK enabled. |

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `OTEL_EXPORT_ENABLED` | `false` | No | Replaces OTEL_SDK_DISABLED with inverted semantics. Set to true to enable OpenTelemetry export. Default is now off. |
| `OTEL_EXPORTER_OTLP_TRANSPORT` | — | No | Replaces OTEL_EXPORTER_OTLP_PROTOCOL. Configures the OTLP exporter transport protocol. |

---

#### ai-dial-admin-evaluation-framework-backend `0.1.0-rc.0`

##### Breaking changes

**EvalSummary CSV export column-group separator changed from `:` to `::`**

Any downstream consumer that parses exported CSV headers by splitting on `:` will produce incorrect column mappings. Column names such as `data:prompt` are now `data::prompt` and `metric:Accuracy:score` is now `metric::Accuracy::score`.

| Previous configuration | Required action |
|---|---|
| Consumer splits CSV headers on single `:` (e.g. `data:prompt`, `metric:Accuracy:score`) | Update header-parsing logic to split on `::` instead of `:` |

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `TEST_CASE_BULK_MAX_DELETE_IDS` | `10000` | No | Maximum number of IDs accepted in a single bulk-delete-by-IDs request (`DELETE /test-cases:bulk`). Must be ≥ 1. |

---

#### ai-dial-admin-backend `0.18.0-rc.0`

##### Breaking changes

**ApplicationResourceDto: flat `applicationTypeSchemaId` field replaced by polymorphic `source` field**

The flat `applicationTypeSchemaId` field on `ApplicationResourceDto` and `CreateApplicationResourceDto` has been removed. It is replaced by a polymorphic `source` field, which is a `$type`-discriminated object with `schema` and `endpoints` variants. Any API clients, automation scripts, or tooling that reads or writes `applicationTypeSchemaId` must be updated to use the new `source` object structure.

| Previous configuration | Required action |
|---|---|
| API payloads include `applicationTypeSchemaId: "<id>"` on ApplicationResourceDto or CreateApplicationResourceDto | Replace `applicationTypeSchemaId` with the new `source` polymorphic object (`$type`-discriminated, with `schema` or `endpoints` variant) in all API clients, scripts, and integrations |

##### Config / Helm changes

- **Default changed** `features.maxTokensSupported`: `unset / not present` → `true` — New field; when not explicitly configured, now defaults to `true`.
- **Default changed** `features.customTemperatureSupported`: `unset / not present` → `true` — New field; when not explicitly configured, now defaults to `true`.
- **Default changed** `applicationProperties (application assets)`: `null / absent` → `empty map {}` — `applicationProperties` for application assets now defaults to an empty map instead of being null/absent.
- **Added** `features.maxTokensSupported`: New configuration property introduced with DIAL Core v0.45.0 support. Defaults to `true`.
- **Added** `features.maxCompletionTokensSupported`: New configuration property introduced with DIAL Core v0.45.0 support.
- **Added** `features.customTemperatureSupported`: New configuration property introduced with DIAL Core v0.45.0 support. Defaults to `true`.
- **Added** `features.reasoningEfforts`: New configuration property introduced with DIAL Core v0.45.0 support.
- **Added** `upstreams.secretExtraData`: New configuration property for upstreams, introduced with DIAL Core v0.45.0 support.
- **Added** `models.embeddingDimensions`: New configuration property for models, introduced with DIAL Core v0.45.0 support.

---

#### ai-dial-quickapps-backend `0.9.0-rc.1`

##### Breaking changes

**DIAL files tools graduated to GA — now active regardless of ENABLE_PREVIEW_FEATURES**

The list/read_lines/search/find/write/edit/delete/copy/move tools and the features.dial_files config field are no longer gated by ENABLE_PREVIEW_FEATURES. Any deployment that relied on ENABLE_PREVIEW_FEATURES=false to suppress these tools will find them active after upgrade. The tool_call_result_offload sub-feature (features.dial_files.tool_call_result_offload and its TOOL_CALL_RESULT_OFFLOAD__* env defaults) remains preview-gated.

| Previous configuration | Required action |
|---|---|
| ENABLE_PREVIEW_FEATURES=false — DIAL files tools were inactive | After upgrade, DIAL files tools will be active regardless of ENABLE_PREVIEW_FEATURES. If you must disable them, use features.dial_files config to control availability explicitly. |
| ENABLE_PREVIEW_FEATURES=true — DIAL files tools were active | No action required; behavior unchanged. |

##### Config / Helm changes

- **Added** `features.dial_files`: Config field for DIAL files tools is now GA and respected regardless of ENABLE_PREVIEW_FEATURES. Previously only evaluated when ENABLE_PREVIEW_FEATURES was enabled.

---

#### ai-dial-core `0.45.0-rc.0`

##### Config / Helm changes

- **Added** `features.reasoningEffortsSupported`: New feature flag to indicate whether a model/deployment supports reasoning efforts configuration.
- **Added** `features.maxTokensSupported / features.maxCompletionTokensSupported / features.temperatureSupported`: New feature flags to expose max_tokens, max_completion_tokens, and temperature support per model/deployment.
- **Added** `features (available endpoints flags)`: New flags exposing which endpoints are available for a given deployment.
- **Added** `roles.readonly-admin`: New readonly-admin role introduced to allow reading user data without write permissions.

---
