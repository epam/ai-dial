---
title: "Add tools and agents to a Quick App 2.0"
type: how-to
persona: app-dev
component: apps
last_verified: 2026-05-29
owner: "@dial-docs-team"
---

# Add tools and agents to a Quick App 2.0

This guide explains how to connect tools to a Quick App 2.0 using the `tool_sets` configuration. It covers all six tool set types with copy-pasteable JSON examples.

## Overview of tool set types

| Type | What it connects to | Auth |
|---|---|---|
| `rest-api` | External REST API endpoints | api_key, basic, bearer, client_id_secret |
| `dial-deployment` | Other DIAL apps or models | Inherited from DIAL session |
| `mcp` | External MCP server (direct URL) | bearer, api_key, basic, client_id_secret |
| `dial-mcp` | MCP Tool Set registered in DIAL Core | Managed by DIAL Core |
| `dial-app` | DIAL applications selected via the UI picker | Inherited from DIAL session |
| `internal` | Built-in tools handled by the QA 2.0 backend | N/A |
| `predefined` | Named tool set templates | N/A |

Tools can be combined freely. A single Quick App 2.0 can use multiple tool set types simultaneously.

---

## Where to use these configurations

The JSON examples on this page are for the **API** and **config.json** methods of creating and managing Quick Apps. The DIAL Chat UI wizard does not have a JSON editor for Quick App 2.0.

**API** — include the `tool_sets` array inside `applicationProperties` in the request body when you [create](create-via-api.md) or update an app via `POST /v1/applications/{appId}`.

**config.json** — include the `tool_sets` array inside `applicationProperties` in your application entry in [DIAL Core's config.json](create-via-config.md).

**UI wizard** — the [DIAL Chat wizard](create-via-ui.md) does not use JSON. Instead, it provides a visual [Agents & Toolsets picker](create-via-ui#agents--toolsets) where you select pre-registered Tool Sets and agents from a list. This means:

- **DIAL-registered Tool Sets** (`dial-mcp`) and **agents** (`dial-deployment`) can be added through the UI picker *or* via JSON.
- **REST API tools** (`rest-api`) and **direct MCP server connections** (`mcp`) can only be configured via JSON (API or config.json).

To add tools to an existing app via API, retrieve its current config with `GET /v1/applications/{appId}`, add entries to the `tool_sets` array in `applicationProperties`, and POST the updated config back.

---

## Add DIAL deployments as tools

Use the `dial-deployment` tool set to call other DIAL applications or models from within your Quick App 2.0. This enables multi-agent patterns: one app can delegate subtasks to specialized apps.

### Simple form: `dial-deployment-simple`

The simplest way to add a DIAL deployment as a tool. The orchestrator passes the full conversation context to it directly.

```json
{
  "tool_sets": [
    {
      "type": "dial-deployment",
      "name": "helper-agents",
      "tools": [
        {
          "type": "dial-deployment-simple",
          "deployment_id": "summarizer-app"
        },
        {
          "type": "dial-deployment-simple",
          "deployment_id": "code-reviewer"
        }
      ]
    }
  ]
}
```

The model decides when to call each deployment based on their deployment IDs and the system prompt context.

### Rich form: `deployment-tool`

Provides full control: custom tool description, dedicated system prompt for the sub-call, fallback strategy, and display configuration.

```json
{
  "tool_sets": [
    {
      "type": "dial-deployment",
      "name": "analysis-tools",
      "tools": [
        {
          "type": "deployment-tool",
          "open_ai_tool": {
            "type": "function",
            "function": {
              "name": "summarize",
              "description": "Summarize a long piece of text into concise bullet points.",
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
            "name": "claude-3-5-haiku",
            "parameters": { "temperature": 0.2 }
          },
          "system_prompt": {
            "type": "custom",
            "variables": {},
            "content": "You are a summarization expert. Produce 3-5 bullet points. Be concise and accurate."
          },
          "content_propagation": {
            "propagate_history": false
          },
          "fallback_configuration": {
            "strategies": [
              {
                "type": "continue",
                "instructions": "The summarization tool is unavailable. Summarize the content yourself."
              }
            ],
            "display_error_in_stage": false
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
  ]
}
```

---

## Add REST API tools

Use the `rest-api` tool set to call external REST endpoints. Authentication is configured at the tool set level and applies to all tools within it.

### Without authentication

```json
{
  "tool_sets": [
    {
      "type": "rest-api",
      "name": "weather-api",
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
              "description": "Get current temperature for a latitude/longitude location.",
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
          }
        }
      ]
    }
  ]
}
```

### With API key authentication

```json
{
  "tool_sets": [
    {
      "type": "rest-api",
      "name": "geocoding-api",
      "authorization": {
        "type": "api_key",
        "key": "your-api-key",
        "name": "api_key",
        "location": "query"
      },
      "tools": [
        {
          "type": "restapi-tool",
          "rest_api_method_info": {
            "method_url": "https://geocode.maps.co/search",
            "method_type": "get"
          },
          "open_ai_tool": {
            "type": "function",
            "function": {
              "name": "geocode",
              "description": "Look up latitude and longitude for a city or address.",
              "parameters": {
                "type": "object",
                "properties": {
                  "q": {
                    "type": "string",
                    "description": "City or address to look up.",
                    "parameter_info": { "type": "query", "key": "q" }
                  }
                },
                "required": ["q"]
              }
            }
          }
        }
      ]
    }
  ]
}
```

### Parameter types

Each parameter in the function definition can include a `parameter_info` field that tells the Quick App 2.0 backend where to send the value in the HTTP request:

| `type` value | Where the value goes |
|---|---|
| `query` | URL query string (`?key=value`) |
| `url` | URL path template (`/resource/{id}`) |
| `body` | Request body (JSON) |
| `header` | HTTP request header |

**Constant parameters** (values hidden from the model) use `"type": null` with a `"const"` field:

```json
"format": {
  "type": null,
  "const": "json",
  "parameter_info": { "type": "query", "key": "format" }
}
```

The model never sees `format` as a parameter — it is always sent with the value `"json"`.

---

## Add MCP tools (direct server)

Use the `mcp` tool set to connect directly to an external MCP server by URL.

```json
{
  "tool_sets": [
    {
      "type": "mcp",
      "name": "search-tools",
      "mcp_server_info": {
        "url": "https://mcp.example.com/search",
        "protocol": "streamable_http",
        "authorization": {
          "type": "bearer",
          "token": "your-bearer-token"
        }
      },
      "allowed_tools": ["web_search", "fetch_page"]
    }
  ]
}
```

| `protocol` value | When to use |
|---|---|
| `streamable_http` | Default. Standard HTTP transport, works for most MCP servers. |
| `sse` | Server-Sent Events. Use when the server streams tool results incrementally. |

The `allowed_tools` array restricts which tools from the server are exposed to the model. If omitted, all tools the server exposes are available.

---

## Add DIAL-managed MCP tools

Use the `dial-mcp` tool set to reference a Tool Set that has been registered in DIAL Core's `config.json`. The connection details (URL, auth) are managed by the administrator — you only need the `dial_id`.

![Quick App 2.0 wizard — Agents & Tool Sets section with '+ Add' panel open and DIAL-MCP tool set type highlighted](../img/tools-add-panel.png)

```json
{
  "tool_sets": [
    {
      "type": "dial-mcp",
      "dial_id": "my-registered-toolset",
      "transport": "HTTP",
      "allowed_tools": ["search", "summarize"]
    }
  ]
}
```

Use this type when:

- Your organization has centrally registered Tool Sets.
- You want to reference the Tool Set without embedding connection credentials in the app config.
- The Tool Set is shared across multiple apps.

---

## Configure fallback behavior

Add a `fallback_configuration` to any tool or tool set to control what happens when a tool call fails:

```json
{
  "fallback_configuration": {
    "strategies": [
      {
        "type": "continue",
        "trigger_on": {
          "type": "contains",
          "value": "timeout",
          "case_sensitive": false
        },
        "instructions": "The tool timed out. Inform the user and provide your best answer from existing knowledge."
      },
      {
        "type": "stop"
      }
    ],
    "display_error_in_stage": true
  }
}
```

- `stop` — halts the agent loop and returns an error to the user.
- `continue` — the model continues with instructions for what to do next.
- `trigger_on` — applies the strategy only when the error message matches a condition.

Strategies are evaluated in order. The first matching strategy wins.

---

## Configure tool display in chat

Add a `display` configuration to control how a tool call appears in DIAL Chat's collapsible stage UI:

```json
{
  "display": {
    "stage": {
      "name": "Searching for {query}",
      "body": null,
      "show": true
    }
  }
}
```

Use `{argument_name}` placeholders in `name` and `body` to include actual tool argument values in the stage header. This makes the agent loop visible and interpretable to users.

Set `"show": false` to hide the stage entirely (the tool still runs, but no stage appears in the UI).

---

## Combine multiple tool types

All tool set types can coexist in the same `tool_sets` array. The model has access to all tools from all sets simultaneously:

```json
{
  "tool_sets": [
    {
      "type": "rest-api",
      "name": "weather",
      "authorization": null,
      "tools": [ ... ]
    },
    {
      "type": "mcp",
      "name": "search",
      "mcp_server_info": { ... },
      "allowed_tools": ["web_search"]
    },
    {
      "type": "dial-deployment",
      "name": "helpers",
      "tools": [
        { "type": "dial-deployment-simple", "deployment_id": "summarizer" }
      ]
    }
  ]
}
```

The orchestrator model decides which tools to invoke based on the conversation and the tools' names and descriptions. Write clear, distinct descriptions for each tool to help the model make the right choice.

---

## After adding tools in the UI

Once you add a tool set in the wizard, it appears in the **Agents & Tool Sets** list.

![Quick App 2.0 wizard — Agents & Tool Sets list showing a newly added tool set entry with its name and type visible](../img/tools-toolset-added.png)

Use the **Preview** panel to send a message that should trigger the tool. DIAL Chat displays each tool call as a collapsible stage in the conversation.

![DIAL Chat conversation — multiple collapsible tool call stages visible in the message thread, with one stage expanded showing tool arguments and returned result](../img/tools-agent-loop.png)

---

## Next steps

- [Tool Set examples](./tool-sets/5.examples.md) — 5 complete copy-pasteable configurations
- [Configuration reference](./tool-sets/4.reference.md) — full schema documentation for all tool set types
- [Define and register a Tool Set](./tool-sets/1.define-and-register.md) — register an MCP server in DIAL Core for use with `dial-mcp`
- [Tutorial: agent loop (UI)](tutorial-agent-loop-ui.md) — build the same app through the DIAL Chat wizard
- [Tutorial: agent loop (API)](tutorial-agent-loop-api.md) — build the same app with a single curl command
- [Tutorial: agent loop (config.json)](tutorial-agent-loop-config.md) — provision the app through infrastructure config
