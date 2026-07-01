# Instructions

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.41.0`
   - ai-dial-adapter-openai: `0.41.0`
   - ai-dial-adapter-vertexai: `0.37.0`
   - ai-dial-adapter-dial: `0.16.0`
   - ai-dial-chat-themes: `0.17.0`
   - ai-dial-chat: `0.47.0`
   - ai-dial-core: `0.45.0-rc.2`
   - ai-dial-analytics-realtime: `0.25.0`
   - ai-dial-rag: `0.42.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.9.0`
   - ai-dial-mind-map-backend: `0.14.1`
   - ai-dial-mind-map-frontend: `0.13.0`
   - ai-dial-admin-backend: `0.18.0`
   - ai-dial-admin-frontend: `0.18.0`
   - ai-dial-admin-deployment-manager-backend: `0.18.0`
   - ai-dial-admin-evaluation-framework-backend: `0.1.0`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

#### ai-dial-admin-deployment-manager-backend `0.18.0`

> [!CAUTION]
> This release includes high-priority changes. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.18.0-rc.1/docs/upgrade-plans/0.18.0.md) before proceeding.

##### Breaking changes

**Spring Boot upgraded to 4.0.6 (Spring Framework 7, Hibernate 7.2) with Jackson 3 JSON serialization**

Major framework version bumps: Spring Boot 3.5 → 4.0.6, Spring Framework 7, Hibernate 7.2, and Jackson 3. JSON serialization behavior may differ. A known regression with image entrypoint/cmd binding from container config blob was fixed in this release, but other serialization differences may exist.

| Previous configuration | Required action |
|---|---|
| Running on Spring Boot 3.5 / Jackson 2 | Review upgrade guide for full list of framework-level migration steps before upgrading. Verify any custom Jackson configuration or serialization expectations. |

**Deployment & Scaling — Chained Text-Classification Transformer**
> `INFERENCE_TEXT_CLASSIFICATION_TRANSFORMER_IMAGE` has **no default and must be set** before any text-classification model can be deployed. If a text-classification model is detected and the image is unset, the deploy **fails fast with HTTP 5xx**. Set it now if you intend to serve text-classification models; other inference types are unaffected.

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
| `INFERENCE_TEXT_CLASSIFICATION_TRANSFORMER_IMAGE`         | -       | Yes for chained deployments   | Transformer container image. Deploy fails fast if unset for chained mode. |
| `INFERENCE_TEXT_CLASSIFICATION_TRANSFORMER_CPU_REQUEST`   | `100m`  | No                            | CPU request for the transformer container.           |
| `INFERENCE_TEXT_CLASSIFICATION_TRANSFORMER_MEMORY_REQUEST`| `256Mi` | No                            | Memory request for the transformer container.        |
| `INFERENCE_TEXT_CLASSIFICATION_TRANSFORMER_CPU_LIMIT`     | `500m`  | No                            | CPU limit for the transformer container.             |
| `INFERENCE_TEXT_CLASSIFICATION_TRANSFORMER_MEMORY_LIMIT`  | `512Mi` | No                            | Memory limit for the transformer container.          |

---

#### ai-dial-admin-evaluation-framework-backend `0.1.0`

### New environment variables

| Variable | Default | Description |
|---|---|---|
| `TEST_CASE_BULK_MAX_DELETE_IDS` | `10000` | Maximum number of IDs accepted in a single bulk-delete-by-IDs request (`DELETE /test-cases:bulk`). Required: No. |

### Behavioral changes
> [!NOTE]
> On upgrade, the migration converts every existing test suite's inline test cases into a **private-scoped dataset**. Each suite gets its own new `PRIVATE` dataset (created with the suite's UUID and named `DATASET_<suite name>`), and all of that suite's test cases are rebound to it — one dataset per suite, not shareable until explicitly made `PUBLIC`. Per-test-case `is_enabled` state is preserved as the suite's `disabled_test_case_ids`; the `request_template_override` and `input_bindings_override` columns are dropped (values discarded), and any in-flight revalidation tasks are marked `FAILED` and must be resubmitted against the new dataset.
- **Test-case migration** — all test cases within existing test suites are migrated to private-scoped datasets (one private dataset per suite) (`V1.22`, initial commit `ab5d0b3`)

> [!NOTE]
> The EvalSummary CSV export now joins hierarchical column families with `::` instead of a single `:` (e.g. `data:prompt` → `data::prompt`, `metric:Accuracy:score` → `metric::Accuracy::score`). Consumers that parse exported CSV headers by splitting on `:` must update to split on `::`.
- **CSV export** — column-family separator `:` → `::` (#62)

---

#### ai-dial-chat `0.47.0`

### New environment variables

| Variable | Default | Description |
|---|---|---|
| `AVAILABLE_LOCALES` | Auto-detected from `public/locales` at build time, falls back to `en` | Comma-separated list of locale codes to enable at runtime. Use this when locales are injected after the image is built. |
| `ADDITIONAL_CSS_DIR` | `<cwd>/additional_css` | Absolute path to a directory of `.css` files injected into every page. See [Theme Customization](../../docs/THEME-CUSTOMIZATION.md#additional-css). |
| `AUTH_ADDITIONAL_PARAMS` | (none) | JSON array of key/value objects appended to the body of both the initial and refresh OAuth token exchanges. Example: `[{"organization_id":"some-id"},{"tenant_id":"some other id"}]`. |

### Deprecated environment variables

> [!CAUTION]
> Still works, but will be removed in future versions.

| Variable | Replacement | Description |
|---|---|---|
| `QUICK_APPS_MODEL` | Quick App 2 schema default model | Quick Apps now take the default model from the schema; `QUICK_APPS_MODEL` is kept only as a fallback when the schema does not specify one (Issue #6807) (#6963). |

### Removed environment variables

| Variable | Reason |
|---|---|
| `NEXT_PUBLIC_USE_MD_SIDEBAR_OVERLAY_BREAKPOINT` | Replaced by the runtime `md-sidebar-overlay-breakpoint` feature flag; enable it via `ENABLED_FEATURES` or `ChatOverlayOptions.enabledFeatures` (Issue #6980) (#6984). |

### New feature flags

| Flag | Description |
|---|---|
| `md-sidebar-overlay-breakpoint` | Use the `md` (768px) instead of `xl` (1280px) sidebar-overlay breakpoint in iframe embeds. |
| `compare-mode-disabled` | Disable compare mode (sidebar button and conversation context menu). Enabled by default. |
| `marketplace-hide-my-apps` | Hide user-created and shared-with-me entities in the Marketplace. |

### Behavioral changes

> [!NOTE]
> Overlay API routes now validate sessions strictly. With `IS_IFRAME=true`, expired or invalid sessions are rejected with `401` at the Chat layer rather than proxied to DIAL Core. Standard overlay usage is unaffected and behaves better after OAuth token refresh.

- **Overlay strict session validation** — `validateServerSession()` and refresh-aware token resolution (Issue #6887) (#6888)

### New environment variables

| Variable | Default | Description |
|---|---|---|
| `AUTH_FORCE_STRICT` | `false` | When set to `true`, authentication is enforced even if no auth providers are configured. By default the app disables authentication when no providers are present; setting this variable to `true` prevents that fallback and keeps authentication required. |

---

#### ai-dial-quickapps-backend `0.9.0`

### New environment variables

| Variable                                       | Default    | Description                                                                                                                                                                                                                                                                            |
|------------------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `DEFAULT_STAGE_DISPLAY_LEVEL`                  | unset      | Deployment-wide override for the stage visibility threshold (`error`, `info`, `debug`; case-insensitive). When set, wins over every app's `features.stage_display.level`. Unset defers to the per-app config (which defaults to `info`).                                                |
| `EXTERNAL_URL_FETCH_ENABLED`                   | `false`    | Admin cap on fetching external (non-DIAL) URLs. When `false`, no app may fetch external URLs regardless of its manifest; the deployment-handoff branch (deployments with `features.url_attachments`) is unaffected. Apps can opt out per-app via `features.external_url_fetch.enabled`. |
| `EXTERNAL_URL_FETCH_HOST_ALLOWLIST`            | —          | Comma-separated allowlist of host patterns for external URL fetches. Unset means no admin-level host restriction. Patterns: exact host (`example.com`) or `*.example.com`. Re-checked on every redirect hop. Per-app `features.external_url_fetch.host_allowlist` narrows (intersection). |
| `EXTERNAL_URL_FETCH_MAX_REDIRECTS`             | `5`        | Maximum HTTP redirects on external URL fetches (`0 ≤ x ≤ 10`). Each hop is SSRF-checked.                                                                                                                                                                                               |
| `EXTERNAL_URL_FETCH_CONNECT_TIMEOUT_SECONDS`   | `5.0`      | TCP connect timeout (seconds, `> 0`) for external URL fetches. Read/write/pool timeouts use the resolved tool timeout.                                                                                                                                                                 |
| `TOOL_CALL_RESULT_OFFLOAD__ENABLED_BY_DEFAULT` | `true`     | Default value of the per-app `enabled` flag (`features.dial_files.tool_call_result_offload.enabled`); apps set `enabled: false` to disable offload.                                                                                                                                    |
| `TOOL_CALL_RESULT_OFFLOAD__SIZE_THRESHOLD`     | `40000`    | Default byte threshold above which a tool-call response is offloaded to a DIAL file. Apps override per-app via `features.dial_files.tool_call_result_offload.size_threshold`.                                                                                                           |
| `TOOL_CALL_RESULT_OFFLOAD__EXCLUDED_TOOLS`     | `[]`       | Default JSON list of **additional** tool names exempt from offloading. The read-back tools (`internal_file_read_lines`, `internal_file_search`) are always excluded so a read-back slice is never re-offloaded. Apps add more per-app.                                                  |

### Behavioral changes

> [!NOTE]
> The DIAL files tools have graduated to GA and are now active regardless of `ENABLE_PREVIEW_FEATURES`:
>
> - **DIAL files tools** — `list` / `read_lines` / `search` / `find` / `write` / `edit` / `delete` / `copy` / `move` and the `features.dial_files` config field (#377)
>
> The `tool_call_result_offload` sub-feature (`features.dial_files.tool_call_result_offload`, with its `TOOL_CALL_RESULT_OFFLOAD__*` env defaults) remains preview-gated.

---

#### ai-dial-admin-backend `0.18.0`

##### Breaking changes

**API: flat `applicationTypeSchemaId` field replaced with polymorphic `source` field on ApplicationResourceDto**

The `applicationTypeSchemaId` field on `ApplicationResourceDto` and `CreateApplicationResourceDto` has been removed and replaced with a polymorphic `source` field. The `source` field is a `$type`-discriminated object with `schema` and `endpoints` variants. Any API clients, automation scripts, or integrations that read or write `applicationTypeSchemaId` must be updated to use the new `source` structure.

| Previous configuration | Required action |
|---|---|
| API payloads use flat `applicationTypeSchemaId` field on ApplicationResourceDto / CreateApplicationResourceDto | Update all API clients, scripts, and integrations to use the polymorphic `source` field with `$type` discriminator (`schema` or `endpoints` variant) instead of `applicationTypeSchemaId` |

---

#### ai-dial-mind-map-backend `0.14.1`

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `PUBLIC_URL` | — | No | New public_url support added. Operator may need to configure this value depending on deployment topology. |

---
