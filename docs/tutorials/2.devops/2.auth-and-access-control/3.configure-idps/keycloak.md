
<!-- omit from toc -->
# How to Set Keycloak as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Keycloak](#configure-keycloak)
    - [Configuration in Keycloak Admin Console](#configuration-in-keycloak-admin-console)
    - [Configuration in Keycloak Config CLI](#configuration-in-keycloak-config-cli)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Assignment of Roles](#assignment-of-roles)
  
</div>

## Introduction

This basic tutorial demonstrates the steps to create a REALM in [Keycloak](https://www.keycloak.org) and use it as an identity and access management solution for AI DIAL users.

In AI DIAL, you can assign roles to Models and Applications to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

## Configuration Guidelines

### Configure Keycloak

> **Note:** Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

There are two ways to configure Keycloak: via Admin Console or using a CLI tool.

#### Configuration in Keycloak Admin Console

Follow these steps to configure Keycloak in Admin Console:

1. **Create a Client:** [Create an OpenID Connect client](https://www.keycloak.org/docs/latest/server_admin/#proc-creating-oidc-client_server_administration_guide) in Keycloak with the following settings:
   - Client type: OpenID Connect
   - Client ID: `dial-chat`
   - Client authentication: On
   - Root URL: `<chat_url>`
   - Valid redirect URIs: `<chat_url>/*`
   - Home URL: `<chat_url>`
   - Web origins: `<chat_url>`
2.  **Collect configuration parameters:** in this step, you will collect parameters that will be required for [AI DIAL configuration](#ai-dial-chat-settings).
    - In **Clients/Client details/Settings**, record the **Client ID**.
    - In **Clients/Client details/Credentials**, click on view **Client secret** and record it. 
    - In **Realm settings/General**, record the **Realm ID**.
3. **Create Users:** create necessary [Users](https://www.keycloak.org/docs/latest/server_admin/#proc-creating-user_server_administration_guide).
4. (Optional) **Create and Assign Roles:** under the **Clients/Client details/Roles**, create necessary [Client roles](https://www.keycloak.org/docs/latest/server_admin/#con-client-roles_server_administration_guide). After that [assign roles to users](https://www.keycloak.org/docs/latest/server_admin/#proc-assigning-role-mappings_server_administration_guide).

#### Configuration in Keycloak Config CLI

For setting up Keycloak, which is included in the AI DIAL Helm chart, you can use [Keycloak Config CLI](https://github.com/bitnami/containers/tree/main/bitnami/keycloak-config-cli#configuration). We suggest using the following configuration, which can be passed to `keycloak.keycloakConfigCli.configuration."realm\.yaml"` in the DIAL [Helm chart](https://github.com/epam/ai-dial-helm/blob/56b41d6f3c2148b42bdd12c1dcecc9711e23fd6d/charts/dial/values.yaml#L29). 

> **Note:** Replace `<fields>` before applying this configuration.

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
   
  ```yaml
  AUTH_KEYCLOAK_HOST: "https://<keycloak_host>/realms/<keycloak_realm_id>"
  AUTH_KEYCLOAK_CLIENT_ID: "<keycloak_client_id>"
  AUTH_KEYCLOAK_SECRET: "<keycloak_client_secret>"
  ```
> `AUTH_KEYCLOAK_HOST` example: `https://keycloak.example.com/realms/dial`

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core **static** settings. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings) for more details.
   
  ```yaml
  aidial.identityProviders.keycloak.jwksUrl: "<keycloak_jwks_uri>"
  aidial.identityProviders.keycloak.rolePath: "<keycloak_role_path>"
  aidial.identityProviders.keycloak.issuerPattern: <issuerPattern>
  aidial.identityProviders.keycloak.loggingKey: "sub" 
  aidial.identityProviders.keycloak.loggingSalt: "loggingSalt" # strong generated string
  ```

> **Examples:**    
> - `keycloak_jwks_uri` example: `https://<keycloak_host>/realms/<keycloak_realm_id>/protocol/openid-connect/certs`
> - `keycloak_role_path` example: `resource_access.dial-chat.roles`
> - `issuerPattern` example: `'^https:\/\/keycloak\.example\.com.+$'`

#### Assignment of Roles

Once all the above steps are completed, including the ones marked as **Optional**, you can assign roles to Models and Applications.

In AI DIAL Core:

* [Static settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings): as value for `aidial.identityProviders.keycloak.rolePath` provide a role path from Keycloak.
* [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): for `userRoles` provide a specific role name(s). 

In this example, `"keycloak-role-name"` role from the `<keycloak_role_path>` is configured for `chat-gpt-35-turbo` model:

```yaml
# Dynamic settings of AI DIAL Core
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
