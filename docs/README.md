---
sidebar_position: 1
slug: /
sidebar_label: Home
---

# AI DIAL Documentation

## Project Overview and Contribution Guide

* [Contribution Guide](https://github.com/epam/ai-dial/blob/main/contributing.md)

## Quick Start Guides

* [Quick Start Guide](./quick-start.md)
* [Use AI DIAL Chat with Applications](./quick-start-with-application.md)
* [Use AI DIAL Chat with Addons](./quick-start-with-addon.md)

## User Guide

* [AI DIAL Chat User Guide](./user-guide.md)

## Other Info

* [Create Azure Model](./Deployment/Azure%20Model%20Deployment.md)

## Other Project Repositories 

Here is the current list of repositories where you can find more details. 

> You can also refer to the [open source repository map](https://epam-rail.com/open-source) on the AI DIAL website.

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
