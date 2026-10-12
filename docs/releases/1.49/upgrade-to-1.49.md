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
   - ai-dial-chat: `1.2.0-rc.1`
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

#### ai-dial-rag `0.43.0`

### Structured logs support

This release adds support for structured (JSON) logging, implemented by the `aidial-sdk`. Logging format is now configurable via new environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `DIAL_SDK_LOG_FORMAT` | `text` | Logging format. Set to `text` or `json`. Implemented by the DIAL SDK. |
| `DIAL_SDK_TEXT_LOG_FORMAT` | `'%(levelprefix)s \| %(asctime)s \| %(name)s \| %(process)d \| %(message)s'` | Logging format for text logs. Implemented by the DIAL SDK. |
| `DIAL_SDK_JSON_LOG_FORMAT` | `'{"level": "%(levelname)s", "time": "%(asctime)s", "logger": "%(name)s", "process": "%(process)d", "message": "%(message)s"}'` | Logging format for JSON logs. Implemented by the DIAL SDK. |

See the [full logging documentation](https://github.com/epam/ai-dial-sdk/blob/0.39.0/docs/logging.md) for details on logging configuration and available logging modes.

---

#### ai-dial-quickapps-backend `0.13.0-rc.0`

### Prerequisites

> [!IMPORTANT]
> **DIAL Core ≥ 0.49.0** (`GET /v1/deployment-names`) is required for the tool access filter (#624); on older Core the filter fails open and offers every configured tool. Tools pointing at custom (user-owned) applications are treated as inaccessible unless Core's `includeCustomApps` is on.

### New environment variables

| Variable                                  | Default | Description                                                                                                                                                                                 | Required |
|-------------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `SKILL_INVOCATION_MAX_SKILLS_PER_MESSAGE` | `5`     | Maximum skills (`> 0`) honoured on one message (`custom_content.skills`); extra picks are dropped and reported in the *Initialization issues* stage. Clamped to `SKILL_INVOCATION_MAX_SKILLS`. Preview-gated. | No       |

### Behavioral changes

> [!NOTE]
> - **Nested sub-app stages are on by default** — apps that call another QuickApp as a deployment tool now show the sub-app's stages under the `Calling X` stage with no config change; set `features.stage_display.propagate_sub_stages: false` to turn it off (#537).
> - **Hook `arguments` are templates `[Preview]`** — a literal `${` in existing hook `arguments` is now interpolated (escape it as `$${`), and `on_request_start` hooks time out after 15 s by default unless `timeout_seconds` is set (#607).

---

#### ai-dial-quickapps-frontend `0.3.0-rc.0`

### New environment variables

| Variable | Required | Default | Description |
| --- | :---: | --- | --- |
| `CORS_ORIGIN` | Yes | — | Origin(s) allowed to call the API cross-origin; usually the same as `AUTH_CALLBACK_BASE_URL` |
| `AUTH_SESSION_SECRET` | Yes | — | 64 hex characters; `AUTH_SESSION_PREV_SECRET` allows zero-downtime rotation |
| `AUTH_CALLBACK_BASE_URL` | Yes | — | This app's own origin |
| `AUTH_POST_LOGOUT_REDIRECT_URI` | Yes | — | Set to the same value as `CORS_ORIGIN` and `AUTH_CALLBACK_BASE_URL` (per `CHANGELOG.md`) |
| `AUTH_SESSION_COOKIE_NAME` | No | `__Host-quickapps.sess` | Session cookie name |
| `AUTH_TRANSACTION_COOKIE_NAME` | No | `__Host-quickapps.tx` | OAuth handshake cookie name |
| `AUTH_LEGACY_COOKIE_NAMES` | No | — | Old next-auth cookie names to expire; avoids `HTTP ERROR 431` after upgrade |
| `CSP_MODE` | No | `report-only` | Set to `enforce` once there are no violation reports |
| `ALLOWED_CONNECT_ORIGINS` | No | none | Extra `fetch`/`XHR` origins permitted by CSP |
| `OVERLAY_ENABLED` | No | unset | Only when the session cookie needs `SameSite=None` |
| `API_PREFIX` | No | `api` | Prefix for API and health-check routes |
| `OTEL_SDK_DISABLED` | No | `true` | Set to `false` plus the `OTEL_*` variables to enable OpenTelemetry |

### Renamed / deprecated environment variables

> [!CAUTION]
> The old names are no longer read.

| Old variable | New variable or location | Notes |
| --- | --- | --- |
| `NEXTAUTH_SECRET` | `AUTH_SESSION_SECRET` | |
| `NEXTAUTH_URL` | `AUTH_CALLBACK_BASE_URL` | `CORS_ORIGIN` is set separately |
| `THEMES_URL` | `THEMES_CONFIG_URL` | Now the base URL; `/config.json` is appended |
| `ALLOWED_FRAME_ANCESTORS` | `ALLOWED_IFRAME_ORIGINS` | |
| `QUICK_APPS_DEFAULT_MODEL` | `DEFAULT_DEPLOYMENT` | |
| `AUTH_<PROVIDER>_ISSUER` / `_CLIENT_SECRET` | `AUTH_<PROVIDER>_HOST` / `_SECRET` | Keycloak, Auth0, Azure AD secret; see `CHANGELOG.md` |
| `CODE_INTERPRETER_ENABLED`, `WEB_FETCH_ENABLED`, `ADD_ATTACHMENT_ENABLED` | `CUSTOM_CLIENT_VARIABLES` keys | See `CHANGELOG.md` |
| `ALLOWED_ORIGIN`, `DIAL_ADMIN_URL`, `DIAL_CHAT_URL` | `CUSTOM_CLIENT_VARIABLES` keys `allowedOrigin`, `dialAdminHost`, `dialChatHost` | |
| `QUICK_APPS_APPLICATION_NAME` | `applicationName` entry-URL query parameter | No env fallback |

### Settings keys (`CUSTOM_CLIENT_VARIABLES`)

| Key | Change | Description |
| --- | --- | --- |
| `allowedOrigin` | New location, accepts several values | One origin, a comma-separated list or a JSON array; unset or `*` accepts any origin (unsafe outside local dev) |
| `dialAdminHost`, `dialChatHost` | New location | Host origins for the visualizer connector |
| `applicationName` | Removed | Passed by the host as the entry-URL query parameter |

### Host integration changes

> [!IMPORTANT]
> Upgrade `ai-dial-chat` first: it must send `applicationName` in the QuickApps entry URL, otherwise `readyToSave` is never sent and Save/Preview stay disabled. The admin host does not send it yet. Application credentials additionally need a host advertising `applicationCredentials=true` and handling `REQUEST_APPLICATION_CREDENTIALS`; older hosts just hide the action. Update every identity provider's redirect URI to `/api/v1/auth/callback/<provider>`.

### Behavioral changes

> [!NOTE]
> New apps default the orchestrator temperature to `0.5`; saved values are unchanged.

- **Image** — now `chat-api` plus this app's static build, amd64-only, default port `5000` (#149, #179)
- **Health check** — `HEALTHCHECK` calls `/<API_PREFIX>/health` (#149)

---

#### ai-dial-admin-frontend `0.22.0-rc.0`

> [!IMPORTANT]
> `ANALYTICS_CONVERSATIONS_ENABLED` is renamed to `ANALYTICS_SESSIONS_ENABLED` with no fallback — deployments that enabled the Analytics trace view must rename it (0.21.1 and later already read the new name). A custom themes config at `THEMES_CONFIG_URL` must now define the ui-kit 2.0 color tokens (`bg-layer-base`, `bg-layer-raised`, `bg-layer-sunken`, `bg-control-*`, `text-control-*`, `stroke-*`, `bg-gradient-*`, `shadow-*`) in every theme; the app no longer ships dark defaults for them, so a config carrying only the legacy set renders ui-kit controls light.

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANALYTICS_SESSIONS_ENABLED` [Preview] | No | `false` | Replaces `ANALYTICS_CONVERSATIONS_ENABLED`; shows the Sessions sub-item in Analytics; needs `ANALYTICS_ENABLED` |
| `ANALYTICS_USAGE_ENABLED` [Preview] | No | `false` | Serves the analytics Dashboards page at `/dashboards` and moves `Dashboards` to the top of Analytics; needs `ANALYTICS_ENABLED` |
| `DIAL_ANALYTICS_RUNNER_API_URL` [Preview] | No | unset | Enrichment runner endpoint behind pipeline pause/resume and the Runtime, Failures, and Groups views; unset hides every runtime control |

* The telemetry dashboard moves from `/dashboard` to `/dashboards` and its menu item is renamed `Dashboards`; `/dashboard` redirects, and the `dashboard` token of `DISABLE_MENU_ITEMS` still hides it
* The container image no longer ships `npm` or `npx` and starts with `node node_modules/next/dist/bin/next start` — update any container command override that calls `npm run start`
* [Preview] Companion service versions — Catalog Schemas need DIAL Core 0.47.1 or later; Analytics pipelines need an ADAS release with the evaluator fold and the `on_ingest` retirement, and an enrichment runner at or past `5a01391` with its `improve-group-endpoints` change; multi-request Try Out needs the evaluation backend contract from epam/ai-dial-admin-evaluation-framework-backend#235

---

#### ai-dial-admin-evaluation-framework-backend `0.5.0-rc.0`

### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `QUERY_DSL_EXTENSION_TEST_SUITE_RUN_COST_ENABLED` | No | `false` | Adds `total_cost` to row-mode `test_suite_runs` query results. |
| `QUERY_DSL_EXTENSION_TEST_SUITE_RUN_COST_TIMEOUT_SEC` | Conditional | `2` | End-to-end cost lookup deadline; minimum `1`. |
| `CSV_IMPORT_ZIP_MAX_ENTRIES` | No | `1000` | Maximum ZIP entries accepted during test-case import. |
| `CSV_IMPORT_ZIP_MAX_TOTAL_UNCOMPRESSED_SIZE` | No | `1GB` | Maximum total uncompressed ZIP size. |
| `CSV_IMPORT_ZIP_MAX_MANIFEST_SIZE` | No | `1MB` | Maximum `manifest.json` size. |
| `SPRING_AI_MCP_SERVER_ENABLED` | No | `false` | Enables the inbound MCP server; `/mcp` returns 404 when disabled. |
| `SPRING_AI_MCP_SERVER_STDIO` | No | `false` | Enables local stdio transport; HTTP is the deployment default. |
| `SPRING_AI_MCP_SERVER_NAME` | No | `ai-dial-admin-evaluation-framework-backend` | Server name returned by MCP initialization. |
| `SPRING_AI_MCP_SERVER_VERSION` | No | Project version | Server version returned by MCP initialization. |
| `SPRING_AI_MCP_SERVER_TYPE` | No | `SYNC` | MCP implementation type; `SYNC` preserves request-thread caller identity. |
| `SPRING_AI_MCP_SERVER_PROTOCOL` | No | `STATELESS` | HTTP protocol; `STREAMABLE` requires one replica or sticky sessions. |
| `SPRING_AI_MCP_SERVER_CAPABILITIES_TOOL` | No | `true` | Advertises MCP tools. |
| `SPRING_AI_MCP_SERVER_CAPABILITIES_RESOURCE` | No | `false` | Advertises MCP resources; none ship in this release. |
| `SPRING_AI_MCP_SERVER_CAPABILITIES_PROMPT` | No | `false` | Advertises MCP prompts; none ship in this release. |
| `SPRING_AI_MCP_SERVER_CAPABILITIES_COMPLETION` | No | `false` | Advertises MCP completions; none ship in this release. |
| `SPRING_AI_MCP_SERVER_STREAMABLE_HTTP_MCP_ENDPOINT` | No | `/mcp` | Sets the authenticated MCP HTTP path. |
| `SPRING_AI_MCP_SERVER_STREAMABLE_HTTP_DISALLOW_DELETE` | No | `false` | Disables session termination by `DELETE` in `STREAMABLE` mode. |
| `SPRING_AI_MCP_SERVER_ANNOTATION_SCANNER_ENABLED` | No | `true` | Discovers `@McpTool` methods. |
| `SPRING_AI_MCP_SERVER_INSTRUCTIONS` | No | Built-in workflow guidance | Instructions returned by MCP initialization. |

### Enabling Application mode for test suite runs

Application mode (see **DIAL Configuration changes** below) routes long-running evals through a DIAL
Application Route instead of the user's JWT, so a run no longer fails when the JWT expires mid-run.
It is off by default. To turn it on:

**1. Enable DIAL API-Key authentication first** — the internal run-execution endpoint is authenticated
via the `Api-Key` header, not the user's JWT, so Application mode cannot start without it:

| Environment Variable | Default | Required | Description |
|---|---|---|---|
| `API_KEY_ENABLED` | `false` | Yes | Enables DIAL API-Key authentication via the `Api-Key` request header. Must be `true` before `DIAL_APP_PROXY_ENABLED` can be set — EF fails fast at startup otherwise. |
| `API_KEY_CORE_URL` | - | Yes | Base URL of the DIAL Core instance used to introspect API keys via `GET /v1/user/info`. |
| `API_KEY_ROLES_MAPPING` | - (empty) | Conditional | JSON object mapping DIAL Core project-key role names to EF authority strings, e.g. `{"admin":["FULL_ADMIN"],"default":["READ_ONLY_ADMIN"]}`. At least one of this or `API_KEY_DEFAULT_ROLES_MAPPING` must be non-empty. |
| `API_KEY_DEFAULT_ROLES_MAPPING` | - (empty) | Conditional | JSON object mapping DIAL Core roles from the JWT-rooted `userClaims` response shape to EF authority strings, e.g. `{"admin":["FULL_ADMIN"],"default":["READ_ONLY_ADMIN"]}`. |
| `API_KEY_USER_CLAIMS_ROLE_CLAIM` | `roles` | No | Claim name read from the introspection response's `userClaims` object to obtain the caller's raw roles. Set to `dial_roles` to match this claim naming in Core. |

**2. Turn on the Application Route flag:**

| Environment Variable | Default | Required | Description |
|---|---|---|---|
| `DIAL_APP_PROXY_ENABLED` | `false` | No | Enables DIAL Application Routes mode for run execution — eval runs are triggered via DIAL Core's Application Route using a per-request key instead of the user's JWT. Requires `API_KEY_ENABLED=true`. |
| `DIAL_APP_PROXY_DEPLOYMENT_NAME` | `EF` | No | DIAL Core application deployment name. Must match the `applications.<name>` key used in the DIAL Core config snippet in **DIAL Configuration changes** below. |
| `DIAL_APP_PROXY_HEARTBEAT_INTERVAL_MS` | `30000` | No | Heartbeat interval for the internal run SSE connection. |
| `DIAL_APP_PROXY_TRIGGER_READ_TIMEOUT_MS` | `43200000` | No | DIAL Application Route trigger timeout in milliseconds. |

**3. Recommended tuning (not required to enable the mode, but needed for long evals):**

| Environment Variable | Default | Required | Description |
|---|---|---|---|
| `TEST_SUITE_RUN_SSE_TIMEOUT_MINUTES` | `30` | No | SSE client connection timeout, in minutes. Raise this under Application mode (e.g. `720` for up to 12 hours) so the status stream doesn't time out before a long-running eval completes. |


### Behavioral changes

> [!NOTE]
> These take effect automatically on upgrade unless noted otherwise.

- **API-key role mapping** — with OIDC providers configured, introspection matches `userClaims.iss` and unions the provider's `roleClaims`; `API_KEY_USER_CLAIMS_ROLE_CLAIM` is now the fallback (#241, #248)
- **dial-adas compatibility** — run-cost averages now call `POST /v1/queries/execute-sql`; verify the deployed dial-adas version exposes this endpoint (#207)

### DIAL Configuration changes

> [!IMPORTANT]
> DIAL Core registration is required only when `DIAL_APP_PROXY_ENABLED=true`; direct JWT execution remains the default.
>
> **Required setup** (#236):
>
> 1. **Add** the `applications.EF` block to DIAL Core configuration, or use the application name set by `DIAL_APP_PROXY_DEPLOYMENT_NAME`, and grant it access to the EF file bucket. Apply the snippet with `http://eval-framework-url` replacement:

 ```json                                                                                                                                                                                                                           
  {                                                                                                                                                                                                                                 
    "applications": {                                                                                                                                                                                                               
      "EF": {                                                                                                                                                                                                                       
        "endpoint": "http://xxx",                                                                                                                                                                                                   
        "display_name": "EF",                                                                                                                                                                                                       
        "routes": {                                                                                                                                                                                                                 
          "runs": {                                                                                                                                                                                                                 
            "name": "runs",                                                                                                                                                                                                         
            "rewritePath": true,                                                                                                                                                                                                    
            "paths": [                                                                                                                                                                                                              
              "/api/internal/runs/[^/]+/execute$"                                                                                                                                                                                   
            ],                                                                                                                                                                                                                      
            "methods": [                                                                                                                                                                                                            
              "POST"                                                                                                                                                                                                                
            ],                                                                                                                                                                                                                      
            "upstreams": [                                                                                                                                                                                                          
              {                                                                                                                                                                                                                     
                "endpoint": "http://eval-framework-url",                                                                                                                                 
                "weight": 1,                                                                                                                                                                                                        
                "tier": 0                                                                                                                                                                                                           
              }                                                                                                                                                                                                                     
            ],                                                                                                                                                                                                                      
            "maxRetryAttempts": 1,                                                                                                                                                                                                  
            "order": 2147483647,                                                                                                                                                                                                    
            "permissions": [],                                                                                                                                                                                                      
            "attachmentPaths": {                                                                                                                                                                                                    
              "requestBody": ["$.attachments[*].url"],                                                                                                                                                                              
              "responseBody": []                                                                                                                                                                                                    
            }                                                                                                                                                                                                                       
          }                                                                                                                                                                                                                         
        }                                                                                                                                                                                                                           
      }                                                                                                                                                                                                                             
    }                                                                                                                                                                                                                               
  } 
```

### Database migrations

> [!NOTE]
> Flyway applies these automatically on startup; the service account needs DDL privileges on both schemas, and the analytics datasource must be reachable while meta `V1.33` copies historical snapshots.

- **meta** — `V1.32__CreateRunMetricSnapshotsTable.sql` — creates the canonical snapshot table with cascading run deletion #197 (#199)
- **meta** — `V1_33__CopyRunMetricSnapshotsFromAnalytics.java` — copies historical snapshots from analytics and skips orphaned rows #197 (#199)
- **meta** — `V1.34__ReplaceRunMetricSnapshotsRunIndex.sql` — replaces the run-only index with latest-computation ordering #197 (#199)
- **meta** — `V1.35__AddMetricScoreAggregationToTestSuites.sql` — adds `metric_score_aggregation` with default `AVG` (#231)
- **analytics** — `V1.20__CreateTestCaseMetricScoresAggregatedTable.sql` — stores per-test-case metric aggregates by computation (#231)
- **analytics** — `V1.21__AddRunCaseContextToTestCaseEvalScores.sql` — rebuilds test-case scores as one row per case and computation (#231)

> [!CAUTION]
> Analytics `V1.21` drops and recreates `test_case_eval_scores`, deleting existing derived scores until recomputed. Meta `V1.34` takes an access-exclusive lock while replacing its index; consider a maintenance window for large snapshot tables.

### API / contract changes

> [!NOTE]
> Coordinate consumers for the breaking items below; full REST reference is available in Swagger UI (`/swagger-ui.html`).

- **Breaking — template variables** — both template-variable GET endpoints now return request-indexed maps instead of flat arrays, and try-out `variables` is now a request-indexed map #217 (#235)
- **Breaking — score read surface** — eval-summary list/detail responses remove per-row `score` and `passed`; deduplicated scores now come from the `test_case_eval_scores` Query DSL entity (#231)
- **New endpoints** — authenticated `POST /mcp` #209 (#208), batch costs at `POST /api/v1/costs/test-suite-runs` (#205), and aggregated metrics at `GET /api/v1/test-suites/{testSuiteId}/metric-definitions/aggregated` #224 (#226)
- **Run snapshots** — `GET|POST /api/v1/run-metric-snapshots` is canonical; `/api/v1/analytics/run-metric-snapshots` remains a deprecated alias #197 (#199)
- **Structured Query DSL** — adds `test_suite_runs`, `test_case_metric_scores`, and `test_case_eval_scores`; `test_suite_runs` gains `number_of_runs` plus result-only score and optional cost keys #197 (#201, #206, #221, #222; #231)
- **Test-suite scoring** — request/response snapshots gain `metricScoreAggregation` (`AVG`, `MIN`, `MAX`), and `custom_function` is rejected for `testCaseOverallScore` (#231)
- **ZIP archives** — exports gain version-1 `manifest.json`; broken referenced files now return HTTP 502 JSON without a partial archive #225 (#227, #228, #232)
- **Pricing payloads** — full model-deployment responses may expose `pricing.prompt` and `pricing.completion` as either scalars or JSON objects; strict clients must accept both #243 (#244, #247)
