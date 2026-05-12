---
title: "Create a Quick App 2.0 via API"
type: how-to
persona: app-dev
component: apps
last_verified: 2026-05-12
owner: "@dial-docs-team"
---

# Create a Quick App 2.0 via API

This guide covers creating and managing Quick App 2.0 instances programmatically through the DIAL Core API.

To create a Quick App 2.0 using the visual wizard instead, see [Create in DIAL Chat](./create-via-ui). To provision Quick App 2.0 through infrastructure configuration, see [Create via config.json](./create-via-config).

## Prerequisites

- A running DIAL instance with the Quick Apps 2.0 executor service deployed.
- **DIAL Core URL** — the base URL of your DIAL Core API (e.g., `https://dial.example.com`). If you access DIAL Chat at `https://chat.dial.example.com`, the Core API is typically at `https://dial.example.com` (without `/chat`). Ask your DIAL administrator for the exact URL.
- **API key** — an API key for authenticating against DIAL Core. Your DIAL administrator provides this, or you can find it in the DIAL Admin panel under API keys. Set it as an environment variable: `export DIAL_API_KEY="your-key"`.
- At least one language model deployed and available in your DIAL instance.

---

## Create a Quick App 2.0

Send a `POST` request to the applications endpoint with the Quick App 2.0 schema ID and configuration.

**Endpoint:** `POST /v1/applications/{appId}`

Replace `{appId}` with a unique identifier for your app. Use lowercase letters, numbers, and hyphens (e.g., `research-assistant`).

### Minimal example

This creates a simple assistant with a model and system prompt, no tools:

```bash
curl -X POST "https://dial.example.com/v1/applications/my-assistant" \
  -H "Content-Type: application/json" \
  -H "api-key: ${DIAL_API_KEY}" \
  -d '{
    "displayName": "My Assistant",
    "description": "A simple helpful assistant.",
    "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps2",
    "applicationProperties": {
      "orchestrator": {
        "deployment": {
          "name": "gpt-4o-mini",
          "parameters": {
            "temperature": 0.5
          }
        },
        "system_prompt": {
          "type": "custom",
          "variables": {},
          "content": "You are a helpful assistant. Answer questions clearly and concisely."
        }
      },
      "contexts": [],
      "tool_sets": []
    }
  }'
```

**Expected response** (HTTP 200):

```json
{
  "name": "my-assistant",
  "displayName": "My Assistant",
  "description": "A simple helpful assistant.",
  "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps2",
  "applicationProperties": {
    "orchestrator": {
      "deployment": {
        "name": "gpt-4o-mini",
        "parameters": { "temperature": 0.5 }
      },
      "system_prompt": {
        "type": "custom",
        "variables": {},
        "content": "You are a helpful assistant. Answer questions clearly and concisely."
      }
    },
    "contexts": [],
    "tool_sets": []
  }
}
```

### Example with REST API tools

This creates a weather assistant that calls the Open-Meteo API:

```bash
curl -X POST "https://dial.example.com/v1/applications/weather-assistant" \
  -H "Content-Type: application/json" \
  -H "api-key: ${DIAL_API_KEY}" \
  -d '{
    "displayName": "Weather Assistant",
    "description": "Looks up current weather for any location.",
    "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps2",
    "applicationProperties": {
      "orchestrator": {
        "deployment": {
          "name": "gpt-4o-mini",
          "parameters": { "temperature": 0.3 }
        },
        "system_prompt": {
          "type": "custom",
          "variables": {},
          "content": "You are a weather assistant. Use the get_weather tool to look up current conditions. Always state the location and temperature in your response."
        },
        "max_iterations": 10
      },
      "contexts": [],
      "tool_sets": [
        {
          "name": "weather-api",
          "type": "rest-api",
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
                  "description": "Get current weather for a location by latitude and longitude.",
                  "parameters": {
                    "type": "object",
                    "properties": {
                      "latitude": {
                        "type": "number",
                        "description": "Latitude of the location.",
                        "parameter_info": { "type": "query", "key": "latitude" }
                      },
                      "longitude": {
                        "type": "number",
                        "description": "Longitude of the location.",
                        "parameter_info": { "type": "query", "key": "longitude" }
                      },
                      "current": {
                        "type": null,
                        "const": "temperature_2m,wind_speed_10m",
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
      "starters": [
        "What is the weather in London?",
        "Current temperature in Tokyo?"
      ]
    }
  }'
```

### Example with MCP tools

This creates an app that connects to an external MCP server:

```bash
curl -X POST "https://dial.example.com/v1/applications/mcp-assistant" \
  -H "Content-Type: application/json" \
  -H "api-key: ${DIAL_API_KEY}" \
  -d '{
    "displayName": "MCP Assistant",
    "description": "Connects to an MCP server for data access.",
    "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps2",
    "applicationProperties": {
      "orchestrator": {
        "deployment": {
          "name": "gpt-4o-mini",
          "parameters": { "temperature": 0.3 }
        },
        "system_prompt": {
          "type": "custom",
          "variables": {},
          "content": "You have access to tools provided by an MCP server. Use them to answer user questions."
        }
      },
      "contexts": [],
      "tool_sets": [
        {
          "name": "my-mcp-tools",
          "type": "mcp",
          "mcp_server_info": {
            "url": "https://mcp-server.example.com/mcp",
            "protocol": "streamable_http",
            "authorization": {
              "type": "bearer",
              "token": "your-token-here"
            }
          },
          "allowed_tools": ["search", "fetch_page"]
        }
      ]
    }
  }'
```

---

## Retrieve a Quick App

**Endpoint:** `GET /v1/applications/{appId}`

```bash
curl "https://dial.example.com/v1/applications/weather-assistant" \
  -H "api-key: ${DIAL_API_KEY}"
```

---

## List all Quick Apps

**Endpoint:** `GET /v1/applications`

```bash
curl "https://dial.example.com/v1/applications" \
  -H "api-key: ${DIAL_API_KEY}"
```

---

## Update a Quick App

Use the same `POST /v1/applications/{appId}` endpoint with the updated configuration. The request replaces the entire application definition.

To update just the system prompt, send the full configuration with the new `system_prompt.content` value:

```bash
curl -X POST "https://dial.example.com/v1/applications/my-assistant" \
  -H "Content-Type: application/json" \
  -H "api-key: ${DIAL_API_KEY}" \
  -d '{
    "displayName": "My Assistant",
    "description": "A simple helpful assistant.",
    "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps2",
    "applicationProperties": {
      "orchestrator": {
        "deployment": {
          "name": "gpt-4o-mini",
          "parameters": { "temperature": 0.5 }
        },
        "system_prompt": {
          "type": "custom",
          "variables": {},
          "content": "You are a helpful assistant specializing in technical documentation. Answer questions clearly and provide code examples when relevant."
        }
      },
      "contexts": [],
      "tool_sets": []
    }
  }'
```

---

## Delete a Quick App

**Endpoint:** `DELETE /v1/applications/{appId}`

```bash
curl -X DELETE "https://dial.example.com/v1/applications/my-assistant" \
  -H "api-key: ${DIAL_API_KEY}"
```

---

## Common errors

| HTTP status | Cause | Fix |
|---|---|---|
| 400 | Invalid `applicationProperties` — schema validation failed. | Check the JSON against the [configuration reference](./tool-sets/reference). Common issues: missing required fields (`orchestrator`, `contexts`, `tool_sets`), invalid `type` values in tool sets. |
| 401 | Missing or invalid API key. | Verify `api-key` header or bearer token. |
| 404 | Application not found (for GET/DELETE). | Check the `appId` is correct. |
| 409 | Application with this ID already exists. | Use a different `appId` or update the existing app. |

---

## Next steps

- [Create in DIAL Chat](./create-via-ui) — visual wizard walkthrough
- [Create via config.json](./create-via-config) — provision through infrastructure configuration
- [Add tools and agents](./working-with-tools-and-agents) — connect MCP servers, REST APIs, and DIAL deployments
- [Configuration reference](./tool-sets/reference) — full schema documentation
- [DIAL Core API reference](https://dialx.ai/dial_api#tag/Applications) — complete API documentation
