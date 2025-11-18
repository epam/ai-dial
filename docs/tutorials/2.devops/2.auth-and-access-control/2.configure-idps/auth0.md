<!-- omit from toc -->

# How to Set Auth0 as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->

## Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Auth0](#configure-auth0)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Assignment of Roles](#assignment-of-roles)

</div>

## Introduction

This basic tutorial demonstrates how to configure an application in [Auth0](https://auth0.com/docs/get-started) and use it as an identity and access management solution for AI DIAL users.

In AI DIAL, you can assign roles to Models and Applications to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

## Configuration Guidelines

### Configure Auth0

> **Note**: Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure Auth0:

1. **Create Tenant**: create a new tenant. Refer to [Auth0 documentation](https://auth0.com/docs/get-started/auth0-overview/create-tenants) for detailed instructions.
1. **Create Application**: create an [Application](https://auth0.com/docs/get-started/auth0-overview/create-applications):
   - Set a **Name**, e.g. `ai-dial-chat`
   - Set `Regular Web Applications` **Application type**
1. **Configure Application Settings**: on the [**Settings**](https://auth0.com/docs/get-started/applications/application-settings) tab of newly-created application:
   - Save **Domain** (`<auth0_domain>`),**Client ID** (`<auth0_client_id>`) and **Client secret** (`<auth0_client_secret>`) generated for your application
   - Set **Allowed Callback URLs**: `<chat_url>/api/auth/callback/auth0`
1. **Create API**: in the **Applications/APIs** section, create a new [**API**](https://auth0.com/docs/get-started/apis/api-settings).
1. **Create Users**: in the **User Management/Users** section, create [Users](https://auth0.com/docs/manage-users/user-accounts/create-users).
1. (Optional, RBAC) **Create and Assign Roles**: in the **User Management/Roles** section, create [Roles](https://auth0.com/docs/manage-users/access-control/configure-core-rbac/roles/create-roles) and assign them to created users. These roles can be used to restrict access to DIAL resources later.
1. (Optional, RBAC) **Create Action**: in the **Actions/Library** section, [Create Custom Action](https://auth0.com/docs/customize/actions/write-your-first-action#create-an-action):

   - Name: `DIAL role`
   - Trigger: `Login/Post Login`
   - Runtime: `Node 22`
   - Use the following code in the Actions Code Editor:

     ```js
     exports.onExecutePostLogin = async (event, api) => {
       if (event.authorization) {
         api.accessToken.setCustomClaim(
           'dial_roles',
           event.authorization.roles,
         );
         api.accessToken.setCustomClaim('email', event.user.email);
       }
     };
     ```

   - [Deploy](https://auth0.com/docs/customize/actions/write-your-first-action#deploy-the-action) it
   - In the **Actions/Triggers** section, choose `post-login`, place `DIAL role` action after **Start** step and apply the change. Refer to [Auth0](https://auth0.com/docs/customize/actions/flows-and-triggers) documentation to learn more.

### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary environment variables, you will enable them to work together seamlessly with Identity Provider for authentication and authorization purposes.

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat [configuration](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables):

```yaml
AUTH_AUTH0_HOST: 'https://<auth0_domain>'
AUTH_AUTH0_CLIENT_ID: '<auth0_client_id>'
AUTH_AUTH0_SECRET: '<auth0_client_secret>'
AUTH_AUTH0_AUDIENCE: '<auth0_api_audience>'
```

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core [**static** settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings):

> **Note**: `<auth0_domain_regex>` is `<auth0_domain>` with dots escaped, e.g. `example\.eu\.auth0\.com`
>
> **Note**: generate some random sting for `loggingSalt` parameter, e.g. using `pwgen -s 32 1`

```yaml
aidial.identityProviders.auth0.jwksUrl: 'https://<auth0_domain>/.well-known/jwks.json'
aidial.identityProviders.auth0.issuerPattern: '^https:\/\/<auth0_domain_regex>.*$'
aidial.identityProviders.auth0.loggingKey: 'sub'
aidial.identityProviders.auth0.loggingSalt: 'loggingSalt'
aidial.identityProviders.auth0.rolePath: 'dial_roles'
```

#### Assignment of Roles

> **Warning**: RBAC-related steps from [Configure Auth0](#configure-auth0) must be completed before proceeding with this section.

To limit access to AI DIAL resources based on Auth0 roles, configure the AI DIAL Core by adjusting the [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): set the `userRoles` parameter to align with the desired Auth0 role names.

In the provided example, users assigned the `auth0-role-name` role will have access to the `chat-gpt-35-turbo` model.

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
      "userRoles": ["auth0-role-name"]
    }
  }
}
```
