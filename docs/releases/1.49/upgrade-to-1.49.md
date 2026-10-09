# Instructions

## Table of contents

- [Versions](#versions)
- [Before upgrade](#before-upgrade)
  - [General notes](#general-notes)
  - [Release-specific notes](#release-specific-notes)
    - [ai-dial-core](#ai-dial-core-0490-rc0)
    - [ai-dial-admin-backend](#ai-dial-admin-backend-0220-rc0)
    - [ai-dial-admin-frontend](#ai-dial-admin-frontend-0220-rc0)
    - [ai-dial-admin-evaluation-framework-backend](#ai-dial-admin-evaluation-framework-backend-050-rc0)
    - [ai-dial-chat](#ai-dial-chat-120-rc0)
    - [ai-dial-chat-themes](#ai-dial-chat-themes-0210)
    - [ai-dial-quickapps-backend](#ai-dial-quickapps-backend-0130-rc0)
    - [ai-dial-quickapps-frontend](#ai-dial-quickapps-frontend-030-rc0)
    - [ai-dial-analytics-realtime](#ai-dial-analytics-realtime-0290-rc0)
    - [ai-dial-adapter-bedrock](#ai-dial-adapter-bedrock-0450-rc0)
    - [ai-dial-adapter-openai](#ai-dial-adapter-openai-0450-rc0)
    - [ai-dial-adapter-vertexai](#ai-dial-adapter-vertexai-0410-rc0)
    - [ai-dial-adapter-dial](#ai-dial-adapter-dial-0200-rc0)

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.45.0-rc.0`
   - ai-dial-adapter-openai: `0.45.0-rc.0`
   - ai-dial-adapter-vertexai: `0.41.0-rc.0`
   - ai-dial-adapter-dial: `0.20.0-rc.0`
   - ai-dial-chat-themes: `0.21.0`
   - ai-dial-chat: `1.2.0-rc.0`
   - ai-dial-core: `0.49.0-rc.0`
   - ai-dial-analytics-realtime: `0.29.0-rc.0`
   - ai-dial-rag: `0.43.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.13.0-rc.0`
   - ai-dial-quickapps-frontend: `0.3.0-rc.0`
   - ai-dial-mind-map-backend: `0.15.0`
   - ai-dial-mind-map-frontend: `0.14.1`
   - ai-dial-admin-backend: `0.22.0-rc.0`
   - ai-dial-admin-frontend: `0.22.0-rc.0`
   - ai-dial-admin-deployment-manager-backend: `0.22.0-rc.0`
   - ai-dial-admin-evaluation-framework-backend: `0.5.0-rc.0`
   - ai-dial-admin-evaluation-metrics: `0.3.0`
   - ai-dial-openapi-to-mcp: `0.2.1`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.
- **Component compatibility in this release:** ai-dial-quickapps-frontend `0.3.0` requires ai-dial-chat `1.2.0`; conditional `prompt` / `completion` pricing and the Quick Apps tool access filter require ai-dial-core `0.49.0`; ai-dial-admin-frontend `0.22.0` must be deployed together with ai-dial-admin-backend `0.22.0`. Upgrade these components together.

Environment variable tables below use the same columns: **Required** is `Yes` (the service does not start without the variable) or `No`, and **Default** is the value applied when the variable is not set — `unset` means the variable has no default value.

### Release-specific notes

#### ai-dial-core `0.49.0-rc.0`

##### Breaking changes

> [!IMPORTANT]
> **`temperature` deployment feature now defaults to `false`.** A model or application that doesn't set `features.temperatureSupported` is now reported as not supporting temperature — `features.temperature: false` in the listing APIs and in the `X-DIAL-DEPLOYMENT-FEATURES` header sent to adapters and applications. Clients that rely on this flag (for example, the chat temperature control) stop offering temperature for those deployments (#2097).

| Previous configuration | Required action |
|---|---|
| Deployment without `features.temperatureSupported` (implicitly `temperature: true`) | Add `"features": {"temperatureSupported": true}` to every deployment where temperature must stay available |

> [!CAUTION]
> **snake_case interface-type aliases removed.** Interface-type values no longer accept the undocumented aliases `openai_chat_completions`, `openai_embeddings`, `openai_responses` and `anthropic_messages`. Only `openaiChatCompletions`, `openaiEmbeddings`, `openaiResponses` and `anthropicMessages` are accepted. Check translator `in` / `out` values in the dynamic config and in Admin-managed entities before upgrading (#2000).

##### New static settings

All settings go in `aidial.settings.json`, or as environment variables with the `aidial.` prefix. All of them have working defaults.

| Variable | Required | Default | Description |
|---|---|---|---|
| `tracing.genAiSpanAttributes` | No | `true` | Adds OTel GenAI semantic-convention `gen_ai.*` and `dial.*` attributes to the request span and to OTel log records. Prompts, completions and tool payloads are never published. See [Tracing](https://github.com/epam/ai-dial-core/blob/0.49.0-rc.0/docs/tracing.md) (#1973, #2021) |
| `tracing.responseTraceHeaders` | No | `true` | Every response carries the W3C `traceparent` of Core's root span plus `X-DIAL-TRACE-ID` and `X-DIAL-SPAN-ID`, exposed via CORS. Nothing is emitted when no valid span context exists (no OpenTelemetry SDK attached) (#1973, #2021) |
| `tracing.conversationIdHeaders` | No | `["x-claude-code-session-id", "thread-id", "x-session-id", "x-dial-client-channel-id", "X-CONVERSATION-ID"]` | Request headers, in priority order, whose first usable value is published as `gen_ai.conversation.id`. Values over 256 chars are skipped; credential header names are rejected with a warning. A configured array replaces the default rather than extending it (#1973) |
| `proxy.additionalHopByHopHeaders` | No | `[]` | Extra header names stripped from proxied requests and responses on top of the built-in hop-by-hop list. Matched case-insensitively (#2008) |

> [!NOTE]
> `tracing` is a **static** setting, so changes require a restart. A `tracing` block placed in the dynamic config (`aidial.config.json`) is ignored.

##### Settings with changed behavior

| Variable | Old behavior | New behavior |
|---|---|---|
| `invitations.ttlInSeconds` | Ignored for share invitations: if a role had no `share.<RESOURCE_TYPE>.invitation_ttl`, a hardcoded 72 h was used | Used as the default invitation TTL, rounded up to whole hours. Must be a positive integer: `0` or a negative value now **fails startup** (#2067) |
| `client.proxyOptions.*` / `client.nonProxyHosts` | Not applied when fetching identity-provider JWKS (`identityProviders.*.jwksUrl`) | JWKS fetching goes through the configured outbound proxy, honoring `client.nonProxyHosts`. Make sure the proxy can reach the IdP, or add the IdP host to `client.nonProxyHosts` (#2035) |

##### New dynamic settings

| Setting | Description |
|---|---|
| `routes.<name>.upstreams[].authType` | How `key` is sent upstream: `API_KEY` (default, `API-KEY: <key>`) or `BEARER` (`Authorization: Bearer <key>`, e.g. OpenRouter). `BEARER` requires `key`. Honored only on top-level `routes`; application routes ignore it (#2085) |
| `rateLimitSchedule` in Global Settings | The deployment-wide rate-limit calendar anchor can now be managed through the Global Settings admin API (#1987) |
| Model `pricing.prompt` / `pricing.completion` | Now accept the decision-tree shape (`{test, ifTrue, ifFalse}`) already supported for `cacheRead` / `cacheWrite`. Flat string rates are unchanged (#2038) |

##### Behavioral changes

> [!NOTE]
> These take effect on upgrade with no config change.

- **Trace correlation headers and GenAI attributes are on by default** — responses gain `traceparent`, `X-DIAL-TRACE-ID` and `X-DIAL-SPAN-ID` headers; spans and OTel log records gain `gen_ai.*` and `dial.*` attributes. Set `aidial.tracing.genAiSpanAttributes` / `aidial.tracing.responseTraceHeaders` to `false` to opt out (#1973, #2021)
- **More spans per trace** — new child spans cover storage, Redis, auth, JWKS, KMS, OAuth, rate-limit and deployment-resolution work (`resource.*`, `blob.*`, `rate_limit.check`, `auth.*`, `kms.*`, `oauth.request`, `deployment.resolve`), plus a new `dial_blob_operation` timer metric (#2087, #2088)
- **Stricter Admin config writes** — apply/validate now enforce the entity-name pattern `^[A-Za-z0-9._%:@\[\]()-]+$` (previously only on single-entity PUT/DELETE; `@`, `[`, `]`, `(`, `)` are now allowed) (#2053, #2060); a project key whose secret is already used by another key is rejected, existing duplicates only log a warning on load (#1980); model `catalog_properties` are validated against `catalog_schema_id` (#2025)
- **Interceptor errors** — a malformed interceptor response header now returns `502` to the client instead of leaving the stream open (#2011)
- **Deployment listing resilience** — one broken deployment no longer fails the whole listing endpoint (#2017)

##### API / contract changes

> [!NOTE]
> Full reference in [`open_api_core.yaml`](https://github.com/epam/ai-dial-core/blob/0.49.0-rc.0/docs/open_api_core.yaml).

- **New endpoints** — `POST /openai/v1/chat/completions` (#2005), `POST /openai/responses` mirroring `/openai/v1/responses` (#2068), `GET /v1/deployment-names?type=model|application|toolset` (#2075), `GET /v1/deployments/{deployment_name}/usage` (#2073). Add these paths to ingress or API-gateway allowlists if any are in place
- **Additive** — `deploymentTypes=model|application` query parameter on the usage/limits APIs to attribute application spend; defaults to `model` (#2032)
- **Changed shape** — `pricing.prompt` / `pricing.completion` in deployment listings are a string for flat rates and an object when a decision tree is configured. Clients that parse them strictly as strings must handle both (#2038)

---

#### ai-dial-admin-backend `0.22.0-rc.0`

##### Prerequisites

> [!IMPORTANT]
> Conditional (decision-tree) pricing is only understood by newer DIAL Core releases: conditional `cacheRead` / `cacheWrite` require **DIAL Core ≥ 0.48.0** (#1160), conditional `prompt` / `completion` require **DIAL Core ≥ 0.49.0** (#1175). This release adds the Core `0.49.0` config schema used by config export/import.

##### Database migrations
> [!NOTE]
> Flyway applies these automatically on startup; the service account needs DDL privileges.

- `V1.123__AddResponsesEndpointToInterceptorTables.sql` (PostgreSQL, MS SQL Server, H2) — adds the nullable `responses_endpoint` column to `interceptor_entity` and `interceptor_entity_aud`; additive, existing rows read back as `null` (#1165)

##### Behavioral changes
> [!NOTE]
> These take effect automatically on upgrade — no operator action required.

- **Model pricing validation** — creating or updating a model now validates `pricing`: `unit` must be set; every rate must be a non-blank, finite number; `cacheRead` / `cacheWrite` are rejected unless `unit` is `token`; decision trees are allowed only for unit `token`. Existing models are not re-validated until they are next saved (#1160, #1175, #1181)
- **Config export to Kubernetes** — `CONFIG_EXPORT_CREATE_RESOURCES=true` now really creates a missing target Secret / ConfigMap (previously the export failed). With `false` (the default) a missing resource still fails the export (#1169)
- **Config export of conditional pricing** — conditional cache pricing rules are kept on export instead of being dropped (#1174)

##### API / contract changes

- **Changed** — `pricing.prompt`, `pricing.completion`, `pricing.cacheRead` and `pricing.cacheWrite` accept either a flat rate (as before) or a `{test: {field, operator, value}, ifTrue, ifFalse}` decision-tree node. Flat rates are still returned as plain strings (#1160, #1175)
- **Additive** — `defaults` and `overridePaths` on deployment interface DTOs; `overridePaths` is rejected for interfaces in `TRANSLATOR` mode (#1152, #1154)
- **Additive** — `responsesEndpoint` on interceptor DTOs (#1165)

---

#### ai-dial-admin-frontend `0.22.0-rc.0`

> [!IMPORTANT]
> This release renames the Analytics Sessions flag, changes several `DISABLE_MENU_ITEMS` values and routes, and must be deployed together with ai-dial-admin-backend `0.22.0`. See the [infrastructure changelog](https://github.com/epam/ai-dial-admin-frontend/blob/0.22.0-rc.0/docs/INFRA-CHANGELOG.md) for details.

##### Renamed environment variables

| Old variable | New variable | Notes |
|---|---|---|
| `ANALYTICS_CONVERSATIONS_ENABLED` | `ANALYTICS_SESSIONS_ENABLED` | The Analytics Conversations view is renamed Sessions. The old name is no longer read — if it is not renamed, the Sessions item stays hidden. Takes effect only when `ANALYTICS_ENABLED` is `true` (#4633) |

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANALYTICS_USAGE_ENABLED` [Preview] | No | `false` | Serves the analytics Dashboards page (built on the usage log) at `/dashboards` and moves the `Dashboards` menu item to the top of the `Analytics` group. Takes effect only when `ANALYTICS_ENABLED` is `true`. Also enables the usage dashboard on entity and application Audit tabs (#4625, #4675, #4818, #4821) |
| `DIAL_ANALYTICS_RUNNER_API_URL` [Preview] | No | unset | Base URL of the Analytics enrichment runner (pipeline Runtime tab, pause/resume, Failures card, Groups tab). Unset hides every runtime control (#4789, #4827, #4849) |

##### Changed `DISABLE_MENU_ITEMS` values

| Value | Change |
|---|---|
| `analyticsconversations` | Replaced by `analyticssessions`; the old value no longer matches anything (#4633) |
| `evaluators` | Removed — the Analytics Evaluators page is folded into the pipeline enrichment transform block (#4641) |
| `platformcatalogschemas` | New — Catalog Schemas item in the `Catalog` group (#4556) |
| `dashboard` | Unchanged — still hides the (now unified) `Dashboards` item (#4675) |

##### Route changes

- `/dashboard` and `/usage` redirect to the new `/dashboards` route (#4675)
- `/conversations-trace` is renamed `/sessions` with no redirect — existing bookmarks return 404 (#4633)
- `/evaluators` and `/evaluators/{name}` are removed (#4641)

##### Prerequisites

- **Admin backend** — model pricing is sent as either a flat rate or a decision tree; deploy with ai-dial-admin-backend `0.22.0` (#4609, #4899)
- **DIAL Core** — conditional `cacheRead` / `cacheWrite` need Core `0.48.0`+, conditional `prompt` / `completion` need Core `0.49.0`+ (#4609, #4899)
- **Analytics data-access service** — the pipeline console now sends `transform` instead of evaluator references and no longer calls `/v1/evaluators*`; it requires an Analytics service build with the evaluator-to-pipeline fold. Enrichment pipelines can no longer use the `on_ingest` trigger or `advanced.scan_every` (#4641, #4851, #4890, #4898)
- **Themes config** — the config served at `THEMES_CONFIG_URL` must define the ui-kit 2.0 color tokens (`bg-layer-base`, `bg-layer-raised`, `bg-layer-sunken`, the `bg-control-*`, `text-control-*` and `stroke-*` families, `bg-gradient-*`, `shadow-*`) in every theme. ai-dial-chat-themes `0.21.0` already defines them; custom theme configs must be updated (#4869)

##### Behavioral changes
> [!NOTE]
> These take effect automatically on upgrade.

- **Default theme** — the built-in default theme switches from dark to light (#4877)
- **Import / Export config** — stays available without `DIAL_ADMIN_API_URL` whenever `DEPLOYMENTS_ENABLED` or `ANALYTICS_ENABLED` is on, and gains an Analytics scope (#4890, #4898, #4912)
- **Container image** — `npm` / `npx` are removed from the runtime image and the entrypoint is `node node_modules/next/dist/bin/next start` instead of `npm run start`. Deployments that override the container `command` / `args` with `npm …` must be updated (#4882)

---

#### ai-dial-admin-evaluation-framework-backend `0.5.0-rc.0`

##### New environment variables

All variables below ship with a working default, so none of them has to be set in a default deployment. Every new feature they control is **off** by default.

| Variable | Required | Default | Description |
|---|---|---|---|
| `SPRING_AI_MCP_SERVER_ENABLED` | No | `false` | Turns on the inbound MCP server (Streamable HTTP, tools only) at `/mcp`. `/mcp` requires the same authentication as `/api/v1/**`. Offers `list_deployments` and `get_deployment` tools (#208) |
| `SPRING_AI_MCP_SERVER_PROTOCOL` | No | `STATELESS` | `STATELESS` keeps no sessions and works with any replica; `STREAMABLE` uses in-memory `Mcp-Session-Id` sessions and needs a single replica or sticky sessions. `SSE` is not supported (#208) |
| `DIAL_APP_PROXY_ENABLED` | No | `false` | Turns on DIAL Application mode: runs are started through a DIAL Core Application Route and deployments are called with DIAL Core's per-request key instead of the user's JWT, so JWT expiry no longer fails long runs. **Requires `config.rest.security.api-key.enabled=true`**, otherwise startup fails. EF must be registered in DIAL Core (see `docs/configuration.md` §5.7) (#236) |
| `DIAL_APP_PROXY_DEPLOYMENT_NAME` | No | `EF` | Name of the DIAL Core deployment EF is registered under (#236) |
| `DIAL_APP_PROXY_HEARTBEAT_INTERVAL_MS` | No | `30000` | SSE heartbeat interval of the internal execute endpoint, keeps the connection within DIAL Core's idle timeout (#236) |
| `DIAL_APP_PROXY_TRIGGER_READ_TIMEOUT_MS` | No | `43200000` | Read timeout (12 h) for EF's call to the DIAL Core Application Route (#236) |
| `QUERY_DSL_EXTENSION_TEST_SUITE_RUN_COST_ENABLED` | No | `false` | Adds a derived `total_cost` key to row-mode `test_suite_runs` query results, fetched from dial-adas (#222) |
| `QUERY_DSL_EXTENSION_TEST_SUITE_RUN_COST_TIMEOUT_SEC` | No | `2` | Deadline in seconds (min `1`) for the per-page cost lookup (#222) |
| `CSV_IMPORT_ZIP_MAX_ENTRIES` | No | `1000` | Maximum number of entries in an imported test-case ZIP archive; larger archives are rejected with `400` (#227, #228) |
| `CSV_IMPORT_ZIP_MAX_TOTAL_UNCOMPRESSED_SIZE` | No | `1GB` | Maximum total uncompressed size of an imported ZIP (#227, #228) |
| `CSV_IMPORT_ZIP_MAX_MANIFEST_SIZE` | No | `1MB` | Maximum size of the archive's `manifest.json` (#227, #228) |

##### Behavioral changes
> [!NOTE]
> These take effect automatically on upgrade. Items marked **Action** may require operator attention.

- **Per-test-case scoring** (**Action:** expect score shifts) — for `Mean` / `WeightedMean` suites, a test case's rows (reruns × requests × turns) are first merged into one per-metric aggregate, so every test case counts equally in the run-level `overall`. New computations can give different scores than `0.4.0` for the same data. `testCaseOverallScore` now rejects `custom_function` (#231)
- **Run metric snapshots moved to the meta database** — `run_metric_snapshots` now lives in meta with a cascading FK to `test_suite_runs`; history is copied once from analytics (see below), the analytics copy is left frozen (#199)
- **Average test-case cost via dial-adas SQL API** (**Action:** check dial-adas) — `CostService` calls dial-adas `POST /v1/queries/execute-sql`; the dial-adas instance at `DIAL_ADAS_URL` must expose this endpoint, otherwise the run-costs endpoints return `502` (#207)
- **API-key callers** — an `Api-Key` caller's key is passed on to DIAL Core, toolsets and MCP calls; `createdBy` is the introspected principal instead of `anonymous` (#208)
- **API-key role resolution** (**Action:** if you use API keys with OIDC) — when `config.rest.security.mode=oidc` and the introspected `userClaims.iss` matches a configured provider, that provider's `roleClaims` are used; `API_KEY_USER_CLAIMS_ROLE_CLAIM` is only a fallback. Re-check `API_KEY_DEFAULT_ROLES_MAPPING` (#241, #248)
- **ZIP import/export uses disk** (**Action:** size ephemeral storage) — uploads and exports are staged in temp files; the container temp directory must be writable and large enough for the biggest archive (#227, #228, #232)
- **Deployment listing with new DIAL Core pricing** — deployments endpoints no longer break when DIAL Core returns `pricing.prompt` / `pricing.completion` as objects (#244, #247)

##### Database migrations
> [!NOTE]
> Flyway applies these automatically on startup; the service account needs DDL privileges on both schemas. The meta Flyway now runs **after** the analytics Flyway and opens a read connection to the analytics datasource (for `V1_33`).

- **analytics** — `V1.20__CreateTestCaseMetricScoresAggregatedTable.sql` — creates `test_case_metric_scores_aggregated` (one row per run / test case / computation, JSONB `metric_scores`); no backfill (#231)
- **analytics** — `V1.21__AddRunCaseContextToTestCaseEvalScores.sql` — **drops and recreates** `test_case_eval_scores` with a surrogate `id` PK and denormalized run/test-case context; `eval_summary_id` is removed (#231)
- **meta** — `V1.32__CreateRunMetricSnapshotsTable.sql` — creates `run_metric_snapshots` in meta with `ON DELETE CASCADE` to `test_suite_runs` (#199)
- **meta** — `V1_33__CopyRunMetricSnapshotsFromAnalytics` (Java migration) — copies analytics `run_metric_snapshots` into meta in batches of 1000; rows of runs that no longer exist are dropped (#199)
- **meta** — `V1.34__ReplaceRunMetricSnapshotsRunIndex.sql` — replaces `idx_run_metric_snapshots_run` with `idx_run_metric_snapshots_run_computed_at` (#201)
- **meta** — `V1.35__AddMetricScoreAggregationToTestSuites.sql` — adds `test_suites.metric_score_aggregation VARCHAR(10) NOT NULL DEFAULT 'AVG'` (#231)

> [!CAUTION]
> `V1.21` runs `DROP TABLE IF EXISTS test_case_eval_scores`. **When upgrading from `0.4.0`, all stored per-test-case `score` / `passed` values are deleted**; old runs get them back only through a new metric computation. Back up the table first if you need those values.
>
> `V1_33` copies every snapshot row during startup, so startup takes longer when the analytics table is large. `V1.34` holds an exclusive lock on `run_metric_snapshots` until the migration commits.

##### API / contract changes
> [!NOTE]
> Full reference in Swagger UI (`/swagger-ui.html`).

- **Breaking** — `score` / `passed` (added in `0.4.0`) are removed from eval-summary list, detail and export DTOs and from the `eval_summaries` Query DSL entity; test-case scores are read through the new `test_case_eval_scores` entity (#231)
- **Breaking** — `GET /api/v1/test-suites/{testSuiteId}/template-variables` and `.../test-cases/{testCaseId}/template-variables` return an object keyed by request index (`"0"` is the suite's own request, `"n"` is `additionalRequests[n-1]`) instead of a flat array #217 (#235)
- **Breaking** — try-it-out `variables` is now keyed by request index (`{"0": {...}, "1": {...}}`); out-of-range or non-integer indexes return `400` #217 (#235)
- **Changed** — `pricing.prompt` / `pricing.completion` on deployment DTOs are passed through as-is (string or object) #243 (#244, #247)
- **Moved** — run metric snapshots are served at `/api/v1/run-metric-snapshots`; `/api/v1/analytics/run-metric-snapshots` remains as a deprecated alias (#199)
- **New endpoints** — `POST /api/v1/costs/test-suite-runs` (total cost for up to 1000 runs) (#205), `GET /api/v1/test-suites/{testSuiteId}/metric-definitions/aggregated` #224 (#226), `POST /api/internal/runs/{runId}/execute` (only when `DIAL_APP_PROXY_ENABLED=true`) (#236), `/mcp` (only when `SPRING_AI_MCP_SERVER_ENABLED=true`) (#208)
- **Additive** — new Query DSL entities `test_suite_runs`, `test_case_eval_scores`, `test_case_metric_scores` (#201, #206, #221, #222, #231); `case` expression for `dial_usage_log` (#205); `metricScoreAggregation` on test-suite DTOs and `unmatchedEvalTestCaseIds` on run-comparison DTOs (#231); ZIP import/export with `manifest.json` and attached files #225 (#227, #228, #232)

---

#### ai-dial-chat `1.2.0-rc.0`

> [!IMPORTANT]
> This release changes the BFF session cookie format (payload v2). **All existing user sessions are invalidated on upgrade and users have to sign in again.** Upgrade all chat replicas at once so sessions are not enforced inconsistently during the rollout (#8990).

##### Prerequisites

> [!IMPORTANT]
> **DIAL Core ≥ 0.48.0** is required to enable `RESPONSES_BACKGROUND_ENABLED` (#9236).

##### Breaking changes

**Rolling server-enforced session expiration (session payload v2)**

The session cookie now carries a rolling `session_exp` deadline enforced by the server; a successful token refresh renews it. Legacy v1 cookies are rejected. The lifetime is set with the new `AUTH_SESSION_MAX_AGE_SECONDS` (default 30 days) and can be shortened by a known refresh-token expiry (#8990).

| Previous configuration | Required action |
|---|---|
| Session cookies issued by ai-dial-chat `1.1.x` | None (users sign in again). Roll out all replicas at once. Set `AUTH_SESSION_MAX_AGE_SECONDS` if 30 days does not match your policy |

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `AUTH_SESSION_MAX_AGE_SECONDS` | No | `2592000` (30 days) | Rolling session lifetime in seconds (`1`–`2147483647`). A successful token refresh resets the deadline. An invalid value fails startup. (#8990) |
| `ALLOWED_CONNECT_ORIGINS` | No | unset | Comma-separated HTTP(S) origins added to CSP `connect-src` for external PDF and Office previews. Origins only, a single leading `*.` subdomain pattern is supported. An invalid entry fails startup. (#9012, #9023) |
| `USER_USAGE_DEPLOYMENT_TYPES` | No | `model,application` | Deployment kinds reported by `GET /api/v1/user/limits` and `GET /api/v1/user/usage` when a request names none. Set `model` to keep the model-only report of `1.1.0`. (#9147) |
| `CUSTOM_CORE_API_CONFIG` | No | unset | Server-only JSON allowlist of exact GET DIAL Core paths exposed through `GET /api/v1/custom-api/:operationId` (max 16 KiB, 64 operations). Example: `{"version":1,"operations":[{"id":"data-products","method":"GET","corePath":"/data-products"}]}`. An invalid value fails startup. (#9266) |
| `RESPONSES_BACKGROUND_ENABLED` | No | `false` | Starts eligible Responses generations as DIAL Core background jobs, so a generation survives browser disconnects and BFF restarts. Used only when `RESPONSES_API_ENABLED=true` and the deployment supports the Responses API. Requires DIAL Core ≥ 0.48.0. (#9236) |
| `GENERATION_FINALIZE_TIMEOUT_MS` | No | `60000` | Time in ms after which listeners of a generation whose final write never settles are released (min `1000`). (#8953) |
| `ALLOW_VISUALIZER_SEND_MESSAGES` | No | `false` | Lets custom and application visualizer iframes post `SEND_MESSAGE` as a user message. Enable only for trusted visualizers. (#9246) |
| `UI_EVENT` | No | unset | Start-page celebration module: `halloween` or `new-year`. Unset or `none` disables it. (#9033) |
| `MCP_APP_HOST_NAME` | No | unset (`ai-dial-chat`) | Identifier sent to MCP Apps as `hostInfo.name` during `ui/initialize`. (#8919) |
| `TEXT_REFINEMENT_SKILL_DESCRIPTION_PROMPT`, `TEXT_REFINEMENT_SKILL_INSTRUCTIONS_PROMPT`, `TEXT_REFINEMENT_SCHEDULED_TASK_DESCRIPTION_PROMPT`, `TEXT_REFINEMENT_SCHEDULED_TASK_INSTRUCTIONS_PROMPT`, `TEXT_REFINEMENT_APPLICATION_DESCRIPTION_PROMPT`, `TEXT_REFINEMENT_TOOLSET_DESCRIPTION_PROMPT`, `TEXT_REFINEMENT_PROMPT_DESCRIPTION_PROMPT` | No | unset (built-in prompt) | Override the built-in "Refine with AI" prompt for the corresponding field. Server-only. (#9034, #9286) |
| `CONVERSATION_NAMING_SYSTEM_PROMPT` | No | unset (built-in prompt) | Overrides the system prompt for automatic conversation naming and the Rename action. Server-only. (#9034) |
| `TRANSCRIPTION_PROMPT` | No | unset (built-in prompt) | Overrides the prompt for audio transcription through `ASR_MODEL`. Server-only. (#9034) |
| `HTTP_PROXY` / `HTTPS_PROXY` / `NO_PROXY` | No | unset | Standard proxy variables (lowercase variants also read). Applied to outbound OIDC, themes and DIAL Core calls. (#9038, #9084) |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `CORS_ORIGIN` | `http://localhost:4207` | value of `AUTH_CALLBACK_BASE_URL` | Set explicitly only when the frontend is served from a different origin. (#9022) |
| `AUTH_POST_LOGOUT_REDIRECT_URI` | unset | value of `AUTH_CALLBACK_BASE_URL` | Set explicitly only when the post-logout page must differ. It must be registered in each IdP client. (#9022) |
| `FILE_MANAGER_AVAILABLE_TABS` | `my_files,shared,organization` | `all,my_files,shared,organization` | New `all` tab on the File storage page. Deployments that set this variable explicitly must add `all` to get it. (#9117) |

##### Removed environment variables

| Variable | Reason |
|---|---|
| `SKILL_USAGE_ENABLED` | The skill-usage kill switch was retired; the skill-usage UI is always available. A value left set is ignored. (#9119) |

##### New feature flags

| Flag | Description |
|---|---|
| `features.responsesBackgroundEnabled` | Server-only. Toggled through `RESPONSES_BACKGROUND_ENABLED`, default `false`. (#9236) |
| `features.visualizerSendMessages` | Client-visible. Toggled through `ALLOW_VISUALIZER_SEND_MESSAGES`, default `false`. (#9246) |

##### Removed feature flags

| Flag | Reason / replacement |
|---|---|
| `features.skillUsageEnabled` | No replacement — the skill-usage UI is always enabled. (#9119) |

##### New `ENABLED_UI_FEATURES` values

| Value | Description |
|---|---|
| `starters-below-greeting` | Moves conversation starters on the empty-chat screen between the greeting and the input. (#9155) |
| `hide-greeting` | Hides the greeting on the empty-chat screen, together with the welcome-screen description. (#9155) |
| `show-agent-description` | Shows the selected agent's `description` on the empty-chat screen. (#8883) |
| `disable-input-history-navigation` | Stops the Up/Down keys in the chat input from cycling through previously sent messages. (#9037) |
| `hide-conversation-export` | Hides the "Export" and "Export all" entries; import stays available. (#9037) |
| `hide-settings-page` | Hides the Settings page entry; a direct `/settings` URL redirects to `/`. (#9037) |
| `show-header-logo` | Shows the theme logo in the top bar. (#9051, #9155) |

##### New container images

| Image | Contents |
|---|---|
| `epam/ai-dial-chat-bff` | BFF only, for a frontend hosted elsewhere (used by ai-dial-quickapps-frontend `0.3.0`). Reads the same environment variables as the full image. (#9212) |
| `epam/ai-dial-chat-mcp-app-sandbox` | Separate-origin MCP Apps sandbox proxy. Requires `MCP_APP_SANDBOX_ALLOWED_HOST_ORIGINS`; point chat's `MCP_APP_SANDBOX_URL` at it. (#8890) |

##### Behavioral changes

> [!NOTE]
> These take effect on upgrade with no operator action, unless stated otherwise.

- **Boolean env parsing fixed** — `SCHEDULED_TASKS_ENABLED`, `LIVE_CHAT_INTERACTION_ENABLED` and `LLM_CONVERSATION_NAMING_ENABLED` set to `"false"` were previously read as `true`; they are now read as `false`. Check these values before upgrading. (#9142)
- **Outbound proxy honored** — if `HTTP_PROXY` / `HTTPS_PROXY` are present in the pod environment, OIDC, themes and DIAL Core calls go through that proxy. Add in-cluster hosts (e.g. the DIAL Core service) to `NO_PROXY`. (#9038, #9084)
- **Usage report** — Settings → Usage now also lists application rows (see `USER_USAGE_DEPLOYMENT_TYPES`). (#9147)
- **Referrer policy** — `Referrer-Policy: strict-origin-when-cross-origin` instead of `no-referrer`. (#8973)
- **AI text refinement** — "Refine with AI" is available whenever `UTILITY_MODEL` is set. Leave `UTILITY_MODEL` unset to keep it disabled. (#9034, #9286)
- **Application visualizers** — `APPLICATION_VISUALIZERS` entries accept optional `borderless` and `withoutTitle`; the legacy `expanded` option is ignored. (#9066)

---

#### ai-dial-chat-themes `0.21.0`

> [!NOTE]
> The bundled `static/config.json` adds the ui-kit 2.0 tokens required by ai-dial-admin-frontend `0.22.0`. If you override `config.json`, merge in the new tokens: dark theme `bg-layer-*`, `bg-control-*`, `text-*`, `stroke-*`, `shadow-xs-1`…`shadow-lg`; light theme `stroke-accent-focus`, `shadow-xs-1`…`shadow-lg`, `bg-control-error-alpha`, `bg-control-accent-muted`, `bg-control-accent-alpha-*-subtle`. `bg-layer-6` and `bg-layer-7` were removed from the light theme (#156, #158).

---

#### ai-dial-quickapps-backend `0.13.0-rc.0`

##### Prerequisites

> [!IMPORTANT]
> **DIAL Core ≥ 0.49.0** is required for the per-user tool access filter (`features.tool_access_filter`), which uses DIAL Core `GET /v1/deployment-names` (#598, #624). On an older DIAL Core the filter fails open and all configured tools are offered.

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `SKILL_INVOCATION_MAX_SKILLS_PER_MESSAGE` | No | `5` | Maximum skills (`> 0`) honoured on one user message (`custom_content.skills`); extra picks are ignored with an *Initialization issues* warning. Clamped to `SKILL_INVOCATION_MAX_SKILLS`. Preview-gated. (#574) |

##### Behavioral changes

> [!NOTE]
> These take effect on upgrade with no config change.
>
> - **Several skills per message** — a user message may invoke up to `SKILL_INVOCATION_MAX_SKILLS_PER_MESSAGE` skills; previously only the first was loaded (#574).
> - **Nested sub-app stages** — stages of a Quick App called as a deployment tool are shown nested under the `Calling X` stage. On by default; set `features.stage_display.propagate_sub_stages: false` to turn it off (#537).
> - **Unknown tool calls no longer fail the request** — the model gets `This tool does not exist. Check the tool name and try again.` and the loop continues (#586, #590).
> - **Undeclared message fields are scrubbed** — extra fields such as `custom_content.annotations` / `custom_content.skills` are stripped before reaching the orchestrator model (#562).
> - **`custom_fields.configuration` is forwarded** — under the orchestrator `deployment.parameters` it is now sent to the deployment (#575, #612).
> - **Long tool error messages are capped** — validation error text is truncated at 4000 characters, URLs at 200 characters (#578, #611).
> - **`add_attachment` type inference** — a missing `type` is inferred from the URL or `title` extension instead of defaulting to `text/plain` (#600, #629).
> - **Hooks (preview)** — hook `arguments` are rendered as a [JSON-e](https://json-e.js.org) template: literal `${` sequences in existing arguments must be escaped as `$${`. Hooks now have a timeout (`timeout_seconds`, default `15` s for `on_request_start`, `30` s for `on_completion`) (#607).
> - **Deferral for `dial-deployment` toolsets** — `deferred: true` now applies, subject to `MIN_TOOLS_FOR_DEFERRAL` (#591, #592).
> - **Stage names** — MCP and REST API tool stages are named `<toolset>: <tool>` (#587, #613).

##### Schema changes

> [!NOTE]
> All additions are optional; existing manifests stay valid.

| Key | Affected config model | Description |
|---|---|---|
| `features.tool_access_filter.enabled` | `ToolAccessFilterConfig` (new) | Default `false`. Limits DIAL deployment tools, `dial-app` and `dial-mcp` toolsets to those accessible to the calling user. Requires DIAL Core ≥ 0.49.0 (#598, #624) |
| `features.stage_display.propagate_sub_stages` | `StageDisplayConfig` | Default `true` (#537) |
| `hidden_from_model` | `MCPToolSet`, `DialMCPToolSet`, `DialAppToolSet` | Preview. MCP tools callable by hooks but never shown to the model (#619) |
| `orchestrator.attachment_strategy.accepted_types` | `LazyOnDemandAttachmentStrategy` | Optional MIME allowlist narrower than the deployment's `input_attachment_types` (#558) |
| `hooks[].event: on_completion` | `HookEvent` | New event, runs after the orchestrator loop ends (#607) |
| `hooks[].timeout_seconds` | `ToolCallHookConfig` | Optional per-hook timeout (#607) |

---

#### ai-dial-quickapps-frontend `0.3.0-rc.0`

> [!IMPORTANT]
> This release moves the editor from a standalone Next.js server with `next-auth` to a static React build served by the ai-dial-chat BFF (`epam/ai-dial-chat-bff`), which also handles authentication. The Docker image is different and **the runtime environment variables have changed** — an existing `0.2.0` configuration will not work unchanged (#149, #155, #162). Please review the [full changelog](https://github.com/epam/ai-dial-quickapps-frontend/blob/0.3.0-rc.0/CHANGELOG.md) before proceeding.

##### Prerequisites

> [!IMPORTANT]
> **ai-dial-chat ≥ 1.2.0** must be deployed **before** this version. The editor reads the application name from the `applicationName` query parameter of its entry URL, which only chat `1.2.0` sends. Without it, **Save & Exit** and **Preview** stay disabled with no error (#232).

##### Renamed environment variables

| Old variable | New variable / location |
|---|---|
| `NEXTAUTH_SECRET` | `AUTH_SESSION_SECRET` (64 hex chars; `AUTH_SESSION_PREV_SECRET` for rotation) |
| `NEXTAUTH_URL` | `AUTH_CALLBACK_BASE_URL` |
| `THEMES_URL` | `THEMES_CONFIG_URL` (base URL; `/config.json` is appended automatically) |
| `ALLOWED_FRAME_ANCESTORS` | `ALLOWED_IFRAME_ORIGINS` |
| `QUICK_APPS_DEFAULT_MODEL` | `DEFAULT_DEPLOYMENT` |
| `CODE_INTERPRETER_ENABLED` | `CUSTOM_CLIENT_VARIABLES.codeInterpreterEnabled` (JSON boolean) |
| `WEB_FETCH_ENABLED` | `CUSTOM_CLIENT_VARIABLES.webFetchEnabled` (JSON boolean) |
| `ADD_ATTACHMENT_ENABLED` | `CUSTOM_CLIENT_VARIABLES.addAttachmentEnabled` (JSON boolean) |
| `ALLOWED_ORIGIN` | `CUSTOM_CLIENT_VARIABLES.allowedOrigin` (one origin, a comma- or space-separated list, or a JSON array) (#198) |
| `DIAL_ADMIN_URL` | `CUSTOM_CLIENT_VARIABLES.dialAdminHost` |
| `DIAL_CHAT_URL` | `CUSTOM_CLIENT_VARIABLES.dialChatHost` |
| `AUTH_KEYCLOAK_ISSUER` / `AUTH_KEYCLOAK_CLIENT_SECRET` | `AUTH_KEYCLOAK_HOST` / `AUTH_KEYCLOAK_SECRET` |
| `AUTH_AUTH0_ISSUER` / `AUTH_AUTH0_CLIENT_SECRET` | `AUTH_AUTH0_HOST` / `AUTH_AUTH0_SECRET` |
| `AUTH_AZURE_AD_CLIENT_SECRET` | `AUTH_AZURE_AD_SECRET` |

> [!NOTE]
> For other identity providers, apply the same renames; the authoritative names are in the ai-dial-chat BFF documentation.

##### Removed environment variables

| Variable | Reason |
|---|---|
| `QUICK_APPS_APPLICATION_NAME` | The host passes the application name per load as the `applicationName` URL query parameter, so one deployment can serve several applications (#232) |

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `CORS_ORIGIN` | Yes | unset | Origin(s) allowed to call the app's API. Usually the same as `AUTH_CALLBACK_BASE_URL` |
| `AUTH_POST_LOGOUT_REDIRECT_URI` | Yes | unset | Post-logout redirect. Usually the same as `AUTH_CALLBACK_BASE_URL` |
| `AUTH_SESSION_PREV_SECRET` | No | unset | Previous session secret for zero-downtime rotation |
| `AUTH_SESSION_COOKIE_NAME` | No | `__Host-quickapps.sess` | Session cookie name. Must differ from chat's own cookie names |
| `AUTH_TRANSACTION_COOKIE_NAME` | No | `__Host-quickapps.tx` | OAuth/OIDC handshake cookie name |
| `AUTH_LEGACY_COOKIE_NAMES` | No | unset | Comma-separated old cookie names to expire. List the previous `next-auth` cookie names to avoid `HTTP 431 Request Header Fields Too Large` |
| `CUSTOM_CLIENT_VARIABLES` | No | unset | JSON object with the editor-specific settings listed above. Feature toggles default to `false` |
| `API_PREFIX` | No | `api` | Path prefix for the API and health-check routes |
| `CSP_MODE` | No | `report-only` | Set `enforce` only after `report-only` shows no violations |
| `ALLOWED_CONNECT_ORIGINS` | No | unset | Extra origins allowed by CSP `connect-src` |
| `OTEL_SDK_DISABLED` | No | `true` | OpenTelemetry is off by default. Set `false` with the standard `OTEL_*` variables to enable it |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `ALLOWED_IFRAME_ORIGINS` (was `ALLOWED_FRAME_ANCESTORS`) | `'self'` | unset | CSP `frame-ancestors`. Set it to the exact chat/admin origin(s) |
| `DEFAULT_DEPLOYMENT` (was `QUICK_APPS_DEFAULT_MODEL`) | `gpt-4o` | unset | When unset or not available to the user, the first tool-capable model is pre-selected |
| `allowedOrigin` (was `ALLOWED_ORIGIN`) | `*` | unset (any origin) | Set it to the exact chat/admin origins in production |

##### OAuth redirect URI changed

The callback path moved from `/api/auth/callback/<provider>` to `/api/v1/auth/callback/<provider>`. Register `${AUTH_CALLBACK_BASE_URL}/api/v1/auth/callback/<provider>` with every identity provider, otherwise sign-in fails.

##### Behavioral changes

> [!NOTE]
> These take effect on upgrade with no operator action.
>
> - **Default orchestrator temperature** is now `0.5` instead of `1.0` for apps without `orchestrator.deployment.parameters.temperature` (#220).
> - **Instructions are required** — an app can't be saved with blank Instructions (#219).

---

#### ai-dial-analytics-realtime `0.29.0-rc.0`

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | No | `5` | Uvicorn `--timeout-keep-alive`, in seconds, read by the new Docker entrypoint. The default matches the previous effective value (#309) |

##### Behavioral changes

> [!NOTE]
> These take effect on upgrade with no config change.
>
> - **Docker entrypoint** — the image uses `ENTRYPOINT ["/docker_entrypoint.sh"]` instead of a `CMD` running `uvicorn`. With no arguments it starts the server as before; with arguments it runs them as a command. A deployment that passes only extra uvicorn flags as container `args` must pass the full `uvicorn …` command (#309).
> - **Event loop** — the server runs on `uvloop` and `httptools` (`uvicorn[standard]`) (#308).

---

#### ai-dial-adapter-bedrock `0.45.0-rc.0`

##### New environment variables

All variables below ship with a working default, so none of them has to be set in a default deployment.

| Variable | Required | Default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | No | `70` | Idle HTTP keep-alive timeout of the adapter server in seconds (uvicorn `--timeout-keep-alive`). Must be greater than DIAL Core's `client.keepAliveTimeout` (default `60`). Previously not configurable (uvicorn default `5`) (#517) |
| `ANTHROPIC_POOL_TIMEOUT` | No | `10` | Time in seconds a request waits for a free connection when `ANTHROPIC_MAX_CONNECTIONS` is reached; on timeout the adapter returns `503` (#519) |
| `THREAD_POOL_SIZE` | No | `512` | Size of the shared thread pool for blocking AWS SDK calls (Bedrock, Converse, STS) (#510) |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | not configurable (uvicorn default `5`) | `70` | The old 5 s value closed connections before DIAL Core expired them, so requests could fail with `Connection was closed` (#517) |
| `REQUEST_TIMEOUT_SECONDS` | `600`, applied to read, write **and pool** | `600`, applied to read and write only | The wait for a free connection is governed by `ANTHROPIC_POOL_TIMEOUT` (#519) |

##### Behavioral changes
> [!NOTE]
> These take effect automatically on upgrade — no operator action required, but connection and timeout behavior differs from `0.44.0`.

- **Fail fast on pool exhaustion** — when the Anthropic connection pool is full, a request gets `503` after `ANTHROPIC_POOL_TIMEOUT` seconds instead of queueing for up to the full request timeout (#519)
- **`ANTHROPIC_MAX_CONNECTIONS` is now per process** — all Anthropic clients share one HTTP connection pool, so `ANTHROPIC_MAX_CONNECTIONS` / `ANTHROPIC_MAX_KEEPALIVE_CONNECTIONS` cap the whole worker process instead of each client (#507)
- **Bounded AWS client caches** — Anthropic and boto client caches are LRU-bounded at 512 entries; the STS client is cached per region (#507)
- **Botocore timeouts bounded** — 5 s connect timeout for all AWS clients; control-plane calls (STS, credential refresh) use a 10 s read timeout with up to 3 attempts (#510)
- **Server runtime** — uvicorn runs with the `standard` extras (uvloop and httptools) (#516)

> [!IMPORTANT]
> The Docker image no longer has a `CMD`. `/docker_entrypoint.sh` starts uvicorn (with `--timeout-keep-alive "${TIMEOUT_KEEP_ALIVE:-70}"`) only when the container gets no arguments. If your deployment overrides the container `command` / `args` with its own uvicorn command line, `TIMEOUT_KEEP_ALIVE` is not applied — remove the override or add `--timeout-keep-alive` to it (#517)

---

#### ai-dial-adapter-openai `0.45.0-rc.0`

##### New environment variables

All variables below ship with a working default, so none of them has to be set in a default deployment.

| Variable | Required | Default | Description |
|---|---|---|---|
| `HTTP_MAX_CONNECTIONS` | No | `1000` | Maximum number of concurrent upstream connections per worker process, shared across all upstreams (#581) |
| `HTTP_MAX_KEEPALIVE_CONNECTIONS` | No | `100` | Maximum number of idle upstream connections kept open for reuse (#581) |
| `HTTP_POOL_TIMEOUT` | No | `10` | Time in seconds a request waits for a free upstream connection when `HTTP_MAX_CONNECTIONS` is reached; on timeout the adapter returns `503` (#581) |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | `5` | `70` | Idle HTTP keep-alive timeout of the adapter server (uvicorn `--timeout-keep-alive`). Must be greater than DIAL Core's `client.keepAliveTimeout` (default `60`). If you set `5` explicitly, remove it or raise it (#577) |

##### Behavioral changes
> [!NOTE]
> These take effect automatically on upgrade — no operator action required.

- **Fail fast on pool exhaustion** — the wait for a free connection is `HTTP_POOL_TIMEOUT` (`10` s) instead of the 600 s total timeout; on timeout the adapter returns `503` (#581)
- **`api-version` is optional where not needed** — a missing `api-version` query parameter is rejected only by endpoints that call the dated Azure OpenAI API; Azure OpenAI v1 API requests no longer need it (#558)
- **Responses API dated endpoints** — the Responses API passthrough is also served at `/openai/responses[...]?api-version=…` alongside `/openai/v1/responses[...]` (#561)
- **TTS configuration passthrough** — extra fields of `custom_fields.configuration` in TTS requests are forwarded to the upstream Speech API as is, enabling vLLM-Omni TTS deployments (must be listed in `VLLM_DEPLOYMENTS` when the upstream declares no `key`) (#578)
- **Server runtime** — uvicorn runs with the `standard` extras (uvloop and httptools) (#576)

---

#### ai-dial-adapter-vertexai `0.41.0-rc.0`

##### New environment variables

All variables below ship with a working default, so none of them has to be set in a default deployment.

| Variable | Required | Default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | No | `70` | Idle HTTP keep-alive timeout of the adapter server in seconds (uvicorn `--timeout-keep-alive`). Must be greater than DIAL Core's `client.keepAliveTimeout` (default `60`). Previously not configurable (uvicorn default `5`) (#553) |
| `HTTP_MAX_CONNECTIONS` | No | `250` | Maximum number of concurrent upstream connections. All SDK clients (Google GenAI, Anthropic, Mistral) share a single pool, so this caps the total upstream concurrency of the process (#557, #558) |
| `HTTP_MAX_KEEPALIVE_CONNECTIONS` | No | `75` | Maximum number of idle connections kept open for reuse (#557) |
| `HTTP_POOL_TIMEOUT` | No | `10` | Time in seconds a request waits for a free upstream connection; on timeout the adapter returns `503` (#557) |

##### Behavioral changes
> [!NOTE]
> These take effect automatically on upgrade, but upstream concurrency limits differ from `0.40.0`. Review `HTTP_MAX_CONNECTIONS` under high load.

- **Single shared upstream connection pool** — every upstream SDK client goes through one shared HTTP client per worker; total upstream concurrency per worker is capped by `HTTP_MAX_CONNECTIONS` (`250`). Raise it if a single worker served more concurrent upstream requests before (#549, #557, #558)
- **Unified upstream timeouts** — 5 s connect, 600 s read and write, and `HTTP_POOL_TIMEOUT` pool timeout, now also applied to Google GenAI requests (#557, #558)
- **Fail fast on pool exhaustion** — returns `503` when no upstream connection becomes free within `HTTP_POOL_TIMEOUT` (#557)
- **Server runtime** — uvicorn runs with the `standard` extras (uvloop and httptools) (#550)

> [!IMPORTANT]
> The Docker image no longer has a `CMD`. `/docker_entrypoint.sh` starts uvicorn (with `--timeout-keep-alive "${TIMEOUT_KEEP_ALIVE:-70}"`) only when the container gets no arguments. If your deployment overrides the container `command` / `args` with its own uvicorn command line, `TIMEOUT_KEEP_ALIVE` is not applied — remove the override or add `--timeout-keep-alive` to it (#553)

---

#### ai-dial-adapter-dial `0.20.0-rc.0`

##### New environment variables

All variables below ship with a working default, so none of them has to be set in a default deployment.

| Variable | Required | Default | Description |
|---|---|---|---|
| `HTTP_MAX_CONNECTIONS` | No | `1000` | Maximum number of concurrent upstream connections (#167) |
| `HTTP_MAX_KEEPALIVE_CONNECTIONS` | No | `100` | Maximum number of idle upstream connections kept open for reuse (#167) |
| `HTTP_POOL_TIMEOUT` | No | `10` | Time in seconds a request waits for a free upstream connection; on timeout the adapter returns `503` (#167) |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | `5` | `70` | Idle HTTP keep-alive timeout of the adapter server (uvicorn `--timeout-keep-alive`). Must be greater than DIAL Core's `client.keepAliveTimeout` (default `60`). If you set `5` explicitly, remove it or raise it (#165) |

##### Behavioral changes
> [!NOTE]
> These take effect automatically on upgrade — no operator action required.

- **Fail fast on pool exhaustion** — the wait for a free connection is `HTTP_POOL_TIMEOUT` (`10` s) instead of the 600 s total timeout; on timeout the adapter returns `503` (#167)
- **Server runtime** — uvicorn runs with the `standard` extras (uvloop and httptools) (#164)

> [!IMPORTANT]
> The Docker image no longer has a `CMD`; uvicorn is started by `/docker_entrypoint.sh` only when the container gets no arguments. If your deployment overrides the container `command` / `args`, `TIMEOUT_KEEP_ALIVE` handling is no longer supplied by the image (#165)

---
