# Images

## Introduction

This page allows you to view, add and manage Docker images for [MCP servers](/docs/tutorials/3.admin/deployments-mcp.md) and [Interceptors](/docs/tutorials/3.admin/deployments-interceptors.md) container deployments within the DIAL system.

## Main Screen

On the main screen, you can see all the available and add new Docker images for MCP Servers and Interceptors.

![](img/deployment_images.png)

##### Images Grid

| Column         | Description                                                  |
|----------------|--------------------------------------------------------------|
| ID             | Unique identifier of the image.                  |
| Version        | Version of the Docker image.                             |
| Name           | Name of the Docker image.                               |
| Description    | Brief description of the Docker image.                               |
| Type           | Type of the Docker image (MCP or Interceptor).          |
| Source          | Image or a Source code.|
| Status          | Current status of the Docker image. |
| Update time     | Date and time when the Docker image was last updated.    |
| Create time     | Date and time when the Docker image was created.        |
| Topics          | List of topics associated with the Docker image.        |
| Transport type  | Transport type used by the Docker image:<br />- **Remote** (HTTP/SSE)<br />- **Local** (STDIO).|
| Actions        | Buttons to manage the selected Docker image:<br/>- **Delete**: click to remove the Docker image.<br/>- **Duplicate**: click to create a copy of the Docker image.<br/>- **Open in a new tab**: click to open image properties in a new tab in your browser. |

## Add Image

On the main screen, you can add new Docker images for MCP Servers and Interceptors.

##### To add a new Docker image

1. Click the **+Add** button on the main screen to open the **Adding Image** form.
2. Populate the required fields and click **Add** to add the Docker image.

| Field          | Required |Description                                                  |
|----------------|-----------|---------------------------------------------------|
| Name           | Yes | Name of the Docker image.                               |
| Description    | No | Brief description of the Docker image.                               |
|Version        | Yes |Version of the Docker image.                             |
| Type           | Yes |Type of the Docker image (MCP or Interceptor).          |
|Source type| Conditional | **Note**: Required for MCP type.<br />The source type of the Docker image:<br />- **Docker Image**<br />- **Source Code**|
|Docker image URI| Conditional| URI of the Docker image.<br/>Applies to both MCP (if Source type = Docker image) and Interceptor types.|
|Source code repository parameters| Conditional |Applies if Type = MCP Image and Source type = Source code .<br/>- **Repo URL**: a source code repository URL. **Required**<br />- **Branch name**: the name of the branch in the source code repository.<br />- **SHA**: the SHA in the source code repository.|

![ ](img/add_image.png)

## Configuration Screen

Click any Docker image from the main screen to open its configuration screen.

On the configuration screen, you can view and edit the selected Docker image settings.

### Actions

In the header of the Configuration screen, you can find the following action buttons:

| Action         | Description                                                  |
|----------------|--------------------------------------------------------------|
| Version| Click to create a new image version or display configuration of a selected version.|
| Create Interceptor/MCP Container          | Enabled for the installed images.<br />Click to create a new [MCP](/docs/tutorials/3.admin/deployments-mcp.md) or [Interceptor](/docs/tutorials/3.admin/deployments-interceptors.md) container based on the selected image.         |
| Install        | Enabled for not installed images.<br />Click to install the selected version of an image.                   |  
| Delete         | Click to delete the selected image.                           |

![ ](img/image_actions.png)

### Properties

In the Properties tab, you can preview and modify selected image's basic properties.

| Field          | Required | Editable | Description  |
|----------------|-----------|---------|---------------|
| ID             | - | No | Unique identifier of the Docker image.                  |
|Type| - | No | Type of the Docker image (MCP or Interceptor).          |
|Creation Time| - | No | Date and time when the Docker image was created.        |
|Updated Time| - | No | Date and time when the Docker image was last updated.    |
|Source type|-| No | Source type of the Docker image:<br />- **Docker Image**<br />- **Source Code**|
|Status| - | No | Current status of the Docker image. |
| Name           | Yes | Yes | Name of the Docker image.                               |
| Description    | No | Yes | Brief description of the Docker image.                               |
|Maintainer     | No | Yes | The maintainer of the Docker image.                          |
|Topics          | No | Yes | List of topics associated with the Docker image.        |
|Source type| Conditional | Yes | **Note**: Required for MCP type of image.<br />The source type of the Docker image:<br />- **Docker Image**<br />- **Source Code**|
|Docker image URI| Conditional| Yes| URI of the Docker image.<br/>Applies to both MCP (if Source type = Docker image) and Interceptor types.|
|Source code repository parameters| Conditional | Yes |Applies if Type = MCP Image and Source type = Source code .<br/>- **Repo URL** (required): a source code repository URL.<br />- **Branch name**: the name of the branch in the source code repository.<br />- **SHA**: the SHA in the source code repository.<br />- **Base directory**: the directory path with the Docker file. |
|MCP transport type|Conditional| Yes |Applies only to MCP type of image.<br/>The transport type used by the MCP image:<br />- **Remote** (HTTP/SSE)<br />- **Local** (STDIO).|

![ ](img/image_properties.png)

You can work with image properties in the table or a JSON editor view modes:

![ ](img/image_json_editor.png)

### Build log

> This tab is enabled for installed images.

The Build Log tab displays the complete output generated during the Docker image build process. Here you can view the step-by-step execution of build instructions, including command outputs, warnings, and errors that occurred during image creation.

![ ](img/image_build_log.png)

### Related Containers

> This tab is enabled for installed images.

The Related Containers tab displays all [MCP](/docs/tutorials/3.admin/deployments-mcp.md) or [Interceptor](/docs/tutorials/3.admin/deployments-interceptors.md) containers related to the selected version of the image.

![ ](img/image_related_containers.png)

