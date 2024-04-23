
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
  
</div>

## Configuration Guidelines

### Configure AWS Cognito

To configure AWS Cognito, you can follow these steps:

1. Begin by creating a user pool. You can refer to the official AWS documentation for detailed instructions on how to create a user pool. Here is the link: [Create User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-create-user-pool.html).
2. Once the user pool is set up, you can proceed to create users within the pool. The AWS documentation provides guidance on how to sign up users in your application. You can find the instructions here: [Create User](https://docs.aws.amazon.com/cognito/latest/developerguide/signing-up-users-in-your-app.html).
3. Next, you will need to create an app client specifically for this user pool. This app client will be responsible for integrating your application with the user pool. The AWS documentation offers detailed instructions on configuring app integration with user pools. You can access the instructions here: [Create App Client for User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-configuring-app-integration.html).
4. Under the **App client settings** section, set the following parameters:
   
    - Callback URL(s): Enter the callback function URL as follows
    
      ```
      https://<chat_url>/api/auth/callback/cognito
      ```
    
      Replace `<chat_url>` with the actual address of your AI DIAL Chat application.
    
    - OAuth 2.0 Allowed OAuth Flows: Select "Authorization code grant".
    - OAuth 2.0 Allowed OAuth Scopes: Enable the following scopes:
      - email
      - openid
      - profile
    - Enabled Identity Providers: Select "Cognito user pool".


### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary AWS Cognito environment variables, you will enable them to work together seamlessly with AWS Cognito for authentication and authorization purposes.
To configure AI DIAL Chat and AI DIAL Core to work with AWS Cognito, follow these steps:

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) to learn more.
   
      ```
      AUTH_COGNITO_CLIENT_ID: "<client_id>"  # client ID of your AWS Cognito app client integration.
      AUTH_COGNITO_HOST: "<cognito_host>" # URL consisting of the Cognito Identity endpoint and User Pool ID.
      AUTH_COGNITO_NAME: "<cognito_client_name>" # name of your AWS Cognito app client integration
      AUTH_COGNITO_SECRET: "<client_secret>" # client secret of your AWS Cognito app client integration
      ```
> `cognito_host` example: `https://cognito-idp.<region>.amazonaws.com/<my-pool-id>`

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#configuration) configuration to learn more.
   
      ```
      aidial.identityProviders.cognito.jwksUrl: "<token_url>" # URL to jwks token
      aidial.identityProviders.cognito.rolePath: "roles"
      aidial.identityProviders.cognito.issuerPattern: '^https:\/\/cognito-idp\.<region>\.amazonaws\.com.+$'
      aidial.identityProviders.cognito.loggingKey: "email"
      aidial.identityProviders.cognito.loggingSalt: "loggingSalt"
      ```
      
> `token_url` example: `https://cognito-idp.<region>.amazonaws.com/<my-pool-id>/.well-known/jwks.json`

