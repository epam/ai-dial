# Bedrock Model Deployment

In this instruction, you will learn how to create Bedrock model in AWS and deploy it in AI DIAL config.

## Prerequisites

* Active AWS account
* Admin role at the account
  
## Steps

1.	Request access to models
2.	Add a model to AI DIAL config
3.	Create IAM User

## Step 1: Request Access to Models

1. In your AWS account, navigate to **Services/Amazon Bedrock**.
2. In Amazon Bedrock, navigate to **Model access** and click the **Manage model access** button.
3. In Base models, select models and click **Save changes** to request access to them.

> To use Bedrock, it is necessary to seek permission to access Bedrock's foundation models. To accomplish this, ensuring the correct IAM Policies is crucial. You can find instructions on how to create IAM Policies in the [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html). Additionally, for specific models, you may be required to provide details about your use case before being able to request access. For more information, please refer to the [Providers](https://eu-central-1.console.aws.amazon.com/bedrock/home#/providers) section on the Bedrock homepage.
