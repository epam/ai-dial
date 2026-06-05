---
title: "Tutorial: Build an agent loop (config.json)"
type: tutorial
persona: devops
component: apps
last_verified: 2026-05-29
owner: "@dial-docs-team"
---

# Tutorial: Build an agent loop (config.json)

In this tutorial you will provision a **Research Assistant** Quick App 2.0 through DIAL Core's `config.json`. The app combines a REST API tool (weather data) and a DIAL deployment tool (summarization) in an agent loop, and is available to all users as soon as DIAL Core starts.

For the same tutorial using the UI, see [Tutorial: agent loop (UI)](tutorial-agent-loop-ui.md). For the API, see [Tutorial: agent loop (API)](tutorial-agent-loop-api.md).

## What you will build

A Research Assistant that:
- Accepts a question from the user
- Calls the weather API if the question involves weather or location
- Uses a second model to summarize long results into bullet points
- Returns a composed answer citing the tool results

Each tool call appears as a collapsible stage in DIAL Chat.

---

## Prerequisites

- Access to the DIAL Core `config.json` file. See [Where is config.json?](./create-via-config#where-is-configjson) for the file location in Docker Compose and Kubernetes deployments.
- The Quick Apps 2.0 executor service deployed and reachable from DIAL Core.
- At least one language model configured in `config.json` (e.g., `gpt-4o-mini`).
- Permission to restart DIAL Core after editing the config.

---

## Step 1: Add the Quick App 2.0 schema

If your `config.json` does not already have the Quick App 2.0 application type schema, add it to the `applicationTypeSchemas` array. Replace `<quickapps2-host>` with your executor's hostname (e.g., `quickapps:5000` for Docker Compose):

```json
{
  "applicationTypeSchemas": [
    {
      "$schema": "https://dial.epam.com/application_type_schemas/schema#",
      "$id": "https://mydial.epam.com/custom_application_schemas/quickapps2",
      "dial:applicationTypeDisplayName": "Quick App 2.0",
      "dial:applicationTypeCompletionEndpoint": "http://<quickapps2-host>/openai/deployments/quick_apps2/chat/completions",
      "dial:applicationTypeConfigurationEndpoint": "http://<quickapps2-host>/openai/deployments/quick_apps2/configuration",
      "dial:appendApplicationPropertiesHeader": false,
      "type": "object",
      "properties": {}
    }
  ]
}
```

If the schema already exists, skip to Step 2.

---

## Step 2: Add the Research Assistant application

Add the following entry under `applications` in your `config.json`:

```json
{
  "applications": {
    "research-assistant": {
      "displayName": "Research Assistant",
      "description": "Answers research questions using live data and a summarization agent.",
      "endpoint": "http://<quickapps2-host>/openai/deployments/quick_apps2/chat/completions",
      "reference": {
        "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps2"
      },
      "applicationProperties": {
        "orchestrator": {
          "deployment": {
            "name": "gpt-4o-mini",
            "parameters": { "temperature": 0.3 }
          },
          "system_prompt": {
            "type": "custom",
            "variables": {},
            "content": "You are a Research Assistant. Your job is to answer user questions accurately using the tools available to you.\n\nGuidelines:\n- For questions involving current weather or climate data for a location, use the get_weather tool.\n- For any response that is more than 200 words, use the summarize tool to condense it before responding to the user.\n- If a tool call fails, tell the user clearly and provide the best answer you can from existing knowledge.\n- Always cite the source of data when you use a tool result.\n- Be concise. Prefer bullet points over paragraphs."
          },
          "max_iterations": 10
        },
        "contexts": [],
        "tool_sets": [
          {
            "type": "rest-api",
            "name": "weather",
            "authorization": null,
            "tools": [
              {
                "type": "restapi-tool",
                "rest_api_method_info": {
                  "method_url": "https://api.open-meteo.com/v1/forecast",
                  "method_type": "get"
                },
                "open_ai_tool": {
                  "type": "function",
                  "function": {
                    "name": "get_weather",
                    "description": "Get the current temperature for a geographic location specified by latitude and longitude.",
                    "parameters": {
                      "type": "object",
                      "properties": {
                        "latitude": {
                          "type": "number",
                          "description": "Location latitude.",
                          "parameter_info": { "type": "query", "key": "latitude" }
                        },
                        "longitude": {
                          "type": "number",
                          "description": "Location longitude.",
                          "parameter_info": { "type": "query", "key": "longitude" }
                        },
                        "current": {
                          "type": null,
                          "const": "temperature_2m",
                          "parameter_info": { "type": "query", "key": "current" }
                        }
                      },
                      "required": ["latitude", "longitude", "current"]
                    }
                  }
                },
                "display": {
                  "stage": {
                    "name": "Fetching weather for ({latitude}, {longitude})",
                    "show": true
                  }
                }
              }
            ]
          },
          {
            "type": "dial-deployment",
            "name": "summarization",
            "tools": [
              {
                "type": "deployment-tool",
                "open_ai_tool": {
                  "type": "function",
                  "function": {
                    "name": "summarize",
                    "description": "Summarize a long piece of text into 3-5 concise bullet points.",
                    "parameters": {
                      "type": "object",
                      "properties": {
                        "text": {
                          "type": "string",
                          "description": "The text to summarize."
                        }
                      },
                      "required": ["text"]
                    }
                  }
                },
                "deployment": {
                  "name": "gpt-4o-mini",
                  "parameters": { "temperature": 0.1 }
                },
                "system_prompt": {
                  "type": "custom",
                  "variables": {},
                  "content": "You are a summarization expert. Produce exactly 3-5 bullet points. Each bullet must be a complete sentence. Omit filler and padding."
                },
                "content_propagation": {
                  "propagate_history": false
                },
                "fallback_configuration": {
                  "strategies": [
                    {
                      "type": "continue",
                      "instructions": "The summarization tool is unavailable. Provide a brief summary yourself in 3-5 bullet points."
                    }
                  ],
                  "display_error_in_stage": true
                },
                "display": {
                  "stage": {
                    "name": "Summarizing",
                    "show": true
                  }
                }
              }
            ]
          }
        ],
        "starters": [
          "What is the current temperature in Paris?",
          "What is the climate difference between London and Madrid?"
        ]
      }
    }
  }
}
```

Replace `<quickapps2-host>` with your executor hostname and `gpt-4o-mini` with a model available in your instance.

### What each section does

- **`orchestrator`** — the primary model that processes user messages and decides when to call tools. `max_iterations: 10` allows up to 10 tool calls per conversation turn.
- **`tool_sets[0]` (weather)** — a REST API tool calling the Open-Meteo forecast API. The `current` parameter uses `"type": null` with `"const"` to always request `temperature_2m` without the model needing to specify it.
- **`tool_sets[1]` (summarization)** — a DIAL deployment tool calling a second model. `propagate_history: false` sends only the text argument, not the full conversation. The fallback lets the orchestrator handle failures gracefully.

---

## Step 3: Make the app available to users

Add the app to a role's `limits` so users can access it:

```json
{
  "roles": {
    "default": {
      "limits": {
        "gpt-4o-mini": {},
        "research-assistant": {}
      }
    }
  }
}
```

---

## Step 4: Apply changes and test

Restart DIAL Core to pick up the new configuration:

**Docker Compose:**
```bash
docker compose restart core
```

**Kubernetes:**
```bash
kubectl rollout restart deployment/dial-core -n <namespace>
```

Then:

1. Open DIAL Chat in your browser.
2. Find **Research Assistant** in the app list.
3. Send: `What is the current temperature in Paris?`

Expected behavior:
1. The orchestrator calls `get_weather` with Paris coordinates.
2. A collapsible stage **"Fetching weather for (48.85, 2.35)"** appears.
3. The orchestrator composes a response with the temperature.

![Research Assistant — tool call stages expanded showing arguments and results](../img/tutorial-tool-stages.png)

---

## What you learned

- Registered the Quick App 2.0 application type schema in `config.json`.
- Provisioned a complete Quick App with REST API and deployment tools through infrastructure configuration.
- Configured role-based access for the app.
- Tested an agent loop with multiple tool types.

---

## Next steps

- [Tutorial: agent loop (UI)](tutorial-agent-loop-ui.md) — build the same app through the DIAL Chat wizard
- [Tutorial: agent loop (API)](tutorial-agent-loop-api.md) — create the app with a single curl command
- [Add tools and agents](working-with-tools-and-agents.md) — reference for all seven tool set types
- [Configuration reference](./tool-sets/4.reference.md) — full schema documentation
