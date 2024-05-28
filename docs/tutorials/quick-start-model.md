# Launch AI DIAL Chat with Azure Model

## Introduction

In this tutorial, you will learn how to quickly launch AI DIAL Chat with a custom model created in Azure OpenAI Studio.

## Prerequisites

1. Docker engine installed on your machine (Docker Compose Version 2.20.0 +).
    > Refer to [Docker](https://docs.docker.com/desktop/) documentation.

2. Account in MS Azure OpenAI Studio.
    > Refer to [Create and Deploy OpenAI Model in Azure](/Deployment/OpenAI%20Model%20Deployment.md) to learn how to create and deploy a model in your MS Azure.

## Step 1: Get AI DIAL

[Download](https://github.com/epam/ai-dial/tree/main/dial-docker-compose/model/) AI DIAL.

## Step 2: Configuration

In the **dial-docker-compose/model/core** folder, you can find a [config.json](https://github.com/epam/ai-dial/tree/main/dial-docker-compose/model/core/config.json) configuration file.

In `config.json`, you can add your Azure model credentials to the chat configuration:

* Supply your **Azure API Keys** for your deployments for the `key` parameter.
* Replace `http://azure_deployment_host` with your GPT **endpoint** for the `endpoint` parameter. **Note**: in the endpoint, replace `gpt-4` with your Azure deployment name, in case it is different.

  ```json
        "upstreams": [
        {
          "endpoint": "http://azure_deployment_host/openai/deployments/gpt-4/chat/completions",
          "key": "AZURE_MODEL_API_KEY"
        }
  ]
  ```

    > Refer to [Create and Deploy OpenAI Model in Azure](/Deployment/OpenAI%20Model%20Deployment.md) to learn how to create and deploy a model in MS Azure.

## Step 3: Launch AI DIAL Chat

1. Run `docker compose up` from the folder with the [docker-compose file](https://github.com/epam/ai-dial/blob/main/dial-docker-compose/model/docker-compose.yml).
2. Open http://localhost:3000/ in your browser to launch the AI DIAL Chat application.
