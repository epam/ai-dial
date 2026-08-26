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
   - ai-dial-chat: `1.0.0-rc.7`
   - ai-dial-core: `0.47.0`
   - ai-dial-analytics-realtime: `0.27.0`
   - ai-dial-rag: `0.43.0-rc.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.11.0`
   - ai-dial-mind-map-backend: `0.14.2`
   - ai-dial-mind-map-frontend: `0.13.5`
   - ai-dial-admin-backend: `0.20.0`
   - ai-dial-admin-frontend: `0.20.0-rc.2`
   - ai-dial-admin-deployment-manager-backend: `0.20.0`
   - ai-dial-admin-evaluation-framework-backend: `0.3.0`
   - ai-dial-admin-evaluation-metrics: `0.1.1`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

#### ai-dial-admin-deployment-manager-backend `0.20.0`

This release includes **high-priority changes**. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.20.0-rc.0/docs/upgrade-plans/0.20.0.md) before proceeding.

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

> [!NOTE]
> `GET /api/v1/deployments` no longer returns `version`, `owner`, `createdAt`/`updatedAt`, `descriptionKeywords`, `inputAttachmentTypes`, model `capabilities`/`limits`/`pricing`, or application `applicationProperties`/`applicationTypeSchemaId`/`routes`. Consumers needing those fields fetch the deployment individually by type and ID. Full reference in Swagger UI (`/swagger-ui.html`). (#157)

- **New endpoints** — `POST /api/v1/test-suites/{id}/runs/import` (#99) and `GET /api/v1/analytics/metric-scores/comparison` (#106)
- **Breaking** — `metricEvalDurationMs` is now `@NotNull` on `EvalSummaryBatchWriteItemDto`; external producers calling `POST /api/v1/analytics/eval-summaries` must send it or receive HTTP 400 (#150)
- **Breaking** — `disabledTestCaseIds` is removed from the test-suite request and response DTOs. Unknown request fields are ignored, so no coordinated client release is required #151 (#152)
- **Breaking** — the legacy hardcoded multi-turn executor is removed; multi-turn request templates must now be authored as JSONata via `jsonataContent` #17 (#113)
- **Additive** — `multiTurnData` on test-case DTOs, `condition` on test-suite metric-definition DTOs, `turnIndex` / `totalTurns` on analytics result and eval-summary DTOs, a nullable `turnIndex` on `ValidationWarningDto`, a `history` list on the try-it-out response, and a reserved `turnIndex` column in test-case CSV export/import (#100, #147)
- **New 409 `INVALID_OPERATION`** — creating a run for, or trying out, an MCP suite bound to a dataset containing multi-turn test cases (#100, #147)

### New environment variables

> **Required**: ✅ = must be supplied, the service will not start without it. ❌ = ships with a working default. Nothing in this release is required in a default deployment; ⚠️ in a description marks a variable that becomes mandatory once you switch on the feature it belongs to.

| Variable | Required | Default | Description |
|---|:-:|---|---|
| `API_KEY_ENABLED` | ❌ | `false` | Enables DIAL API-Key authentication via the `Api-Key` request header. Applies only when `config.rest.security.mode=oidc`. |
| `API_KEY_CORE_URL` | ❌ | - | ⚠️ Base URL of the DIAL Core instance used to introspect API keys via `GET /v1/user/info`. Empty by default; startup fails with `…requires …core-url to be set` when `API_KEY_ENABLED=true`. |
| `API_KEY_CACHE_TTL_SECONDS` | ❌ | `60` | Time-to-live, in seconds, for cached successful introspection results. |
| `API_KEY_CACHE_MAX_SIZE` | ❌ | `10000` | Maximum number of cached introspection results. |
| `API_KEY_REQUEST_TIMEOUT_MS` | ❌ | `3000` | Connect/read timeout, in milliseconds, for the introspection call to DIAL Core. |
| `API_KEY_ROLES_MAPPING` | ❌ | - (empty) | ⚠️ JSON object mapping DIAL Core project-key role names to lists of this service's authority strings. When `API_KEY_ENABLED=true`, at least one of the two role mappings must be non-empty or startup fails. |
| `API_KEY_DEFAULT_ROLES_MAPPING` | ❌ | - (empty) | ⚠️ JSON object mapping DIAL Core roles from the JWT-rooted per-request-key response shape (`userClaims`) to lists of this service's authority strings. When `API_KEY_ENABLED=true`, at least one of the two role mappings must be non-empty or startup fails. |
| `API_KEY_USER_CLAIMS_ROLE_CLAIM` | ❌ | `roles` | Claim name read out of the introspection response's `userClaims` object to obtain the caller's raw roles. |
| `API_KEY_STARTUP_PROBE` | ❌ | `true` | When `true`, the service calls DIAL Core's `/v1/user/info` at startup and fails to start if Core is unreachable or misconfigured. |
| `ANALYTICS_COMPARISON_MAX_UNMATCHED_ROWS` | ❌ | `5000` | Maximum number of non-matching eval-summary rows a single run comparison may report per run; exceeding it fails the request with HTTP 409. Minimum `1`. |
| `JSONATA_EVALUATION_TIMEOUT_MS` | ❌ | `10000` | Maximum wall-clock time in milliseconds a single JSONata expression evaluation may run before it is aborted. Minimum `1`. |
| `JSONATA_MAX_RECURSION_DEPTH` | ❌ | `1000` | Maximum call-stack recursion depth a single JSONata expression evaluation may reach before it is aborted. Minimum `1`. |
| `ANALYTICS_RESULTS_CSV_IMPORT_MAX_FILE_SIZE` | ❌ | `10MB` | Maximum CSV file size for the eval-results import endpoint. Larger requests are rejected with HTTP 400 before parsing begins. |
| `TEST_CASE_MULTI_TURN_MAX_TURNS` | ❌ | `10` | Maximum number of turns a multi-turn test case may carry. An over-cap case is persisted but marked invalid with a warning, so it is excluded from runnable selection. |
| `TEST_SUITE_RUN_EXEC_DEFAULT_TIMEOUT` | ❌ | `600000` | Default per-request timeout, in milliseconds, for deployment requests issued during a test suite run. |
| `TEST_SUITE_RUN_EXEC_MAX_TIMEOUT` | ❌ | `1200000` | Upper bound, in milliseconds, a run may request for its per-request timeout. |
| `VIRTUAL_THREADS_ENABLED` | ❌ | `true` | Toggles Spring's virtual-thread executor; set to `false` to aid troubleshooting. |
| `METRIC_PROVIDERS_DIAL_ENABLED` | ❌ | `true` | Whether the sync job processes the stock `dial` provider entry. `@NotNull` — every configured entry must define it. |
| `METRIC_PROVIDERS_EXTRA_ENABLED` | ❌ | `false` | Activates the stock second provider entry `extra`. Point `METRIC_PROVIDERS_EXTRA_BASE_URL` at a real service before flipping it to `true`. |
| `METRIC_PROVIDERS_EXTRA_BASE_URL` | ❌ | `http://localhost:8087` | ⚠️ Base URL of the `extra` provider; `GET /metrics` is called against it. The default points at localhost, so it must be overridden whenever `METRIC_PROVIDERS_EXTRA_ENABLED=true`. |
| `METRIC_PROVIDERS_EXTRA_CONNECT_TIMEOUT_MS` | ❌ | `5000` | HTTP connection timeout, in milliseconds, for the `extra` provider. |
| `METRIC_PROVIDERS_EXTRA_READ_TIMEOUT_MS` | ❌ | `150000` | HTTP read timeout, in milliseconds, for the `extra` provider. |

### Behavioral changes
> [!NOTE]
> These take effect automatically on upgrade — no operator action required, but existing suites may select or time out differently than they did on `0.2.0`.

- **Test suite run request timeouts** — the default per-request timeout rises from `30s` to `600s` and the maximum from `600s` to `1200s`, so a slow streaming deployment no longer trips a request timeout (#153)
- **Query DSL null polarity** — `nc`, `ne` and `not` are now total over nulls: a row whose field is null or absent satisfies a negated predicate instead of being dropped. Suite `testCaseFilter`s using these operators will select more cases than before; the previous behavior is expressible as `and(ne(field, null), nc(field, "x"))` #141 (#143)
- **Run selection** — the only rule is now `is_valid = TRUE AND testCaseFilter`. Suites carrying stale `test_suites.disabled_test_case_ids` values run every valid, filter-matching case; the column is retained but no longer read or written, with the drop deferred to a follow-up #151 (#152)
- **Suite snapshots on imported runs** — the snapshot phase now runs for every run, so an imported run scores against frozen suite config instead of resynthesizing from the live suite (#122)
- **Result row volume on chained suites** — a chain of `R` requests over `T` turns writes up to `R × T` result and eval-summary rows per test-case repetition where a single-request, single-turn suite wrote one. A large suite can now exceed `ANALYTICS_RESULTS_BATCH_MAX_ITEMS` (default `10000`) on import and fail with HTTP 400; raise it deliberately before running such a suite. Single-request suites are byte-identical to `0.2.0` #98 (#114, #164)
- **Custom metric provider entries must now declare `enabled`** — `ProviderEntry.enabled` is `@NotNull` with no Java-side default. The stock `dial` (`true`) and `extra` (`false`) entries carry defaults in `application.yml`, so standard deployments are unaffected. A **custom** provider entry supplied through external configuration (mounted `application.yml`, `SPRING_APPLICATION_JSON`, Helm values, or the `METRICPROVIDERS_PROVIDERS_<ID>_*` environment form) had no `enabled` field on `0.2.0` and now fails startup with `providers[<id>].enabled must not be null` until the flag is added #167 (#166, #164)

> [!CAUTION]
> **Upgrade the backend before `eval-cli`.** This CLI version emits the 19-column import contract (`requestIndex`, `totalRequests`, `turnIndex`, `totalTurns` among them). An older backend does not reject such a CSV — it silently ignores the four unknown headers and persists every row as a distinct single-request, single-turn row under a random identity. The import reports success and there is no error to alert on. A fetch bundle written by an older CLI still loads, but `run` refuses a multi-turn test case against it; re-run `fetch` first. (#164)

### Database migrations
> [!NOTE]
> Flyway applies these automatically on startup; the service account needs DDL privileges on both schemas. All column adds are backward compatible — nullable JSONB, or `NOT NULL DEFAULT` backfilled in a metadata-only statement with no table rewrite.

- **meta** — `V1.26__AddConditionToTestSuiteMetricDefinitions.sql` — adds the nullable `condition VARCHAR(2000)` column to `test_suite_metric_definitions` (#100)
- **meta** — `V1.27__AddMultiTurnDataToTestCases.sql` — adds the nullable `multi_turn_data` JSONB column plus a mutual-exclusivity CHECK to `test_cases` (#100)
- **meta** — `V1.28__AddMultiTurnDataToTestCaseRunInputs.sql` — adds the nullable `multi_turn_data` JSONB column to `test_case_run_inputs` for the suite-run snapshot (#100)
- **meta** — `V1.29__AddAdditionalRequestsToTestSuites.sql` — adds `additional_requests JSONB NOT NULL DEFAULT '[]'` and the nullable `request_name VARCHAR(255)` to `test_suites`, so every existing suite behaves as a one-element chain #98 (#114, #164)
- **analytics** — `V1.13__AddTurnColumnsToTestCaseRunResults.sql` — adds `turn_index` / `total_turns` to `test_case_run_results` and extends `uq_results_run_case_index` with `turn_index` (#100)
- **analytics** — `V1.14__AddTurnColumnsToEvalSummaries.sql` — adds `turn_index` / `total_turns` to `test_case_eval_summaries` and extends `uq_eval_summaries_natural_key` with `turn_index` (#100)
- **analytics** — `V1.15__AddEvalSummariesRunComputedAtIndex.sql` — adds a covering `(test_suite_run_id, computed_at_ms DESC, computation_id)` index so latest-computation resolution stays a top-1 index descent (#108)
- **analytics** — `V1.16__AddMetricEvalDurationToEvalSummaries.sql` — adds `metric_eval_duration_ms BIGINT NOT NULL DEFAULT 0` to `test_case_eval_summaries` (#150)
- **analytics** — `V1.17__AddRequestColumnsToTestCaseRunResults.sql` — adds `request_index` / `total_requests` to `test_case_run_results` (backfilled `0`/`1`) and extends `uq_results_run_case_index` with `request_index` #98 (#114, #164)
- **analytics** — `V1.18__AddRequestColumnsToEvalSummaries.sql` — adds `request_index` / `total_requests` to `test_case_eval_summaries` (backfilled `0`/`1`) and extends `uq_eval_summaries_natural_key` with `request_index` #98 (#114, #164)

> [!CAUTION]
> `V1.13`, `V1.14`, `V1.17` and `V1.18` drop and re-create the unique constraint / index on `test_case_run_results` and `test_case_eval_summaries`. On a large analytics deployment this takes a long exclusive lock — plan a maintenance window, or replace them with a non-transactional `CREATE UNIQUE INDEX CONCURRENTLY` + swap.

### API / contract changes
> [!NOTE]
> Full reference in Swagger UI (`/swagger-ui.html`).

> [!NOTE]
> `GET /api/v1/deployments` no longer returns `version`, `owner`, `createdAt`/`updatedAt`, `descriptionKeywords`, `inputAttachmentTypes`, model `capabilities`/`limits`/`pricing`, or application `applicationProperties`/`applicationTypeSchemaId`/`routes`. Consumers needing those fields fetch the deployment individually by type and ID. Full reference in Swagger UI (`/swagger-ui.html`). (#157)

- **New endpoints** — `POST /api/v1/test-suites/{id}/runs/import` (#99) and `GET /api/v1/analytics/metric-scores/comparison` (#106)
- **New query parameter** — `GET …/resolved-request` accepts `requestIndex` (default `0`) to preview any position in a suite's request chain; out of range returns HTTP 400 #98 #162 (#114, #163, #164)
- **Breaking** — `metricEvalDurationMs` is now `@NotNull` on `EvalSummaryBatchWriteItemDto`; external producers calling `POST /api/v1/analytics/eval-summaries` must send it or receive HTTP 400 (#150)
- **Breaking** — `disabledTestCaseIds` is removed from the test-suite request and response DTOs. Unknown request fields are ignored, so no coordinated client release is required #151 (#152)
- **Breaking** — the legacy hardcoded multi-turn executor is removed; multi-turn request templates must now be authored as JSONata via `jsonataContent` #17 (#113)
- **Changed (affects pre-release users of the results-import endpoint only)** — the import CSV contract is now 19 reserved columns; `testCaseData` becomes a required reserved column carrying the row's data as a JSON object, arbitrary headers no longer map to `testCaseData` fields (unmatched headers are ignored), and `extractedColumns`, `extractionWarnings`, `requestIndex`, `totalRequests`, `turnIndex`, `totalTurns` join the reserved set. Rows with no `testCaseId` derive one from `testCaseName`, so a repetition's rows group together #98 (#114, #164)
- **Additive** — `multiTurnData` on test-case DTOs, `condition` on test-suite metric-definition DTOs, `turnIndex` / `totalTurns` on analytics result and eval-summary DTOs, a nullable `turnIndex` on `ValidationWarningDto`, a `history` list on the try-it-out response, and a reserved `turnIndex` column in test-case CSV export/import (#100, #147)
- **Additive** — `additionalRequests` and `requestName` on test-suite DTOs; `requestIndex` / `totalRequests` on analytics result and eval-summary DTOs; `requestIndex` / `totalRequests` / `requestName` / `turnIndex` / `totalTurns`, `extractedColumns`, `extractionWarnings`, `streamingStatus` and `truncationWarning` on try-it-out responses; a `request: {index, total, last, name}` namespace for metric `condition` expressions #98 #162 (#114, #163, #164)
- **New 409 `INVALID_OPERATION`** — creating a run for, or trying out, an MCP suite bound to a dataset containing multi-turn test cases (#100, #147)
- **New 400** — a non-empty `additionalRequests` on an `MCP_TOOL` suite; MCP chaining is model-ready but deferred #98 (#114, #164)

---

#### ai-dial-admin-frontend `0.20.0-rc.2`

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

#### ai-dial-chat `1.0.0-rc.7`

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

### New environment variables

| Variable                | Required | Description                                                                                                                                                                                                                             | Available Values           | Default values    |
| ----------------------- | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------- |
| `PROXY_LANGUAGE_HEADER` |    No    | Name of the HTTP header used to pass the user's currently selected UI language to DIAL Core. The header is only sent when a language is known for the request. Present since `0.46.x` but previously undocumented and unset by default. | Any valid HTTP header name | `accept-language` |

### Behavioral changes

> [!NOTE]
> These take effect automatically on upgrade — no configuration change is required.

- **UI language forwarding** — `PROXY_LANGUAGE_HEADER` now defaults to `accept-language`, so the selected UI language is forwarded to DIAL Core on every request that knows one; previously no header was sent unless the variable was set explicitly (#8377)
- **`AVAILABLE_LOCALES` ordering is now significant** — the first entry is the primary (identifier) locale used to resolve localized marketplace `display_name` / `description` values, and `en` is appended rather than prepended when it is absent from the list (#8199)

### Behavioral changes

> [!NOTE]
> Takes effect automatically on upgrade — no configuration change is required.

- **`Enter` now sends the message on touch-screen laptops** — such devices previously fell into the touch branch where `Enter` inserted a newline; they are now treated as keyboard-capable and the default `enterType` is `Enter`. `Shift+Enter` still inserts a newline, IME composition is unaffected, and users can switch to `Ctrl+Enter` in the newly restored **Keyboard shortcuts** setting (Issue #8376) (#8440)

### Behavioral changes

> [!NOTE]
> Takes effect automatically on upgrade — no configuration change is required.

- **Browser timezone is now sent to DIAL Core** — `/api/chat` adds an `X-Timezone` header (IANA zone, e.g. `Europe/Warsaw`) to every completion request where the browser reports one. The header name is fixed and not configurable, and it is omitted when timezone detection is unavailable (Issue #8442) (#8444)

### Behavioral changes

> [!NOTE]
> Takes effect automatically on upgrade — no configuration change is required.

- **Browser timezone is now sent to DIAL Core** — `/api/chat` adds an `X-Timezone` header (IANA zone, e.g. `Europe/Warsaw`) to every completion request where the browser reports one. The header name is fixed and not configurable, and it is omitted when timezone detection is unavailable (Issue #8442) (#8444, #8457)

### New environment variables

| Variable                | Required | Description                                                                                                                                                                                                                             | Available Values           | Default values    |
| ----------------------- | :------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------- |
| `PROXY_LANGUAGE_HEADER` |    No    | Name of the HTTP header used to pass the user's currently selected UI language to DIAL Core. The header is only sent when a language is known for the request. Present since `0.46.x` but previously undocumented and unset by default. | Any valid HTTP header name | `accept-language` |

### Behavioral changes

> [!NOTE]
> These take effect automatically on upgrade — no configuration change is required.

- **UI language forwarding** — `PROXY_LANGUAGE_HEADER` now defaults to `accept-language`, so the selected UI language is forwarded to DIAL Core on every request that knows one; previously no header was sent unless the variable was set explicitly (#8377)
- **`AVAILABLE_LOCALES` ordering is now significant** — the first entry is the primary (identifier) locale used to resolve localized marketplace `display_name` / `description` values, and `en` is appended rather than prepended when it is absent from the list (#8199)
- **Browser timezone is now sent to DIAL Core** — `/api/chat` adds an `X-Timezone` header (IANA zone, e.g. `Europe/Warsaw`) to every completion request where the browser reports one. The header name is fixed and not configurable, and it is omitted when timezone detection is unavailable (Issue #8442) (#8444, #8457)
- **`Enter` now sends the message on touch-screen laptops** — such devices previously fell into the touch branch where `Enter` inserted a newline; they are now treated as keyboard-capable and the default `enterType` is `Enter`. `Shift+Enter` still inserts a newline, IME composition is unaffected, and users can switch to `Ctrl+Enter` in the newly restored **Keyboard shortcuts** setting (Issue #8376) (#8440)

---

#### ai-dial-mind-map-frontend `0.13.5`

### Behavioral changes
> [!NOTE]
> No configuration change is required — both shifts come from the `next-auth` upgrade and apply automatically on upgrade.
- **OAuth `state`, `nonce`, and PKCE check cookies are now bound to the provider that issued them.** Sign-ins already in flight when the new version rolls out fail once and succeed on retry. (#100)
- **An explicitly configured `NEXTAUTH_URL` now takes precedence over the auto-detected forwarded host.** Deployments behind a proxy should confirm `NEXTAUTH_URL` matches the externally reachable base URL. (#100)

### Behavioral changes
> [!NOTE]
> No configuration change is required — the health endpoint is additive and serves immediately on upgrade.
- **`GET /api/health` responds without authentication.** The route falls outside the `middleware.ts` matcher (`/chat/:path*`, `/signin`), so probes reach it with no session. Point container liveness/readiness probes at it; note the JSON body reports `NODE_ENV` and the pod hostname, so treat it as internal if your ingress exposes it. (#111)

### Behavioral changes
> [!NOTE]
> No configuration change is required — the new logging is active automatically on upgrade.
- **Raw SSE payloads are now written to error-level server logs on any chat stream failure.** `logError` records `rawEvent`, the unparsed chunk, which carries assistant answer content; the handler fires for every error raised in the parse loop — upstream DIAL error payloads and content-filter rejections included — not only malformed JSON. `logger` is constructed without a `level` option and no log-level environment variable is read, so these lines cannot be suppressed by configuration. Treat mind map chat logs as containing user-visible answer content when routing or retaining them. (9057172)

---

#### ai-dial-quickapps-backend `0.11.0`

### New environment variables

| Variable                | Default           | Description                                                                                                                                                                                             | Required |
|-------------------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `PROXY_LANGUAGE_HEADER` | `accept-language` | Name of the incoming HTTP request header that carries the locale for UI display (stage-name localization). Override when a reverse proxy rewrites the standard `Accept-Language` header before forwarding the request. | No       |

### Behavioral changes

> [!NOTE]
> - **Predefined system prompts refined** — apps change behaviour on upgrade with no config change: the agent no longer receives instructions to emit in-text citations, and the `time` placeholder is served by the `timestamp` feature (#504).
> - **`DEFAULT_STAGE_DISPLAY_LEVEL` accepts a new `none` value** — alongside `error`, `info` and `debug`, suppressing every stage including errors deployment-wide (#494).

### Schema deprecations

> [!CAUTION]
> Still accepted in app manifests, but will be removed in future versions (#403).

| Legacy key                                | Replacement                    | Affected config model                    |
|-------------------------------------------|--------------------------------|------------------------------------------|
| `content_propagation.propagate_history`   | `conversation_mode.resumable`  | `ContentPropagation` (`deployment-tool`) |

---

#### ai-dial-analytics-realtime `0.27.0`

##### Breaking changes

**Usage per model is now ignored**

The breaking change 'ignore usage per model' may alter how per-model usage data is processed or reported. Operators relying on per-model usage metrics or downstream systems consuming that data should verify compatibility.

| Previous configuration | Required action |
|---|---|
| Per-model usage data was collected and reported | Review downstream systems or dashboards that consume per-model usage metrics; they may no longer receive that data |

---

#### ai-dial-admin-backend `0.20.0`

> [!IMPORTANT]
> This release includes high-priority changes. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-backend/blob/0.20.0/docs/upgrade-plans/0.20.0.md) before proceeding.

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `MS_SQL_SERVER_AZURE_JDBC_AUTH_MODE` | `ActiveDirectoryMSI` | No | Configures the MSSQL JDBC authentication mode (maps to sqlserver.datasource.azure-jdbc-auth-mode). Defaults to ActiveDirectoryMSI to preserve existing behavior. |

---

#### ai-dial-core `0.47.0`

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `PRINT_AUTHORIZATION_HEADER` | — | No | Flag to enable printing the Authorization header in logs. Operator should be aware this can expose sensitive credentials in log output. |

---
