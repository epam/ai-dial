---
title: "When to use which app type"
type: explanation
persona: app-dev
component: apps
last_verified: 2026-05-08
owner: "@dial-docs-team"
---

# When to use which app type

DIAL offers four app types, each designed for a different development model and set of trade-offs. This page helps you choose the right one for your use case.

## Decision matrix

| Criterion | Custom App | Quick App | Code App | Mind Map Studio |
|---|---|---|---|---|
| **Development** | Python + DIAL SDK | No code — configuration and UI | Python in browser editor | No code — UI wizard |
| **Hosting** | Self-managed (Docker, Kubernetes) | Platform-managed | Platform-managed | Platform-managed |
| **Modification** | Container rebuild and redeploy | API call or UI edit | Edit in browser, redeploy | UI edit |
| **External network access** | Full (your infrastructure) | Via web API Tool Sets | None | Source URLs only (at creation time) |
| **State management** | Any (your databases, storage) | DIAL APIs only | DIAL APIs only | Source documents |
| **Scaling** | Manual (your infrastructure) | Automatic | Automatic | Automatic |
| **Security isolation** | Your responsibility | Platform-managed | Strict — no internet, encrypted, isolated | Platform-managed |
| **Best for** | Production services, complex logic, external integrations | Rapid prototyping, tool composition, RAG workflows | POCs, experiments, single-purpose tools | Knowledge exploration, document analysis |

## Choosing by use case

**"I need a production-grade service with custom dependencies and external API calls."**
Use a **Custom App**. You control the container, dependencies, and network. Deploy alongside DIAL Core in Docker Compose or Kubernetes.

**"I want to compose a workflow from existing models, apps, and external APIs — without writing code."**
Use a **Quick App**. Combine a language model with system instructions and Tool Sets (web APIs, MCP servers, other DIAL apps) to create a workflow in minutes.

**"I want to quickly prototype something in Python without managing infrastructure."**
Use a **Code App**. Write Python directly in DIAL Chat, deploy with one click. The platform handles hosting and scaling. Be aware of the security restrictions: no internet access and a limited set of pre-approved libraries.

**"I want to create an interactive knowledge graph from documents or URLs."**
Use **Mind Map Studio**. Upload PDFs or provide URLs, and Mind Map Studio generates a navigable graph grounded in your sources.

## Combining app types

App types are not mutually exclusive. Because all DIAL apps speak the same Unified API:

- A **Quick App** can call a **Custom App** as a tool, combining no-code orchestration with custom business logic.
- A **Quick App** can use multiple language models as tools, routing between them based on conditions.
- A **Custom App** can call other apps and models through the Unified API, enabling multi-agent workflows.

A common pattern is to prototype with a Quick App, then move performance-critical logic into a Custom App while keeping the Quick App as the orchestration layer.

## Next steps

- [Custom Apps: architecture and lifecycle](custom-apps/index) — build and deploy a containerized app
- [What are Quick Apps](quick-apps/index) — no-code orchestration with models and tools
- [Code Apps overview](code-apps/index) — write and deploy Python in the browser
- [Mind Map Studio overview](mind-map-studio/index) — knowledge graphs from documents
