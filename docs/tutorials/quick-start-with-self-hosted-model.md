# Launch AI DIAL Chat with a self-hosted model

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

Follow the feature tags _(`Embeddings`, `Code`, `Tools`, `Vision`)_ at https://ollama.com/search to find an appropriate model.

We recommend to choose one of the following models which have been tested.

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

### Chat model

If you have chosen a regular chat model _(e.g. llama3.1:8b-instruct-q4_0)_, then run the command:

```sh
OLLAMA_CHAT_MODEL=model_of_your_choice docker compose up --abort-on-container-exit
```

The model will be pulled and loaded into the memory of the Ollama server automatically. This may take a minute on the first run.

Finally, open http://localhost:3000/ in your browser to launch the AI DIAL Chat application and select `Self-hosted chat model` deployment to converse with the model.

### Vision model

If you have chosen a vision model _(e.g. llava-phi3:3.8b-mini-q4_0)_, then run the command:

```sh
OLLAMA_VISION_MODEL=model_of_your_choice docker compose up --abort-on-container-exit
```

The model will be pulled and loaded into the memory of the Ollama server automatically. This may take a minute on the first run.

Finally, open http://localhost:3000/ in your browser to launch the AI DIAL Chat application and select `Self-hosted vision model` deployment to converse with the model.

> Note, that the vision models we tested, do not support streaming of response. Moreover, they are typically more computationally expensive than the chat models. So it may take minutes for a vision model to respond.

### Embedding model

If you have chosen an embedding model _(e.g. nomic-embed-text:137m-v1.5-fp16)_, then run the command:

```sh
OLLAMA_EMBEDDING_MODEL=model_of_your_choice docker compose up --abort-on-container-exit
```

The model will be pulled and loaded into the memory of the Ollama server automatically. This may take a minute on the first run.

The embedding model will become available in DIAL under the deployment name `embedding-model` and could be called via the endpoint: `localhost:8080/openai/deployments/embedding-model/embeddings`.