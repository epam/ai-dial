# Interceptor Deployments

## Introduction

DIAL uses interceptors as a middleware that modifies incoming or outgoing requests to/from apps and AI models according to a specific logic enabling PII obfuscation, guardrails, safety checks, and beyond. You can use [Interceptors SDK](https://github.com/epam/ai-dial-interceptors-sdk) to create custom interceptors.

You can enable custom interceptors in DIAL using their endpoint or a predefined template. Refer to [Interceptors](/docs/tutorials/3.admin/entities-interceptors.md) and [Interceptor Templates](/docs/tutorials/3.admin/builders-interceptor-templates.md) to learn more. 

You can also deploy custom interceptors using Docker images, which you can add in the [Images](/docs/tutorials/3.admin/deployments-images.md) section.

In **Interceptor Deployments**, you can manage containers for interceptors within the DIAL system. You can create new containers based on existing [images](/docs/tutorials/3.admin/deployments-images.md), start and stop running containers as needed, edit configuration settings, and view logs and events for troubleshooting.

Running containers can be used as sources to create [interceptors](/docs/tutorials/3.admin/entities-interceptors.md) in DIAL.

## Main Screen

On the main screen, you can see a list of all interceptor containers along with their current status and details. On this screen, you can also add new interceptor containers based on existing images.

![](img/interceptor_deployments.png)

##### Interceptor Containers Grid

| Column         | Description                                                  |
|----------------|--------------------------------------------------------------|
| Display Name           | Name of the interceptor container rendered in UI.                       |
| Description    | Brief description of the interceptor container.            |
| Interceptor Image | Docker image from which the interceptor container was created. |
| Status         | Current status of the interceptor container (e.g., Running, Stopped). |
|ID             | Unique identifier of the interceptor container.              |
|Container URL | URL to access the interceptor container.                    |
|Maintainer     | Maintainer of the interceptor container.                    |
| Create time     | Date and time when the interceptor container was created.    |
|Update time   | Date and time when the interceptor container was last updated.|
| Actions        | Buttons to manage the selected interceptor container:<br/>- **Open in a new tab**: click to open the container configuration screen in a new tab in your browser.<br/>-**Duplicate**: click to duplicate the interceptor container.<br/>-**Stop/Run**: click to start and stop a container.<br/>-**Delete**: click to remove the container. |  

## Create

On the main screen, you can add new interceptor containers based on existing [images](/docs/tutorials/3.admin/deployments-images.md). When a new container is created, you can use it as a source type to create [interceptors](/docs/tutorials/3.admin/entities-interceptors.md).

##### To create a new interceptor container

1. Click the **+Create** button on the main screen to open the **Creating Interceptor Container** form.
2. Select the desired Docker image from the list, including the image version.
3. Specify properties and click **Finish** to create the container.
4. The screen with the container configuration is displayed. You can modify the configuration as needed, run, stop or delete the container.

![](img/create_interceptor_container.png)

## Configuration Screen

Click any interceptor container from the main screen to open its configuration screen.

On the configuration screen, you can view and edit the selected interceptor container settings, start and stop the container, view logs and events, or delete the container.

### Actions

In the header of the Configuration screen, you can find the following action buttons:

| Action         | Description                                                  |
|----------------|--------------------------------------------------------------|
| Create Interceptor           | Available for running containers. <br /> Click to create a new [interceptor](/docs/tutorials/3.admin/entities-interceptors.md) using this selected interceptor container.         |
| Run/Stop        | Click to start or stop the interceptor container.           |       
| Delete         | Click to delete the interceptor container.                  |

![](img/interceptor_container_actions.png)

### To Create Interceptor

You can use a **running** interceptor container to create a new interceptor in DIAL. Once created, the interceptor appears in [Entities/Interceptors](/docs/tutorials/3.admin/entities-interceptors.md) and can be used by DIAL applications, tool and models or as a [global interceptor](/docs/tutorials/3.admin/home.md#system-properties).

1. In the Configuration screen of the running interceptor container, click the **Create Interceptor** button in the header.
2. In the Create Interceptor dialog, fill in the form fields:
    - **ID**: Unique identifier for the interceptor.
    - **Display Name**: Enter a name for the interceptor.
    - **Description**: Provide a brief description of the interceptor.
3. Click the **Create** button to submit the form and create the interceptor. Repeat these steps to create more interceptors if needed.

![](img/create_interceptor_deployment.png)

### Properties

In the Properties tab, you can view and edit the selected interceptor container settings.

##### Fields Description

| Property        | Required | Editable |Description | 
|----------------|----------|-----------|-----------|
|ID             | -      | No     |Unique identifier for the interceptor container. |
|Type           | -      | No     | Type of the interceptor container. |
|Interceptor Image | -    | No     | Docker image from which the interceptor container was created. |
|Creation Time     | -      | No     | Date and time when the interceptor container was created. |
|Updated Time   | -      | No     | Date and time when the interceptor container was last updated. |
| Status         | -      | No     | Current status of the interceptor container (e.g., Running, Stopped). |
|URL | -      | No     | URL to access the interceptor container. |
| Display Name           | Yes     | Yes | Name of the interceptor container rendered in UI. |
| Description    | No      | Yes | Brief description of the interceptor container. |
|Maintainer     | No      | Yes | Maintainer of the interceptor container. |
|Endpoint Configuration | No | Yes | Configuration details for the endpoints exposed by the interceptor container. |
|Environment Variables | No | Yes | Environment variables set for the interceptor container. |
|Resources      | No      | Yes | Resource limits and requests for the interceptor container. |

![](img/interceptor_container_properties.png)

You can work with the container properties in the table or a JSON editor view modes:

![ ](img/interceptor_container_json_editor.png)

### Execution log

In the Execution Log tab, you can view real-time logs generated by the selected interceptor container. This log provides insights into the container's operations, including any errors or important events that occur during its execution.


### Events

In the Events tab, you can view a log of significant events related to the selected interceptor container, such as start and stop actions, errors, and other system messages.
