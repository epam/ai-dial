# Instructions

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.43.0`
   - ai-dial-adapter-openai: `0.43.0`
   - ai-dial-adapter-vertexai: `0.39.0`
   - ai-dial-adapter-dial: `0.18.0`
   - ai-dial-chat-themes: `0.19.1`
   - ai-dial-chat: `1.0.0`
   - ai-dial-chat: `0.49.0` — final release of the `0.4x` line, see [ai-dial-chat: the `0.4x` line ends with this release](#ai-dial-chat-the-04x-line-ends-with-this-release)
   - ai-dial-core: `0.47.0`
   - ai-dial-analytics-realtime: `0.27.0`
   - ai-dial-rag: `0.43.0-rc.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.11.0`
   - ai-dial-quickapps-frontend: `0.1.0`
   - ai-dial-mind-map-backend: `0.14.2`
   - ai-dial-mind-map-frontend: `0.13.5`
   - ai-dial-admin-backend: `0.20.0`
   - ai-dial-admin-frontend: `0.20.0`
   - ai-dial-admin-deployment-manager-backend: `0.20.0`
   - ai-dial-admin-evaluation-framework-backend: `0.3.0`
   - ai-dial-admin-evaluation-metrics: `0.1.1`
   - ai-dial-openapi-to-mcp: `0.2.1`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

#### ai-dial-chat: the `0.4x` line ends with this release

> [!IMPORTANT]
> DIAL 1.47 is the last DIAL platform release that includes the `ai-dial-chat` `0.4x`
> line. Starting with DIAL 1.48, the platform assembly ships `ai-dial-chat` `1.0.0` and
> later only.
>
> `0.49.0` receives critical and security fixes **through 31 December 2026**. It is
> deprecated in the sense that it receives no new features — it is not end-of-life today.
>
> Note the version numbering: `1.0.0` is the successor to `0.49.0`, despite being a
> ground-up rewrite rather than an incremental release.
>
> Note the version numbering: `1.0.0` is the **successor** to `0.49.0`, despite being a
> ground-up rewrite rather than an incremental release. `0.49.0` is the final feature
> release of the `0.4x` line; it is deprecated in the sense that it receives no new
> features, not end-of-life. It continues to receive critical and security fixes until end of year 2026.

| Version | Status in 1.47 |
|---|---|
| `1.0.0` | Shipped and recommended. The only chat version in DIAL 1.48 and later |
| `0.49.0` | Final release of the `0.4x` line. Maintenance fixes only |

##### What to do

| If you… | Do this |
|---|---|
| Are planning a new installation | Deploy `1.0.0` |
| Run `0.4x` and can migrate now | Follow [Migrating from `0.4x` to `1.0.0`](#migrating-from-04x-to-100) as part of this upgrade |
| Run `0.4x` and cannot migrate yet | Upgrade to `0.49.0` with 1.47. From 1.48 onward, pin the chat image explicitly and track `ai-dial-chat` releases for fixes |

> [!NOTE]
> From DIAL 1.48, staying on the `0.4x` line requires an explicit `image.tag` override on
> the chat component, since the chart default moves to `1.0.0`. This is the one intentional
> exception to the "remove image tag overrides" advice in [General notes](#general-notes).

---

#### Migrating from `0.4x` to `1.0.0`

> [!CAUTION]
> This is a migration, not an upgrade. Plan it as a separate activity with its own
> rollback path. Pointing an existing `0.4x` deployment at a `1.0.0` image without
> rewriting its configuration will not work.

`1.0.0` replaces the Next.js application with a React SPA served from a new NestJS backend
(BFF). All runtime configuration and feature flags are resolved server-side and delivered
to the client.

##### Breaking configuration changes

- Build-time `NEXT_PUBLIC_*` variables no longer apply.
- The single `AUTH_PROVIDERS` JSON variable is removed. Identity providers are configured
  through discrete `AUTH_{PROVIDER}_{FIELD}` variables (nine providers supported).
  Field-by-field mapping:
  [`docs/legacy-chat-migration-guide.md`](https://github.com/epam/ai-dial-chat/blob/1.0.0/docs/legacy-chat-migration-guide.md).
- **Default `PORT` changed `3005` → `5000`**, and the image's `EXPOSE` with it. Update
  container port mappings, reverse-proxy upstreams, health checks and
  `AUTH_CALLBACK_BASE_URL`.
- The backend now sends `Cross-Origin-Opener-Policy: same-origin-allow-popups` instead of
  Helmet's `same-origin` default, so toolset OAuth popups keep their opener reference.
  `frame-ancestors` framing behavior is unchanged.

##### Key environment variables

Full surface in `apps/chat-api/README.md`.

| Variable | Default | Description |
|---|---|---|
| `DIAL_CORE_URL` | — (required) | Internal DIAL Core URL, never exposed to clients |
| `DIAL_CORE_EXTERNAL_URL` | — | Public DIAL Core URL browsers can reach; used to build client-side MCP endpoint links |
| `DIAL_API_VERSION` | `2024-10-21` | API version query parameter sent to DIAL Core |
| `DIAL_API_KEY` | — | Server-only key for utility-model tasks; not used for user-scoped routes |
| `ALLOWED_IFRAME_ORIGINS` | `[]` | Origins allowed to embed / be embedded (CSP `frame-src`). Required for the Quick Apps editors and the overlay |
| `CONVERSATION_BODY_SIZE_LIMIT_BYTES` | `10485760` | Maximum JSON request-body size, raised so large conversations can be saved |
| `ANNOUNCEMENT_HTML_MESSAGE` | (unset) | HTML for the dismissible announcement banner. Allowed tags: `a`, `b`, `strong`, `em`, `br`, `span` |
| `FILE_MANAGER_AVAILABLE_TABS` | `my_files,shared,organization` | Subset controlling which File Manager tabs are shown |
| `UTILITY_MODEL` / `LLM_CONVERSATION_NAMING_ENABLED` | — / `false` | Deployment ID of a utility model, and the toggle for LLM-based conversation naming |
| `LOG_LEVEL` | environment-dependent | Minimum backend log level: `debug`, `log`, `warn`, `error` |

##### Known gaps versus `0.4x`

> [!NOTE]
> Verify these against your usage before scheduling the migration.

- File and folder **share-link creation is removed** from the File Manager
  (`POST /api/v1/files/share` is gone). Revoking existing access is unaffected.
- `ChatOverlay.createConversation` now takes `{ deploymentId?, firstMessage? }` instead of
  the historical positional `(parentPath?, local?)` arguments — embedders must update.
- `<remaining feature-parity gaps — to be filled in by the chat team>`

##### Conversation data

`<What happens to existing conversation history on migration, and whether rolling back to
0.4x after running 1.0.0 is supported — to be filled in.>`

---

#### ai-dial-chat `0.49.0`

Upgrades in place from `0.48.x`. No operator action is strictly required.

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PROXY_LANGUAGE_HEADER` | No | `accept-language` | Name of the HTTP header carrying the user's selected UI language to DIAL Core. Present since `0.46.x` but previously undocumented and unset by default |

##### Behavioral changes

> [!NOTE]
> These take effect automatically on upgrade — no configuration change is required.

- **UI language forwarding** — `PROXY_LANGUAGE_HEADER` now defaults to `accept-language`,
  so the selected UI language is forwarded to DIAL Core on every request that knows one.
- **`AVAILABLE_LOCALES` ordering is now significant** — the first entry becomes the primary
  (identifier) locale for localized `display_name` and `description` on marketplace
  entities. Review the order of the existing value before upgrading.

---

#### ai-dial-quickapps-frontend `0.1.0`

> [!IMPORTANT]
> New component — it was not shipped in any previous DIAL release. This is a fresh
> deployment, not an upgrade. Skip this section if Quick Apps are not enabled in your
> installation.

A standalone Next.js app serving the QuickApp2 settings editor. It is embedded as an
`<iframe>` inside `ai-dial-chat` and communicates with the host via `postMessage`, so it
must be exposed under its own public URL reachable from the user's browser.

##### Required environment variables

| Variable | Description |
|---|---|
| `NEXTAUTH_SECRET` | Secret for signing session cookies. Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Public URL of this app, e.g. `https://quickapps.example.com`. Used to build OAuth callbacks |
| `DIAL_CORE_URL` | Base URL of DIAL Core; the app proxies API calls to it |

At least one OAuth provider must be fully configured — Keycloak, Azure AD, Google, Auth0,
Okta, Cognito or GitLab. Providers with incomplete configuration are silently skipped, so a
deployment with no fully configured provider starts but cannot sign anyone in.

For every enabled provider, register a confidential client with redirect URI
`{NEXTAUTH_URL}/api/auth/callback/{provider}` and web origin `{NEXTAUTH_URL}`.

##### Security-relevant defaults

> [!CAUTION]
> Both variables below default to permissive values suitable for local development only.
> Set them explicitly before exposing the app.

| Variable | Default | Action |
|---|---|---|
| `ALLOWED_FRAME_ANCESTORS` | `'self'` | Set to the exact `ai-dial-chat` origin(s), otherwise the CSP blocks the editor from being framed and it renders blank inside chat |
| `ALLOWED_ORIGIN` | `*` | Origin allowed to send `postMessage` to the editor. `*` accepts messages from any origin — unsafe for production |

##### Optional configuration

| Variable | Default | Description |
|---|---|---|
| `QUICK_APPS_APPLICATION_NAME` | — | Visualizer name; must match the `title` configured for this app in `ai-dial-chat` visualizer settings. Required, together with `DIAL_CHAT_URL` or `DIAL_ADMIN_URL`, for the visualizer connector to activate |
| `DIAL_CHAT_URL` / `DIAL_ADMIN_URL` | — | Origin of the host the app is embedded in |
| `THEMES_URL` | — | URL of the DIAL themes `config.json`; falls back to CSS variable defaults |
| `CODE_INTERPRETER_ENABLED` | `false` | Enables the Code Interpreter toggle in the editor. Mirrors the `ENABLED_FEATURES` flag in `ai-dial-chat` |
| `QUICK_APPS_DEFAULT_MODEL` | `gpt-4o` | Model pre-selected when the app config carries none |
| `PORT` |

---

#### ai-dial-admin-deployment-manager-backend `0.20.0`

This release includes **high-priority changes**. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.20.0/docs/upgrade-plans/0.20.0.md) before proceeding.

---

#### ai-dial-admin-evaluation-framework-backend `0.3.0`

### New environment variables

| Variable | Default | Description |
|---|---|---|
| `API_KEY_ENABLED` | `false` | Enables DIAL API-Key authentication via the `Api-Key` request header. Applies only when `config.rest.security.mode=oidc`. |
| `API_KEY_CORE_URL` | - | Base URL of the DIAL Core instance used to introspect API keys via `GET /v1/user/info`. Required when API-Key auth is enabled. |
| `API_KEY_CACHE_TTL_SECONDS` | `60` | Time-to-live, in seconds, for cached successful introspection results. |
| `API_KEY_CACHE_MAX_SIZE` | `10000` | Maximum number of cached introspection results. |
| `API_KEY_REQUEST_TIMEOUT_MS` | `3000` | Connect/read timeout, in milliseconds, for the introspection call to DIAL Core. |
| `API_KEY_ROLES_MAPPING` | - (empty) | JSON object mapping DIAL Core project-key role names to lists of this service's authority strings. Conditional — at least one of the two role mappings must be non-empty. |
| `API_KEY_DEFAULT_ROLES_MAPPING` | - (empty) | JSON object mapping DIAL Core roles from the JWT-rooted per-request-key response shape (`userClaims`) to lists of this service's authority strings. |
| `API_KEY_USER_CLAIMS_ROLE_CLAIM` | `roles` | Claim name read out of the introspection response's `userClaims` object to obtain the caller's raw roles. |
| `API_KEY_STARTUP_PROBE` | `true` | When `true`, the service calls DIAL Core's `/v1/user/info` at startup and fails to start if Core is unreachable or misconfigured. |
| `ANALYTICS_COMPARISON_MAX_UNMATCHED_ROWS` | `5000` | Maximum number of non-matching eval-summary rows a single run comparison may report per run; exceeding it fails the request with HTTP 409. Minimum `1`. |
| `JSONATA_EVALUATION_TIMEOUT_MS` | `10000` | Maximum wall-clock time in milliseconds a single JSONata expression evaluation may run before it is aborted. Minimum `1`. |
| `JSONATA_MAX_RECURSION_DEPTH` | `1000` | Maximum call-stack recursion depth a single JSONata expression evaluation may reach before it is aborted. Minimum `1`. |
| `ANALYTICS_RESULTS_CSV_IMPORT_MAX_FILE_SIZE` | `10MB` | Maximum CSV file size for the eval-results import endpoint. Larger requests are rejected with HTTP 400 before parsing begins. |
| `TEST_CASE_MULTI_TURN_MAX_TURNS` | `10` | Maximum number of turns a multi-turn test case may carry. An over-cap case is persisted but marked invalid with a warning, so it is excluded from runnable selection. |
| `TEST_SUITE_RUN_EXEC_DEFAULT_TIMEOUT` | `600000` | Default per-request timeout, in milliseconds, for deployment requests issued during a test suite run. |
| `TEST_SUITE_RUN_EXEC_MAX_TIMEOUT` | `1200000` | Upper bound, in milliseconds, a run may request for its per-request timeout. |
| `VIRTUAL_THREADS_ENABLED` | `true` | Toggles Spring's virtual-thread executor; set to `false` to aid troubleshooting. |

### Behavioral changes
> [!NOTE]
> These take effect automatically on upgrade — no operator action required, but existing suites may select or time out differently than they did on `0.2.0`.

- **Test suite run request timeouts** — the default per-request timeout rises from `30s` to `600s` and the maximum from `600s` to `1200s`, so a slow streaming deployment no longer trips a request timeout (#153)
- **Query DSL null polarity** — `nc`, `ne` and `not` are now total over nulls: a row whose field is null or absent satisfies a negated predicate instead of being dropped. Suite `testCaseFilter`s using these operators will select more cases than before; the previous behavior is expressible as `and(ne(field, null), nc(field, "x"))` #141 (#143)
- **Run selection** — the only rule is now `is_valid = TRUE AND testCaseFilter`. Suites carrying stale `test_suites.disabled_test_case_ids` values run every valid, filter-matching case; the column is retained but no longer read or written, with the drop deferred to a follow-up #151 (#152)
- **Suite snapshots on imported runs** — the snapshot phase now runs for every run, so an imported run scores against frozen suite config instead of resynthesizing from the live suite (#122)

### Database migrations
> [!NOTE]
> Flyway applies these automatically on startup; the service account needs DDL privileges on both schemas. All column adds are backward compatible — nullable JSONB, or `NOT NULL DEFAULT` backfilled in a metadata-only statement with no table rewrite.

- **meta** — `V1.26__AddConditionToTestSuiteMetricDefinitions.sql` — adds the nullable `condition VARCHAR(2000)` column to `test_suite_metric_definitions` (#100)
- **meta** — `V1.27__AddMultiTurnDataToTestCases.sql` — adds the nullable `multi_turn_data` JSONB column plus a mutual-exclusivity CHECK to `test_cases` (#100)
- **meta** — `V1.28__AddMultiTurnDataToTestCaseRunInputs.sql` — adds the nullable `multi_turn_data` JSONB column to `test_case_run_inputs` for the suite-run snapshot (#100)
- **analytics** — `V1.13__AddTurnColumnsToTestCaseRunResults.sql` — adds `turn_index` / `total_turns` to `test_case_run_results` and extends `uq_results_run_case_index` with `turn_index` (#100)
- **analytics** — `V1.14__AddTurnColumnsToEvalSummaries.sql` — adds `turn_index` / `total_turns` to `test_case_eval_summaries` and extends `uq_eval_summaries_natural_key` with `turn_index` (#100)
- **analytics** — `V1.15__AddEvalSummariesRunComputedAtIndex.sql` — adds a covering `(test_suite_run_id, computed_at_ms DESC, computation_id)` index so latest-computation resolution stays a top-1 index descent (#108)
- **analytics** — `V1.16__AddMetricEvalDurationToEvalSummaries.sql` — adds `metric_eval_duration_ms BIGINT NOT NULL DEFAULT 0` to `test_case_eval_summaries` (#150)

> [!CAUTION]
> `V1.13` and `V1.14` drop and re-create the unique constraint / index on `test_case_run_results` and `test_case_eval_summaries`. On a large analytics deployment this takes a long exclusive lock — plan a maintenance window, or replace them with a non-transactional `CREATE UNIQUE INDEX CONCURRENTLY` + swap.

### API / contract changes
> [!NOTE]
> Full reference in Swagger UI (`/swagger-ui.html`).

- **New endpoints** — `POST /api/v1/test-suites/{id}/runs/import` (#99) and `GET /api/v1/analytics/metric-scores/comparison` (#106)
- **Breaking** — `metricEvalDurationMs` is now `@NotNull` on `EvalSummaryBatchWriteItemDto`; external producers calling `POST /api/v1/analytics/eval-summaries` must send it or receive HTTP 400 (#150)
- **Breaking** — `disabledTestCaseIds` is removed from the test-suite request and response DTOs. Unknown request fields are ignored, so no coordinated client release is required #151 (#152)
- **Breaking** — the legacy hardcoded multi-turn executor is removed; multi-turn request templates must now be authored as JSONata via `jsonataContent` #17 (#113)
- **Additive** — `multiTurnData` on test-case DTOs, `condition` on test-suite metric-definition DTOs, `turnIndex` / `totalTurns` on analytics result and eval-summary DTOs, a nullable `turnIndex` on `ValidationWarningDto`, a `history` list on the try-it-out response, and a reserved `turnIndex` column in test-case CSV export/import (#100, #147)
- **New 409 `INVALID_OPERATION`** — creating a run for, or trying out, an MCP suite bound to a dataset containing multi-turn test cases (#100, #147)

---

#### ai-dial-admin-frontend `0.20.0`

> [!IMPORTANT]
> This release has backend and data-store prerequisites. Review them before upgrading.

**Admin backend** — do **not** deploy this frontend ahead of an admin backend carrying [epam/ai-dial-admin-backend#1125](https://github.com/epam/ai-dial-admin-backend/pull/1125). An older backend accepts the new `cacheRead` / `cacheWrite` model pricing fields with `200 OK` and silently discards them, which produces a silent billing error.

**Deployment manager** — the GPU Memory and GPU Utilization cards in the Model Servings `Metrics` tab require a deployment-manager build that reports `gpuMemoryTotalBytes` and `gpuUtilization`. Without it the cards are omitted rather than showing "No Data".

**Analytics [Preview]** — the `Conversations` page requires the materialized `conversations` and `turns` entities plus the `conversation_insights` enrichment on the target analytics service. Without `turns`, the turn timeline and sample transcript on the conversation detail page load empty.

Two new optional variables, both `[Preview]` and unset by default:

| Variable | Purpose |
| --- | --- |
| `ANALYTICS_PUBLIC_URL` | REST endpoint of the Analytics data-access service **as an external client reaches it**, used to prefill the copyable snippets in a table's `Connect` panel. Distinct from `DIAL_ANALYTICS_API_URL`, which is how this app reaches the service and is commonly an in-cluster address a user's machine cannot resolve. Unset, the snippets show an `<analytics-base-url>` placeholder. |
| `ANALYTICS_FLIGHT_SQL_PUBLIC_URL` | Arrow Flight SQL endpoint as an external client reaches it, e.g. `grpc://analytics.example.com:32010`. Not derived from `ANALYTICS_PUBLIC_URL` — it is a separately exposed gRPC port with a different scheme and commonly a different host. Unset, the snippets show a `grpc://<analytics-host>:32010` placeholder. |

**Route change** — the standalone `/query-builder` route is retired and redirects to `/queries`; existing links and bookmarks still resolve.

---

#### ai-dial-analytics-realtime `0.27.0`

##### Breaking changes

**Usage per model is now ignored**

The breaking change 'ignore usage per model' may alter how per-model usage data is processed or reported, potentially affecting downstream analytics or billing integrations that relied on per-model usage breakdowns.

| Previous configuration | Required action |
|---|---|
| Per-model usage data was collected and reported | Review any downstream systems or dashboards consuming per-model usage data; they will no longer receive this data |

---

#### ai-dial-admin-backend `0.20.0`

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `MS_SQL_SERVER_AZURE_JDBC_AUTH_MODE` | `ActiveDirectoryMSI` | No | Controls the MSSQL JDBC authentication mode via sqlserver.datasource.azure-jdbc-auth-mode. Defaults to ActiveDirectoryMSI to preserve existing behavior. Operators not using MSI may need to set this explicitly. |

---

#### ai-dial-core `0.47.0`

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `DIAL_NATIVE` | — | No | New auth type introduced. Enables per-provider offline client config and admin consent endpoint for DIAL_NATIVE services. |

---

#### ai-dial-quickapps-backend `0.11.0`

##### New environment variables

| Variable | Default | Required | Description |
| :----- | :----- | :----- | :----- |
| `PROXY_LANGUAGE_HEADER` | `accept-language` | No | Name of the incoming HTTP request header that carries the locale for UI display (stage name localization). Override when a reverse proxy rewrites the standard `Accept-Language` header before forwarding the request. Should be in-line with similar env variable of ai-dial-chat. |
| **External URL Egress** | | | |
| `EXTERNAL_URL_FETCH_ENABLED` | `false` | Yes | Need to be set to `true` to enable the ai-dial-chat delivered feature. |


##### Behavioral changes

> [!NOTE]
> These take effect automatically on upgrade — no configuration change is required.

- **Reacts on UI language forwarding** — `PROXY_LANGUAGE_HEADER` should be in-line with similar env varibale on the
  ai-dial-chat side. Defaults to `accept-language`.

#### ai-dial-openapi-to-mcp `0.2.1`

> [!IMPORTANT]
> New component — it was not shipped in any previous DIAL release. This is a fresh
> deployment, not an upgrade. Skip this section unless you intend to expose OpenAPI-based
> services as MCP tools.

A stateless bridge that builds MCP tools on the fly from a client-supplied OpenAPI 3.x
document (JSON or YAML). The document and the target API base URL arrive in MCP metadata
(`_meta.openapi` / `X-META`, `_meta.base_url` / `X-BASE-URL`, or the OpenAPI `servers`
field) — nothing is configured server-side per API. It also exposes two utility tools,
`openapi_verify` and `openapi_convert` (Swagger 2.0 → OpenAPI 3.0).

##### Deployment

| | |
|---|---|
| Endpoint | Streamable HTTP at `/mcp`, port `8080` |
| Probes | `GET /health` (liveness), `GET /ready` (readiness) |
| Image | Published to GitHub Container Registry; runs as a non-root container |

> [!CAUTION]
> The bridge accepts OpenAPI documents, destination URLs, tool arguments and headers from
> clients and forwards them to arbitrary destinations — all of it untrusted input. Deploy
> it behind authenticated ingress and grant access only to trusted clients. Do not expose
> it publicly.

##### Configuration

Full reference: [CONFIGURATION.md](https://github.com/epam/ai-dial-openapi-to-mcp/blob/0.2.1/CONFIGURATION.md).

| Variable | Description |
|---|---|
| `OUTBOUND_HEADER_ALLOWLIST` | Controls which client headers are forwarded upstream. Three distinct states: **unset** — every header not covered by the blocklist is forwarded; **explicitly empty** — no client headers are forwarded; **populated** — only the listed names. Set it explicitly rather than relying on the default. |
| `OUTBOUND_HEADER_BLOCKLIST` | Header names never forwarded upstream |
| `LOG_LEVEL` | `INFO` by default |

DIAL external-service credentials are resolved per request and the bridge fails closed when
resolution fails. Forwarded header values and credentials stay request-scoped and are never
written into cache entries.

---
