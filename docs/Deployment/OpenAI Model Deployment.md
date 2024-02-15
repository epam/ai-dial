<!-- omit from toc -->
# OpenAI Model Deployment

From this instruction, you will learn how to create an Azure OpenAI model GPT-3.5-turbo/GPT-4 and use it in AI DIAL config.

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents
- [Prerequisites](#prerequisites)
- [Step 1: Configuring the AI Model](#step-1-configuring-the-ai-model)
  - [Request Access to Models](#request-access-to-models)
  - [Create a Model Deployment](#create-a-model-deployment)
- [Step 2: Get access to AI Model](#step-2-get-access-to-ai-model)
- [Step 3: Add Model to AI DIAL](#step-3-add-model-to-ai-dial)
  - [Add Model to AI DIAL Core Config](#add-model-to-ai-dial-core-config)
  - [Configure AI DIAL Adapter](#configure-ai-dial-adapter)

</div>

## Prerequisites

* Active Azure account

## Step 1: Configuring the AI Model

### Request Access to Models

1. Login to the MS Azure portal (https://portal.azure.com/) with your credentials. Create an account if you do not have one.
2. Navigate to Azure OpenAI and click **Create**.
3. Follow [this link](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUNTZBNzRKNlVQSFhZMU9aV09EVzYxWFdORCQlQCN0PWcu) in the notification message to request access.

![](img/step5.jpg)

> **Important**: you can proceed with model creation only upon receiving the confirmation email.

### Create a Model Deployment

1. Use the search bar to look up **Azure OpenAI** and click it to navigate to the **Azure AI Services|Azure OpenAI** page.
   
   ![](img/step2.jpg)
   
2. You can now find your OpenAI model in the **Azure AI services** section. Click it to open and then click **Go to Azure OpenAI Studio** in the top bar.
   
   ![](img/step8.jpg)
   
3. In Azure OpenAI Studio, click **Deployment** in the navigation menu and click **Create new deployment**. Fill in the required fields and click **Create** to create a model.
   
   ![](img/step9.jpg)

    > It is important to note that certain models may not be accessible for deployment in a particular region. If you need a particular model, you will have to submit a separate request or relocate Azure OpenAI to a different region.

## Step 2: Get access to AI Model

1. Go back to your model page and click **Keys and Endpoint**. In this section, you can find your key and endpoint that you will need to provide in AI DIAL configuration file.
   
    ![](img/step13.jpg)

2. You can restrict access to your accounts based on a specific subset of networks by configuring network rules, only applications that access data through the designated set of networks are permitted to access the account. You can manage default network access rules for Azure AI services resources in **Resource Management/Networking**.

   > Refer to [Microsoft Documentation](https://learn.microsoft.com/en-us/azure/ai-services/cognitive-services-virtual-networks?context=%2Fazure%2Fcognitive-services%2Fopenai%2Fcontext%2Fcontext&tabs=portal#manage-default-network-access-rules) to learn more.
   > Refer to [Microsoft Data Privacy Policy](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy) to learn how data provided by you to the Azure OpenAI service is processed, used, and stored.

   ![](img/whitelisting.png)

## Step 3: Add Model to AI DIAL

To deploy a model to AI DIAL, it is necessary to add it to config and configure an adapter for it.

### Add Model to AI DIAL Core Config

Add your model with its parameters in the `models` section. 

> Refer to [AI DIAL Core Configuration](https://github.com/epam/ai-dial-core/blob/development/sample/aidial.config.json#L30) to view an example.

> Refer to [Configure core config](./configuration.md#core-parameters) to view the configuration of AI DIAL core parameters in the helm-based installation.

### Configure AI DIAL Adapter

To work with models, we use applications called Adapters. You can configure OpenAI Adapter via [environment variables](https://github.com/epam/ai-dial-adapter-openai#environment-variables).

> Refer to [Adapter for OpenAI](https://github.com/epam/ai-dial-adapter-openai) to view documentation for a OpenAI AI DIAL Adapter.

```yaml
### examples of basic configurations of adapters ###

### ai-dial-adapter-openai configuration ###
openai:
  # -- Enable/disable ai-dial-adapter-openai
  enabled: true

```
