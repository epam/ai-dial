# AI DIAL Documentation

## Project Overview and Contribution Guide

* [Contribution Guide](/CONTRIBUTING.md)

## Quick Start

* [Quick Start Guide](./quick-start.md)

> Refer to [AI DIAL Chat Repository](https://github.com/epam/ai-dial-chat#overview) to learn how to launch AI DIAL Chat with default configurations.

## Tutorials

* [Launch AI DIAL Chat with an Azure model](./tutorials/quick-start-model.md)
* [Launch AI DIAL Chat with Echo Application](./tutorials/quick-start-with-application.md)
* [Launch AI DIAL Chat with To-Do List Addon](./tutorials/quick-start-with-addon.md)

## AI DIAL Chat Application User Manual

* [AI DIAL Chat User Manual](./docs/user-guide.md)

## Other AI DIAL Project Open Source Repositories 

Here is the current list of repositories where you can find more details. You can also refer to [repository map](https://epam-rail.com/open-source).

- [DIAL Helm](https://github.com/epam/ai-dial-helm) - helm chart, find stable assemblies here.
- [DIAL Core](https://github.com/epam/ai-dial-core) - the main component that exposes API
- [DIAL SDK](https://github.com/epam/ai-dial-sdk) - development kit for applications and model adapters 
- [DIAL Chat](https://github.com/epam/ai-dial-chat) - default UI
- [DIAL Chat Themes](https://github.com/epam/ai-dial-chat-themes) - static content and UI customizations for default UI
- [DIAL CI](https://github.com/epam/ai-dial-ci) - github CI commons
- [DIAL Assistant](https://github.com/epam/ai-dial-assistant) - model agnostic assistant/addon implementation for DIAL. It allows to use self-hosted OpenAI plugins as DIAL addons.
- [DIAL Analytics Realtime](https://github.com/epam/ai-dial-analytics-realtime) - simple real-time usage analytics. That transforms logs into InfluxDB metrics
- Model adapters:
    - [DIAL Azure OpenAI Adapter](https://github.com/epam/ai-dial-adapter-openai) - plugable Azure ChatGPT adapter
    - [DIAL GCP VertexAI Adapter](https://github.com/epam/ai-dial-adapter-vertexai) - plugable Google LLMs adapter
    - [DIAL AWS Bedrock Adapter](https://github.com/epam/ai-dial-adapter-bedrock) - plugable Amazon LLMs adapter (Anthropic Claude 1/2 is included)
    - More LLM adapters will be released (you may contribute)
