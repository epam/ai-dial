# AI DIAL Quick Start Guide

In this tutorial, you will learn how to quickly launch AI DIAL Chat.

> Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat) documentation to learn more.

## Prerequisites

1. Docker engine installed on your machine.
    > Refer to [Docker](https://docs.docker.com/desktop/) documentation.

2. Azure OpenAI deployment.
    > Refer to [Create and Deploy OpenAI Model in Azure](https://github.com/epam/ai-dial/blob/documentation/deployment/Azure%20Model%20Deployment.md) to learn how to create and deploy a model.

## Step 1: Get Docker Compose

[Download](https://github.com/epam/ai-dial/tree/documentation/dial-docker-compose) AI DIAL Docker Compose.

## Step 2: Configuration

In the **dial-docker-compose/dial/core** folder, you can find a `config.json` configuration file. 

In `config.json`:

* Supply your **Azure API Keys** for your deployments for the `key` parameter.
* Replace `https://AZURE_DEPLOYMENT_URL` with your GPT **endpoint** for the `endpoint` parameter. **Note**: in the endpoint, replace `gpt-4` with your Azure deployment name, in case it is different.

  ```json
        "upstreams": [
        {
          "endpoint": "https://AZURE_DEPLOYMENT_URL/openai/deployments/gpt-4/chat/completions",
          "key": "AZURE_MODEL_API_KEY"
        }
  ```

    > Refer to [Create and Deploy OpenAI Model in Azure](#create-and-deploy-openai-model-in-azure) to learn how to create and deploy a model.


## Step 3: Lauch AI DIAL Chat

1. Run `docker compose up` from the folder with the `docker compose` file (**dial-docker-compose/dial**).
2. Open http://localhost:3000/ in your browser to launch the AI DIAL Chat application.
