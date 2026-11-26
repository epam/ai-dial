---
name: services-section
description: Use when reading or editing any page under docs_v2/7.services/, mapping a DIAL service repository to its docs folder, deciding which service page owns a setting, endpoint, dependency, or example, or deciding what to do with versions, image tags, pinned source links, and last_verified on service pages.
---

# The Services section

`docs_v2/7.services/` has one folder per DIAL service or chart set. It is reference for platform engineers who deploy, configure, upgrade, and secure DIAL. Every claim on these pages rests on released source: code, configuration, or upstream docs at a release tag.

## Find the folder of a repository

Run from the checkout root:

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/service_folder.py"                     # whole catalog
python3 -I "${CLAUDE_SKILL_DIR}/scripts/service_folder.py" https://github.com/epam/<REPO>
```

A repository belongs to the folder whose `0.index.md` links it inside the `:::info` block. No match means no docs folder: creating a service section is out of scope for a sync. Several matches is a stop condition.

## Page roles: which page owns what

| Page | Owns | Typical sections |
|---|---|---|
| `0.index.md`, the overview | what the service does, its components, how it fits with other services, dependencies, image, ports, health endpoints, deployment options, platform-release pins, the `:::info` block | `## How it works` (or `How <X> fits together`), `## Dependencies`, `## Deployment`; no closing links |
| `1.configuration.md` or `N.configuration/0.index.md` | where each setting lives, registration in DIAL Core, connecting other services, a short example, troubleshooting | `## Where each setting lives` (`Place \| What it sets \| Reference`), `## Register …`, `## Example: …`, `## Troubleshooting` (`Symptom \| What to check`) |
| `N.configuration/<N>.<component>.md`, `environment-variables.md` | every setting with its default, grouped by subsystem | one H2 per subsystem with a settings table and a short paragraph on behavior |
| `N.api.md` | endpoints, request and response fields, status codes, errors, authentication | method and path tables, field tables |
| `capabilities.md`, `supported-models.md`, `supported-upstreams.md`, capability folders | features and what turns them on, model and provider lists | feature tables |
| how-to pages, for example `2.migration.md` or `2.create-a-custom-theme.md` | tasks | `## Prerequisites`, numbered steps, `## Result` |

Put each fact on the page that owns its topic: a new variable goes into the existing table for its subsystem, an endpoint goes into the API page, and a dependency goes into the dependencies table.

## Catalog

The source paths were checked against each repository's latest release on 2026-11-25. Repositories move files, so confirm each one at the target tag.

| Folder | Repositories (tag format) | Settings, interfaces, and upstream docs at a tag | Coupled pages and notes |
|---|---|---|---|
| `1.core/` | `ai-dial-core` | static defaults `server/src/main/resources/aidial.settings.json`; dynamic configuration spec `docs/dynamic-settings/*.md`; feature docs `docs/*.md` (`org-units.md`, `tracing.md`, `storage-requirements.md`, `error_codes.md`); `*Settings` classes and controllers under `server/src/main/java/` | static settings in `1.configuration/2.settings/`, one page per group; dynamic entities in `1.configuration/<N>.<entity>.md`. Release notes link `release-0.x` branch docs; cite the tag instead. |
| `2.chat/` | `ai-dial-chat` | `apps/chat-api/.env.template` and the `process.env` reads behind it; `docs/*.md` (observability, MCP Apps, legacy migration, themes); `libs/chat-api-client/openapi.json`; Dockerfiles in `apps/*/` | three images: Chat, BFF (GHCR), MCP Apps sandbox (GHCR). `ENABLED_UI_FEATURES` keys go in `1.configuration/3.features-and-ui.md`. UI behavior belongs to the Chat User Guide (out of scope). |
| `3.chat-themes/` | `ai-dial-chat-themes` | `static/config.json`, `Dockerfile`, `docs/CHANGELOG.md` | Chat reads it through `THEMES_CONFIG_URL` (`2.chat/1.configuration/1.server-and-dial-core.md`). |
| `4.model-provider/` | `ai-dial-model-provider` | `.env.example`, `aidial_model_provider/*/utils/env.py`, `aidial_model_provider/openai/configuration/app_config.py`, `Dockerfile` | bundles the OpenAI, Bedrock, Vertex AI, and DIAL-to-DIAL adapters under `/compat/<adapter>` with their variables unchanged, so an adapter release can also change `1.configuration.md` here. |
| `5.openai-adapter/`, `6.bedrock-adapter/`, `7.vertex-ai-adapter/` | `ai-dial-adapter-openai`, `-bedrock`, `-vertexai` | `.env.example`, `aidial_adapter_<NAME>/utils/env.py`, OpenAI also `configuration/app_config.py`, `Dockerfile` | each overview opens with a `:::warning` that the standalone adapters will be deprecated in favor of Model Provider. Older lines get patch releases after newer ones (OpenAI 0.45.3 after 0.46.1). |
| `8.quick-apps/` | `ai-dial-quickapps-backend`, `ai-dial-quickapps-frontend` | backend: `src/quickapp/**/*settings*.py`, `CONFIGURATION.md`, `docs/*.md`, `docs/generated-app-schema.json` (the manifest schema), `config/predefined/` (templates); frontend: `.env.template`, `docs/quickapps-migration-guide.md` | manifest fields in `2.manifest/`; Stable and Preview lists in `1.capabilities/0.index.md`; minimum Core versions in `3.configuration/3.dial-core-and-chat.md`; code interpreter variables (`PY_INTERPRETER_*`) on the backend page. |
| `9.admin/` | `ai-dial-admin-frontend`, `ai-dial-admin-backend` | frontend: `.env.template`, `docs/INFRA-CHANGELOG.md`, `docs/MENU-DOCUMENTATION.md`, `docs/org-units-access.md`; backend: `docs/configuration.md`, `docs/INFRA-CHANGELOG.md`, `src/main/resources/application.y*ml` | screens belong to Administering DIAL (out of scope). `2.configuration/1.frontend.md` lists the variables that connect the optional services. |
| `10.evaluations/` | `ai-dial-admin-evaluation-framework-backend`, `ai-dial-admin-evaluation-metrics` | backend: `src/main/resources/application.yml`, `docs/configuration.md`; metrics: `app_config.py` | one configuration page per component. |
| `11.deployment-manager/` | `ai-dial-admin-deployment-manager-backend`, `ai-dial-deployment-manager-mcp-proxy` (tags `vX.Y.Z`) | backend: `src/main/resources/application.yml`, `docs/configuration.md`, `docs/upgrade-plans/<VERSION>.md`; proxy: `alpine/Dockerfile`, `debian/Dockerfile` | the Admin chart's Deployment Manager values are on `12.helm/1.configuration/4.dial-admin.md`. |
| `12.helm/` | `ai-dial-helm` (tags `<CHART>-X.Y.Z` for `dial`, `dial-core`, `dial-extension`, `dial-admin`) | `charts/<CHART>/Chart.yaml` (dependencies, aliases, `appVersion`), `values.yaml`, `templates/` (what renders), `README.md` (upgrade notes) | one page per chart; compute each chart's window with `--chart`. The image tags the `dial` chart pins are chart facts: update them in a Helm sync, never in a Core or Chat sync. |
| `13.openapi-to-mcp/` | `ai-dial-openapi-to-mcp` | `CONFIGURATION.md`, `CHANGELOG.md`, `src/dial_openapi_to_mcp/*.py`, `docs/*.md`, `.env.template`, `Dockerfile` | release notes can be one "sync development into release" PR; read the tag diff. |
| `14.rag/` | `ai-dial-rag` | `aidial_rag/app_config.py`, `.env.example`, `docs/api.md`, `Dockerfile`, `poetry.lock` (the DIAL SDK it locks) | the overview states platform-release pins. |
| `15.generic-rag/` | `ai-dial-generic-rag-backend`, `ai-dial-generic-rag-frontend` | backend: `src/generic_rag/app/settings.py`, `.env.template`, `Dockerfile`; frontend: `.env.template` | channel configuration, channel API, and MCP server pages cover the backend. |
| `16.app-controller/` | `ai-dial-app-controller` | `src/main/resources/application.yaml`, `src/main/java/com/epam/aidial/config/AppConfiguration.java`, controllers | builds Code Apps with App Builder Python and runs Code Interpreter sessions. |
| `17.app-builder-python/` | `ai-dial-app-builder-python` | `aidial_app_builder_python/__main__.py`, `validation/`, `Dockerfile`, `entrypoint.sh`, `templates/` | selected by the App Controller's build Job. |
| `18.code-interpreter/` | `ai-dial-code-interpreter` | `aidial_code_interpreter/env.py`, `app.py`, `Dockerfile` | session settings live in DIAL Core (`1.core/1.configuration/2.settings/8.applications-and-code-interpreter.md`). |
| `19.deep-research/` | `ai-dial-deep-research-backend` | `src/dial_deep_research/settings.py`, `.env.example`, `dial_conf/core/*-template.json`, `Dockerfile` | application properties page documents the Core application schema. |
| `20.analytics/` | `ai-dial-analytics` | `src/main/resources/application.yml`, `docs/configuration.md`, `docs/release-*-upgrade.md` | upgrades pair with the Enrichment Runner when their contract version changes. |
| `21.analytics-enrichment-runner/` | `ai-dial-analytics-enrichment-runner` | `src/main/resources/application.yml`, `docs/configuration.md`, `docs/release-*-upgrade.md` | see Analytics. |
| `22.log-parser/` | `ai-dial-log-parser` | `src/aidial_log_parser/parse_logs.py`, `Dockerfile`, `pyproject.toml` | a batch job; no port. |
| `23.scheduler/` | `ai-dial-scheduler` (tags only, no GitHub releases) | `src/lib/settings.py`, `entrypoint.sh`, `documentation/deployment/` | Chat's scheduled-task variables are on `2.chat/1.configuration/3.features-and-ui.md`. |
| `24.mcp-gateway/` | `ai-dial-mcp-gateway` | `gateway/settings.py`, `docs/pod-contract.md`, `docs/gateway-configuration.md`, `docker-compose.yml`, `Dockerfile` | its configuration page also pins DIAL Core, Chat, and Admin Frontend sources. |

For pages that pin source links, the links name the exact files; list them with `pinned_refs.py` from the `docs-services-release-sync:release-research` skill.

## The `:::info` block

Each overview has one `:::info` block right after the opening paragraph. `:::info` is used for nothing else; other admonitions follow `docs-services-release-sync:style`.

- One repository: a list of `[Repository](…)`, `[Releases](…/releases)`, and `[Docker Hub image tags](https://hub.docker.com/r/epam/<IMAGE>/tags)`, with GHCR package links for GHCR images and `https://charts.dialx.ai` for Helm.
- Several repositories: a `| Component | Repository | Releases | Image tags |` table.

Change it only when a release renames an image, adds a component image, or moves a repository.

## Versions on service pages

Readers need the current behavior, not a changelog. Versions stay out of visible text, and pinned links carry the release.

**Never add** "checked against <VERSION>", a "Version scope" section, "new in", "since <VERSION>", "This reference covers <VERSION>", or a version in an image row.

**Allowed when the reader acts on it,** in one sentence or an existing table:
- a compatibility boundary: "needs DIAL Core 0.50.0 or later", or a row in a minimum-version table;
- a breaking change or migration step tied to a version;
- Helm chart versions, and the image tags a chart pins;
- platform-release pins, where the overview already states them.

**Existing statements that a new target makes stale:**

| Existing text | What to do |
|---|---|
| "Defaults below are checked against 0.2.1: …", "Everything here is checked against DIAL RAG 0.43.0." | Remove the version from the sentence and keep its pinned links. Delete the sentence when nothing remains. Keep the heading, since removing it changes anchors. |
| "In 0.2.1, <limitation>." and "The `development` branch adds X. No release has them yet." | Re-check at the target. If fixed or released, update the page: add the rows, drop the caveat. If still true, state it as current behavior without the version. |
| "The DIAL 1.47 and 1.48 platform releases pin 0.43.0." | Update from the platform upgrade notes. If none covers the target, leave the sentence and flag it. |
| The service's own image tag in an example or table, such as `epam/ai-dial-rag:0.43.0` | Update it to the target. New examples use `<VERSION>`, with the sentence "Replace `<VERSION>` with an image tag from Docker Hub." |
| Versions of other components in examples | Keep them, unless the target requires a newer one; then update and cite the requirement. |
| A link pinned to an older tag | Keep it while the claim it supports still holds at the target. A changed or new claim cites the target tag. |
| A link to `development` or `main` | Leave it; it is deliberate. Re-check its sentence if the sentence says something is unreleased. |

`pinned_refs.py` lists every such statement, image tag, and pinned link in a folder.

## `last_verified`

- After a sync, every page in the synced folder gets today's date (`YYYY-MM-DD`), because every page was checked against the target.
- When only some repositories of a multi-repository folder were synced, change the date only on pages that cover nothing but those repositories. The overview and the configuration overview of such a folder usually cover all of them, so they keep their date.
- Related pages outside the folder never change `last_verified`; only the part about the service was checked.
- Leave every other frontmatter field as it is.

## Couplings that cause wrong edits

- The `dial` Helm chart pins Core, Chat, Themes, and adapter image tags. A Core or Chat sync never changes `12.helm/`. A Helm sync does, from `charts/dial/values.yaml` at the chart tag.
- Model Provider bundles the adapters. An adapter release that adds or changes a variable also touches `4.model-provider/1.configuration.md` when that page lists the variable.
- Code Interpreter settings are split across its own page, Core's `8.applications-and-code-interpreter.md`, the App Controller, and the Quick Apps backend.
- Quick Apps features that need a newer DIAL Core add a row to the minimum-version table in `3.configuration/3.dial-core-and-chat.md`.
- Analytics and the Enrichment Runner upgrade together when their contract version changes. Each overview says so; keep both true.
- The Services landing table (`0.index.md`) has one purpose line per service. Change it only when the service's purpose changes.
