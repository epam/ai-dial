# DIAL-to-DIAL Adapter

## Introduction

When developing AI DIAL applications or working with a local deployment of AI DIAL, this DIAL-to-DIAL adapter simplifies the process by eliminating the need to manually request, deploy, or configure LLM models. It facilitates communication between two instances of AI DIAL Core, allowing you to access and utilize any model available in a remote AI DIAL Core within the scope of your API key.

> Refer to [AI DIAL Adapter repository](https://github.com/epam/ai-dial-adapter-dial) to learn how to configure and run this adapter.

> Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core) to view all the configuration parameters.

## Configuration

In this section, you can learn how to configure a local AI DIAL Core Adapter.

### Prerequisites

1. Ensure that you have a URL for a remote AI DIAL Core where models are already configured. Example: core.your-company.com
2. Make sure you possess an API key for the remote AI DIAL Core. Example: "YourAPIKeyForRemoteCore"

### Configuration Steps

> In the [DIAL Adapter repository](https://github.com/epam/ai-dial-adapter-dial/tree/development/docker-compose/local) you can find additional information and source files.

1. Access to the remote AI DIAL Core server is determined by the environment variables `$REMOTE_DIAL_URL` and `$REMOTE_DIAL_API_KEY`.
2. Run the following command to generate a **local** version of the remote AI DIAL Core configuration file `core/config.json`. 

    ```bash
    REMOTE_DIAL_URL="url" REMOTE_DIAL_API_KEY="key" ./generate_config_from_listing.sh
    ```

3. Modify the generated `core/config.json` as you see fit. For example, you might want to add models and applications hosted by the remote AI DIAL server, or configure locally-hosted applications.
4. Run your local AI DIAL.

    ```bash
    docker compose up --abort-on-container-exit
    ```