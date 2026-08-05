---
title: "Glossary"
type: reference
persona: all
component: platform
last_verified: 2026-04-27
owner: "@dial-docs-team"
---

# Glossary

This glossary defines the canonical terms used throughout DIAL documentation. Each term has one definition. When a term appears for the first time on a page, it should link here.

If you encounter a synonym or variant not listed below, use the canonical term instead. See also the [concept map](#concept-map) at the end of this page for a visual overview of how terms relate.

---

## A

### Adapter

A DIAL application that translates an external AI provider's API into the DIAL [Unified API](#unified-api). Adapters allow DIAL to communicate with models from providers such as Azure OpenAI, AWS Bedrock, and Google Vertex AI through a single, consistent interface. Each adapter runs in its own container.

DIAL ships three adapters: the [OpenAI Adapter](https://github.com/epam/ai-dial-adapter-openai), [Bedrock Adapter](https://github.com/epam/ai-dial-adapter-bedrock), and [Vertex AI Adapter](https://github.com/epam/ai-dial-adapter-vertexai). Organizations can build custom adapters using the [DIAL SDK](#dial-sdk).

Not to be confused with: [Application](#application) (generic), [Interceptor](#interceptor).

### Addon

**Deprecated.** A legacy extension mechanism based on the ChatGPT plugin protocol. The Addon concept has been abandoned and the [DIAL Assistant](#assistant-deprecated) repository that implemented it is archived. Do not use in new documentation. Modern equivalents are [Application](#application), [Interceptor](#interceptor), and [Tool Set](#tool-set).

### Agent

An umbrella term for any conversational entity a user can interact with in DIAL — including language models and [applications](#application). Agents are listed in the [Marketplace](#marketplace) and can be used as building blocks in multi-agent workflows.

See also: [Agent Builder](#agent-builder).

### Agent Builder

The canonical name for an application runner — a component that enables end users to create customized AI applications from predefined templates without writing code. Agent builders process parameters of a specific [application type](#application-type) and expose a UI wizard for configuration.

Standard agent builders included in DIAL: [Quick Apps](#quick-app), [Code Apps](#code-app), and [Mind Map Studio](#mind-map-studio).

Also known as: "application runner" (technical name in source code), "application builder" (UI label in DIAL Chat), "builder" (DIAL Admin sidebar label). These all refer to the same concept. Use **agent builder** in documentation.

### Analytics Realtime

A DIAL component that processes chat completion logs to extract usage insights and operational metrics without storing sensitive user information. It applies embedding algorithms, clustering, and lightweight models to analyze conversation patterns in real time. Results are stored in time-series databases such as InfluxDB and visualized through platforms such as Grafana.

Repository: [ai-dial-analytics-realtime](https://github.com/epam/ai-dial-analytics-realtime).

### App Builder

A Python-based utility that downloads source code from DIAL file storage and prepares files to build container images for [Code Apps](#code-app). Not to be confused with [agent builder](#agent-builder), which is the no-code UI concept.

Repository: [ai-dial-app-builder](https://github.com/epam/ai-dial-app-builder).

### Application

A first-class extension in DIAL that exposes chat completion or embedding endpoints via the [DIAL SDK](#dial-sdk) and conforms to the [Unified API](#unified-api). Applications can be invoked directly by users or composed as building blocks in multi-agent workflows.

Applications come in two flavors: [schema-rich applications](#schema-rich-application) (defined by a JSON schema and configurable via API or UI) and applications without schemas (logic embedded in application code and container).

Not to be confused with: [Adapter](#adapter) (translates external provider APIs), [Interceptor](#interceptor) (middleware that modifies requests/responses), or the deprecated [Addon](#addon).

### Application Type

A schema-rich template that defines the structure, properties, endpoints, and optional UI wizard for a category of [applications](#application). Application types allow end users to create instances of a specific kind of application without writing code.

Standard application types included in DIAL: [Quick App](#quick-app), [Code App](#code-app), and [Mind Map](#mind-map-studio).

Organizations can define custom application types and register them in [DIAL Core](#dial-core).

### Assistant (deprecated)

**Deprecated.** The DIAL Assistant was an implementation of the ChatGPT plugin protocol. The repository ([ai-dial-assistant](https://github.com/epam/ai-dial-assistant)) is archived. Do not use in new documentation. The modern replacement is [Application](#application).

### Attachment

A file included in or produced by a chat completion request or response. Applications built with the [DIAL SDK](#dial-sdk) can accept and return attachments of various types. Attachments are stored in the DIAL [file storage](#file-storage).

## C

### Code App

An [application type](#application-type) that allows users to develop, deploy, and run Python applications directly in the [DIAL Chat](#dial-chat) UI. Code Apps are useful for rapid prototyping and proof-of-concept work. They run in a secure, isolated environment managed by the DIAL platform and do not have internet access.

See also: [Quick App](#quick-app), [Mind Map Studio](#mind-map-studio).

### Conversation

A dialogue between a user and an [agent](#agent) in DIAL. Each conversation maintains its own context — messages in one conversation are not shared with another. Conversations are stored server-side and accessible from any device. Conversations can be [shared](#sharing), [published](#publication), [replayed](#replay), or [played back](#playback).

### Custom UI

A fully custom user interface that replaces the standard [DIAL Chat](#dial-chat) conversational UI during interactions with a specific [application](#application). Custom UIs can implement non-conversational interfaces. For example, [Mind Map Studio](#mind-map-studio) uses a custom UI to render interactive knowledge graphs.

Custom UIs are defined through the `applicationTypeViewerUrl` property in an [application type](#application-type) schema.

## D

### Deployment (configuration sense)

A named endpoint in [DIAL Core](#dial-core) configuration that exposes a model or [application](#application) to clients. A deployment defines the connection between a logical name (used in API requests) and the actual service endpoint, along with associated [upstreams](#upstream), [interceptors](#interceptor), and access control settings.

Not to be confused with: Helm deployment or Kubernetes deployment (infrastructure sense). When the context is ambiguous, qualify as "DIAL deployment" or "Kubernetes deployment."

### DIAL

**D**eterministic **I**ntegrator of **A**pplications and **L**anguage Models. An open-source, enterprise-grade AI platform by EPAM that provides a unified gateway to language models, application orchestration, access control, observability, and collaboration features. Always written in all-caps: **DIAL**, never "Dial" or "dial."

Licensed under [Apache License, Version 2.0](https://github.com/epam/ai-dial/blob/main/LICENSE).

### DIAL Admin

The administration interface for the DIAL platform, consisting of a frontend ([ai-dial-admin-frontend](https://github.com/epam/ai-dial-admin-frontend)) and backend ([ai-dial-admin-backend](https://github.com/epam/ai-dial-admin-backend)). DIAL Admin provides system administrators with a UI to manage models, applications, deployments, interceptors, MCP servers, access control, publications, and system monitoring.

### DIAL Chat

The default web-based user interface for the DIAL platform. DIAL Chat provides a conversational interface, the [Marketplace](#marketplace), no-code [agent builders](#agent-builder), [collaboration](#sharing) features, and extensibility through [custom UIs](#custom-ui) and [visualizers](#visualizer).

Repository: [ai-dial-chat](https://github.com/epam/ai-dial-chat). Not to be confused with: [DIAL Overlay](#dial-overlay) (an embeddable subset of DIAL Chat).

### DIAL Core

The central Java service and **only mandatory component** of the DIAL platform. DIAL Core exposes the [Unified API](#unified-api) and provides the LLM gateway, [load balancing](#load-balancer), authentication, access control, [interceptor](#interceptor) orchestration, file storage, cost management, and observability.

DIAL Core is headless — it functions without a UI. All other DIAL components are optional.

Repository: [ai-dial-core](https://github.com/epam/ai-dial-core). Not to be confused with: "the backend" (too vague — use **DIAL Core**).

### DIAL Helm

The Helm chart repository for deploying DIAL on Kubernetes. Stable assemblies that combine compatible versions of all DIAL components are published here.

Repository: [ai-dial-helm](https://github.com/epam/ai-dial-helm).

### DIAL Overlay

A library that allows embedding [DIAL Chat](#dial-chat) in external web applications via an iframe event-based protocol. Overlay enables third-party applications to integrate DIAL conversational capabilities without building a custom UI from scratch.

Documentation: [DIAL Chat Overlay](https://github.com/epam/ai-dial-chat/blob/development/libs/overlay/README.md).

### DIAL RAG

A retrieval-augmented generation component for the DIAL platform. DIAL RAG provides document ingestion, chunking, embedding, and retrieval capabilities that can be used as building blocks in RAG applications.

Repository: [ai-dial-rag](https://github.com/epam/ai-dial-rag). See also: [DIAL RAG Eval](#dial-rag-eval).

### DIAL RAG Eval

A library for evaluating RAG pipelines, providing both retrieval metrics (precision, recall, NDCG) and generation metrics (faithfulness, relevance).

Repository: [ai-dial-rag-eval](https://github.com/epam/ai-dial-rag-eval).

### DIAL SDK

A Python framework (Python ≥3.11) for creating [applications](#application) and [adapters](#adapter) for DIAL. Applications and adapters built with the SDK are fully compatible with the [Unified API](#unified-api).

Repository: [ai-dial-sdk](https://github.com/epam/ai-dial-sdk). See also: [Interceptors SDK](#interceptors-sdk).

### DIAL-to-DIAL Adapter

A development utility that allows a local DIAL instance to proxy requests to a remote [DIAL Core](#dial-core). Useful during application development when you want to test against a remote environment without deploying locally.

Repository: [ai-dial-adapter-dial](https://github.com/epam/ai-dial-adapter-dial).

### Dynamic Settings

DIAL Core configuration files that can be reloaded at runtime without restarting the service. Dynamic settings define [deployments](#deployment-configuration-sense), [interceptors](#interceptor), [roles](#role), [routes](#route), API keys, and other operational parameters.

Administrators can trigger a reload via the DIAL Core API or through [DIAL Admin](#dial-admin).

## E

### Embedding API

A DIAL API endpoint that provides unified access to embedding models from any supported provider. The Embedding API normalizes provider-specific embedding interfaces into a single protocol, supporting asymmetric models, instruct models, and multi-modal embeddings.

## F

### File Storage

The persistent storage layer for DIAL, used to store conversations, prompts, applications, user files, and other [resources](#resource). DIAL supports cloud blob storage (AWS S3, Google Cloud Storage, Azure Blob Storage) or a local file system. Redis is deployed on top as an in-memory cache.

DIAL does not require a centralized database — file storage and Redis are the only persistence dependencies.

## I

### Interceptor

Middleware that modifies requests and/or responses flowing through [DIAL Core](#dial-core). Interceptors are inserted into [deployments](#deployment-configuration-sense) and execute before or after chat completion requests reach the target model or application.

Interceptors fall into three categories: **pre-interceptors** (modify the incoming request), **post-interceptors** (modify the outgoing response), and **generic interceptors** (modify both). Common use cases include PII detection and redaction, content filtering, prompt injection detection, and compliance enforcement.

When multiple interceptors are configured, they execute in sequence: global interceptors first, then application-type interceptors, then local interceptors. The response travels back through the chain in reverse order.

Not to be confused with: [Adapter](#adapter) (translates external APIs), [Application](#application) (business logic).

### Interceptors SDK

A Python framework for creating [interceptors](#interceptor) for DIAL chat completion and embedding models.

Repository: [ai-dial-interceptors-sdk](https://github.com/epam/ai-dial-interceptors-sdk). Not to be confused with: [DIAL SDK](#dial-sdk) (for applications and adapters).

## L

### Load Balancer

A feature of [DIAL Core](#dial-core) that distributes requests across model [upstreams](#upstream). The load balancer supports weighted distribution across deployments, regions, and cloud subscriptions, and can prioritize provisioned throughput unit (PTU) deployments over pay-per-token options.

Configuration is defined through `upstream` parameters in [dynamic settings](#dynamic-settings) and can be adjusted without redeployment.

## M

### Marketplace

The single-entry point in [DIAL Chat](#dial-chat) for browsing and accessing all available [agents](#agent), [applications](#application), models, and [tool sets](#tool-set). The Marketplace respects [role](#role)-based access control, so each user sees only the resources available to their permissions. Resources can be filtered by type, topic, and source.

The Marketplace also serves as a collaboration hub where users can [share](#sharing) and [publish](#publication) their creations.

### MCP Server

A service conforming to the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) that extends AI application capabilities with external tools and data sources. DIAL supports two integration approaches: connecting to external MCP servers hosted outside the platform, and deploying custom MCP servers as Docker containers through [DIAL Admin](#dial-admin).

MCP servers are used through [tool sets](#tool-set) in [Quick Apps](#quick-app) and other applications.

### Mind Map Studio

An [application type](#application-type) that enables users to explore information through interactive knowledge graphs built from documents, URLs, and other data sources. Mind Map Studio uses a [custom UI](#custom-ui) that replaces the standard chat interface with a visual, interactive graph.

End-user documentation belongs in the Chat User Guide. Developer-facing documentation (authoring workflows, export, extension points) belongs in Building with DIAL.

### Multimodality

The ability of DIAL applications and models to handle non-textual content alongside text. This includes image-to-text, text-to-image, text-to-video, image-to-video, and file transfers. Multimodality is supported through the [Unified API](#unified-api) and rendered in [DIAL Chat](#dial-chat) through [attachments](#attachment) and [visualizers](#visualizer).

### My Workspace

The personal area in [DIAL Chat](#dial-chat) where a user manages their bookmarked [agents](#agent), [tool sets](#tool-set), and [agent builders](#agent-builder). Resources added from the [Marketplace](#marketplace) appear here. My Workspace also provides access to no-code application creation tools.

## P

### Parameterized Replay

A variant of [replay](#replay) where specific parts of conversation messages are replaced with variables. When the conversation is replayed or shared, users are prompted to provide their own values for those variables, creating a personalized experience from a shared template.

### Per-Request Key

A short-lived API key generated by [DIAL Core](#dial-core) for the duration of a single request. Per-request keys manage file access permissions for applications, enable distributed tracing, and attribute costs to the originating user or application. They are automatically invalidated when the request completes.

### Playback

A mode in [DIAL Chat](#dial-chat) that reproduces a conversation exactly as it occurred, without re-submitting prompts to any model. Playback simulates the conversation like a recording. Not to be confused with [replay](#replay), which re-submits prompts and may produce different results.

### Private Space

The logical storage area in DIAL where [resources](#resource) are accessible only to their owner and users with whom they have been explicitly [shared](#sharing). By default, all user-created resources reside in private space.

See also: [Public Space](#public-space).

### Prompt

A reusable text template stored in DIAL that users can invoke in conversations. Prompts can contain [variables](#parameterized-replay) (e.g., `{{country|Japan}}`) with optional default values. Prompts can be [shared](#sharing) or [published](#publication).

### Publication

The workflow through which a user submits [resources](#resource) from their [private space](#private-space) to the [public space](#public-space), making them available to all authenticated users or a restricted audience. All publication requests require administrator approval. Published [applications](#application) and [tool sets](#tool-set) appear in the [Marketplace](#marketplace).

Not to be confused with: [Sharing](#sharing) (user-to-user, no approval required).

### Public Space

The logical storage area in DIAL where [resources](#resource) are accessible to all authenticated users by default. Subfolders within public space can have access rules that restrict visibility to specific [roles](#role). Resources enter public space through [publication](#publication) or direct configuration by administrators.

See also: [Private Space](#private-space).

## Q

### Quick App

An [application type](#application-type) and no-code orchestrator, conceptually similar to OpenAI's GPTs, that simplifies the creation of multi-agent workflows. Quick Apps can use [agents](#agent), [tool sets](#tool-set), REST APIs, language models, and other DIAL resources as building blocks. Configuration is defined through a JSON schema and can be managed via API or the [DIAL Chat](#dial-chat) UI wizard.

Common use cases: RAG-like applications with predefined sources, applications that call external APIs via [MCP tool sets](#tool-set), and multi-step workflows combining multiple agents.

See also: [Quick App 2.0](#quick-app-20), [Code App](#code-app), [Mind Map Studio](#mind-map-studio).

### Quick App 2.0

An evolution of [Quick Apps](#quick-app) that provides a composer for building applications from reusable components. Quick App 2.0 enables task-oriented workflows combining DIAL [agents](#agent) and external integrations ([MCP servers](#mcp-server)), with any AI model that supports tool use acting as an orchestrator.

## R

### Replay

A feature in [DIAL Chat](#dial-chat) that reproduces a conversation by re-submitting the original prompts, optionally with different settings such as a different model or temperature. The replayed conversation appears as a new conversation tagged `[Replay]`. Useful for comparing model responses to identical inputs.

Not to be confused with: [Playback](#playback) (exact reproduction without model calls).

### Resource

Any object managed by [DIAL Core](#dial-core): applications, conversations, prompts, files, and tool sets. Resources can reside in [private space](#private-space) or [public space](#public-space) and are subject to access control rules. Resources can be [shared](#sharing) and [published](#publication).

### Role

A named set of permissions and limits assigned to JWTs or API keys in [DIAL Core](#dial-core). Roles determine which [resources](#resource) a subject can access, enforce usage limits (token rate limits, cost limits), control access to system features (e.g., the admin console), and configure sharing limits.

Roles are defined in [dynamic settings](#dynamic-settings) or through [DIAL Admin](#dial-admin).

### Route

A configuration entry in [DIAL Core](#dial-core) that maps incoming request patterns to specific [deployments](#deployment-configuration-sense). Routes provide flexible request routing and can be used to implement patterns such as A/B testing, failover, or cost-capped routing.

## S

### Schema-Rich Application

An [application](#application) whose structure is defined by a JSON schema conforming to the DIAL Core [meta schema](https://github.com/epam/ai-dial-core/blob/development/config/src/main/resources/custom-application-schemas/schema.json). Schema-rich applications can be created and configured through the [DIAL Core API](https://dialx.ai/dial_api) or UI wizards, and their properties can be modified without redeploying containers.

Contrast with: applications without schemas, where business logic properties are embedded in application code and cannot be changed via API.

### Sharing

A collaboration feature that allows a resource owner to grant access to specific users via a sharing link, without [publishing](#publication) the resource to the entire organization. Shared resources remain in the owner's [private space](#private-space). The owner retains control and can revoke access at any time. Sharing links can optionally grant editing and re-sharing permissions.

Not to be confused with: [Publication](#publication) (organization-wide, requires admin approval).

### Stage

A structured step in an AI-generated response that shows the intermediate reasoning or actions an [agent](#agent) took to produce its final output. Stages are rendered in [DIAL Chat](#dial-chat) as expandable sections within the conversation, providing transparency into multi-step or agentic workflows.

Stages are returned by applications through the `stages` field in the [Unified API](#unified-api) response.

### Starter Button

A predefined prompt button displayed at the beginning of a conversation in [DIAL Chat](#dial-chat). Starter buttons let users begin a conversation with a single click instead of typing. Configured through the `starters` property in a [Quick App](#quick-app) or [application](#application) schema.

## T

### Tool

A capability that an AI model can invoke during a conversation to perform a specific action — such as calling an external API, querying a database, or executing a computation. Tools are declared as part of a chat completion request and conform to the OpenAI function calling convention.

In DIAL, tools can be provided by [MCP servers](#mcp-server), other [applications](#application), or models deployed in DIAL Core. See also: [Tool Set](#tool-set).

### Tool Set

A named collection of [tools](#tool) exposed through an [MCP server](#mcp-server) connection. Tool sets serve as connectors between [Quick Apps](#quick-app) (and other applications) and external services. Users can browse available tool sets in the [Marketplace](#marketplace), add them to [My Workspace](#my-workspace), and use them in their applications.

Tool sets support authentication (user credentials or organization-wide credentials) and can be [shared](#sharing) or [published](#publication).

Also written as: "toolset" (single word, used in API field names and some UI labels). In documentation, use **tool set** (two words) in prose.

## U

### Unified API

The DIAL-defined, OpenAI-compatible API exposed by [DIAL Core](#dial-core) for accessing all language models, embedding models, and [applications](#application) through a single interface. The Unified API extends the OpenAI Chat Completions API with DIAL-specific features including [attachments](#attachment), [stages](#stage), [custom content rendering](#visualizer), state management, and interactive controls.

The Unified API is the unification layer that makes all models and applications interchangeable within the platform.

Not to be confused with: "DIAL API" (too vague — use **Unified API** when referring to the chat/embeddings protocol).

### Upstream

A backend endpoint that serves requests for a specific [deployment](#deployment-configuration-sense). Each deployment can have multiple upstreams with different weights and tiers. The [load balancer](#load-balancer) distributes requests across upstreams based on the configured strategy.

Upstream parameters include `endpoint`, `key`, `tier`, and `weight`.

## V

### Visualizer

A special-purpose [application](#application) used to render specific content types within the [DIAL Chat](#dial-chat) UI. Visualizers extend the default rendering capabilities beyond built-in Markdown and Plotly support. Custom visualizers are built using the [DIAL Chat Visualizer Connector](https://github.com/epam/ai-dial-chat/blob/development/libs/chat-visualizer-connector/README.md) library.

Examples: rendering 3D protein structures, financial charts, or custom data formats in the chat interface.

---

## Concept Map

The following diagram shows how key DIAL concepts relate to each other:

```
DIAL Core (required)
├── Unified API
│   ├── Chat Completion API
│   └── Embedding API
├── Deployments
│   ├── Models (via Adapters)
│   ├── Applications
│   │   ├── Schema-Rich Applications (via Application Types)
│   │   │   ├── Quick App / Quick App 2.0
│   │   │   ├── Code App
│   │   │   └── Mind Map Studio
│   │   └── Applications without Schemas
│   └── Interceptors
├── Tool Sets (via MCP Servers)
├── Resources
│   ├── Conversations
│   ├── Prompts
│   ├── Files (in File Storage)
│   └── Applications
├── Access Control
│   ├── Roles
│   ├── Private Space / Public Space
│   ├── Sharing (user-to-user)
│   └── Publication (org-wide, admin-approved)
├── Load Balancer (distributes across Upstreams)
├── Per-Request Keys
└── Dynamic Settings

DIAL Chat (optional)
├── Marketplace
├── My Workspace
├── Agent Builders (UI wizards for Application Types)
├── Conversations (Replay, Playback, Parameterized Replay)
├── Visualizers
└── Custom UIs

DIAL Admin (optional)
├── Deployment management
├── Access control management
├── Publication approval
└── Monitoring

DIAL Overlay (optional)
└── Embeds DIAL Chat via iframe

SDKs
├── DIAL SDK (applications, adapters)
└── Interceptors SDK (interceptors)
```

---

## Deprecated Terms

| Term | Status | Replacement |
|---|---|---|
| Addon | Archived. ChatGPT plugin protocol, abandoned. | [Application](#application), [Interceptor](#interceptor), [Tool Set](#tool-set) |
| Assistant | Archived. Repository [ai-dial-assistant](https://github.com/epam/ai-dial-assistant). | [Application](#application) |
| "the backend" | Informal. Too vague. | [DIAL Core](#dial-core) |
| "the frontend" | Informal. Too vague. | [DIAL Chat](#dial-chat) |
| "DIAL API" | Ambiguous. Could refer to any DIAL endpoint. | [Unified API](#unified-api) (for the chat/embeddings protocol) |