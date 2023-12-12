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

1. In your AWS account, navigate to IAM console.
2. In the navigation tree, select **Users** and click **Create user** in the Users panel.

Refer to [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) to learn more.

3. Click your new user and navigate to the **Security credentials** tab when you can click **Create access key** to create and download a key pair for your user.
4. For a new key pair, click **Show** to view and download a CSV file. **Note**, that once shown, the key pair will no longe be available for preview. Make sure you save a SCV file for future use. 
