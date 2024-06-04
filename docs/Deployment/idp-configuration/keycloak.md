
<!-- omit from toc -->
# How to Set Keycloak as Identity Provider

## Introduction

This basic tutorial demonstrates the steps to create a REALM in [Keycloak](https://www.keycloak.org) and use it as an identity and access management solution for AI DIAL users.

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Keycloak](#configure-keycloak)
    - [Manual](#manual)
    - [Using cli](#using-cli)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Roles Management Guide](#roles-management-guide)
  
</div>

## Configuration Guidelines

### Configure Keycloak

> [!TIP]
> Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

#### Manual

Follow these steps to configure Keycloak:

1. **Create a Client:** [Create an OpenID Connect client](https://www.keycloak.org/docs/latest/server_admin/#proc-creating-oidc-client_server_administration_guide) in Keycloak with the following settings:
   - Client type: OpenID Connect
   - Client ID: `dial-chat`
   - Client authentication: On
   - Root URL: `<chat_url>`
   - Valid redirect URIs: `<chat_url>/*`
   - Home URL: `<chat_url>`
   - Web origins: `<chat_url>`
1.  **Collect configuration parameters:** Navigate to **Clients/Client details/Settings** and note the **Client ID**  Next, go to **Clients/Client details/Credentials** click on view **Client secret** and note it. Finally, visit **Realm settings/General** to get the **Realm ID**.
1. **Create Users:** Сreate necessary [Users](https://www.keycloak.org/docs/latest/server_admin/#proc-creating-user_server_administration_guide).
1. (Optional) **Create Roles and assign to User:** Under the **Clients/Client details/Roles** create necessary [Client roles](https://www.keycloak.org/docs/latest/server_admin/#con-client-roles_server_administration_guide). After that [assign roles to users](https://www.keycloak.org/docs/latest/server_admin/#proc-assigning-role-mappings_server_administration_guide).

#### Using cli
For setting up Keycloak, which is included in dial Helm chart, you can use a special [tool](https://github.com/bitnami/containers/tree/main/bitnami/keycloak-config-cli#configuration). We suggest using the following configuration, which can be passed to `keycloak.keycloakConfigCli.configuration."realm\.yaml"`. 

> [!IMPORTANT]
> Replace `<fields>` before applying this configuration.

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
  AUTH_KEYCLOAK_HOST: "https://<keycloak_host>/realms/<keycloak_realm_id>"
  AUTH_KEYCLOAK_CLIENT_ID: "<keycloak_client_id>"
  AUTH_KEYCLOAK_SECRET: "<keycloak_client_secret>"
  ```
> [!TIP]
> `AUTH_KEYCLOAK_HOST` example: `https://keycloak.example.com/realms/dial`

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#configuration) configuration to learn more.
   
  ```
  aidial.identityProviders.keycloak.jwksUrl: "<keycloak_jwks_uri>"
  aidial.identityProviders.keycloak.rolePath: "<keycloak_role_path>"
  aidial.identityProviders.keycloak.issuerPattern: <issuerPattern>
  aidial.identityProviders.keycloak.loggingKey: "sub" 
  aidial.identityProviders.keycloak.loggingSalt: "loggingSalt" # strong generated string
  ```

> [!TIP]    
> -  `keycloak_jwks_uri` example: `https://<keycloak_host>/realms/<keycloak_realm_id>/protocol/openid-connect/certs`
> - `keycloak_role_path` example: `resource_access.dial-chat.roles`
> - `issuerPattern` example: `'^https:\/\/keycloak\.example\.com.+$'`

#### Roles Management Guide

AI DIAL enables assignment of roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.
Group management process is consisted of three steps:

1. Create roles in Keycloak
1. Configure AI DIAL Chat and Core
1. Assign roles to AI DIAL Models/Applications/Assistants/Addons

All the steps mentioned above have been completed, including the ones marked as **Optional**. The final step involves allocating Keycloak Roles towards AI DIAL Core configuration. The `aidial.identityProviders.keycloak.rolePath` setting is leveraged for this purpose, alongside the `userRoles` section found within the description of the DIAL resource.

In this example, the roles are provided to AI DIAL Core via user access token(JWT) by Keycloak and are available via the path: `Roles` with values `keycloak-role-name`

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