# OpenAI Model Deployment

From this instruction, you will learn how to create an Azure OpenAI model GPT-3.5-turbo/GPT-4.

## Steps

1. [Request access to model](#step-1-request-access-to-model)
2. [Create a model deployment](#step-2-create-a-model-deployment)
3. [Add model to AI DIAL](#step-3-add-model-to-ai-dial)

## Prerequisites

* Active Azure account

## Step 1: Request access to model

1. Login to the MS Azure portal (https://portal.azure.com/) with your credentials. Create an account if you do not have one.
2. Navigate to Azure OpenAI and click **Create**.
3. Follow [this link](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUNTZBNzRKNlVQSFhZMU9aV09EVzYxWFdORCQlQCN0PWcu) in the notification message to request access.

![](img/step5.jpg)

> **Important**: you can proceed with model creation only upon receiving the confirmation email.


## Step 2: Create a model deployment

1. Use the search bar to look up **Azure OpenAI** and click it to navigate to the **Azure AI Services|Azure OpenAI** page.
   
   ![](img/step2.jpg)
   
2. You can now find your OpenAI model in the **Azure AI services** section. Click it to open and then click **Go to Azure OpenAI Studio** in the top bar.
   
   ![](img/step8.jpg)
   
3. In Azure OpenAI Studio, click **Deployment** in the navigation menu and click **Create new deployment**. Fill in the required fields and click **Create** to create a model.
   
   ![](img/step9.jpg)

    > It is important to note that certain models may not be accessible for deployment in a particular region. If you need a particular model, you will have to submit a separate request or relocate Azure OpenAI to a different region.

4. Go back to your model page and click **Keys and Endpoint**. In this section, you can find your key and endpoint that you will need to provide in AI DIAL configuration file.
   
    ![](img/step13.jpg)

5. You can restrict access to your accounts based on a specific subset of networks by configuring network rules, only applications that access data through the designated set of networks are permitted to access the account. You can manage default network access rules for Azure AI services resources in **Resource Management/Networking**.

   > Refer to [Microsoft Documentation](https://learn.microsoft.com/en-us/azure/ai-services/cognitive-services-virtual-networks?context=%2Fazure%2Fcognitive-services%2Fopenai%2Fcontext%2Fcontext&tabs=portal#manage-default-network-access-rules) to learn more.
   > Refer to [Microsoft Data Privacy Policy](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy) to learn how data provided by you to the Azure OpenAI service is processed, used, and stored.

   ![](img/whitelisting.png)

## Step 3: Add model to AI DIAL

To deploy a model to AI DIAL, it is necessary to add it to config and configure an adapter for it.

Add you model with its parameters in the `models` section. Refer to [AI DIAL Configuration](https://github.com/epam/ai-dial-helm/blob/8a2d6ebe301965ef0e4f06bc5f6e47aadc7b597f/charts/dial/examples/generic/simple/values.yaml#L11) to view an example.

Refer to [Configuration](./configuration.md#core-parameters) to view the description of parameters.

To work with models, we use applications called Adapters. You can configure Adapters in the [AI DIAL Config](https://github.com/epam/ai-dial-helm/blob/8a2d6ebe301965ef0e4f06bc5f6e47aadc7b597f/charts/dial/examples/generic/simple/values.yaml#L114).

Refer to [Adapter for OpenAI](https://github.com/epam/ai-dial-adapter-openai) to view documentation for a OpenAI AI DIAL Adapter.

```yaml
### examples of basic configurations of adapters ###

### ai-dial-adapter-openai configuration ###
openai:
  # -- Enable/disable ai-dial-adapter-openai
  enabled: false
  commonLabels:
    app.kubernetes.io/component: "adapter"
  image:
    repository: epam/ai-dial-adapter-openai
    tag: 0.2.0
```

