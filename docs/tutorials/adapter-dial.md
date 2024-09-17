# Developing with AI DIAL adapter dial

## About adapter 

Adapter dial is a useful instrument during development process related to any Dial entity. Wherever you are developing dial-based application or using local Dial instalation you no longer need to request/deploy/configure LLM models for yourself. AI DIAL adapter dial gives opportunity to call from one DIAL Core to another DIAL Core and be able to use any model that is in scope of your API key.

> Refer to [AI DIAL adapter dial](https://github.com/epam/ai-dial-adapter-dial) repository for more information.

## How to configure local core adapter dial

### Prerequisites

1. Remote Dial core url (already configured with models)
    > Example: core.your-company.com

2. API key for the remote core
    > Example: "YourAPIKeyForRemoteCore"

Access to the remote DIAL Core server is specified by env vars $REMOTE_DIAL_URL and $REMOTE_DIAL_API_KEY.

Run the following command to generate local DIAL Core config core/config.json based on the listing from the remote DIAL Core:

    REMOTE_DIAL_URL="url" REMOTE_DIAL_API_KEY="key" ./generate_config_from_listing.sh

The script could be found [here](https://github.com/epam/ai-dial-adapter-dial/tree/development/docker-compose/local).

Modify the generated core/config.json as you see fit: add required models and applications hosted by the remote DIAL server, configure locally hosted applications.

Run your DIAL 