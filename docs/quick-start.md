# Quick Start

Follow this tutorial to launch AI DIAL Chat with Echo application. As a result, you will be able to access Chat on http://localhost:3000/ and use Echo application to mirror your prompts.

> * To learn more, watch a [demo video](../video%20demos/demos-for-developers/deploy-ollama) to see how to deploy a chat application with a self-hosted model.
> * Refer to other quick start instructions in [Tutorials](./tutorials/quick-start-with-application).


## Prerequisites

1. Docker engine (Docker Compose Version 2.20.0 +) installed on your machine. Refer to [Docker](https://docs.docker.com/desktop/) documentation.

## Step 1: Get AI DIAL

[Download](https://github.com/epam/ai-dial/tree/main/dial-docker-compose/application/) AI DIAL.

## Step 2: Launch Chat

Run `docker compose up` in the console from the folder with the `docker-compose.yml` file.

Once AI DIAL Chat is up on http://localhost:3000/, select the Echo Application and start typing in prompts to see how the Echo application mirrors them.

![](./img/dial-chat-local.png)