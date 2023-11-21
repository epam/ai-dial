# Quick Start Guide

In this tutorial, you will learn how to quickly launch AI DIAL Chat.

> Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat) documentation to learn more about AI DIAL Chat and how to launch it with the default configuration.

**Other quick start guides**: 

> * To learn how to use AI DIAL Chat with Addons, refer to [AI DIAL Quick Start Guide for Addons](./quick-start-with-addon.md)
> * To learn how to develop applications for AI DIAL and deploy them, refer to [Create your first application for AI DIAL](./quick-start-with-application.md)

## Prerequisites

1. Docker engine installed on your machine.
    > Refer to [Docker](https://docs.docker.com/desktop/) documentation.

2. Azure OpenAI deployment.
    > Refer to [Create and Deploy OpenAI Model in Azure](./Deployment/Azure%20Model%20Deployment.md) to learn how to create and deploy a model.

## Step 1: Get Docker Compose

[Download](https://github.com/epam/ai-dial/tree/main/docs/dial-docker-compose/model/) AI DIAL Docker Compose.

## Step 2: Configuration

In the **dial-docker-compose/model/core** folder, you can find a [config.json](https://github.com/epam/ai-dial/tree/main/docs/dial-docker-compose/model/core/config.json) configuration file. 

In `config.json`:

* Supply your **Azure API Keys** for your deployments for the `key` parameter.
* Replace `https://AZURE_DEPLOYMENT_URL` with your GPT **endpoint** for the `endpoint` parameter. **Note**: in the endpoint, replace `gpt-4` with your Azure deployment name, in case it is different.

  ```json
        "upstreams": [
        {
          "endpoint": "https://AZURE_DEPLOYMENT_URL/openai/deployments/gpt-4/chat/completions",
          "key": "AZURE_MODEL_API_KEY"
        }
  ]
  ```

    > Refer to [Create and Deploy OpenAI Model in Azure](./Deployment/Azure%20Model%20Deployment.md) to learn how to create and deploy a model.


## Step 3: Lauch AI DIAL Chat

1. Run `docker compose up` from the folder with the `docker compose` file (**dial-docker-compose/dial**).
2. Open http://localhost:3000/ in your browser to launch the AI DIAL Chat application.
