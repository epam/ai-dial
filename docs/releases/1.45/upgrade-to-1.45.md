# Instructions

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.41.0-rc.0`
   - ai-dial-adapter-openai: `0.41.0-rc.0`
   - ai-dial-adapter-vertexai: `0.37.0-rc.0`
   - ai-dial-adapter-dial: `0.16.0-rc.0`
   - ai-dial-chat-themes: `0.16.0`
   - ai-dial-chat: `0.47.0-rc.0`
   - ai-dial-core: `0.45.0-rc.0`
   - ai-dial-analytics-realtime: `0.25.0-rc.0`
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

Major framework version bumps: Spring Boot 3.5 → 4.0.6, Spring Framework 7, Hibernate 7.2, and Jackson 3. JSON serialization behavior may differ. A known regression with image entrypoint/cmd binding from container config blob was fixed in this release, but other serialization differences may exist.

| Previous configuration | Required action |
|---|---|
| Running on Spring Boot 3.5 / Jackson 2 | Review upgrade guide for full list of framework-level migration steps before upgrading. Verify any custom Jackson configuration or serialization expectations. |

**OpenTelemetry env vars renamed/removed and default changed: telemetry export is now OFF by default**

Three breaking changes to OpenTelemetry configuration: (1) OTEL_SDK_DISABLED replaced by OTEL_EXPORT_ENABLED with inverted semantics; (2) OTEL_EXPORTER_OTLP_PROTOCOL replaced by OTEL_EXPORTER_OTLP_TRANSPORT; (3) OTEL_EXPORTER_OTLP_HEADERS removed entirely. The default for telemetry export flipped to disabled. Existing deployments relying on telemetry will silently stop exporting until migrated.

| Previous configuration | Required action |
|---|---|
| OTEL_SDK_DISABLED=false (telemetry enabled) | Remove OTEL_SDK_DISABLED and set OTEL_EXPORT_ENABLED=true |
| OTEL_SDK_DISABLED=true (telemetry disabled) | Remove OTEL_SDK_DISABLED; OTEL_EXPORT_ENABLED defaults to off so no additional action needed |
| OTEL_EXPORTER_OTLP_PROTOCOL set to any value | Rename to OTEL_EXPORTER_OTLP_TRANSPORT with equivalent value |
| OTEL_EXPORTER_OTLP_HEADERS set | Remove OTEL_EXPORTER_OTLP_HEADERS; consult upgrade guide for replacement mechanism if headers are required |

##### Removed environment variables

| Variable | Description |
|---|---|
| `OTEL_SDK_DISABLED` | Replaced by OTEL_EXPORT_ENABLED with inverted logic. Must be migrated or telemetry export will silently stop. |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Replaced by OTEL_EXPORTER_OTLP_TRANSPORT. |
| `OTEL_EXPORTER_OTLP_HEADERS` | Removed with no direct replacement mentioned in release notes. Consult upgrade guide for alternative. |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `OTEL_EXPORT_ENABLED` | `enabled (previously controlled by OTEL_SDK_DISABLED which defaulted to SDK on)` | `false (off by default)` | OpenTelemetry export is now disabled by default. Previously the SDK was enabled unless OTEL_SDK_DISABLED was set. |

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `OTEL_EXPORT_ENABLED` | `false` | No | Replaces OTEL_SDK_DISABLED with inverted semantics. Set to true to enable OpenTelemetry export. Default is now off. |
| `OTEL_EXPORTER_OTLP_TRANSPORT` | — | No | Replaces OTEL_EXPORTER_OTLP_PROTOCOL. Configure the OTLP exporter transport protocol. |

---

#### ai-dial-admin-evaluation-framework-backend `0.1.0-rc.0`

##### Breaking changes

**EvalSummary CSV export column-group separator changed from `:` to `::`**

The separator used between hierarchical column families in exported CSV headers has changed. For example: `data:prompt` → `data::prompt`, `metric:Accuracy:score` → `metric::Accuracy::score`. Any downstream consumers or scripts that parse CSV headers by splitting on `:` will break and must be updated to split on `::`.

| Previous configuration | Required action |
|---|---|
| CSV header parsing splits on `:` (e.g. `data:prompt`, `metric:Accuracy:score`) | Update all CSV consumers/parsers to split on `::` instead of `:` |

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `TEST_CASE_BULK_MAX_DELETE_IDS` | `10000` | No | Maximum number of IDs accepted in a single bulk-delete-by-IDs request (`DELETE /test-cases:bulk`). Must be ≥ 1. |

---

#### ai-dial-chat `0.47.0-rc.0`

##### Breaking changes

**NEXT_PUBLIC_USE_MD_SIDEBAR_OVERLAY_BREAKPOINT removed; must migrate to feature flag**

The build-time env var NEXT_PUBLIC_USE_MD_SIDEBAR_OVERLAY_BREAKPOINT has been removed. Overlay deployments that relied on it must now enable the runtime feature flag `md-sidebar-overlay-breakpoint` via `ENABLED_FEATURES` or `ChatOverlayOptions.enabledFeatures`.

| Previous configuration | Required action |
|---|---|
| NEXT_PUBLIC_USE_MD_SIDEBAR_OVERLAY_BREAKPOINT was set at build time to enable the md sidebar overlay breakpoint | Remove the build-time env var and add `md-sidebar-overlay-breakpoint` to `ENABLED_FEATURES` or `ChatOverlayOptions.enabledFeatures` at runtime |

**Overlay API routes now reject expired/invalid sessions with 401 at Chat layer instead of proxying to DIAL Core**

With IS_IFRAME=true, expired or invalid sessions are now rejected with HTTP 401 at the Chat layer. Previously, stale bearer tokens were proxied to DIAL Core. Standard overlay usage is unaffected but any custom code or clients that expected DIAL Core to handle token validation errors will now receive 401 from Chat directly.

| Previous configuration | Required action |
|---|---|
| Overlay (IS_IFRAME=true) with expired/invalid sessions: stale bearer tokens were proxied to DIAL Core, which returned spurious 401s | No action for standard deployments; verify any custom overlay clients handle 401 responses at the Chat layer correctly |

##### Removed environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_USE_MD_SIDEBAR_OVERLAY_BREAKPOINT` | Replaced by the runtime `md-sidebar-overlay-breakpoint` feature flag; enable it via `ENABLED_FEATURES` or `ChatOverlayOptions.enabledFeatures`. |

##### Deprecated environment variables

| Variable | Description |
|---|---|
| `QUICK_APPS_MODEL` | Quick Apps now take the default model from the schema; QUICK_APPS_MODEL is kept only as a fallback when the schema does not specify one. Replaced by `Quick App 2 schema default model`. |

**Migration:** _QUICK_APPS_MODEL set to specify default model for Quick Apps_ → Define the default model in the Quick App 2 schema instead; keep QUICK_APPS_MODEL only as a temporary fallback until schema is updated

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `AVAILABLE_LOCALES` | `Auto-detected from `public/locales` at build time, falls back to `en`` | No | Comma-separated list of locale codes to enable at runtime. Use this when locales are injected after the image is built. |
| `ADDITIONAL_CSS_DIR` | `<cwd>/additional_css` | No | Absolute path to a directory of .css files injected into every page. See Theme Customization docs. |
| `AUTH_ADDITIONAL_PARAMS` | — | No | JSON array of key/value objects appended to the body of both the initial and refresh OAuth token exchanges. Example: `[{"organization_id":"some-id"},{"tenant_id":"some other id"}]`. Needed by Auth0 deployments that require organization_id / tenant_id on /oauth/token. |

---

#### ai-dial-admin-backend `0.18.0-rc.0`

##### Breaking changes

**ApplicationResourceDto and CreateApplicationResourceDto: flat `applicationTypeSchemaId` field replaced by polymorphic `source` field**

The flat string field `applicationTypeSchemaId` on `ApplicationResourceDto` and `CreateApplicationResourceDto` has been removed and replaced with a polymorphic `source` object. The `source` field is `$type`-discriminated with `schema` and `endpoints` variants. Any API client, integration, or tooling that reads or writes `applicationTypeSchemaId` must be updated to use the new `source` structure.

| Previous configuration | Required action |
|---|---|
| API payloads include a flat `applicationTypeSchemaId` string field on ApplicationResourceDto / CreateApplicationResourceDto | Replace `applicationTypeSchemaId` with the appropriate `source` object using the `$type` discriminator (`schema` or `endpoints` variant) in all API clients, scripts, and stored payloads before upgrading |

##### Config / Helm changes

- **Default changed** `applicationAssets.applicationProperties`: `unset / null` → `empty map `{}`` — Application assets now default `applicationProperties` to an empty map instead of being absent/null.
- **Added** `features.maxTokensSupported`: New configuration property introduced in DIAL Core v0.45.0 support. Defaults to `true`.
- **Added** `features.maxCompletionTokensSupported`: New configuration property introduced in DIAL Core v0.45.0 support.
- **Added** `features.customTemperatureSupported`: New configuration property introduced in DIAL Core v0.45.0 support. Defaults to `true`.
- **Added** `features.reasoningEfforts`: New configuration property introduced in DIAL Core v0.45.0 support.
- **Added** `upstreams.secretExtraData`: New configuration property for upstreams introduced in DIAL Core v0.45.0 support.
- **Added** `models.embeddingDimensions`: New configuration property for models introduced in DIAL Core v0.45.0 support.

---

#### ai-dial-quickapps-backend `0.9.0-rc.1`

##### Breaking changes

**DIAL files tools are now active regardless of ENABLE_PREVIEW_FEATURES**

The dial_files tool group (list / read_lines / search / find / write / edit / delete / copy / move) and the features.dial_files config field are no longer gated by ENABLE_PREVIEW_FEATURES. Any deployment that had ENABLE_PREVIEW_FEATURES disabled but relies on those tools being inactive will now have them active. Conversely, deployments that enabled ENABLE_PREVIEW_FEATURES solely to use these tools no longer need to do so. The tool_call_result_offload sub-feature (features.dial_files.tool_call_result_offload and its TOOL_CALL_RESULT_OFFLOAD__* env defaults) remains behind the preview flag.

| Previous configuration | Required action |
|---|---|
| ENABLE_PREVIEW_FEATURES=false (or unset) — DIAL files tools were inactive | Review whether exposing DIAL files tools to end users is acceptable. If not, disable them via features.dial_files config rather than relying on the preview gate. |
| ENABLE_PREVIEW_FEATURES=true — DIAL files tools were active | No change in behavior. Verify ENABLE_PREVIEW_FEATURES is still needed for other preview features; if DIAL files was the only reason, it can be removed (but removing it will deactivate tool_call_result_offload). |

##### Config / Helm changes

- **Added** `features.dial_files`: Config field for the DIAL files tool group is now GA and active regardless of ENABLE_PREVIEW_FEATURES. Previously only respected when ENABLE_PREVIEW_FEATURES was enabled.

---

#### ai-dial-core `0.45.0-rc.0`

##### Config / Helm changes

- **Added** `reasoningEffortsSupported`: New feature flag to indicate whether a model/deployment supports reasoning efforts.
- **Added** `features.max_tokens / features.max_completion_tokens / features.temperature`: New feature flags to expose max_tokens, max_completion_tokens, and temperature capability indicators in model listings.
- **Added** `features.endpoints (available endpoints flags)`: New flags to expose which endpoints are available for a deployment.
- **Added** `dial-unified-config (Configuration API / MergedConfigStore / secret encryption)`: New server-side Configuration API with MergedConfigStore and secret encryption support introduced.

---
