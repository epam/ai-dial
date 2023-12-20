# Bedrock Model Deployment

In this instruction, you will learn how to create Bedrock model in AWS and deploy it in AI DIAL config.

> Refer to [AWS Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html) to learn about this model.

## Prerequisites

* Active AWS account
* Admin role at the account
  
## Steps

1.	[Request access to models](#step-1-request-access-to-models)
2.	[Create IAM Policy](#step-2-create-iam-policy)
3.	[Assign IAM Policy](#step-3-assign-iam-policy)
4.	[Add Model to AI DIAL](#step-4-add-model-to-ai-dial)

## Step 1: Request Access to Models

1. In your AWS account, navigate to **Services/Amazon Bedrock**.
2. In Amazon Bedrock, navigate to **Model access** and click the **Manage model access** button.
3. In Base models, select models and click **Save changes** to request access to them. **Note**, it may take a few moment for an access to be granted. You may need to refresh the page to view the updated status.

![](img/aws1.jpg)

> To use Bedrock, it is necessary to seek permission to access Bedrock's foundation models. To accomplish this, ensuring the correct IAM Policies is crucial. You can find instructions on how to create IAM Policies in the [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html). Additionally, for specific models, you may be required to provide details about your use case before being able to request access. For more information, please refer to the [Providers](https://eu-central-1.console.aws.amazon.com/bedrock/home#/providers) section on the Bedrock homepage.

## Step 2: Create IAM Policy

IAM (Identity and Access Management) policies in AWS (Amazon Web Services) are a set of rules that define permissions for users, groups, and roles within an AWS account.

> Refer to [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) to learn more.

You can create your own IAM policy or use AWS-managed IAM policy **AmazonBedrockFullAccess**, which grants the full access to the Bedrock service.

When using a custom policy, we recommend assigning permissions below to limit the scope of allowed interactions with models: 

* bedrock:GetFoundationModel
* bedrock:ListFoundationModels
* bedrock:InvokeModel
* bedrock:InvokeModelWithResponseStream

## Step 3: Assign IAM Policy

You can assign an IAM Policy to a specific [user](#assign-to-user) or to the entire [Service Account](#assign-to-service-account). 

### Assign to User

IAM (Identity and Access Management) users in AWS (Amazon Web Services) are entities that represent individual people or applications that interact with AWS services and resources. IAM users have their own unique set of security credentials, which include an access key and secret access key.

> Refer to [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) to learn more.

1. In your AWS account, navigate to IAM section.
2. In the navigation tree, select **Users** and click **Create user** in the Users panel.

![](img/aws5.jpg)

3. On the Step 2 (Set Permissions), you can attach a Policy to the user.
4. When the user is created, click your new user and navigate to the **Security credentials** tab where you can click **Create access key** to create a key pair for your user.
5. For a new key pair, click **Show** to view and download a CSV file. **Note**, that once shown, the key pair will no longer be available for preview. Make sure you save a CSV file for future use. 

### Assign to Service Account

In case your cluster is located at AWS, the best practise for using Bedrock is to assign an IAM Policy to your Service Account. You can do this via IAM Roles.

#### Create IAM Roles

IAM (Identity and Access Management) roles in AWS (Amazon Web Services) are entities that define a set of permissions for AWS resources. IAM roles are not tied to a specific user or group but can be assumed by IAM users, AWS services, or even external accounts for temporary access to AWS resources.

> Refer to [AWS Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create.html) to learn how to create IAM role and assign AWS/custom IAM policy.

**To Enable IAM Roles for AWS Service Accounts**:

1. Create an IAM OIDC provider for your cluster. You only complete this procedure once for each cluster. Refer to [AWS Documentation](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) to learn more.
2. Configure a Kubernetes Service Account to assume an IAM Role. Complete this procedure for each unique set of permissions that you want an application to have. Refer to [AWS Documentation](https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html) to learn more.
3. Configure Pods to use a Kubernetes Service Account. Complete this procedure for each Pod that needs access to AWS services. Refer to [AWS Documentation](https://docs.aws.amazon.com/eks/latest/userguide/pod-configuration.html) to learn more.
4. Confirm that the workload uses an AWS SDK of a supported version and that the workload uses the default credential chain. Refer to [AWS Documentation](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts-minimum-sdk.html) to learn more.

## Step 4: Add Model to AI DIAL

To deploy a model to AI DIAL, it is necessary to add it to config and configure an adapter for it. 

### Add Model

Add you model with its parameters in the `models` section. Refer to [AI DIAL Configuration](https://github.com/epam/ai-dial-helm/blob/8a2d6ebe301965ef0e4f06bc5f6e47aadc7b597f/charts/dial/examples/generic/simple/values.yaml#L11) to view an example.

Refer to [Configuration](./configuration.md#core-parameters) to view the description of parameters.

### Configure Bedrock Adapter

To work with models, we use applications called Adapters. You can configure Adapters in the [AI DIAL Config](https://github.com/epam/ai-dial-helm/blob/8a2d6ebe301965ef0e4f06bc5f6e47aadc7b597f/charts/dial/examples/generic/simple/values.yaml).

Refer to [Adapter for Bedrock](https://github.com/epam/ai-dial-adapter-bedrock) to view documentation for a Bedrock AI DIAL Adapter.

#### For IAM User

In this scenario, provide the sectes of your user that you have saved in a CSV file: 

```yaml
### examples of basic configurations of adapters ###

### ai-dial-adapter-bedrock configuration for IAM user###
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

#### For AWS Service Account

In this scenario, provide the IAM Role that you have assigned to your AWS Service Account: 

 ```yaml
 # --example of AI DIAL configuration for service account
   bedrock:
 # -- Enable/disable ai-dial-adapter-bedrock
  enabled: true
  
  image:
    repository: epam/ai-dial-adapter-bedrock
    tag: 0.2.0
  
  serviceAccount:
  create: true
  annotations:
    eks.amazonaws.com/role-arn: "arn:aws:iam::000001206603:role/role_name"
    
  env:
     DEFAULT_REGION: "us-east-1"

 ```
