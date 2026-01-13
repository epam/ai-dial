# Models Servings

## Introduction

The Model Servings page enables DIAL admins to deploy and manage AI models listed at NIM and HuggingFace.

When created, a model serving can be used as a source type to create [AI model deployments](/docs/tutorials/3.admin/entities-models.md) in DIAL, making models accessible for DIAL applications and users.

## Main Screen

On the main screen, you can view existing and add new AI model servings.

![](img/model_servings.png)

##### Model servings grid

|Field|Description|
|---|----|
|Name|Name of the model serving.|
|Description|Brief description of the model serving.|
|Source Type|Source type of the model (NIM or HuggingFace).|
|Status|Current status of the model serving (e.g., Running, Not Running, Stopped, Preparing).|
|ID|Unique identifier for the model serving.|
|Container URL|URL of the container where the model is hosted.|
|Maintainer|Person or team responsible for maintaining the model serving.|
|Create time|Date and time when the model serving was created.|
|Update time|Date and time when the model serving was last updated.|

## Create

On the main screen, click the **Create** button to open the Create Model Serving form.

##### To create a new model serving:

1. Click the **Create** button on the main screen to open the Create Model Serving form.
2. Fill in the required fields in the form:
   - **Name**: Enter a name for the model serving.
   - **Description**: Provide a brief description of the model serving.
   - **Source Type**: Select the source type (NIM or HuggingFace).
   - **Model Name**: Applies to HuggingFace source type. Enter the name of the model from HuggingFace.
   - **Docker Image URI**: Applies to NIM source type. Enter the Docker image URI for the model.
3. Click the **Create** button to submit the form and create the model serving.

![](img/create_model_serving.png)

## Configuration Screen

Click any model serving from the main screen to open its configuration screen.

### Actions

In the header of the Configuration screen, you can find the following action buttons:

| Action         | Description                                                  |
|----------------|--------------------------------------------------------------|
| Create Model          | Available for running model servings.<br />Click to create a new [model deployment](/docs/tutorials/3.admin/entities-models.md) using this selected model serving.|
| Run/Stop        | Click to start or stop the selected model serving.|  
| Delete         | Click to delete the selected model serving.|

![ ](img/model_serving_actions.png)

### To Create Model

You can use a **running** model serving to create a new model deployment in DIAL. Once created, the model deployment appears in [Entities/Models](/docs/tutorials/3.admin/entities-models.md) and can be used as a source for DIAL applications and users.

1. In the Configuration screen of the running model serving, click the **Create Model** button in the header.
2. In the Create Model dialog, fill in the form fields:
   - **ID**: Unique identifier for the model deployment.
   - **Display Name**: Enter a name for the model deployment.
   - **Display Version**: Specify a version of the model deployment.
   - **Description**: Provide a brief description of the model deployment.
3. Click the **Create** button to submit the form and create the model deployment. Repeat these steps to create more model deployments if needed.

![](img/create_model_deployment.png)

## Properties

In the Properties tab, you can view and edit the selected model serving settings.

| Property         | Required | Description                                                  |
|------------------|----------|----------------------------------------------------|
|ID                | - |Unique identifier of the model serving.                  |
|Type| - |Container by default.|
|Creation Time| - |Date and time when the model serving was created.        |
|Updated Time| - |Date and time when the model serving was last updated.    |
|Status| - |Current status of the model serving. |
|URL| - |URL of the container where the model is hosted.|
|Name              | Yes |Name of the model serving.                               |
|Description       | No  |Brief description of the model serving.                   |
|Maintainer      | No  |Person or team responsible for maintaining the model serving.|
|Source Type| Yes |Source type of the model (NIM or HuggingFace).|
|Model Name| Conditional |Applies to HuggingFace source type.<br/>The name of the model from HuggingFace.|
|Docker Image URI| Conditional |Applies to NIM source type.<br/>The Docker image URI for the model.|
|Endpoint Configuration| No |Port configuration for the model serving.|
|Environment Variables| No |List of environment variables for the model serving.|
|Resources| No |Resource allocation settings for the model serving (CPU, Memory, GPU).|

![ ](img/model_serving_properties.png)

You can work with model serving properties in the table or a JSON editor view modes:

![ ](img/model_serving_json_editor.png)

## Execution log

In the Execution Log tab, you can view the logs related to the operations and activities of the selected model serving.

![ ](img/model_servings_execution_log.png)

## Events

In the Events tab, you can view the event history related to the selected model serving.

![ ](img/model_servings_events.png)