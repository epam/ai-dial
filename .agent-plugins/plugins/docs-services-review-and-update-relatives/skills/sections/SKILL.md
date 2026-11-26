---
name: sections
description: Use when reading or editing pages in Understand DIAL, Connecting to DIAL, Building with DIAL, or Operating DIAL (docs_v2/2.understand-dial, 3.connecting-to-dial, 4.building-with-dial, 5.operating-dial) of the epam/ai-dial repository - what each section is for and who reads it, its page types and templates, its admonition and diagram conventions, which service and guide pages each topic depends on, the hub pages that list services, and the version statements most likely to go stale.
---

# The four guide sections

These sections explain, connect, build, and operate. The reference lives elsewhere: every setting, default, endpoint, and table belongs to the service pages in `docs_v2/7.services/`, and every Admin or Chat screen to the user guides in `6.administering-dial-new/` and `8.chat-user-guide/`. A guide states what a reader needs to understand or do, then links the reference. Keep it that way when you edit.

Counts below were taken on 2026-11-25.

## What each section is

| Section | Pages | Readers (`persona`) | Page types | Holds |
|---|---|---|---|---|
| `2.understand-dial/` | 33 | architects, evaluators, all | explanation, landing; reference for the glossary, the DIAL stack, and the access-control reference | what DIAL is (`1.what-is-dial.md`), foundations (concept map, glossary), one page per capability, architecture, security and governance |
| `3.connecting-to-dial/` | 16 | app developers | tutorials and how-tos | client integrations: agentic tools (Claude Code, Codex, GitHub Copilot, OpenCode, OpenClaw, Claude Desktop, the Claude M365 plugin), MS Teams and MS Copilot, Excel, n8n |
| `4.building-with-dial/` | 67 | app developers | tutorials, how-tos, explanations, references | apps (Quick, Code, Custom, Generic RAG), Toolsets, interceptors, adapters, the SDK reference, chat customization, UI libraries with per-release pages, resource APIs, prompt caching |
| `5.operating-dial/` | 47 | platform engineers | how-tos, tutorials, explanations | local Docker Compose setups, Helm deployment per cloud plus the Admin and Quick Apps installs, model deployment, authentication and the identity-provider guides, observability, production readiness, troubleshooting |

`3.connecting-to-dial/` links no service page at all: it relies on the Unified API and on each client's own documentation. Its contact points with the sources are DIAL Core endpoints (`/anthropic`, `/openai`, the Responses API), their minimum Core versions, and authentication headers.

## Conventions by section

| | Understand DIAL | Connecting to DIAL | Building with DIAL | Operating DIAL |
|---|---|---|---|---|
| Admonitions | `:::note` and `:::warning` (19); `> **Note**:` on a few pages (6) | bold label and blockquote (12); `:::` only on the Claude Code page | mixed (9 `:::`, 8 bold): follow the page, then its folder | `:::` (39); bold label (7) |
| Diagrams | Mermaid on most pages (30), with the palette's `classDef`s on 19 of them | none | 2 | 4, without `classDef`s |
| Opening paragraph | what the page explains and for whom: "It is for architects who have read [What is DIAL](…)." | "In this tutorial you …" and the reader it assumes | "This guide …", "In this tutorial you …" | "This guide shows how to …" and what it assumes |
| Body | "Why …", then one section per mechanism, bullets with a bold lead (`- **Access by role.** …`), and a closing "What to plan for" or "Access boundaries to decide" | Prerequisites, What you'll build, `## Step N: …` with a `**Verify:**` line, Good to know | Prerequisites, What you will build, `## Step N: …`, `**Verify:**`, Result, What you learned | Prerequisites, `## Step N: …`, `**Verify:**`, Result, What you learned |
| Links into `7.services/` | 82 | 0 | 114 | 193 |
| Links into the Admin guide / the Chat guide | 22 / 6 | 0 / 0 | 26 / 14 | 7 / 0 |

Every page except a `0.index.md` ends with `## Further reading`. Landings (`0.index.md`) open with what the section covers, then list their pages under `## In this section`, grouped by `###` when the section is large.

The phrasing varies by section ("What you'll build" against "What you will build"). Keep the page's form; never normalize it.

## Topic map: which guide pages depend on which sources

Read this when a source changed and the impact report shows no trigger: a guide that never mentions a feature can still be the page whose reader needs it. Each row lists the guide pages that link the source today.

| Source | Guide pages |
|---|---|
| Core access, roles, keys, identity providers (`7.services/1.core/…/7.access.md`, `12.roles.md`, `13.keys.md`, `2.settings/4.identity-providers.md`) | `2.understand-dial/5.security-and-governance/*`; `5.operating-dial/5.auth-and-access-control/*`, including the seven identity-provider guides |
| Core usage limits and spending (`14.global-settings.md`, `12.roles.md#limits`) | `2.understand-dial/5.security-and-governance/5.usage-limits-and-cost-control.md`; `5.operating-dial/5.auth-and-access-control/3.roles-and-rate-limits.md`; `5.operating-dial/7.production-readiness/6.cost-control.md` |
| Core models, upstreams, load balancing, routes, aliases (`4.models.md`, `5.load-balancing.md`, `10.routes.md`) | `2.understand-dial/3.capabilities/1.model-access-and-ai-apis.md`, `3.load-balancing-and-failover.md`; `2.understand-dial/4.architecture/2.request-flow.md`, `7.ai-api-overview.md`; `4.building-with-dial/4.adapters/*`; `5.operating-dial/3.model-deployment/*` |
| Core Toolsets and Toolset security (`11.toolsets.md`, `2.settings/10.toolsets-security.md`) | `2.understand-dial/3.capabilities/6.tools-and-enterprise-data.md`, `8.coding-agents-and-harnesses.md`; `4.building-with-dial/2.toolsets/*`; `4.building-with-dial/1.apps/2.quick-apps/*` |
| Core storage, Valkey, encryption, resources (`2.settings/2.storage.md`, `3.valkey.md`, `5.encryption.md`, `6.resources.md`) | `2.understand-dial/4.architecture/4.state-and-data-lifecycle.md`, `5.scalability-and-performance.md`, `9.dial-stack.md`; `5.operating-dial/2.cloud-deployment/*`; `5.operating-dial/7.production-readiness/1.high-availability.md`, `3.secrets-management.md`, `4.backup-and-restore.md`, `7.security-hardening.md` |
| Core applications, per-request keys, interceptors (`7.applications.md`, `9.interceptors.md`) | `4.building-with-dial/7.working-with-dial-resources/*`; `4.building-with-dial/3.interceptors/*`; `4.building-with-dial/1.apps/4.custom-apps/5.register-app.md` |
| Core analytics and tracing, and the observability services (Analytics, Enrichment Runner, Log Parser) | `2.understand-dial/3.capabilities/5.analytics-and-observability.md`; `5.operating-dial/6.observability/*`; `5.operating-dial/7.production-readiness/6.cost-control.md` |
| DIAL Chat and Chat Themes | `4.building-with-dial/5.developer-tools/2.chat-customization/*`; the identity-provider guides (Chat's side of sign-in) |
| DIAL Model Provider and the adapters | `4.building-with-dial/4.adapters/*`; `5.operating-dial/3.model-deployment/*`; the AWS, Azure, and GCP Helm guides; `5.operating-dial/1.local-setup/2.…ollama.md`, `4.…azure-model.md`; the glossary |
| DIAL Quick Apps | `4.building-with-dial/1.apps/2.quick-apps/*`; `4.building-with-dial/2.toolsets/2.rest-api-as-mcp-tools.md`; `5.operating-dial/2.cloud-deployment/7.quick-apps-installation.md` |
| DIAL Admin, Deployment Manager, Evaluations (services) | `5.operating-dial/2.cloud-deployment/8.admin-installation.md`; `5.operating-dial/6.observability/0.index.md`–`2.configure-metrics.md`; `2.understand-dial/3.capabilities/9.evaluations.md` |
| DIAL Helm | `5.operating-dial/2.cloud-deployment/*`; `5.operating-dial/3.model-deployment/*` |
| OpenAPI to MCP, Generic RAG | `2.understand-dial/3.capabilities/6.tools-and-enterprise-data.md`; `4.building-with-dial/2.toolsets/2.rest-api-as-mcp-tools.md`; `4.building-with-dial/1.apps/5.generic-rag-document-qa.md` |
| App Controller, App Builder Python, Code Interpreter | `2.understand-dial/4.architecture/5.scalability-and-performance.md`, `6.application-server.md`; `4.building-with-dial/1.apps/3.code-apps/*` |
| DIAL Scheduler | `2.understand-dial/3.capabilities/7.agentic-platform.md`; `2.understand-dial/4.architecture/1.architecture-highlights.md`, `9.dial-stack.md`; the glossary |
| DIAL MCP Gateway | `2.understand-dial/3.capabilities/8.coding-agents-and-harnesses.md` |
| Admin guide (`6.administering-dial-new/`) | AI Gateway pages from the Building pages that configure the same entity; Governance pages from Security and governance and the auth how-tos; Analytics pages from observability and cost control; Evaluation pages from the Evaluations capability |
| Chat user guide (`8.chat-user-guide/`) | `2.understand-dial/3.capabilities/7.agentic-platform.md`, `10.collaboration-and-sharing.md`; `4.building-with-dial/1.apps/*`; `4.building-with-dial/2.toolsets/1.mcp-server-integration.md` |
| Release documents (`docs/releases/<N>/`) | `5.operating-dial/7.production-readiness/5.upgrade-procedure.md` (links them on GitHub); the installation guides (versions); the capability pages (features) |

`impact.py` computes the same link graph at run time, so a page added after this table was written still shows up.

## Hub pages

A hub lists the members of a set. When the set gains or loses a member, a complete hub needs one entry and a selective hub doesn't.

| Page | Lists | Complete? |
|---|---|---|
| `docs_v2/7.services/0.index.md` (Services landing; a source, not a target) | every service, with a one-line purpose | yes; its wording is the description to reuse |
| `docs_v2/1.overview.md` (out of scope) | every service but DIAL MCP Gateway | yes; report a gap under "Needs review" |
| `2.understand-dial/2.foundations/2.glossary.md` | 13 of 24 services, with a "Documentation: … Repository: …" line each | selective |
| `2.understand-dial/4.architecture/1.architecture-highlights.md` | 11 of 24 services, under "Optional services" groups | selective |
| `2.understand-dial/4.architecture/9.dial-stack.md` | technologies of 7 services, and backing infrastructure | selective |
| `2.understand-dial/3.capabilities/0.index.md` | every capability page | yes, for pages in that folder |
| `4.building-with-dial/4.adapters/2.supported-providers.md` | the adapter–provider mapping and models by adapter (OpenAI, Bedrock, Vertex AI) | compare it with the Model Provider and adapter pages before you add a row |
| `5.operating-dial/2.cloud-deployment/0.index.md` | every deployment guide ("Choosing a deployment path") | yes, for pages in that folder |
| `5.operating-dial/5.auth-and-access-control/4.sso-idp/0.index.md` | every identity-provider guide | yes, for pages in that folder |

Hubs that list pages of their own folder change only when this task adds or removes a page, which is rare.

## Version statements that go stale

Guides may name versions where a reader acts on them: a minimum version ("DIAL Core 0.46.0 or later"), a pinned chart or image in an install step, a known issue tied to a release. These are the statements a release makes false. The ones on 2026-11-25:

| Page | Statement | Source of truth |
|---|---|---|
| `3.connecting-to-dial/1.agentic-tools/1.claude-code.md`, `6.claude-desktop-app.md` | `/anthropic` from DIAL Core 0.46.0; `GET /anthropic/v1/models` from 0.48.0 | Core service pages |
| `2.understand-dial/3.capabilities/1.model-access-and-ai-apis.md`, the glossary | Responses API from v0.45; aliases from DIAL Core 0.50.0 | Core service pages |
| `4.building-with-dial/3.interceptors/2.sdk-integration-reference.md` | a field "Available since **DIAL Core 0.43.0**" | Core service pages |
| `4.building-with-dial/2.toolsets/2.rest-api-as-mcp-tools.md` | "In bridge 0.2.1, OAuth external services fail …" | OpenAPI to MCP pages |
| `5.operating-dial/2.cloud-deployment/7.quick-apps-installation.md` | DIAL Core 0.41.0 or higher | Quick Apps pages |
| `5.operating-dial/2.cloud-deployment/8.admin-installation.md` | chart `dial-admin` 0.20.0, images `0.22.0`, `0.22.1`, an override to `0.22.5`, `--version 0.20.0` | Helm `4.dial-admin.md` |
| the cloud guides | Kubernetes 1.23 or 1.24, Helm 3.8.0 or higher | Helm overview |
| `5.operating-dial/1.local-setup/5.dial-to-dial-adapter.md` | `epam/ai-dial-adapter-dial:0.14.0` to pin a release | release Versions lists |
| Custom App, interceptor, adapter, and chat-customization tutorials, and `4.…azure-model.md` | pinned images such as `ai-dial-core:0.25.1`, `ai-dial-chat:0.26.0` in Compose files | release Versions lists; tested combinations |
| `4.building-with-dial/5.developer-tools/3.ui-libraries/*` | "Everything below is checked against UI Kit 0.16.0", compatibility tables naming Chat 1.2.22 and Admin 0.22.5 | the library repositories, outside this task's sources |

The UI-library pages work like service pages for libraries whose repositories this task doesn't read. Change them only when a docs_v2 page or a release document states the new fact; otherwise report the gap.

## Names the guides use

`1.what-is-dial.md` and the capability pages use product names from the platform's positioning, such as DIAL Gateway ("DIAL Core, the service behind DIAL Gateway"), DIAL Grid, and DIAL Eval. Use the names a page already uses, and never introduce positioning terms from release notes; positioning is an editorial decision.
