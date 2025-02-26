<!-- omit from toc -->
# Vertex Model Deployment

In this instruction, you will learn how to create VertexAI model in Google Cloud Platform and use it in AI DIAL config.

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents
- [Prerequisites](#prerequisites)
- [Step 1: Configuring the AI Model](#step-1-configuring-the-ai-model)
  - [Request Access to Models](#request-access-to-models)
- [Step 2: Get Access to AI Model](#step-2-get-access-to-ai-model)
  - [Create a Service Account](#create-a-service-account)
    - [Configure GCP Service Account and Get JSON Key](#configure-gcp-service-account-and-get-json-key)
    - [Configure Kubernetes Service Account](#configure-kubernetes-service-account)
- [Step 3: Add Model to AI DIAL](#step-3-add-model-to-ai-dial)
  - [Add Model to AI DIAL Core Config](#add-model-to-ai-dial-core-config)
  - [Configure AI DIAL Adapter](#configure-ai-dial-adapter)
    - [Use GCP Service Account with JSON Key](#use-gcp-service-account-with-json-key)
    - [Use GCP Service Account with Workload Identity Federation for GKE](#use-gcp-service-account-with-workload-identity-federation-for-gke)

</div>

## Prerequisites

* Active Google Cloud project
* Enabled billing for the project

> Refer to [Google Cloud Documentation](https://cloud.google.com/vertex-ai/docs/featurestore/setup) to learn how to create an account and enable billing.

## Step 1: Configuring the AI Model

### Request Access to Models

1.	Log into your Google Cloud account.
2.	In the navigation panel on the left, in **APIs & Services**, select **Enable APIs and Services**.

  	![](../img/gcp9.png)
  	
3. In **APIs and Services** click **+ Enable APIs and Services** to access the API library.
4. In the search bar, type **Vertex AI API** and select the **Vertex AI API** panel when it appears in search results.
5. Click **Enable** to turn on the Vertex AI API for your Google Cloud project.
      ![](../img/gcp11.png)
   
## Step 2: Get Access to AI Model

### Create a Service Account

#### Configure GCP Service Account and Get JSON Key

To communicate with VertexAI models, it is necessary to have a service account.

**To create a Service Account**:

1. In your Google Cloud account, in the main navigation menu find **IAM & Admin** and navigate to **Service Accounts**.

	![](../img/gcp1.png)

2. To create a new service account, click **+ Create Service Account** and fill in the details for your new service account:
	  
	![](../img/gcp2-1.png)

    	
	* Fill in the **Service account details**.
	* In the next step **Grant this service account access to project**, add **Vertex AI Custom Code Service Agent** role. Refer to [GCP Documentation](https://cloud.google.com/vertex-ai/docs/general/access-control#grant_service_agents_access_to_other_resources) to learn more.

	![](../img/gcp12.png)

	* Click **Done** to complete.

3. The new service account appears on the Service Account page. Click it to view the details:
    * **In KEYS**, create a key for this service account and download it in JSON format.
    
   	 ![](../img/gcp6.png)
  
#### Configure Kubernetes Service Account

In case your cluster is located at GCP, the best practice for using VertexAI is to assign a GCP IAM service account to Kubernetes Service Account. You can do this via Workload Identity Federation for GKE.

> Refer to [GCP Documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity) to learn how to configure a Workload Identity Federation for GKE.

## Step 3: Add Model to AI DIAL

### Add Model to AI DIAL Core Config

To deploy a model to AI DIAL, it is necessary to add it to config and configure an adapter for it.

Add your model with its parameters in the `models` section. 

> Refer to [AI DIAL Core Configuration](https://github.com/epam/ai-dial-core/blob/development/sample/aidial.config.json#L30) to view an example.

> Refer to [Configure core config](/docs/tutorials/2.devops/1.configuration/0.configuration-guide.md#core-parameters) to view the configuration of AI DIAL core parameters in the helm-based installation.

### Configure AI DIAL Adapter

To work with models, we use applications called Adapters. You can configure VertexAI Adapter via [environment variables](https://github.com/epam/ai-dial-adapter-vertexai#environment-variables).

> Refer to [Adapter for Vertex](https://github.com/epam/ai-dial-adapter-vertexai) to view documentation for a Vertex AI DIAL Adapter.

#### Use GCP Service Account with JSON Key

The JSON file with your GCP key should be mounted to a pod as a file. Please, use the most suitable way to perform it.

Example of mounting JSON key using secrets:

```yaml
vertexai:
  enabled: true

  env:
    DEFAULT_REGION: "your-region"
    GOOGLE_APPLICATION_CREDENTIALS: "/mnt/secrets-store/gcp-ai-key"
    GCP_PROJECT_ID: "your-project-id"

  secrets:
    gcp-ai-key: |
      {
      "type": "service_account",
      ...
      "universe_domain": "googleapis.com"
      }

  extraVolumes:
    - name: key-file
      secret:
        secretName: '{{ template "dialExtension.names.fullname" . }}'
        items:
          - key: gcp-ai-key
            path: gcp-ai-key

  extraVolumeMounts:
    - name: key-file
      mountPath: "/mnt/secrets-store"
      readOnly: true

```

#### Use GCP Service Account with Workload Identity Federation for GKE

> Before taking this step, configure [Authenticate to Google Cloud APIs from GKE workloads](#configure-kubernetes-service-account).

In this scenario, Kubernetes Service Account is linked to GCP IAM service account (your-sa-id).

```yaml
vertexai:
  enabled: true

  serviceAccount:
    create: true
    annotations:
      iam.gke.io/gcp-service-account: your-sa-id@your-project-id.iam.gserviceaccount.com

  env:
    DIAL_URL: "http://dial-core"
    GCP_PROJECT_ID: "your-project-id"
    DEFAULT_REGION: "your-region"

```
