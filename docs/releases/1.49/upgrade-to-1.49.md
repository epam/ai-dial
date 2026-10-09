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
> **`temperature` deployment feature now defaults to `false`.** A model or application that doesn't set `features.temperatureSupported` is now reported as not supporting temperature, so clients (for example, the chat temperature control) stop offering it for those deployments (#2097).

| Previous configuration | Required action |
|---|---|
| Deployment without `features.temperatureSupported` (implicitly `temperature: true`) | Add `"features": {"temperatureSupported": true}` to every deployment where temperature must stay available |

> [!CAUTION]
> **snake_case interface-type aliases removed.** Only `openaiChatCompletions`, `openaiEmbeddings`, `openaiResponses` and `anthropicMessages` are accepted; the aliases `openai_chat_completions`, `openai_embeddings`, `openai_responses` and `anthropic_messages` are rejected. Check translator `in` / `out` values in the dynamic config and in Admin-managed entities before upgrading (#2000).

##### New static settings

Set in `aidial.settings.json` or as environment variables with the `aidial.` prefix. Static settings require a restart; a `tracing` block placed in the dynamic config is ignored.

| Variable | Required | Default | Description |
|---|---|---|---|
| `tracing.genAiSpanAttributes` | No | `true` | Adds OTel GenAI `gen_ai.*` and `dial.*` attributes to the request span and OTel log records. Prompts, completions and tool payloads are never published. Set `false` to opt out (#1973, #2021) |
| `tracing.responseTraceHeaders` | No | `true` | Adds `traceparent`, `X-DIAL-TRACE-ID` and `X-DIAL-SPAN-ID` headers to every response (exposed via CORS). Set `false` to opt out (#1973, #2021) |
| `tracing.conversationIdHeaders` | No | `["x-claude-code-session-id", "thread-id", "x-session-id", "x-dial-client-channel-id", "X-CONVERSATION-ID"]` | Request headers, in priority order, whose value is published as `gen_ai.conversation.id`. A configured array replaces the default (#1973) |
| `proxy.additionalHopByHopHeaders` | No | `[]` | Extra header names stripped from proxied requests and responses on top of the built-in hop-by-hop list (#2008) |

##### Settings with changed behavior

| Variable | Old behavior | New behavior |
|---|---|---|
| `invitations.ttlInSeconds` | Ignored for share invitations (hardcoded 72 h when a role had no `share.<RESOURCE_TYPE>.invitation_ttl`) | Used as the default invitation TTL, rounded up to whole hours. `0` or a negative value now **fails startup** (#2067) |
| `client.proxyOptions.*` / `client.nonProxyHosts` | Not applied to identity-provider JWKS fetching | JWKS (`identityProviders.*.jwksUrl`) is fetched through the configured outbound proxy. Make sure the proxy can reach the IdP, or add the IdP host to `client.nonProxyHosts` (#2035) |

##### New dynamic settings

| Setting | Description |
|---|---|
| `routes.<name>.upstreams[].authType` | How `key` is sent upstream: `API_KEY` (default, `API-KEY: <key>`) or `BEARER` (`Authorization: Bearer <key>`). Honored only on top-level `routes` (#2085) |

##### New endpoints

> [!NOTE]
> If ingress or an API gateway allows only listed paths, add: `POST /openai/v1/chat/completions` (#2005), `POST /openai/responses` (#2068), `GET /v1/deployment-names` (#2075), `GET /v1/deployments/{deployment_name}/usage` (#2073).

---

#### ai-dial-admin-backend `0.22.0-rc.0`

##### Prerequisites

> [!IMPORTANT]
> Conditional (decision-tree) pricing requires **DIAL Core ≥ 0.48.0** for `cacheRead` / `cacheWrite` (#1160) and **DIAL Core ≥ 0.49.0** for `prompt` / `completion` (#1175).

##### Database migrations
> [!NOTE]
> Flyway applies these automatically on startup; the service account needs DDL privileges.

- `V1.123__AddResponsesEndpointToInterceptorTables.sql` (PostgreSQL, MS SQL Server, H2) — adds the nullable `responses_endpoint` column to `interceptor_entity` and `interceptor_entity_aud` (#1165)

##### Behavioral changes

- **Config export to Kubernetes** — `CONFIG_EXPORT_CREATE_RESOURCES=true` now really creates a missing target Secret / ConfigMap (previously the export failed). With `false` (the default) a missing resource still fails the export (#1169)

---

#### ai-dial-admin-frontend `0.22.0-rc.0`

> [!IMPORTANT]
> Deploy together with ai-dial-admin-backend `0.22.0`. See the [infrastructure changelog](https://github.com/epam/ai-dial-admin-frontend/blob/0.22.0-rc.0/docs/INFRA-CHANGELOG.md) for details.

##### Renamed environment variables

| Old variable | New variable | Notes |
|---|---|---|
| `ANALYTICS_CONVERSATIONS_ENABLED` | `ANALYTICS_SESSIONS_ENABLED` | The old name is no longer read — if it is not renamed, the Sessions item stays hidden. Takes effect only when `ANALYTICS_ENABLED` is `true` (#4633) |

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANALYTICS_USAGE_ENABLED` [Preview] | No | `false` | Enables the analytics Dashboards page (built on the usage log) at `/dashboards` and the usage dashboard on Audit tabs. Takes effect only when `ANALYTICS_ENABLED` is `true` (#4625, #4675, #4818, #4821) |
| `DIAL_ANALYTICS_RUNNER_API_URL` [Preview] | No | unset | Base URL of the Analytics enrichment runner (pipeline Runtime tab, pause/resume, Failures, Groups). Unset hides every runtime control (#4789, #4827, #4849) |

##### Changed `DISABLE_MENU_ITEMS` values

| Value | Change |
|---|---|
| `analyticsconversations` | Replaced by `analyticssessions` (#4633) |
| `evaluators` | Removed — the Evaluators page is folded into pipelines (#4641) |
| `platformcatalogschemas` | New — Catalog Schemas item (#4556) |

##### Prerequisites

- **Admin backend** — deploy with ai-dial-admin-backend `0.22.0` (#4609, #4899)
- **Analytics data-access service** — requires a build with the evaluator-to-pipeline fold; the frontend no longer calls `/v1/evaluators*` (#4641, #4851, #4890, #4898)
- **Themes config** — the config served at `THEMES_CONFIG_URL` must define the ui-kit 2.0 color tokens. ai-dial-chat-themes `0.21.0` already defines them; custom theme configs must be updated (#4869)

##### Container image

> [!IMPORTANT]
> `npm` / `npx` are removed from the runtime image; the entrypoint is `node node_modules/next/dist/bin/next start`. Deployments that override the container `command` / `args` with `npm …` must be updated (#4882)

---

#### ai-dial-admin-evaluation-framework-backend `0.5.0-rc.0`

##### New environment variables

All variables below ship with a working default; every new feature they control is **off** by default.

| Variable | Required | Default | Description |
|---|---|---|---|
| `SPRING_AI_MCP_SERVER_ENABLED` | No | `false` | Turns on the inbound MCP server at `/mcp` (same authentication as `/api/v1/**`) (#208) |
| `SPRING_AI_MCP_SERVER_PROTOCOL` | No | `STATELESS` | `STATELESS` works with any replica; `STREAMABLE` keeps in-memory sessions and needs a single replica or sticky sessions. `SSE` is not supported (#208) |
| `DIAL_APP_PROXY_ENABLED` | No | `false` | DIAL Application mode: runs are started through a DIAL Core Application Route and use DIAL Core's per-request key instead of the user's JWT. **Requires `config.rest.security.api-key.enabled=true`**, otherwise startup fails. EF must be registered in DIAL Core (see `docs/configuration.md` §5.7) (#236) |
| `DIAL_APP_PROXY_DEPLOYMENT_NAME` | No | `EF` | Name of the DIAL Core deployment EF is registered under (#236) |
| `DIAL_APP_PROXY_HEARTBEAT_INTERVAL_MS` | No | `30000` | SSE heartbeat interval of the internal execute endpoint (#236) |
| `DIAL_APP_PROXY_TRIGGER_READ_TIMEOUT_MS` | No | `43200000` | Read timeout (12 h) for EF's call to the DIAL Core Application Route (#236) |
| `QUERY_DSL_EXTENSION_TEST_SUITE_RUN_COST_ENABLED` | No | `false` | Adds a derived `total_cost` to `test_suite_runs` query results, fetched from dial-adas (#222) |
| `QUERY_DSL_EXTENSION_TEST_SUITE_RUN_COST_TIMEOUT_SEC` | No | `2` | Deadline in seconds (min `1`) for the cost lookup (#222) |
| `CSV_IMPORT_ZIP_MAX_ENTRIES` | No | `1000` | Maximum number of entries in an imported ZIP archive (#227, #228) |
| `CSV_IMPORT_ZIP_MAX_TOTAL_UNCOMPRESSED_SIZE` | No | `1GB` | Maximum total uncompressed size of an imported ZIP (#227, #228) |
| `CSV_IMPORT_ZIP_MAX_MANIFEST_SIZE` | No | `1MB` | Maximum size of the archive's `manifest.json` (#227, #228) |

##### Required checks

- **dial-adas** — the instance at `DIAL_ADAS_URL` must expose `POST /v1/queries/execute-sql`, otherwise the run-costs endpoints return `502` (#207)
- **API-key role resolution** — with `config.rest.security.mode=oidc`, API-key callers now get roles from the matching provider's `roleClaims`; `API_KEY_USER_CLAIMS_ROLE_CLAIM` is only a fallback. Re-check `API_KEY_DEFAULT_ROLES_MAPPING` (#241, #248)
- **Ephemeral storage** — ZIP import/export is staged in temp files; the container temp directory must be writable and large enough for the biggest archive (#227, #228, #232)

##### Database migrations
> [!NOTE]
> Flyway applies these automatically on startup; the service account needs DDL privileges on both schemas. The meta Flyway now runs **after** the analytics Flyway and opens a read connection to the analytics datasource (for `V1_33`).

- **analytics** — `V1.20__CreateTestCaseMetricScoresAggregatedTable.sql` — creates `test_case_metric_scores_aggregated` (#231)
- **analytics** — `V1.21__AddRunCaseContextToTestCaseEvalScores.sql` — **drops and recreates** `test_case_eval_scores` (#231)
- **meta** — `V1.32__CreateRunMetricSnapshotsTable.sql` — creates `run_metric_snapshots` in meta (#199)
- **meta** — `V1_33__CopyRunMetricSnapshotsFromAnalytics` (Java migration) — copies `run_metric_snapshots` from analytics into meta (#199)
- **meta** — `V1.34__ReplaceRunMetricSnapshotsRunIndex.sql` — replaces the run index on `run_metric_snapshots` (#201)
- **meta** — `V1.35__AddMetricScoreAggregationToTestSuites.sql` — adds `test_suites.metric_score_aggregation` (default `'AVG'`) (#231)

> [!CAUTION]
> `V1.21` runs `DROP TABLE IF EXISTS test_case_eval_scores`. **When upgrading from `0.4.0`, all stored per-test-case `score` / `passed` values are deleted.** Back up the table first if you need those values.
>
> `V1_33` copies every snapshot row during startup, so startup takes longer when the analytics table is large. `V1.34` holds an exclusive lock on `run_metric_snapshots` until the migration commits.

---

#### ai-dial-chat `1.2.0-rc.0`

> [!IMPORTANT]
> The session cookie format changes (payload v2): **all existing user sessions are invalidated on upgrade and users have to sign in again.** Upgrade all chat replicas at once (#8990).

##### Prerequisites

> [!IMPORTANT]
> **DIAL Core ≥ 0.48.0** is required to enable `RESPONSES_BACKGROUND_ENABLED` (#9236).

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `AUTH_SESSION_MAX_AGE_SECONDS` | No | `2592000` (30 days) | Rolling session lifetime in seconds; a successful token refresh resets it. An invalid value fails startup. (#8990) |
| `ALLOWED_CONNECT_ORIGINS` | No | unset | Comma-separated HTTP(S) origins added to CSP `connect-src` for external PDF and Office previews. An invalid entry fails startup. (#9012, #9023) |
| `USER_USAGE_DEPLOYMENT_TYPES` | No | `model,application` | Deployment kinds reported by the user usage/limits APIs. Set `model` to keep the `1.1.0` behavior. (#9147) |
| `CUSTOM_CORE_API_CONFIG` | No | unset | Server-only JSON allowlist of GET DIAL Core paths exposed through `GET /api/v1/custom-api/:operationId`. An invalid value fails startup. (#9266) |
| `RESPONSES_BACKGROUND_ENABLED` | No | `false` | Runs eligible Responses generations as DIAL Core background jobs. Requires `RESPONSES_API_ENABLED=true` and DIAL Core ≥ 0.48.0. (#9236) |
| `GENERATION_FINALIZE_TIMEOUT_MS` | No | `60000` | Timeout in ms for releasing a generation whose final write never settles (min `1000`). (#8953) |
| `ALLOW_VISUALIZER_SEND_MESSAGES` | No | `false` | Lets visualizer iframes send messages as the user. Enable only for trusted visualizers. (#9246) |
| `UI_EVENT` | No | unset | Start-page celebration: `halloween` or `new-year`. (#9033) |
| `MCP_APP_HOST_NAME` | No | unset (`ai-dial-chat`) | Identifier sent to MCP Apps as `hostInfo.name`. (#8919) |
| `TEXT_REFINEMENT_SKILL_DESCRIPTION_PROMPT`, `TEXT_REFINEMENT_SKILL_INSTRUCTIONS_PROMPT`, `TEXT_REFINEMENT_SCHEDULED_TASK_DESCRIPTION_PROMPT`, `TEXT_REFINEMENT_SCHEDULED_TASK_INSTRUCTIONS_PROMPT`, `TEXT_REFINEMENT_APPLICATION_DESCRIPTION_PROMPT`, `TEXT_REFINEMENT_TOOLSET_DESCRIPTION_PROMPT`, `TEXT_REFINEMENT_PROMPT_DESCRIPTION_PROMPT` | No | unset (built-in prompt) | Override the built-in "Refine with AI" prompts. "Refine with AI" is available whenever `UTILITY_MODEL` is set. (#9034, #9286) |
| `CONVERSATION_NAMING_SYSTEM_PROMPT` | No | unset (built-in prompt) | Overrides the conversation naming system prompt. (#9034) |
| `TRANSCRIPTION_PROMPT` | No | unset (built-in prompt) | Overrides the prompt for audio transcription through `ASR_MODEL`. (#9034) |
| `HTTP_PROXY` / `HTTPS_PROXY` / `NO_PROXY` | No | unset | Now applied to outbound OIDC, themes and DIAL Core calls. If a proxy is set in the pod environment, add in-cluster hosts (e.g. the DIAL Core service) to `NO_PROXY`. (#9038, #9084) |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `CORS_ORIGIN` | `http://localhost:4207` | value of `AUTH_CALLBACK_BASE_URL` | Set explicitly only when the frontend is served from a different origin. (#9022) |
| `AUTH_POST_LOGOUT_REDIRECT_URI` | unset | value of `AUTH_CALLBACK_BASE_URL` | Must still be registered in each IdP client. (#9022) |
| `FILE_MANAGER_AVAILABLE_TABS` | `my_files,shared,organization` | `all,my_files,shared,organization` | Deployments that set this variable explicitly must add `all` to get the new tab. (#9117) |

##### Removed environment variables

| Variable | Reason |
|---|---|
| `SKILL_USAGE_ENABLED` | The skill-usage UI is always available. A value left set is ignored. (#9119) |

##### New `ENABLED_UI_FEATURES` values

| Value | Description |
|---|---|
| `starters-below-greeting` | Moves conversation starters between the greeting and the input. (#9155) |
| `hide-greeting` | Hides the greeting and the welcome-screen description. (#9155) |
| `show-agent-description` | Shows the selected agent's `description` on the empty-chat screen. (#8883) |
| `disable-input-history-navigation` | Disables Up/Down history navigation in the chat input. (#9037) |
| `hide-conversation-export` | Hides the "Export" and "Export all" entries. (#9037) |
| `hide-settings-page` | Hides the Settings page entry. (#9037) |
| `show-header-logo` | Shows the theme logo in the top bar. (#9051, #9155) |

##### New container images

| Image | Contents |
|---|---|
| `epam/ai-dial-chat-bff` | BFF only, for a frontend hosted elsewhere (used by ai-dial-quickapps-frontend `0.3.0`). Same environment variables as the full image. (#9212) |
| `epam/ai-dial-chat-mcp-app-sandbox` | Separate-origin MCP Apps sandbox proxy. Requires `MCP_APP_SANDBOX_ALLOWED_HOST_ORIGINS`; point chat's `MCP_APP_SANDBOX_URL` at it. (#8890) |

##### Behavioral changes

> [!WARNING]
> **Boolean env parsing fixed** — `SCHEDULED_TASKS_ENABLED`, `LIVE_CHAT_INTERACTION_ENABLED` and `LLM_CONVERSATION_NAMING_ENABLED` set to `"false"` were previously read as `true` and are now read as `false`. Check these values before upgrading. (#9142)

---

#### ai-dial-chat-themes `0.21.0`

> [!NOTE]
> If you override the bundled `static/config.json`, merge in the new ui-kit 2.0 tokens (required by ai-dial-admin-frontend `0.22.0`): dark theme `bg-layer-*`, `bg-control-*`, `text-*`, `stroke-*`, `shadow-*`; light theme `stroke-accent-focus`, `shadow-*`, `bg-control-error-alpha`, `bg-control-accent-muted`, `bg-control-accent-alpha-*-subtle`. `bg-layer-6` and `bg-layer-7` were removed from the light theme (#156, #158).

---

#### ai-dial-quickapps-backend `0.13.0-rc.0`

##### Prerequisites

> [!IMPORTANT]
> **DIAL Core ≥ 0.49.0** is required for the per-user tool access filter (`features.tool_access_filter`) (#598, #624). On an older DIAL Core the filter fails open and all configured tools are offered.

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `SKILL_INVOCATION_MAX_SKILLS_PER_MESSAGE` | No | `5` | Maximum skills (`> 0`) honoured on one user message; clamped to `SKILL_INVOCATION_MAX_SKILLS`. Preview-gated. (#574) |

##### Schema changes

> [!NOTE]
> All additions are optional; existing manifests stay valid.

| Key | Affected config model | Description |
|---|---|---|
| `features.tool_access_filter.enabled` | `ToolAccessFilterConfig` (new) | Default `false`. Limits DIAL deployment tools, `dial-app` and `dial-mcp` toolsets to those accessible to the calling user. Requires DIAL Core ≥ 0.49.0 (#598, #624) |
| `features.stage_display.propagate_sub_stages` | `StageDisplayConfig` | Default `true` — stages of a Quick App called as a deployment tool are shown nested under the `Calling X` stage (#537) |
| `hidden_from_model` | `MCPToolSet`, `DialMCPToolSet`, `DialAppToolSet` | Preview. MCP tools callable by hooks but never shown to the model (#619) |
| `orchestrator.attachment_strategy.accepted_types` | `LazyOnDemandAttachmentStrategy` | Optional MIME allowlist narrower than the deployment's `input_attachment_types` (#558) |
| `hooks[].event: on_completion` | `HookEvent` | New event, runs after the orchestrator loop ends (#607) |
| `hooks[].timeout_seconds` | `ToolCallHookConfig` | Optional per-hook timeout (default `15` s for `on_request_start`, `30` s for `on_completion`) (#607) |

> [!WARNING]
> Hook `arguments` are now rendered as a [JSON-e](https://json-e.js.org) template: literal `${` sequences in existing hook arguments must be escaped as `$${` (#607).

---

#### ai-dial-quickapps-frontend `0.3.0-rc.0`

> [!IMPORTANT]
> The editor moves from a standalone Next.js server with `next-auth` to a static React build served by the ai-dial-chat BFF (`epam/ai-dial-chat-bff`), which also handles authentication. The Docker image is different and **the runtime environment variables have changed** — an existing `0.2.0` configuration will not work unchanged (#149, #155, #162). Please review the [full changelog](https://github.com/epam/ai-dial-quickapps-frontend/blob/0.3.0-rc.0/CHANGELOG.md) before proceeding.

##### Prerequisites

> [!IMPORTANT]
> **ai-dial-chat ≥ 1.2.0** must be deployed **before** this version. Without it, **Save & Exit** and **Preview** stay disabled with no error (#232).

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
| `QUICK_APPS_APPLICATION_NAME` | The host passes the application name as the `applicationName` URL query parameter (#232) |

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

---

#### ai-dial-analytics-realtime `0.29.0-rc.0`

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | No | `5` | Uvicorn `--timeout-keep-alive`, in seconds, read by the new Docker entrypoint (#309) |

> [!IMPORTANT]
> The image now uses `ENTRYPOINT ["/docker_entrypoint.sh"]` instead of a `CMD` running `uvicorn`. A deployment that passes only extra uvicorn flags as container `args` must pass the full `uvicorn …` command (#309).

---

#### ai-dial-adapter-bedrock `0.45.0-rc.0`

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | No | `70` | Idle HTTP keep-alive timeout of the adapter server in seconds. Must be greater than DIAL Core's `client.keepAliveTimeout` (default `60`). Previously not configurable (uvicorn default `5`) (#517) |
| `ANTHROPIC_POOL_TIMEOUT` | No | `10` | Time in seconds a request waits for a free connection when `ANTHROPIC_MAX_CONNECTIONS` is reached; on timeout the adapter returns `503` (#519) |
| `THREAD_POOL_SIZE` | No | `512` | Size of the shared thread pool for blocking AWS SDK calls (#510) |

##### Environment variables with changed behavior

| Variable | Old behavior | New behavior |
|---|---|---|
| `REQUEST_TIMEOUT_SECONDS` | Applied to read, write **and pool** | Applied to read and write only; the pool wait is `ANTHROPIC_POOL_TIMEOUT` (#519) |
| `ANTHROPIC_MAX_CONNECTIONS` / `ANTHROPIC_MAX_KEEPALIVE_CONNECTIONS` | Per Anthropic client | Per worker process — all Anthropic clients share one connection pool (#507) |

> [!IMPORTANT]
> The Docker image no longer has a `CMD`. `/docker_entrypoint.sh` starts uvicorn only when the container gets no arguments. If your deployment overrides the container `command` / `args` with its own uvicorn command line, `TIMEOUT_KEEP_ALIVE` is not applied — remove the override or add `--timeout-keep-alive` to it (#517)

---

#### ai-dial-adapter-openai `0.45.0-rc.0`

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `HTTP_MAX_CONNECTIONS` | No | `1000` | Maximum number of concurrent upstream connections per worker process (#581) |
| `HTTP_MAX_KEEPALIVE_CONNECTIONS` | No | `100` | Maximum number of idle upstream connections kept open for reuse (#581) |
| `HTTP_POOL_TIMEOUT` | No | `10` | Time in seconds a request waits for a free upstream connection; on timeout the adapter returns `503` (#581) |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | `5` | `70` | Must be greater than DIAL Core's `client.keepAliveTimeout` (default `60`). If you set `5` explicitly, remove it or raise it (#577) |

---

#### ai-dial-adapter-vertexai `0.41.0-rc.0`

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | No | `70` | Idle HTTP keep-alive timeout of the adapter server in seconds. Must be greater than DIAL Core's `client.keepAliveTimeout` (default `60`). Previously not configurable (uvicorn default `5`) (#553) |
| `HTTP_MAX_CONNECTIONS` | No | `250` | Maximum number of concurrent upstream connections per worker process. All SDK clients (Google GenAI, Anthropic, Mistral) now share one pool, so this caps the total upstream concurrency — raise it under high load (#549, #557, #558) |
| `HTTP_MAX_KEEPALIVE_CONNECTIONS` | No | `75` | Maximum number of idle connections kept open for reuse (#557) |
| `HTTP_POOL_TIMEOUT` | No | `10` | Time in seconds a request waits for a free upstream connection; on timeout the adapter returns `503` (#557) |

> [!IMPORTANT]
> The Docker image no longer has a `CMD`. `/docker_entrypoint.sh` starts uvicorn only when the container gets no arguments. If your deployment overrides the container `command` / `args` with its own uvicorn command line, `TIMEOUT_KEEP_ALIVE` is not applied — remove the override or add `--timeout-keep-alive` to it (#553)

---

#### ai-dial-adapter-dial `0.20.0-rc.0`

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `HTTP_MAX_CONNECTIONS` | No | `1000` | Maximum number of concurrent upstream connections (#167) |
| `HTTP_MAX_KEEPALIVE_CONNECTIONS` | No | `100` | Maximum number of idle upstream connections kept open for reuse (#167) |
| `HTTP_POOL_TIMEOUT` | No | `10` | Time in seconds a request waits for a free upstream connection; on timeout the adapter returns `503` (#167) |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `TIMEOUT_KEEP_ALIVE` | `5` | `70` | Must be greater than DIAL Core's `client.keepAliveTimeout` (default `60`). If you set `5` explicitly, remove it or raise it (#165) |

> [!IMPORTANT]
> The Docker image no longer has a `CMD`; uvicorn is started by `/docker_entrypoint.sh` only when the container gets no arguments. If your deployment overrides the container `command` / `args`, `TIMEOUT_KEEP_ALIVE` handling is no longer supplied by the image (#165)

---
