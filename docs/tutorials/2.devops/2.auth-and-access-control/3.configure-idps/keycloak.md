
<!-- omit from toc -->
# How to Set Keycloak as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->
## Table of Contents

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

This basic tutorial demonstrates how to create a Realm in [Keycloak](https://www.keycloak.org) and use it as an identity and access management solution for AI DIAL users.

In AI DIAL, you can assign roles to Models and Applications to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

## Configuration Guidelines

### Configure Keycloak

> **Note**: Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

There are two ways to configure Keycloak: via Admin Console or using a CLI tool.

#### Configuration in Keycloak Admin Console

Follow these steps to configure Keycloak in Admin Console:

1. **Create Realm**: create a new [Realm](https://www.keycloak.org/docs/latest/server_admin/#proc-creating-a-realm_server_administration_guide) in Keycloak. For example, you can name it `dial`.
1. **Create a Client**: In **Clients** [Create client](https://www.keycloak.org/docs/latest/server_admin/#proc-creating-oidc-client_server_administration_guide) with the following settings:
   - **Client type**: `OpenID Connect`
   - **Client ID**: e.g., `ai-dial-chat`
   - **Client authentication**: `On`
   - **Authentication flow**: `Standard flow`, `Direct access grants`
   - Root URL: `<chat_url>`
   - Valid redirect URIs: `<chat_url>/*`
   - Home URL: `<chat_url>`
   - Web origins: `<chat_url>`
1. **Gather facts**: to proceed with DIAL configuration, collect information related to Keycloak:
    - **Keycloak host URL** (`<keycloak_host>`), e.g. `https://keycloak.example.com`
    - In **Realm settings/General**, save the **Realm name** (`<keycloak_realm_id>`)
    - In **Realm settings/General/OpenID Endpoint Configuration**, save the `jwks_uri` value (`<keycloak_jwks_uri>`).
    - In **Clients/Client name/Settings**, save the **Client ID** (`<keycloak_client_id>`)
    - In **Clients/Client name/Credentials**, save the **Client secret** (`<keycloak_client_secret>`).
1. **Create Users**: create [Users](https://www.keycloak.org/docs/latest/server_admin/#proc-creating-user_server_administration_guide).
1. (Optional, RBAC) **Create and Assign Roles**: the best way to sustainably manage user authentication is creating user groups and assigning client roles to that groups:
    - In **Clients/Client name/Roles**, [Create roles](https://www.keycloak.org/docs/latest/server_admin/#con-client-roles_server_administration_guide).
    - In **Groups**, [Create groups](https://www.keycloak.org/docs/latest/server_admin/#proc-managing-groups_server_administration_guide). Add users in **Members** tab, client roles in **Role Mappings** tab.

#### Configuration in Keycloak Config CLI

For setting up Keycloak, which is included in the AI DIAL Helm chart, you can use [Keycloak Config CLI](https://github.com/bitnami/containers/tree/main/bitnami/keycloak-config-cli#configuration). We suggest using the following configuration, which can be passed to `keycloak.keycloakConfigCli.configuration."realm\.yaml"` in the DIAL [Helm chart](https://github.com/epam/ai-dial-helm/blob/56b41d6f3c2148b42bdd12c1dcecc9711e23fd6d/charts/dial/values.yaml#L29).

> **Note**: Replace `<chat_url>`, `<keycloak_client_secret>` with real values before applying this configuration.

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
      - name: "Audience for DIAL"
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
      - basic
    optionalClientScopes:
      - address
      - phone
      - offline_access
      - microprofile-jwt
```

### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary environment variables, you will enable them to work together seamlessly with Identity Provider for authentication and authorization purposes.

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat [configuration](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables):

```yaml
AUTH_KEYCLOAK_HOST: "https://<keycloak_host>/realms/<keycloak_realm_id>"
AUTH_KEYCLOAK_CLIENT_ID: "<keycloak_client_id>"
AUTH_KEYCLOAK_SECRET: "<keycloak_client_secret>"
```

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core [**static** settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings):

> **Note**: `<keycloak_host_regex>` is `<keycloak_host>` with dots escaped, e.g. `keycloak\.example\.com`
>
> **Note**: generate some random sting for `loggingSalt` parameter, e.g. using `pwgen -s 32 1`

```yaml
aidial.identityProviders.keycloak.jwksUrl: "<keycloak_jwks_uri>"
aidial.identityProviders.keycloak.issuerPattern: '^https:\/\/<keycloak_host_regex>.*$'
aidial.identityProviders.keycloak.loggingKey: "sub"
aidial.identityProviders.keycloak.loggingSalt: "loggingSalt"
aidial.identityProviders.keycloak.rolePath: "resource_access.<keycloak_client_id>.roles"
```

#### Assignment of Roles

> **Warning**: RBAC-related steps from [Configure Keycloak](#configure-keycloak) must be completed before proceeding with this section.

To limit access to AI DIAL resources based on Keycloak Groups, configure the AI DIAL Core by adjusting the [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): set the `userRoles` parameter to align with the desired Keycloak group names.

In the provided example, users assigned the `keycloak-group-name` group will have access to the `chat-gpt-35-turbo` model.

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
        "keycloak-client-role-name"
      ]
    }
  }
}
```
