---
title: "Monitor usage and dashboards"
type: how-to
persona: admin
component: admin
last_verified: 2026-06-04
owner: "@dial-docs-team"
---

# Monitor usage and dashboards

This page explains how to use the Dashboard and Usage Log screens in DIAL Admin to monitor system health, track request throughput, analyze token and cost consumption, and export detailed usage records. You need administrator access to DIAL Admin to perform these tasks.

For background on observability and system monitoring in DIAL, see [Observability](https://docs.dialx.ai/platform/8.observability-intro).

---

## Dashboard

Navigate to **Audit → Dashboard** to monitor system metrics across Chat and MCP workloads.

![Dashboard overview with controls and system usage chart](../img/audit-dashboard.png)

### Controls and filters

| Control | Description |
|---------|-------------|
| **View by** | Switches the dashboard between Chat and MCP usage metrics. |
| **Time Period** | Date range applied to all charts and tables. Choose a predefined option or set a custom range. |
| **+ Add filter** | Drill into specific subsets by Projects or Entities. |
| **Auto refresh** | Pull new data automatically (e.g., every one minute) or disable auto-refresh. |

### Chat dashboard

#### System usage chart

System Usage is a time-series line chart showing request throughput over the selected time period for projects or entities. Use it to identify traffic peaks and valleys, and to correlate spikes with deployments or feature releases.

![System usage time-series line chart](../img/79.png)

#### Metrics

Metrics are calculated for the selected time period across the entire system.

| Metric | Description |
|--------|-------------|
| **Unique Users** | Count of distinct user IDs or API keys. |
| **Request Count** | Total number of chat or embedding calls. |
| **Total Tokens** | Total sum of prompt and completion tokens used. |
| **Money** | Estimated spending in USD. |

![Summary metrics cards showing unique users, request count, tokens, and cost](../img/80.png)

#### Entities consumption

The Entities Consumption table monitors consumption metrics for deployments: models, applications, tool sets, interceptors, and routes. Use it to compare token usage across entities, identify cost-inefficient deployments, and optimize resources.

| Column | Description |
|--------|-------------|
| **ID** | Unique identifier of the entity. |
| **Request Count** | Number of calls directed to the entity. |
| **Prompt tokens** | Total tokens submitted in the prompt portion of requests. |
| **Completion tokens** | Total tokens returned by the model or application as responses. |
| **Money** | Estimated overall costs in USD. |

![Entities consumption table](../img/audit-entities-consumption.png)

#### Projects consumption

The Projects Consumption table monitors consumption metrics per project. Use it to compare token usage across projects, identify cost-inefficient projects, and optimize resources.

| Column | Description |
|--------|-------------|
| **Project** | Project name. |
| **Request Count** | Number of calls directed to the model or application. |
| **Prompt tokens** | Total tokens submitted in the prompt portion of requests. |
| **Completion tokens** | Total tokens returned by the model or application in responses. |
| **Money** | Estimated overall costs in USD. |

![Projects consumption table](../img/audit-projects-consumption.png)

#### Grafana

Click **Open Grafana** to access the Grafana dashboard for additional system metrics.

![Grafana link button in the dashboard](../img/81.png)

![Grafana dashboard view](../img/grafana.png)

### MCP dashboard

The MCP dashboard gives administrators a clear picture of how MCP servers and tools are being used. It shows user activity, call counts, and usage by project or deployment, making it easy to track usage, spot trends, and manage resources.

#### Request per MCP usage chart

This chart provides an overview of MCP activity: initialization events, tool calls, and tool list interactions. Use it to monitor usage patterns, identify trends, and optimize resource allocation.

![MCP requests time-series chart](../img/mcp-requests-chart.png)

#### MCP totals metrics

| Metric | Description |
|--------|-------------|
| **Unique Users** | Count of distinct user IDs or API keys that interacted with the MCP. |
| **Total MCP Calls** | Total number of requests to MCP servers. |
| **Total Tool Calls** | Total interactions with MCP tools. |

![MCP totals metrics cards](../img/mcp-metrics.png)

#### MCP consumption metrics

| Dashboard | Description |
|-----------|-------------|
| **MCP Consumption** | Number of calls made to each MCP. |
| **Tools Consumption** | Number of calls for each tool, grouped by MCP. Helps identify frequently used tools. |
| **Calls by Deployment** | MCP usage broken down by application—shows how many calls each application made to a particular MCP. |
| **Project Consumption** | MCP and tool calls summarized at the project level. |

### Route dashboard

The Route dashboard gives administrators a clear picture of how routes are being used.

**Note**
> Route calls are attributed to the DIAL deployment whose route endpoint was called, not to the deployment that initiated the call. **Deployment** refers to the DIAL application the route belongs to. **Parent Deployment** refers to the DIAL application that initiated the route call.

#### Route requests chart

This chart provides an overview of all requests made to registered routes.

![Route requests time-series chart](../img/routes-requests-chart.png)

#### Route totals metrics

| Metric | Description |
|--------|-------------|
| **Unique Users** | Count of distinct user IDs or API keys that interacted with routes. |
| **Total Route Calls** | Total number of requests to registered routes. |

#### Route calls metrics

| Dashboard | Description |
|-----------|-------------|
| **Calls by Deployment** | Total calls made to routes of a specific DIAL deployment (application). |
| **Calls by Route** | Usage of individual routes within a DIAL deployment. |
| **Calls from Parent Deployments** | Which DIAL deployment initiated a route call, the deployment the route belongs to, and the total call count. |
| **Calls by Project** | Route usage summarized at the project level. |

---

## Usage log

Navigate to **Audit → Usage Log** to access detailed, row-level records of all requests processed by DIAL Core.

Each request to DIAL Core may trigger a sequence of calls that all share the same **Trace ID**. Each call in the sequence has a unique **Core Span ID**. Together, Trace ID and Core Span ID uniquely identify every request, enabling end-to-end tracing.

For example, a root call from DIAL Chat to DIAL Core might trigger calls to GPT-4, a RAG application, and Gemini—all sharing the same Trace ID:

```text
DIAL Client
  |
  v
DIAL ChatHub
  |
  +--> GPT-4
  |
  +--> DIAL RAG --> Gemini
```

Usage Log offers two complementary views: **Traces** for individual request details and **Conversations** for aggregated conversation-level metrics. There are also dedicated tabs for **MCP** and **Routes** activity.

### Top bar controls

| Control | Description |
|---------|-------------|
| **Time Period** | Scopes the table to a specific time range (e.g., last 24 hours, last 7 days, custom range). |
| **Refresh** | Reloads the table with the latest data, applying all active filters. |

### Traces

The Traces tab provides a detailed view of all requests processed by DIAL Core. Each row represents an individual request—whether initiated by an external or internal DIAL client. Use it to investigate specific interactions, troubleshoot issues, or analyze usage patterns.

![Usage log Traces tab](../img/usage-log-traces.png)

| Column | Description |
|--------|-------------|
| **Completion Time** | Timestamp when DIAL Core finished processing the request. |
| **Number of request messages** | Chat conversation length (for chat completion requests) or input count (for embedding requests). |
| **Trace ID** | OpenTelemetry trace ID uniquely identifying the root request. All subsequent calls triggered by this request share the same Trace ID. |
| **Core span ID** | OpenTelemetry span ID for this request. |
| **Core span parent ID** | OpenTelemetry span ID of the DIAL Core request that called this request. |
| **Response ID** | Identifier of the response object returned by the AI model. |
| **Conversation ID** | DIAL Chat conversation identifier this request belongs to. |
| **Deployment ID** | Identifier of the DIAL deployment for this request. |
| **Parent Deployment ID** | Identifier of the DIAL parent deployment that triggered this request. |
| **Execution path** | List of DIAL Deployment IDs representing the call stack. For example, `['app1', 'app2', 'model1']` means `app1` called `app2`, which called `model1`. The last element equals the Deployment ID; the penultimate element (when present) equals the Parent Deployment ID. |
| **Prompt tokens** | Total tokens in prompts sent to AI models during this request. |
| **Cached prompt tokens** | Number of prompt tokens served from cache (prompt caching) in this request. |
| **Completion tokens** | Tokens generated by the AI model as output. |
| **Deployment price** | Cost of this specific request, excluding costs of any requests it triggered. |
| **Total price** | Total cost of this request including all related requests it directly or indirectly triggered. Always: Total price ≥ Deployment price. |
| **Model** | Identifier of the underlying AI model used. |
| **Project** | Project ID corresponding to the DIAL API key used for this request. |
| **Upstream** | The upstream endpoint (e.g., the model's completions endpoint). |
| **User** | Unique hash identifying the user who initiated the request. |
| **User title** | Job title of the user (if available). |
| **Topic** | Auto-generated subject summarizing the request. |
| **Language** | Language detected in the request (e.g., `en`). |
| **Reactions** | Indication of user reactions (like/dislike) for this request. |

### Conversations

The Conversations tab aggregates metrics for requests sharing the same Conversation ID. Each row represents a conversation session. Use it to analyze multi-turn dialogues, track user engagement patterns, and monitor resource utilization across entire conversations.

![Usage log Conversations tab](../img/usage-log-conversations.png)

| Column | Description |
|--------|-------------|
| **Last activity** | Timestamp of the most recent request in the conversation. |
| **Conversation ID** | DIAL Chat conversation identifier. |
| **Deployment ID** | Identifier of the DIAL deployment for this conversation. |
| **Prompt tokens** | Total request/prompt tokens sent to the AI model within the conversation. |
| **Cached prompt tokens** | Prompt tokens served from cache within the conversation. |
| **Completion tokens** | Total tokens generated by the AI model in the conversation. |
| **Total price** | Total cost of all requests in the conversation. |
| **Number of request messages** | Conversation length (for chat completion) or input count (for embedding). |
| **Project** | Project ID corresponding to the DIAL API key used. |
| **User** | Unique hash identifying the user who initiated the conversation. |
| **User title** | Job title of the user (if available). |
| **Topic** | Auto-generated subject summarizing the conversation. |
| **Language** | Detected language (e.g., `en`). |

### MCP tab

The MCP tab provides a focused view of MCP-related activity. Each row represents an MCP call. Use it to monitor tool usage, trace individual calls, and analyze integration patterns.

![Usage log MCP tab](../img/usage-log-mcp.png)

| Column | Description |
|--------|-------------|
| **Last activity** | Timestamp of the most recent MCP call. |
| **Deployment ID** | Deployment name of the DIAL tool set or application corresponding to the call. |
| **Project** | Project ID associated with the call, based on the DIAL API key used. |
| **Tool Name** | Name of the tool invoked. |
| **Trace ID** | OpenTelemetry trace ID uniquely identifying the MCP call sequence. |
| **Method** | Method or operation performed by the MCP tool. |

### Routes tab

The Routes tab provides a focused view of route-related activity. Each row represents a call to a route.

![Usage log Routes tab](../img/usage-log-routes.png)

| Column | Description |
|--------|-------------|
| **Last activity** | Timestamp of the most recent route call. |
| **Route** | Name of the route invoked. |
| **Method** | Method or operation performed by the route. |
| **Upstream** | The upstream endpoint called during the route call. |
| **Deployment ID** | The DIAL deployment whose route endpoint was called. |
| **Project** | Project ID associated with the call, based on the DIAL API key used. |
| **Trace ID** | OpenTelemetry trace ID uniquely identifying the route call sequence. |

---

## Next steps

- [Review activity and roll back changes](./activity-and-rollback.md) — audit configuration changes and restore previous states
- [Manage API keys](../access-management/keys.md) — review per-project key usage and set validity periods
- [Manage roles](../access-management/roles.md) — configure token rate limits and cost limits per role
