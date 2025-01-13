<!-- omit from toc -->
# Bedrock Model Deployment

In this instruction, you will learn how to create Bedrock model in AWS and use it in AI DIAL config.

> Refer to [AWS Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html) to learn about this model.

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents
- [Prerequisites](#prerequisites)
- [Step 1: Configuring the AI Model](#step-1-configuring-the-ai-model)
  - [Request Access to Models](#request-access-to-models)
- [Step 2: Get Access to AI Model](#step-2-get-access-to-ai-model)
  - [Create IAM Policy](#create-iam-policy)
  - [Assign IAM Policy](#assign-iam-policy)
    - [Assign to User](#assign-to-user)
    - [Assign to Service Account](#assign-to-service-account)
- [Step 3: Add Model to AI DIAL](#step-3-add-model-to-ai-dial)
  - [Add Model to AI DIAL Core Config](#add-model-to-ai-dial-core-config)
  - [Configure AI DIAL Adapter](#configure-ai-dial-adapter)
    - [Use IAM User](#use-iam-user)
    - [Use AWS Service Account](#use-aws-service-account)

</div>

## Prerequisites

* Active AWS account
* Admin role at the account

## Step 1: Configuring the AI Model

### Request Access to Models

1. In your AWS account, navigate to **Services/Amazon Bedrock**.
2. In Amazon Bedrock, navigate to **Model access** and click the **Manage model access** button.
3. In Base models, select models and click **Save changes** to request access to them. **Note**, it may take a few moment for an access to be granted. You may need to refresh the page to view the updated status.

![](img/aws1.jpg)

> To use Bedrock, it is necessary to seek permission to access Bedrock's foundation models. To accomplish this, ensuring the correct IAM Policies is crucial. You can find instructions on how to create IAM Policies in the [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html). Additionally, for specific models, you may be required to provide details about your use case before being able to request access. For more information, please refer to the [Providers](https://eu-central-1.console.aws.amazon.com/bedrock/home#/providers) section on the Bedrock homepage.

## Step 2: Get Access to AI Model

### Create IAM Policy

IAM (Identity and Access Management) policies in AWS (Amazon Web Services) are a set of rules that define permissions for users, groups, and roles within an AWS account.

> Refer to [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) to learn how to create a policy.

You can create your own IAM policy or use AWS-managed IAM policy **AmazonBedrockFullAccess**, which grants full access to the Bedrock service.

When using a custom policy, we recommend assigning permissions below to limit the scope of allowed interactions with models: 

* bedrock:GetFoundationModel
* bedrock:ListFoundationModels
* bedrock:InvokeModel
* bedrock:InvokeModelWithResponseStream

### Assign IAM Policy

You can assign an IAM Policy to a specific [user](#assign-to-user), role or to the entire [AWS Service Account](#assign-to-service-account). 

#### Assign to User

IAM (Identity and Access Management) users in AWS (Amazon Web Services) are entities that represent individual people or applications that interact with AWS services and resources. IAM users have their own unique set of security credentials, which include an access key and secret access key.

> Refer to [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) to learn how to create users.

1. In your AWS account, navigate to IAM section.
2. In the navigation tree, select **Users** and click **Create user** in the Users panel.

![](img/aws5.jpg)

3. On the Step 2 (Set Permissions), you can attach a Policy to the user.
4. When the user is created, click your new user and navigate to the **Security credentials** tab where you can click **Create access key** to create a key pair for your user.
5. For a new key pair, click **Show** to view and download a CSV file. **Note**, that once shown, the key pair will no longer be available for preview. Make sure you save a CSV file for future use. 

#### Assign to Service Account

In case your cluster is located at AWS, the best practice for using Bedrock is to assign an IAM Policy to your Service Account. You can do this via IAM Roles.

> Refer to [AWS Documentation](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) to learn how to configure an IAM roles for service accounts.

## Step 3: Add Model to AI DIAL

To deploy a model to AI DIAL, it is necessary to add it to config and configure an adapter for it.

### Add Model to AI DIAL Core Config

Add your model with its parameters in the `models` section. 

> Refer to [AI DIAL Core Configuration](https://github.com/epam/ai-dial-core/blob/development/sample/aidial.config.json#L30) to view an example.

> Refer to [Configure core config](./configuration.md#core-parameters) to view the configuration of AI DIAL core parameters in the helm-based installation.

### Configure AI DIAL Adapter

To work with models, we use applications called Adapters. You can configure Bedrock Adapter via [environment variables](https://github.com/epam/ai-dial-adapter-bedrock#environment-variables).

> Refer to [Adapter for Bedrock](https://github.com/epam/ai-dial-adapter-bedrock) to view documentation for a Bedrock AI DIAL Adapter.

#### Use IAM User

In this scenario, provide the access key of your user via environment variables: 

```yaml
### examples of basic configurations of adapters ###

### ai-dial-adapter-bedrock configuration for IAM user###
bedrock:
  # -- Enable/disable ai-dial-adapter-bedrock
  enabled: true

  env:
    DEFAULT_REGION: "us-east-1"

  secrets:
    AWS_ACCESS_KEY_ID: "AKIAIOSFODNN7EXAMPLE"
    AWS_SECRET_ACCESS_KEY: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
```

#### Use AWS Service Account

> Before taking this step, configure [IAM roles for service accounts](#assign-to-service-account).

In this scenario, provide the IAM Role that you have assigned to your AWS Service Account: 

 ```yaml
# --example of AI DIAL configuration for service account
bedrock:
  # -- Enable/disable ai-dial-adapter-bedrock
  enabled: true

  env:
    DEFAULT_REGION: "us-east-1"
  
  serviceAccount:
    create: true
    annotations:
      eks.amazonaws.com/role-arn: "arn:aws:iam::000001206603:role/role_name"
 ```
