# Instructions

## Table of contents

- [Versions](#versions)
- [Before upgrade](#before-upgrade)
  - [General notes](#general-notes)
  - [Release-specific notes](#release-specific-notes)

## Versions

1. Helm chart versions:
   - dial: `-`
   - dial-core: `-`
   - dial-extension: `-`
   - dial-admin: `-`
2. Main components versions:
   - ai-dial-adapter-bedrock: `0.46.0-rc.0`
   - ai-dial-adapter-openai: `0.46.0-rc.0`
   - ai-dial-adapter-vertexai: `0.42.0-rc.0`
   - ai-dial-adapter-dial: `0.21.0-rc.0`
   - ai-dial-chat-themes: `0.22.0`
   - ai-dial-chat: `1.3.0-rc.1`
   - ai-dial-core: `0.50.0-rc.0`
   - ai-dial-analytics-realtime: `0.30.0-rc.0`
   - ai-dial-analytics: `0.23.0-rc.1`
   - ai-dial-analytics-enrichment-runner: `0.23.0-rc.1`
   - ai-dial-model-provider: `0.1.0-rc.0`
   - ai-dial-rag: `0.44.0-rc.0`
   - ai-dial-log-parser: `0.3.0`
   - ai-dial-code-interpreter: `0.2.0`
   - ai-dial-app-controller: `0.5.1`
   - ai-dial-app-builder-python: `0.1.0`
   - ai-dial-quickapps-backend: `0.14.0-rc.0`
   - ai-dial-quickapps-frontend: `0.4.0-rc.0`
   - ai-dial-admin-backend: `0.23.0-rc.0`
   - ai-dial-admin-frontend: `0.23.0-rc.0`
   - ai-dial-admin-deployment-manager-backend: `0.23.0-rc.0`
   - ai-dial-admin-evaluation-framework-backend: `0.6.0-rc.0`
   - ai-dial-admin-evaluation-metrics: `0.4.0-rc.0`
   - ai-dial-openapi-to-mcp: `0.2.1`

## Before upgrade

### General notes

- Please review the [Config changes](#config-changes) chapter carefully for each component that is used in your DIAL installation. Changes in components' configuration may be required.
- Please check if any image tag overrides (`image.tag`) are present and remove them if they are not required anymore.
- Please check and add `image.repository` to change the image location for `redis`, `postgresql`, `keycloak` and `keycloakConfigCli` components to start using alternative Docker registries (e.g. Amazon ECR Public Gallery) if required.

> Environment variable tables below use the same columns: **Required** is `Yes` (the service does not start without the variable) or `No`, and **Default** is the value applied when the variable is not set — `unset` means the variable has no default value.

### Release-specific notes

#### ai-dial-admin-deployment-manager-backend `0.23.0-rc.0`

This release includes **critical changes**. Please review the [full upgrade guide](https://github.com/epam/ai-dial-admin-deployment-manager-backend/blob/0.23.0-rc.0/docs/upgrade-plans/0.23.0.md) before proceeding.

---

#### ai-dial-admin-evaluation-framework-backend `0.6.0-rc.0`

### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TEST_SUITE_RUN_EXEC_MAX_RESP_BODY_BYTES` | No | `52428800` | Maximum captured response body size in bytes before truncation; minimum `1`. |

### Behavioral changes

> [!NOTE]
> These take effect automatically on upgrade unless noted otherwise.

- **Response capture limit** — default raised from 5 MB to 50 MB per response; set `TEST_SUITE_RUN_EXEC_MAX_RESP_BODY_BYTES` to lower it on memory-constrained deployments (#250)
- **Multi-turn cap** — `TEST_CASE_MULTI_TURN_MAX_TURNS` default raised from `10` to `30` (#252)
- **Run deletion** — deleting a run or suite now writes to the analytics database before the meta delete, so it fails while analytics is unreachable #198 (#255)
- **Score validation** — suites with unresolved score references become `isValid=false` and are blocked from running once the suite, its dataset, or its metric definitions are next saved (#292)

### Database migrations

> [!NOTE]
> Flyway applies these automatically on startup; the service account needs DDL privileges on both schemas. All three are additive or backfill-only.

- **meta** — `V1.37__AddRoutesRefToTestSuites.sql` — adds nullable `test_suites.routes_ref` JSONB #267 (#260)
- **meta** — `V1.38__BackfillStartedAtForNeverStartedRuns.sql` — sets `started_at_ms` to `completed_at_ms` for `FAILED` / `CANCELLED` runs that never started #271 (#277)
- **analytics** — `V1.22__CreateRunDeletionsTable.sql` — creates the `run_deletions` tombstone table #198 (#255)

### API / contract changes

> [!NOTE]
> All changes are additive; full REST reference is available in Swagger UI (`/swagger-ui.html`).

- **Suite types** — `suiteType` gains `ROUTE` with required `routesRef: { name }`; run snapshots carry `routesRef`, and Query DSL adds `routes_ref::name` on `test_suites` and `test_suite_runs` #267 (#260)
- **Schema types** — `SKILL` joins the field and response-column types; strict clients must accept the new enum value #268 (#282)
- **Validation warnings** — new `UNSUPPORTED_SCORE_FUNCTION` code, `UNRESOLVED_REFERENCE` now also covers score-definition metric names, and circular endpoint-schema `$ref` chains return HTTP 400 (#292)
- **Run costs** — `POST /api/v1/costs/test-suite-runs` items gain `testCaseCost` and `metricEvalCost` #274 (#275)
- **Run comparison** — `GET /api/v1/analytics/metric-scores/comparison` accepts runs of different suites whose snapshots reference the same dataset; other cross-suite pairs still return 409 `INVALID_OPERATION` #237 (#253)
- **Query DSL** — `test_suite_runs` adds `overall_score_threshold` (#287); multi-run filters accept `computation_id eq "latest"` #259 (#262)

---

#### ai-dial-admin-frontend `0.23.0-rc.0`

> [!IMPORTANT]
> Admin access now comes from DIAL Core's `GET /v1/user/role-assignments` instead of the admin backend's `/security-info`. `DIAL_CORE_API_URL` is required for every access decision, the admin backend's `FULL_ADMIN` / `READ_ONLY_ADMIN` roles are no longer read (a caller who was only a read-only admin there loses access), and a Core with authentication on but no admin rules answers `NONE` for everyone — configure Core's admin rules before upgrading. With authentication off, or when Core answers `404` because org units are disabled, every caller is a full admin. `NIM_ENABLED` is removed and NIM containers, audit rows, and export entries are no longer recognized. Several `DISABLE_MENU_ITEMS` tokens stop working — see below.

| Variable | Required | Default | Description |
|---|---|---|---|
| `DIAL_CORE_API_URL` | Yes | — | Now also the source of access decisions, via `GET /v1/user/role-assignments` |
| `ORG_UNITS_GROUP_CLAIM` | No | `groups` | Token claim, or dotted path, that holds a user's groups for org units |
| `PROJECT_CONTEXT_ALLOWED_EXTENSIONS` | No | `csv,pdf,xlsx` | Extensions allowed for project context files; use the chat app's value |
| `PROJECT_CONTEXT_FILE_MAX_BYTES` | No | `1048576` | Maximum size of one project context file |
| `PROJECT_CONTEXT_TOTAL_MAX_BYTES` | No | `10485760` | Maximum total size of a project's context files |
| `POLICIES_ENABLED` [Preview] | No | `false` | Shows Policies and Policy Assignments in Governance; needs a DIAL Core with epam/ai-dial-core#2152 |
| `ANALYTICS_CUSTOM_DASHBOARDS_ENABLED` [Preview] | No | `false` | Serves custom dashboards at `/dashboards/<id>`; needs `ANALYTICS_ENABLED`, `ANALYTICS_USAGE_ENABLED`, and an Analytics service with `/v1/dashboards` |
| `NIM_ENABLED` | — | — | Removed; the Model Servings tab depends on `HF_ENABLED` alone |

* `DISABLE_MENU_ITEMS`: `catalog` is ignored (Core-direct items are always shown); `containers` replaces `mcpcontainers`, `interceptorcontainers`, `adaptercontainers`, and `applicationcontainers`; `approvals` replaces the six `*publications` tokens
* The per-type container pages move to `/containers` and the per-type publication pages to `/publications`; old URLs redirect permanently
* Theme config and images are cached for 30 minutes — a change to the config at `THEMES_CONFIG_URL` can take that long to appear
* Shadows now read DIAL Chat's `shadow-sm-1`/`-2` and `shadow-md-1`/`-2` theme variables; a custom themes config with a single `shadow-sm` / `shadow-md` keeps it on the drop layer, and `shadow-xs-2` is no longer read — see `docs/THEME-CUSTOMIZATION.md`
* Monaco is served by the app instead of the jsdelivr CDN, so editors no longer need outbound access to it
* Users must sign in again after the upgrade for their profile picture to appear
* [Preview] Pipeline run controls expect the enrichment runner from epam/ai-dial-analytics-enrichment-runner#5; against an older runner, operator pauses still show and Resume still works

---

#### ai-dial-analytics `0.23.0-rc.1`

This release includes changes that need operator action. Please review the [upgrade guide](https://github.com/epam/ai-dial-analytics/blob/0.23.0-rc.1/docs/release-0.23.0-upgrade.md) before proceeding.

Upgrade together with Enrichment Runner 0.23: the ADAS ↔ Enrichment Runner contract version rises from `3` to `4`, and neither build works with the other's previous release. See the [runner upgrade guide](https://github.com/epam/ai-dial-analytics-enrichment-runner/blob/0.23.0-rc.1/docs/release-0.23.0-upgrade.md).

---

#### ai-dial-analytics-enrichment-runner `0.23.0-rc.1`

This release includes changes that need operator action. Please review the [upgrade guide](https://github.com/epam/ai-dial-analytics-enrichment-runner/blob/0.23.0-rc.1/docs/release-0.23.0-upgrade.md) before proceeding.

Upgrade together with ADAS 0.23: the ADAS ↔ Enrichment Runner contract version rises from `3` to `4`, and neither build works with the other's previous release.

---

#### ai-dial-chat `1.3.0-rc.1`

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `UI_EVENT_ENABLED_BY_DEFAULT` | `true` | Client-visible config, exposed as `config.celebrationsEnabledByDefault`. The initial state of the Seasonal celebrations switch for users who have not saved a choice; a saved choice wins, and the default is never written to the browser, so changing it reaches everyone who never chose. Only `false`, `0` or `no` (case-insensitive) turn it off, which makes a configured `UI_EVENT` opt-in. No effect without `UI_EVENT`. (#9498) |

### Behavioral changes

> [!NOTE]
> Takes effect on upgrade without any configuration change.

- **Usage token rows need DIAL Core `0.49.0`** — the usage popover and composer banner read token limits from the new `/usage` route instead of `/limits`; on an older DIAL Core it answers 404, so the popover drops its token rows and shows its error line, and the banner no longer warns on token limits, while cost rows and cost warnings keep working. (#9517)

### New `ENABLED_UI_FEATURES` values

| Value | Description |
| --- | --- |
| `hide-conversation-import` | Removes the Import entry from the conversations panel menu; Export all and Delete all stay. It hides the entry point only and does not block the import API. (#9546) |
| `hide-usage-page` | Removes the Settings page's Usage tab and the "Full usage" link in the usage-limits popover beside the chat input, keeping the rest of Settings; a direct `/settings/usage` URL redirects to the first remaining Settings tab. Independent of `USAGE_LIMITS_CONTROL_ENABLED`, which still decides whether that popover's control renders at all. (#9546) |

### New `ENABLED_UI_FEATURES` values

| Value | Description |
| --- | --- |
| `hide-user-menu-identity` | Removes the avatar-and-name row at the top of the desktop user menu's dropdown and of the mobile navigation drawer's profile page; Settings and Log out stay. `hide-user-menu` overrides it on desktop. The desktop trigger is unchanged and shows only the avatar, so with the key on the user is identified there only by the avatar and its email tooltip. (#9557) |

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `CATALOG_CREATION_ROLES` | unset (unrestricted) | Server-only JSON policy restricting who may **create** catalog entities: `{"types":{"skill":["skill-authors"]},"schemas":{"<schema id>":["team-A"]}}`. A user passes a rule holding any listed role; a schema app needs both its `schema-app` rule and its exact schema rule; administrators get no bypass. Independent of `ENABLED_UI_FEATURES`, which it never filters. Invalid JSON, an unknown key or a blank schema id fails startup; restart `chat-api` after changing. Enforced in the UI only — DIAL Core stays the authority for direct API calls. Successor of legacy `ENABLED_FEATURES_ROLES` for creation rules; see `docs/legacy-chat-migration-guide.md`. (#9604) |

### Behavioral changes

> [!NOTE]
> Everything below takes effect on upgrade without any configuration change.

- **Role-gated features follow the configured roles claim** — `ASR_ENABLED_ROLES`, `LIVE_CHAT_INTERACTION_ENABLED_ROLES`, `SCHEDULED_TASKS_ENABLED_ROLES` and client-config role evaluation now read `AUTH_{PROVIDER}_DIAL_ROLES_FIELD`, falling back to `DIAL_ROLES_FIELD` (default `dial_roles`), including dotted paths in header tokens, instead of a hardcoded `roles` claim; some users can gain or lose role-gated features. Clearing `CATALOG_CREATION_ROLES` does not revert this. (#9604)
- **Create needs the new client-config field** — the catalog Create menu and create-mode editors stay unavailable until `GET /api/v1/client-config` returns `catalogCreationPermissions`, and a missing field counts as unavailable, not unrestricted; a frontend hosted separately from `ai-dial-chat-bff` must be upgraded together with it. (#9604)

Deltas below are relative to **1.2.23**, the last published stable release.

### New environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `PROJECTS_ENABLED` | `false` | Client-visible flag, exposed as `features.projectsEnabled`. Enables the Projects page, its sidebar entry and `GET /api/v1/projects`. |
| `PROJECTS_ENABLED_ROLES` | unset (unrestricted) | Comma-separated roles allowed to use Projects when `PROJECTS_ENABLED` is `true`. |
| `PROJECT_CONTEXT_FILE_MAX_BYTES` | `1048576` | Maximum size of one project context file, enforced by `POST /api/v1/projects` and sent to the browser. Keep at or below DIAL Core's `complexResource.types.projects` limit. |
| `PROJECT_CONTEXT_TOTAL_MAX_BYTES` | `10485760` | Maximum combined size of a project's context files; must be at least the per-file limit and at most `66060288`. |
| `PROJECT_CONTEXT_ALLOWED_EXTENSIONS` | `csv,pdf,xlsx` | Comma-separated, lower-case context file extensions without a dot. |
| `TEXT_REFINEMENT_PROJECT_DESCRIPTION_PROMPT` | built-in | Replaces the instruction for refining a project description. |
| `TEXT_REFINEMENT_PROJECT_INSTRUCTIONS_PROMPT` | built-in | Replaces the instruction for refining project instructions. |
| `ADDITIONAL_CONTENT_LOCALES` | unset (none) | Comma-separated BCP-47 tags a toolset's or application's Name/Description can be translated into, exposed as `config.additionalContentLocales`. A malformed tag fails startup; present but empty switches the list off. |
| `GENERATION_PREPARATION_TIMEOUT_MS` | `30000` | Bounds how long a completion may wait in preparation before SSE headers are sent; on expiry the request fails with 503. Minimum `1000`. |
| `PUBLISH_ATTACHMENTS_MAX_FILES` | `1000` | Maximum number of attachment files published with a conversation. |
| `UI_EVENT_DELIVERY_MODE` | `bundled` | `bundled` plays compiled celebration scenes only; `prefer-external` takes the listed scenes and events from packs published under `<THEMES_CONFIG_URL>/celebrations/`. |
| `UI_EVENT_DELIVERY_REVISION` | `0` | Change it to restart a scene playing under the previous delivery policy. |
| `UI_EVENT_EXTERNAL_SCENES` | empty | Comma-separated `eventId/sceneId` pairs of compiled events that may come from an external pack (at most 64). |
| `UI_EVENT_EXTERNAL_EVENTS` | empty | Comma-separated event IDs without a compiled module that may come entirely from an external pack (at most 64). |

### Deprecated environment variables

> [!CAUTION]
> Still works, but will be removed in future versions.

| Variable | Replacement | Description |
| --- | --- | --- |
| `AVAILABLE_LOCALES` | `ADDITIONAL_CONTENT_LOCALES` | The `0.x` name, read only when `ADDITIONAL_CONTENT_LOCALES` is absent; accepts `ar,en` or `["ar","en"]` and logs a deprecation warning at startup. |

### New feature flags

| Flag | Description |
| --- | --- |
| `features.projectsEnabled` | Enables the Projects page, its sidebar entry and `GET /api/v1/projects`. Toggled through `PROJECTS_ENABLED`, restricted through `PROJECTS_ENABLED_ROLES`; defaults to `false`. (#9606) |

The `hide-starter-icon` value is added to `ENABLED_UI_FEATURES` for label-only conversation-starter pills. (#9491)

### Behavioral changes

> [!NOTE]
> Everything below takes effect on upgrade without any configuration change.

- **Unpublish requests are restricted** — only an administrator or the publisher of a public copy can request its unpublish; other API callers get 403 where they used to get a pending request. (#9489)
- **Completions carry `X-Lang`** — the UI language is forwarded to DIAL Core on both generation paths; Core reads it through `PROXY_LANGUAGE_HEADER`. (#9684)
- **Completion preparation is bounded** — a completion still preparing after `GENERATION_PREPARATION_TIMEOUT_MS` (30 s) fails with 503 instead of waiting indefinitely. (#9632)
- **Scheduled tasks honor the Scheduler consent** — with the DIAL Scheduler service consent signed out, the Scheduled Tasks list shows a Limited access banner and hides New task. (#9495)
- **Toasts move to the bottom-end corner.** (#9610)
- **Conversation attachments are published with the conversation**, up to `PUBLISH_ATTACHMENTS_MAX_FILES`. (#9516)

---

#### ai-dial-quickapps-backend `0.14.0-rc.0`

### Behavioral changes

> [!NOTE]
> - **Predefined RAG tool no longer propagates history.** This applies on upgrade with no config change to apps that reference the `dial_rag` template, directly or through the predefined `chathub` toolset. Each `rag_search_tool` call now reaches `dial-rag` without the tool's earlier calls (`content_propagation.propagate_history`: `true` → `false` in `config/predefined/tool/dial_rag.json`). Apps that define their own `dial-rag` `deployment-tool` inline keep their own setting (#647).

### Behavioral changes

> [!NOTE]
> Ten preview-gated features have graduated to GA and are now active regardless of `ENABLE_PREVIEW_FEATURES` (#693). Apps that don't configure them are unaffected; on deployments with preview off, settings that were silently dropped from existing manifests now take effect:
>
> - **Tool discovery** — `orchestrator.tool_discovery`
> - **Deferred toolsets** — `toolsets[].deferred`
> - **Web fetch** — `features.web_fetch`
> - **Representation tooling** — `features.representation_tooling`
> - **Agent hooks** — `hooks`
> - **Citation annotation propagation** — `propagate_annotations_to_choice` on `deployment-tool` and `dial-deployment-simple`
> - **Tools hidden from the model** — `hidden_from_model` on `mcp`, `dial-mcp` and `dial-app` toolsets
> - **DIAL skill resources** — `skills[]` entries with `type: "dial-skill"`; requires DIAL Core ≥ 0.48.0
> - **Skill invocation from a message** — `custom_content.skills` chips are resolved for every app (no manifest field), adding one DIAL Core fetch per chip per turn
> - **Folder contexts** — `contexts[]` entries with `type: "folder"`, expanded on every request
>
> Apps with `features.web_fetch.enabled: true` on a deployment where `EXTERNAL_URL_FETCH_ENABLED` is `false` (the default) now show a failed *Initialization issues* stage on every turn until egress is enabled or `web_fetch` is removed. The `MIN_TOOLS_FOR_DEFERRAL`, `DIAL_SKILLS_*` and `SKILL_INVOCATION_MAX_SKILLS*` limits now apply with preview off. Tool-call result offload (`features.dial_files.tool_call_result_offload`) remains preview-gated.

### New environment variables

| Variable                            | Default                                                                            | Description                                                                                                                                                                                                                                   | Required |
|-------------------------------------|------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `PROMPT_CACHE_BREAKPOINTS_ENABLED`  | `true`                                                                             | Mark the orchestrator's system message, last message and last function tool with prompt-cache breakpoints (`custom_fields.cache_breakpoint`) when the orchestrator deployment advertises `features.cache` (Core `cacheSupported`). No effect elsewhere. | No       |
| `TOOL_CALL_RESULT_LIMIT__MAX_CHARS` | `80000`                                                                            | Maximum length (`> 0`), in characters, of any tool response that reaches the model; a longer response (still over the limit after offload) is replaced by a "response too large" error. Must be at least `TOOL_CALL_RESULT_OFFLOAD__SIZE_THRESHOLD` and any per-app `size_threshold`. | No       |
| `EXTERNAL_URL_FETCH_USER_AGENT`     | `QuickApps-ExternalFetch/1.0 (+https://github.com/epam/ai-dial-quickapps-backend)` | `User-Agent` header sent on external URL fetches. Some sites (e.g. Wikipedia) reject generic library user agents with `403`. Must not be empty.                                                                                                  | No       |

### Behavioral changes

> [!NOTE]
> - **DIAL file tools are on by default.** Apps without a `dial_files` block, or with `"dial_files": null` (which the QuickApps editor wrote when its *Built-in file tools* switch was off), now get all ten `internal_file_*` tools, including the mutating `write`, `edit`, `delete`, `copy` and `move`. Set `features.dial_files.enabled_tools: "read_only"` for agents that must not modify the workspace; there is no off switch. With `ENABLE_PREVIEW_FEATURES=true`, tool-call result offload now also applies to these apps (#710).
> - **Oversized tool responses are replaced by an error.** A response of any tool that is still longer than `TOOL_CALL_RESULT_LIMIT__MAX_CHARS` (80,000 characters) after offload is no longer passed to the model, which gets a "response too large" error instead. A `TOOL_CALL_RESULT_OFFLOAD__SIZE_THRESHOLD` above the limit is now rejected (#677).
> - **Time awareness follows the user's time zone.** DIAL Chat users (Chat 1.1.0+ sends `X-Timezone`) now get local time instead of UTC; apps whose prompts assume UTC should drop that assumption. Requests without a valid `X-Timezone` still use UTC (#705).
> - **Prompt cache breakpoints are sent by default** to orchestrator deployments that advertise `cacheSupported`, and tools from MCP and `dial-app` toolsets now reach the model sorted by name. On Claude, a turn with a single model call pays 25% more on the history; set `PROMPT_CACHE_BREAKPOINTS_ENABLED=false` to opt out (#696).

### DIAL Configuration changes

> [!IMPORTANT]
> Prompt caching acts only on orchestrator deployments whose DIAL Core configuration sets `cacheSupported`; `autoCachingSupported` alone does not turn it on.
>
> **Recommended migration** (#696):
>
> 1. **Add** `"cacheSupported": true` to the `features` of each Claude orchestrator deployment whose adapter supports prompt caching.

---

#### ai-dial-quickapps-frontend `0.4.0-rc.0`

### Host integration changes

> [!IMPORTANT]
> The editor now accepts `postMessage` commands only from its embedding parent window (`event.source === window.parent`) at an allowed origin, and ignores messages with malformed known fields. Hosts embedding the editor in an iframe need no configuration change; messages from any other window are now discarded, even with `allowedOrigin` set to `*`. Existing save payloads and multiple-origin/wildcard `allowedOrigin` values are preserved. See the `host-integration` spec.

* The handshake is now also sent as `{applicationName}/readyToInteract` through `AppsEditorClient`; the uppercase `READY` / `READY_TO_INTERACT` Admin messages are unchanged (#292)
* Hosts must send `TRIGGER_SAVE` themselves — the editor no longer saves on its own every 30 seconds (#330)

### Behavioral changes

> [!NOTE]
> After redeploying this image, new QuickApps open with defaults from the application type schema, and no timer-driven saves occur.

- **New-app defaults** — Add attachments, Fetch web resources and Process files default to on, and the model, temperature and conversation starters come from the type schema when present (#304, #305, #310)
- **`features.dial_files`** — no longer written for new apps; an absent key means all file tools per the backend default, so deploy `ai-dial-quickapps-backend` PR #710 first (#335)
- **Auth/handshake timing** — the client config is requested after the auth status is known, so the handshake waits for one `GET /api/v1/auth/me` (#263)

---

#### ai-dial-admin-backend `0.23.0-rc.0`

##### Breaking changes

**Removed `nim` deployment type**

The `nim` deployment type has been removed from ai-dial-admin-backend, matching its removal from Deployment Manager. Any configurations, scripts, or tooling that reference the `nim` deployment type will break.

| Previous configuration | Required action |
|---|---|
| Deployment configurations using the `nim` deployment type | Remove or migrate any references to the `nim` deployment type before upgrading |

**Exporting config to DIAL Core below 0.50.0 silently skips `CUSTOM_HEADER` upstreams**

If the admin backend is upgraded to 0.23.0-rc.0 but paired with a DIAL Core version below 0.50.0, any upstreams using the new `CUSTOM_HEADER` authType will be silently dropped during config export. Operators running Core < 0.50.0 must be aware of this data-loss risk.

| Previous configuration | Required action |
|---|---|
| Running DIAL Core < 0.50.0 with upstreams that use CUSTOM_HEADER authType | Upgrade DIAL Core to 0.50.0+ before using CUSTOM_HEADER upstreams, or avoid configuring CUSTOM_HEADER upstreams until Core is upgraded |

---

#### ai-dial-core `0.50.0-rc.0`

##### Breaking changes

**Application route-upstream secrets are now encrypted at rest**

Route-upstream secrets for Application routes are now encrypted at rest. Existing unencrypted secrets stored in the data layer may require a migration or re-save to be encrypted.

| Previous configuration | Required action |
|---|---|
| Route-upstream secrets stored unencrypted at rest | Verify whether existing route-upstream secrets need to be re-written/migrated to be stored in encrypted form after upgrade |

---

#### ai-dial-adapter-vertexai `0.42.0-rc.0`

##### Deprecated environment variables

| Variable | Description |
|---|---|
| `DEFAULT_REGION` | DEFAULT_REGION is deprecated in favour of GCP_DEFAULT_REGION. Replaced by `GCP_DEFAULT_REGION`. |

**Migration:** _DEFAULT_REGION is set_ → Migrate to GCP_DEFAULT_REGION before the variable is removed in a future release
**Migration:** _DEFAULT_REGION is unset_ → No action needed; use GCP_DEFAULT_REGION for new deployments

##### New environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GCP_DEFAULT_REGION` | No | unset | New preferred replacement for DEFAULT_REGION. Operators should migrate to this variable as DEFAULT_REGION is being deprecated. |

---

#### ai-dial-model-provider `0.1.0-rc.0`

> [!IMPORTANT]
> This is the **initial release** of Model Provider — a unified image that consolidates all four adapter images into a single deployable component. Starting from DIAL 1.50, deploy `ai-dial-model-provider` instead of the individual adapter images.

**Consolidated adapters:**
- `ai-dial-adapter-bedrock` `0.46.0-rc.0`
- `ai-dial-adapter-openai` `0.46.0-rc.0`
- `ai-dial-adapter-vertexai` `0.42.0-rc.0`
- `ai-dial-adapter-dial` `0.21.0-rc.0`

The environment variables for each adapter remain unchanged — no configuration migration is required. Apply any adapter-specific changes from the sections above to your Model Provider deployment.

---
