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

Major framework upgrade. Jackson 3 migration is known to have caused at least one regression (image entrypoint/cmd binding). Deployments relying on serialization behavior or Hibernate/Spring internals must be validated.

| Previous configuration | Required action |
|---|---|
| Running on Spring Boot 3.5 with Jackson 2 | Review the full upgrade guide; validate JSON serialization behavior for all entities; check for any custom Spring/Hibernate configuration that may be incompatible with the new versions. |

**OpenTelemetry env vars renamed/removed and default export behavior changed**

OTEL_SDK_DISABLED replaced by OTEL_EXPORT_ENABLED (inverted logic), OTEL_EXPORTER_OTLP_PROTOCOL replaced by OTEL_EXPORTER_OTLP_TRANSPORT, and OTEL_EXPORTER_OTLP_HEADERS removed. OTel export is now OFF by default. Existing telemetry exporters will stop silently if not migrated.

| Previous configuration | Required action |
|---|---|
| OTEL_SDK_DISABLED=false (or unset) to enable telemetry export | Replace with OTEL_EXPORT_ENABLED=true to re-enable export (inverted logic). |
| OTEL_SDK_DISABLED=true to disable telemetry export | Remove the variable; export is now off by default. Optionally set OTEL_EXPORT_ENABLED=false explicitly. |
| OTEL_EXPORTER_OTLP_PROTOCOL set to configure OTLP protocol | Rename to OTEL_EXPORTER_OTLP_TRANSPORT and verify the value is still valid. |
| OTEL_EXPORTER_OTLP_HEADERS set to pass auth/custom headers to OTLP exporter | Variable removed; review the full upgrade guide for the replacement mechanism. |

##### Removed environment variables

| Variable | Description |
|---|---|
| `OTEL_SDK_DISABLED` | Replaced by OTEL_EXPORT_ENABLED with inverted logic. Remove this variable and set OTEL_EXPORT_ENABLED=true if export was previously enabled. |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Replaced by OTEL_EXPORTER_OTLP_TRANSPORT. |
| `OTEL_EXPORTER_OTLP_HEADERS` | Removed with no stated replacement in release notes. Review the full upgrade guide for migration path. |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `OTEL_EXPORT_ENABLED` | `enabled (OTEL_SDK_DISABLED defaulted to false, meaning export was on)` | `false (export is now off by default)` | OpenTelemetry export is now disabled by default. Previously the SDK was enabled by default (OTEL_SDK_DISABLED=false). Must explicitly set OTEL_EXPORT_ENABLED=true to restore export. |

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `OTEL_EXPORT_ENABLED` | `false` | No | Replaces OTEL_SDK_DISABLED with inverted semantics. Set to true to enable OpenTelemetry export. Export is now off by default. |
| `OTEL_EXPORTER_OTLP_TRANSPORT` | — | No | Replaces OTEL_EXPORTER_OTLP_PROTOCOL. Configures the OTLP exporter transport. |

---

#### ai-dial-admin-evaluation-framework-backend `0.1.0-rc.0`

##### Breaking changes

**EvalSummary CSV column-group separator changed from `:` to `::`**

The EvalSummary CSV export now uses `::` to join hierarchical column families instead of `:`. Any downstream consumer that parses exported CSV headers by splitting on `:` must update its parsing logic to split on `::`. Example: `data:prompt` → `data::prompt`, `metric:Accuracy:score` → `metric::Accuracy::score`.

| Previous configuration | Required action |
|---|---|
| CSV header parser splits on single `:` to extract column family and column name | Update parser to split on `::` instead of `:` |

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `TEST_CASE_BULK_MAX_DELETE_IDS` | `10000` | No | Maximum number of IDs accepted in a single bulk-delete-by-IDs request (`DELETE /test-cases:bulk`). Must be ≥ 1. |

---

#### ai-dial-admin-backend `0.18.0-rc.0`

##### Breaking changes

**Flat `applicationTypeSchemaId` field replaced by polymorphic `source` field on ApplicationResourceDto and CreateApplicationResourceDto**

The flat `applicationTypeSchemaId` field has been removed from `ApplicationResourceDto` and `CreateApplicationResourceDto`. It is replaced by a `source` field — a `$type`-discriminated polymorphic object with `schema` and `endpoints` variants. Any API clients, automation, or integration code that reads or writes `applicationTypeSchemaId` must be updated to use the new `source` structure.

| Previous configuration | Required action |
|---|---|
| API payload includes flat `applicationTypeSchemaId` field on ApplicationResourceDto / CreateApplicationResourceDto | Replace `applicationTypeSchemaId` with the new polymorphic `source` field (a `$type`-discriminated object with `schema` and `endpoints` variants) in all API clients and integrations |

##### Config / Helm changes

- **Default changed** `applicationProperties (application assets)`: `null / unset` → `empty map `{}`` — `applicationProperties` for application assets now defaults to an empty map instead of being absent/null.
- **Added** `features.maxTokensSupported`: New configuration property introduced in DIAL Core v0.45.0 support. Defaults to `true`.
- **Added** `features.maxCompletionTokensSupported`: New configuration property introduced in DIAL Core v0.45.0 support.
- **Added** `features.customTemperatureSupported`: New configuration property introduced in DIAL Core v0.45.0 support. Defaults to `true`.
- **Added** `features.reasoningEfforts`: New configuration property introduced in DIAL Core v0.45.0 support.
- **Added** `upstreams.secretExtraData`: New configuration property for upstreams introduced in DIAL Core v0.45.0 support.
- **Added** `models.embeddingDimensions`: New configuration property for models introduced in DIAL Core v0.45.0 support.

---

#### ai-dial-quickapps-backend `0.9.0-rc.1`

##### Breaking changes

**DIAL files tools now active regardless of ENABLE_PREVIEW_FEATURES**

The dial_files tool set (list, read_lines, search, find, write, edit, delete, copy, move) and the features.dial_files config field are no longer gated by ENABLE_PREVIEW_FEATURES. Any deployment that previously relied on ENABLE_PREVIEW_FEATURES=false to suppress these tools will find them active after upgrade. Only the tool_call_result_offload sub-feature remains behind the preview flag.

| Previous configuration | Required action |
|---|---|
| ENABLE_PREVIEW_FEATURES=false — dial_files tools were suppressed | Review whether dial_files tools should be active; if not desired, disable them explicitly via features.dial_files config rather than relying on the preview flag |
| ENABLE_PREVIEW_FEATURES=true — dial_files tools were enabled | No action; behavior unchanged |

##### Config / Helm changes

- **Added** `features.dial_files`: Previously preview-gated config field for DIAL files tools; now GA and active regardless of ENABLE_PREVIEW_FEATURES. The sub-field features.dial_files.tool_call_result_offload (and its TOOL_CALL_RESULT_OFFLOAD__* env defaults) remains preview-gated.
- **Added** `internal_attachments_available_context[].max_depth`: [Preview] New field on folder context config entries that bounds recursion depth when a DIAL folder is attached as a folder context.

---

#### ai-dial-core `0.45.0-rc.0`

##### Config / Helm changes

- **Added** `features.reasoningEffortsSupported`: New feature flag to indicate whether reasoning efforts are supported for a model/deployment.
- **Added** `features.max_tokens / features.max_completion_tokens / features.temperature`: New feature flags to expose max_tokens, max_completion_tokens, and temperature capabilities in model listings.
- **Added** `features.availableEndpoints`: New flags to expose available endpoints per deployment in feature listings.
- **Added** `dial-unified-config (Configuration API / MergedConfigStore / secret encryption)`: New server-side configuration API with merged config store and secret encryption support introduced.
- **Added** `roles.readonly-admin`: New readonly-admin role introduced to allow reading user data without write permissions.

---
