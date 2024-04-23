# How to Set AWS Cognito as Identity Provider

## Introduction

This basic tutorial demonstrates the steps to create a user pool in [AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) and use it as an identity and access management solution for AI DIAL users.

<div class="docusaurus-ignore">

- [AWS Cognito as identity provider](#how-to-set-aws-cognito-as-identity-provider)
  - [Configuration Guidelines](#configuration-guidelines)
    - [Configure AWS Cognito](#configure-aws-cognito)
    - [DIAL configuration](#dial-configuration)

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

### Configure DIAL

For application side:

1. Add following params into chat (documentation [here](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables))
    ```
    AUTH_COGNITO_CLIENT_ID: "<client_id>"
    AUTH_COGNITO_HOST: "<cognito_host>"
    AUTH_COGNITO_NAME: "<cognito_client_name>"
    AUTH_COGNITO_SECRET: "<client_secret>"
    ```

    - client_id - client id of Cognito app client integration
    - cognito_host - url consist of [Cognito Identity endpoint](https://docs.aws.amazon.com/general/latest/gr/cognito_identity.html) + User Pool ID like

      ```https://cognito-idp.<region>.amazonaws.com/<>my-pool-id>```

    - cognito_client_name - name of Cognito app client integration
    - client_secret - client secret of Cognito app client integration
3. Add following params to Core (documentation [here](https://github.com/epam/ai-dial-core?tab=readme-ov-file#configuration)):
    ```
    aidial.identityProviders.cognito.jwksUrl: "<token_url>"
    aidial.identityProviders.cognito.rolePath: "roles"
    aidial.identityProviders.cognito.issuerPattern: '^https:\/\/cognito-idp\.<region>\.amazonaws\.com.+$'
    aidial.identityProviders.cognito.loggingKey: "email"
    aidial.identityProviders.cognito.loggingSalt: "loggingSalt"

    ```
    - token_url - url to jwks token that looks like

      ```https://cognito-idp.<region>.amazonaws.com/<my-pool-id>/.well-known/jwks.json```
