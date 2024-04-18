# AWS Cognito as identity provider

- [AWS Cognito as identity provider](#aws-cognito-as-identity-provider)
  - [Description](#description)
  - [Usage](#usage)
    - [Configuration Cognito user pool](#configuration-cognito-user-pool)
    - [Application configuration](#application-configuration)

## Description

This basic example shows how to intergrate [Cognito user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) with ai-dial.

## Usage

This case covers the situation when you want to create Cognito user pool and use it as identity provider with custom user.

### Configuration Cognito user pool
To make integration with AWS Cognito we need to follow next steps:
- create user pool (https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-create-user-pool.html)
- Create user (https://docs.aws.amazon.com/cognito/latest/developerguide/signing-up-users-in-your-app.html)
- Create app client for this user pool (https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-configuring-app-integration.html)

Set following parameters for cognito app client congiguration:
- callback function
  ```
  https://<chat_url>/api/auth/callback/cognito
  ```
  where <chat_url> - address of chat application
- OAuth 2.0 grand types:
    - Authorization code grant
  
- open id connector with the following scopes:
    - email
    - openid
    - profile
  
- identity providers:
    - Cognito user pool


### Application configuration
For application side:
1. Add following params into chat
    ```
    AUTH_COGNITO_CLIENT_ID: "<client_id>"
    AUTH_COGNITO_HOST: "<cognito_host>"
    AUTH_COGNITO_NAME: "<cognito_client_name>"
    AUTH_COGNITO_SECRET: "<client_secret>"
    ```

    - client_id - client id of Cognito app client integration
    - cognito_host - url consist of [Cognito Identity endpoint](https://docs.aws.amazon.com/general/latest/gr/cognito_identity.html) + User Pool ID like

      ```https://cognito-idp.{region}.amazonaws.com/{my-pool-id}```

    - cognito_client_name - name of Cognito app client integration
    - client_secret - client secret of Cognito app client integration
3. Add following params to Core
    ```
    aidial.identityProviders.cognito.jwksUrl: "<token_url>"
    aidial.identityProviders.cognito.rolePath: "roles"
    aidial.identityProviders.cognito.issuerPattern: '^https:\/\/cognito-idp\.<region>\.amazonaws\.com.+$'
    aidial.identityProviders.cognito.loggingKey: "email"
    aidial.identityProviders.cognito.loggingSalt: "loggingSalt"

    ```
    - token_url - url to jwks token that looks like

      ```https://cognito-idp.{region}.amazonaws.com/{my-pool-id}/.well-known/jwks.json```
