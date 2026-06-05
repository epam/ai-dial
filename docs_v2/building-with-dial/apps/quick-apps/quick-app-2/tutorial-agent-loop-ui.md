---
title: "Tutorial: Build an agent loop (UI)"
type: tutorial
persona: app-dev
component: apps
last_verified: 2026-05-29
owner: "@dial-docs-team"
---

# Tutorial: Build an agent loop (UI)

In this tutorial you will build a **Research Assistant** Quick App 2.0 entirely through the DIAL Chat UI. The app connects to a registered Tool Set (an MCP server) and uses an agent loop to answer questions with live data.

For the same tutorial using the API, see [Tutorial: agent loop (API)](tutorial-agent-loop-api.md). For config.json, see [Tutorial: agent loop (config.json)](tutorial-agent-loop-config.md).

## What you will build

A Research Assistant that:
- Accepts a question from the user
- Calls tools from a registered Tool Set to gather data
- Returns a composed answer citing the tool results

Each tool call appears as a collapsible stage in DIAL Chat, so users can inspect what happened.

---

## Prerequisites

- Access to DIAL Chat with an authenticated user account.
- At least one language model deployed in your DIAL instance that supports function calling (e.g., GPT-4o, GPT-5.4 Mini).
- An MCP server accessible from your DIAL instance. This can be any MCP server your organization runs (e.g., a search service, database tool, or internal API). You need its URL and any required credentials.

**Tip: No MCP server available?**
> If you don't have an MCP server to connect, use the [API tutorial](tutorial-agent-loop-api.md) instead — it builds the same agent loop using a free weather REST API that requires no setup.

---

## Step 1: Register a Tool Set

Before you can add tools to a Quick App via the UI, the MCP server must be registered as a Tool Set in DIAL.

1. In DIAL Chat, open **My workspace** from the sidebar.
2. Navigate to the **Toolsets** tab.
3. Click **+ Add toolset**.

The toolset wizard opens with two steps.

### General info

| Field | Value |
|---|---|
| **Name** | My Search Tools |
| **Version** | 0.0.1 |
| **Description** | Search and data access tools for the Research Assistant. |

Click **Next**.

### Toolset settings

| Field | Value |
|---|---|
| **Endpoint** | The URL of your MCP server (e.g., `https://mcp.example.com/mcp`) |
| **Transport protocol** | HTTP (default, works for most servers) |
| **Authentication** | Choose the method that matches your server (Without authentication, API Key, or OAuth) |
| **Allowed tools** | (Optional) Enter specific tool names to expose only a subset of the server's tools |

Click **Save and exit**.

The Tool Set now appears as a card in **My workspace → Toolsets**. For more details on each authentication option, see [Define and register a Tool Set](./tool-sets/1.define-and-register.md).

---

## Step 2: Create the Quick App

1. In **My workspace**, click **Add app** and select **Quick App 2.0**.

![My workspace page with the Add app dropdown open, showing Quick App 2.0 option](../img/add-app-dropdown.png)

2. On the **General info** step, fill in:

| Field | Value |
|---|---|
| **Name** | Research Assistant |
| **Version** | 1.0.0 |
| **Description** | Answers research questions using live data from connected tools. |

Click **Next**.

---

## Step 3: Configure the app

On the **App settings** step:

![Quick App 2.0 wizard — App settings step](../img/authoring-app-settings.png)

### Model

Select a function-calling capable model from the dropdown (e.g., GPT-4o, GPT-5.4 Mini).

### Agents & Toolsets

Click **+ Add** to open the picker dialog.

![Select agents and toolsets dialog with search bar and My workspace / Marketplace tabs](../img/authoring-select-agents.png)

1. Make sure the **My workspace** tab is selected.
2. Find the "My Search Tools" Tool Set you registered in Step 1.
3. Select it and click **Confirm**.

The Tool Set appears as a chip in the Agents & Toolsets section.

![App settings with a Tool Set added as a chip](../img/authoring-agents-added.png)

### Instructions

Paste the following system prompt:

```
You are a Research Assistant. Your job is to answer user questions accurately using the tools available to you.

Guidelines:
- Use the available tools to gather data before answering.
- If a tool call fails, tell the user clearly and provide the best answer you can from existing knowledge.
- Always cite the source of data when you use a tool result.
- Be concise. Prefer bullet points over paragraphs.
```

### Temperature

Set the slider to **0.3** (toward Precise) for consistent, factual responses.

---

## Step 4: Test the agent loop

Use the **Preview** panel on the right side of the wizard. Type a question that should trigger a tool call based on the tools your MCP server provides.

Expected behavior:
1. The orchestrator model decides to call a tool from your Tool Set.
2. The tool call appears as a collapsible stage in the conversation.
3. The orchestrator incorporates the result into its final response.

Expand the stage to inspect the tool arguments and results.

---

## Step 5: Save

Click **Save and exit** in the top-right corner. The app is saved to your personal workspace and is private by default.

![Research Assistant app card visible in My Workspace](../img/tutorial-final.png)

---

## What you learned

- Registered an MCP server as a Tool Set in DIAL Chat.
- Created a Quick App 2.0 using the visual wizard.
- Added the registered Tool Set via the Agents & Toolsets picker.
- Tested an agent loop where the orchestrator calls tools and composes a response.

---

## Next steps

- [Tutorial: agent loop (API)](tutorial-agent-loop-api.md) — build the same app with REST API tools via curl
- [Tutorial: agent loop (config.json)](tutorial-agent-loop-config.md) — provision the app through infrastructure config
- [Add tools and agents](working-with-tools-and-agents.md) — reference for all seven tool set types
- [Share and manage Tool Set permissions](./tool-sets/3.sharing-and-permissions.md) — publish your Tool Set to the Marketplace
