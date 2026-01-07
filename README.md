# DIAL Documentation

## Project Overview and Contribution Guide

- [Contribution Guide](https://github.com/epam/ai-dial/blob/main/CONTRIBUTING.md)

## Architecture

- [Architecture Overview](/docs/platform/0.architecture-and-concepts/2.architecture.md)

## Quick Start

- [Quick Start Guide](docs/quick-start.md)

> Refer to [DIAL Chat Repository](https://github.com/epam/ai-dial-chat#overview) to learn how to launch DIAL Chat with default configurations.

## DIAL Admin

- [About DIAL Admin](/docs/platform/11.admin-panel.md)
- [User Guide](/docs/tutorials/3.admin/home.md)
- [Helm chart for DIAL Admin](https://github.com/epam/ai-dial-helm/tree/main/charts/dial-admin)

## Run DIAL Locally

- [Launch DIAL Chat with an Azure model](/docs/tutorials/1.developers/0.local-run/1.quick-start-model.md)
- [Launch DIAL Chat with a self-hosted model (Ollama)](/docs/tutorials/1.developers/0.local-run/3.quick-start-with-self-hosted-model-ollama.md)
- [Launch DIAL Chat with a self-hosted model (vLLM)](/docs/tutorials/1.developers/0.local-run/4.quick-start-with-self-hosted-model-vllm.md)
- [Launch DIAL Chat with a sample application](/docs/tutorials/1.developers/0.local-run/0.quick-start-with-application.md)

## Helm Deployment

- [DIAL Generic Installation Simple Guide](https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple)
- [GCP Installation](https://github.com/epam/ai-dial-helm/blob/main/charts/dial/examples/gcp/complete/README.md)
- [Azure Installation](https://github.com/epam/ai-dial-helm/blob/main/charts/dial/examples/azure/simple/README.md)
- [AWS Installation](https://github.com/epam/ai-dial-helm/blob/main/charts/dial/examples/aws/complete/README.md)

## Configuration

- Refer to [Configuration](/docs/tutorials/2.devops/1.configuration/0.configuration-guide.md) to see configuration guidelines for DIAL components.

## DIAL Chat Application User Manual

- [DIAL Chat User Manual](/docs/tutorials/0.user-guide.md)

## Other DIAL Project Open Source Repositories

Here is the current list of repositories where you can find more details.

> You can also refer to the [open source repository map](https://dialx.ai/open-source) on the DIAL website.

- [DIAL Helm](https://github.com/epam/ai-dial-helm) - helm chart, find stable assemblies here.
- [DIAL Admin Frontend](https://github.com/epam/ai-dial-admin-frontend) - DIAL Admin web application repository.
- [DIAL Admin Backend](https://github.com/epam/ai-dial-admin-backend)- DIAL Admin API for DIAL Core.
- [DIAL Core](https://github.com/epam/ai-dial-core) - the main component that exposes API
- [DIAL SDK](https://github.com/epam/ai-dial-sdk) - development kit for applications and model adapters
- [DIAL Interceptors Python SDK](https://github.com/epam/ai-dial-interceptors-sdk) - framework for creating DIAL Interceptors in Python for chat completion and embedding models.
- [DIAL Chat](https://github.com/epam/ai-dial-chat) - default UI
- [DIAL Overlay](https://github.com/epam/ai-dial-chat/blob/development/libs/overlay/README.md) - a library for using DIAL Chat in an overlay format
- [DIAL Chat Themes](https://github.com/epam/ai-dial-chat-themes) - static content and UI customizations for default UI
- [Visualizer Connector](https://github.com/epam/ai-dial-chat/blob/development/libs/chat-visualizer-connector/README.md) - a library for connecting custom visualizers
- [DIAL CI](https://github.com/epam/ai-dial-ci) - GitHub CI commons
- [DIAL Analytics Realtime](https://github.com/epam/ai-dial-analytics-realtime) - simple real-time usage analytics. That transforms logs into InfluxDB metrics
- [DIAL Auth Helper](https://github.com/epam/ai-dial-auth-helper) - AuthProxy is a proxy service that implements OpenID-compatible Web API endpoints to avoid direct interaction with the AuthProviders' APIs, such as the KeyCloak API.
- [App Controller](https://github.com/epam/ai-dial-app-controller) - a Java-based web service application that orchestrates the building and deployment of Python applications in Kubernetes.
- [App Builder](https://github.com/epam/ai-dial-app-builder-python) - a Python-based application designed to download source code from DIAL file storage and prepare files to build a container image.
- [DIAL RAG](https://github.com/epam/ai-dial-rag) - the DAL RAG project repository.
- [DIAL RAG Eval](https://github.com/epam/ai-dial-rag-eval) - library designed for RAG (Retrieval-Augmented Generation) evaluation, where retrieval and generation metrics are calculated.
- [Log Parser](https://github.com/epam/ai-dial-log-parser) - tool to parse DIAL log files and repack it to parquet dataset.
- [Python Code Interpreter](https://github.com/epam/ai-dial-code-interpreter) - uses Jupyter Kernel to execute arbitrary python code.
- [DIAL-to-DIAL Adapter](https://github.com/epam/ai-dial-adapter-dial) - adapter for a local development against a remote DIAL Core.
- Model adapters:
  - [DIAL Azure OpenAI Adapter](https://github.com/epam/ai-dial-adapter-openai) - pluggable Azure ChatGPT adapter
  - [DIAL GCP VertexAI Adapter](https://github.com/epam/ai-dial-adapter-vertexai) - pluggable Google LLMs adapter
  - [DIAL AWS Bedrock Adapter](https://github.com/epam/ai-dial-adapter-bedrock) - pluggable Amazon LLMs adapter (Anthropic Claude 1/2 is included)
  - More model adapters will be released (you may contribute)
