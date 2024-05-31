
<!-- omit from toc -->
# How to Set AWS Cognito as Identity Provider

## Introduction

This basic tutorial demonstrates the steps to create a user pool in [AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) and use it as an identity and access management solution for AI DIAL users.

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure AWS Cognito](#configure-aws-cognito)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Roles Management Guide](#roles-management-guide)
  
</div>

## Configuration Guidelines

### Configure AWS Cognito

> [!TIP]
> Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

To configure AWS Cognito, you can follow these steps:

1. **Create User Pool:** You can refer to the official AWS documentation for detailed instructions on how to [Create User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-create-user-pool.html)
1. **Configure Application Client:** During the creation of user pool, navigate to the section **Integrate your app**, you can access it later under **App Integration/Create App Client**.
    - App client name: Provide a relevant and descriptive name for the client.
    - Client secret: Select the option to `Generate a client secret`
    - Allowed callback URLs: Enter `https://<chat_url>/api/auth/callback/cognito`
    - Authentication flows: Enable `ALLOW_CUSTOM_AUTH` `ALLOW_REFRESH_TOKEN_AUTH` and `ALLOW_USER_SRP_AUTH`
    - OpenID Connect scopes: Select `OpenID` `Email` `Profile`
1. **Create Cognito domain:** When setting up a user pool, navigate to the **Hosted authentication pages**. If the **Use the Cognito Hosted UI** option is enabled, you'll configure your domain here. Alternatively, you can access this configuration later by going to **App Integration/Domain/Actions**
1. **Create Users:** Under the **User polls/Users** create necessary [Users](https://docs.aws.amazon.com/cognito/latest/developerguide/how-to-create-user-accounts.html#creating-a-new-user-using-the-console).
1.  **Collect configuration parameters:** Navigate to **Amazon Cognito/User pools/Pool name** and note **User pool ID**, **Token signing key URL**. Next, go to **App Integration/App client list** click on the specific app client name to obtain the **Client ID**, **Client secret**   
1. (Optional) **Create Group and assign to User:** Under the **User polls/Groups** create necessary [Groups](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html#creating-a-new-group-using-the-console) and assign to `User` created before.


### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary AWS Cognito environment variables, you will enable them to work together seamlessly with AWS Cognito for authentication and authorization purposes.
To configure AI DIAL Chat and AI DIAL Core to work with AWS Cognito, follow these steps:

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) to learn more.
 
  ```
  AUTH_COGNITO_CLIENT_ID: "<cognito_client_id>"
  AUTH_COGNITO_HOST: "<cognito_host>"
  AUTH_COGNITO_SECRET: "<cognito_client_secret>"
  ```

> [!TIP]    
> `cognito_host` example: `https://cognito-idp.<cognito_region>.amazonaws.com/<cognito_pool-id>`

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#configuration) configuration to learn more.
   
  ```
  aidial.identityProviders.cognito.jwksUrl: "<cognito_jwks_uri>"
  aidial.identityProviders.cognito.rolePath: "cognito:groups"
  aidial.identityProviders.cognito.issuerPattern: '^https:\/\/cognito-idp\.<cognito_region>\.amazonaws\.com.+$'
  aidial.identityProviders.cognito.loggingKey: "sub"
  aidial.identityProviders.cognito.loggingSalt: "loggingSalt"
  ```
   
> [!TIP]
> `cognito_jwks_uri` example: `https://cognito-idp.<cognito_region>.amazonaws.com/<cognito_pool-id>/.well-known/jwks.json`

#### Roles Management Guide

AI DIAL enables assignment of roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.
Group management process is consisted of three steps:

1. Create a Group and add Users in Amazon Cognito
1. Configure AI DIAL Chat and Core
1. Assign roles to AI DIAL Models/Applications/Assistants/Addons

All the steps mentioned above have been completed, including the ones marked as **Optional**. The final step involves allocating Amazon Cognito Groups towards AI DIAL Core configuration. The `aidial.identityProviders.cognito.rolePath` setting is leveraged for this purpose, alongside the `userRoles` section found within the description of the DIAL resource.

In this example, the roles are provided to AI DIAL Core via user access token(JWT) by Microsoft Entra ID and are available via the path: `Groups` with values `cognito-group-name`

  ```yaml
  "models": {
      "chat-gpt-35-turbo": {
        "type": "chat",
        "endpoint" : "http://localhost:7001/v1/openai/deployments/gpt-35-turbo/chat/completions",
        "upstreams": [
          {"endpoint": "http://localhost:7001", "key": "modelKey1"}
        ],
        "userRoles": ["cognito-group-name"]
      }
  }
  ```