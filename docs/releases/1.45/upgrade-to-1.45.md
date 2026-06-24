# Instructions

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
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

Major framework version jump: Spring Boot 3.5 → 4.0.6, Spring Framework 7, Hibernate 7.2, and Jackson 3. Jackson 3 migration caused a known regression with image entrypoint/cmd binding (fixed in #367). Any custom serialization config or Jackson 2 assumptions will break silently or at runtime.

| Previous configuration | Required action |
|---|---|
| Running on Spring Boot 3.5 / Jackson 2 | Review full upgrade guide at docs/upgrade-plans/0.18.0.md; verify custom Jackson serializers/deserializers are compatible with Jackson 3; test image entrypoint/cmd bindings post-upgrade |

**OpenTelemetry configuration overhaul: env vars renamed/removed and default changed to off**

OTEL_SDK_DISABLED replaced by OTEL_EXPORT_ENABLED (inverted semantics). OTEL_EXPORTER_OTLP_PROTOCOL replaced by OTEL_EXPORTER_OTLP_TRANSPORT. OTEL_EXPORTER_OTLP_HEADERS removed entirely. Export is now off by default. Existing exporters stop silently if not migrated.

| Previous configuration | Required action |
|---|---|
| OTEL_SDK_DISABLED=false (telemetry enabled) | Replace with OTEL_EXPORT_ENABLED=true |
| OTEL_SDK_DISABLED=true (telemetry disabled) | Remove var; export is now off by default (OTEL_EXPORT_ENABLED defaults to off) |
| OTEL_EXPORTER_OTLP_PROTOCOL set to any value | Rename to OTEL_EXPORTER_OTLP_TRANSPORT with equivalent value |
| OTEL_EXPORTER_OTLP_HEADERS set | Variable has been removed; find alternative method to pass OTLP headers per upgrade guide |

##### Removed environment variables

| Variable | Description |
|---|---|
| `OTEL_SDK_DISABLED` | Replaced by OTEL_EXPORT_ENABLED with inverted semantics. Must be migrated or telemetry exporters will stop silently. |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Replaced by OTEL_EXPORTER_OTLP_TRANSPORT. |
| `OTEL_EXPORTER_OTLP_HEADERS` | Removed entirely with no direct replacement mentioned in release notes. Consult upgrade guide. |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `OTEL_EXPORT_ENABLED` | `effectively true (OTEL_SDK_DISABLED defaulted to false, meaning export was on)` | `false (export is now off by default)` | OpenTelemetry export is now disabled by default under the new env var name. |

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `OTEL_EXPORT_ENABLED` | `false` | No | Replaces OTEL_SDK_DISABLED with inverted semantics. Set to true to enable OpenTelemetry export. Off by default. |
| `OTEL_EXPORTER_OTLP_TRANSPORT` | — | No | Replaces OTEL_EXPORTER_OTLP_PROTOCOL for specifying the OTLP transport protocol. |

---

#### ai-dial-admin-evaluation-framework-backend `0.1.0-rc.0`

##### Breaking changes

**EvalSummary CSV column-group separator changed from `:` to `::`**

The EvalSummary CSV export now joins hierarchical column families with `::` instead of a single `:`. For example, `data:prompt` becomes `data::prompt` and `metric:Accuracy:score` becomes `metric::Accuracy::score`. Any downstream consumer that parses exported CSV headers by splitting on `:` must be updated to split on `::`.

| Previous configuration | Required action |
|---|---|
| Consumer splits CSV headers on `:` to parse column families (e.g. `data:prompt`, `metric:Accuracy:score`) | Update CSV header parsing logic to split on `::` instead of `:` (e.g. `data::prompt`, `metric::Accuracy::score`) |

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `TEST_CASE_BULK_MAX_DELETE_IDS` | `10000` | No | Maximum number of IDs accepted in a single bulk-delete-by-IDs request (`DELETE /test-cases:bulk`). Must be ≥ 1. |

---

#### ai-dial-admin-backend `0.18.0-rc.0`

##### Breaking changes

**ApplicationResourceDto and CreateApplicationResourceDto: flat `applicationTypeSchemaId` field replaced with polymorphic `source` field**

The flat string field `applicationTypeSchemaId` on `ApplicationResourceDto` and `CreateApplicationResourceDto` has been removed and replaced with a polymorphic `source` object. The `source` field is `$type`-discriminated with `schema` and `endpoints` variants. Any API clients, automation, or integrations that read or write `applicationTypeSchemaId` will break.

| Previous configuration | Required action |
|---|---|
| API payloads contain flat `applicationTypeSchemaId` string field on ApplicationResourceDto / CreateApplicationResourceDto | Update all API clients, scripts, and integrations to use the new polymorphic `source` field with `$type` discriminator (`schema` or `endpoints` variant) instead of `applicationTypeSchemaId` |

##### Config / Helm changes

- **Default changed** `applicationAssets.applicationProperties`: `null / absent` → `empty map `{}`` — `applicationProperties` for application assets now defaults to an empty map instead of being absent/null.
- **Added** `features.maxTokensSupported`: New DIAL Core v0.45.0 configuration property for model features. Defaults to `true`.
- **Added** `features.maxCompletionTokensSupported`: New DIAL Core v0.45.0 configuration property for model features.
- **Added** `features.customTemperatureSupported`: New DIAL Core v0.45.0 configuration property for model features. Defaults to `true`.
- **Added** `features.reasoningEfforts`: New DIAL Core v0.45.0 configuration property for model features.
- **Added** `upstreams.secretExtraData`: New DIAL Core v0.45.0 configuration property for upstreams.
- **Added** `models.embeddingDimensions`: New DIAL Core v0.45.0 configuration property for models.

---

#### ai-dial-quickapps-backend `0.9.0-rc.1`

##### Breaking changes

**DIAL files tools now active regardless of ENABLE_PREVIEW_FEATURES**

The `list` / `read_lines` / `search` / `find` / `write` / `edit` / `delete` / `copy` / `move` tools and the `features.dial_files` config field are no longer gated by `ENABLE_PREVIEW_FEATURES`. Any deployment that previously relied on `ENABLE_PREVIEW_FEATURES` being unset/false to suppress these tools will now have them active. The `tool_call_result_offload` sub-feature (`features.dial_files.tool_call_result_offload`) remains preview-gated.

| Previous configuration | Required action |
|---|---|
| ENABLE_PREVIEW_FEATURES unset or false — DIAL files tools were inactive | Review whether DIAL files tools should be active. If they must remain disabled, explicitly set `features.dial_files` to disable them in config rather than relying on the preview flag. |
| ENABLE_PREVIEW_FEATURES=true — DIAL files tools were already active | No action required; behavior unchanged. |

##### Config / Helm changes

- **Added** `features.dial_files`: Previously preview-gated, this config field is now GA and active regardless of ENABLE_PREVIEW_FEATURES. Controls the DIAL files tools (list/read_lines/search/find/write/edit/delete/copy/move).

---

#### ai-dial-core `0.45.0-rc.0`

##### Config / Helm changes

- **Added** `features.reasoningEffortsSupported`: New feature flag to indicate whether reasoning efforts are supported by a model/deployment.
- **Added** `features.maxTokensSupported / features.maxCompletionTokensSupported / features.temperatureSupported`: New feature flags to expose max_tokens, max_completion_tokens, and temperature capability indicators in model/deployment listings.
- **Added** `features (available endpoints flags)`: New flags to indicate which endpoints are available for a given deployment/model.
- **Added** `applications[*].mcpEndpoint (schemas listing)`: MCP endpoint is now included in the schemas listing result for applications.
- **Added** `dial-unified-config (Configuration API / MergedConfigStore / secret encryption)`: New server-side unified configuration API introduced, including Configuration API, MergedConfigStore, and secret encryption support.
- **Added** `models[*].embeddingDimensions`: Embedding vector dimensions are now exposed in the model listing response.
- **Added** `models[*].features.reasoningEfforts`: Reasoning efforts exposed as a string array in the features listing.
- **Added** `roles (readonly-admin)`: New readonly-admin role introduced that allows reading user data without write access.
- **Added** `applications[*] / toolsets[*] (admin file-config API)`: Applications and toolsets are now exposed via the admin file-config API.

---
