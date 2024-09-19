# Launch AI DIAL Chat with a Self-Hosted Model

## Introduction

In this tutorial, you will learn how to quickly launch AI DIAL Chat with a self-hosted model powered by [Ollama](https://ollama.com/).

## Prerequisites

Docker engine installed on your machine (Docker Compose Version 2.20.0 +).

> Refer to [Docker](https://docs.docker.com/desktop/) documentation.

## Step 1: Get AI DIAL

Clone [the repository](https://github.com/epam/ai-dial/) with the tutorials and change directory to the following folder:

```sh
cd dial-docker-compose/ollama
```

## Step 2: Choose a model to run

Ollama supports a wide range of popular open-source models.

Consider first the modality your are interested in - is it a regular text-to-text chat model, a multi-modal vision model or an embedding model?

Follow the feature tags _(`Embeddings`, `Code`, `Tools`, `Vision`)_ at [Ollama Search](https://ollama.com/search) to find the appropriate model.

We recommend choosing one of the following models which have been tested.

### Chat models

|Model|Tools|
|----|----|
|[llama3.1:8b-instruct-q4_0](https://ollama.com/library/llama3.1:8b-instruct-q4_0)|✅ *(only in non-streaming mode)*|
|[mistral:7b-instruct-q4_0](https://ollama.com/library/mistral:7b-instruct-q4_0)|❌|
|[phi3.5:3.8b-mini-instruct-q4_0](https://ollama.com/library/phi3.5:3.8b-mini-instruct-q4_0)|❌|
|[gemma2:2b-instruct-q4_0](https://ollama.com/library/gemma2:2b-instruct-q4_0)|❌|

All the models support streaming.

### Vision models

* [llava:7b-v1.6-mistral-q4_0](https://ollama.com/library/llava:7b-v1.6-mistral-q4_0)
* [llava-phi3:3.8b-mini-q4_0](https://ollama.com/library/llava-phi3:3.8b-mini-q4_0)

### Embedding models

* [nomic-embed-text:137m-v1.5-fp16](https://ollama.com/library/nomic-embed-text:137m-v1.5-fp16)
* [bge-m3:567m-fp16](https://ollama.com/library/bge-m3:567m-fp16)

## Step 3: Launch AI DIAL Chat

1. Configure `.env` file in the current directory according to the type of model you've chosen:

    * Set `OLLAMA_CHAT_MODEL` for the name of a text model.
    * Set `OLLAMA_VISION_MODEL` for the name of a vision model.
    * Set `OLLAMA_EMBEDDING_MODEL` for the name of an embedding model.
    
    **Note**: It's not necessary to configure all the models. If a model isn't set, then it won't be downloaded.

2. Then run the following command to pull and load into the memory of the Ollama server the specified models:

    ```sh
    docker compose up --abort-on-container-exit
    ```

    > Keep in mind that a typical size of a lightweight Ollama model is around a few gigabytes. So it may take a few minutes _(or dozens of minutes)_ to download them on the first run depending on your Internet bandwidth.

3. Finally, open http://localhost:3000/ in your browser to launch the AI DIAL Chat application and select an appropriate AI DIAL deployments to converse with:

    * `Self-hosted chat model` deployment for the `OLLAMA_CHAT_MODEL`
    * `Self-hosted vision model` deployment for the `OLLAMA_VISION_MODEL`

The embedding model will become available in AI DIAL under the deployment name `embedding-model` and could be called via the endpoint: `localhost:8080/openai/deployments/embedding-model/embeddings`.