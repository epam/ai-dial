<!-- omit from toc -->
# Configuration

> **Important**: it is assumed that you have a working knowledge of standard Helm chart parameters in order to define them within the configuration file.

This instruction assumes that you are installing and configuring applications using the latest official [dial](https://charts.epam-rail.com/) helm chart.

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents
- [General method of configuration](#general-method-of-configuration)
- [Core Parameters](#core-parameters)
  - [Static settings](#static-settings)
  - [Dynamic settings](#dynamic-settings)
- [Chat Parameters](#chat-parameters)
- [Themes Parameters](#themes-parameters)
- [Adapters Parameters](#adapters-parameters)
- [Assistant Parameters](#assistant-parameters)
- [Auth Helper Parameters](#auth-helper-parameters)

</div>

## General method of configuration

AI DIAL helm chart contains various applications, and, to configure them, it is necessary to make corresponding changes to different sections of the **values** file.

To add environment variables to AI DIAL application, you can use either `env` or `secrets` section in specific components, e.g `core.env`, `openai.secrets`

> Refer to the [helm chart repository](https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples) to view selected configuration examples.

## Core Parameters

> Refer to the [AI DIAL Core](https://github.com/epam/ai-dial-core) to view a complete documentation.

Configure AI DIAL Core parameters in the `core` section of the values file.

You can provide **dynamic** and **static** settings for the AI DIAL Core:

### Static settings

> Refer to [static settings](https://github.com/epam/ai-dial-core#static-settings) in the AI DIAL Core repository to learn more.

Static settings are used on startup and **cannot** be changed while application is running. You can modify static settings in two ways:

- via environment variables
  - add a parameter to an environment variable with the prefix **aidial.**, e.g.  `aidial.server.port`
- by overriding the default configuration file
  - set the environment variable **AIDIAL_SETTINGS** with a full path to the config file
  - mount the configuration file at the above path

### Dynamic settings

Dynamic settings are stored in JSON files, specified via `config.files` static setting, and reloaded at interval, specified via `config.reload` static setting.

> Refer to [dynamic settings](https://github.com/epam/ai-dial-core#dynamic-settings) in the AI DIAL Core repository to learn more.

To modify dynamic settings:

1. add the environment variable **aidial.config.files**, e.g. `aidial.config.files: '["/mnt/secrets-store/aidial.config.json"]'`
2. mount the configuration file at the provided path

## Chat Parameters

> Refer to the [AI DIAL Chat](https://github.com/epam/ai-dial-chat) to view a complete documentation.

Configure [chat parameters](https://github.com/epam/ai-dial-chat/tree/development/apps/chat#environment-variables) in the `chat` section of the values file.

You can modify chat settings using environment variables.

## Themes Parameters

> Refer to the [AI DIAL Chat Themes](https://github.com/epam/ai-dial-chat-themes) to view a complete documentation.

Configure Themes parameters in the `themes` section of the values file.

This component is designed for customizing AI DIAL Chat themes and images, as well as hosting the necessary static files for other AI DIAL applications. To apply any changes, we recommend building your own Docker image based on this component.

## Adapters Parameters

> * Refer to the [Adapter for Bedrock](https://github.com/epam/ai-dial-adapter-bedrock) to view a complete documentation.
> * Refer to the [Adapter for Vertex](https://github.com/epam/ai-dial-adapter-vertexai) to view a complete documentation.
> * Refer to the [Adapter for OpenAI](https://github.com/epam/ai-dial-adapter-openai) to view a complete documentation.

To work with Azure, AWS or GCP models, AI DIAL uses applications called Adapters. You can configure Adapters in the `openai`,`bedrock` and `vertexai` sections.

You can modify adapters settings using environment variables.

> Refer to these repositories to learn how to configure adapters:
> * [Bedrock Model Deployment](./Bedrock%20Model%20Deployment.md#configure-adapter)
> * [OpenAI Model Deployment](./OpenAI%20Model%20Deployment.md#configure-adapter)
> * [Vertex Model Deployment](./Vertex%20Model%20Deployment.md#configure-adapter)

## Assistant Parameters

> Refer to the [AI DIAL Assistant](https://github.com/epam/ai-dial-assistant) to view a complete documentation.

You can add AI DIAL [Assistant settings](https://github.com/epam/ai-dial-assistant#environment-variables) in the `assistant` section of the AI DIAL values file. 

You can modify Assistant settings using environment variables.

## Auth Helper Parameters

> Refer to the [Auth Helper](https://github.com/epam/ai-dial-auth-helper) to view a complete documentation.

You can add [Auth Helper settings](https://github.com/epam/ai-dial-auth-helper#configure) in the `authhelper` section of the AI DIAL values file. 

You can modify Assistant settings using environment variables with [Spring style](https://docs.spring.io/spring-boot/docs/2.1.8.RELEASE/reference/html/boot-features-external-config.html).

