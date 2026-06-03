---
title: "Create and configure a Quick App"
type: tutorial
persona: app-dev
component: apps
last_verified: 2026-05-29
owner: "@dial-docs-team"
---

# Create and configure a Quick App

This tutorial walks you through creating a Quick App using the original schema (`$id: https://mydial.epam.com/custom_application_schemas/quickapps`). It covers three methods — UI, API, and config.json — each as a self-contained walkthrough.

**Tip**
> For new applications, [Quick App 2.0](../quick-app-2/create-via-ui.md) is recommended. It offers an orchestrator-based architecture, a richer tool set model, and a full visual editor. The original Quick App is still fully supported for existing applications and use cases that require client-side tools.


## When to use the original Quick App

The original Quick App is the right choice when:

- You need **client-side tools** (`client_toolset`) — these are not supported in Quick App 2.0.
- You need **condition-based tool selection** (regex matching on deployment ID, display name, or description) — Quick App 2.0 requires explicit deployment IDs.
- You are maintaining an existing Quick App and do not want to migrate yet.

For all other cases, use [Quick App 2.0](../quick-app-2/create-via-ui.md).

---

## Create via UI

### Prerequisites

- Access to a running DIAL Chat instance (your organization's URL, e.g., `https://chat.dial.example.com`). You need a valid user account — Quick App creation requires authentication.
- At least one language model must be deployed in your DIAL instance (e.g., `gpt-4o-mini`). Your DIAL administrator configures available models.

### Step 1 — Open the Quick App wizard

1. Open DIAL Chat in your browser and sign in.
2. In the left sidebar, click the **+** button (or the application selector).
3. From the dropdown, select **Quick App** (not "Quick App 2.0").

The wizard opens with a two-step form.

### Step 2 — Fill in General info

The first screen asks for basic metadata about your app:

| Field | Required | What to enter |
|---|---|---|
| **Name** | Yes | A display name for your app (e.g., `Weather Assistant`). |
| **Version** | Yes | A version string (e.g., `1.0.0`). |
| **Icon** | No | Upload a custom icon image. |
| **Description** | No | A short description shown in the app card. |
| **Topics** | No | Tags for categorization in the Marketplace. |

A preview of the app card appears on the right side of the screen.

Click **Next** to proceed.

### Step 3 — Configure App settings

The second screen is where you configure the app's behavior:

**Document relative URLs** (optional) — attach files for RAG (Retrieval Augmented Generation). Click **+ Add** and enter the relative path of a file stored in DIAL (e.g., `files/mybucket/knowledge-base.pdf`). When configured, the app automatically gets a `query_document` tool to search the file contents.

**Model** (required) — select a language model from the dropdown. This is the model the app uses to generate responses.

**Configure toolsets** — this section has two tabs, **Web API** and **MCP**. Each tab contains a JSON code editor (initially showing `[]`). You paste tool configuration JSON directly into these editors.

To add a Web API tool, click the **Web API** tab and replace `[]` with a JSON array of `RestApiToolset` objects. For example, to add a weather API tool, paste the following:

```json
[
  {
    "type": "rest-api",
    "name": "weather",
    "authorization": null,
    "tools": [
      {
        "rest_api_method_info": {
          "method_url": "https://api.open-meteo.com/v1/forecast",
          "method_type": "get"
        },
        "open_ai_tool": {
          "type": "function",
          "function": {
            "name": "get_weather",
            "description": "Get current weather by latitude and longitude.",
            "parameters": {
              "type": "object",
              "properties": {
                "latitude": {
                  "type": "number",
                  "description": "Latitude.",
                  "parameter_info": { "type": "query", "key": "latitude" }
                },
                "longitude": {
                  "type": "number",
                  "description": "Longitude.",
                  "parameter_info": { "type": "query", "key": "longitude" }
                },
                "current": {
                  "type": null,
                  "const": "temperature_2m",
                  "parameter_info": { "type": "query", "key": "current" }
                }
              },
              "required": ["latitude", "longitude"]
            }
          }
        }
      }
    ]
  }
]
```

To add an MCP server connection, click the **MCP** tab and replace `[]` with a JSON array of `MCPToolsetInfo` objects. For example:

```json
[
  {
    "name": "my-mcp-server",
    "type": "mcp",
    "mcp_server_info": {
      "url": "https://mcp-server.example.com/mcp",
      "protocol": "streamable_http",
      "authorization": {
        "type": "bearer",
        "token": "your-token-here"
      }
    },
    "allowed_tools": ["search"]
  }
]
```

Replace the `url` with the actual URL of your MCP server, and update the `authorization` with your credentials. If you do not have an MCP server to connect, leave the MCP editor as `[]`.

**Tip**
> Both code editors have a fullscreen/expand button for easier editing of large JSON configurations.


**Instructions** (required) — write the system prompt that guides the model's behavior. For the weather example above, enter:

```
You are a weather assistant. Use the get_weather tool to look up current conditions. Always state the location and temperature in your response.
```

**Temperature** — adjust the slider between **Precise** (0.0) and **Creative** (1.0). For factual tasks like weather lookup, keep it on the lower end (0.2–0.4). For creative writing, use 0.7–1.0.

The preview panel on the right shows a "Talk to your agent" input — you can test the app directly before saving.

Click **Save and exit** in the top-right corner.

### Result

Your Quick App is saved to your personal workspace and is private by default. It appears in the app list in DIAL Chat. To share it with other users, publish it through the Marketplace workflow.

---

## Create via API

### Prerequisites

- **DIAL Core URL** — the base URL of your DIAL Core API. If you access DIAL Chat at `https://chat.dial.example.com`, the Core API is typically at `https://dial.example.com` (without `/chat`). Ask your DIAL administrator for the exact URL.
- **API key** — an API key for authenticating against DIAL Core. Your DIAL administrator provides this, or you can find it in the DIAL Admin panel under API keys.
- A running DIAL instance with the Quick Apps executor service deployed.
- `curl` or any HTTP client.

### Verify your connection

Before creating an app, verify that you can reach the API and your credentials work:

```bash
curl "https://dial.example.com/v1/models" \
  -H "api-key: ${DIAL_API_KEY}"
```

Replace `https://dial.example.com` with your DIAL Core URL. Set the `DIAL_API_KEY` environment variable with your API key:

```bash
export DIAL_API_KEY="your-api-key-here"
```

You should see a JSON response listing available models. If you get a `401` error, check your API key. If the connection times out, check the URL with your administrator.

### Create a minimal Quick App

Send a `POST` request to the DIAL Core applications endpoint.

**Endpoint:** `POST /v1/applications/{appId}`

Replace `{appId}` with a unique identifier for your app. Use lowercase letters, numbers, and hyphens (e.g., `my-qa-app`).

```bash
curl -X POST "https://dial.example.com/v1/applications/my-qa-app" \
  -H "Content-Type: application/json" \
  -H "api-key: ${DIAL_API_KEY}" \
  -d '{
    "displayName": "My Quick App",
    "description": "A simple assistant using the original Quick App schema.",
    "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps",
    "applicationProperties": {
      "temperature": 0.7,
      "instructions": "You are a helpful assistant. Answer questions clearly and concisely.",
      "model": "gpt-4o-mini",
      "web_api_toolset": []
    }
  }'
```

Replace `gpt-4o-mini` with a model deployment ID available in your DIAL instance (the one returned by the `GET /v1/models` call above).

### Create a Quick App with tools

This creates a Quick App with a REST API tool, an MCP server, and another DIAL app used as a tool:

```bash
curl -X POST "https://dial.example.com/v1/applications/research-app" \
  -H "Content-Type: application/json" \
  -H "api-key: ${DIAL_API_KEY}" \
  -d '{
    "displayName": "Research App",
    "description": "Research assistant with web API, MCP, and DIAL app tools.",
    "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps",
    "applicationProperties": {
      "temperature": 0.5,
      "instructions": "You are a research assistant. Use the available tools to gather information and provide well-sourced answers.",
      "model": "gpt-4o-mini",
      "web_api_toolset": [
        {
          "type": "rest-api",
          "name": "weather-api",
          "authorization": null,
          "tools": [
            {
              "rest_api_method_info": {
                "method_url": "https://api.open-meteo.com/v1/forecast",
                "method_type": "get"
              },
              "open_ai_tool": {
                "type": "function",
                "function": {
                  "name": "get_weather",
                  "description": "Get current weather by latitude and longitude.",
                  "parameters": {
                    "type": "object",
                    "properties": {
                      "latitude": {
                        "type": "number",
                        "description": "Latitude",
                        "parameter_info": { "type": "query", "key": "latitude" }
                      },
                      "longitude": {
                        "type": "number",
                        "description": "Longitude",
                        "parameter_info": { "type": "query", "key": "longitude" }
                      },
                      "current": {
                        "type": null,
                        "const": "temperature_2m",
                        "parameter_info": { "type": "query", "key": "current" }
                      }
                    },
                    "required": ["latitude", "longitude"]
                  }
                }
              }
            }
          ]
        }
      ],
      "mcp_toolset": [
        {
          "name": "my-mcp-server",
          "type": "mcp",
          "mcp_server_info": {
            "url": "https://mcp-server.example.com/mcp",
            "protocol": "streamable_http",
            "authorization": {
              "type": "bearer",
              "token": "your-token"
            }
          },
          "allowed_tools": ["search"]
        }
      ],
      "applications_as_tools": ["dial-rag"],
      "starters": [
        "Search for recent AI news",
        "What is the weather in Berlin?"
      ]
    }
  }'
```

### Example with condition-based tool selection

The original Quick App supports selecting DIAL deployments by matching conditions — a feature not available in Quick App 2.0:

```json
{
  "applications_as_tools": [
    {
      "conditions": [
        {
          "condition_type": "match",
          "property_name": "description",
          "expression": ".*RAG.*"
        }
      ]
    },
    {
      "conditions": [
        {
          "condition_type": "type",
          "deployment_type": "model"
        }
      ]
    }
  ]
}
```

This configuration adds all deployments whose description contains "RAG" and all model deployments as available tools.

### Example with client-side tools

Client-side tools execute in the user's browser. This is unique to the original Quick App:

```json
{
  "client_toolset": [
    {
      "name": "get_user_location",
      "description": "Gets the user's current geographic location from the browser.",
      "parameters": [
        {
          "name": "precision",
          "description": "Location precision: 'city' or 'exact'.",
          "parameter_type": "string"
        }
      ]
    }
  ]
}
```

### Retrieve, update, and delete

**Retrieve:**

```bash
curl "https://dial.example.com/v1/applications/my-qa-app" \
  -H "api-key: ${DIAL_API_KEY}"
```

**Update** — send a `POST` to the same endpoint with the full updated configuration (replaces the entire definition):

```bash
curl -X POST "https://dial.example.com/v1/applications/my-qa-app" \
  -H "Content-Type: application/json" \
  -H "api-key: ${DIAL_API_KEY}" \
  -d '{ ... updated configuration ... }'
```

**Delete:**

```bash
curl -X DELETE "https://dial.example.com/v1/applications/my-qa-app" \
  -H "api-key: ${DIAL_API_KEY}"
```

### Common errors

| HTTP status | Cause | Fix |
|---|---|---|
| 400 | Invalid `applicationProperties` — schema validation failed. | Check the JSON against the [configuration reference](./reference). |
| 401 | Missing or invalid API key. | Verify the `api-key` header value. |
| 404 | Application not found (for GET/DELETE). | Check the `appId` in the URL. |
| 409 | Application with this ID already exists. | Use a different `appId` or update the existing app with POST. |

---

## Create via config.json

Use this method when you manage DIAL infrastructure as code (Docker Compose, Helm charts, GitOps) and want to pre-provision apps that are available immediately when DIAL Core starts.

### Prerequisites

- Access to the DIAL Core `config.json` file (see [Where is config.json?](#where-is-configjson) below).
- The Quick Apps executor service deployed and reachable from DIAL Core.
- Permission to restart DIAL Core after editing the config.

### Where is config.json?

The `config.json` file is the main configuration file for DIAL Core. Its location depends on your deployment method:

**Docker Compose** — the file is mounted into the DIAL Core container. In the [DIAL Docker Compose repository](https://github.com/epam/ai-dial/tree/main/dial-docker-compose), the default location is:

```
dial-docker-compose/
├── docker-compose.yml
└── core/
    └── config.json       ← this file
```

The `docker-compose.yml` mounts it as a volume into the `dial-core` container:

```yaml
services:
  core:
    image: epam/ai-dial-core:latest
    volumes:
      - ./core/config.json:/opt/config/config.json
```

**Kubernetes / Helm** — the config is defined in the Helm chart values and rendered into a ConfigMap. Edit your `values.yaml` file and look for the `core.config` or `config` section. The exact path depends on your Helm chart version. After changing the values, upgrade the Helm release:

```bash
helm upgrade dial-core ./charts/dial-core -f values.yaml
```

### Register the schema

Before defining individual Quick App instances, the Quick App schema must be registered in `config.json`. This tells DIAL Core where to route requests for this application type.

Add the following to the `applicationTypeSchemas` array. Replace `<quickapps-host>` with the hostname of your Quick Apps executor service (e.g., `quickapps:5000` for Docker Compose, or the Kubernetes service name):

```json
{
  "applicationTypeSchemas": [
    {
      "$schema": "https://dial.epam.com/application_type_schemas/schema#",
      "$id": "https://mydial.epam.com/custom_application_schemas/quickapps",
      "dial:applicationTypeDisplayName": "QuickApp",
      "dial:applicationTypeCompletionEndpoint": "http://<quickapps-host>/openai/deployments/quick_apps/chat/completions",
      "dial:applicationTypeConfigurationEndpoint": "http://<quickapps-host>/openai/deployments/quick_apps/configuration",
      "dial:appendApplicationPropertiesHeader": true,
      "type": "object",
      "properties": {}
    }
  ]
}
```

:::note
The `dial:appendApplicationPropertiesHeader` flag is `true` for the original Quick App, meaning DIAL Core sends the application configuration in the request header rather than via a separate fetch.
:::

### Define an application

Add an entry under `applications` that references the Quick App schema:

```json
{
  "applications": {
    "my-qa-app": {
      "displayName": "My Quick App",
      "description": "A simple assistant.",
      "endpoint": "http://<quickapps-host>/openai/deployments/quick_apps/chat/completions",
      "reference": {
        "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps"
      },
      "applicationProperties": {
        "temperature": 0.7,
        "instructions": "You are a helpful assistant.",
        "model": "gpt-4o-mini",
        "web_api_toolset": []
      }
    }
  }
}
```

### Complete working config.json

This is a full, working `config.json` with the Quick App schema, a model, one Quick App instance with a weather tool, and role-based access:

```json
{
  "applicationTypeSchemas": [
    {
      "$schema": "https://dial.epam.com/application_type_schemas/schema#",
      "$id": "https://mydial.epam.com/custom_application_schemas/quickapps",
      "dial:applicationTypeDisplayName": "QuickApp",
      "dial:applicationTypeCompletionEndpoint": "http://quickapps:5000/openai/deployments/quick_apps/chat/completions",
      "dial:applicationTypeConfigurationEndpoint": "http://quickapps:5000/openai/deployments/quick_apps/configuration",
      "dial:appendApplicationPropertiesHeader": true,
      "type": "object",
      "properties": {}
    }
  ],
  "models": {
    "gpt-4o-mini": {
      "type": "chat",
      "displayName": "GPT-4o Mini",
      "endpoint": "http://adapter-openai:5000/openai/deployments/gpt-4o-mini/chat/completions",
      "upstreams": [
        {
          "endpoint": "https://your-resource.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions",
          "key": "${AZURE_API_KEY}"
        }
      ]
    }
  },
  "applications": {
    "qa-assistant": {
      "displayName": "QA Assistant",
      "description": "A Quick App with weather API tools.",
      "endpoint": "http://quickapps:5000/openai/deployments/quick_apps/chat/completions",
      "reference": {
        "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps"
      },
      "applicationProperties": {
        "temperature": 0.5,
        "instructions": "You are a weather assistant. Use the get_weather tool to look up current conditions.",
        "model": "gpt-4o-mini",
        "web_api_toolset": [
          {
            "type": "rest-api",
            "name": "weather",
            "authorization": null,
            "tools": [
              {
                "rest_api_method_info": {
                  "method_url": "https://api.open-meteo.com/v1/forecast",
                  "method_type": "get"
                },
                "open_ai_tool": {
                  "type": "function",
                  "function": {
                    "name": "get_weather",
                    "description": "Get current weather by coordinates.",
                    "parameters": {
                      "type": "object",
                      "properties": {
                        "latitude": {
                          "type": "number",
                          "description": "Latitude",
                          "parameter_info": { "type": "query", "key": "latitude" }
                        },
                        "longitude": {
                          "type": "number",
                          "description": "Longitude",
                          "parameter_info": { "type": "query", "key": "longitude" }
                        },
                        "current": {
                          "type": null,
                          "const": "temperature_2m",
                          "parameter_info": { "type": "query", "key": "current" }
                        }
                      },
                      "required": ["latitude", "longitude"]
                    }
                  }
                }
              }
            ]
          }
        ],
        "starters": ["What is the weather in Paris?"]
      }
    }
  },
  "roles": {
    "default": {
      "limits": {
        "gpt-4o-mini": {},
        "qa-assistant": {}
      }
    }
  }
}
```

### Apply changes

After editing `config.json`, restart DIAL Core to pick up the changes:

**Docker Compose:**

```bash
docker compose restart core
```

**Kubernetes:**

```bash
kubectl rollout restart deployment/dial-core -n <namespace>
```

Then open DIAL Chat and verify the app appears in the app list.

---

## Next steps

- [Configuration reference](reference.md) — full schema documentation for the original Quick App
- [Migrate to Quick App 2.0](migrate-to-2.md) — convert an existing Quick App to the 2.0 schema
- [Quick App 2.0 documentation](../quick-app-2/create-via-ui.md) — guides for the recommended Quick App type
- [Troubleshooting](/docs/NEW/operating-dial/troubleshooting.md) — platform-wide error codes and operational failure modes
