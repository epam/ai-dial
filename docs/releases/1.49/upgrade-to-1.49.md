# Instructions

## Table of contents

- [Versions](#versions)
- [Before upgrade](#before-upgrade)
  - [General notes](#general-notes)
  - [Release-specific notes](#release-specific-notes)
    - [ai-dial-admin-evaluation-framework-backend](#ai-dial-admin-evaluation-framework-backend-050)
    - [ai-dial-admin-frontend](#ai-dial-admin-frontend-0220)
    - [ai-dial-chat](#ai-dial-chat-123)
    - [ai-dial-quickapps-backend](#ai-dial-quickapps-backend-0130)
    - [ai-dial-quickapps-frontend](#ai-dial-quickapps-frontend-030)
    - [ai-dial-adapter-openai](#ai-dial-adapter-openai-0450)
    - [ai-dial-adapter-vertexai](#ai-dial-adapter-vertexai-0410)
    - [ai-dial-admin-backend](#ai-dial-admin-backend-0220)
    - [ai-dial-adapter-bedrock](#ai-dial-adapter-bedrock-0450)
    - [ai-dial-adapter-dial](#ai-dial-adapter-dial-0200)
    - [ai-dial-analytics-realtime](#ai-dial-analytics-realtime-0290)
    - [ai-dial-core](#ai-dial-core-0490)

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.45.0`
   - ai-dial-adapter-openai: `0.45.0`
   - ai-dial-adapter-vertexai: `0.41.1`
   - ai-dial-adapter-dial: `0.20.0`
   - ai-dial-chat-themes: `0.21.0`
   - ai-dial-chat: `1.2.4`
   - ai-dial-core: `0.49.0`
   - ai-dial-analytics-realtime: `0.29.0`
   - ai-dial-rag: `0.43.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.13.0`
   - ai-dial-quickapps-frontend: `0.3.0`
   - ai-dial-mind-map-backend: `0.15.0`
   - ai-dial-mind-map-frontend: `0.14.1`
   - ai-dial-admin-backend: `0.22.0`
   - ai-dial-admin-frontend: `0.22.0`
   - ai-dial-admin-deployment-manager-backend: `0.22.0`
   - ai-dial-admin-evaluation-framework-backend: `0.5.0`
   - ai-dial-admin-evaluation-metrics: `0.3.0`
   - ai-dial-openapi-to-mcp: `0.2.1`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

> Environment variable tables below use the same columns: **Required** is `Yes` (the service does not start without the variable) or `No`, and **Default** is the value applied when the variable is not set — `unset` means the variable has no default value.

### Release-specific notes

#### ai-dial-admin-evaluation-framework-backend `0.5.0`

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

### Removed environment variables

> [!CAUTION]
> Renamed without fallback; affects every deployment with `API_KEY_ENABLED=true` since 0.3.0. Keeping both old names fails startup; renaming only one leaves the other mapping empty, so callers on that path get no authorities.

| Variable | Reason |
|---|---|
| `API_KEY_ROLES_MAPPING` | Renamed to `API_KEY_KEY_ROLES_MAPPING` — project-key role mapping (#256) |
| `API_KEY_DEFAULT_ROLES_MAPPING` | Renamed to `API_KEY_JWT_ROLES_MAPPING` — JWT-rooted per-request-key (`userClaims`) role mapping (#256) |

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
| `API_KEY_KEY_ROLES_MAPPING` | - (empty) | Conditional | JSON object mapping DIAL Core project-key role names to EF authority strings, e.g. `{"admin":["FULL_ADMIN"],"default":["READ_ONLY_ADMIN"]}`. At least one of this or `API_KEY_JWT_ROLES_MAPPING` must be non-empty. |
| `API_KEY_JWT_ROLES_MAPPING` | - (empty) | Conditional | JSON object mapping DIAL Core roles from the JWT-rooted `userClaims` response shape to EF authority strings, e.g. `{"admin":["FULL_ADMIN"],"default":["READ_ONLY_ADMIN"]}`. |
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
        "endpoint": "http://unused",                                                                                                                                                                                                   
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

### Removed environment variables

> [!CAUTION]
> Renamed without fallback; affects every deployment with `API_KEY_ENABLED=true` since 0.3.0. Keeping both old names fails startup; renaming only one leaves the other mapping empty, so callers on that path get no authorities.

| Variable | Reason |
|---|---|
| `API_KEY_ROLES_MAPPING` | Renamed to `API_KEY_KEY_ROLES_MAPPING` — project-key role mapping (#256) |
| `API_KEY_DEFAULT_ROLES_MAPPING` | Renamed to `API_KEY_JWT_ROLES_MAPPING` — JWT-rooted per-request-key (`userClaims`) role mapping (#256) |

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
| `API_KEY_KEY_ROLES_MAPPING` | - (empty) | Conditional | JSON object mapping DIAL Core project-key role names to EF authority strings, e.g. `{"admin":["FULL_ADMIN"],"default":["READ_ONLY_ADMIN"]}`. At least one of this or `API_KEY_JWT_ROLES_MAPPING` must be non-empty. |
| `API_KEY_JWT_ROLES_MAPPING` | - (empty) | Conditional | JSON object mapping DIAL Core roles from the JWT-rooted `userClaims` response shape to EF authority strings, e.g. `{"admin":["FULL_ADMIN"],"default":["READ_ONLY_ADMIN"]}`. |
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
        "endpoint": "http://unused",                                                                                                                                                                                                   
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
- **meta** — `V1.36__AddIdsToDatasetSchemaFields.sql` — assigns stable UUIDs to existing dataset schema fields without changing dataset versions #246 (#249)
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
- **Dataset schema fields** — responses now include a server-assigned `id`; echo it unchanged in `PUT /api/v1/datasets/{id}` to preserve identity across renames, and omit it for new fields #246 (#249)
- **Bound public datasets** — destructive schema updates and CSV/ZIP imports now return HTTP 409 with `DATASET_FIELD_RENAME_FORBIDDEN` or `DATASET_FIELD_REMOVAL_FORBIDDEN` #246 (#249, #254)

---

#### ai-dial-admin-frontend `0.22.0`

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

> [!IMPORTANT]
> The `Catalog`, `Assets`, and `Approvals` menu groups are replaced by `AI Gateway`, `Artifacts`, and `Governance`, so the `assets` and `approvals` tokens of `DISABLE_MENU_ITEMS` no longer hide anything — switch them to `aigateway`, `artifacts`, or `governance`, or to item tokens, as listed in [`docs/MENU-DOCUMENTATION.md`](https://github.com/epam/ai-dial-admin-frontend/blob/0.22.0-rc.1/docs/MENU-DOCUMENTATION.md). The `catalog` token still hides every Core-direct item, wherever it is now grouped.

* [Preview] Companion service version — dataset schema field renames keep their values only with the evaluation backend from epam/ai-dial-admin-evaluation-framework-backend#246; against an older backend a rename still drops the column's values

This release adds optional limits for uploaded zip archives. An archive over any limit is rejected, and an invalid or non-positive value falls back to the default.

| Variable | Required | Default | Description |
|---|---|---|---|
| `ZIP_IMPORT_MAX_ENTRIES` | No | `500` | Maximum number of entries in an uploaded zip archive |
| `ZIP_IMPORT_MAX_ENTRY_SIZE_MB` | No | `100` | Maximum inflated size of a single archive entry, in MB |
| `ZIP_IMPORT_MAX_TOTAL_SIZE_MB` | No | `1024` | Maximum inflated size of the whole archive, in MB |

> [!IMPORTANT]
> The default theme changes from dark to light. Custom configurations served by `THEMES_CONFIG_URL` must define the UI Kit 2.0 token families or controls fall back to UI Kit’s light colors. The sidebar replaces the Catalog, Assets, and Approvals groups with AI Gateway, Artifacts, and Governance; replace obsolete `assets` and `approvals` values in `DISABLE_MENU_ITEMS` with `aigateway`, `artifacts`, `governance`, or item-specific tokens.

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANALYTICS_USAGE_ENABLED` [Preview] | No | `false` | Serves Analytics Dashboards at `/dashboards` when `ANALYTICS_ENABLED` is also enabled |
| `DIAL_ANALYTICS_RUNNER_API_URL` [Preview] | No | unset | Enrichment runner endpoint for pipeline Runtime, pause/resume, Failures, and Groups controls |
| `ZIP_IMPORT_MAX_ENTRIES` | No | `500` | Maximum entries in an uploaded ZIP archive |
| `ZIP_IMPORT_MAX_ENTRY_SIZE_MB` | No | `100` | Maximum inflated size of one ZIP entry |
| `ZIP_IMPORT_MAX_TOTAL_SIZE_MB` | No | `1024` | Maximum total inflated archive size |

* The telemetry dashboard moves from `/dashboard` to `/dashboards`; the old route redirects, and the `dashboard` token of `DISABLE_MENU_ITEMS` still hides it
* The container image no longer ships `npm` or `npx` and starts Next.js with `node` directly — update any container command override that calls `npm run start`

---

#### ai-dial-chat `1.2.4`

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `AUTH_SESSION_MAX_AGE_SECONDS` | `2592000` (30 days) | Rolling session lifetime, independent of `offline_access`. Integer seconds from 1 to 2147483647; an invalid value fails startup. Successful token refresh resets the deadline; changes apply at login and renewal. A known refresh-token expiry, or access-token expiry when no refresh token exists, can shorten it. |
| `GENERATION_FINALIZE_TIMEOUT_MS` | `60000` | Milliseconds a generation's terminal save may stay unsettled before its attached subscribers and timers are released. The entry keeps its registry key (`settling`), so a new generation on the same conversation stays blocked until the save settles or the process restarts. Minimum `1000`. |
| `UI_EVENT` | — | Start-page celebration module, returned to the client as `config.activeEventId`: `halloween` or `new-year`; unset or `none` disables it. Must be lowercase kebab-case or startup fails; IDs the frontend does not know are ignored. Takes effect on the next service restart. |

### Behavioral changes

> [!NOTE]
> Everything below takes effect on upgrade. The first item is breaking.

- **Every user signs in again after the upgrade** — session payload v2 carries a server-enforced deadline and v1 cookies no longer authorize requests. Deploy all `chat-api` replicas together to avoid mixed enforcement; an existing IdP SSO session can complete the new login without a password prompt. (#8990)
- **Session lifetime no longer depends on `offline_access`** — it was a fixed 30 days from login with that scope and 1 hour without; it is now a rolling `AUTH_SESSION_MAX_AGE_SECONDS` for every provider. Lower it to keep sessions short. (#8990)
- **`dial.chat.generations.active` gains a `state` attribute** (`active`, `cancel_requested`, `finalizing`, `settling`, each emitted including zero) — sum across `state` for a per-process total; the bundled Grafana examples are updated. The auth refresh outcome gains `session_expired`. (#8953, #8990)

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `HTTP_PROXY` | unset | Corporate proxy for outbound `chat-api` requests — OIDC discovery, token and JWKS calls, the themes service and DIAL Core. Lowercase `http_proxy` is also read. |
| `HTTPS_PROXY` | unset | Proxy for `https:` requests. OIDC requests use only this variable and do not fall back to `HTTP_PROXY`. Lowercase `https_proxy` is also read. With neither proxy variable set, requests go out directly as before. |
| `NO_PROXY` | unset | Comma-separated hosts that bypass the proxy, e.g. `localhost,127.0.0.1,.internal`. Read only when a proxy variable is set. List cluster-internal hosts here, such as an internal `DIAL_CORE_URL` or IdP. |

### New `ENABLED_UI_FEATURES` values

| Value | Description |
| --- | --- |
| `show-agent-description` | Renders the selected agent's own `description` as Markdown below the conversation starters on the empty-chat screen; nothing renders when the agent has none. Independent of `WELCOME_SCREEN_DESCRIPTION`. (#8883) |
| `show-header-logo` | Shows the theme's full `logo` in the center of the desktop top bar, for embeds without the navigation rail. A favicon-only theme shows nothing there; mobile is unchanged. (Issue #9027) (#9051) |
| `disable-input-history-navigation` | Up/Down in the chat input only move the caret instead of recalling previously sent messages. (Issue #9028) (#9037) |
| `hide-conversation-export` | Hides the per-conversation Export action and the panel's Export all entry; Import and Delete all stay. UI-only — the export API is not blocked. (Issue #9028) (#9037) |
| `hide-settings-page` | Hides the Settings entry in the desktop user menu and the mobile navigation sheet, and redirects a direct `/settings` URL to `/`. Stored preferences keep their values. (#9037) |

### Behavioral changes

> [!NOTE]
> Applies on upgrade only where proxy variables are already present in the `chat-api` environment.

- **`HTTP_PROXY` and `HTTPS_PROXY` are no longer ignored** — a value already set in the container, for example injected cluster-wide, now routes every outbound call through the proxy, including a cluster-internal DIAL Core or IdP. Add those hosts to `NO_PROXY` before upgrading. (#9038)

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `ALLOWED_CONNECT_ORIGINS` | `[]` | Comma-separated trusted HTTP(S) origins added to CSP `connect-src` in both the enforced and report-only policies, including the overlay sandbox; a leading `*.` subdomain pattern is supported, paths are not, and an invalid entry fails startup. Also returned to the client as `config.allowedConnectOrigins`: PDF previews from a matching origin send browser cookies and reject redirects, so the document server must return the file directly with `Access-Control-Allow-Origin` set to the exact chat origin (the iframe's origin in overlay mode) and `Access-Control-Allow-Credentials: true`. Use HTTPS outside local development. Restart `chat-api` and reload the chat page or overlay iframe after a change. |

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `USER_USAGE_DEPLOYMENT_TYPES` | `model,application` | Comma-separated deployment kinds (`model`, `application`) that `GET /api/v1/user/limits` and `GET /api/v1/user/usage` report when the request carries no `deploymentTypes`; a request value always wins. Set `model` to restore the model-only report. Application rows need a DIAL Core that attributes cost to applications. Validated at startup — any other value fails boot. |

### Behavioral changes

> [!NOTE]
> Both changes apply on upgrade without any configuration change.

- **Boolean feature variables** — `SCHEDULED_TASKS_ENABLED`, `LIVE_CHAT_INTERACTION_ENABLED` and `LLM_CONVERSATION_NAMING_ENABLED` set to `false`, `0` or `no` now switch their feature off; a deployment that sets one of them that way had the feature running and loses it after upgrade. (#9142)
- **Settings → Usage** — lists applications alongside models by default; set `USER_USAGE_DEPLOYMENT_TYPES=model` to keep the model-only table. (#9147)

### New `ENABLED_UI_FEATURES` values

| Value | Description |
| --- | --- |
| `starters-below-greeting` | Moves the conversation starters and the starter intro text on the empty-chat screen from below the input to between the greeting and the input. Combines with `show-all-starters`, which still controls how the starters are laid out. (#9155) |
| `hide-greeting` | Removes the time-of-day greeting from the empty-chat screen. `WELCOME_SCREEN_DESCRIPTION` renders only under the greeting, so it is hidden too, and the input takes the wider active-chat width. (#9155) |

### Behavioral changes

> [!NOTE]
> Both changes apply on upgrade without any configuration change.

- **Mobile header logo** — a theme that defines a `logo` but no `favicon` now shows a smaller full `logo` in the mobile header, which had no brand before; this applies to the standalone chat as well as overlay embeds. (#9155)
- **`show-header-logo` with `header` off** — the mobile header row now renders, carrying only the logo and none of its buttons; the key previously changed only the desktop top bar. (#9155)

### Behavioral changes

> [!NOTE]
> Applies on upgrade without any configuration change.

- **Hidden default deployment** — a `DEFAULT_DEPLOYMENT` tagged with one of `HIDDEN_ENTITY_TAGS` no longer opens new chats or shows as the pinned default (`DEFAULT_DEPLOYMENT_PINNED`) in the model selector; new chats fall through to the user's last-used model, then the first visible deployment. (#9167)

### New `APPLICATION_VISUALIZERS` entry fields

| Field | Default | Description |
| --- | --- | --- |
| `borderless` | `false` | Renders the entry's inline frame without its border, rounded corners, background and header divider. Must be a JSON boolean; any other value drops the entry with an error log. |
| `withoutTitle` | `false` | Hides the inline frame's header title text; the expand-to-canvas button stays and the iframe keeps `title` as its accessible name. Must be a JSON boolean; any other value drops the entry with an error log. |

### Behavioral changes

> [!NOTE]
> Both changes apply on upgrade without any configuration change.

- **`APPLICATION_VISUALIZERS` entries carried over from Chat 0.x** — an entry that already sets `borderless` or `withoutTitle` to `true` now renders that way, and one that sets either to a non-boolean such as `"true"` is now dropped with an error log instead of loading with the field ignored. (`687ec0f`)
- **No `npm` or `npx` in the Chat runtime image** — the default `CMD` (`node apps/chat-api/dist/main.js`) is unaffected, but a custom entrypoint, init step, probe or `exec` session that calls `npm` or `npx` inside the container now fails. (#9244)

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `ALLOW_VISUALIZER_SEND_MESSAGES` | `false` | Client-visible feature flag, exposed as `features.visualizerSendMessages`. When `true`, a custom or application visualizer iframe may post `SEND_MESSAGE` with `{ message: string }`, and its text is sent as a user message in the conversation that renders it. Enable it only for visualizers you trust: an opted-in visualizer can send messages as the user. Only `true`, `1` and `yes` (case-insensitive) enable it; any other value, including an empty one, leaves it off. Takes effect on the next service restart. |

### New feature flags

| Flag | Description |
| --- | --- |
| `features.visualizerSendMessages` | Lets a custom or application visualizer send its `SEND_MESSAGE` text as a user message in the conversation that renders it. Toggled through `ALLOW_VISUALIZER_SEND_MESSAGES`; defaults to `false`. No role restriction. |

### Behavioral changes

> [!NOTE]
> Both changes apply on upgrade without any configuration change.

- **Share-link expiry** — creating a share link now also reads the new invitation from DIAL Core (`GET /v1/invitations/{id}`, never accepted) and reports its `expireAt` as whole days instead of a fixed 3; when that read fails or returns no future `expireAt`, the link is still returned without `expiresInDays`, the popover shows no note, and `chat-api` logs a `WARN`. (#9239)
- **`ALLOW_VISUALIZER_SEND_MESSAGES` carried over from Chat 0.x** — a deployment that still sets it to `true`, `1` or `yes` now lets visualizers send messages as the user; legacy turned it on for any non-empty value, so `false`, `0` or any other value now leaves it off. (#9246)

Deltas below are relative to **1.1.14**, the latest stable release; configuration already shipped in `1.1.1`–`1.1.14` is not repeated.

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `RESPONSES_BACKGROUND_ENABLED` | `false` | Server-only. Starts eligible Responses generations as DIAL Core background jobs (`background: true`, `store: true`), so a generation survives browser disconnects and BFF restarts. Used only when `RESPONSES_API_ENABLED` is `true`, the deployment reports `features.responsesApi=true` and its `interfaces` include `openaiResponses`. Affects new generations only; in-flight jobs stay recoverable when it is turned off. The first text arrives later than on the stateless path. Requires DIAL Core `0.48.0` or later. Takes effect on restart. |
| `CUSTOM_CORE_API_CONFIG` | unset (disabled) | Server-only allowlist of exact DIAL Core GET paths exposed through `GET /api/v1/custom-api/:operationId`, e.g. `{"version":1,"operations":[{"id":"data-products","method":"GET","corePath":"/data-products"}]}`. At most 16 KiB and 64 operations; an invalid value fails startup. Never exposed to the client. Takes effect on restart. |
| `MCP_APP_HOST_NAME` | unset | Identifier sent to every MCP App as `hostInfo.name` during `ui/initialize`, exposed as `config.mcpAppHostName`; unset falls back to `ai-dial-chat` on the client. |
| `TEXT_REFINEMENT_SKILL_DESCRIPTION_PROMPT` | built-in | Replaces the Refine with AI prompt for a skill description. |
| `TEXT_REFINEMENT_SKILL_INSTRUCTIONS_PROMPT` | built-in | Replaces the Refine with AI prompt for skill instructions. |
| `TEXT_REFINEMENT_SCHEDULED_TASK_DESCRIPTION_PROMPT` | built-in | Replaces the Refine with AI prompt for a scheduled-task description. |
| `TEXT_REFINEMENT_SCHEDULED_TASK_INSTRUCTIONS_PROMPT` | built-in | Replaces the Refine with AI prompt for scheduled-task instructions. |
| `TEXT_REFINEMENT_APPLICATION_DESCRIPTION_PROMPT` | built-in | Replaces the Refine with AI prompt for an application description. |
| `TEXT_REFINEMENT_TOOLSET_DESCRIPTION_PROMPT` | built-in | Replaces the Refine with AI prompt for a toolset description. |
| `TEXT_REFINEMENT_PROMPT_DESCRIPTION_PROMPT` | built-in | Replaces the Refine with AI prompt for a prompt description. |
| `CONVERSATION_NAMING_SYSTEM_PROMPT` | built-in | Replaces the system prompt for automatic conversation naming and the Rename conversation action. |
| `TRANSCRIPTION_PROMPT` | built-in | Replaces the prompt for audio transcription through `ASR_MODEL`. |

The prompt overrides are server-only: an unset, empty or whitespace-only value keeps the built-in prompt, and a nonblank value replaces it entirely, without placeholders. Quote multiline values and restart `chat-api` after a change.

### Removed environment variables

| Variable | Reason |
| --- | --- |
| `SKILL_USAGE_ENABLED` | Skill usage is always available, gated only by whether the selected deployment supports skills. A value left set is ignored. (#9119) |

### New feature flags

| Flag | Description |
| --- | --- |
| `features.responsesBackgroundEnabled` | Server-only switch, not returned in client config, for starting Responses generations as DIAL Core background jobs. Toggled through `RESPONSES_BACKGROUND_ENABLED`; defaults to `false`. No role restriction. |

### Removed feature flags

| Flag | Reason / replacement |
| --- | --- |
| `features.skillUsageEnabled` | No replacement — skill usage UI is always on. (#9119) |

### New container images

| Image | Description |
| --- | --- |
| `epam/ai-dial-chat-bff` | `chat-api` without the bundled frontend and overlay sandbox, for deployments that host the frontend separately. Same tags and environment contract as `epam/ai-dial-chat`; non-API routes such as `/` return 404. Also on `ghcr.io`. (#9212) |
| `epam/ai-dial-chat-mcp-app-sandbox` | The MCP Apps sandbox proxy (`apps/mcp-app-sandbox`) that `MCP_APP_SANDBOX_URL` points at, now built and tagged with every release. Also on `ghcr.io`. (#8890) |

### Behavioral changes

> [!NOTE]
> Everything below takes effect on upgrade without any configuration change.

- **Skills are available to every user** — with `SKILL_USAGE_ENABLED` gone, the composer's Skills and `/` menus and the catalog's skill "Use in chat" action appear wherever the selected deployment supports skills; the flag defaulted to `false`, so most `1.1.x` deployments showed none of them. (#9119)
- **`CORS_ORIGIN` defaults to `AUTH_CALLBACK_BASE_URL`** instead of `http://localhost:4207`, and `AUTH_POST_LOGOUT_REDIRECT_URI` is no longer required with a provider configured — it defaults to the same value; set either explicitly when the frontend or the post-logout page lives on another origin. (#9022)
- **File storage opens on a combined All tab** — the `FILE_MANAGER_AVAILABLE_TABS` default is now `all,my_files,shared,organization`; a deployment that sets the variable keeps its tabs, and All shows only when at least two source tabs are enabled. (#9117)
- **`Referrer-Policy: strict-origin-when-cross-origin`** replaces Helmet's `no-referrer` on BFF responses, because the MCP Apps sandbox validates the `Referer` of its iframe navigation. (#8973)
- **`SCHEDULED_TASKS_ENABLED=false` closes the scheduled-task API** — those routes now return 403 instead of answering while the feature is off. (#9299)
- **`UTILITY_MODEL` also enables Refine with AI** — the action appears whenever it is set and runs with the user's own credentials and a 30-second timeout, independently of `LLM_CONVERSATION_NAMING_ENABLED`. (#9034, #9286)
- **Scheduled tasks request streamed completions** — tasks created or saved after the upgrade send `stream: true` to DIAL Scheduler, so a long run is no longer cancelled after 60 seconds; existing tasks keep the old payload until they are edited. (#9309)
- **Oversized uploads are rejected in the browser** — `FILE_UPLOAD_MAX_BYTES` is now also sent to the client, which refuses a larger file before uploading it. (#8941)
- **Negative-feedback category values** — "Ui bug" and "Should have search the web" are now sent to DIAL Core as "UI bug" and "Should have searched the web"; stored feedback keeps the old spelling, so analytics keyed on the category should match both. (#9159)
- **No `npm` or `npx` in the `mcp-app-sandbox` image** — a custom entrypoint, probe or `exec` session that calls them inside that container now fails. (#9181)

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `USAGE_LIMITS_CONTROL_ENABLED` | `false` | Client-visible feature flag, exposed as `features.usageLimitsControl`. When `true`, the conversation input shows the token/cost usage-limits control next to the model selector in both the new-chat composer and an open conversation. When `false`, the control is not rendered and its usage request is not made. Any value other than `false`, `0` or `no` (case-insensitive), including an empty one, turns it on. Takes effect on the next service restart. |

### New feature flags

| Flag | Description |
| --- | --- |
| `features.usageLimitsControl` | Whether the conversation input shows the token/cost usage-limits control next to the model selector. Toggled through `USAGE_LIMITS_CONTROL_ENABLED`; defaults to `false`. No role restriction. |

### Behavioral changes

> [!NOTE]
> Applies on upgrade without any configuration change.

- **Usage-limits control off by default** — the token/cost usage-limits control the conversation input has shown since `1.1.0` now renders only while `USAGE_LIMITS_CONTROL_ENABLED` is on; set it to `true` to keep it. (#9387)

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `USAGE_LIMITS_WARNING_THRESHOLD_PERCENT` | `75` | Client-visible config, exposed as `config.usageLimitsWarningThresholdPercent`. Integer 1–99; a value outside that range or a non-integer fails validation at boot. The percentage of a capped day/week/month token or cost limit at which the usage banner appears above the conversation input, while `USAGE_LIMITS_CONTROL_ENABLED` is `false`. Governs the banner only: the usage dial and the Settings → Usage page keep their fixed 75% running-low mark. |

### Behavioral changes

> [!NOTE]
> Applies on upgrade without any configuration change.

- **Usage-limit banner on by default** — while `USAGE_LIMITS_CONTROL_ENABLED` stays `false`, both composers request the selected deployment's limits again and show the banner from 75% of a capped limit; setting the flag to `true` swaps it for the usage dial, and no setting turns both off. (#9397)

Deltas below are relative to **1.1.14**, the last published stable release.

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `RESPONSES_BACKGROUND_ENABLED` | `false` | Server-only switch for starting eligible Responses generations as DIAL Core background jobs (`background: true`, `store: true`). Used only when `RESPONSES_API_ENABLED` is `true`, the deployment reports `features.responsesApi=true` and its DIAL Core `interfaces` include `openaiResponses`. Affects only new generations. Requires DIAL Core `0.48.0` or later. |
| `CUSTOM_CORE_API_CONFIG` | unset (disabled) | Server-only JSON allowlist of exact GET Core paths exposed through `GET /api/v1/custom-api/:operationId`: `{"version":1,"operations":[{"id":…,"method":"GET","corePath":…}]}`. An invalid value fails startup. Restart `chat-api` after changing. |
| `USAGE_LIMITS_CONTROL_ENABLED` | `false` | Client-visible flag, exposed as `features.usageLimitsControl`. When `true`, the composer shows the usage-limits dial beside the model selector; when `false`, it shows the usage banner instead. |
| `USAGE_LIMITS_WARNING_THRESHOLD_PERCENT` | `75` | Integer 1–99 at which the usage banner appears for a capped day, week or month token or cost limit; any other value fails startup. Governs the banner only. |
| `MCP_APP_HOST_NAME` | `ai-dial-chat` | Identifier sent to every MCP App as `hostInfo.name` during `ui/initialize`; exposed as `config.mcpAppHostName`. |
| `TEXT_REFINEMENT_SKILL_DESCRIPTION_PROMPT` | built-in | Replaces the instruction for refining a skill description. |
| `TEXT_REFINEMENT_SKILL_INSTRUCTIONS_PROMPT` | built-in | Replaces the instruction for refining skill instructions. |
| `TEXT_REFINEMENT_SCHEDULED_TASK_DESCRIPTION_PROMPT` | built-in | Replaces the instruction for refining a scheduled task description. |
| `TEXT_REFINEMENT_SCHEDULED_TASK_INSTRUCTIONS_PROMPT` | built-in | Replaces the instruction for refining scheduled task instructions. |
| `TEXT_REFINEMENT_APPLICATION_DESCRIPTION_PROMPT` | built-in | Replaces the instruction for refining an application description. |
| `TEXT_REFINEMENT_TOOLSET_DESCRIPTION_PROMPT` | built-in | Replaces the instruction for refining a toolset description. |
| `TEXT_REFINEMENT_PROMPT_DESCRIPTION_PROMPT` | built-in | Replaces the instruction for refining a prompt description. |
| `TEXT_REFINEMENT_PROMPT_INSTRUCTIONS_PROMPT` | built-in | Replaces the instruction for refining prompt instructions. |
| `CONVERSATION_NAMING_SYSTEM_PROMPT` | built-in | Replaces the instruction for automatic conversation naming and the Rename conversation action. |
| `TRANSCRIPTION_PROMPT` | built-in | Replaces the instruction for dedicated audio transcription via `ASR_MODEL`. |

The prompt overrides are server-only. Unset, empty or whitespace-only values keep the built-in instruction; a nonblank value replaces it entirely and is not interpolated.

### Removed environment variables

| Variable | Reason |
| --- | --- |
| `SKILL_USAGE_ENABLED` | Skill-usage UI is always enabled; a value left set is ignored. (#9119) |

### New feature flags

| Flag | Description |
| --- | --- |
| `features.responsesBackgroundEnabled` | Starts eligible Responses generations as DIAL Core background jobs. Toggled through `RESPONSES_BACKGROUND_ENABLED`; defaults to `false`. Server-only, not exposed to the client. (#9236) |
| `features.usageLimitsControl` | Shows the usage-limits dial in the conversation input instead of the usage banner. Toggled through `USAGE_LIMITS_CONTROL_ENABLED`; defaults to `false`. (#9387) |

### Removed feature flags

| Flag | Reason / replacement |
| --- | --- |
| `features.skillUsageEnabled` | No replacement — skill-usage UI is always enabled. (#9119) |

### New container images

| Image | Description |
| --- | --- |
| `epam/ai-dial-chat-bff` | The `chat-api` BFF without `apps/chat/dist` and the overlay sandbox, for deployments that host the frontend separately. Published with the same tags as `ai-dial-chat`. (#9212) |
| `epam/ai-dial-chat-mcp-app-sandbox` | The MCP Apps sandbox proxy that `MCP_APP_SANDBOX_URL` points at, published alongside the main image. (#8890) |

### Behavioral changes

> [!NOTE]
> Everything below takes effect on upgrade without any configuration change.

- **Skills UI on every deployment** — the composer Skills menu and the catalog "Use in chat" action now appear even where `SKILL_USAGE_ENABLED` was `false`. (#9119)
- **Usage dial hidden by default** — the usage-limits control beside the model selector, shown since `1.1.8`, now needs `USAGE_LIMITS_CONTROL_ENABLED=true`; otherwise a banner above the input warns at `USAGE_LIMITS_WARNING_THRESHOLD_PERCENT`. (#9387, #9397)
- **File storage opens on the All tab** — the `FILE_MANAGER_AVAILABLE_TABS` default gains `all`; a deployment that sets the variable keeps its own list. (#9117)
- **`CORS_ORIGIN` defaults to `AUTH_CALLBACK_BASE_URL`** instead of `http://localhost:4207`, and `AUTH_POST_LOGOUT_REDIRECT_URI` is no longer required — it defaults to `AUTH_CALLBACK_BASE_URL`. Set `CORS_ORIGIN` explicitly when the frontend is served from a different origin. (#9022)
- **`FILE_TRANSFER_TIMEOUT_MS` is an idle timeout for uploads** — `POST /api/v1/files` aborts only after that long without data moving, waits up to 2 minutes for DIAL Core after the last chunk and stops at 30 minutes; downloads and other file operations keep the absolute timeout. (#9423)
- **Scheduled-task API returns 403 while `SCHEDULED_TASKS_ENABLED` is off** — the routes were reachable before. (#9299)

---

#### ai-dial-quickapps-backend `0.13.0`

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

### New environment variables

| Variable                        | Default | Description                                                                                                                                                                                                                                 | Required |
|---------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `ALLOW_OVERRIDE_SYSTEM_MESSAGE` | `false` | Deployment-wide security switch; apps cannot opt out once it is enabled. When `false`, a request whose `system` message has text is rejected with HTTP 400. When `true`, that message replaces only the app's configured system prompt, and skills, MCP resources and other injected parts are still appended. | No       |

### Behavioral changes

> [!NOTE]
> - **Client system messages are rejected by default.** This applies on upgrade with no config change. A request whose leading `system` message has text now fails with HTTP 400 (`role 'system' is not accepted by this application; it uses its own system prompt.`), where it used to replace the app's prompt. Set `ALLOW_OVERRIDE_SYSTEM_MESSAGE=true` for clients that rely on sending one. A system message with no text is still accepted and ignored (#641).

### DIAL Configuration changes

> [!IMPORTANT]
> DIAL Core reports an application's `features.systemPromptSupported` as `true` when it is not set. As a result, DIAL Chat offers a system-prompt field for QuickApps, and with the default `ALLOW_OVERRIDE_SYSTEM_MESSAGE=false` anything typed there now fails with 400.
>
> **Recommended migration** (#641):
>
> 1. **Add** `"systemPromptSupported": false` to the `features` of each QuickApp application in DIAL Core's configuration. Skip this if you set `ALLOW_OVERRIDE_SYSTEM_MESSAGE=true`.

### Prerequisites

> [!IMPORTANT]
> **DIAL Core ≥ 0.49.0** (`GET /v1/deployment-names`) is required for the tool access filter (#624); on older Core the filter fails open and offers every configured tool. Tools pointing at custom (user-owned) applications are treated as inaccessible unless Core's `includeCustomApps` is on.

### New environment variables

| Variable                                  | Default | Description                                                                                                                                                                                                                                                                                                    | Required |
|-------------------------------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `ALLOW_OVERRIDE_SYSTEM_MESSAGE`           | `false` | Deployment-wide security switch; apps cannot opt out once it is enabled. When `false`, a request whose `system` message has text is rejected with HTTP 400. When `true`, that message replaces only the app's configured system prompt, and skills, MCP resources and other injected parts are still appended. | No       |
| `SKILL_INVOCATION_MAX_SKILLS_PER_MESSAGE` | `5`     | Maximum skills (`> 0`) honoured on one message (`custom_content.skills`); extra picks are dropped and reported in the *Initialization issues* stage. Clamped to `SKILL_INVOCATION_MAX_SKILLS`. Preview-gated.                                                                                                  | No       |

### Behavioral changes

> [!NOTE]
> - **Client system messages are rejected by default.** This applies on upgrade with no config change. A request whose leading `system` message has text now fails with HTTP 400 (`role 'system' is not accepted by this application; it uses its own system prompt.`), where it used to replace the app's prompt. Set `ALLOW_OVERRIDE_SYSTEM_MESSAGE=true` for clients that rely on sending one. A system message with no text is still accepted and ignored (#641).
> - **Nested sub-app stages are on by default** — apps that call another QuickApp as a deployment tool now show the sub-app's stages under the `Calling X` stage with no config change; set `features.stage_display.propagate_sub_stages: false` to turn it off (#537).
> - **Hook `arguments` are templates `[Preview]`** — a literal `${` in existing hook `arguments` is now interpolated (escape it as `$${`), and `on_request_start` hooks time out after 15 s by default unless `timeout_seconds` is set (#607).

### DIAL Configuration changes

> [!IMPORTANT]
> DIAL Core reports an application's `features.systemPromptSupported` as `true` when it is not set. As a result, DIAL Chat offers a system-prompt field for QuickApps, and with the default `ALLOW_OVERRIDE_SYSTEM_MESSAGE=false` anything typed there now fails with 400.
>
> **Recommended migration** (#641):
>
> 1. **Add** `"systemPromptSupported": false` to the `features` of each QuickApp application in DIAL Core's configuration. Skip this if you set `ALLOW_OVERRIDE_SYSTEM_MESSAGE=true`.

---

#### ai-dial-quickapps-frontend `0.3.0`

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

### Settings keys (`CUSTOM_CLIENT_VARIABLES`)

| Key | Change | Description |
| --- | --- | --- |
| `codeInterpreterEnabled`, `webFetchEnabled`, `addAttachmentEnabled` | Documented | Boolean (must be `true`, not `"true"`); offer the Code interpreter, Web fetch and Add attachment settings, off when unset. Replace the removed `*_ENABLED` env vars from `0.3.0-rc.0` |

### Host integration changes

> [!IMPORTANT]
> The editor now posts a new `VALIDITY_STATE` message (`{ isValid }`) and a `SAVE_ERROR` for a manual save blocked by validation. Upgrade `ai-dial-chat` to a version that handles them to disable Save/Preview on an invalid form; older hosts ignore the new message and wait for the save timeout.

### Behavioral changes

> [!NOTE]
> Shared apps are no longer forced read-only; the editor honors only the host's `isReadonly`.

- **Application credentials** — the action now closes the agent details popup, then sends `REQUEST_APPLICATION_CREDENTIALS`; the host protocol is unchanged (#244)

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
| `CODE_INTERPRETER_ENABLED`, `WEB_FETCH_ENABLED`, `ADD_ATTACHMENT_ENABLED` | `CUSTOM_CLIENT_VARIABLES` keys `codeInterpreterEnabled`, `webFetchEnabled`, `addAttachmentEnabled` | Boolean `true`, not `"true"` |
| `ALLOWED_ORIGIN`, `DIAL_ADMIN_URL`, `DIAL_CHAT_URL` | `CUSTOM_CLIENT_VARIABLES` keys `allowedOrigin`, `dialAdminHost`, `dialChatHost` | |
| `QUICK_APPS_APPLICATION_NAME` | `applicationName` entry-URL query parameter | No env fallback |

### Settings keys (`CUSTOM_CLIENT_VARIABLES`)

| Key | Change | Description |
| --- | --- | --- |
| `allowedOrigin` | New location, accepts several values | One origin, a comma-separated list or a JSON array; unset or `*` accepts any origin (unsafe outside local dev) |
| `dialAdminHost`, `dialChatHost` | New location | Host origins for the visualizer connector |
| `codeInterpreterEnabled`, `webFetchEnabled`, `addAttachmentEnabled` | New location | Boolean (must be `true`, not `"true"`); offer the Code interpreter, Web fetch and Add attachment settings, off when unset |
| `applicationName` | Removed | Passed by the host as the entry-URL query parameter |

### Host integration changes

> [!IMPORTANT]
> Upgrade `ai-dial-chat` first: it must send `applicationName` in the QuickApps entry URL, otherwise `readyToSave` is never sent and Save/Preview stay disabled; the admin host does not send it yet. The editor also posts `VALIDITY_STATE` (`{ isValid }`) and a `SAVE_ERROR` for a manual save blocked by validation — older hosts ignore them and wait for the save timeout. Application credentials need a host advertising `applicationCredentials=true` and handling `REQUEST_APPLICATION_CREDENTIALS`; older hosts just hide the action. Update every identity provider's redirect URI to `/api/v1/auth/callback/<provider>`.

### Behavioral changes

> [!NOTE]
> New apps default the orchestrator temperature to `0.5` (saved values are unchanged), and shared apps are no longer forced read-only.

- **Image** — now `chat-api` plus this app's static build, amd64-only, default port `5000` (#149, #179)
- **Health check** — `HEALTHCHECK` calls `/<API_PREFIX>/health` (#149)

---

#### ai-dial-adapter-openai `0.45.0`

##### Breaking changes

**HTTP connection pool exhaustion now returns 503 instead of blocking indefinitely**

HTTP connection limits are now configurable, and when the pool is exhausted the service returns 503. Previously the behavior was unbounded. Operators should review and tune connection limit settings to avoid unexpected 503s in production.

| Previous configuration | Required action |
|---|---|
| No connection limit configured; requests queued/blocked on pool exhaustion | Review new HTTP conn limit configuration options and set appropriate values for your workload to avoid 503 responses |

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | No | unset | Configures the uvicorn keep-alive timeout. Previously not configurable. |

---

#### ai-dial-adapter-vertexai `0.41.1`

##### Breaking changes

**503 returned on upstream HTTP connection pool exhaustion**

Upstream HTTP connection pool limits are now configurable. When the pool is exhausted, the adapter returns 503 instead of queuing or erroring differently. Operators should review and configure pool limits to avoid unexpected 503s under load.

| Previous configuration | Required action |
|---|---|
| No connection pool limits configured; requests queued or failed with previous behavior | Review new connection pool limit configuration options and set appropriate values for your load profile to avoid 503 responses under concurrency |

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | No | unset | Configures the uvicorn keep-alive timeout. New in this release. |

---

#### ai-dial-admin-backend `0.22.0`

##### Breaking changes

**DIAL Core 0.48.0 and 0.49.0 schema support — cross-component version constraints**

This release adds support for DIAL Core 0.48.0 and 0.49.0 configuration schemas (conditional pricing rates, new deployment interface properties, authType on upstreams). If the paired DIAL Core instance is below 0.48.0, features like conditional rates, overridePaths, and authType will not be understood by Core. Operators must ensure DIAL Core is at the appropriate version before using these new configuration properties.

| Previous configuration | Required action |
|---|---|
| DIAL Core < 0.48.0 in use | Upgrade DIAL Core to at least 0.48.0 before using cacheRead/cacheWrite conditional rates, interface defaults/overridePaths, or responsesEndpoint on interceptors |
| DIAL Core < 0.49.0 in use | Upgrade DIAL Core to at least 0.49.0 before using prompt/completion conditional rates or authType on upstreams |

**Model create/update now rejects previously-accepted invalid pricing configurations**

Model create and update API calls will now be rejected if pricing is missing a `unit`, has a blank or non-finite rate, or includes a cache rate or decision tree under a non-`token` unit. Existing automation or tooling that creates/updates models with such pricing will break.

| Previous configuration | Required action |
|---|---|
| Automation submitting model pricing without a `unit`, with blank/non-finite rates, or with cache rates under non-token units | Update automation/tooling to supply valid `unit` fields and finite rate values in all model pricing payloads |

**Route create/update now rejects BEARER upstream without a `key`**

With the new `authType` field on upstreams, route create and update will reject any upstream configured with `authType: BEARER` that does not supply a `key`. Previously this combination was not validated.

| Previous configuration | Required action |
|---|---|
| Automation creating/updating routes with BEARER upstreams lacking a `key` | Ensure all BEARER-type upstreams include a `key` value before deploying |

---

#### ai-dial-adapter-bedrock `0.45.0`

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | No | unset | Configures the uvicorn keep-alive timeout. Previously not configurable. |

---

#### ai-dial-adapter-dial `0.20.0`

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | No | unset | Configures the uvicorn keep-alive timeout. Newly exposed; operators may want to tune this for their environment. |

---

#### ai-dial-analytics-realtime `0.29.0`

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | No | unset | Configures the uvicorn keep-alive timeout. Previously this value was not configurable. |

---

#### ai-dial-core `0.49.0`

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `temperature (feature flag)` | `enabled` | `disabled` | The `temperature` feature flag is now disabled by default. Deployments relying on the temperature parameter being passed through may be affected. |

---
