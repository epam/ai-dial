# Instructions

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.44.0-rc.0`
   - ai-dial-adapter-openai: `0.44.0-rc.0`
   - ai-dial-adapter-vertexai: `0.40.0-rc.0`
   - ai-dial-adapter-dial: `0.19.0-rc.0`
   - ai-dial-chat-themes: `0.20.0`
   - ai-dial-chat: `1.1.0-rc.1`
   - ai-dial-core: `0.48.0-rc.0`
   - ai-dial-analytics-realtime: `0.28.0-rc.0`
   - ai-dial-rag: `0.43.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.4.0`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.12.0-rc.0`
   - ai-dial-mind-map-backend: `0.15.0-rc.0`
   - ai-dial-mind-map-frontend: `0.14.0-rc.0`
   - ai-dial-admin-backend: `0.21.0-rc.0`
   - ai-dial-admin-frontend: `0.21.0-rc.0`
   - ai-dial-admin-deployment-manager-backend: `0.21.0-rc.0`
   - ai-dial-admin-evaluation-framework-backend: `0.4.0-rc.0`
   - ai-dial-admin-evaluation-metrics: `0.3.0-rc.0`
   - ai-dial-openapi-to-mcp: `0.2.1`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

### Release-specific notes

#### ai-dial-admin-deployment-manager-backend `0.21.0-rc.0`

This release includes **medium-priority changes**. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.21.0-rc.0/docs/upgrade-plans/0.21.0.md) before proceeding.

---

#### ai-dial-admin-evaluation-framework-backend `0.4.0-rc.0`

### New environment variables

> **Required**: ✅ = must be supplied, the service will not start without it. ❌ = ships with a working default. Nothing in this release is required in a default deployment; ⚠️ in a description marks a variable that becomes mandatory once you switch on the feature it belongs to.

| Variable | Required | Default | Description |
|---|:-:|---|---|
| `DIAL_ADAS_URL` | ❌ | `http://localhost:8087` | ⚠️ Base URL for the dial-adas query-execute API, which backs both cost endpoints. The default points at localhost, so it must be overridden before `GET /api/v1/costs/**` returns anything useful. |
| `DIAL_ADAS_CONNECT_TIMEOUT_MS` | ❌ | `5000` | Connection timeout in milliseconds for the dial-adas client. |
| `DIAL_ADAS_READ_TIMEOUT_MS` | ❌ | `30000` | Read timeout in milliseconds for the dial-adas client. |
| `SECURITY_JWT_RESOLVE_USER_NAME` | ❌ | `false` | When `true`, `AuthorResolver` calls DIAL Core `GET /v1/user/info` with the caller's bearer token and stores `userDisplayName` in `createdBy` instead of the raw claim value. Applies only when `config.rest.security.mode=oidc`. The stored value is a snapshot taken at creation time. |

### Removed environment variables

| Variable | Reason |
|---|---|
| `TEST_SUITE_RUN_EXECUTOR_CORE_POOL_SIZE` | The fixed run-execution thread pool is replaced by an unbounded thread-per-run `SimpleAsyncTaskExecutor`; concurrency is now governed solely by the run limits (#190) |
| `TEST_SUITE_RUN_EXECUTOR_MAX_POOL_SIZE` | Same as above (#190) |
| `TEST_SUITE_RUN_EXECUTOR_QUEUE_CAPACITY` | Same as above (#190) |
| `TEST_SUITE_RUN_EXECUTION_CANCELLATION_GRACE_PERIOD_MS` | Cancellation is interrupt-driven — there is no drain phase left to bound (#190) |
| `TEST_SUITE_RUN_CANCELLATION_GRACE_PERIOD_MS` / `CLI_RUN_CANCELLATION_GRACE_PERIOD_MS` | The `eval-cli` equivalents of the above (#190) |

> [!NOTE]
> All five are ignored if still set — a stale value will not fail startup.

### Behavioral changes
> [!NOTE]
> These take effect automatically on upgrade — no operator action required, but run concurrency and cancellation timing differ from `0.3.0`.

- **Run concurrency** — the fixed pool (core `5` / max `10` / queue `50`) that capped real concurrency at 5 despite `max-concurrent-runs-global = 20` is gone; a run now gets its own thread and the configured run limits are the only ceiling. Expect more runs genuinely executing in parallel, and size the database connection pools and deployment quotas accordingly (#190)
- **Cancellation timing and outcome** — cancelling no longer waits out a grace period; the run's executor is interrupted immediately and the metric-provider client moves to `JdkClientHttpRequestFactory` so a call blocked on the 150 s read timeout aborts at once. A run whose analytics batch write fails now ends `FAILED` / `ANALYTICS_WRITE_FAILED` instead of being mislabelled `CANCELLED`, and a late cancel can never end `COMPLETED` #187 #191 (#190)
- **Deployment by-id lookup** — `GET /api/v1/deployments/all/{id}` issues one request to DIAL Core's unified endpoint instead of three concurrent probes (3x less upstream traffic), and an unknown deployment returns `404` where it previously returned `502 UPSTREAM_NOT_FOUND` #192 (#194)
- **Suite validity on model-selecting endpoints** — a suite whose literal request body sets `model` to something other than its `deploymentRef.id` is now persisted as **invalid** with a `REQUEST_BODY_VALIDATION_ERROR` warning, so it is excluded from runnable selection. Suites saved as valid before this rule existed are caught at run time instead and produce an ERROR row #188 (#193, #195)
- **Private-dataset double binding** — returns `409 PRIVATE_DATASET_ALREADY_BOUND` from the service layer instead of a `500` carrying the driver message; the PL/pgSQL trigger is demoted to a race backstop #22 (#172)

### Database migrations
> [!NOTE]
> Flyway applies these automatically on startup; the service account needs DDL privileges on both schemas.

- **analytics** — `V1.19__CreateTestCaseEvalScoresTable.sql` — creates `test_case_eval_scores` (`eval_summary_id` PK, `score`, `passed`, `computed_at_ms`) for per-row scoring; forward-only, historical rows read back as `null` (#178)
- **meta** — `V1.30__AddUniqueIndexToMetricDeclarationVersions.sql` — drops the non-unique `idx_metric_declaration_versions_declaration_version` from `V1.9` and replaces it with a **unique** `uq_metric_declaration_versions_declaration_version` on `(metric_declaration_id, schema_version DESC)` (#183)
- **meta** — `V1.31__AddTestCaseOverallScoreToTestSuites.sql` — adds the nullable `test_case_overall_score` JSONB column to `test_suites`; `NULL` falls back to `overall_score`, today's behavior (#178)

> [!CAUTION]
> `V1.30` converts an existing index to a **unique** index. If `metric_declaration_versions` already holds two rows with the same `(metric_declaration_id, schema_version)` — possible only through direct DB writes — the migration fails and startup aborts; check for duplicates before upgrading. The drop-and-recreate also takes an exclusive lock for the duration of the index build.

### API / contract changes
> [!NOTE]
> Full reference in Swagger UI (`/swagger-ui.html`).

- **New endpoints** — `GET /api/v1/costs/test-suite-run/{id}` and `GET /api/v1/costs/deployment/{id}?from&to` (#160, #202), `GET /api/v1/metric-declarations/versions/latest` (#183), and `GET /api/v1/deployments/all/{id}` (#180, #194). `GET /api/v1/test-suite-runs/{id}/costs` is a backward-compatible alias for the run-costs route (#202)
- **Breaking** — the run `status` enum gains `CANCELLING`; clients switching exhaustively on status must handle it #187 (#190)
- **Changed** — `GET /api/v1/deployments/all/{id}` returns `404` for an unknown deployment instead of `502 UPSTREAM_NOT_FOUND` #192 (#194)
- **New 409 `PRIVATE_DATASET_ALREADY_BOUND`** — binding a second test suite to a `PRIVATE` dataset, replacing the previous `500` that echoed the failing SQL #22 (#172)
- **New `REQUEST_BODY_VALIDATION_ERROR`** — a suite-validation warning code when a literal body `model` disagrees with the suite's deployment, and an execution error code at invocation time (ERROR row in runs, HTTP 400 for a single try-it-out, in-band status-zero failed invocation for a chained one) #188 (#195)
- **Additive** — nullable `score` / `passed` on eval-summary list, detail and export DTOs, and `testCaseOverallScore` on test-suite DTOs; both `score` and `passed` are also first-class Query DSL fields on the `eval_summaries` entity #85 (#178)
- **Additive** — `interfaces` (which invocation APIs a deployment supports — chat, mcp, openaiResponses, anthropicMessages) and `features` on `DeploymentInfoDto`, populated on the single-deployment endpoints only; the short listing projection deliberately omits them (#186, #194)

---

#### ai-dial-admin-evaluation-metrics `0.3.0-rc.0`

### Structured logs support

This release adds support for structured (JSON) logging, implemented by the `aidial-sdk`. Logging format is now configurable via new environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `DIAL_SDK_LOG_FORMAT` | `text` | Logging format. Set to `text` or `json`. Implemented by the DIAL SDK. |
| `DIAL_SDK_TEXT_LOG_FORMAT` | `'%(levelprefix)s \| %(asctime)s \| %(name)s \| %(process)d \| %(message)s'` | Logging format for text logs. Implemented by the DIAL SDK. |
| `DIAL_SDK_JSON_LOG_FORMAT` | `'{"level": "%(levelname)s", "time": "%(asctime)s", "logger": "%(name)s", "process": "%(process)d", "message": "%(message)s"}'` | Logging format for JSON logs. Implemented by the DIAL SDK. |

See the [full logging documentation](https://github.com/epam/ai-dial-sdk/blob/0.39.0/docs/logging.md) for details on logging configuration and available logging modes.

---

#### ai-dial-admin-frontend `0.21.0-rc.0`

> [!IMPORTANT]
> This release introduces the full DIAL Core API migration as a Preview — adding `catalog` to `DISABLE_MENU_ITEMS` is recommended so the preview surface is not exposed to every admin user. A new optional `ANALYTICS_CONVERSATIONS_ENABLED` flag gates the Conversations view in Analytics. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-frontend/blob/0.21.0-rc.0/docs/upgrade-plans/0.21.0.md) before proceeding.

---

#### ai-dial-chat `1.1.0-rc.1`

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `CUSTOM_CLIENT_VARIABLES` | `{}` | Public, client-owned settings returned unchanged in client-config as `config.customVariables`. JSON object only; unset, blank or invalid values fall back to `{}`. Never include secrets. Restart the BFF after changing. |
| `WELCOME_SCREEN_DESCRIPTION` | unset | Operator-authored plain-text copy shown below the greeting heading on the new-chat start screen. Rendered as text, never as markup. Unset or blank hides it. |
| `SKILL_USAGE_ENABLED` | `false` | Client-visible kill switch for all skill-usage UI: the catalog skill "Use in chat" action and the composer's Skills menu. Every entry point is hidden while false. |

### Removed environment variables

| Variable | Reason |
| --- | --- |
| `SETTINGS_PAGE_ENABLED` | The Settings page is now always available; the flag that gated it was retired. A value left set is ignored. (#8762) |
| `SETTINGS_PAGE_ENABLED_ROLES` | Role restriction for the retired Settings page flag. (#8762) |

### New feature flags

| Flag | Description |
| --- | --- |
| `features.skillUsageEnabled` | Gates all skill-usage UI in the chat app. Toggled through `SKILL_USAGE_ENABLED`; defaults to `false` because the backend contract for sending skills with completions is not designed yet. Role-based rollout is not implemented. |

### Removed feature flags

| Flag | Reason / replacement |
| --- | --- |
| `features.settingsPageEnabled` | No replacement — the Settings page and its new Preferences tab are always enabled. (#8762) |

### New `ENABLED_UI_FEATURES` values

| Value | Description |
| --- | --- |
| `removable-tools` | Allows tools selected in the conversation input to be removed. (#8488) |
| `show-all-starters` | Renders every configured conversation starter instead of the default subset. (#8829) |
| `hide-footer-version` | Hides the version label in the footer. (#8829) |

### Behavioral changes

> [!NOTE]
> These take effect on upgrade with no operator action.

- **Settings page** — always enabled, and gains a Preferences tab. (#8762)

---

#### ai-dial-quickapps-backend `0.12.0-rc.0`

### Behavioral changes

> [!NOTE]
> The built-in file-parameter skill narrows when the `data` prefix is used, so existing apps change behaviour on upgrade without any config change. Reference-only parameters (`attachment_urls`) now always take `file:url::`, and a DIAL path is inlined for an off-platform MCP/REST tool unless its schema marks the parameter `"dial_url": true`.
>
> - **Tool-call file parameter formatting** — `config/predefined/skills/tool-call-file-parameter-formatting/SKILL.md` (v1.1 → v1.2) (#528)

### Prerequisites

> [!IMPORTANT]
> **DIAL Core ≥ 0.48.0** is required to enable skills — the `dial-skill` skill type (#524) and skill invocation from a message (#553).

### New environment variables

| Variable                        | Default  | Description                                                                                                                                                                                                                        | Required |
|---------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `MIN_TOOLS_FOR_DEFERRAL`        | `10`     | Deployment-wide minimum toolset size (`≥ 1`) for deferral to apply; smaller toolsets are loaded eagerly even when `deferred: true`. Apps override per-app via `orchestrator.tool_discovery.min_tools_for_deferral`. Preview-gated. | No       |
| `DIAL_SKILLS_FILE_MAX_BYTES`    | `262144` | Cap (bytes, `> 0`) on a single file read from a DIAL skill resource, `SKILL.md` included; an over-cap manifest drops the skill. Preview-gated.                                                                                     | No       |
| `DIAL_SKILLS_MAX_FILES`         | `200`    | Maximum bundled files (`> 0`) advertised to the agent per DIAL skill resource; beyond it the listing is truncated. Preview-gated.                                                                                                  | No       |
| `DIAL_SKILLS_LISTING_MAX_PAGES` | `10`     | Maximum file-listing pages (`> 0`) followed per DIAL skill resource, bounding a server-supplied cursor. Preview-gated.                                                                                                              | No       |
| `SKILL_INVOCATION_MAX_SKILLS`   | `10`     | Maximum distinct skills (`> 0`) a user may invoke from the messages of one conversation (`custom_content.skills`), counted newest first; beyond the cap the oldest picks stop being registered. Preview-gated.                    | No       |

### Behavioral changes

> [!NOTE]
> - **Tool errors reach the LLM** — apps change behaviour on upgrade with no config change: a failed tool call now returns `The tool call failed with an error: <text>` to the model, both by default (no `fallback_configuration`) and for every `continue` / `retry` strategy, replacing the canned "try another applicable tool" instructions (#465).
> - **`reasoning_effort` is forwarded** — a `reasoning_effort` already present under `deployment.parameters` (previously dropped silently) now reaches the deployment; for the orchestrator it is dropped with an *Initialization issues* warning when the deployment does not advertise `features.reasoningEfforts` (#554).

### Schema deprecations

> [!CAUTION]
> Still accepted in app manifests, but will be removed in future versions (#465).

| Legacy key                                        | Replacement                                 | Affected config model                         |
|---------------------------------------------------|---------------------------------------------|-----------------------------------------------|
| `fallback_configuration.strategies[].type: retry` | `type: continue`                            | `RetryStrategyModel`                          |
| `fallback_configuration.strategies[].type: stop`  | `type: hard_stop`                           | `StopStrategyModel`                           |
| `forward_tool_error_message`                      | — (no-op; tool errors are always forwarded) | `ContinueStrategyModel`, `RetryStrategyModel` |

---

#### ai-dial-adapter-bedrock `0.44.0-rc.0`

##### Breaking changes

**AWS STS session tags extended to all Bedrock clients; model ID added to session tags**

Previously STS session tags may have only applied to a subset of Bedrock clients. Now all Bedrock clients use STS session tags and model ID is included. This may require IAM policy or STS trust policy updates if tag-based conditions are in use.

| Previous configuration | Required action |
|---|---|
| STS session tags applied only to Converse API adapter clients | Review IAM/STS trust policies for tag-based conditions; ensure policies accommodate model ID tag and tags on all Bedrock clients |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `REQUEST_TIMEOUT_SECONDS` | `unknown (implied lower value)` | `600s (read timeout increased to 600s)` | The Bedrock client read timeout was increased to 600s. If REQUEST_TIMEOUT_SECONDS is not set, the effective read timeout is now 600s. |

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `REQUEST_TIMEOUT_SECONDS` | — | No | Makes the Bedrock request timeout configurable. Previously the read timeout was hardcoded; this var allows operators to tune it. |

---

#### ai-dial-adapter-vertexai `0.40.0-rc.0`

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE` | — | No | Support for EKS Pod Identity token file path; required when using EKS Pod Identity for AWS authentication. |

---
