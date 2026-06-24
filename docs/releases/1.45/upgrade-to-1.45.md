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

#### ai-dial-quickapps-backend `0.9.0-rc.1`

## Deployment Changes

### Behavioral changes

> [!NOTE]
> The DIAL files tools have graduated to GA and are now active regardless of `ENABLE_PREVIEW_FEATURES`:
>
> - **DIAL files tools** — `list` / `read_lines` / `search` / `find` / `write` / `edit` / `delete` / `copy` / `move` and the `features.dial_files` config field (#377)
>
> The `tool_call_result_offload` sub-feature (`features.dial_files.tool_call_result_offload`, with its `TOOL_CALL_RESULT_OFFLOAD__*` env defaults) remains preview-gated.

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

