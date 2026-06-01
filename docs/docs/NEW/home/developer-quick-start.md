---
title: "Developer quick start"
type: tutorial
persona: app-dev
component: core
last_verified: 2026-06-01
owner: "@dial-docs-team"
---

# Developer quick start

In this tutorial, you will run DIAL locally with Docker Compose and chat with a sample application through DIAL Chat. By the end, you will have DIAL Chat open at `http://localhost:3000` and an Echo application that mirrors every prompt you send. This is the fastest way to see DIAL working on your own machine. No cloud account or model API key is required.

:::tip
Want to skip the local setup? Try the hosted [DIAL SaaS edition](https://chat.dialx.ai/) in your browser instead.
:::

## Prerequisites

- Docker Engine with Docker Compose v2.20.0 or higher. See the [Docker documentation](https://docs.docker.com/desktop/).
- A free TCP port `3000` (DIAL Chat) and `8080` (DIAL Core) on your machine.

## What you'll build

A local DIAL stack — DIAL Core, DIAL Chat, Redis, and chat themes — running the [Echo application](https://github.com/epam/ai-dial/tree/main/dial-docker-compose/application/echo), which repeats back whatever you type. This is the canonical "hello world" for the platform.

## Step 1: Get the Docker Compose files

Download the [`dial-docker-compose/application`](https://github.com/epam/ai-dial/tree/main/dial-docker-compose/application/) folder from the DIAL repository. It contains the `docker-compose.yml` file and the Echo application source.

**Verify:** the folder contains `docker-compose.yml` and an `echo/` directory.

## Step 2: Launch DIAL

From the folder that contains `docker-compose.yml`, start the stack:

```bash
docker compose up
```

Docker pulls the DIAL Core, DIAL Chat, themes, and Redis images, then builds and starts the Echo application. The first run takes a few minutes while images download.

**Verify:** the logs show the `core` and `chat` services started, with no errors.

## Step 3: Open DIAL Chat

Open `http://localhost:3000` in your browser.

**Verify:** the DIAL Chat interface loads and the Marketplace is reachable from the left sidebar.

## Step 4: Chat with the Echo application

1. Open the [Marketplace](/docs/platform/4.chat/1.marketplace.md) from the sidebar.
2. Select **My Echo App**.
3. Type a prompt and send it.

**Verify:** the Echo application returns your message unchanged. You now have a working DIAL deployment.

## How it fits together

DIAL Core reads its configuration from a `config.json` file. In this setup, the Echo application is registered as a [deployment](/docs/platform/3.core/2.access-control-intro.md) that DIAL Core exposes through the [Unified API](/docs/platform/3.core/0.about-core.md):

```json
"echo": {
    "displayName": "My Echo App",
    "description": "Simple application that repeats user's message",
    "endpoint": "http://echo:5000/openai/deployments/echo/chat/completions"
}
```

Every model and application in DIAL is registered the same way and is reachable through the same Unified API. That uniformity is what lets any app call any model — or any other app — without custom integration.

## What you learned

- How to run a complete DIAL stack locally with Docker Compose
- How to open DIAL Chat and select an application from the Marketplace
- How DIAL Core registers an application as a deployment behind the Unified API

## Next steps

- [DIAL Apps overview](../building-with-dial/apps/index) — understand Custom Apps, Quick Apps, Code Apps, and Mind Map Studio
- [Building with DIAL](../building-with-dial/index) — tutorials and how-tos for building your own applications
- [DevOps quick start](devops-quick-start) — call the same deployment through the Unified API with `curl`
