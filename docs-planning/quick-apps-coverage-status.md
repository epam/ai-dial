---
title: "Quick Apps documentation coverage"
type: reference
persona: app-dev
component: apps
last_verified: 2026-08-10
owner: "@dial-docs-team"
---

# Quick Apps documentation coverage

> **Historical.** This tracker predates the 2026-11-04 restructure and its links no longer resolve. Quick Apps builder pages are now in `docs_v2/3.building-with-dial/1.apps/2.quick-apps/` (overview, tutorial, API how-to) and `docs_v2/3.building-with-dial/2.toolsets/`. The service reference (capabilities, manifest, configuration, ChatHub, releases) is in `docs_v2/6.services/7.quick-apps/`.

This page tracks what Quick Apps documentation exists and what is still missing or planned.

## Quick App 2.0

| Topic | Status | Location | Notes |
|---|---|---|---|
| Overview / concepts | Done | [What are Quick Apps](./index) | Covers both types |
| Create via UI | Done | [Create in DIAL Chat](../../../7.chat-user-guide/3.catalog/2.agents.md) | Developer summary; links to the Chat User Guide's [Build a Quick App](../../../7.chat-user-guide/3.catalog/2.agents.md#build-a-quick-app) for the full walkthrough with screenshots |
| Create via API | Done | [Create via API](./2.create-via-api.md) | Full CRUD with curl examples |
| Create via config.json | Done | [Create via config.json](../../../6.services/7.quick-apps/3.configuration/3.dial-core-and-chat.md) | Complete config.json with schema + app + roles |
| Add tools and agents | Done | [Add tools and agents](../../../6.services/7.quick-apps/2.manifest/2.tool-sets.md) | All toolset types |
| Tutorial: agent loop (UI) | Done | [Tutorial (UI)](./1.tutorial-build-an-agent.md) | UI-based Research Assistant build |
| Tutorial: agent loop (API) | Done | [Tutorial (API)](./1.tutorial-build-an-agent.md) | API-based Research Assistant build |
| Tutorial: agent loop (config.json) | Done | [Tutorial (config.json)](./1.tutorial-build-an-agent.md) | config.json-based Research Assistant build |
| Examples | Done | [Examples](../../../6.services/7.quick-apps/2.manifest/4.examples.md) | Copy-pasteable configs |
| Toolsets: overview | Done | [What is a Toolset](../../2.toolsets/0.index.md) | |
| Toolsets: registration | Done | [Define and register](../../../6.services/1.core/1.configuration/11.toolsets.md) | UI + config.json paths |
| Toolsets: MCP integration | Done | [MCP server integration](../../2.toolsets/1.mcp-server-integration.md) | Transport + auth methods |
| Toolsets: sharing | Done | [Sharing and permissions](../../../7.chat-user-guide/5.sharing-and-publishing.md) | Full lifecycle |
| Toolsets: reference | Done | [Configuration reference](../../../6.services/7.quick-apps/2.manifest/0.index.md) | Full JSON schema |
| Toolsets: examples | Done | [Toolset examples](../../../6.services/7.quick-apps/2.manifest/4.examples.md) | Copy-pasteable configs |
| Installation (Helm, env vars) | Missing | — | Belongs under Operating DIAL; must document the [ai-dial-quickapps-backend](https://github.com/epam/ai-dial-quickapps-backend) service. |
| Troubleshooting | Missing | — | Common errors, agent loop debugging, tool call failures |
| RAG how-to | Missing | — | Dedicated guide for grounding answers with the predefined `dial_rag` tool and document contexts |
| Agent loop iteration tuning | Missing | — | When to adjust `max_iterations`, what happens at the limit |
| Catalog publishing (apps) | Missing | — | Toolset publishing is documented, Quick App publishing is not |
| Conversation mode explained | Missing | — | `conversation_mode.resumable` behavior (replaces the deprecated `propagate_history`) for DIAL deployment tools |
