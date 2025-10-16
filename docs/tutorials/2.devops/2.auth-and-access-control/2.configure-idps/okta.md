
<!-- omit from toc -->
# How to Set Okta as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->
## Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Okta](#configure-okta)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Assignment of Roles](#assignment-of-roles)

</div>

## Introduction

This basic tutorial demonstrates how to configure an application in [Okta](https://www.okta.com/customer-identity/single-sign-on) and use it as an identity and access management solution for AI DIAL users.

In AI DIAL, you can assign roles to Models and Applications to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

## Configuration Guidelines

### Configure Okta

> **Note**: Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure Okta:

1. **Create an Application**: start with creating a new [Application](https://help.okta.com/oie/en-us/content/topics/apps/apps_app_integration_wizard_oidc.htm).
    - **Sign-in method**: `OIDC - OpenID Connect`
    - **Application type**: `Web Application`
    - **App integration name**: e.g., `ai-dial-chat`
    - **Sign-in redirect URIs**: `<chat_url>/api/auth/callback/okta`
    - **Sign-out redirect URIs**: `<chat_url>`
    - **Controlled access**: `Skip group assignment for now`
    - **Grant type/Core grants**: `Authorization Code`, `Refresh Token`
1. **Enable API Scopes**: navigate to **Applications/Application name/Okta API Scopes** tab, enable the following scopes:
    - `okta.users.read`
    - `okta.users.read.self`
1. **Setup Access Policy**: navigate to **Security/API/Authorization Servers/Authorization Server name/Access Policies** tab, and ensure there's a policy that allows your application to access the API, e.g.:
    - **Add New Access Policy**
      - **Policy name**: e.g., `ai-dial-chat`
      - **Description**: e.g., `Allow access to the API for ai-dial-chat application`
      - **Assign to**: `The following clients` + select your application
    - **Add rule**
      - **Rule name**: e.g., `Allow`
      - **IF Grant type is**: `Client Credentials`, **Core grants**: `Authorization Code`, **Other grants**: `Implicit (Hybrid)`, `Resource Owner Password`
      - **AND User is**: `Any user assigned to the app`
      - **AND Scopes requested**: `openid`, `profile`, `email`
      - other settings can be left as default
1. **Create Users**: once the application integration is set up, [create users](https://help.okta.com/oie/en-us/content/topics/sers-groups-profiles/usgp-people.htm) in **Directory/People**.
1. **Gather facts**: to proceed with DIAL configuration, collect information related to Okta:
    - In top right corner, select your profile and save your **Okta domain** (`<okta_domain>`), e.g. `dev-123456.okta.com`
    - In **Security/API/Authorization Servers/Authorization Server name/** section, locate **Metadata URI** and open it. Save **issuer** (`<okta_issuer>`), **jwks_uri** (`<okta_jwks_uri>`) values from JSON response.
    - In **Applications/Application name/General** tab, save **Client ID** (`<okta_client_id>`) and **Client secret** (`<okta_client_secret>`)
1. (Optional, RBAC) **Create & Assign Groups**: the best way to sustainably manage user authentication is creating user groups and assigning applications to that groups.
    - In **Directory/Groups**, [Add groups](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-groups-main.htm).
    - In **Directory/Groups/Group name/People** tab, assign people to relevant groups.
    - In **Directory/Groups/Group name/Applications** tab, [Assign applications](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-assign-app-group.htm) to relevant groups.
1. (Optional, RBAC) [**Configure ID Token Groups Claim**](https://developer.okta.com/docs/guides/customize-tokens-groups-claim/main): navigate to **Applications/Sign On/OpenID Connect ID Token** section and edit:
    - **Groups claim type**: `Filter`
    - **Groups claim filter**: `groups` + `Matches regex` + `.*`

### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary environment variables, you will enable them to work together seamlessly with Identity Provider for authentication and authorization purposes.

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat [configuration](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables):

```yaml
AUTH_OKTA_ISSUER: "<okta_issuer>"
AUTH_OKTA_CLIENT_ID: "<okta_client_id>"
AUTH_OKTA_CLIENT_SECRET: "<okta_client_secret>"
```

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core [**static** settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings):

> **Note**: `<okta_domain_regex>` is `<okta_domain>` with dots escaped, e.g. `dev-123456\.okta\.com`
>
> **Note**: generate some random sting for `loggingSalt` parameter, e.g. using `pwgen -s 32 1`

```yaml
aidial.identityProviders.okta.jwksUrl: "<okta_jwks_uri>"
aidial.identityProviders.okta.issuerPattern: '^https:\/\/<okta_domain_regex>.*$'
aidial.identityProviders.okta.loggingKey: "sub"
aidial.identityProviders.okta.loggingSalt: "loggingSalt"
aidial.identityProviders.okta.rolePath: "Groups"
```

#### Assignment of Roles

> **Warning**: RBAC-related steps from [Configure Okta](#configure-okta) must be completed before proceeding with this section.

In AI DIAL Core:

To limit access to AI DIAL resources based on Okta Groups, configure the AI DIAL Core by adjusting the [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): set the `userRoles` parameter to align with the desired Okta group names.

In the provided example, users assigned the `okta-group-name` group will have access to the `chat-gpt-35-turbo` model.

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
        "okta-group-name"
      ]
    }
  }
}
```
