
<!-- omit from toc -->
# How to Set AWS Cognito as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure AWS Cognito](#configure-aws-cognito)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Assignment of Roles](#assignment-of-roles)
  
</div>

## Introduction

This basic tutorial demonstrates the steps to create a user pool in [AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) and use it as an identity and access management solution for AI DIAL users.

In AI DIAL, you can assign roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

## Configuration Guidelines

### Configure AWS Cognito

> **Note:** Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure AWS Cognito:

1. **Create User Pool:** refer to [AWS documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-create-user-pool.html) for detailed instructions on how to create a User Pool.
1. **Configure Application Client:** during the creation of a user pool, navigate to the section **Integrate your app** (you can access it later under **App Integration/Create App Client**) and create the following settings. Refer to [AWS documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html) for details.
    - **App client name**: provide a relevant and descriptive name for the client.
    - **Client secret**: select the option to `Generate a client secret`
    - **Allowed callback URLs**: enter `https://<chat_url>/api/auth/callback/cognito`
    - **Authentication flows**: enable `ALLOW_CUSTOM_AUTH` `ALLOW_REFRESH_TOKEN_AUTH` and `ALLOW_USER_SRP_AUTH`.
    - **OpenID Connect scopes**: select `OpenID` `Email` `Profile`
1. **Create Cognito Domain:** when setting up a user pool, navigate to the **Hosted authentication pages**. If the **Use the Cognito Hosted UI** option is enabled, you'll configure your domain here. Alternatively, you can access this configuration later by going to **App Integration/Domain/Actions**. Refer to [AWS documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-userpools-server-contract-reference.html) for details.
1. **Create Users:** in the **User polls/Users** section, create necessary [Users](https://docs.aws.amazon.com/cognito/latest/developerguide/how-to-create-user-accounts.html#creating-a-new-user-using-the-console).
1.  **Collect Configuration Parameters:** you will need them for AI DIAL configuration.
    - In the **Amazon Cognito/User pools/Pool name** section, record **User pool ID** and **Token signing key URL**. 
    - In **App Integration/App client list**, click on the specific app client name to obtain the **Client ID** and**Client secret** - record them as well.
1. (Optional) **Create and Assign Group:** in the **User polls/Groups** section, create necessary [Groups](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html#creating-a-new-group-using-the-console) and assign to `User` created in the previous step.


### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary AWS Cognito environment variables, you will enable them to work together seamlessly with AWS Cognito for authentication and authorization purposes.

To configure AI DIAL Chat and AI DIAL Core to work with AWS Cognito, follow these steps:

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) to learn more.
 
  ```yaml
  AUTH_COGNITO_CLIENT_ID: "<cognito_client_id>"
  AUTH_COGNITO_HOST: "<cognito_host>"
  AUTH_COGNITO_SECRET: "<cognito_client_secret>"
  ```

> **Note:** `cognito_host` example: `https://cognito-idp.<cognito_region>.amazonaws.com/<cognito_pool-id>`

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core **static** settings. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings) for more details.
   
  ```yaml
  aidial.identityProviders.cognito.jwksUrl: "<cognito_jwks_uri>"
  aidial.identityProviders.cognito.rolePath: "cognito:groups"
  aidial.identityProviders.cognito.issuerPattern: '^https:\/\/cognito-idp\.<cognito_region>\.amazonaws\.com.+$'
  aidial.identityProviders.cognito.loggingKey: "sub"
  aidial.identityProviders.cognito.loggingSalt: "loggingSalt"
  ```
   
> **Note:** `cognito_jwks_uri` example: `https://cognito-idp.<cognito_region>.amazonaws.com/<cognito_pool-id>/.well-known/jwks.json`

#### Assignment of Roles

Once all the above steps are completed, including the ones marked as **Optional**, you can assign roles to Models, Applications, Addons, and Assistants.

In AI DIAL Core:

* [Static settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings): as value for `aidial.identityProviders.cognito.rolePath` provide a claim from Cognito.
* [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): for `userRoles` provide a specific group name as a claim value. 

In this example, `"cognito-group-name"` role from the `"cognito:groups"` claim is configured for `chat-gpt-35-turbo` model:

  ```yaml
    # Dynamic settings of AI DIAL Core
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
