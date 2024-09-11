# AI DIAL Documentation

## Project Overview and Contribution Guide

* [Contribution Guide](https://github.com/epam/ai-dial/blob/main/CONTRIBUTING.md)

## Architecture

* [Architecture Overview](./architecture.md)

## Quick Start

* [Quick Start Guide](./quick-start.md)

> Refer to [AI DIAL Chat Repository](https://github.com/epam/ai-dial-chat#overview) to learn how to launch AI DIAL Chat with default configurations.

## Helm Deployment

* [AI DIAL Generic Installation Simple Guide](https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple)

## Tutorials

* [Launch AI DIAL Chat with an Azure model](./tutorials/quick-start-model.md)
* [Launch AI DIAL Chat with a Sample Application](./tutorials/quick-start-with-application.md)
* [Launch AI DIAL Chat with a Sample Addon](./tutorials/quick-start-with-addon.md)

## Development Guides

* [A basic guide for development of applications for AI DIAL](./tutorials/quick-start-with-application.md)

## AI DIAL Chat Application User Manual

* [AI DIAL Chat User Manual](./user-guide.md)

## Configuration

* Refer to [Configuration](./Deployment/configuration.md)

## Other AI DIAL Project Open Source Repositories

Here is the current list of repositories where you can find more details.

> You can also refer to the [open source repository map](https://epam-rail.com/open-source) on the AI DIAL website.

- [DIAL Helm](https://github.com/epam/ai-dial-helm) - helm chart, find stable assemblies here.
- [DIAL Core](https://github.com/epam/ai-dial-core) - the main component that exposes API
- [DIAL SDK](https://github.com/epam/ai-dial-sdk) - development kit for applications and model adapters
- [DIAL Interceptors Python SDK](https://github.com/epam/ai-dial-interceptors-sdk) - framework for creating DIAL Interceptors in Python for chat completion and embedding models.
- [DIAL Chat](https://github.com/epam/ai-dial-chat) - default UI
- [DIAL Chat Themes](https://github.com/epam/ai-dial-chat-themes) - static content and UI customizations for default UI
- [DIAL CI](https://github.com/epam/ai-dial-ci) - github CI commons
- [DIAL Assistant](https://github.com/epam/ai-dial-assistant) - model agnostic assistant/addon implementation for DIAL. It allows to use self-hosted OpenAI plugins as DIAL addons.
- [DIAL Analytics Realtime](https://github.com/epam/ai-dial-analytics-realtime) - simple real-time usage analytics. That transforms logs into InfluxDB metrics
- [DIAL Auth Helper](https://github.com/epam/ai-dial-auth-helper) - AuthProxy is a proxy service that implements OpenID-compatible Web API endpoints to avoid direct interaction with the AuthProviders' APIs, such as the KeyCloak API.
- Model adapters:
    - [DIAL Azure OpenAI Adapter](https://github.com/epam/ai-dial-adapter-openai) - plugable Azure ChatGPT adapter
    - [DIAL GCP VertexAI Adapter](https://github.com/epam/ai-dial-adapter-vertexai) - plugable Google LLMs adapter
    - [DIAL AWS Bedrock Adapter](https://github.com/epam/ai-dial-adapter-bedrock) - plugable Amazon LLMs adapter (Anthropic Claude 1/2 is included)
    - [AI DIAL Adapter](https://github.com/epam/ai-dial-adapter-dial) - application which adapts calls from one DIAL Core to calls to another DIAL Core.
    - More LLM adapters will be released (you may contribute)
