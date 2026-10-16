<h1 align="center">DIAL Documentation</h1>

<p align="center">
  <a href="https://dialx.ai/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://dialx.ai/logo/dialx_logo.svg">
      <img src="https://dialx.ai/logo/dialx_logo_light.svg" alt="DIALX">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://dialx.ai/"><img src="https://img.shields.io/static/v1?label=Official%20website&message=dialx.ai&color=7799FF&style=flat-square&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd%2BUAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHKADAAQAAAABAAAAHAAAAABkvfSiAAAD2UlEQVRIDa1WS2tkRRQ%2Bp6ruo2N3a4hmEVHHQRjILKKM%2FoAsXYiKxE0Wgi4HxF8g8xNcOC4cBQdmM%2BNGHWYxmEVQQ0CDr0WIGKILk%2FiAISHpdPe99fCcurdud%2BchMbkF1XWqbtX56juvaoSTmluJ4tWJb5t5%2FGxrx0CrI6C1j8XoZWFbB7jW7sjl5j7ebx%2FgD1dvPbx%2BkrqwroJwZPznyQSg0wbnjnwqFwSCmBYimlZSvgUu37v58t5Kqytu6axz5%2FXFyf3jDorjFofWTkTjPc5ZMCYDbfoAiK1IprMxpB9P5I8sfjPTnR3SU4klQ4dzd2AEfGFvQ3ZGl6pDxwkMntseZFZAExpXEhD3fnqm%2B%2FbMeuOj4f0ecO5u7wnb1y8ACMMf0YF7fm18bOmp3Yf%2Bw6TDekbkjIDHXNxIXXx9Y0r%2FfXFLfRE2eFaik6dKu7bS2vfIulaiRZOAR1iHQ6cZDWggH8fK4nvbTfdYOOMVSuOcssIqK32XGhz3sOmsYwY5MRVPS6nfDDo8YAwJSCsPdfp0bkggSABp5Pxv4FIG9YAsROS9eKjzvI6mwTLIpccjuMT6PGCS8S1Gu7B1wAHBWUgBY40wzRqLtKA0kkiz0oQULCDpCy%2FV0VgPEbjAujwglRQAIwmgQGTAiOb1QXpNkwxTABJDTfoZiBuPdZm00Fio5d%2BKoSIf2iFADqA6G%2FmSaAUfksA1ZoQhA5YX4I3nbRbhD9bhGQIHDSkPDwMDy5qiFCkyNAGhFf7pqnyIUlQmFQQYGVtLlArKvAzsg9SInwcMSeIgwZIVA1L61NJiujaZ8%2BsGwBYrrIKGfViZlMBCpWHsszY2Z052U8J%2BgBB5VUWl6dPrRYChc9WpIy3GUEGG5vbkrloIlx4ETTxgyGAMep4obWACB6B%2FbDSid4hp5aDKpJbLernMURrR%2FCylTRKrVMbQd%2FlXTpk3Lq9HfwV2PFavhSQAZhbYnTotkO6PApRMIJZjZBS33XO9d2UUvfjcWuP3YTCWq7TwFiwpMWjMDzDpckqCU0RZ0d24wlP6cAqh5FpLpxz00dmucea73JrPpel%2B9srSo5uHgcLcA5L76J8XF9Ny2QBO7Mj%2Bq8vj72cK07RXvJVJT%2FBFIM4R%2BElLe0K3jOqqGL7fmlJfXr028FUAODwOgqYybrGFg%2Bal5favxNYB3YUt4BvJlFfo6A%2BLQcgSB6uvfQiriKEwho3HjwOTsoUCw3KviYpg5akHoceb3GXJuh3tYDPL4Jf5T3AHbpQHTjF4QFJiQoQePkMvCNJfbE1pu5sg%2FNk1sDXdgQeXP0Uy6v9v%2FwLX%2BXJesfXLGQAAAABJRU5ErkJggg%3D%3D" alt="Official website: dialx.ai"></a>
  <a href="https://discord.gg/ukzj9U9tEe"><img src="https://img.shields.io/static/v1?label=DIALX%20Community%20on&message=Discord&color=blue&logo=Discord&style=flat-square" alt="DIALX Community on Discord"></a>
</p>

<p align="center">
  <a href="#repositories">Repositories</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

## About DIAL

**DIAL** (Deterministic Integrator of Applications and Language Models) is an open-source, enterprise-grade AI platform by EPAM. Its only required component, DIAL Core, exposes a single OpenAI-compatible [Unified API](https://dialx.ai/dial_api) to language and embedding models from any vendor and to the applications and agents built on top of them. Access control, cost limits, and observability are managed in one place. Add DIAL Chat for end users, DIAL Admin for administrators, and model adapters to connect providers.

This repository is the source of the DIAL documentation published at [docs.dialx.ai](https://docs.dialx.ai/). It also holds ready-to-run examples:

- [`docs/`](docs) — documentation pages, built with Docusaurus
- [`docs/releases/`](docs/releases) — release notes and upgrade guides for each DIAL release
- [`dial-docker-compose/`](dial-docker-compose) — minimal Docker Compose setups used by the quick-start tutorials
- [`dial-docker-compose-advanced/`](dial-docker-compose-advanced) — production-like stacks with Keycloak, DIAL Admin, and several model adapters
- [`dial-cookbook/`](dial-cookbook) — Jupyter notebooks that call models and applications through the Unified API
- [`dial-samples/`](dial-samples) — sample UIs for DIAL applications
- `dial-sdk/` — the [DIAL SDK](https://github.com/epam/ai-dial-sdk), included as a Git submodule

## Quick start

Launch DIAL Chat with a sample Echo application (requires Docker Compose 2.20.0 or later):

```bash
git clone https://github.com/epam/ai-dial.git
cd ai-dial/dial-docker-compose/application
docker compose up
```

Open http://localhost:3000, select **Echo** in the Marketplace, and send a message. The application replies with your prompt. To connect a real model, follow the [local run tutorials](#documentation).

## Documentation

Start with the page that matches your goal:

| Goal | Start here |
|---|---|
| Understand how DIAL works | [Architecture](docs/platform/0.architecture-and-concepts/2.architecture.md) · [DIAL Core](docs/platform/3.core/0.about-core.md) · [Supported models](docs/platform/2.supported-models.md) · [DIAL-native applications](docs/platform/3.core/7.apps.md) · [Access control](docs/platform/0.architecture-and-concepts/6.access-control.md) |
| Run DIAL on your machine | [Echo application](docs/tutorials/1.developers/0.local-run/0.quick-start-with-application.md) · [Azure OpenAI model](docs/tutorials/1.developers/0.local-run/1.quick-start-model.md) · [Ollama](docs/tutorials/1.developers/0.local-run/3.quick-start-with-self-hosted-model-ollama.md) · [vLLM](docs/tutorials/1.developers/0.local-run/4.quick-start-with-self-hosted-model-vllm.md) · [Full stack with Keycloak and DIAL Admin](docs/tutorials/1.developers/0.local-run/2.quick-start-full-stack-advanced.md) |
| Call models and applications from code | [Unified API reference](https://dialx.ai/dial_api) · [Python client](https://github.com/epam/ai-dial-client-python) · [TypeScript SDK](https://epam.github.io/ai-dial-typescript-sdk/) · [Cookbook notebooks](dial-cookbook/examples) · [Agentic tools](docs/tutorials/1.developers/2.agentic-tools/0.overview.md) |
| Build applications, adapters, and interceptors | [DIAL SDK](https://github.com/epam/ai-dial-sdk) · [Interceptors SDK](https://github.com/epam/ai-dial-interceptors-sdk) · [Enable applications](docs/tutorials/1.developers/4.apps-development/3.enable-app.md) · [Interceptors](docs/platform/3.core/6.interceptors.md) · [Quick App configuration](docs/tutorials/1.developers/4.apps-development/5.quick-app-configuration.md) · [DIAL-to-DIAL adapter](docs/tutorials/1.developers/4.apps-development/0.adapter-dial.md) |
| Deploy DIAL to Kubernetes | [Deployment overview](docs/platform/1.deployment-intro.md) · [Helm charts and examples](https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples) · [AWS](docs/tutorials/2.devops/0.deployment/5.aws-deployment-guide.md) · [Azure](docs/tutorials/2.devops/0.deployment/2.azure-deployment-guide.md) · [GCP](docs/tutorials/2.devops/0.deployment/4.gcp-deployment-guide.md) · [Custom Apps](docs/tutorials/2.devops/0.deployment/0.custom_apps_deployment.md) · [Quick Apps 2.0](docs/tutorials/2.devops/0.deployment/3.quick_apps_deployment.md) |
| Connect model providers | [OpenAI](docs/tutorials/2.devops/0.deployment/2.deployment-of-models/openai-model-deployment.md) · [AWS Bedrock](docs/tutorials/2.devops/0.deployment/2.deployment-of-models/bedrock-model-deployment.md) · [Google Vertex AI](docs/tutorials/2.devops/0.deployment/2.deployment-of-models/vertex-model-deployment.md) · [Databricks](docs/tutorials/2.devops/4.use-databricks-model.md) |
| Configure and secure DIAL | [Configuration guide](docs/tutorials/2.devops/1.configuration/0.configuration-guide.md) · [API keys](docs/tutorials/2.devops/2.auth-and-access-control/0.api-keys.md) · [End-user access (JWT)](docs/tutorials/2.devops/2.auth-and-access-control/1.jwt.md) · [Identity providers](docs/tutorials/2.devops/2.auth-and-access-control/2.configure-idps/0.overview.md) |
| Monitor and upgrade DIAL | [Observability](docs/tutorials/2.devops/3.observability-config.md) · [Realtime analytics](docs/tutorials/2.devops/1.configuration/2.realtime-analytics-config.md) · [Release notes and upgrade guides](docs/releases) |
| Administer DIAL | [DIAL Admin overview](docs/platform/11.admin-panel.md) · [DIAL Admin guide](docs/tutorials/3.admin/introduction.md) · [DIAL Admin Helm chart](https://github.com/epam/ai-dial-helm/tree/main/charts/dial-admin) |
| Use DIAL Chat | [Chat user guide](docs/tutorials/0.user-guide.md) · [Mind Map Studio user guide](docs/tutorials/4.mind-map.md) |
| Connect DIAL to other tools | [Microsoft Copilot](docs/tutorials/1.developers/5.integrations/0.copilot-to-dial.md) · [Excel add-in](docs/tutorials/1.developers/5.integrations/1.ms-excel-addin.md) · [n8n](docs/tutorials/1.developers/5.integrations/3.n8n-integration.md) · [Microsoft Teams bot](docs/tutorials/1.developers/5.integrations/4.msteams-bot.md) |

## Repositories

DIAL is developed in separate repositories in the [EPAM GitHub organization](https://github.com/orgs/epam/repositories?q=ai-dial), grouped below by role. Each repository's README explains how to build, run, and configure that component. For a visual map, see [DIAL open source](https://dialx.ai/open-source).

### DIAL Core

| Repository | Description |
|---|---|
| [DIAL Core](https://github.com/epam/ai-dial-core) | The central and only required component. An API gateway that exposes the Unified API to models, applications, and toolsets, and enforces authentication, access control, and rate limits |

### Model adapters

Adapters translate the Unified API into the API of each model provider.

| Repository | Description |
|---|---|
| [DIAL OpenAI Adapter](https://github.com/epam/ai-dial-adapter-openai) | Models from Azure OpenAI and OpenAI Platform |
| [DIAL Bedrock Adapter](https://github.com/epam/ai-dial-adapter-bedrock) | Language and embedding models from AWS Bedrock |
| [DIAL Vertex AI Adapter](https://github.com/epam/ai-dial-adapter-vertexai) | Language and embedding models from Google Vertex AI |
| [DIAL Anthropic Adapter](https://github.com/epam/ai-dial-adapter-anthropic) | Python package that serves Claude models through the Unified API; used by the OpenAI, Bedrock, and Vertex AI adapters |
| [DIAL-to-DIAL Adapter](https://github.com/epam/ai-dial-adapter-dial) | Forwards requests from one DIAL Core to another, for example to develop locally against a remote DIAL |

### DIAL Chat

| Repository | Description |
|---|---|
| [DIAL Chat](https://github.com/epam/ai-dial-chat) | The default web UI: chat with models and applications, and manage conversations, prompts, and files |
| [DIAL Chat Themes](https://github.com/epam/ai-dial-chat-themes) | Images, fonts, and color palettes that restyle DIAL Chat without rebuilding its image |
| [DIAL Chat Overlay](https://github.com/epam/ai-dial-chat/tree/development/libs/chat-overlay) | Library that embeds DIAL Chat in any web page; part of the DIAL Chat repository |

### DIAL Admin

DIAL Admin is the web console for managing DIAL configuration, access, and deployments.

| Repository | Description |
|---|---|
| [DIAL Admin Frontend](https://github.com/epam/ai-dial-admin-frontend) | Web UI of DIAL Admin |
| [DIAL Admin Backend](https://github.com/epam/ai-dial-admin-backend) | DIAL Admin API. Stores configuration in a database and generates DIAL Core config files |
| [DIAL Deployment Manager Backend](https://github.com/epam/ai-dial-admin-deployment-manager-backend) | Builds and deploys MCP servers, interceptors, and other images to Kubernetes from DIAL Admin |
| [DIAL Deployment Manager MCP Proxy](https://github.com/epam/ai-dial-deployment-manager-mcp-proxy) | Proxy images that let the Deployment Manager run stdio-based MCP servers |
| [DIAL Evaluation Framework Backend](https://github.com/epam/ai-dial-admin-evaluation-framework-backend) | Manages evaluation test suites, runs, and results for models and applications |
| [DIAL Evaluation Metrics](https://github.com/epam/ai-dial-admin-evaluation-metrics) | Calculates metrics that compare model output with ground-truth data for the Evaluation Framework |

### Deployment and operations

| Repository | Description |
|---|---|
| [DIAL Helm](https://github.com/epam/ai-dial-helm) | Helm charts to deploy DIAL to Kubernetes, with examples for AWS, Azure, and GCP. Stable DIAL releases are published here |
| [DIAL Analytics Realtime](https://github.com/epam/ai-dial-analytics-realtime) | Reads DIAL Core logs, analyzes conversations, and writes usage metrics to InfluxDB |
| [DIAL Log Parser](https://github.com/epam/ai-dial-log-parser) | Converts DIAL Core logs into Parquet datasets organized by deployment and date |
| [DIAL Keycloak Helpers](https://github.com/epam/ai-dial-keycloak-helpers) | Keycloak extensions that add user attributes from external identity providers, such as job title from Microsoft Graph, to token claims |

### SDKs and client libraries

| Repository | Description |
|---|---|
| [DIAL SDK](https://github.com/epam/ai-dial-sdk) | Python framework for building DIAL applications and model adapters |
| [DIAL Python Client](https://github.com/epam/ai-dial-client-python) | Python client for the Unified API: chat completions, files, and applications |
| [DIAL TypeScript SDK](https://github.com/epam/ai-dial-typescript-sdk) | TypeScript client for DIAL Core: models, files, conversations, prompts, and applications |
| [DIAL RAG Eval](https://github.com/epam/ai-dial-rag-eval) | Python library that calculates retrieval and generation metrics for RAG pipelines |

### Interceptors

Interceptors run custom logic on requests and responses, for example to mask personal data or apply guardrails.

| Repository | Description |
|---|---|
| [DIAL Interceptors SDK](https://github.com/epam/ai-dial-interceptors-sdk) | Python framework for building interceptors for chat completion and embedding models |
| [Google Model Armor Interceptor](https://github.com/epam/ai-dial-interceptor-google) | Detects, de-identifies, and re-identifies personal data with Google Cloud |

### Applications and MCP servers

| Repository | Description |
|---|---|
| [DIAL RAG](https://github.com/epam/ai-dial-rag) | Answers questions about documents users attach (PDF, DOCX, PPTX, TXT, and more) using several retrieval methods |
| [Generic RAG Backend](https://github.com/epam/ai-dial-generic-rag-backend) | Application runner that answers questions from a pre-indexed document collection, with a configurable pipeline |
| [Generic RAG Frontend](https://github.com/epam/ai-dial-generic-rag-frontend) | Web UI for Generic RAG |
| [Deep Research Backend](https://github.com/epam/ai-dial-deep-research-backend) | Agent that clarifies a question, agrees on a research plan, and researches it with Generic RAG tools |
| [Quick Apps Backend](https://github.com/epam/ai-dial-quickapps-backend) | Quick Apps 2.0: build applications by combining DIAL tools, REST APIs, and MCP servers, with an LLM as the orchestrator |
| [Quick Apps Frontend](https://github.com/epam/ai-dial-quickapps-frontend) | Quick Apps settings editor, embedded in DIAL Chat |
| [Mind Map Studio Backend](https://github.com/epam/ai-dial-mind-map-backend) | Builds interactive knowledge graphs from documents, URLs, and other sources |
| [Mind Map Studio Frontend](https://github.com/epam/ai-dial-mind-map-frontend) | Web UI of Mind Map Studio |
| [Code Interpreter](https://github.com/epam/ai-dial-code-interpreter) | Runs Python code in a Jupyter kernel |
| [Bing Grounding](https://github.com/epam/ai-dial-bing-grounding) | Adds web search through Azure AI Agent with Grounding with Bing Search, for Azure-restricted environments |
| [DIAL Memory](https://github.com/epam/ai-dial-memory-backend) | Long-term memory for agents, exposed as MCP tools and stored in the user's DIAL storage |
| [OpenAPI to MCP](https://github.com/epam/ai-dial-openapi-to-mcp) | Turns an OpenAPI 3.x document into MCP tools |

### Code Apps runtime

Services that build and host the Python applications users create as Code Apps.

| Repository | Description |
|---|---|
| [App Controller](https://github.com/epam/ai-dial-app-controller) | Builds Python applications from DIAL storage into container images and deploys them to Kubernetes as Knative services |
| [App Builder Python](https://github.com/epam/ai-dial-app-builder-python) | Downloads application source code from DIAL storage and prepares it for the image build |

### UI component libraries

| Repository | Description |
|---|---|
| [DIAL UI Kit](https://github.com/epam/ai-dial-ui-kit) | React components for building DIAL interfaces |
| [DIAL React File Manager](https://github.com/epam/ai-dial-react-file-manager) | React file manager for DIAL applications, built on the DIAL UI Kit |
| [DIAL React PDF Highlighter](https://github.com/epam/ai-dial-react-pdf-highlighter) | React PDF viewer with highlights, built on [PDF Highlighter Kit](https://github.com/epam/pdf-highlighter-kit) |

### CI and engineering tooling

| Repository | Description |
|---|---|
| [DIAL CI](https://github.com/epam/ai-dial-ci) | Reusable GitHub Actions workflows for DIAL repositories |
| [DIAL ORT Config](https://github.com/epam/ai-dial-ort-config) | OSS Review Toolkit configuration for DIAL repositories |
| [DIAL Perf](https://github.com/epam/ai-dial-perf) | Gatling performance tests for DIAL Admin |

### Deprecated and legacy

These projects are archived or approaching end of life. They stay available for reference.

| Repository | Description |
|---|---|
| [DIAL Chat 0.x](https://github.com/epam/ai-dial-chat/tree/development-0.x) | Previous version of DIAL Chat, including the legacy Overlay and Visualizer Connector libraries. Receives fixes until the end of 2026 |
| [DIAL Auth Helper](https://github.com/epam/ai-dial-auth-helper) | Archived. Replaced by [DIAL Keycloak Helpers](https://github.com/epam/ai-dial-keycloak-helpers) |
| [DIAL Assistant](https://github.com/epam/ai-dial-assistant) | Archived. Assistant based on the ChatGPT plugin protocol |
| [DIAL LangChain Integration](https://github.com/epam/ai-dial-integration-langchain-python) | Archived. Helpers for passing DIAL-specific fields through LangChain |

## Contributing

- Read [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution process, release cadence, and coding principles.
- To fix or add documentation, edit the files in [`docs/`](docs) and preview the site locally. You need Node.js 22 or later and [Quarto](https://quarto.org/), which renders the cookbook notebooks:

  ```bash
  npm install
  npm start
  ```

- Report vulnerabilities as described in [SECURITY.md](SECURITY.md).
- Ask questions on [Discord](https://discord.gg/ukzj9U9tEe).

## License

This project is licensed under the [Apache License 2.0](LICENSE).
