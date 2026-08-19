# Instructions

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.43.0-rc.0`
   - ai-dial-adapter-openai: `0.43.0-rc.0`
   - ai-dial-adapter-vertexai: `0.39.0-rc.0`
   - ai-dial-adapter-dial: `0.18.0-rc.0`
   - ai-dial-chat-themes: `0.19.0`
   - ai-dial-chat: `0.49.0-rc.0`
   - ai-dial-core: `0.47.0-rc.0`
   - ai-dial-analytics-realtime: `0.27.0-rc.0`
   - ai-dial-rag: `0.43.0-rc.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.11.0-rc.6`
   - ai-dial-mind-map-backend: `0.14.2`
   - ai-dial-mind-map-frontend: `0.13.2`
   - ai-dial-admin-backend: `0.20.0-rc.0`
   - ai-dial-admin-frontend: `0.20.0-rc.0`
   - ai-dial-admin-deployment-manager-backend: `0.20.0-rc.0`
   - ai-dial-admin-evaluation-framework-backend: `0.3.0-rc.0`
   - ai-dial-admin-evaluation-metrics: `0.1.1`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

#### ai-dial-admin-deployment-manager-backend `0.20.0-rc.0`

This release includes **high-priority changes**. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.20.0-rc.0/docs/upgrade-plans/0.20.0.md) before proceeding.

---

#### ai-dial-admin-evaluation-framework-backend `0.3.0-rc.0`

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

#### ai-dial-admin-frontend `0.20.0-rc.0`

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

#### ai-dial-analytics-realtime `0.27.0-rc.0`

##### Breaking changes

**Usage per model is now ignored**

The breaking change 'ignore usage per model' may alter how per-model usage data is processed or reported, potentially affecting downstream analytics or billing integrations that relied on per-model usage breakdowns.

| Previous configuration | Required action |
|---|---|
| Per-model usage data was collected and reported | Review any downstream systems or dashboards consuming per-model usage data; they will no longer receive this data |

---

#### ai-dial-admin-backend `0.20.0-rc.0`

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `MS_SQL_SERVER_AZURE_JDBC_AUTH_MODE` | `ActiveDirectoryMSI` | No | Controls the MSSQL JDBC authentication mode via sqlserver.datasource.azure-jdbc-auth-mode. Defaults to ActiveDirectoryMSI to preserve existing behavior. Operators not using MSI may need to set this explicitly. |

---

#### ai-dial-core `0.47.0-rc.0`

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `DIAL_NATIVE` | — | No | New auth type introduced. Enables per-provider offline client config and admin consent endpoint for DIAL_NATIVE services. |

---
