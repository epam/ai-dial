# Bedrock Model Deployment

In this instruction, you will learn how to create Bedrock model in AWS and deploy it in AI DIAL config.

## Prerequisites

* Active AWS account
* Admin role at the account
  
## Steps

1.	Request access to models
2.	Create IAM User
3.	Add a model to AI DIAL config

## Step 1: Request Access to Models

1. In your AWS account, navigate to **Services/Amazon Bedrock**.
2. In Amazon Bedrock, navigate to **Model access** and click the **Manage model access** button.
3. In Base models, select models and click **Save changes** to request access to them. **Note**, it may take a few moment for an access to be granted. You may need to refresh the page to view the updated status.

> To use Bedrock, it is necessary to seek permission to access Bedrock's foundation models. To accomplish this, ensuring the correct IAM Policies is crucial. You can find instructions on how to create IAM Policies in the [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html). Additionally, for specific models, you may be required to provide details about your use case before being able to request access. For more information, please refer to the [Providers](https://eu-central-1.console.aws.amazon.com/bedrock/home#/providers) section on the Bedrock homepage.

## Step 2: Create IAM User

1. In your AWS account, navigate to IAM section.
2. In the navigation tree, select **Users** and click **Create user** in the Users panel.

  Refer to [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) to learn more.

3. Click your new user and navigate to the **Security credentials** tab where you can click **Create access key** to create a key pair for your user.
4. For a new key pair, click **Show** to view and download a CSV file. **Note**, that once shown, the key pair will no longer be available for preview. Make sure you save a CSV file for future use. 

## Step 3: Add a Model to AI DIAL Config

To deploy a model to AI DIAL, it is necessary to add it to config and configure an adapter for it.

Add you model with its parameters in the `models` section. Refer to [AI DIAL Configuration](https://github.com/epam/ai-dial-helm/blob/8a2d6ebe301965ef0e4f06bc5f6e47aadc7b597f/charts/dial/examples/generic/simple/values.yaml#L11) to view an example.

To work with models we use applications called Adapters. You can configure Adapters in the [AI DIAL Config](https://github.com/epam/ai-dial-helm/blob/8a2d6ebe301965ef0e4f06bc5f6e47aadc7b597f/charts/dial/examples/generic/simple/values.yaml#L114).

Refer to [Adapter for Bedrock](https://github.com/epam/ai-dial-adapter-bedrock) to view documentation for a Bedrock AI DIAL Adapter.

```yaml
### examples of basic configurations of adapters ###

### ai-dial-adapter-bedrock configuration ###
bedrock:
  # -- Enable/disable ai-dial-adapter-bedrock
  enabled: false
  commonLabels:
    app.kubernetes.io/component: "adapter"
  image:
    repository: epam/ai-dial-adapter-bedrock
    tag: 0.2.0
  secrets:
    {}
    # DEFAULT_REGION: "us-east-1"
    # AWS_ACCESS_KEY_ID: ""
    # AWS_SECRET_ACCESS_KEY: ""

```

