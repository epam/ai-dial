<!-- omit from toc -->
# Bedrock Model Deployment

In this instruction, you will learn how to configure and access Bedrock models in AWS and use them in DIAL Core config.

> Refer to [AWS Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html) to learn about Amazon Bedrock.

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

Starting from October 2025 [Amazon Bedrock has simplified how you access foundation models](https://aws.amazon.com/ru/blogs/security/simplified-amazon-bedrock-model-access/#), streamlining the integration of AI capabilities into your applications.

Amazon Bedrock now provides automatic access to serverless models in your AWS Region, eliminating the previous requirement for manual enablement of each individual model.

This change brings Amazon Bedrock in line with other AWS services by relying on standard AWS access controls rather than requiring customers to enable each model through a model access dashboard. 

> This simplification effort has retired the Model Access page along with the `PutFoundationModelEntitlement` AWS Identity and Access Management (IAM) permission with the corresponding API call. IAM statements with the `PutFoundationModelEntitlement` permission no longer have an effect.

> While you can start using serverless foundation models from most providers instantly, Anthropic models, although enabled by default, still require you to submit a one-time usage form before first use. You can complete this form through either the Amazon Bedrock playground (in AWS Bedrock console) or through direct API submission using [PutUserCaseForModelAccess API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_PutUseCaseForModelAccess.html).

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

> A subset of serverless models on Amazon Bedrock is offered through AWS Marketplace and therefore requires a subscription before use. The following is a sample of IAM policy with “just-in-time” subscription automatically created on the first call:

```json
    {
      "Sid" : "MarketplaceOperationsFromBedrockFor3pModels",
      "Effect" : "Allow",
      "Action" : [
        "aws-marketplace:Subscribe",
        "aws-marketplace:ViewSubscriptions"
      ],
      "Resource" : "*",
      "Condition" : {
        "StringEquals" : {
          "aws:CalledViaLast" : "bedrock.amazonaws.com"
        }
      }
    }
```

### Assign IAM Policy

You can assign an IAM Policy to a specific [user](#assign-to-user), role or to the entire [AWS Service Account](#assign-to-service-account). 

#### Assign to User

IAM (Identity and Access Management) users in AWS (Amazon Web Services) are entities that represent individual users or applications that interact with AWS services and resources. IAM users have their own unique set of security credentials, which include an access key and secret access key.

> Refer to [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) to learn how to create users.

1. In your AWS account, navigate to the **IAM** section.
2. In the navigation tree, select **Users** and click **Create user** in the Users panel.

![](../img/aws5.jpg)

3. On the Step 2 (Set Permissions), you can attach a Policy to the user.
4. When the user is created, click your new user and navigate to the **Security credentials** tab where you can click **Create access key** to create a key pair for your user. Refer to [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-keys-admin-managed.html#admin-create-access-key) for detailed instructions.

#### Assign to Service Account

In case your cluster is located at AWS, the best practice for using Bedrock is to assign an IAM Policy to your Service Account. You can do this via IAM Roles.

> Refer to [AWS Documentation](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) to learn how to configure IAM roles for service accounts.

## Step 3: Add Model to AI DIAL

To deploy a model to DIAL, it is necessary to add it to DIAL Core config and configure a model adapter for it.

### Add Model to AI DIAL Core Config

Add your model with its parameters in the `models` section in the DIAL Core config. 

> * Refer to [DIAL Core Configuration](https://github.com/epam/ai-dial-core/blob/development/sample/aidial.config.json#L30) to view an example.
> * Refer to [Configuration Guide](/docs/tutorials/2.devops/1.configuration/0.configuration-guide.md#core-parameters) to view the configuration of DIAL Core parameters in the helm-based installation.

### Configure AI DIAL Adapter

To work with models, DIAL uses applications called Adapters. You can configure Bedrock Adapter via [environment variables](https://github.com/epam/ai-dial-adapter-bedrock#environment-variables).

> Refer to [Adapter for Bedrock](https://github.com/epam/ai-dial-adapter-bedrock) to view documentation for a Bedrock DIAL Adapter.

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
