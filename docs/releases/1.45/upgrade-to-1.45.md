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

**Spring Boot upgraded to 4.0.6 (Spring Framework 7, Hibernate 7.2) with Jackson 3 JSON serialization**

Major framework version bump. Jackson 3 migration caused at least one known regression (image entrypoint/cmd binding). Any custom serialization/deserialization configuration or extensions may break. Verify all integration points and configuration bindings after upgrade.

| Previous configuration | Required action |
|---|---|
| Running on Spring Boot 3.5 with Jackson 2 | Review full upgrade guide. Test all API integrations and custom config bindings against the new Jackson 3 / Spring Framework 7 stack before deploying to production. |

**OpenTelemetry env vars renamed/removed and default changed: OTEL export is now OFF by default**

Three env var changes: (1) OTEL_SDK_DISABLED replaced by OTEL_EXPORT_ENABLED with inverted logic, (2) OTEL_EXPORTER_OTLP_PROTOCOL replaced by OTEL_EXPORTER_OTLP_TRANSPORT, (3) OTEL_EXPORTER_OTLP_HEADERS removed entirely. Existing telemetry exporters will silently stop sending data until migrated.

| Previous configuration | Required action |
|---|---|
| OTEL_SDK_DISABLED=false (telemetry enabled) | Remove OTEL_SDK_DISABLED and set OTEL_EXPORT_ENABLED=true |
| OTEL_SDK_DISABLED=true (telemetry disabled) | Remove OTEL_SDK_DISABLED; OTEL_EXPORT_ENABLED defaults to false so no action needed to keep telemetry off |
| OTEL_EXPORTER_OTLP_PROTOCOL set to any value | Rename env var to OTEL_EXPORTER_OTLP_TRANSPORT and verify the value is still valid for the new configuration |
| OTEL_EXPORTER_OTLP_HEADERS set with auth/metadata headers | Identify replacement mechanism via the full upgrade guide; this env var is removed with no direct replacement stated in release notes |

##### Removed environment variables

| Variable | Description |
|---|---|
| `OTEL_SDK_DISABLED` | Replaced by OTEL_EXPORT_ENABLED (inverted logic). Must be migrated or telemetry export will silently stop. |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Replaced by OTEL_EXPORTER_OTLP_TRANSPORT. Must be migrated or telemetry export will silently stop. |
| `OTEL_EXPORTER_OTLP_HEADERS` | Removed entirely with no stated replacement. Any auth or metadata headers previously passed via this variable will no longer be applied. |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `OTEL_EXPORT_ENABLED` | `effectively true (OTEL_SDK_DISABLED defaulted to false, meaning export was on)` | `false (export is now off by default)` | OpenTelemetry export is now disabled by default. Deployments that relied on default-enabled telemetry must explicitly set OTEL_EXPORT_ENABLED=true. |

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `OTEL_EXPORT_ENABLED` | `false` | No | Replaces OTEL_SDK_DISABLED with inverted logic. Set to true to enable OpenTelemetry export. Defaults to false (export off). |
| `OTEL_EXPORTER_OTLP_TRANSPORT` | — | No | Replaces OTEL_EXPORTER_OTLP_PROTOCOL for specifying the OTLP exporter transport. |

---

#### ai-dial-admin-evaluation-framework-backend `0.1.0-rc.0`

##### Breaking changes

**EvalSummary CSV export column-group separator changed from `:` to `::`**

Any downstream consumer that parses exported CSV headers by splitting on `:` will break. Column names like `data:prompt` are now `data::prompt`; `metric:Accuracy:score` is now `metric::Accuracy::score`. Parsers, ETL pipelines, or scripts that rely on the old separator must be updated before or immediately after upgrade.

| Previous configuration | Required action |
|---|---|
| Consumer splits CSV headers on single `:` (e.g. `data:prompt`, `metric:Accuracy:score`) | Update consumer to split on `::` (e.g. `data::prompt`, `metric::Accuracy::score`) |

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `TEST_CASE_BULK_MAX_DELETE_IDS` | `10000` | No | Maximum number of IDs accepted in a single bulk-delete-by-IDs request (`DELETE /test-cases:bulk`). Must be ≥ 1. |

---

#### ai-dial-admin-backend `0.18.0-rc.0`

##### Breaking changes

**Flat `applicationTypeSchemaId` field replaced by polymorphic `source` field on ApplicationResourceDto and CreateApplicationResourceDto**

The `applicationTypeSchemaId` field has been removed from `ApplicationResourceDto` and `CreateApplicationResourceDto`. It is replaced by a `source` field which is a `$type`-discriminated polymorphic object with `schema` and `endpoints` variants. Any API clients, integration code, or config payloads that set or read `applicationTypeSchemaId` must be updated to use the new `source` structure.

| Previous configuration | Required action |
|---|---|
| API payloads include flat `applicationTypeSchemaId` field on ApplicationResourceDto / CreateApplicationResourceDto | Replace `applicationTypeSchemaId` with the new polymorphic `source` field (a `$type`-discriminated object with `schema` and `endpoints` variants) in all API clients and integration code |

##### Config / Helm changes

- **Removed** `ApplicationResourceDto.applicationTypeSchemaId / CreateApplicationResourceDto.applicationTypeSchemaId`: The flat `applicationTypeSchemaId` field has been removed and replaced by the polymorphic `source` field
- **Default changed** `features.maxTokensSupported`: `unset / not present` → `true` — Newly added field defaults to true
- **Default changed** `features.customTemperatureSupported`: `unset / not present` → `true` — Newly added field defaults to true
- **Added** `features.maxTokensSupported`: New configuration property introduced in DIAL Core v0.45.0; defaults to true
- **Added** `features.maxCompletionTokensSupported`: New configuration property introduced in DIAL Core v0.45.0
- **Added** `features.customTemperatureSupported`: New configuration property introduced in DIAL Core v0.45.0; defaults to true
- **Added** `features.reasoningEfforts`: New configuration property introduced in DIAL Core v0.45.0
- **Added** `upstreams.secretExtraData`: New configuration property for upstreams introduced in DIAL Core v0.45.0
- **Added** `models.embeddingDimensions`: New configuration property for models introduced in DIAL Core v0.45.0
- **Added** `applicationProperties`: For application assets, `applicationProperties` now defaults to an empty map if not set

---

#### ai-dial-quickapps-backend `0.9.0-rc.1`

##### Breaking changes

**DIAL files tools are now GA and active regardless of ENABLE_PREVIEW_FEATURES**

The file tools (list, read_lines, search, find, write, edit, delete, copy, move) and the features.dial_files config field are no longer gated by ENABLE_PREVIEW_FEATURES. Any deployment that previously relied on ENABLE_PREVIEW_FEATURES=false to suppress these tools will now have them active unconditionally. The tool_call_result_offload sub-feature remains preview-gated.

| Previous configuration | Required action |
|---|---|
| ENABLE_PREVIEW_FEATURES=false, DIAL files tools were inactive | Verify that activating the DIAL files tools (list, read_lines, search, find, write, edit, delete, copy, move) is acceptable in your environment; these tools are now always enabled regardless of the preview flag |
| ENABLE_PREVIEW_FEATURES=true, DIAL files tools were active | No action required; behavior unchanged |

##### Config / Helm changes

- **Added** `features.dial_files`: Config field for DIAL files tools is now GA and active regardless of ENABLE_PREVIEW_FEATURES. Previously only effective when ENABLE_PREVIEW_FEATURES was enabled.

---

#### ai-dial-core `0.45.0-rc.0`

##### Config / Helm changes

- **Added** `features.reasoningEffortsSupported`: New feature flag to indicate whether a model/deployment supports reasoning efforts.
- **Added** `features.max_tokens / features.max_completion_tokens / features.temperature`: New feature flags to expose max_tokens, max_completion_tokens, and temperature capabilities in model listings.
- **Added** `features (available endpoints flags)`: New flags for available endpoints added to feature listings.
- **Added** `schemas listing — mcp endpoint`: MCP endpoint is now included in schemas listing results.
- **Added** `dial-unified-config (Configuration API / MergedConfigStore / secret encryption)`: New server-side Configuration API introduced with MergedConfigStore and secret encryption support.
- **Added** `model listing — embedding vector dimensions`: Embedding vector dimensions are now exposed in model listing responses.
- **Added** `features listing — reasoning efforts (string array)`: Reasoning efforts are now exposed as a string array in the features listing.
- **Added** `roles — readonly-admin`: New readonly-admin role introduced to allow reading user data without write access.
- **Added** `applications config — MCP server config delivery (schema-less)`: Applications without a schema can now have configuration delivered to their MCP server.

---
