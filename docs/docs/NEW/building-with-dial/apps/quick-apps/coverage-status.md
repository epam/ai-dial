---
title: "Quick Apps documentation coverage"
type: reference
persona: app-dev
component: apps
last_verified: 2026-05-12
owner: "@dial-docs-team"
---

# Quick Apps documentation coverage

This page tracks what Quick Apps documentation exists and what is still missing or planned.

## Quick App 2.0

| Topic | Status | Location | Notes |
|---|---|---|---|
| Overview / concepts | Done | [What are Quick Apps](./index) | Covers both types |
| Create via UI | Done | [Create in DIAL Chat](./quick-app-2/create-via-ui) | 6-step wizard with screenshots |
| Create via API | Done | [Create via API](./quick-app-2/create-via-api) | Full CRUD with curl examples |
| Create via config.json | Done | [Create via config.json](./quick-app-2/create-via-config) | Complete config.json with schema + app + roles |
| Add tools and agents | Done | [Add tools and agents](./quick-app-2/working-with-tools-and-agents) | All 6 tool set types |
| Tutorial: agent loop | Done | [Tutorial](./quick-app-2/tutorial-agent-loop) | End-to-end Research Assistant build |
| Examples | Done | [Examples](./quick-app-2/examples) | 5 copy-pasteable configs |
| Tool Sets: overview | Done | [What is a Tool Set](./quick-app-2/tool-sets/index) | |
| Tool Sets: registration | Done | [Define and register](./quick-app-2/tool-sets/define-and-register) | UI + config.json paths |
| Tool Sets: MCP integration | Done | [MCP server integration](./quick-app-2/tool-sets/mcp-server-integration) | Transport + 5 auth methods |
| Tool Sets: sharing | Done | [Sharing and permissions](./quick-app-2/tool-sets/sharing-and-permissions) | Full lifecycle |
| Tool Sets: reference | Done | [Configuration reference](./quick-app-2/tool-sets/reference) | Full JSON schema |
| Tool Sets: examples | Done | [Tool Set examples](./quick-app-2/tool-sets/examples) | 5 configs |
| Installation (Helm, env vars) | Missing | — | Content exists in old `tutorials/devops/deployment/quick_apps_deployment`. Belongs under Operating DIAL. |
| Troubleshooting | Missing | — | Common errors, agent loop debugging, tool call failures |
| RAG setup how-to | Missing | — | Dedicated guide for document grounding with contexts |
| Agent loop iteration tuning | Missing | — | When to adjust `max_iterations`, what happens at the limit |
| Marketplace publishing (apps) | Missing | — | Tool Set publishing is documented, Quick App publishing is not |
| Variable substitution guide | Missing | — | `{{variable}}` syntax in system prompts |
| Content propagation explained | Missing | — | `propagate_history` behavior for DIAL deployment tools |

## Quick App (original)

| Topic | Status | Location | Notes |
|---|---|---|---|
| Create and configure (all methods) | Done | [Create and configure](./quick-app-original/create-and-configure) | UI, API, config.json in one page |
| Configuration reference | Done | [Configuration reference](./quick-app-original/reference) | Full schema with all field types |
| Migrate to Quick App 2.0 | Done | [Migrate to 2.0](./quick-app-original/migrate-to-2) | Field mapping + before/after examples |
| Installation (Helm, env vars) | Missing | — | Original executor deployment. Content in old deployment guide. |
| Client tools guide | Missing | — | Dedicated how-to for `client_toolset` configuration |
| Condition-based tool selection | Missing | — | How to use regex conditions in `applications_as_tools` |
