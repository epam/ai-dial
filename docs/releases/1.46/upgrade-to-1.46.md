# Instructions

## Versions

1. Helm chart versions:
   - dial: `7.1.0`
   - dial-core: `6.0.0`
   - dial-extension: `3.1.1`
   - dial-admin: `0.17.0`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.42.0`
   - ai-dial-adapter-openai: `0.42.0`
   - ai-dial-adapter-vertexai: `0.38.0`
   - ai-dial-adapter-dial: `0.17.1`
   - ai-dial-chat-themes: `0.18.0`
   - ai-dial-chat: `0.48.0`
   - ai-dial-core: `0.46.0`
   - ai-dial-analytics-realtime: `0.26.0`
   - ai-dial-rag: `0.42.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.10.0`
   - ai-dial-mind-map-backend: `0.14.2`
   - ai-dial-mind-map-frontend: `0.13.0`
   - ai-dial-admin-backend: `0.19.0`
   - ai-dial-admin-frontend: `0.19.0`
   - ai-dial-admin-deployment-manager-backend: `0.19.0`
   - ai-dial-admin-evaluation-framework-backend: `0.2.0`
   - ai-dial-admin-evaluation-metrics: `0.1.0`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

#### ai-dial-admin-deployment-manager-backend `0.19.0`
> [!IMPORTANT]
> If you use the Deployment Manager metrics functionality (`METRICS_SCRAPE_ENABLED`, including resource usage via `METRICS_SCRAPE_RESOURCE_USAGE_ENABLED`), a [metrics-server](https://github.com/kubernetes-sigs/metrics-server) must be installed in the cluster. Without it, resource metrics (`metrics.k8s.io`) requests from the Deployment Manager will fail.
> 
This release includes **high-priority changes**. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.19.0-rc.0/docs/upgrade-plans/0.19.0.md) before proceeding.

This release includes **high-priority changes**. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.19.0/docs/upgrade-plans/0.19.0.md) before proceeding.

---

#### ai-dial-admin-evaluation-framework-backend `0.2.0`

### Database migrations
> [!NOTE]
> Flyway applies these automatically on startup; the service account needs DDL privileges on both schemas. All migrations in this release are additive (new tables, columns, and a stored function).
- **meta** — `V1.23__AddOverallScoreToTestSuites.sql` — adds the `overall_score` JSONB column to `test_suites` (#68)
- **meta** — `V1.24__AddTestCaseFilterToTestSuites.sql` — adds the `test_case_filter` JSONB column to `test_suites` (#74)
- **meta** — `V1.25__AddOverallScoreThresholdToTestSuites.sql` — adds the `overall_score_threshold` column to `test_suites` (#94)
- **analytics** — `V1.10__CreateMetricScoreResultTable.sql` — new `metric_score_result` table backing Phase-3 metric-score statistics (#68)
- **analytics** — `V1.11__CreateRocAucScoreFunction.sql` — `roc_auc_score(double precision[], double precision[])` stored function for the `roc_auc` DSL function (#75)
- **analytics** — `V1.12__AddSuiteAndTimestampToMetricScoreResult.sql` — adds `test_suite_id` and `computed_at_ms` to `metric_score_result` (#78)

---

#### ai-dial-admin-evaluation-metrics `0.1.0`

### New environment variables

|Variable|Default|Description|
|---|---|---|
|`LOG_LEVEL`|`INFO`|Log level. Allowed values: `CRITICAL`, `ERROR`, `WARNING`, `INFO`, `DEBUG`.|
|`LOG_LEVEL_OVERRIDE`|`{}`|Per-module log-level overrides as a JSON dict (e.g. `{"uvicorn.access":"INFO"}`).|
|`DIAL_URL`|*Required*|Base URL of the DIAL API endpoint, used for all LLM and embeddings calls. Startup fails if unset.|
|`DIAL_API_KEY`|*Empty*|API key for the DIAL instance. Required for any LLM- or embeddings-based metric; without it only non-LLM metrics (`exact_match`, `regex_match`, `deepdiff`) work.|
|`EVAL__APP__MAX_CONCURRENT_EVALUATIONS`|`10`|Maximum evaluation requests processed concurrently; requests beyond the limit are queued.|
|`EVAL__APP__MAX_QUEUE_BACKLOG`|`100`|Maximum requests allowed to wait in the queue; requests arriving when full are rejected.|
|`EVAL__METRICS__COMMON__SUPPORTED_MODELS`|`gemini-2.5-flash-lite`, `gpt-5-nano-2025-08-07`, `anthropic.claude-haiku-4-5-20251001-v1:0`, `gemini-3.1-flash-lite-preview`, `gpt-5-mini-2025-08-07`, `gpt-5.4-mini-2026-03-17`|Default DIAL LLM deployments offered across all LLM-based metric groups; shown in the DIAL Admin metrics-configuration UI.|
|`EVAL__METRICS__COMMON__DEFAULT_MODEL`|`gemini-3.1-flash-lite-preview`|Default LLM deployment when none is specified in a request; must be in the supported-models list.|
|`EVAL__METRICS__DEEPEVAL__SUPPORTED_MODELS`|*from common*|Overrides the supported-models list for DeepEval metrics only.|
|`EVAL__METRICS__DEEPEVAL__DEFAULT_MODEL`|*from common*|Overrides the default model for DeepEval metrics only.|
|`EVAL__METRICS__DEEPEVAL__VERBOSE_MODE`|`false`|When enabled, DeepEval prints intermediate evaluation steps to stdout; does not affect API responses.|
|`EVAL__METRICS__AIDIAL_RAG_EVAL__SUPPORTED_MODELS`|*from common*|Overrides the supported-models list for aidial-rag-eval metrics only.|
|`EVAL__METRICS__AIDIAL_RAG_EVAL__DEFAULT_MODEL`|*from common*|Overrides the default model for aidial-rag-eval metrics only.|
|`EVAL__METRICS__AIDIAL_RAG_EVAL__MAX_CONCURRENCY`|`8`|Maximum parallel internal LLM calls made by aidial-rag-eval metrics during a single evaluation.|
|`EVAL__METRICS__RAGAS__SUPPORTED_MODELS`|*from common*|Overrides the supported-models list for Ragas metrics only.|
|`EVAL__METRICS__RAGAS__DEFAULT_MODEL`|*from common*|Overrides the default model for Ragas metrics only.|
|`EVAL__METRICS__RAGAS__EMBEDDINGS_MODEL`|`text-embedding-ada-002`|DIAL embeddings deployment used by Ragas metrics that need semantic similarity (e.g. `ragas.answer_relevancy`).|

> [!NOTE]
> OpenTelemetry configuration is supported via the standard `OTEL_*` environment variables. See the [OpenTelemetry SDK configuration docs](https://opentelemetry.io/docs/languages/sdk-configuration/general/).

---

#### ai-dial-admin-frontend `0.19.0`

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `ANALYTICS_ENABLED` | — | No | Gates the [Preview] Analytics features — Query Builder (visual/SQL queries, AI assistant, charts) and Analytics Tables. Must be set to enable these features. |
| `CODE_APP_EDITOR_URL` | — | No | Used to surface the new `Code App` source type for Applications — shown when an Endpoints application's `endpoint` and `editorUrl` both match this value. |
| `DIAL_CORE_API_URL` | — | Yes | Publications and other Core-direct clients (buckets, files, assets, toolset ops, external-service sign-in, query assistant) call DIAL Core directly forwarding the user JWT. These features fail if unset. |

---

#### ai-dial-chat `1.0.0-rc.2`

### New environment variables

| Variable | Required | Description | Available Values | Default values |
|---|---|---|---|---|
| `ALLOWED_IMAGE_SOURCES` | No | Whitespace-separated list of origins/hosts permitted to load images. External images in markdown are blocked by default (CSP `img-src`) to prevent data exfiltration; add any external origin that legitimately serves icons, avatars, or theme images. Same-origin, `data:`, `blob:`, and the `THEMES_CONFIG_HOST` origin are always allowed. | Any origin valid format. List of space separated URLs/hosts. | `'self' data: blob: THEMES_CONFIG_HOST` |
| `QUICK_APPS_SCHEMA_2_ID` | No | `applicationTypeSchemaId` for the Quick App v2 application type. | Any string | *(empty)* |

> [!NOTE]
> 2.0 resolves all runtime configuration server-side in `apps/chat-api`; the frontend reads none of these directly. The full env-var surface (including the per-provider auth tables and archive limits) lives in `apps/chat-api/README.md` and `docs/environment-variables-migration-guide.md`. The key operator-facing variables are listed below.

### Environment variables

| Variable                          | Default                        | Description                                                                                          |
| --------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `DIAL_CORE_URL`                   | — (required)                   | Internal DIAL Core service URL, never exposed to clients                                             |
| `DIAL_CORE_EXTERNAL_URL`          | —                              | Public DIAL Core URL browsers can reach, used to build client-side MCP endpoint links                |
| `DIAL_API_VERSION`                | `2024-10-21`                   | API version query parameter sent to DIAL Core (#6996)                                                |
| `DIAL_API_KEY`                    | —                              | Server-only key for utility-model tasks; not used for user-scoped routes                             |
| `DEFAULT_DEPLOYMENT`              | —                              | Default deployment shown to users without a persisted selection                                      |
| `FEATURED_MODEL_IDS`              | `[]`                           | Comma-separated model/application IDs marked featured in the catalog (#7322)                         |
| `HIDDEN_ENTITY_TAGS`              | `[]`                           | Comma-separated tags that hide catalog entities while keeping them visible in the Quick App 2.0 form (#7324) |
| `ALLOWED_IFRAME_ORIGINS`          | `[]`                           | Origins allowed to embed / be embedded (CSP `frame-src`); required for Quick Apps editors and the overlay (#7711) |
| `OVERLAY_ENABLED`                 | `false`                        | Enables the chat-overlay embedded runtime (has no effect unless an origin is also allowlisted)       |
| `FILE_MANAGER_AVAILABLE_TABS`     | `my_files,shared,organization` | Comma-separated subset controlling which File Manager tabs are shown                                  |
| `ASR_MODEL`                       | —                              | Deployment ID of a dedicated speech-to-text model for transcription                                  |
| `UTILITY_MODEL`                   | —                              | Deployment ID of a utility model for server-side tasks such as conversation naming                   |
| `LLM_CONVERSATION_NAMING_ENABLED` | `false`                        | Auto-rename conversations after the first assistant reply (with `UTILITY_MODEL` + `DIAL_API_KEY`)    |
| `LOG_LEVEL`                       | environment-dependent          | Minimum backend log level: `debug`, `log`, `warn`, or `error` (#7857)                                |

### New feature flags

| Flag                              | Description                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `features.asrEnabled`             | ASR transcription; derived from `ASR_MODEL` presence, restrict to roles via `ASR_ENABLED_ROLES`                                       |
| `features.llmConversationNaming`  | LLM conversation naming; requires `UTILITY_MODEL` + `DIAL_API_KEY` + `LLM_CONVERSATION_NAMING_ENABLED=true`                            |
| `features.liveChatInteraction`    | Interactive toolset sign-in mid-completion; toggled via `LIVE_CHAT_INTERACTION_ENABLED` (restrict via `LIVE_CHAT_INTERACTION_ENABLED_ROLES`) |

### New environment variables

| Variable                             | Default              | Description                                                                                                                       |
| ------------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `CONVERSATION_BODY_SIZE_LIMIT_BYTES` | `10485760` (10 MB)   | Maximum JSON request-body size (in bytes) the API accepts; raised above the framework default so large conversations can be saved |
| `OVERLAY_SANDBOX_ENABLED`            | `false`              | Serves the overlay sandbox static app at `/overlay-sandbox/`; intended for development/test environments only                     |

### Behavioral changes

> [!NOTE]
> Security response headers change on upgrade: the Chat backend now sends `Cross-Origin-Opener-Policy: same-origin-allow-popups` instead of Helmet's `same-origin` default so toolset OAuth popups keep their opener reference. Frameguard / `frame-ancestors` framing behavior is unchanged.

- COOP header relaxed to `same-origin-allow-popups` to support the toolset OAuth popup flow (#8036)

### New environment variables

| Variable                  | Default  | Description                                                                                                                                                                                                                    |
| ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ANNOUNCEMENT_HTML_MESSAGE` | (unset) | Operator-authored HTML shown in a dismissible top-of-app announcement banner; unset/empty hides it. Allowed tags: `a`, `b`, `strong`, `em`, `br`, `span`. Dismissal is keyed by message text, so changing the value re-shows the banner. |

### Behavioral changes

> [!NOTE]
> The default HTTP server port changed from `3005` to `5000`. Deployments that rely on the default (container port mappings, reverse-proxy upstreams, `AUTH_CALLBACK_BASE_URL`, health checks) must be updated; the image's `EXPOSE` is now `5000`.

- Default `PORT` changed `3005` → `5000` — the `.env.template`, `AUTH_CALLBACK_BASE_URL` example, and Docker `EXPOSE` were updated to match (#8053)

---

#### ai-dial-quickapps-backend `0.10.0`

### New environment variables

| Variable                    | Default                                                          | Description                                                                                                                                                                                                                     |
|-----------------------------|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `APP_SCHEMA_ID`             | `https://mydial.epam.com/custom_application_schemas/quickapps2`  | Full application-type schema `$id` emitted in the generated app schema. Override for DIAL installations using a different hostname or schema name; when unset, the built-in default is kept for backward compatibility.          |
| `DIAL_SDK_LOG_FORMAT`       | `text`                                                          | Console log output format: `text` (human-readable) or `json` (escape-safe, one record per line). See `docs/logging.md`.                                                                                                        |
| `DIAL_SDK_TEXT_LOG_FORMAT`  | *(built-in format)*                                             | Custom `%`-style format string for `text` output. Unset keeps the built-in format with the conditional OTEL trace block.                                                                                                       |
| `DIAL_SDK_JSON_LOG_FORMAT`  | *(built-in template)*                                           | Custom template for `json` output — a JSON document whose string leaves are `%`-style format strings, escaped via `json.dumps`.                                                                                                |
| `LOG_PAYLOADS`              | `false`                                                        | Emit payload content (message bodies, tool-call arguments, tool/LLM response bodies) at DEBUG. When `false`, no payload content is logged at **any** level and `openai`/`httpx`/`httpcore` are capped at INFO. Local development only. |
| `LOG_PAYLOADS_MAX_LENGTH`   | `2000`                                                         | Per-field character cap applied to each payload value when `LOG_PAYLOADS=true`; longer values are truncated. Inert when `LOG_PAYLOADS=false`.                                                                                   |

### Deprecated environment variables

> [!CAUTION]
> Still works, but will be removed in future versions.

| Variable                      | Replacement                                              | Description                                                                                                                                     |
|-------------------------------|---------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `LOG_FORMAT`                  | `DIAL_SDK_TEXT_LOG_FORMAT` or `DIAL_SDK_LOG_FORMAT=json` | Still honored (and wins over the replacements) but warns at startup; removal in a future release.                                              |
| `LOG_DATE_FORMAT`             | —                                                       | Still honored alongside `LOG_FORMAT`; going forward the timestamp format is fixed to `%Y-%m-%d %H:%M:%S` (the previous default).               |
| `OTEL_PYTHON_LOG_CORRELATION` | — *(automatic)*                                         | Deprecated by aidial-sdk; warns at startup. Trace fields are stamped onto log records whenever tracing is enabled, so the switch is redundant. |

### Removed environment variables

| Variable                   | Reason                                                                                                      |
|----------------------------|------------------------------------------------------------------------------------------------------------|
| `CHAT_MESSAGE_LOG_LEN`     | Fed a message-logging helper whose only call site was never invoked; the setting was inert (#442).         |
| `LOG_MULTILINE_LOG_ENABLED`| Toggled a formatter never registered in the logging config; the setting was inert (#442).                  |

### Behavioral changes

> [!NOTE]
> - **Lazy on-demand attachment strategy → GA** — `orchestrator.attachment_strategy` (`lazy_on_demand`) and the `internal_attachments_get_content` tool are now active regardless of `ENABLE_PREVIEW_FEATURES` (#394).
> - **Logging content policy** — logs now carry structure (roles, counts, sizes, names, ids, sanitized URLs, header **names**) and never payload content at any level, DEBUG included; set `LOG_PAYLOADS=true` for local debugging only (#436, #459).
> - **Failed turns delivered via the DIAL error protocol** — clients render a real error state instead of a fake assistant reply, error text stays out of LLM history, and monitoring sees a failure rather than a success (#411, #412).

### Behavioral changes

> [!NOTE]
> The built-in file-parameter skill now prefers the new `data` prefix over `base64` for inline file content, so existing apps change behaviour on upgrade without any config change. Tools that need a bare base64 payload still work — the skill retries once with `file:base64::` when a `file:data::` call fails.
>
> - **Tool-call file parameter formatting** — `config/predefined/skills/tool-call-file-parameter-formatting/SKILL.md` (v1.0 → v1.1) (#479)

---

#### ai-dial-core `0.45.7`

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `unknown` | — | No | A flag to print the Authorization header in logs was added. Operator should be aware this could expose sensitive credentials if enabled. |

---
