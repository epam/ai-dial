
<!-- omit from toc -->
# How to Set Up Auth0 as Identity Provider

## Introduction

This basic tutorial demonstrates how to configure an application in [Auth0](https://auth0.com/docs/get-started) and integrate it with AI DIAL for identity and access management.

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Auth0](#configure-auth0)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Roles Management Guide](#roles-management-guide)
  
</div>

## Configuration Guidelines

### Configure Auth0

> [!TIP]
> Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure Auth0:

1. **Create Tenant:** Save tenant name.
1. **Create an Application:** Begin by creating an [Application](https://auth0.com/docs/get-started/auth0-overview/create-applications). Set name and choose `Regular Web Applications`.
1. **Configure Application Settings:** Under the [**Applications/Settings**](https://auth0.com/docs/get-started/applications/application-settings) section, set the following parameters:
    - Obtain and save **Domain**,**Client ID** and **Client secrets** generated for your application.
    - Allowed Callback URLs: `https://<chat_url>/api/auth/callback/auth0`
1. **Create API:** Under the **Applications/APIs** section, configure new [**API**](https://auth0.com/docs/get-started/apis/api-settings):
1. **Create Users:** Under the **User Management/Users** create necessary [Users](https://auth0.com/docs/manage-users/user-accounts/create-users).
1. (Optional) **Create Roles and assign to User:** Under the **User Management/Roles** create necessary [Roles](https://auth0.com/docs/manage-users/access-control/configure-core-rbac/roles/create-roles).
1. (Optional) **Create Action:** Under the **Actions/Library** create necessary [Action]() and **Deploy** it.
   - Name: `DIAL role`
   - Trigger: `Login/Post Login`
   - Runtime: `Node 18`
   - Add next code:
     ```js
     exports.onExecutePostLogin = async (event, api) => {
       if (event.authorization) { 
         api.accessToken.setCustomClaim("dial_roles", event.authorization.roles);
         api.accessToken.setCustomClaim('email', event.user.email);
       }
     };
     ```   
1. (Optional) **Cofigure Login Flow:** Under the **Actions/Flows** choose `Login` and add custom action `DIAL role` to `Flow`. Apply change.

### Configure AI DIAL

To enable AI DIAL Chat and AI DIAL Core to work with Auth0, configure them with the necessary specific parameters.

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) for more details.
   
  ```yaml
  AUTH_AUTH0_HOST: "<auth0_domain>"
  AUTH_AUTH0_CLIENT_ID: "<auth0_client_id>"
  AUTH_AUTH0_CLIENT_SECRET: "<auth0_client_secret>"
  AUTH_AUTH0_AUDIENCE: "<auth0_api_audience>" 
  ```

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core configuration. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#configuration) for more details.
   
  ```yaml
  aidial.identityProviders.auth0.jwksUrl: "https:///<auth0_domain>/.well-known/jwks.json"
  aidial.identityProviders.auth0.issuerPattern: '^https:\/\/${auth0_domain_name}\.eu\.auth0\.com.*$'
  aidial.identityProviders.auth0.loggingKey: "sub"
  aidial.identityProviders.auth0.loggingSalt: "loggingSalt"
  aidial.identityProviders.auth0.rolePath: "dial_roles"
  ```

#### Roles Management Guide

AI DIAL enables assignment of roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.
Group management process is consisted of three steps:

1. Create role in Auth0
1. Include into JWT token custom claim.
1. Configure AI DIAL Chat and Core
1. Assign roles to AI DIAL Models/Applications/Assistants/Addons

The initial three steps have been completed as reflected in the preceding sections. The final step involves allocating Auth0 roles towards AI DIAL Core configuration. The `aidial.identityProviders.auth0.rolePath` setting is leveraged for this purpose, alongside the `userRoles` section found within the description of the DIAL resource.

In this example, the roles are provided to AI DIAL Core via user access token(JWT) by Auth0 and are available via the path: `Roles` with values `auth0-role-name`

  ```yaml
  "models": {
      "chat-gpt-35-turbo": {
        "type": "chat",
        "endpoint" : "http://localhost:7001/v1/openai/deployments/gpt-35-turbo/chat/completions",
        "upstreams": [
          {"endpoint": "http://localhost:7001", "key": "modelKey1"}
        ],
        "userRoles": ["auth0-role-name"]
      }
  }
  ```
