# All Related Repositories

## Core platform

| Component | URL | Description |
|---|---|---|
| DIAL Core | https://github.com/epam/ai-dial-core | Java 21 / Gradle. The main component — Unified API server for models, apps, and adapters |
| DIAL Chat | https://github.com/epam/ai-dial-chat | TypeScript / NX monorepo. Default web UI (includes Overlay, Theming, Visualizer Connector) |
| DIAL Admin Frontend | https://github.com/epam/ai-dial-admin-frontend | TypeScript / NX / Next.js. Admin Panel web application |
| DIAL Admin Backend | https://github.com/epam/ai-dial-admin-backend | Java. Admin Panel API for DIAL Core |
| DIAL Auth Helper | https://github.com/epam/ai-dial-auth-helper | AuthProxy service implementing OpenID-compatible endpoints |

## SDKs and frameworks

| Component | URL | Description |
|---|---|---|
| DIAL SDK | https://github.com/epam/ai-dial-sdk | Python ≥3.11 / Poetry. Framework for creating applications and model adapters |
| DIAL Interceptors SDK | https://github.com/epam/ai-dial-interceptors-sdk | Python. Framework for creating interceptors for chat completion and embedding models |

## Model adapters

| Component | URL | Description |
|---|---|---|
| OpenAI Adapter | https://github.com/epam/ai-dial-adapter-openai | Python. Adapter for Azure OpenAI, OpenAI, vLLM, and other OpenAI-compatible APIs |
| Bedrock Adapter | https://github.com/epam/ai-dial-adapter-bedrock | Python. Adapter for AWS Bedrock models |
| Vertex AI Adapter | https://github.com/epam/ai-dial-adapter-vertexai | Python. Adapter for Google Vertex AI models |

## Deployment

| Component | URL | Description |
|---|---|---|
| DIAL Helm | https://github.com/epam/ai-dial-helm | Helm charts for Kubernetes deployment. Stable assemblies are published here |

## Tools and utilities

| Component | URL | Description |
|---|---|---|
| DIAL RAG | https://github.com/epam/ai-dial-rag | Python. RAG project for retrieval-augmented generation |
| DIAL RAG Eval | https://github.com/epam/ai-dial-rag-eval | Python. Library for RAG evaluation (retrieval and generation metrics) |
| Analytics Realtime | https://github.com/epam/ai-dial-analytics-realtime | Real-time usage analytics. Transforms logs into InfluxDB metrics |
| Python Code Interpreter | https://github.com/epam/ai-dial-code-interpreter | Uses Jupyter Kernel to execute arbitrary Python code |
| DIAL-to-DIAL Adapter | https://github.com/epam/ai-dial-adapter-dial | Adapter for local development against a remote DIAL Core |
| Log Parser | https://github.com/epam/ai-dial-log-parser | Tool to parse DIAL log files and repack to parquet dataset |
| App Builder | https://github.com/epam/ai-dial-app-builder | Python. Downloads source from DIAL file storage and prepares container images |

## Infrastructure

| Component | URL | Description |
|---|---|---|
| DIAL CI | https://github.com/epam/ai-dial-ci | Reusable GitHub Actions workflows for all DIAL repos |

## Archived (do not use in new content)

| Component | URL | Description |
|---|---|---|
| DIAL Assistant | https://github.com/epam/ai-dial-assistant | **Archived.** ChatGPT plugin protocol implementation (abandoned) |
