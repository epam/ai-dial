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

> [!IMPORTANT]
> 1.0 is a ground-up rewrite, not an upgrade of the 0.x line. The whole configuration surface moved to `apps/chat-api`, the OIDC callback path changed, and several legacy variables have no successor. Read [Migrating from the Legacy DIAL Chat](https://github.com/epam/ai-dial-chat/blob/1.0.0/docs/legacy-chat-migration-guide.md) before upgrading a deployment. The full variable reference is [`apps/chat-api/README.md`](https://github.com/epam/ai-dial-chat/blob/1.0.0/apps/chat-api/README.md#environment-variables) with the annotated `apps/chat-api/.env.template`; the source of truth is `apps/chat-api/src/config/environment.config.ts`, validated at boot.

### New environment variables

These have no legacy counterpart and change user-visible behavior. Every other 1.0 variable is either carried over unchanged or renamed — see the two tables below.

| Variable                                                            | Default                        | Description                                                                                                                                        |
| ------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUTH_POST_LOGOUT_REDIRECT_URI`                                     | —                              | Required once any provider is configured; must be registered in the provider's post-logout allowlist.                                               |
| `AUTH_COOKIE_SECURE`                                                | `true`                         | Set `false` only for a local HTTP smoke run. Cross-site iframe deployments need `true` (`SameSite=None; Secure`).                                   |
| `AUTH_HEADER_TOKEN_ENABLED` / `AUTH_HEADER_TOKEN_ALLOWED_ISSUERS`   | `false` / —                    | Accept a bearer token from a request header, verified against the issuer's JWKS.                                                                    |
| `OVERLAY_SANDBOX_ENABLED`                                           | `false`                        | Serves the overlay sandbox host page at `/overlay-sandbox/`.                                                                                        |
| `RESPONSES_API_ENABLED`                                             | `false`                        | Server-side kill switch for routing eligible generations through the OpenAI Responses API.                                                          |
| `SCHEDULED_TASKS_ENABLED` / `_ROLES`                                | `false` / all roles            | Enables the Scheduled Tasks page, its sidebar entry, and the DIAL Scheduler proxy endpoints.                                                        |
| `SETTINGS_PAGE_ENABLED` / `_ROLES`                                  | `false` / all roles            | Enables the Settings page, its user-menu entry, the `/settings` route, and the Usage tab fetch.                                                     |
| `LIVE_CHAT_INTERACTION_ENABLED` / `_ROLES`                          | `false` / all roles            | Subscribes to the DIAL Core client channel and shows the mid-completion toolset sign-in dialog.                                                     |
| `SCHEDULER_SERVICE_ID` / `SCHEDULER_APP_ID` / `_TIMEOUT_MS`         | —                              | DIAL Scheduler service identity used by the Scheduled Tasks endpoints.                                                                              |
| `ASR_ENABLED_ROLES`                                                 | all roles                      | Restricts ASR transcription to specific roles; ASR itself is derived from `ASR_MODEL` presence.                                                     |
| `TRANSCRIBE_SIZE_LIMIT_BYTES`                                       | `5242880`                      | Maximum audio file size accepted by the transcription endpoint.                                                                                     |
| `UTILITY_MODEL` + `LLM_CONVERSATION_NAMING_ENABLED`                 | — / `false`                    | Deployment used for server-side tasks, and the switch that turns on LLM conversation naming (also requires `DIAL_API_KEY`).                         |
| `FILE_MANAGER_AVAILABLE_TABS`                                       | `my_files,shared,organization` | Which File Manager tabs are shown.                                                                                                                  |
| `DEEP_RESEARCH_TOOL_ID`                                             | —                              | When set, the chat input renders a Tools submenu with that tool toggle.                                                                              |
| `MCP_APP_SANDBOX_URL` / `MCP_APP_THEME` / `MCP_APP_USER_AGENT`      | — / — / `ai-dial-chat`         | Isolated-origin sandbox for MCP App Views, plus admin theme and host-identifier overrides. Without the URL the **Open App** trigger does not appear. |
| `ANNOUNCEMENTS` / `ANNOUNCEMENT_TITLE` / `ANNOUNCEMENT_DESCRIPTION` | `[]` / — / —                   | Structured announcement banner and popover. Malformed config is dropped with a warning; boot never fails on it.                                     |
| `CHAT_VERSION`                                                      | app `package.json` version     | Version stamped by CI/CD, shown in the footer and substituted for the `%%VERSION%%` token.                                                          |
| `LOG_LEVEL`                                                         | —                              | Application log level.                                                                                                                              |
| `THEMES_SERVICE_TIMEOUT_MS`                                         | `5000`                         | Raise it if the themes service is slower than 5 s.                                                                                                  |
| `FILE_UPLOAD_MAX_BYTES`, `ARCHIVE_*`, `SKILL_*`                     | `536870912` upload caps        | File, archive, and skill transfer limits and timeouts (`SKILL_UPLOAD_MAX_TOTAL_BYTES` defaults to `16777216`).                                       |
| `NODE_EXTRA_CA_CERTS`                                               | —                              | Node-native. Required when an OIDC provider's certificate is issued by a private CA — see Behavioral changes.                                        |

### Renamed environment variables

> [!CAUTION]
> The legacy names are not accepted. A deployment that keeps them boots with the corresponding feature unconfigured.

| Legacy                | 1.0                          | Notes                                                                                  |
| --------------------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| `DIAL_API_HOST`       | `DIAL_CORE_URL`              | Internal URL, never exposed to browsers.                                               |
| `NEXTAUTH_SECRET`     | `AUTH_SESSION_SECRET`        | Must be 64 hex characters (32 bytes) — generate a new one rather than reusing the old.  |
| `NEXTAUTH_URL`        | `AUTH_CALLBACK_BASE_URL`     | Public base URL of the **API**. The callback path changed too — see Behavioral changes. |
| `APP_BASE_ORIGIN`     | `CORS_ORIGIN`                | Origin of the browser application; also used by the CSRF origin check.                  |
| `IS_IFRAME`           | `OVERLAY_ENABLED`            | `ALLOWED_IFRAME_ORIGINS` keeps its name and now also gates incoming `postMessage`.      |
| `ENABLED_FEATURES`    | `ENABLED_UI_FEATURES`        | Same replace semantics; several flag values were renamed (`marketplace` → `catalog`).   |
| `THEMES_CONFIG_HOST`  | `THEMES_CONFIG_URL`          | Pair with `THEMES_SERVICE_TIMEOUT_MS` if 5 s is too tight.                              |
| `DEFAULT_MODEL`       | `DEFAULT_DEPLOYMENT`         | Deployment id shown to users with no persisted selection.                               |
| `HIDDEN_ENTITY_TAG`   | `HIDDEN_ENTITY_TAGS`         | Now plural, comma-separated.                                                            |
| `PUBLICATION_FILTERS` | `PUBLICATION_FILTER_SOURCES` | Falls back to `title,role,dial_roles` when unset.                                       |

### Removed environment variables

| Legacy variables                                                                                                                                                          | Reason                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Every `NEXT_PUBLIC_*` variable, `APP_BASE_PATH`                                                                                                                           | The frontend reads no environment variables in 1.0.                                                                    |
| `AUTH_FORCE_STRICT`, `AUTH_ADDITIONAL_PARAMS`, `AUTH_TEST_TOKEN`, `ALLOW_TOKEN_IN_SESSION`, `SHOW_TOKEN_SUB`, `ALLOW_OPEN_SIGNIN_PAGE_IN_IFRAME`                          | Auth moved server-side; the browser never holds a token. Same-window iframe login is now a per-provider overlay option. |
| `ALLOWED_IFRAME_SOURCES`, `ALLOWED_SCRIPT_SOURCES`                                                                                                                        | CSP is managed by `helmet` in `chat-api`.                                                                               |
| `STORAGE_TYPE`                                                                                                                                                            | DIAL Core is the only storage backend.                                                                                  |
| `AVAILABLE_LOCALES`, `THEME_DEFAULT_ID`                                                                                                                                   | Adding a locale is a code change; the default theme is light, then the user's stored choice.                             |
| `RECENT_MODELS_IDS`, `TOPICS`, `MAX_PROMPT_TOKENS_DEFAULT_*`, `ATTACHMENT_TYPES_*`, `CODE_GENERATION_WARNING`, `CODE_EDITOR_PYTHON_VERSIONS`, `WIDGETS_SCHEMA_IDS`         | The corresponding UI has no successor yet. `FEATURED_MODEL_IDS` covers the catalog's featured list, not recent models.   |
| `REPORT_ISSUE_CODE`, `REQUEST_API_KEY_CODE`, `TMS_URL`, `ISSUE_URL`, `AZURE_FUNCTIONS_API_HOST`                                                                           | The report-an-issue and request-API-key dialogs were not migrated.                                                       |
| `QUICK_APPS_HOST`, `QUICK_APPS_MODEL`, `QUICK_APPS_SCHEMA_ID`, `EXTERNAL_APPS_SCHEMA_ID`, `CODE_APPS_ROLES`, `APPLICATION_VISUALIZERS`, `ALLOW_VISUALIZER_SEND_MESSAGES`   | Application authoring is configured differently; `DEV_QUICKAPPS_EDITOR_URL` is the only remaining QuickApps knob.        |

### New feature flags

Feature flags are `CONFIG_DEFINITIONS` entries in `apps/chat-api/src/app-config/config-registry/config-registry.constants.ts`, resolved per request by `FeatureFlagsService` from their own environment variable plus an optional role restriction — there is no single combined flags variable.

| Flag                             | Description                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `features.footer`                | Footer HTML message area. Automatically enabled when `FOOTER_HTML_MESSAGE` is set.                                                          |
| `features.asrEnabled`            | ASR transcription. Derived from `ASR_MODEL` presence; restrict with `ASR_ENABLED_ROLES`.                                                    |
| `features.llmConversationNaming` | LLM conversation naming after the first assistant reply. Needs `UTILITY_MODEL`, `DIAL_API_KEY`, and `LLM_CONVERSATION_NAMING_ENABLED=true`. |
| `features.responsesApiEnabled`   | Routes eligible generations through the Responses API (`RESPONSES_API_ENABLED`). Server-visibility only, never sent to the client.          |
| `features.liveChatInteraction`   | Client-channel subscription and the mid-completion toolset sign-in dialog (`LIVE_CHAT_INTERACTION_ENABLED` / `_ROLES`).                     |
| `features.scheduledTasksEnabled` | Scheduled Tasks page, sidebar entry, and Scheduler proxy endpoints (`SCHEDULED_TASKS_ENABLED` / `_ROLES`).                                  |
| `features.settingsPageEnabled`   | Settings page, `/settings` route, and Usage tab fetch (`SETTINGS_PAGE_ENABLED` / `_ROLES`).                                                 |

### DIAL Configuration changes

- **Toolset OAuth needs Chat's callback in DIAL Core's allowlist.** Add `<CHAT_PUBLIC_ORIGIN>/auth/toolset-signin` to `toolsets.security.allowedRedirectUris`, preserving the entries for other clients such as the Admin panel, then **restart DIAL Core** — the setting is read at Core startup. Use the public origin users open Chat from, not `AUTH_CALLBACK_BASE_URL`.

### Behavioral changes

> [!NOTE]
> Everything below takes effect on upgrade. The first three items break a deployment that is ported by copying environment variables alone.

- **The OIDC redirect URI moved and gained a version segment** — re-register `{AUTH_CALLBACK_BASE_URL}/api/v1/auth/callback/{providerId}` with every identity provider. The `/api/v1` prefix is a literal in `apps/chat-api/src/auth/auth.controller.ts` and does not follow `API_PREFIX`, so it cannot be configured back to the legacy `/api/auth/callback/...`. A client left on the legacy URI is rejected by the IdP before the callback is reached.
- **`AUTH_POST_LOGOUT_REDIRECT_URI` is now required** once any provider is configured, and must be in the provider's post-logout allowlist. Unlike the callback it points at the **application** origin, not the API.
- **`chat-api` discovers every configured OIDC provider during startup**, so a provider certificate issued by a private CA fails startup unless that CA is already trusted — mount the PEM bundle and set `NODE_EXTRA_CA_CERTS` before the process starts. Do not use `NODE_TLS_REJECT_UNAUTHORIZED=0`.
- **Existing sessions do not carry over** — every user logs in once after the switch.
- **The default API port is `5000`** (was `3000`), alongside `API_PREFIX=api` and `CORS_ORIGIN=http://localhost:4207` as defaults (#8045)
- **The default theme is light**, then the user's stored choice. A legacy theme file loads without error and applies almost nothing — the CSS variable names were redesigned, and `additional_css` injection has no replacement; restyle through theme tokens and each lib's `styles={{ colors, typography }}` contract.
- **Conversation folders are not rendered** — conversations are listed recursively from the bucket root, so items the legacy chat created inside folders still appear, as a flat list. Nothing is rewritten and the resources keep their paths.
- **Playback, replay, compare mode, report-an-issue, request-API-key, and overlay message custom buttons have no UI in 1.0.** Most are planned; the last three have no successor planned.
- **Unrecognized `ENABLED_UI_FEATURES` values are logged and dropped**, so a ported legacy flag silently does nothing. The renamed / became-unconditional / no-successor tables are in the [Chat Overlay Migration Guide](https://github.com/epam/ai-dial-chat/blob/1.0.0/docs/chat-overlay-migration-guide.md#6-migrate-ui-feature-flags).
- **OpenTelemetry is off by default** (`OTEL_SDK_DISABLED=true`). When enabled, traced routes gain a `traceparent` response header and an optional Prometheus scrape listener runs on `:9464/metrics`, independent of the application port (#8186)

Deltas below are relative to **1.0.18**, the last published stable release. The `1.0.x` maintenance line already received most of this release's configuration work, so an operator upgrading from `1.0.18` has only the changes listed here.

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

#### ai-dial-chat-themes `0.20.0`

##### Breaking changes

**Light theme control tokens aligned with DIAL UI Kit 0.14.0**

Control tokens in the light theme have been changed to align with DIAL UI Kit 0.14.0. If any downstream component or custom theme overrides these tokens, visual breakage or incompatibility may occur. The exact tokens changed are not listed in the release notes.

| Previous configuration | Required action |
|---|---|
| Light theme control tokens based on pre-0.14.0 DIAL UI Kit values | Review and update any custom theme overrides or dependent components that reference light theme control tokens to ensure compatibility with DIAL UI Kit 0.14.0 |

---

#### ai-dial-adapter-vertexai `0.40.0-rc.0`

##### New environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE` | — | No | Support for EKS Pod Identity token file path; required when using EKS Pod Identity for AWS authentication. |

---
