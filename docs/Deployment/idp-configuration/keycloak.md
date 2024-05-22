
<!-- omit from toc -->

# How to Set Keycloak as Identity Provider

## Introduction

This basic tutorial demonstrates the steps to create a REALM in [Keycloak](https://www.keycloak.org) and use it as an identity and access management solution for AI DIAL users.

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents

- [How to Set Keycloak as Identity Provider](#how-to-set-keycloak-as-identity-provider)
  - [Introduction](#introduction)
  - [Configuration Guidelines](#configuration-guidelines)
    - [Configure Keycloak](#configure-keycloak)
    - [Configure AI DIAL](#configure-ai-dial)
      - [AI DIAL Chat Settings](#ai-dial-chat-settings)
      - [AI DIAL Core Settings](#ai-dial-core-settings)
      - [Roles Management Guide](#roles-management-guide)
  
</div>

## Configuration Guidelines

### Configure Keycloak

For setting up Keycloak, which is included in dial Helm chart, you can use a special [tool](https://github.com/bitnami/containers/tree/main/bitnami/keycloak-config-cli#configuration). We suggest using the following configuration, which can be passed to `keycloak.keycloakConfigCli.configuration."realm\.yaml"`. 

> [!IMPORTANT]
> Replace `<field>` before applying this configuration.

  ```yaml
  realm: "dial"
  displayName: "dial"
  enabled: true
  accessTokenLifespan: 86400
  ssoSessionIdleTimeout: 86400
  ssoSessionMaxLifespan: 86400
  roles:
    client:
      dial-chat:
        - name: admin
          description: "AI DIAL chat admin role"
          composite: false
          clientRole: true
  groups:
    - name: DIAL
      subGroups:
        - name: "admin"
          clientRoles:
            dial-chat: ["admin"]
  clientScopes:
    - name: dial
      description: "dial scope"
      protocol: openid-connect
      attributes:
        include.in.token.scope: "true"
        display.on.consent.screen: "true"
        consent.screen.text: ""
      protocolMappers:
        - name: "Audience for Dial"
          protocol: openid-connect
          protocolMapper: oidc-audience-mapper
          consentRequired: false
          config:
            included.client.audience: dial-chat
            id.token.claim: false
            access.token.claim: true
  clients:
    - clientId: dial-chat
      name: dial-chat
      description: AI DIAL chat client
      rootUrl: https://<chat_url>
      adminUrl: https://<chat_url>
      baseUrl: https://<chat_url>
      surrogateAuthRequired: false
      enabled: true
      clientAuthenticatorType: client-secret
      secret: <keycloak_client_secret>
      redirectUris:
        - https://<chat_url>/*
      webOrigins:
        - https://<chat_url>
      notBefore: 0
      bearerOnly: false
      consentRequired: false
      standardFlowEnabled: true
      implicitFlowEnabled: false
      directAccessGrantsEnabled: true
      serviceAccountsEnabled: false
      publicClient: false
      frontchannelLogout: true
      protocol: openid-connect
      attributes:
        oidc.ciba.grant.enabled: "false"
        client.secret.creation.time: "1691398764"
        backchannel.logout.session.required: "true"
        display.on.consent.screen: "false"
        oauth2.device.authorization.grant.enabled: "false"
        backchannel.logout.revoke.offline.tokens: "false"
      authenticationFlowBindingOverrides: {}
      fullScopeAllowed: true
      nodeReRegistrationTimeout: -1
      defaultClientScopes:
        - web-origins
        - acr
        - profile
        - roles
        - email
        - dial
      optionalClientScopes:
        - address
        - phone
        - offline_access
        - microprofile-jwt
  ```


### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary environment variables, you will enable them to work together seamlessly with Identity Provider for authentication and authorization purposes.
To configure AI DIAL Chat and AI DIAL Core to work with Keycloak, follow these steps:

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) to learn more.
   
      ```
      AUTH_KEYCLOAK_CLIENT_ID: "dial-chat"  # Keycloak Client ID
      AUTH_KEYCLOAK_HOST: "<keycloak_host>" # Keycloak Host
      AUTH_KEYCLOAK_SECRET: "<keycloak_client_secret>" # Keycloak Client Secret
      ```
> [!TIP]
> `keycloak_host` example: `https://keycloak.example.com`

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#configuration) configuration to learn more.
   
      ```
      aidial.identityProviders.keycloak.jwksUrl: "<token_url>" # URL to jwks token
      aidial.identityProviders.keycloak.rolePath: "resource_access.dial-chat.roles"
      aidial.identityProviders.keycloak.issuerPattern: <issuerPattern>
      aidial.identityProviders.keycloak.loggingKey: "email" 
      aidial.identityProviders.keycloak.loggingSalt: "loggingSalt" # strong generated string
      ```

> [!TIP]    
> `token_url` example: `https://<keycloak_host>/realms/dial/protocol/openid-connect/certs`
> `issuerPattern` example: `'^https:\/\/keycloak\.example\.com.+$'`

#### Roles Management Guide

AI DIAL enables assignment of roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.
Group management process is consisted of three steps:

1. Create roles in Keycloak
1. Include into JWT token custom claim.
1. Configure AI DIAL Chat and Core
1. Assign roles to AI DIAL Models/Applications/Assistants/Addons

The initial three steps have been completed as reflected in the preceding sections. The final step involves allocating Okta Groups towards AI DIAL Core configuration. The `aidial.identityProviders.keycloak.rolePath` setting is leveraged for this purpose, alongside the `userRoles` section found within the description of the DIAL resource.

In this example, the roles are provided to AI DIAL Core via user access token(JWT) by Okta and are available via the path: `Groups` with values `okta-group-name`

  ```yaml
  "models": {
      "chat-gpt-35-turbo": {
        "type": "chat",
        "endpoint" : "http://localhost:7001/v1/openai/deployments/gpt-35-turbo/chat/completions",
        "upstreams": [
          {"endpoint": "http://localhost:7001", "key": "modelKey1"}
        ],
        "userRoles": ["keycloak-role-name"]
      }
  }
  ```