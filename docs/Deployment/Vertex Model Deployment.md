# GCP Model Deployment

In this instruction, you will learn how to create VertexAI model in Google Cloud Platform and deploy it in AI DIAL config.

## Prerequisites

* Active Google Cloud project
* Enabled billing for the project

> Refer to [Google Cloud Documentation](https://cloud.google.com/vertex-ai/docs/featurestore/setup) to learn how to create an account and enable billing.

## Steps
  
1. [Enable Vertex AI API](#step-1-enable-vertex-ai-api)
2. [Create a Service Account](#step-2-create-a-service-account)
3. [Configure AI DIAL Adapter](#step-3-configure-ai-dial-adapter)

## Step 1: Enable Vertex AI API

1.	Log into your Google Cloud account.
2.	In the navigation panel on the left, in **APIs & Services**, select **Enable APIs and Services**.

  	![](img/gcp9.png)
  	
3. In **APIs and Services** click **+ Enable APIs and Services** to access the API library.
4. In the search bar, type **Vertex AI API** and select the **Vertex AI API** panel when it appears in search results.
5. Click **Enable** to turn on the Vertex AI API for your Google Cloud project.
      ![](img/gcp11.png)
   
## Step 2: Create a Service Account

To communicate with VertexAI models, it is necessary to have a service account.

**To create a Service Account**:

1. In your Google Cloud account, in the main navigation menu find **IAM & Admin** and navigate to **Service Accounts**.

	![](img/gcp1.png)

2. To create a new service account, click **+ Create Service Account** and fill in the details for your new service account:
	  
	![](img/gcp2-1.png)

    	
	* Fill in the **Service account details**.
	* In the next step **Grant this service account access to project**, add **Vertex AI Custom Code Service Agent** role. Refer to [GCP Documentation](https://cloud.google.com/vertex-ai/docs/general/access-control#grant_service_agents_access_to_other_resources) to learn more.

	![](img/gcp12.png)

	* Click **Done** to complete.

3. The new service account appears on the Service Account page. Click it to view the details:
    * **In KEYS**, create a key for this service account and download it in JSON format.
    
   	 ![](img/gcp6.png)

## Step 3: Configure AI DIAL Adapter

> Refer to [AI DIAL Config](https://github.com/epam/ai-dial-helm/blob/main/charts/dial/examples/generic/simple/values.yaml) to view a config example.

The JSON file with your model key should be mounted to a pod as a file. Please, use the most suitable way to perform it.

Example of mounting using CSI drivers:

```yaml
vertexai:
  enabled: true

  image:
    tag: imagetag

  env:
    GOOGLE_APPLICATION_CREDENTIALS: "/mnt/secrets-store/gcp-ai-proxy-key"
    GCP_PROJECT_ID: you-project-id
    DEFAULT_REGION: "your-region"
    
  serviceAccount:
    create: 
    name: 

  extraVolumes:
    - name: secrets
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: gcp-ai-key

  extraVolumeMounts:
    - name: secrets
      readOnly: true
      mountPath: /mnt/secrets-store

  extraDeploy:
    - apiVersion: secrets-store.csi.x-k8s.io/v1
      kind: SecretProviderClass
      metadata:
        name: gcp-ai-key
        namespace: your-k8s-namespace
      spec:
        provider: 
        parameters:
          clientID: your-client-id
          cloudName: your-cloud-name
          keyvaultName: your-keyvault-name
          objects: |
            array:
              - |
                objectName: gcp-ai-proxy-key
                objectType: secret
                objectVersion: ""
tenantID: your-tenant-id
          usePodIdentity: "false"
```





