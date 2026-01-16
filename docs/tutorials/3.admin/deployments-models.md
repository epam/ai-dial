# Models Servings

## Introduction

The Model Servings page enables DIAL admins to deploy and manage containers for AI models listed at [NVIDIA NIM](https://build.nvidia.com/models) and [Hugging Face](https://huggingface.co/models).

## How to Use Models

To be able to use AI models in DIAL, you need adapters. Model adapters unify the APIs of respective AI models to align with the Unified Protocol of DIAL Core. DIAL includes adapters for [Azure OpenAI](https://github.com/epam/ai-dial-adapter-openai) models, [GCP Vertex AI](https://github.com/epam/ai-dial-adapter-vertexai/?tab=readme-ov-file#supported-models) models, and [AWS Bedrock](https://github.com/epam/ai-dial-adapter-bedrock) models. You can also create custom adapters for other AI models with [DIAL SKD](https://github.com/epam/ai-dial-sdk). 

You can use DIAL OpenAI adapter to work with compatible models listed on Hugging Face or NVIDIA NIM. For other models not compatible with OpenAI API, you need to create custom adapters.

##### To enable a model in DIAL:

1. Add and run a model serving container with an OpenAI-compatible model from Hugging Face or NIM.
2. Unless it is a part of your DIAL setup, create a new adapter based on [DIAL Azure OpenAI Adapter](https://github.com/epam/ai-dial-adapter-openai) and add it in [Builders/Adapters](/docs/tutorials/3.admin/builders-adapters.md#create).
3. In [Entities/Models](/docs/tutorials/3.admin/entities-models.md#create-model), create a new model entity:
   - As a **Source Type**, select your OpenAI adapter. 
   - As an **Override Name**, use the model name from the running model serving container. You can find it in the container logs.
   - Add **Upstream Endpoint** with the URL of your model serving running container. Follow this pattern: `http://<container_url>/openai/v1/chat/completions`.
4. Now the AI model is available for users and apps based on your permissions model. 

## Main Screen

On the main screen, you can view existing and add new AI model servings.

![](img/model_servings.png)

##### Model servings grid

|Field|Description|
|---|----|
|Name|Name of the model serving.|
|Description|Brief description of the model serving.|
|Source Type|Source type of the model (NIM or Hugging Face).|
|Status|Current status of the model serving (e.g., Running, Not Running, Stopped, Preparing).|
|ID|Unique identifier for the model serving.|
|Container URL|URL of the container where the model is hosted.<br />Available for a running container.|
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
   - **Source Type**: Select the source type (NIM or Hugging Face).
   - **Model Name**: Applies to Hugging Face source type. Enter the name of the model from Hugging Face.
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

You can use a **running** model serving container to create a new model deployment in DIAL. Once created, the model deployment appears in [Entities/Models](/docs/tutorials/3.admin/entities-models.md). Refer to [How to Use Models](#how-to-use-models) section for more details on how to enable models in DIAL.

1. In the Configuration screen of the running model serving, click the **Create Model** button in the header.
2. In the Create Model dialog, fill in the form fields:
   - **ID**: Unique identifier for the model deployment.
   - **Display Name**: Enter a name for the model deployment.
   - **Display Version**: Specify a version of the model deployment.
   - **Description**: Provide a brief description of the model deployment.
3. Click the **Create** button to submit the form and create the model deployment. Repeat these steps to create more model deployments if needed.

![](img/create_model_deployment.png)

## Properties

In the Properties tab, you can view and edit the selected model serving container settings.

| Property         | Required | Description                                                  |
|------------------|----------|----------------------------------------------------|
|ID                | - |Unique identifier of the model serving container.                  |
|Type| - |Container by default.|
|Creation Time| - |Date and time when the model serving container was created.        |
|Updated Time| - |Date and time when the model serving container was last updated.    |
|Status| - |Current status of the model serving container. |
|URL| - |URL of the container where the model is hosted.|
|Name              | Yes |Name of the model serving container.                               |
|Description       | No  |Brief description of the model serving container.                   |
|Maintainer      | No  |Person or team responsible for maintaining the model serving container.|
|Source Type| Yes |Source type of the model (NIM or Hugging Face).|
|Model Name| Conditional |Applies to Hugging Face source type.<br/>The name of the model from Hugging Face.|
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