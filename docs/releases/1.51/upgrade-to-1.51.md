# Instructions

## Table of contents

- [Versions](#versions)
- [Before upgrade](#before-upgrade)
  - [General notes](#general-notes)
  - [Release-specific notes](#release-specific-notes)
    - [ai-dial-core](#ai-dial-core-0510-rc0)
    - [ai-dial-admin-backend](#ai-dial-admin-backend-0240-rc0)
    - [ai-dial-admin-frontend](#ai-dial-admin-frontend-0240-rc0)
    - [ai-dial-admin-deployment-manager-backend](#ai-dial-admin-deployment-manager-backend-0240-rc0)
    - [ai-dial-admin-evaluation-framework-backend](#ai-dial-admin-evaluation-framework-backend-070-rc0)
    - [ai-dial-chat](#ai-dial-chat-140-rc2)
    - [ai-dial-chat-themes](#ai-dial-chat-themes-0230)
    - [ai-dial-quickapps-backend](#ai-dial-quickapps-backend-0150-rc0)
    - [ai-dial-quickapps-frontend](#ai-dial-quickapps-frontend-050-rc0)
    - [ai-dial-analytics](#ai-dial-analytics-0240-rc0)
    - [ai-dial-analytics-enrichment-runner](#ai-dial-analytics-enrichment-runner-0240-rc0)
    - [ai-dial-analytics-mcp](#ai-dial-analytics-mcp-0240-rc0)
    - [ai-dial-scheduler](#ai-dial-scheduler-040-rc0)
    - [ai-dial-openapi-to-mcp](#ai-dial-openapi-to-mcp-022)
    - [ai-dial-adapter-openai](#ai-dial-adapter-openai-0470-rc0)
    - [ai-dial-adapter-vertexai](#ai-dial-adapter-vertexai-0430-rc0)
    - [ai-dial-model-provider](#ai-dial-model-provider-020-rc0)

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.47.0-rc.0`
   - ai-dial-adapter-openai: `0.47.0-rc.0`
   - ai-dial-adapter-vertexai: `0.43.0-rc.0`
   - ai-dial-adapter-dial: `0.22.0-rc.0`
   - ai-dial-chat-themes: `0.23.0`
   - ai-dial-chat: `1.4.0-rc.2`
   - ai-dial-core: `0.51.0-rc.0`
   - ai-dial-analytics-realtime: `0.31.0-rc.0`
   - ai-dial-analytics: `0.24.0-rc.0`
   - ai-dial-analytics-enrichment-runner: `0.24.0-rc.0`
   - ai-dial-analytics-mcp: `0.24.0-rc.0`
   - ai-dial-model-provider: `0.2.0-rc.0`
   - ai-dial-rag: `0.44.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.5.1`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.15.0-rc.0`
   - ai-dial-quickapps-frontend: `0.5.0-rc.0`
   - ai-dial-admin-backend: `0.24.0-rc.0`
   - ai-dial-admin-frontend: `0.24.0-rc.0`
   - ai-dial-admin-deployment-manager-backend: `0.24.0-rc.0`
   - ai-dial-admin-evaluation-framework-backend: `0.7.0-rc.0`
   - ai-dial-admin-evaluation-metrics: `0.5.0-rc.0`
   - ai-dial-openapi-to-mcp: `0.2.2`
   - ai-dial-scheduler: `0.4.0-rc.0`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.
- **Upgrade together:** ai-dial-analytics `0.24`, ai-dial-analytics-enrichment-runner `0.24` and ai-dial-admin-frontend `0.24` (the ADAS ↔ Enrichment Runner contract version rises from `4` to `7`). ai-dial-quickapps-frontend `0.5` is built against the ai-dial-chat `1.4` libraries.

> Environment variable tables below use the same columns: **Required** is `Yes` (the service does not start without the variable) or `No`, and **Default** is the value applied when the variable is not set — `unset` means the variable has no default value.

### Release-specific notes

#### ai-dial-core `0.51.0-rc.0`

##### Breaking changes

| Previous configuration | Required action |
|---|---|
| Clients or monitoring that treat every spending refusal as `429` (`spendingLimits.mode: enforce`) | A call that no budget covers now gets **`403`** with `error.code` `no_budget` (Claude Code / Codex routes: `402` for Messages, `400` for Responses). A used-up budget is still `429` with `retry-after` and `error.code` `budget_exhausted`. Update clients and alerts (#2374, #2360, #2349) |
| Org units relying on the built-in roles to show child units | The built-in `member` role is removed, and `admin` / `editor` / `viewer` no longer grant `read org-units/**`. Define a config role in `orgUnitRoles` that grants it, and add that grant to `admin` as well (#2306, #2289) |
| Org-unit role assignments on a `roles` subject that matches API keys | API keys now act through their org-unit roles like people do, including write and approve. A role assigned to the "every caller" subject gives **every API key** that role's full rights. Review assignments before upgrading (#2319) |
| Custom Redisson settings under `redis.singleServerConfig` / `redis.clusterServersConfig` / `redis` | Redisson is upgraded from 3.52.0 to 4.8.0, and Core fails to start on a setting Redisson does not know. Check setting names against the Redisson docs (#2293) |
| Custom plugin jars or JVM options | The runtime image moves from `eclipse-temurin:21-jdk-alpine` to `eclipse-temurin:25-jdk-alpine` (Java 25). Plugin jars must be rebuilt for each Core version (#2278, #2216) |

##### New static settings

Static settings can also be set through an environment variable named `aidial.` + the setting key.

| Variable | Required | Default | Description |
|---|---|---|---|
| `plugins.dir` | No | `plugins` (`/app/plugins` in the image) | [Preview] Directory plugin code is loaded from at start, laid out as `<group>/<plugin>/`. Mount custom plugins under `custom/`, never over `builtin/` (#2216, #2300) |
| `plugins.include` | No | `["*"]` | [Preview] Patterns (`*` or `<group>/<plugin>`) of plugin directories to load. An empty list stops the start (#2300) |
| `plugins.exclude` | No | `[]` | [Preview] Patterns of plugin directories not to load, e.g. `builtin/echo,custom/old` (#2300) |
| `adminSystemImport.stallTimeout` | No | `60000` | [Preview] Time in ms the import waits for the next upload chunk before failing with `408` (#2213) |
| `adminSystemImport.progressInterval` | No | `15000` | Time in ms between progress lines while a replace import runs (#2213) |
| `adminSystemImport.parallelism` | No | `4` | Number of parallel blob storage calls during an import. Above `5`, also raise `-Dhttp.maxConnections` (#2213) |
| `applications.allowUserAuthoredDependencies` | No | `false` | Whether user-authored applications may declare `resource_dependencies`. Dependencies apply only after admin consent (#1940) |
| `identityProviders.*.costObjectPath` | No | unset | Replaces `projectPath`. Claim that holds the JWT user's cost object, used for budgets and analytics (#2373) |

##### Deprecated static settings

| Variable | Replacement | Description |
|---|---|---|
| `identityProviders.*.projectPath` | `identityProviders.*.costObjectPath` | Still read when `costObjectPath` is unset; Core logs a warning at start (#2373) |

##### New dynamic settings

- `routers` — a new deployment type that picks the model serving a request. Aliases may now target a router and carry default headers. See `docs/dynamic-settings/routers.md` (#2286, #2303)
- `plugins` [Preview] — in-process plugin instances (`type`, `settings`). Model, interface and translator `baseUrl` accept `dial-plugin://<name>`. See `docs/dynamic-settings/plugins.md` (#2216, #2358)

##### Behavioral changes

- **Analytics rows** gain a `cost_object` object (`id`, `source`), and the OTel JSON log layout adds `user.cost_object` and `user.cost_object.source`. Update strict downstream schemas (#2373)
- **Admin system import** [Preview] — `POST /v1/admin/system-import` defaults to `mode=merge`. A restore or clone must send `mode=replace` (#2213)
- **OpenAPI spec** is served anonymously at `GET /openapi.yaml`. Allow that path on the ingress if you expose it (#2332)
- **External services** support dynamic client registration and PKCE. DCR registers only `toolsets.security.allowedRedirectUris`, so that list must be set (#2311)

---

#### ai-dial-admin-backend `0.24.0-rc.0`

> [!IMPORTANT]
> **ai-dial-admin-backend is being decommissioned.** 0.24.0 is planned as its last release; after it there will be no more features, fixes or security updates. DIAL Core holds its own configuration, and Admin Frontend connects to Core directly. Plan the migration with the [decommissioning runbook](https://github.com/epam/ai-dial-admin-backend/blob/0.24.0-rc.0/docs/admin-backend-decommission.md) (#1223).

##### Prerequisites for decommissioning

| Component | Requirement |
|---|---|
| DIAL Core | `>= 0.50.0` to migrate config into blob storage (`POST /v1/admin/config/file/migrate`); `>= 0.51.0` if config files define `routers` or `plugins` |
| ai-dial-admin-frontend | `>= 0.22`. Core-only mode is on when `DIAL_ADMIN_API_URL` is **removed**; an empty value does not work |
| DIAL Core settings | `access.admin.rules` must match your admins, otherwise every caller is denied on the admin API |

> [!CAUTION]
> Core has no replacement for entity history, rollback, activity audit, config import/export, telemetry dashboards, the usage log, Adapters, Interceptor Runners, Interceptor Templates, container endpoint refresh from Deployment Manager, and topics on keys, roles, routes and interceptors. Dump the admin-backend database before you start — it is the only copy of this data.

---

#### ai-dial-admin-frontend `0.24.0-rc.0`

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GRAFANA_TRACES_URL` | No | unset | Grafana root URL. When set, asset application pages show a `Traces in Grafana` dropdown. Separate from `GRAFANA_LINK` (#5544) |
| `GRAFANA_TEMPO_DATASOURCE_UID` | No | `tempo` | UID of the Grafana Tempo datasource; used only with `GRAFANA_TRACES_URL` (#5544) |
| `GRAFANA_ORG_ID` | No | `1` | Grafana organization ID (#5544) |
| `AUTH_KEYCLOAK1_CLIENT_ID`, `AUTH_KEYCLOAK1_SECRET`, `AUTH_KEYCLOAK1_HOST`, `AUTH_KEYCLOAK1_NAME`, `AUTH_KEYCLOAK1_SCOPE`, `AUTH_KEYCLOAK1_ADMIN_ROLE_NAMES`, `AUTH_KEYCLOAK1_DIAL_ROLES_FIELD` | No | `AUTH_KEYCLOAK1_SCOPE`: `openid email profile offline_access` | Second Keycloak identity provider (id `keycloak1`), matching DIAL Core (#5665) |

##### Removed environment variables

| Variable | Reason |
|---|---|
| `ORG_UNITS_GROUP_CLAIM` | No longer read. Org-unit role holders are added as a `Custom claim` in the UI; existing assignments keep working (#5541) |

##### New `DISABLE_MENU_ITEMS` values

| Value | Description |
|---|---|
| `platformrouters` | Auto Routers (#5472) |
| `platformplugins` | Plugins (#5563) |
| `platformaliases` | Aliases (#5547) |
| `systemhealth` | Evaluation → System Health [Preview] (#5697) |

##### Prerequisites

> [!IMPORTANT]
> **Automatic OAuth client registration** (`Register automatically` on an application's external service) needs DIAL Core `0.51.0` (epam/ai-dial-core#2311). In Core, `toolsets.security.allowedRedirectUris` must list `<admin origin>/external-service-signin` (plus Chat's callback if users sign in from Chat). With an empty list every save fails with `400`; without the admin callback sign-in from the panel fails (#5616).

- **Routers with `Editor URL`** need DIAL Core with epam/ai-dial-core#2303; an older Core answers `400` (#5588)
- **[Preview] `Run with model` in LLM enrichment preview** needs ai-dial-analytics-enrichment-runner `0.24` and ai-dial-analytics `0.24` (contract `7`). A run can take several minutes, so every ingress or proxy in front of the admin panel and `DIAL_ANALYTICS_RUNNER_API_URL` must allow long requests. Each run counts towards the pipeline's daily spend budget (#5695)
- **Sessions source** is now set in System Properties → `Sessions source` and stored by ADAS under `/v1/settings/sessions-source` (needs ai-dial-analytics `0.24`). Reading needs `SETTINGS_READ`, saving `SETTINGS_WRITE`; a `roles-mapping` that lists raw privileges must add them (#5509)
- **Session ratings** are read from enrichments with `rate_pos_count`, `rate_zero_count` and `rate_neg_count` instead of the `response_ratings` table; without such enrichments ratings are hidden (#5509)

---

#### ai-dial-admin-deployment-manager-backend `0.24.0-rc.0`

- The runtime base image changes from `amazoncorretto:21-alpine` to `eclipse-temurin:21.0.13.1_2-jre-alpine` (JRE only). User (`appuser`, UID 1001), entrypoint and exposed ports (`8080`, `9464`) are unchanged; JDK diagnostic tools are no longer in the image (#439).

No new environment variables, configuration changes or database migrations.

---

#### ai-dial-admin-evaluation-framework-backend `0.7.0-rc.0`

> [!IMPORTANT]
> The default ceiling for run concurrency drops from `50` to `5`. A run that asks for an `execution.concurrencyLevel` above `5` is now rejected with HTTP 400. To keep a higher limit, set `TEST_SUITE_RUN_EXECUTION_MAX_CONCURRENCY_LEVEL`.

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANALYTICS_RUN_PASS_COUNTS_RECONCILIATION_ENABLED` | No | `true` | Scheduled job that records missing pass counts for `COMPLETED` runs (#316) |
| `ANALYTICS_RUN_PASS_COUNTS_RECONCILIATION_INITIAL_DELAY_MS` | No | `60000` | Delay between startup and the first pass (#316) |
| `ANALYTICS_RUN_PASS_COUNTS_RECONCILIATION_INTERVAL_MS` | No | `3600000` | Delay between passes (#316) |
| `ANALYTICS_RUN_PASS_COUNTS_RECONCILIATION_BATCH_SIZE` | No | `500` | Completed runs handled per batch (#316) |
| `ANALYTICS_RUN_PASS_COUNTS_RECONCILIATION_MIN_COMPUTATION_AGE_MS` | No | `600000` | Minimum age of a run's latest computation before it is recorded (#316) |
| `METRIC_PROVIDERS_DEFAULTS_CONNECT_TIMEOUT_MS` | No | `5000` | Connect timeout for metric provider entries that do not set their own (#301) |
| `METRIC_PROVIDERS_DEFAULTS_READ_TIMEOUT_MS` | No | `30000` | Read timeout for metric provider entries that do not set their own (#301) |
| `METRIC_PROVIDERS_DIAL_CONNECT_TIMEOUT_MS` / `METRIC_PROVIDERS_EXTRA_CONNECT_TIMEOUT_MS` | No | `5000` | Connect timeout of the built-in `dial` and `extra` providers (previously hardcoded) (#301) |
| `METRIC_PROVIDERS_DIAL_READ_TIMEOUT_MS` / `METRIC_PROVIDERS_EXTRA_READ_TIMEOUT_MS` | No | `150000` | Read timeout of the built-in `dial` and `extra` providers (previously hardcoded) (#301) |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `TEST_SUITE_RUN_EXECUTION_MAX_CONCURRENCY_LEVEL` | `50` | `5` | Highest concurrency a run may request; clients can read it from `GET /api/v1/test-suite-runs/config` (#306) |

##### Removed environment variables

| Variable | Reason |
|---|---|
| `BLOB_STORAGE_MAX_FILE_SIZE_BYTES`, `BLOB_STORAGE_MAX_FILES_PER_SUITE` | The unused `blob-storage` block is removed from `application.yml` (#301) |
| `METRIC_PROVIDERS_SYNC_FIXED_DELAY_MS` | Never used; recurring metric sync still needs `METRIC_PROVIDERS_SYNC_CRON` (#301) |

##### Breaking changes

| Previous configuration | Required action |
|---|---|
| Runs, clients or automation that use `concurrencyLevel` between 6 and 50 | Set `TEST_SUITE_RUN_EXECUTION_MAX_CONCURRENCY_LEVEL` to the limit you need, otherwise these runs fail with HTTP 400 (#306) |
| A custom `application.yml` that replaces the packaged one | Add `metric-providers.defaults.connect-timeout-ms` and `metric-providers.defaults.read-timeout-ms`; both are required, otherwise startup fails (#301) |

##### Database migrations

> [!NOTE]
> Flyway applies this automatically on startup. It only adds a table.

- **analytics** — `V1.23__CreateRunPassCountsTable.sql` — creates `run_pass_counts`; the reconciliation job fills it for existing runs (#316)

##### Behavioral changes

- **Pass-count reconciliation** — runs completed before the upgrade are missing from run trends, suite health and the pass-rate card until the first reconciliation pass (60 s after startup by default, then hourly) (#316)
- **Pass-rate numbers** — a failed or metric-errored test case with no score row no longer counts as passed, so pass rates go down for suites with the default scoring setup (#316)

##### API / contract changes

> [!NOTE]
> All changes are additive except where marked **Breaking**. Full REST reference is available in Swagger UI (`/swagger-ui.html`).

- **New endpoints** — `GET /api/v1/test-suite-runs/config` #305 (#306), `POST /api/v1/analytics/test-suites/pass-rate` (#304, #316), `GET /api/v1/analytics/test-suites/run-trends` (#316), `GET /api/v1/analytics/test-suites/health-distribution` #315 (#321), `POST /api/v1/costs/total` (#324)
- **Breaking** — try-it-out for streaming deployments: `response.body` now holds the assembled JSON response and parsed events are only in `response.events`; clients reading `response.body.events` must switch to `response.events` #318 (#319)
- **Changed** — assembled streaming responses keep `choices[0].message.custom_fields`; extracted response columns can change for streaming deployments #318 (#319, #329)
- **Breaking** — eval-summary CSV export and `GET /api/v1/analytics/eval-summaries/export/preview` return `createdAt` / `computedAt` as ISO 8601 UTC strings instead of epoch ms. Results import accepts both #23 (#322, #326)

---

#### ai-dial-chat `1.4.0-rc.2`

##### Breaking changes

| Previous configuration | Required action |
|---|---|
| Publishing with access rules (`rules` in publish requests, the publish-rules endpoint, `PUBLICATION_FILTER_SOURCES`) | Rules can no longer be set from Chat; requests that still send `rules` get `400`. Remove `PUBLICATION_FILTER_SOURCES` and update integrations that send rules (#9975) |
| `API_PREFIX` / `PORT` were not validated | Startup now fails if `API_PREFIX` has a leading or trailing `/` or other invalid characters, or if `PORT` is not an integer from 0 to 65535. Use e.g. `api`, not `/api` (#9944) |
| Config Studio schema uploaded under `appId` `chat-ui` | Config Studio instances must use `appId` `ai-dial-chat`. Upload the schema index from `apps/chat-api/managed-config-schema/` (#9908, #9953, #9968) |
| Overlay hosts that pass the deprecated `signInOptions` | Switch to `auth.autoSignInProvider` with a `providerUiModes` entry; deprecated `ChatVisualizerConnector` APIs are removed. See `docs/chat-overlay-migration-guide.md` (#10042) |

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MANAGED_CONFIG_MODE` | No | `off` | Reads published Config Studio snapshots: `off`, `shadow` or `active`. `off` is the rollback (#9883) |
| `MANAGED_CONFIG_INSTANCES` | Yes, unless mode is `off` | unset | `appId=instanceId` pairs, e.g. `ai-dial-chat=chat-dev`. Each `appId` must be in `CLIENT_CONFIG_APP_IDS` (#9883) |
| `MANAGED_CONFIG_API_KEY` | Yes, unless mode is `off` | unset | Core API key that reads the published snapshot. Store it as a secret (#9883) |
| `MANAGED_CONFIG_MAX_STALENESS_SECONDS` | Yes, unless mode is `off` | unset | How long a snapshot stays usable after its last successful check (3 × refresh interval to `86400`) (#9883) |
| `MANAGED_CONFIG_REFRESH_INTERVAL_SECONDS` | No | `60` | Server snapshot refresh interval, `15`–`3600` (#9883) |
| `MANAGED_CONFIG_CLIENT_REFRESH_SECONDS` | No | `120` | Browser client-config refresh interval, `30`–`900` (#9883) |
| `MANAGED_CONFIG_ACTIVE_KEYS` | No | unset | Registry keys whose managed value applies in `active` mode (#9883) |
| `MANAGED_CONFIG_ENVIRONMENT` | No | unset | When set, a snapshot's recorded environment must match it (#9883) |
| `MODEL_CATALOG_API_KEY` | No | unset | Server-only key for `GET /api/v1/model-catalog`. Unset disables the catalog routes (#9842) |
| `THEMES_PUBLIC_URL` | No | unset | Public URL of the themes host, exposed as `config.themesBaseUrl` (#9877) |
| `ORG_UNITS_ENABLED` | No | `false` | Reads DIAL Core org units and lets users save into unit folders (#9766, #9887) |
| `SPENDING_LIMITS_MODE` | No | `off` | Must equal DIAL Core's `spendingLimits.mode`: `off`, `shadow` or `enforce`. Any other value fails startup (#9894) |
| `ANALYTICS_URL` | No | unset | DIAL Analytics (ADAS) base URL for `GET /api/v1/user/usage/history`. Unset turns the route off (#9928) |
| `ANALYTICS_TIMEOUT_MS` | No | `10000` | Timeout of each ADAS call (#9928) |
| `CONTENT_SOURCES_CONFIG` | No | unset | Server-only JSON registry of GitHub/GitLab Markdown sources. An invalid value fails startup (#9989) |
| `CONTENT_SOURCES_CREDENTIALS` | No | unset | Secret JSON map `{"<credentialId>":"<token>"}` referenced by sources (#9989) |
| `CONTENT_SOURCES_CACHE_TTL_MS` | No | `1800000` | Cache TTL of fetched content (#9989) |
| `CONTENT_SOURCES_TIMEOUT_MS` | No | `10000` | Timeout of each upstream GitHub/GitLab request (#9989) |
| `CONTENT_SOURCES_UPSTREAM_CONCURRENCY` | No | `8` | Concurrent upstream calls per `baseUrl` + `credentialId` (#10004) |
| `CONTENT_SOURCES_UPSTREAM_QUEUE_SIZE` | No | `64` | Upstream calls that may wait for a slot; a full queue answers `429` (#10004) |
| `CONTENT_SOURCES_PRINCIPAL_MISS_CONCURRENCY` | No | `8` | Concurrent requests per user that start upstream work (#10004) |
| `PROJECT_CONTEXT_MAX_FILES` | No | `100` | Maximum context files per project (previously fixed) (#10008) |
| `PROJECT_ARCHIVE_READ_MAX_BYTES` | No | `67108864` | Maximum ZIP bytes buffered per project snapshot read. `PROJECT_CONTEXT_TOTAL_MAX_BYTES` must stay at or below this value minus 1 MiB (#10008) |
| `CSP_ALLOW_STYLE_ATTRIBUTES` | No | `false` | Allows inline `style` attributes in the enforced CSP; needed by embedded apps that bundle Monaco (e.g. the Quick Apps JSON editor) (#9820) |
| `ONBOARDING_HINTS` | No | unset | [Prototype] JSON array for the first-visit onboarding tour (#9815) |
| `TEXT_REFINEMENT_APPLICATION_NAME_PROMPT` | No | unset | Prompt override for refining application names (#9997) |
| `OTEL_*` (`mcp-app-sandbox` image) | No | `OTEL_SDK_DISABLED=true` | Opt-in OpenTelemetry for the MCP Apps sandbox (#9826) |

##### Environment variables with changed defaults

| Variable | Old default | New default | Description |
|---|---|---|---|
| `CLIENT_CONFIG_APP_IDS` | `chat-ui` | `ai-dial-chat` | `chat-ui` is still accepted as a deprecated alias (#9908) |

##### Removed environment variables

| Variable | Reason |
|---|---|
| `PUBLICATION_FILTER_SOURCES` | Removed together with publication access rules (#9975) |

##### New `ENABLED_UI_FEATURES` values

| Value | Description |
|---|---|
| `show-mobile-header-full-logo` | Shows the theme's full `logo` in the mobile header instead of its `favicon` (#9921) |
| `always-show-citation-card` | A click on a citation marker always opens the citation card (#9936) |

##### Prerequisites

- **Managed configuration** — needs Config Studio deployed and its runner registered in DIAL Admin. Set up the instance and reader key, then publish a revision, before changing `MANAGED_CONFIG_MODE` from `off`. See [`docs/managed-config-onboarding.md`](https://github.com/epam/ai-dial-chat/blob/1.4.0-rc.2/docs/managed-config-onboarding.md) (#9883, #9932)
- **Usage history (`ANALYTICS_URL`)** — needs ai-dial-analytics `0.24` with `SECURITY_MODE=oidc` for the same identity providers, `logging-key` / `logging-salt` equal to DIAL Core's `loggingKey` / `loggingSalt`, and a `read` grant on `dial_usage_log` for `*` with row filter `user_hash = caller.user_hash` (#9928, #9939, #10025)
- **`SPENDING_LIMITS_MODE`** — `shadow` / `enforce` take effect only with a DIAL Core whose usage response includes `costObject` (epam/ai-dial-core#2284) (#9894)

---

#### ai-dial-chat-themes `0.23.0`

- The base image moves from `nginxinc/nginx-unprivileged:1.31.7-alpine-otel` to `nginx/nginx-unprivileged:1.31.9-alpine-otel`. Update mirrored or allow-listed base image references.
- nginx serves celebration packs under `/celebrations/`, read by DIAL Chat from `<THEMES_CONFIG_URL>/celebrations/` when Chat sets `UI_EVENT_DELIVERY_MODE=prefer-external`. Custom theme images that should supply packs must serve this path (#176).

> [!NOTE]
> Custom `config.json` files should add the new color tokens `text-control-inverted-hover`, `text-control-inverted-active`, `text-control-inverted-disabled`, `stroke-inverted-focus` (#177) and the image keys `user-profile-logo-light` / `user-profile-logo-dark` (#178). Missing keys fall back to built-in values.

---

#### ai-dial-quickapps-backend `0.15.0-rc.0`

##### Breaking changes

| Previous configuration | Required action |
|---|---|
| `orchestrator.tool_discovery.enabled: true` without `service_model` (the orchestrator deployment was used as the fallback) | Add `tool_discovery.service_model` pointing at a deployment that supports structured output (`response_format` with a JSON schema); otherwise the manifest fails validation (#713) |
| Apps with `tool_discovery.enabled: true` | `internal_tool_search` now returns at most `top_k` (10) tools and drops picks scored below `0.5`. Tune it with `tool_discovery.strategy` (#713) |
| `deployment-tool` with `system_prompt` set (accepted but never sent) | The prompt is now sent as a `system` message. If the target is another Quick App, it answers HTTP 400 unless its operator sets `ALLOW_OVERRIDE_SYSTEM_MESSAGE=true` (#731) |
| `system_prompt.type: "dial"` on the orchestrator (accepted but never loaded) | The prompt is now loaded from DIAL (`prompts/<bucket>/<path>`) on every request; a missing or empty prompt fails the request (#731) |

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `BACKGROUND_HOOKS_MAX_CONCURRENT` | No | `50` | Maximum `execution: background` hooks running at once per process (#769) |
| `BACKGROUND_HOOKS_WARN_THRESHOLD` | No | `40` | Number of running background hooks above which a warning is logged. Must be lower than `BACKGROUND_HOOKS_MAX_CONCURRENT`, otherwise the service does not start (#769) |
| `BACKGROUND_HOOKS_RESPONSE_HOLD_SECONDS` | No | `3.0` | Longest time the response stays open after a turn for background hooks (#769) |
| `BACKGROUND_HOOKS_SHUTDOWN_GRACE_SECONDS` | No | `30.0` | How long shutdown waits for running background hooks. Keep it below the pod's `terminationGracePeriodSeconds` (#769) |
| `DEFAULT_INITIALIZATION_ISSUES_LEVEL` | No | `warning` | Lowest level shown in the *Initialization issues* stage: `warning`, `error` or `critical` (#747) |
| `PROJECT_INSTRUCTIONS_MAX_CHARS` | No | `32000` | [Preview] Maximum characters of `PROJECT.md` added to the system prompt in a project chat (#726) |

##### Behavioral changes

- **Tool-call result offload is GA and on by default** — a tool response of `TOOL_CALL_RESULT_OFFLOAD__SIZE_THRESHOLD` (40 000) bytes or more is saved to a DIAL file in the app's appdata. Opt out with `TOOL_CALL_RESULT_OFFLOAD__ENABLED_BY_DEFAULT=false` or per app with `features.tool_call_result_offload.enabled: false` (#772)
- **Deployment parameters follow DIAL Core `features`** — `temperature` and `reasoning_effort` are removed from requests when the target deployment's Core `features` mark them as unsupported (#762)

##### Schema changes

| Change | Location | Notes |
|---|---|---|
| Added `tool_call_result_offload` | `features` | Replaces `features.dial_files.tool_call_result_offload`; the old location is **deprecated** but still honored (#772) |
| Added `initialization_issues.level` | `features` | `warning` \| `error` \| `critical`; defaults to `DEFAULT_INITIALIZATION_ISSUES_LEVEL` (#747) |
| Added `strategy` | `orchestrator.tool_discovery` | `plain` (default), `window` or `hierarchy`, each with `top_k` and `score_threshold`. `service_model` is required when `enabled` is `true` (#713) |
| Added `execution` | hooks (`ToolCallHookConfig`) | `blocking` (default) \| `background`; `background` only for `on_completion` (#769) |
| Added `propagate_form_schema_to_choice`, `propagate_form_value_to_content` | `deployment-tool`, `dial-deployment-simple`, `dial-app` toolset | (#756) |
| `path` marked `dial:resource` | `DialSystemPromptConfig` | Format `prompts/<bucket>/<path>` (#731) |
| `default` moved | tool parameter schemas | From the configurable-parameter base to the JSON Schema parameter types (`simple`, `object`, `array`); const parameters no longer declare it (#767) |

##### Projects [Preview]

Projects work only with `ENABLE_PREVIEW_FEATURES=true`. The app needs resource dependencies on `projects/{current-user}/` (`READ` and `WRITE`) approved in the Admin UI under Resource Dependencies; without them project chats fail with 403 `project_access_denied`. See [CONFIGURATION.md — Projects](https://github.com/epam/ai-dial-quickapps-backend/blob/0.15.0-rc.0/CONFIGURATION.md#projects) (#723, #726, #727, #738).

---

#### ai-dial-quickapps-frontend `0.5.0-rc.0`

- The editor is built against the `@epam/ai-dial-*` `1.4.0-rc.1` libraries; deploy it with `ai-dial-chat` / `ai-dial-chat-bff` from the `1.4` line (#359).
- If the Quick Apps JSON editor is embedded in DIAL Chat with an enforced CSP, set `CSP_ALLOW_STYLE_ATTRIBUTES=true` on ai-dial-chat.

No environment variable or image changes.

---

#### ai-dial-analytics `0.24.0-rc.0`

This release includes **critical changes**. Please review the [upgrade guide](https://github.com/epam/ai-dial-analytics/blob/0.24.0-rc.0/docs/release-0.24-upgrade.md) before proceeding.

> [!IMPORTANT]
> The 0.24 guide starts from **0.23.3**. DIAL 1.50 shipped 0.23.0, so first apply §8 (0.23.1) and §9 (0.23.3) of the [0.23 upgrade notes](https://github.com/epam/ai-dial-analytics/blob/0.24.0-rc.0/docs/release-0.23-upgrade.md): `SYNC_SENSITIVE_COLUMNS_ENABLED` is replaced by `SYNC_SENSITIVE_COLUMNS` (startup fails while the old variable is set), and table access becomes role-keyed (#70, #83, #85, #94).

Upgrade together with Enrichment Runner 0.24 and ai-dial-admin-frontend 0.24: the ADAS ↔ Enrichment Runner contract version rises from `4` to `7`, and neither build works with the other's previous release (#68, #75, #97).

##### Breaking changes

| Previous configuration | Required action |
|---|---|
| ClickHouse database with the `Atomic` engine, or no ClickHouse Keeper | ADAS now needs Keeper and a `Replicated` database, even on a single server. Convert the database by hand (guide Appendix A) (#49) |
| ADAS deployed with a rolling update | The first start converts every ADAS table to its replicated form; API and ingest are down while it runs. Set `strategy.type: Recreate` or scale to 0 first (#49) |
| `CLICKHOUSE_HOST` points at a Service over all ClickHouse pods | Point it at the primary ClickHouse pod only; ADAS refuses to start once a second replica answers (#49) |
| ClickHouse writer user with an explicit grants list | Add `SYSTEM SYNC REPLICA` and `SYSTEM SYNC DATABASE REPLICA` (startup fails without them), plus `SELECT ON system.clusters` and `SYSTEM MERGES` on `<db>.*` (#49, #71) |
| Startup or liveness probe on `/actuator/health` | Use `/actuator/health/liveness` for startup and liveness, and `/actuator/health/readiness` for readiness (#49) |
| Importing a 0.24 catalog export into a 0.23 environment | The export format is now version 4; upgrade the target environment first (#82, #98) |

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `CLICKHOUSE_ROUTING_QUERIES` | No | `replicas` | Where user queries run: `replicas` or `primary` (#49) |
| `CLICKHOUSE_ROUTING_PIPELINES` | No | `replicas` | Where pipeline runs run: `replicas` or `primary` (#49) |
| `CLICKHOUSE_REPLICAS_DISCOVERY_INTERVAL` | No | `30s` | How often the replica set is re-read from `system.clusters` (#49) |
| `CLICKHOUSE_REPLICAS_SYNC_TIMEOUT` | No | `30s` | Bound of one replica sync (#49) |
| `CLICKHOUSE_DDL_TASK_TIMEOUT` | No | `30s` | How long a DDL waits for the other replicas (#49) |

> [!NOTE]
> No new Flyway migrations. The first start converts every ClickHouse table to `Replicated…MergeTree` by hardlink, with no extra disk needed; with `CLICKHOUSE_MIGRATIONS_ENABLED=false`, enable migrations for that first start. Add the recommended ClickHouse server settings (guide step A5) only after the upgrade.

---

#### ai-dial-analytics-enrichment-runner `0.24.0-rc.0`

This release includes changes that need operator action. Please review the [upgrade guide](https://github.com/epam/ai-dial-analytics-enrichment-runner/blob/0.24.0-rc.0/docs/release-0.24-upgrade.md) before proceeding.

Upgrade together with ADAS 0.24 (contract `4` → `7`): scale the runner to 0, deploy ADAS 0.24, then deploy runner 0.24 and scale it back. A rolling update is not enough (#12, #13, #16).

| Variable | Required | Default | Description |
|---|---|---|---|
| `DIAL_ROUTE_READ_TIMEOUT_MS` | No | `180000` | Read timeout for DIAL application-route calls (`preset: dial_app_route`); `DIAL_READ_TIMEOUT_MS` still applies to chat calls (#12) |

* `GROUP_INPUT_TOKEN_BUDGET` now applies only to group pipelines without their own `advanced.input_token_budget` (#13)
* The new dry-run endpoint `POST /v1/pipelines/{name}/try` calls the model synchronously, so the ingress read timeout must allow for the model call (#16)

---

#### ai-dial-analytics-mcp `0.24.0-rc.0`

> [!IMPORTANT]
> **New component.** An MCP server (`adas-mcp`) that exposes the ADAS REST API as `adas_*` MCP tools over streamable HTTP; read-only by default. It backs the AI Query Helper in the Admin analytics UI. See the [README](https://github.com/epam/ai-dial-analytics-mcp/blob/0.24.0-rc.0/README.md) and the [deployment guide](https://github.com/epam/ai-dial-analytics-mcp/blob/0.24.0-rc.0/docs/deployment-guide.md).

- **Image:** `epam/ai-dial-analytics-mcp`; MCP endpoint `/mcp` on port `5000`, Prometheus metrics on `9464` when enabled; runs as non-root `app` (uid `10001`)
- **Dependencies:** ai-dial-analytics `0.24`. Register it in DIAL Core as a toolset (e.g. `adas-mcp`) with `transport: HTTP`, `forwardPerRequestKey: true` and `authSettings.authenticationType: none`, so ADAS calls run as the calling user. The ingress must pass the `Api-Key` header through and must not buffer responses.

| Variable | Required | Default | Description |
|---|---|---|---|
| `ADAS_BASE_URL` | Yes | unset | ADAS backend URL |
| `ADAS_CAPABILITIES` | No | `limited` | `limited` exposes only read-only tools; `full` adds write-capable tools. Keep `limited` for a shared instance |
| `ADAS_ENABLE_EXECUTE_SQL` | No | `false` | Registers `adas_execute_sql` |
| `ADAS_API_KEY` | No | unset | Fallback admin key, used only when a request carries no JWT or `Api-Key`; not needed behind DIAL |
| `ADAS_HTTP_TIMEOUT` | No | `30` | Timeout for ADAS calls, in seconds |
| `FASTMCP_HOST` / `FASTMCP_PORT` | No | `0.0.0.0` / `5000` | Bind host and port |

---

#### ai-dial-scheduler `0.4.0-rc.0`

> [!IMPORTANT]
> **New component in the DIAL release.** A scheduling service that runs DIAL applications and HTTP targets on cron and date triggers, as the user who created the schedule; exposes a REST API and an MCP endpoint. One image, `epam/ai-dial-scheduler`, runs as three services selected by `SERVICE`: `migrations`, `api` (port `5000`) and `worker`. See the [README](https://github.com/epam/ai-dial-scheduler/blob/0.4.0-rc.0/README.md) and the [deployment guide](https://github.com/epam/ai-dial-scheduler/blob/0.4.0-rc.0/documentation/deployment/deployment.md).

- **Dependencies:** PostgreSQL. In DIAL: create an app API key with a role that can access `dial_scheduler`, import `scheduler-app-definition.json` as an application, grant admin consent for the `dial-native` external service. Users must enable offline credentials in DIAL Chat before creating schedules.
- **Worker:** run exactly one replica with the `Recreate` strategy — extra workers run jobs twice.

| Variable | Required | Default | Description |
|---|---|---|---|
| `SERVICE` | Yes | unset | `migrations`, `api` or `worker` |
| `DIAL_URL` | Yes | unset | DIAL Core base URL; also the default target URL for `chat_completion` / `responses` schedules (#30) |
| `DIAL_API_KEY` | Yes | unset | The scheduler app's API key |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` | `DB_USER`: Yes | `localhost` / `5432` / `app` / `app` | PostgreSQL connection |
| `DB_AUTH_MODE` | No | `password` | `password`, `connection-string`, `gcp_iam`, `azure_entra` or `aws_iam`; selects which credential variables are required |
| `DB_PASSWORD` | For `password` mode | unset | Database password |
| `RUN_MIGRATIONS_ON_START` | No | `false` | `api` / `worker` run `alembic upgrade head` at boot instead of a separate `migrations` job |
| `SCHEDULER_APP_ID` | No | `dial_scheduler` | DIAL application id used for the on-behalf-of credentials request |
| `PORT` | No | `5000` | API port |
| `MCP_ENABLED` / `MCP_PATH` | No | `true` / `/mcp` | API MCP endpoint |

##### Changes since 0.3.1

- **Database migration** — Alembic `c8d6f7a9b0e1` adds `schedules.timezone VARCHAR(64) NOT NULL DEFAULT 'UTC'` (additive). Run the `migrations` service, or set `RUN_MIGRATIONS_ON_START`, before starting API and worker (#25)
- **Outbound headers** — every outbound request sends `User-Agent: ai-dial-scheduler/<version>`; `chat_completion` runs with `create_conversation: true` also send `X-CONVERSATION-ID` (#28)

---

#### ai-dial-openapi-to-mcp `0.2.2`

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PATH_PARAMS_ALLOW_RESERVED` | No | `false` | `true` keeps `/` unencoded in every path parameter; otherwise only parameters marked `x-mcp-allow-reserved: true` / `allowReserved: true` keep it (#26, #29) |
| `MCP_VALIDATE_OUTPUT` | No | `true` | `false` turns off validation of JSON tool results against spec-derived output schemas; per-operation `x-mcp: {validateOutput: ...}` overrides it (#27) |

##### Behavioral changes

- **Tool results** carry the whole HTTP response: text bodies as text, binary bodies as base64, status and selected headers in `_meta["dial.epam.com/response"]` and a final `HTTP <code>; ...` text block (#27)

---

#### ai-dial-adapter-openai `0.47.0-rc.0`

> [!NOTE]
> **Proxy environment variables are honored** with the default `HTTP_TRANSPORT=aiohttp`: upstream requests now go through `HTTP_PROXY` / `HTTPS_PROXY`, minus the hosts in `NO_PROXY` (previously ignored). If the container already has a proxy set, add upstream endpoints that must be reached directly to `NO_PROXY`. `ALL_PROXY` and SOCKS proxies are not supported (#615).

---

#### ai-dial-adapter-vertexai `0.43.0-rc.0`

> [!NOTE]
> **Proxy environment variables are honored** with the default `HTTP_TRANSPORT=aiohttp`: upstream requests now go through `HTTP_PROXY` / `HTTPS_PROXY`, minus the hosts in `NO_PROXY` (previously ignored). If the container already has a proxy set, add the Google / Vertex AI endpoints that must be reached directly to `NO_PROXY` (#615).

- **Multimodal embeddings** (`multimodalembedding@001`) take region and project from the deployment's upstream config (`region` / `project`) first, then from `GCP_DEFAULT_REGION` / `GCP_PROJECT_ID`. A request with no region or project from either source fails. Check that existing multimodal embedding deployments point to the intended region (#614)

---

#### ai-dial-model-provider `0.2.0-rc.0`

Picks up the ai-dial-adapter-openai `0.47.0-rc.0` and ai-dial-adapter-vertexai `0.43.0-rc.0` changes above: proxy environment variables are now honored (add internal upstreams to `NO_PROXY` if `HTTP_PROXY` / `HTTPS_PROXY` are set), and Vertex AI multimodal embeddings take region and project from the per-deployment upstream config (#33, #40).

---
