
<!-- omit from toc -->
# How to Set AWS Cognito as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->
## Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure AWS Cognito](#configure-aws-cognito)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Assignment of Roles](#assignment-of-roles)

</div>

## Introduction

This basic tutorial demonstrates how to create a user pool in [AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) and use it as an identity and access management solution for AI DIAL users.

In AI DIAL, you can assign roles to Models and Applications to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

## Configuration Guidelines

### Configure AWS Cognito

> **Note**: Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure AWS Cognito:

1. **Create User Pool**: refer to [AWS documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-create-user-pool.html) for detailed instructions on how to create a User Pool:
    - **Application type**: `Traditional web application`
    - **Name your application**: e.g. `ai-dial-chat`
    - **Options for sign-in identifiers**: `Username`
    - **Required attributes for sign-up**: `email`
    - **Return URL**: `<chat_url>/api/auth/callback/cognito`
1. **Configure Application Client**: after user pool creation succeeded, navigate to **Applications/App clients/App client name** and edit [app client information](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html):
    - **Authentication flows**: `ALLOW_CUSTOM_AUTH`, `ALLOW_REFRESH_TOKEN_AUTH`, `ALLOW_USER_SRP_AUTH`
1. **Configure managed login pages**: navigate to **Applications/App clients/App client name/Login pages** and edit [login pages](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-login-pages.html):
    - **Allowed sign-out URLs**: `<chat_url>`
    - **OpenID Connect scopes**: `OpenID` `Email` `Profile`
1. **Create Users**: in **User management/Users** section, create [Users](https://docs.aws.amazon.com/cognito/latest/developerguide/how-to-create-user-accounts.html#creating-a-new-user-using-the-console).
1. **Gather facts**: to proceed with DIAL configuration, collect information related to Cognito:
    - In **Amazon Cognito/User pools/Pool name/Overview**, save **User pool ID** (`<cognito_user_pool_id>`) and **Token signing key URL** (`<cognito_jwks_uri>`).
    - In **Applications/App clients/App client name**, save **Client ID** (`<cognito_client_id>`) and **Client secret** (`<cognito_client_secret>`).
    - AWS region, where Cognito user pool is created (`<cognito_region>`).
1. (Optional, RBAC) **Create and Assign Groups**: in **User management/Groups** section, create [Groups](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html#creating-a-new-group-using-the-console) and assign them created users. These groups can be used to restrict access to DIAL resources later.

### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary environment variables, you will enable them to work together seamlessly with Identity Provider for authentication and authorization purposes.

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat [configuration](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables):

```yaml
AUTH_COGNITO_HOST: "https://cognito-idp.<cognito_region>.amazonaws.com/<cognito_user_pool_id>"
AUTH_COGNITO_CLIENT_ID: "<cognito_client_id>"
AUTH_COGNITO_SECRET: "<cognito_client_secret>"
```

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core [**static** settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings):

> **Note**: generate some random sting for `loggingSalt` parameter, e.g. using `pwgen -s 32 1`

```yaml
aidial.identityProviders.cognito.jwksUrl: "<cognito_jwks_uri>"
aidial.identityProviders.cognito.issuerPattern: '^https:\/\/cognito-idp\.<cognito_region>\.amazonaws\.com\/<cognito_user_pool_id>$'
aidial.identityProviders.cognito.loggingKey: "sub"
aidial.identityProviders.cognito.loggingSalt: "loggingSalt"
aidial.identityProviders.cognito.rolePath: "cognito:groups"
```

#### Assignment of Roles

> **Warning**: RBAC-related steps from [Configure AWS Cognito](#configure-aws-cognito) must be completed before proceeding with this section.

To limit access to AI DIAL resources based on Cognito Groups, configure the AI DIAL Core by adjusting the [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): set the `userRoles` parameter to align with the desired Cognito group names.

In the provided example, users assigned the `cognito-group-name` group will have access to the `chat-gpt-35-turbo` model.

```json
{
  "models": {
    "gpt-35-turbo": {
      "type": "chat",
      "endpoint": "http://localhost:5000/v1/openai/deployments/gpt-35-turbo/chat/completions",
      "upstreams": [
        {
          "endpoint": "https://[REDACTED].openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions",
          "key": "[REDACTED]"
        }
      ],
      "userRoles": [
        "cognito-group-name"
      ]
    }
  }
}
```
