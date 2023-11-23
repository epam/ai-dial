## Create and Deploy OpenAI Model in Azure

In this section, you will learn how to create an Azure OpenAI model GPT-3.5-turbo/GPT-4.

1. Login to the MS Azure portal (https://portal.azure.com/) with your credentials. Create an account if you do not have one.
2. Use the search bar to look up **Azure OpenAI** and click it to navigate to the **Azure AI Services|Azure OpenAI** page.
   
   ![](img/step2.jpg)
   
3. In **Azure AI Services|Azure OpenAI**, click **Create** and fill in all the required fields.
   
   ![](img/step3.jpg)
   
4. You may need to request access to Azure OpenAI Services. Follow the link in the notification to do that.
   
   ![](img/step5.jpg)
   
5. When done, you should have your OpenAI model in the **Azure AI services** section. Click it to open and then click **Go to Azure OpenAI Studio** in the top bar.
   
   ![](img/step8.jpg)
   
6. In Azure OpenAI Studio, click **Deployment** in the navigation menu and click **Create new deployment**. Fill in the required fields and click **Create** to create a model.
   
   ![](img/step9.jpg)

    > It is important to note that certain models may not be accessible for deployment in a particular region. If you need a particular model, you will have to submit a separate request or relocate Azure OpenAI to a different region.

7. Go back to your model page and click **Keys and Endpoint**. In this section, you can find your key and endpoint that you will need to provide in [AI DIAL configuration file](https://github.com/epam/ai-dial/tree/main/docs/Deployment/dialConfig.yaml#L143).
   
    ![](img/step13.jpg)
