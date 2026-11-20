# DIAL Repository Map

This is the structured reference of all DIAL repositories. Use it to determine where to look when researching a topic.

## How to use this map

1. Identify which component(s) are relevant to your research topic
2. Use the GitHub URL to access the repo via `gh api`
3. Start with the **Key files** to orient yourself in the codebase
4. Check **Related components** for cross-cutting features
5. Note **Documentation gaps** to understand what research is most needed

## Core platform

### DIAL Core

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-core` |
| URL | https://github.com/epam/ai-dial-core |
| Language | Java 21 |
| Build | Gradle |
| Purpose | Main component — Unified API server for models, apps, and adapters |
| Key files | `README.md`, `build.gradle`, `src/main/java/**/` (route handlers, config classes), `src/main/resources/` (default config), any `*Config*` or `*Settings*` or `*Properties*` classes, OpenAPI spec if present |
| Related | Auth Helper (auth), SDK (app protocol), Adapters (model routing), Helm (deployment) |
| Gaps | #2 (no API guide), #8 (config on GitHub), #10 (no OpenAI compat matrix), #15 (no dependency config), #16 (no error reference) |

### DIAL Chat

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-chat` |
| URL | https://github.com/epam/ai-dial-chat |
| Language | TypeScript |
| Build | NX monorepo |
| Purpose | Default web UI — includes Overlay, Theming, Visualizer Connector |
| Key files | `README.md`, `apps/chat/` (main app), `libs/` (shared libraries), `libs/overlay/` (Overlay SDK), `libs/theming/`, environment config files |
| Related | Core (API client), Admin Frontend (admin UI) |
| Gaps | #3 (apps ecosystem — Code Apps, Quick Apps surface here), #11 (naming chaos — "Application builders" label used here) |

### DIAL Admin Frontend

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-admin-frontend` |
| URL | https://github.com/epam/ai-dial-admin-frontend |
| Language | TypeScript |
| Build | NX / Next.js |
| Purpose | Admin Panel web application |
| Key files | `README.md`, `src/` or `apps/` (main app), page components, API client code |
| Related | Admin Backend (API), Core (managed entities) |
| Gaps | #11 (naming — "Builders" label used in Admin sidebar) |

### DIAL Admin Backend

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-admin-backend` |
| URL | https://github.com/epam/ai-dial-admin-backend |
| Language | Java |
| Build | Gradle |
| Purpose | Admin Panel API for DIAL Core |
| Key files | `README.md`, API route definitions, entity models, config classes |
| Related | Admin Frontend (UI), Core (upstream API) |
| Gaps | #8 (config on GitHub) |

### DIAL Auth Helper

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-auth-helper` |
| URL | https://github.com/epam/ai-dial-auth-helper |
| Language | Python / TypeScript (check repo) |
| Build | Check repo |
| Purpose | AuthProxy service implementing OpenID-compatible endpoints |
| Key files | `README.md`, auth flow implementation, IDP configuration examples, env var definitions |
| Related | Core (auth integration), Helm (deployment config) |
| Gaps | #14 (networking/firewall), auth configuration across IDPs |

## SDKs and frameworks

### DIAL SDK

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-sdk` |
| URL | https://github.com/epam/ai-dial-sdk |
| Language | Python >= 3.11 |
| Build | Poetry |
| Purpose | Framework for creating applications and model adapters |
| Key files | `README.md`, `pyproject.toml`, `aidial_sdk/` (main package), base classes for apps/adapters, example apps if any, tests |
| Related | Core (protocol), Interceptors SDK (sister SDK), App Builder (deployment) |
| Gaps | #1 (no tutorials), #3 (apps ecosystem), #21 (no testing guidance) |
| Note | Also a git submodule in this repo at `dial-sdk/` |

### DIAL Interceptors SDK

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-interceptors-sdk` |
| URL | https://github.com/epam/ai-dial-interceptors-sdk |
| Language | Python |
| Build | Poetry |
| Purpose | Framework for creating interceptors for chat completion and embedding models |
| Key files | `README.md`, `pyproject.toml`, base interceptor classes, examples |
| Related | Core (interceptor chain), SDK (sister SDK) |
| Gaps | #3 (apps ecosystem — interceptors underdocumented) |

## Model adapters

### OpenAI Adapter

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-adapter-openai` |
| URL | https://github.com/epam/ai-dial-adapter-openai |
| Language | Python |
| Build | Poetry |
| Purpose | Adapter for Azure OpenAI, OpenAI, vLLM, and other OpenAI-compatible APIs |
| Key files | `README.md`, model mapping, supported parameters, env vars |
| Related | Core (adapter protocol), Helm (deployment) |
| Gaps | #10 (OpenAI compatibility matrix — which params supported) |

### Bedrock Adapter

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-adapter-bedrock` |
| URL | https://github.com/epam/ai-dial-adapter-bedrock |
| Language | Python |
| Build | Poetry |
| Purpose | Adapter for AWS Bedrock models |
| Key files | `README.md`, supported models, env vars, parameter mapping |
| Related | Core, Helm |
| Gaps | #10 (compatibility — which Bedrock models/features) |

### Vertex AI Adapter

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-adapter-vertexai` |
| URL | https://github.com/epam/ai-dial-adapter-vertexai |
| Language | Python |
| Build | Poetry |
| Purpose | Adapter for Google Vertex AI models |
| Key files | `README.md`, supported models, env vars, parameter mapping |
| Related | Core, Helm |
| Gaps | #10 (compatibility — which Vertex models/features) |

## Deployment

### DIAL Helm

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-helm` |
| URL | https://github.com/epam/ai-dial-helm |
| Language | Helm / YAML |
| Build | Helm charts |
| Purpose | Helm charts for Kubernetes deployment; stable assemblies published here |
| Key files | `README.md`, `charts/dial/` (main chart), `charts/dial/values.yaml` (all config), `charts/dial/examples/` (example configs) |
| Related | Core, Chat, Admin, Auth Helper, all adapters |
| Gaps | #8 (DevOps sidebar links here instead of docs site), #15 (dependency config), #17 (version compat matrix), #18 (production hardening) |

## Tools and utilities

### DIAL RAG

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-rag` |
| URL | https://github.com/epam/ai-dial-rag |
| Language | Python |
| Build | Poetry |
| Purpose | RAG project for retrieval-augmented generation |
| Key files | `README.md`, configuration, supported document types, chunking strategies |
| Related | Core (app protocol), SDK |
| Gaps | No RAG explanation on docs site (gap-analysis §4) |

### DIAL RAG Eval

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-rag-eval` |
| URL | https://github.com/epam/ai-dial-rag-eval |
| Language | Python |
| Build | Poetry |
| Purpose | Library for RAG evaluation (retrieval and generation metrics) |
| Key files | `README.md`, metric definitions, evaluation pipelines |
| Related | RAG |
| Gaps | No evaluation documentation on docs site |

### Analytics Realtime

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-analytics-realtime` |
| URL | https://github.com/epam/ai-dial-analytics-realtime |
| Language | Check repo |
| Build | Check repo |
| Purpose | Real-time usage analytics — transforms logs into InfluxDB metrics |
| Key files | `README.md`, config, metric definitions, InfluxDB schema |
| Related | Core (log source) |
| Gaps | #13 (observability stops at "use OTEL") |

### Python Code Interpreter

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-code-interpreter` |
| URL | https://github.com/epam/ai-dial-code-interpreter |
| Language | Python |
| Build | Check repo |
| Purpose | Uses Jupyter Kernel to execute arbitrary Python code |
| Key files | `README.md`, security sandboxing, supported packages |
| Related | Core (app protocol) |
| Gaps | #3 (apps ecosystem — undocumented app type) |

### DIAL-to-DIAL Adapter

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-adapter-dial` |
| URL | https://github.com/epam/ai-dial-adapter-dial |
| Language | Python |
| Build | Check repo |
| Purpose | Adapter for local development against a remote DIAL Core |
| Key files | `README.md`, env vars, usage examples |
| Related | Core |
| Gaps | Misleadingly placed as first page of "Apps Development" in current docs |

### Log Parser

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-log-parser` |
| URL | https://github.com/epam/ai-dial-log-parser |
| Language | Python |
| Build | Check repo |
| Purpose | Tool to parse DIAL log files and repack to parquet dataset |
| Key files | `README.md`, input/output formats |
| Related | Core (log format), Analytics |
| Gaps | None specific |

### App Builder

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-app-builder` |
| URL | https://github.com/epam/ai-dial-app-builder |
| Language | Python |
| Build | Check repo |
| Purpose | Downloads source from DIAL file storage and prepares container images |
| Key files | `README.md`, build pipeline, supported app types (Code Apps) |
| Related | Core, Chat (Code Apps UI surface) |
| Gaps | #3 (apps ecosystem — Code Apps build pipeline undocumented), #4 (Tool Sets) |

## Infrastructure

### DIAL CI

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-ci` |
| URL | https://github.com/epam/ai-dial-ci |
| Language | GitHub Actions YAML |
| Build | Reusable workflows |
| Purpose | Reusable GitHub Actions workflows for all DIAL repos |
| Key files | `.github/workflows/` |
| Related | All repos |
| Gaps | None specific |

## Archived (do not use in new content)

### DIAL Assistant

| Field | Value |
|---|---|
| Repo | `epam/ai-dial-assistant` |
| URL | https://github.com/epam/ai-dial-assistant |
| Language | Python |
| Purpose | **Archived.** ChatGPT plugin protocol implementation (abandoned) |
| Note | Do not reference in new documentation. The "Assistant" and "Addon" concepts are deprecated. |
