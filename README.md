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
  <a href="https://docs.dialx.ai/">Documentation</a> ·
  <a href="#repositories">Repositories</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

## About DIAL

**DIAL** (Deterministic Integrator of Applications and Language Models) is an open-source, enterprise-grade AI platform by EPAM. Its only required component, DIAL Core, exposes a single OpenAI-compatible [Unified API](https://dialx.ai/dial_api) to language and embedding models from any vendor and to the applications and agents built on top of them. Access control, cost limits, and observability are managed in one place. Add DIAL Chat for end users, DIAL Admin for administrators, and model adapters to connect providers.

This repository is the source of the DIAL documentation published at [docs.dialx.ai](https://docs.dialx.ai/):

- [`docs_v2/`](docs_v2) — documentation pages, built with Docusaurus
- [`dial-samples/`](dial-samples) — sample applications with their own UIs, and the finished projects from the custom adapter and interceptor tutorials

## Quick start

- **Try DIAL without installing anything:** open the hosted edition at [chat.dialx.ai](https://chat.dialx.ai/).
- **Run DIAL on your own computer:** follow [DIAL Platform Samples](https://github.com/epam/ai-dial-samples). Its setups start DIAL Chat, DIAL Admin, and DIAL Core with Docker, including small open-source models, so you need no API keys and no cloud account.

## Documentation

The documentation lives at **[docs.dialx.ai](https://docs.dialx.ai/)**. Start with the page that matches your goal:

| I want to… | Start here | Continue with |
|---|---|---|
| Understand what DIAL is, what it can do, and how it is built | [What is DIAL](https://docs.dialx.ai/understand-dial/what-is-dial) | [Capabilities](https://docs.dialx.ai/understand-dial/capabilities/index) and [architecture](https://docs.dialx.ai/understand-dial/architecture/index) |
| Connect a coding agent or harness (Claude Code, Codex, GitHub Copilot, and others) | [Agentic tools](https://docs.dialx.ai/building-with-dial/integrations/agentic-tools/index) | [Connect Claude Code](https://docs.dialx.ai/building-with-dial/integrations/agentic-tools/claude-code), [connect Codex](https://docs.dialx.ai/building-with-dial/integrations/agentic-tools/codex), or [see how DIAL governs agents](https://docs.dialx.ai/understand-dial/capabilities/coding-agents-and-harnesses) |
| Understand security and governance in DIAL | [Security and governance](https://docs.dialx.ai/understand-dial/security-and-governance/index) | [Authentication and access control](https://docs.dialx.ai/understand-dial/security-and-governance/authentication-and-access-control) and [usage limits and cost control](https://docs.dialx.ai/understand-dial/security-and-governance/usage-limits-and-cost-control) |
| Call models and applications from code | [DIAL API reference](https://dialx.ai/dial_api) | [Python client](https://github.com/epam/ai-dial-client-python) and [TypeScript SDK](https://epam.github.io/ai-dial-typescript-sdk/) |
| Work with the DIAL Chat interface | [Chat User Guide](https://docs.dialx.ai/chat-user-guide/index) | [Start a conversation](https://docs.dialx.ai/chat-user-guide/conversations) and [find models and agents](https://docs.dialx.ai/chat-user-guide/catalog/index) |
| Administer the platform with DIAL Admin | [Admin Panel overview](https://docs.dialx.ai/administering-dial-new/index) | [Manage the AI gateway](https://docs.dialx.ai/administering-dial-new/ai-gateway/index) and [users and access](https://docs.dialx.ai/administering-dial-new/governance/user-management) |
| Deploy DIAL for my organization | [Cloud deployment](https://docs.dialx.ai/operating-dial/cloud-deployment/index) | [Configure authentication](https://docs.dialx.ai/operating-dial/auth-and-access-control/index) and [prepare for production](https://docs.dialx.ai/operating-dial/production-readiness/index) |
| Connect model providers | [Amazon Bedrock](https://docs.dialx.ai/operating-dial/model-deployment/bedrock-model-deployment) | [Azure OpenAI](https://docs.dialx.ai/operating-dial/model-deployment/openai-model-deployment) and [Vertex AI](https://docs.dialx.ai/operating-dial/model-deployment/vertex-model-deployment) |
| Monitor and upgrade DIAL | [Observability](https://docs.dialx.ai/operating-dial/observability/index) | [Upgrade procedure](https://docs.dialx.ai/operating-dial/production-readiness/upgrade-procedure) |
| Explore the services that make up DIAL | [Services](https://docs.dialx.ai/services/index) | [Architecture highlights](https://docs.dialx.ai/understand-dial/architecture/architecture-highlights) and [DIAL Core](https://docs.dialx.ai/services/core/index) |
| Build an application or agent | [Choose an app type](https://docs.dialx.ai/building-with-dial/apps/when-to-use-which) | [Build a Quick App](https://docs.dialx.ai/building-with-dial/apps/quick-apps/tutorial-build-an-agent) or [build with the DIAL SDK](https://docs.dialx.ai/building-with-dial/apps/custom-apps/getting-started-sdk) |
| Extend DIAL with interceptors or adapters | [Interceptors](https://docs.dialx.ai/building-with-dial/interceptors/index) | [Adapters](https://docs.dialx.ai/building-with-dial/adapters/index) and the [SDK reference](https://docs.dialx.ai/building-with-dial/developer-tools/sdk-reference/index) |
| Connect enterprise tools and documents | [Tools and enterprise data](https://docs.dialx.ai/understand-dial/capabilities/tools-and-enterprise-data) | [Connect an MCP server](https://docs.dialx.ai/building-with-dial/toolsets/mcp-server-integration) or [build a document Q&A app](https://docs.dialx.ai/building-with-dial/apps/generic-rag-document-qa) |
| Connect DIAL to other tools | [Integrations](https://docs.dialx.ai/building-with-dial/integrations/index) | Chatbots, productivity add-ins, workflow automation, and agentic tools |

To browse every section, see the [documentation directory](https://docs.dialx.ai/#documentation-directory).

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
- To fix or add documentation, edit the Markdown files in [`docs_v2/`](docs_v2) and preview the site locally at http://localhost:3000. You need Node.js 22 or later:

  ```bash
  npm install
  npm start
  ```

  Run `npm run build` before you open a pull request: a broken link fails the build.

- Report vulnerabilities as described in [SECURITY.md](SECURITY.md).
- Ask questions on [Discord](https://discord.gg/ukzj9U9tEe).

## License

This project is licensed under the [Apache License 2.0](LICENSE).
