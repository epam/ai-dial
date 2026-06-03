---
title: "Quick App 2.0 examples"
type: reference
persona: app-dev
component: apps
last_verified: 2026-05-29
owner: "@dial-docs-team"
---

# Quick App 2.0 examples

This page contains complete, copy-pasteable Quick App 2.0 configurations for common use cases. Each example is a full `applicationProperties` object suitable for the [DIAL Core API](create-via-api.md) or the JSON editor in DIAL Chat.

---

## 1. Simple Q&A assistant

A minimal app with no tools — just a model and a focused system prompt.

```json
{
  "orchestrator": {
    "deployment": {
      "name": "gpt-4o-mini",
      "parameters": { "temperature": 0.5 }
    },
    "system_prompt": {
      "type": "custom",
      "variables": {},
      "content": "You are a helpful assistant. Answer questions clearly and concisely. If you don't know the answer, say so."
    }
  },
  "contexts": [],
  "tool_sets": [],
  "starters": [
    "What is the difference between RAG and fine-tuning?",
    "Explain what an MCP server does.",
    "What are the benefits of prompt caching?"
  ]
}
```

---

## 2. RAG document explorer

An app that grounds responses in an uploaded document. Use `contexts` to attach a file from DIAL storage.

```json
{
  "orchestrator": {
    "deployment": {
      "name": "gpt-4o",
      "parameters": { "temperature": 0.2 }
    },
    "system_prompt": {
      "type": "custom",
      "variables": {},
      "content": "You are a document assistant. Use the provided document to answer questions. If the answer is not in the document, say so explicitly. Quote relevant passages when helpful."
    }
  },
  "contexts": [
    {
      "type": "file",
      "url": "files/your-org/shared/knowledge-base.pdf"
    }
  ],
  "tool_sets": [],
  "starters": [
    "What does the document say about onboarding?",
    "Summarize the key policies.",
    "Find references to the compliance requirements."
  ]
}
```

Replace `files/your-org/shared/knowledge-base.pdf` with the actual relative URL of your document in DIAL storage.

---

## 3. Multi-tool research assistant

An app that combines weather data (REST API), web search (MCP), and a summarization model (DIAL deployment).

```json
{
  "orchestrator": {
    "deployment": {
      "name": "gpt-4o",
      "parameters": { "temperature": 0.3 }
    },
    "system_prompt": {
      "type": "custom",
      "variables": {},
      "content": "You are a Research Assistant. Use available tools to answer questions that require current data. Use the weather tool for climate questions, the search tool for general research, and the summarize tool to condense long results before responding. Always cite tool results."
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
              "description": "Get the current temperature for a location by latitude and longitude.",
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
      "type": "dial-mcp",
      "dial_id": "web-search",
      "transport": "HTTP",
      "allowed_tools": ["search"]
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
              "description": "Summarize a long piece of text into 3–5 bullet points.",
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
            "content": "Produce 3–5 concise bullet points summarizing the input text."
          },
          "content_propagation": {
            "propagate_history": false
          },
          "display": {
            "stage": { "name": "Summarizing", "show": true }
          }
        }
      ]
    }
  ],
  "starters": [
    "What is the weather in Berlin right now?",
    "Search for recent news about AI regulation in the EU.",
    "Compare the climate in Oslo and Madrid."
  ]
}
```

Replace `"web-search"` with the DIAL ID of a registered Tool Set in your instance.

---

## 4. Customer support bot with fallback handling

An app that calls a CRM REST API for ticket lookup, with a configured fallback when the API is unavailable.

```json
{
  "orchestrator": {
    "deployment": {
      "name": "gpt-4o-mini",
      "parameters": { "temperature": 0.2 }
    },
    "system_prompt": {
      "type": "custom",
      "variables": {},
      "content": "You are a customer support assistant for Acme Corp. When users ask about the status of a support ticket, use the lookup_ticket tool to retrieve it. If the tool is unavailable, apologize and direct the user to support@acme.example.com. Keep responses brief and professional."
    }
  },
  "contexts": [],
  "tool_sets": [
    {
      "type": "rest-api",
      "name": "crm",
      "authorization": {
        "type": "bearer",
        "token": "your-crm-api-token"
      },
      "tools": [
        {
          "type": "restapi-tool",
          "rest_api_method_info": {
            "method_url": "https://crm.acme.example.com/api/v1/tickets/{ticket_id}",
            "method_type": "get"
          },
          "open_ai_tool": {
            "type": "function",
            "function": {
              "name": "lookup_ticket",
              "description": "Look up the status and details of a support ticket by its ID.",
              "parameters": {
                "type": "object",
                "properties": {
                  "ticket_id": {
                    "type": "string",
                    "description": "The support ticket ID (e.g., TICK-1234).",
                    "parameter_info": { "type": "url", "key": "ticket_id" }
                  }
                },
                "required": ["ticket_id"]
              }
            }
          },
          "fallback_configuration": {
            "strategies": [
              {
                "type": "continue",
                "instructions": "The CRM system is unavailable. Inform the user that you cannot retrieve ticket information right now and suggest they contact support@acme.example.com."
              }
            ],
            "display_error_in_stage": false
          },
          "display": {
            "stage": {
              "name": "Looking up ticket {ticket_id}",
              "show": true
            }
          }
        }
      ]
    }
  ],
  "starters": [
    "What is the status of ticket TICK-5821?",
    "Has ticket TICK-3099 been resolved?"
  ]
}
```

Note the `"type": "url"` parameter info — the `{ticket_id}` placeholder in the URL is filled with the model-provided value.

---

## 5. Code review assistant with a specialized agent

An app that delegates code review to a specialized DIAL application, with a fallback if the reviewer is unavailable.

```json
{
  "orchestrator": {
    "deployment": {
      "name": "gpt-4o",
      "parameters": { "temperature": 0.3 }
    },
    "system_prompt": {
      "type": "custom",
      "variables": {},
      "content": "You are a developer assistant. When a user shares code for review, use the code_reviewer tool to analyze it. Present the feedback clearly. For general coding questions, answer directly."
    }
  },
  "contexts": [],
  "tool_sets": [
    {
      "type": "dial-deployment",
      "name": "review-agents",
      "tools": [
        {
          "type": "deployment-tool",
          "open_ai_tool": {
            "type": "function",
            "function": {
              "name": "code_reviewer",
              "description": "Analyze a code snippet for bugs, security issues, and style improvements. Returns a structured review.",
              "parameters": {
                "type": "object",
                "properties": {
                  "code": {
                    "type": "string",
                    "description": "The code snippet to review."
                  },
                  "language": {
                    "type": "string",
                    "description": "Programming language of the snippet (e.g., python, typescript)."
                  }
                },
                "required": ["code", "language"]
              }
            }
          },
          "deployment": {
            "name": "claude-3-5-haiku",
            "parameters": { "temperature": 0.1 }
          },
          "system_prompt": {
            "type": "custom",
            "variables": {},
            "content": "You are an expert code reviewer. For each snippet, provide: (1) Bugs or errors found, (2) Security concerns, (3) Style and maintainability suggestions. Be specific and actionable. Use the language specified by the caller."
          },
          "content_propagation": {
            "propagate_history": false
          },
          "fallback_configuration": {
            "strategies": [
              {
                "type": "continue",
                "instructions": "The code reviewer is unavailable. Perform the code review yourself based on your training."
              }
            ],
            "display_error_in_stage": true
          },
          "display": {
            "stage": {
              "name": "Reviewing {language} code",
              "show": true
            }
          }
        }
      ]
    }
  ],
  "starters": [
    "Review this Python function for bugs.",
    "Check this TypeScript snippet for type safety issues.",
    "Is there a security problem in this SQL query?"
  ]
}
```

Replace `"claude-3-5-haiku"` with any model deployment ID available in your DIAL instance.

---

## Next steps

- [Tutorial: agent loop (UI)](tutorial-agent-loop-ui.md) — build a Research Assistant through the DIAL Chat wizard
- [Tutorial: agent loop (API)](tutorial-agent-loop-api.md) — build the same app with a single curl command
- [Tutorial: agent loop (config.json)](tutorial-agent-loop-config.md) — provision the app through infrastructure config
- [Add tools and agents](working-with-tools-and-agents.md) — full how-to for all tool set types
- [Configuration reference](./tool-sets/4.reference.md) — complete schema documentation
