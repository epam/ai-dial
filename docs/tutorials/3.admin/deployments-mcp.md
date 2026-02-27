# MCP Containers

## Introduction

This page allows you to manage MCP server containers within the DIAL system. You can create new containers based on existing [images](/docs/tutorials/3.admin/deployments-images.md), start and stop running containers as needed, edit configuration settings, and view logs and events for troubleshooting. The page provides all essential tools for deploying and maintaining your MCP servers efficiently.

MCP Containers can be used as sources to create [Toolsets](/docs/tutorials/3.admin/entities-toolsets.md) and [Assets Toolsets](/docs/tutorials/3.admin/assets-toolsets.md).

##### To create a toolset based on MCP container

> Created toolsets can be used in [Quick Apps 2.0](/docs/tutorials/0.user-guide.md#quick-apps-20) workflow to perform specific tasks.

1. [Deploy an image](/docs/tutorials/3.admin/deployments-images.md) with type MCP and use it to [create a container](/docs/tutorials/3.admin/deployments-images.md#actions).
3. In the running container configuration screen, use the [Create](#create-toolset) button to create toolsets.
4. Created toolsets will appear in [Entities/Toolsets](/docs/tutorials/3.admin/entities-toolsets.md) or [Assets/Toolsets](/docs/tutorials/3.admin/assets-toolsets.md).

## Main Screen

On the main screen, you can see a list of all MCP containers along with their current status and details. On this screen, you can also add new MCP containers based on existing images.

![](img/mcp_deployments.png)

##### MCP containers grid

| Column | Description |
|--------|-------------|
| Display Name | Name of the MCP container rendered on UI. |
| Description | Brief description of the MCP container. |
| MCP Image | Name of the image from which the MCP container was created. |
| Status | Current status of the MCP container (e.g., Running, Stopped). |
| ID | Unique identifier of the MCP container. |
| Container URL | URL to access the MCP container. |
| Maintainer | Maintainer of the MCP container. |
| Create time | Date and time when the MCP container was created. |
| Update time | Date and time when the MCP container was last updated. |
| Actions | Buttons to manage the selected MCP container:<br/>- **Open in a new tab**: Use to open the container configuration screen in a new tab in your browser.<br/>- **Duplicate**: Use to duplicate the MCP container.<br/>- **Stop/Run**: Use to start and stop a container.<br/>- **Delete**: Use to remove the container. |

## Create

On the main screen, you can add new MCP containers based on existing [images](/docs/tutorials/3.admin/deployments-images.md). When a new container is created, you can use it as a source type to create [toolsets](/docs/tutorials/3.admin/entities-toolsets.md).

##### To create a new MCP container

1. Click the **+Create** button on the main screen to open the **Creating MCP Container** form.
2. Select the desired image from the list, including the image version.
3. Specify optional properties and click **Finish** to create the container.
4. The screen with the container configuration is displayed. You can modify the configuration as needed, run, stop or delete the container.

![](img/create_mcp_container.png)

## Configuration

Click any MCP container on the main screen to open its configurations.

On the configurations screen, you can view and edit the selected MCP container settings, start and stop the container, view logs and events, or delete the container.

> **Note**: Configuration fields are disabled when the container is in a transition state (launching or stopping).

### Actions

In the header of the Configuration screen, you can find the following action buttons:

| Action | Description |
|--------|-------------|
| Create | Available for running containers. <br /> Click to create a new [Toolset](/docs/tutorials/3.admin/entities-toolsets.md) and [Asset Toolset](/docs/tutorials/3.admin/assets-toolsets.md). |
| Run/Stop | Click to start or stop the MCP container. |
| Delete | Click to delete the MCP container. **Note**: This will effect toolset created based on the deleted container. |

![ ](img/mcp_container_properties_actions.png)

### Create Toolset

You can create a new toolset based on the running MCP container. The created toolset will use the MCP container as its source and appear in [Entities/Toolsets](/docs/tutorials/3.admin/entities-toolsets.md).

1. In the Configuration screen of the running MCP container, click the **Create** button in the header and select **Toolset** from the dropdown.
2. In the Create Toolsets dialog, fill in the form fields:
    - **ID**: Unique identifier for the toolset. Auto-populated according to the selected MCP container.
    - **Display Name**: Enter a name for the toolset. Auto-populated according to the selected MCP container.
    - **Description**: Provide a brief description of the toolset.
3. Click the **Create** button to submit the form and create the toolset.

![ ](img/create_toolset_deployment.png)

### Create Asset Toolset

> Assets are stored in the Public folder in DIAL file system. All authorized users have access to this folder. Objects can be placed in sub-folders, which can have specific access rules applied to them. You can view and manage access rules in [Folders Storage](/docs/tutorials/3.admin/access-management-folders-storage.md).

You can create a new asset toolset based on the running MCP container. The created asset toolset will use the MCP container as its source and appear in [Assets/Toolsets](/docs/tutorials/3.admin/assets-toolsets.md).

1. In the Configuration screen of the running MCP container, click the **Create** button in the header and select **Asset Toolset** from the dropdown.
2. In the Create Asset Toolsets dialog, fill in the form fields:
    - **Folder Storage**: Select a folder for the asset toolset in the Public storage.  
    - **ID**: Unique identifier for the asset toolset. Auto-populated according to the selected MCP container.
    - **Display Name**: Enter a name for the asset toolset. Auto-populated according to the selected MCP container.
    - **Version**: Specify a version of the asset toolset.
    - **Description**: Provide a brief description of the asset toolset.
    - **External Endpoint**: Specify an external endpoint for the asset toolset.
3. Click the **Create** button to submit the form and create the asset toolset.

![ ](img/create_asset_toolset-deployment.png)

### Properties

In the Properties tab, you can preview and modify selected container's basic properties.

##### Fields description

| Property | Required | Editable | Description |
|----------|----------|----------|-------------|
| ID | - | No | Unique identifier of the MCP container. |
| MCP Image | - | No | Image from which the MCP container was created. Click to open details or navigate to [MCP Images](/docs/tutorials/3.admin/deployments-images.md). |
| Creation Time | - | No | Date and time when the MCP container was created. |
| Updated Time | - | No | Date and time when the MCP container was last updated. |
| Status | - | No | Current status of the MCP container (e.g., Running, Stopped). |
| URL | - | No | The URL to access the running MCP container. |
| Restarts | - | No | Restart counter for launching containers. Use to identify crash loops. You can find details in the [Execution Log](#execution-log). |
| Display Name | Yes | Yes | Display name of the MCP container rendered in UI. |
| Description | No | Yes | Brief description of the MCP container. |
| Maintainer | No | Yes | Maintainer of the MCP container. |
| Endpoint Configuration | No | Yes | Endpoint configuration of the MCP container:<br /> **Transport**: the transport protocol (HTTP (default) or SSE).<br />**Container endpoint path**: the specific endpoint path where the MCP service is accessible.<br />**Port**: the network port the container uses. <br /> **Note**: Changes to these settings can be applied to a running container. Saving changes will trigger a restart in RollingUpdate mode. |
| Environment Variables | No | Yes | List of environment variables for the MCP container. <br />You can add, edit, or remove variables as needed.  <br />**Note**: Changes to these settings can be applied to a running container. Saving changes will trigger a restart in RollingUpdate mode. |
| Resources | No | Yes | Resource limits for the MCP container, including CPU and memory allocation. You can adjust these settings based on your requirements.<br />**Note**: Changes to these settings can be applied to a running container. Saving changes will trigger a restart in RollingUpdate mode. |

![](img/mcp_container_properties.png)

**Advanced users with technical expertise** can work with container properties in the table or a JSON editor view modes. It is useful for advanced scenarios of bulk updates, copy/paste between environments, or tweaking settings not exposed on UI.

![ ](img/mcp_container_json_editor.png)

### Firewall settings 

The whitelist domains setting specifies which external domains the MCP container is allowed to connect to. This setting controls outgoing traffic from the container, ensuring that it can only communicate with trusted domains (for example, your company’s website or specific client applications).

**Domain name requirements**: Enter the domain name without protocol, e.g., github.com. Each domain must have at least one dot, labels can include letters, numbers, and hyphens (1–63 chars, not starting or ending with a hyphen), and the top-level domain must be at least 2 letters.

![ ](img/mcp-firewall.png)

### Tools Overview

[Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) are specific functions supported by a related MCP server that can be used by clients to perform specific actions (e.g., process, transform, or analyze data flowing through the MCP server). 

On this screen, you can view the list of tools supported by the selected MCP server along with their details. Toolsets created based on this container will inherit these tools in the [Tools Overview](/docs/tutorials/3.admin/entities-toolsets.md#tools-overview) configuration tab.

![](img/mcp_container_tools.png)

### Resources

A specific contextual data attached and managed by the MCP server that provides additional context to AI models.

![](img/mcp_container_resources.png)

### Prompts

Pre-defined by MCP server templates or instructions that guide language model interactions.

![](img/mcp_container_prompts.png)

### Execution log

The Execution Log tab provides real-time visibility into the operations of your MCP container. Here you can view the chronological output generated during container execution, including status messages, errors, and operational events. This information is invaluable for monitoring container health, diagnosing issues, and verifying proper functionality. Use this log to quickly identify and troubleshoot problems that may occur during the operation of your MCP server.

![](img/mcp_container_execution_log.png)

When container starts with more than one pod, you can see logs for each of them: 

![](img/mcp_log_pods.png)

In case of issues, health indicators are displayed to help identify problems:

| Indicator | Description |
|-----------|-------------|
| Restarts | Restart counter for launching containers. Use to identify crash loops. |
| Last restarted at | Timestamp of the last container restart. |
| Last reason | Restart failure reason. |

![](img/mcp_log.png)

### Events

The Events tab displays significant state changes and discrete occurrences within your MCP container. Unlike the continuous output in the Execution Log, this tab focuses on specific actions such as container starts, stops, configuration changes, and error conditions. 

![](img/mcp_container_events.png)

