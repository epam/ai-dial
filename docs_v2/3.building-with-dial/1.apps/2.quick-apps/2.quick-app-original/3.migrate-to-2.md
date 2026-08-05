---
title: "Migrate to Quick App 2.0"
type: how-to
persona: app-dev
component: apps
last_verified: 2026-05-12
owner: "@dial-docs-team"
---

# Migrate to Quick App 2.0

This guide walks through converting an existing Quick App (original schema) to Quick App 2.0. The two schemas have different architectures, so migration requires restructuring the configuration — not just changing field names.

## Why migrate

Quick App 2.0 offers:

- **Orchestrator-based architecture** — explicit agent loop with configurable iteration limits.
- **Typed tool sets** — a unified `tool_sets` array supporting six connection types with fallback strategies, display configuration, and attachment handling.
- **Structured system prompts** — three prompt types (custom, DIAL file, predefined) with variable substitution.
- **Contexts** — structured RAG grounding with file and user-defined context types.
- **Visual editor** — full wizard in DIAL Chat for composing and testing apps.
- **Active development** — new features (agent skills, predefined tools, parallel execution) are added to Quick App 2.0 only.

## What has no equivalent in Quick App 2.0

| Original Quick App feature | Status in Quick App 2.0 |
|---|---|
| `client_toolset` | Not supported. Re-implement as a DIAL application and reference it as a `dial-deployment` tool. |
| Condition-based `applications_as_tools` (regex matching on ID, display name, description) | Not supported. Replace with explicit deployment IDs in `dial-deployment` tool sets. |
| `WebApiToolsetInfo` format (legacy REST API format with `tool_endpoints` and `auth_info`) | Not supported. Rewrite to `RestApiToolset` format (with `tools` array and `authorization`). |

If your app uses `client_toolset` or condition-based tool selection, evaluate whether the functionality can be restructured before migrating.

---

## Field-by-field mapping

| Quick App field | Quick App 2.0 equivalent | Notes |
|---|---|---|
| `model` | `orchestrator.deployment.name` | Same deployment ID format. |
| `temperature` | `orchestrator.deployment.parameters.temperature` | Moved inside deployment parameters. |
| `instructions` | `orchestrator.system_prompt` | Use `type: "custom"` with `content` field. |
| `starters` | `starters` | Same structure — array of strings. |
| `document_relative_url` | `contexts` | Use `FileContextConfig` entries with `type: "file"`. Also add a predefined RAG tool (see example below). |
| `applications_as_tools` (string IDs) | `tool_sets` with `type: "dial-deployment"` | Use `DialDeploymentSimpleTool` entries. |
| `web_api_toolset` (RestApiToolset) | `tool_sets` with `type: "rest-api"` | Schema is compatible. Move into `tool_sets` array. |
| `mcp_toolset` | `tool_sets` with `type: "mcp"` | Schema is compatible. Move into `tool_sets` array. |
| `attachments_in_stage` | `tool_sets[].tools[].attachment` | Configure per-tool in Quick App 2.0. |

---

## Where to perform the migration

There is no one-click migration button. You must manually create a new Quick App 2.0 with the equivalent configuration and then remove the original. Choose the path that matches how the app was created:

### UI migration

1. Open DIAL Chat and find your existing Quick App in the app list.
2. Note down its configuration (model, instructions, temperature, tools). You can view the raw JSON by selecting the app and looking at the configuration panel, or by retrieving it via the API (see below).
3. Delete the original Quick App.
4. Create a new Quick App 2.0 using the [DIAL Chat wizard](../quick-app-2/create-via-ui), entering the equivalent settings in the 2.0 format.

### API migration

1. Retrieve the existing app's configuration:

   ```bash
   curl "https://dial.example.com/v1/applications/my-app" \
     -H "api-key: ${DIAL_API_KEY}"
   ```

2. Delete the original app:

   ```bash
   curl -X DELETE "https://dial.example.com/v1/applications/my-app" \
     -H "api-key: ${DIAL_API_KEY}"
   ```

3. Create a new app with the Quick App 2.0 schema, using the field mapping below to restructure `applicationProperties`:

   ```bash
   curl -X POST "https://dial.example.com/v1/applications/my-app" \
     -H "Content-Type: application/json" \
     -H "api-key: ${DIAL_API_KEY}" \
     -d '{ ... Quick App 2.0 configuration ... }'
   ```

   See [Create a Quick App 2.0 via API](../quick-app-2/create-via-api) for complete examples.

### config.json migration

If the app is provisioned in DIAL Core's `config.json`:

1. Open `config.json`. See the [Quick App config.json guide](./create-and-configure#where-is-configjson) for file location details.
2. Ensure the Quick App 2.0 schema is registered in `applicationTypeSchemas`. If it is not, add it — see [Register the QA 2.0 schema](../quick-app-2/create-via-config#register-the-application-type-schema).
3. In the `applications` section, update your app entry:
   - Change `reference.applicationTypeSchemaId` from `quickapps` to `quickapps2`.
   - Change the `endpoint` from `.../quick_apps/chat/completions` to `.../quick_apps2/chat/completions`.
   - Restructure `applicationProperties` from the flat format to the orchestrator-based format (see field mapping below).
4. Restart DIAL Core:

   **Docker Compose:** `docker compose restart core`

   **Kubernetes:** `kubectl rollout restart deployment/dial-core -n <namespace>`

---

## Field-by-field mapping

Use this table to map fields from the original schema to the Quick App 2.0 schema.

## Step-by-step migration

### 1. Map core fields

**Before (Quick App):**

```json
{
  "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps",
  "applicationProperties": {
    "temperature": 0.5,
    "instructions": "You are a helpful research assistant.",
    "model": "gpt-4o-mini"
  }
}
```

**After (Quick App 2.0):**

```json
{
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
        "content": "You are a helpful research assistant."
      }
    },
    "contexts": [],
    "tool_sets": []
  }
}
```

### 2. Migrate REST API tools

Move `web_api_toolset` entries (in `RestApiToolset` format) into the `tool_sets` array. The tool definition structure is compatible:

**Before:**

```json
{
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
              "description": "Get current weather.",
              "parameters": {
                "type": "object",
                "properties": {
                  "latitude": {
                    "type": "number",
                    "description": "Latitude",
                    "parameter_info": { "type": "query", "key": "latitude" }
                  }
                },
                "required": ["latitude"]
              }
            }
          }
        }
      ]
    }
  ]
}
```

**After:**

```json
{
  "tool_sets": [
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
              "description": "Get current weather.",
              "parameters": {
                "type": "object",
                "properties": {
                  "latitude": {
                    "type": "number",
                    "description": "Latitude",
                    "parameter_info": { "type": "query", "key": "latitude" }
                  }
                },
                "required": ["latitude"]
              }
            }
          }
        }
      ]
    }
  ]
}
```

The tool definition itself is identical — only the container field name changes from `web_api_toolset` to `tool_sets`.

### 3. Migrate MCP tools

Move `mcp_toolset` entries into `tool_sets`. The schema is compatible:

**Before:**

```json
{
  "mcp_toolset": [
    {
      "name": "my-mcp",
      "type": "mcp",
      "mcp_server_info": {
        "url": "https://mcp.example.com/mcp",
        "protocol": "streamable_http"
      }
    }
  ]
}
```

**After:**

```json
{
  "tool_sets": [
    {
      "name": "my-mcp",
      "type": "mcp",
      "mcp_server_info": {
        "url": "https://mcp.example.com/mcp",
        "protocol": "streamable_http"
      }
    }
  ]
}
```

### 4. Migrate apps as tools

Replace `applications_as_tools` string IDs with `dial-deployment` tool set entries:

**Before:**

```json
{
  "applications_as_tools": ["dial-rag", "summarizer"]
}
```

**After:**

```json
{
  "tool_sets": [
    {
      "name": "dial-apps",
      "type": "dial-deployment",
      "description": "DIAL applications used as tools",
      "tools": [
        {
          "type": "deployment-tool",
          "deployment": { "name": "dial-rag" }
        },
        {
          "type": "deployment-tool",
          "deployment": { "name": "summarizer" }
        }
      ]
    }
  ]
}
```

### 5. Migrate RAG / document grounding

Replace `document_relative_url` with `contexts` entries and add a predefined RAG tool:

**Before:**

```json
{
  "document_relative_url": ["files/mybucket/guide.docx"]
}
```

**After:**

```json
{
  "contexts": [
    {
      "type": "file",
      "description": "Product guide document",
      "url": "files/mybucket/guide.docx"
    }
  ],
  "tool_sets": [
    {
      "name": "rag-tools",
      "type": "dial-deployment",
      "tools": [
        {
          "type": "predefined-tool",
          "template_name": "dial_rag"
        }
      ]
    }
  ]
}
```

---

## Complete before/after example

These examples show the full application object as it appears in `config.json` or in an API response, including `endpoint`, `reference`, and `applicationProperties`.

### Before (Quick App)

```json
{
  "displayName": "Research App",
  "description": "Research assistant with weather, MCP, and RAG tools.",
  "endpoint": "http://quickapps:5000/openai/deployments/quick_apps/chat/completions",
  "reference": {
    "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps"
  },
  "applicationProperties": {
    "temperature": 0.5,
    "instructions": "You are a research assistant. Use tools to search for information and provide sourced answers.",
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
    "mcp_toolset": [
      {
        "name": "search-server",
        "type": "mcp",
        "mcp_server_info": {
          "url": "https://mcp.example.com/search",
          "protocol": "streamable_http",
          "authorization": {
            "type": "bearer",
            "token": "tok-123"
          }
        }
      }
    ],
    "applications_as_tools": ["dial-rag"],
    "document_relative_url": ["files/mybucket/knowledge-base.pdf"],
    "starters": ["Search for recent AI papers", "What is the weather in Tokyo?"]
  }
}
```

### After (Quick App 2.0)

Note the three key changes: `endpoint` path changes from `quick_apps` to `quick_apps2`, `applicationTypeSchemaId` changes from `quickapps` to `quickapps2`, and `applicationProperties` is restructured from flat to orchestrator-based.

```json
{
  "displayName": "Research App",
  "description": "Research assistant with weather, MCP, and RAG tools.",
  "endpoint": "http://quickapps:5000/openai/deployments/quick_apps2/chat/completions",
  "reference": {
    "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps2"
  },
  "applicationProperties": {
    "orchestrator": {
      "deployment": {
        "name": "gpt-4o-mini",
        "parameters": { "temperature": 0.5 }
      },
      "system_prompt": {
        "type": "custom",
        "variables": {},
        "content": "You are a research assistant. Use tools to search for information and provide sourced answers."
      },
      "max_iterations": 15
    },
    "contexts": [
      {
        "type": "file",
        "description": "Knowledge base document",
        "url": "files/mybucket/knowledge-base.pdf"
      }
    ],
    "tool_sets": [
      {
        "name": "weather",
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
      },
      {
        "name": "search-server",
        "type": "mcp",
        "mcp_server_info": {
          "url": "https://mcp.example.com/search",
          "protocol": "streamable_http",
          "authorization": {
            "type": "bearer",
            "token": "tok-123"
          }
        }
      },
      {
        "name": "dial-apps",
        "type": "dial-deployment",
        "tools": [
          {
            "type": "predefined-tool",
            "template_name": "dial_rag"
          },
          {
            "type": "deployment-tool",
            "deployment": { "name": "dial-rag" }
          }
        ]
      }
    ],
    "starters": ["Search for recent AI papers", "What is the weather in Tokyo?"]
  }
}
```

---

## Next steps

- [Quick App 2.0: Create in DIAL Chat](../quick-app-2/create-via-ui) — visual wizard for Quick App 2.0
- [Quick App 2.0: Configuration reference](../quick-app-2/tool-sets/reference) — full schema documentation
- [Quick App configuration reference](./reference) — original Quick App schema reference
