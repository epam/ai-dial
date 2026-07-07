---
title: "Quick App configuration reference"
type: reference
persona: app-dev
component: apps
last_verified: 2026-05-12
owner: "@dial-docs-team"
---

# Quick App configuration reference

:::note
This page covers the original **Quick App** schema (`$id: https://mydial.epam.com/custom_application_schemas/quickapps`). Both Quick App and Quick App 2.0 are fully supported. For new applications, **[Quick App 2.0](../quick-app-2/create-via-ui)** is recommended. See [Migrate to Quick App 2.0](./migrate-to-2) if you want to convert an existing app.
:::

Complete reference for the Quick App JSON schema (`$id: https://mydial.epam.com/custom_application_schemas/quickapps`). Use this page if you are building or maintaining Quick Apps using the original schema.

---

## Schema overview

Legacy Quick Apps use a flat `applicationProperties` structure. All configuration lives directly under `applicationProperties` — there is no nested orchestrator or tool set hierarchy:

```json
{
  "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps",
  "applicationProperties": {
    "temperature": 0.8,
    "instructions": "You are a helpful assistant.",
    "model": "gpt-4o-mini",
    "starters": [...],
    "applications_as_tools": [...],
    "client_toolset": [...],
    "web_api_toolset": [...],
    "mcp_toolset": [...],
    "document_relative_url": [...]
  }
}
```

---

## Main parameters

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `temperature` | float | **Yes** | — | Controls response randomness (0.0–1.0). Lower = more deterministic. |
| `instructions` | string | **Yes** | — | System prompt that guides the model's behavior. |
| `model` | string | **Yes** | — | DIAL deployment ID of the language model to use. |

**Example:**

```json
{
  "temperature": 0.7,
  "instructions": "You are a weather assistant. Help users understand weather conditions and what to wear.",
  "model": "gpt-4o-mini"
}
```

---

## Starters

Starters are suggested prompts shown to users at the start of a conversation.

| Field | Type | Required | Description |
|---|---|---|---|
| `starters` | array of strings | No | Clickable conversation openers. |

**Example:**

```json
{
  "starters": [
    "What to wear in London today?",
    "Is it going to rain in Paris?"
  ]
}
```

---

## Apps and models as tools (`applications_as_tools`)

Enables the Quick App to call other DIAL applications or models as tools.

| Field | Type | Required | Description |
|---|---|---|---|
| `applications_as_tools` | array of strings and/or condition objects | No | References to DIAL deployments to use as tools. |

Items can be:

- **Direct ID strings** — reference a specific deployment by ID.
- **Condition objects** — dynamically match deployments based on properties.

Within a condition object, all items in the `conditions` array are combined with logical AND. Multiple top-level items are combined with logical OR.

### Condition types

| Type | Required fields | Description |
|---|---|---|
| `eq` | `property_name`, `const` | Exact match on a property value. |
| `match` | `property_name`, `expression` | Regex match on a property value. |

### Matchable properties

| Property | Description |
|---|---|
| `id` | Deployment identifier. |
| `display_name` | Display name shown to users. |
| `description` | Deployment description. |
| `application` | Whether the deployment is an application (vs. a model). |

**Examples:**

```json
{
  "applications_as_tools": [
    "copilot_deck_app"
  ]
}
```

```json
{
  "applications_as_tools": [
    {
      "conditions": [
        {
          "condition_type": "match",
          "property_name": "id",
          "expression": ".*rag.*"
        }
      ]
    },
    "copilot_deck_app"
  ]
}
```

```json
{
  "applications_as_tools": [
    "direct_application_id",
    {
      "conditions": [
        {
          "condition_type": "match",
          "property_name": "id",
          "expression": ".*rag.*"
        },
        {
          "condition_type": "eq",
          "property_name": "display_name",
          "const": "Specific App Name"
        }
      ]
    }
  ]
}
```

---

## Client tools (`client_toolset`)

Client tools execute outside the Quick App — on the client (e.g., in the browser). When the model invokes a client tool, the Quick App pauses the agent loop and returns a `tool_call` in its response. The caller executes the tool, then sends the result back to the Quick App together with `intermediate_steps_to_restore` metadata to resume the loop.

| Field | Type | Required | Description |
|---|---|---|---|
| `client_toolset` | array of `ClientToolInfo` | No | External client-side tools. |

### `ClientToolInfo`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | **Yes** | Tool name used by the model. |
| `description` | string | **Yes** | Description of what the tool does. |
| `parameters` | array of `ClientToolParameterInfo` | **Yes** | Input parameters for the tool. |

### `ClientToolParameterInfo`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | **Yes** | Parameter name. |
| `description` | string | **Yes** | Description of the parameter. |
| `parameter_type` | enum | **Yes** | Data type: `string`, `number`, `integer`, `boolean`, `object`, or `array`. |

### `intermediate_steps_to_restore`

When a client tool is invoked, the Quick App returns metadata in `custom_content.state.intermediate_steps_to_restore`. This serialized state must be included in the follow-up request alongside the tool result so the Quick App can restore its execution context.

```json
{
  "custom_content": {
    "state": {
      "intermediate_steps_to_restore": "[[{\"lc\": 1, \"type\": \"constructor\", ...}]]"
    }
  }
}
```

**Example configuration:**

```json
{
  "client_toolset": [
    {
      "name": "geo_code",
      "description": "Get geographic coordinates for a location. Executes client-side.",
      "parameters": [
        {
          "name": "location",
          "description": "City name or address to geocode.",
          "parameter_type": "string"
        }
      ]
    }
  ]
}
```

---

## Web API tools (`web_api_toolset`)

The `web_api_toolset` field supports two formats that can be mixed in the same array.

### Format 1: `RestApiToolset` (recommended)

More flexible, supports fine-grained parameter mapping and OpenAI function compatibility.

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | **Yes** | Must be `"rest-api"`. |
| `name` | string | **Yes** | Tool set name. |
| `authorization` | `Authorization` | No | Authentication for all tools in this set. |
| `tools` | array of `RestApiTool` | **Yes** | REST API tool definitions. |

#### Authorization (`RestApiToolset`)

| Type | Fields |
|---|---|
| `api_key` | `key` (value), `name` (header/param name), `location` (`"query"`, `"header"`, or `"body"`) |
| `basic` | `username`, `password` |
| `bearer` | `token` |
| `client_id_secret` | `client_id`, `client_secret`, `token_url`, `scope` (opt.), `aud` (opt.) |

#### `RestApiTool`

| Field | Type | Required | Description |
|---|---|---|---|
| `rest_api_method_info` | `RestApiEndpointMethodInfo` | **Yes** | HTTP method and URL. |
| `open_ai_tool` | `OpenAiToolConfig` | **Yes** | OpenAI tool function definition. |

**`rest_api_method_info`:**

| Field | Required | Description |
|---|---|---|
| `method_url` | **Yes** | Full endpoint URL. |
| `method_type` | **Yes** | `"get"`, `"post"`, `"put"`, or `"delete"`. |

**Parameter mapping (`parameter_info` within `open_ai_tool.function.parameters.properties`):**

| Field | Required | Description |
|---|---|---|
| `type` | **Yes** | `"query"`, `"url"`, `"body"`, or `"header"`. |
| `key` | **Yes** | Parameter name in the HTTP request. |

Use `"type": null` with `"const"` for constant parameters hidden from the model.

**Example — geocoding + weather (no auth):**

```json
{
  "web_api_toolset": [
    {
      "name": "geocode-api",
      "type": "rest-api",
      "authorization": {
        "type": "api_key",
        "key": "<api-key>",
        "name": "api_key",
        "location": "query"
      },
      "tools": [
        {
          "rest_api_method_info": {
            "method_url": "https://geocode.maps.co/search",
            "method_type": "get"
          },
          "open_ai_tool": {
            "type": "function",
            "function": {
              "name": "geo_code",
              "description": "Get lat/lon coordinates for an address or city.",
              "parameters": {
                "type": "object",
                "properties": {
                  "q": {
                    "type": "string",
                    "description": "Location to geocode.",
                    "parameter_info": { "type": "query", "key": "q" }
                  }
                },
                "required": ["q"]
              }
            }
          }
        }
      ]
    },
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
              "name": "weather",
              "description": "Get current weather for lat/lon coordinates.",
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
                  },
                  "format": {
                    "type": null,
                    "const": "csv",
                    "parameter_info": { "type": "query", "key": "format" }
                  }
                },
                "required": ["latitude", "longitude", "current", "format"]
              }
            }
          }
        }
      ]
    }
  ]
}
```

---

### Format 2: `WebApiToolsetInfo` (legacy)

Older format. Still supported. Each object represents one API with its endpoints and authentication.

| Field | Type | Required | Description |
|---|---|---|---|
| `tool_endpoints` | array of `ToolEndpointInfo` | **Yes** | API endpoints available as tools. |
| `auth_info` | `WebApiToolsetKeyAuthInfo` or null | **Yes** | API key authentication (or null for no auth). |

#### `ToolEndpointInfo`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | **Yes** | Tool name shown to the model. |
| `method_url` | string | **Yes** | Endpoint URL. |
| `method_type` | string | **Yes** | HTTP method: `"get"`, `"post"`, `"put"`, `"delete"`. |
| `description` | string | **Yes** | Tool description for the model. |
| `parameters` | array of `ToolEndpointParameterInfo` | **Yes** | Tool parameters. |

#### `ToolEndpointParameterInfo`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | string | **Yes** | — | Parameter name. |
| `description` | string | **Yes** | — | Parameter description for the model. |
| `parameter_type` | enum | **Yes** | — | `string`, `number`, `integer`, `boolean`, `object`, or `array`. |
| `url_param` | boolean | No | `false` | If `true`, send as query parameter instead of request body. |
| `constant_value` | any | No | `null` | Fixed value; parameter hidden from the model. |
| `item_parameter_type` | enum | No | `null` | Item type for array parameters. |
| `item_descriptor` | string | No | `null` | Item description for array parameters. |

#### `WebApiToolsetKeyAuthInfo`

| Field | Type | Required | Description |
|---|---|---|---|
| `auth_type` | string | **Yes** | Must be `"apikey"`. |
| `api_key` | string | **Yes** | API key value. |
| `url_param` | boolean | No | If `true`, send key as URL query parameter. Default: `false` (send in header). |

**Example:**

```json
{
  "web_api_toolset": [
    {
      "tool_endpoints": [
        {
          "name": "geo_code",
          "method_url": "https://geocode.maps.co/search",
          "method_type": "get",
          "description": "Get geo coordinates for an address or city.",
          "parameters": [
            {
              "name": "q",
              "description": "Location to look up.",
              "parameter_type": "string",
              "url_param": true
            }
          ]
        }
      ],
      "auth_info": {
        "auth_type": "apikey",
        "api_key": "your_api_key",
        "url_param": true
      }
    }
  ]
}
```

---

## MCP tools (`mcp_toolset`)

Connects the Quick App to MCP servers.

| Field | Type | Required | Description |
|---|---|---|---|
| `mcp_toolset` | array of `MCPToolsetInfo` | No | MCP server connections. |

### `MCPToolsetInfo`

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | **Yes** | Must be `"mcp"`. |
| `name` | string | **Yes** | Tool set name. |
| `mcp_server_info` | `MCPServerInfo` | **Yes** | MCP server connection details. |
| `allowed_tools` | array of strings | No | Allowlist of tool names from the server. If omitted, all tools are available. |

### `MCPServerInfo`

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | **Yes** | MCP server URL. |
| `protocol` | string | **Yes** | Transport protocol: `"sse"` or `"streamable_http"`. |
| `authorization` | `MCPAuthorization` or null | No | Authentication for the MCP server. |

### MCP authorization types

| Type | Fields |
|---|---|
| `api_key` | `key`, `name` |
| `basic` | `username`, `password` |
| `bearer` | `token` |
| `client_id_secret` | `client_id`, `client_secret`, `token_url`, `scope` (opt.), `aud` (opt.) |

:::note
Only `ImageContent` and `TextResourceContents` resource types are supported in `mcp_toolset`.
:::

**Example:**

```json
{
  "mcp_toolset": [
    {
      "name": "mcp-tool",
      "type": "mcp",
      "mcp_server_info": {
        "url": "http://mcp-server:8000/mcp",
        "protocol": "streamable_http",
        "authorization": {
          "type": "bearer",
          "token": "your-token"
        }
      },
      "allowed_tools": ["search", "fetch_page", "summarize"]
    }
  ]
}
```

---

## RAG integration (`document_relative_url`)

Enables Retrieval Augmented Generation by grounding the model's responses in documents stored in DIAL.

| Field | Type | Required | Description |
|---|---|---|---|
| `document_relative_url` | string or array of strings | No | Relative path(s) to documents in DIAL file storage. |

When configured, a `query_document` tool is automatically added to the Quick App with the description: *"Ask RAG a question about the documents assuming it will have access to the conversation history."*

For best results, the system prompt should explicitly instruct the model to query the document before answering:

```
You should help explore the document. Query the document first before answering any question. Answer using only the information in the document. Answer "I don't know" if the question is not covered.
```

**Example:**

```json
{
  "document_relative_url": [
    "files/DpZGXdFYCWNadE2Ln/GPT%20Deck%20text.docx"
  ]
}
```

---

## Complete example

A full Quick App configuration with all tool types:

```json
{
  "displayName": "Weather Quick App Demo",
  "description": "Ask about weather or clothes to wear",
  "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps",
  "applicationProperties": {
    "temperature": 0.8,
    "instructions": "You are a weather assistant. Help users understand weather conditions and what to wear. Query the document first if the user asks about clothing recommendations.",
    "model": "gpt-4o-mini",
    "starters": [
      "What to wear in London",
      "What is the weather in Paris"
    ],
    "applications_as_tools": [
      {
        "conditions": [
          {
            "condition_type": "match",
            "property_name": "id",
            "expression": ".*rag.*"
          }
        ]
      },
      "copilot_deck_app"
    ],
    "client_toolset": [
      {
        "name": "multiply_tool",
        "description": "Multiply two numbers together.",
        "parameters": [
          {
            "name": "a",
            "description": "First number.",
            "parameter_type": "integer"
          },
          {
            "name": "b",
            "description": "Second number.",
            "parameter_type": "integer"
          }
        ]
      }
    ],
    "web_api_toolset": [
      {
        "tool_endpoints": [
          {
            "name": "geo_code",
            "method_url": "https://geocode.maps.co/search",
            "method_type": "get",
            "description": "Get geo coordinates for an address or city.",
            "parameters": [
              {
                "name": "q",
                "description": "Location to look up.",
                "parameter_type": "string",
                "url_param": true
              }
            ]
          }
        ],
        "auth_info": {
          "auth_type": "apikey",
          "api_key": "<api-key>",
          "url_param": true
        }
      },
      {
        "tool_endpoints": [
          {
            "name": "weather",
            "method_url": "https://api.open-meteo.com/v1/forecast",
            "method_type": "get",
            "description": "Get current weather for lat/lon coordinates.",
            "parameters": [
              {
                "name": "latitude",
                "description": "Latitude.",
                "parameter_type": "number",
                "url_param": true
              },
              {
                "name": "longitude",
                "description": "Longitude.",
                "parameter_type": "number",
                "url_param": true
              },
              {
                "name": "current",
                "description": "Weather metrics to retrieve.",
                "parameter_type": "string",
                "url_param": true,
                "constant_value": "temperature_2m"
              },
              {
                "name": "format",
                "description": "Output format.",
                "parameter_type": "string",
                "url_param": true,
                "constant_value": "csv"
              }
            ]
          }
        ],
        "auth_info": null
      }
    ],
    "mcp_toolset": [
      {
        "name": "mcp-tools",
        "type": "mcp",
        "mcp_server_info": {
          "url": "http://mcp-server:8000/mcp",
          "protocol": "streamable_http",
          "authorization": {
            "type": "bearer",
            "token": "<token>"
          }
        },
        "allowed_tools": ["search", "fetch_page"]
      }
    ],
    "document_relative_url": [
      "files/DpZGXdFYCWNadE2Ln/clothing-guide.docx"
    ]
  }
}
```

---

## Migrate to Quick App 2.0

For a complete migration guide with field-by-field mapping and before/after examples, see [Migrate to Quick App 2.0](./migrate-to-2).

## Next steps

- [Create and configure a Quick App](./create-and-configure) — create Quick Apps via UI, API, or config.json
- [Migrate to Quick App 2.0](./migrate-to-2) — convert an existing Quick App to the 2.0 schema
- [Quick App 2.0 documentation](../quick-app-2/create-via-ui) — guides for the recommended Quick App type
