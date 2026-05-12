---
title: "Create a Quick App 2.0 via config.json"
type: how-to
persona: devops
component: apps
last_verified: 2026-05-12
owner: "@dial-docs-team"
---

# Create a Quick App 2.0 via config.json

This guide covers provisioning Quick App 2.0 instances through DIAL Core's `config.json` file. Use this approach for static deployments, version-controlled infrastructure, and team-wide application provisioning.

To create a Quick App 2.0 through the UI or API instead, see [Create in DIAL Chat](./create-via-ui) or [Create via API](./create-via-api).

## When to use config.json

Config-based provisioning is the right choice when:

- You manage DIAL infrastructure as code (Helm charts, Terraform, GitOps).
- You need to pre-provision apps for all users without requiring them to create apps manually.
- You want application definitions under version control.
- You are deploying apps that should be available immediately after DIAL Core starts.

For one-off app creation by individual users, the [UI wizard](./create-via-ui) or [API](./create-via-api) is simpler.

## Prerequisites

- Access to the DIAL Core `config.json` file (or Helm values that generate it). See [Where is config.json?](#where-is-configjson) below for the file location.
- The Quick Apps 2.0 executor service deployed and reachable from DIAL Core.
- The Quick App 2.0 application type schema registered in `config.json` (see [Register the schema](#register-the-application-type-schema) below).

## Where is config.json?

The `config.json` file is the main configuration file for DIAL Core. Its location depends on your deployment method:

**Docker Compose** — the file is mounted into the DIAL Core container. In the [DIAL Docker Compose repository](https://github.com/epam/ai-dial/tree/main/dial-docker-compose), the default location is:

```
dial-docker-compose/
├── docker-compose.yml
└── core/
    └── config.json       ← this file
```

**Kubernetes / Helm** — the config is defined in the Helm chart values and rendered into a ConfigMap. Edit your `values.yaml` file and look for the `core.config` or `config` section. After changing the values, upgrade the Helm release:

```bash
helm upgrade dial-core ./charts/dial-core -f values.yaml
```

---

## How config.json Quick Apps work

DIAL Core uses two configuration sections to enable Quick Apps:

1. **`applicationTypeSchemas`** — defines the available application types (Quick App, Quick App 2.0, etc.) and maps each type to its executor service endpoint.
2. **`applications`** — defines individual application instances, each referencing a schema from `applicationTypeSchemas`.

When DIAL Core starts, it reads both sections. For each application that references a schema, Core routes chat completion requests to the executor endpoint defined in that schema.

---

## Register the application type schema

Before defining individual Quick App 2.0 instances, the Quick App 2.0 schema must be registered in `config.json`. This tells DIAL Core where to route requests for this application type.

Add the following to the `applicationTypeSchemas` array. Replace `<quickapps2-host>` with the actual hostname of your Quick Apps 2.0 executor service:

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

:::note
The `dial:appendApplicationPropertiesHeader` flag is `false` for Quick App 2.0. This means the executor service fetches the application configuration from DIAL Core via a separate request, rather than receiving it in the request header. This is the preferred approach for Quick App 2.0 because configurations can be large.
:::

---

## Define a Quick App 2.0 instance

Add an entry under `applications` that references the Quick App 2.0 schema. Each application needs:

- A unique key (the application ID).
- An `endpoint` pointing to the Quick Apps 2.0 executor.
- A `reference.applicationTypeSchemaId` matching the schema `$id`.
- `applicationProperties` containing the Quick App 2.0 configuration.

### Minimal example

A simple assistant with a model and system prompt, no tools:

```json
{
  "applications": {
    "my-assistant": {
      "displayName": "My Assistant",
      "description": "A simple helpful assistant.",
      "endpoint": "http://<quickapps2-host>/openai/deployments/quick_apps2/chat/completions",
      "reference": {
        "applicationTypeSchemaId": "https://mydial.epam.com/custom_application_schemas/quickapps2"
      },
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
    }
  }
}
```

### Example with REST API tools

A weather assistant that calls the Open-Meteo API:

```json
{
  "applications": {
    "weather-assistant": {
      "displayName": "Weather Assistant",
      "description": "Looks up current weather for any location.",
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
            "content": "You are a weather assistant. Use the get_weather tool to look up current conditions."
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
    }
  }
}
```

---

## Make the app available to users

By default, applications defined in `config.json` are available to all authenticated users. To restrict access, add a `userRoles` field:

```json
{
  "applications": {
    "my-assistant": {
      "endpoint": "...",
      "userRoles": ["analyst", "admin"],
      "reference": { "..." },
      "applicationProperties": { "..." }
    }
  }
}
```

To set rate limits, define the application in a role's `limits`:

```json
{
  "roles": {
    "default": {
      "limits": {
        "my-assistant": {
          "minute": "10",
          "day": "1000"
        }
      }
    }
  }
}
```

See [Roles configuration](../../../../operating-dial/configuration/core/config-json/roles) for full details.

---

## Complete working config.json

This example shows a complete `config.json` with the Quick App 2.0 schema, a model, and one Quick App 2.0 instance:

```json
{
  "applicationTypeSchemas": [
    {
      "$schema": "https://dial.epam.com/application_type_schemas/schema#",
      "$id": "https://mydial.epam.com/custom_application_schemas/quickapps2",
      "dial:applicationTypeDisplayName": "Quick App 2.0",
      "dial:applicationTypeCompletionEndpoint": "http://quickapps:5000/openai/deployments/quick_apps2/chat/completions",
      "dial:applicationTypeConfigurationEndpoint": "http://quickapps:5000/openai/deployments/quick_apps2/configuration",
      "dial:appendApplicationPropertiesHeader": false,
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
    "weather-assistant": {
      "displayName": "Weather Assistant",
      "description": "Looks up current weather for any location.",
      "endpoint": "http://quickapps:5000/openai/deployments/quick_apps2/chat/completions",
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
                    "description": "Get current weather by latitude and longitude.",
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
        "starters": ["What is the weather in London?"]
      }
    }
  },
  "roles": {
    "default": {
      "limits": {
        "gpt-4o-mini": {},
        "weather-assistant": {}
      }
    }
  }
}
```

---

## Verify the deployment

After updating `config.json`, restart DIAL Core to pick up the changes:

**Docker Compose:** `docker compose restart core`

**Kubernetes:** `kubectl rollout restart deployment/dial-core -n <namespace>`

Then verify:

1. Open DIAL Chat and check that the app appears in the app list.
2. Start a conversation with the app and test basic functionality.
3. If the app uses tools, verify that tool calls execute successfully.

If the app does not appear, check DIAL Core logs for schema validation errors. Common issues include:

- `applicationTypeSchemaId` in the application does not match any `$id` in `applicationTypeSchemas`.
- The Quick Apps 2.0 executor service is not reachable at the configured endpoint.
- Missing required fields in `applicationProperties` (`orchestrator`, `contexts`, `tool_sets`).

---

## Next steps

- [Create in DIAL Chat](./create-via-ui) — visual wizard walkthrough
- [Create via API](./create-via-api) — programmatic creation
- [Applications configuration reference](../../../../operating-dial/configuration/core/config-json/applications) — all config.json application attributes
- [Configuration reference](./tool-sets/reference) — full Quick App 2.0 schema documentation
