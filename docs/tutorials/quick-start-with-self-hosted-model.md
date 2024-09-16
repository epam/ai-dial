# Launch AI DIAL Chat with a self-hosted model

## Introduction

In this tutorial, you will learn how to quickly launch AI DIAL Chat with a self-hosted model powered by [Ollama](https://ollama.com/).

## Prerequisites

Docker engine installed on your machine (Docker Compose Version 2.20.0 +).

> Refer to [Docker](https://docs.docker.com/desktop/) documentation.

## Step 1: Get AI DIAL

[Download](https://github.com/epam/ai-dial/tree/main/dial-docker-compose/ollama/) AI DIAL.

## Step 2: Launch AI DIAL Chat

Run `docker compose up` from the folder with the [docker-compose file](https://github.com/epam/ai-dial/blob/main/dial-docker-compose/ollama/docker-compose.yml).

> By default a lightweight [llama3:8b-instruct-q2_K](https://ollama.com/library/llama3:8b-instruct-q2_K) model will be pulled and loaded into the memory of the Ollama server automatically.
>
> You could specify the model via the environment variable `OLLAMA_MODEL`:
>
> ```sh
> OLLAMA_MODEL=model_of_your_choice docker compose up
> ```
>
> Find the available models at the [Ollama model library](https://ollama.com/library).

Finally, open http://localhost:3000/ in your browser to launch the AI DIAL Chat application and chat with the model.