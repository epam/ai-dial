---
title: "Quick Apps documentation coverage"
type: reference
persona: app-dev
component: apps
last_verified: 2026-08-10
owner: "@dial-docs-team"
---

# Quick Apps documentation coverage

This page tracks what Quick Apps documentation exists and what is still missing or planned.

## Quick App 2.0

| Topic | Status | Location | Notes |
|---|---|---|---|
| Overview / concepts | Done | [What are Quick Apps](./index) | Quick App 2.0 concepts, tools, and configuration model |
| Create via UI | Done | [Create in DIAL Chat](./quick-app-2/create-via-ui) | 6-step wizard with screenshots |
| Create via API | Done | [Create via API](./quick-app-2/create-via-api) | Full CRUD with curl examples |
| Create via config.json | Done | [Create via config.json](./quick-app-2/create-via-config) | Complete config.json with schema + app + roles |
| Add tools and agents | Done | [Add tools and agents](./quick-app-2/working-with-tools-and-agents) | All tool set types |
| Tutorial: agent loop (UI) | Done | [Tutorial (UI)](./quick-app-2/tutorial-agent-loop-ui) | UI-based Research Assistant build |
| Tutorial: agent loop (API) | Done | [Tutorial (API)](./quick-app-2/tutorial-agent-loop-api) | API-based Research Assistant build |
| Tutorial: agent loop (config.json) | Done | [Tutorial (config.json)](./quick-app-2/tutorial-agent-loop-config) | config.json-based Research Assistant build |
| Examples | Done | [Examples](./quick-app-2/examples) | Copy-pasteable configs |
| Tool Sets: overview | Done | [What is a Tool Set](./quick-app-2/tool-sets/index) | |
| Tool Sets: registration | Done | [Define and register](./quick-app-2/tool-sets/define-and-register) | UI + config.json paths |
| Tool Sets: MCP integration | Done | [MCP server integration](./quick-app-2/tool-sets/mcp-server-integration) | Transport + auth methods |
| Tool Sets: sharing | Done | [Sharing and permissions](./quick-app-2/tool-sets/sharing-and-permissions) | Full lifecycle |
| Tool Sets: reference | Done | [Configuration reference](./quick-app-2/tool-sets/reference) | Full JSON schema |
| Tool Sets: examples | Done | [Tool Set examples](./quick-app-2/tool-sets/examples) | Copy-pasteable configs |
| Installation (Helm, env vars) | Missing | — | Belongs under Operating DIAL; must document the [ai-dial-quickapps-backend](https://github.com/epam/ai-dial-quickapps-backend) service. |
| Troubleshooting | Missing | — | Common errors, agent loop debugging, tool call failures |
| RAG how-to | Missing | — | Dedicated guide for grounding answers with the predefined `dial_rag` tool and document contexts |
| Agent loop iteration tuning | Missing | — | When to adjust `max_iterations`, what happens at the limit |
| Marketplace publishing (apps) | Missing | — | Tool Set publishing is documented, Quick App publishing is not |
| Conversation mode explained | Missing | — | `conversation_mode.resumable` behavior (replaces the deprecated `propagate_history`) for DIAL deployment tools |
