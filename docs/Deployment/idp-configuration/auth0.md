
<!-- omit from toc -->
# How to Set Auth0 as Identity Provider

## Introduction

This basic tutorial demonstrates how to configure an application in [Auth0](https://auth0.com/docs/get-started) and integrate it with AI DIAL for identity and access management.

In AI DIAL, you can assign roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

The complete process includes three steps:

1. [Configuration of Auth0](#configure-auth0)
2. [Configuration of AI DIAL Chat and Core](#configure-ai-dial)
3. [Assignment of roles](#assignment-of-roles) to AI DIAL Models/Applications/Assistants/Addons

## Configuration Guidelines

### Configure Auth0

> [!TIP]
> Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure Auth0:

1. **Create Tenant:** create a new tenant and save its name. Refer to [Auth0 documentation](https://auth0.com/docs/get-started/auth0-overview/create-tenants) to learn how to do it.
1. **Create Application:** create an [Application](https://auth0.com/docs/get-started/auth0-overview/create-applications). Set a name and choose `Regular Web Applications`.
1. **Configure Application Settings:** in the [**Applications/Settings**](https://auth0.com/docs/get-started/applications/application-settings) section, set the following parameters:
    - Obtain and save **Domain**,**Client ID** and **Client secrets** generated for your application.
    - Allowed Callback URLs: `https://<chat_url>/api/auth/callback/auth0`
1. **Create API:** in the **Applications/APIs** section, configure a new [**API**](https://auth0.com/docs/get-started/apis/api-settings).
1. **Create Users:** in the **User Management/Users** section, create necessary [Users](https://auth0.com/docs/manage-users/user-accounts/create-users).
1. (Optional) **Create and Assign Roles:** in the **User Management/Roles** section, create necessary [Roles](https://auth0.com/docs/manage-users/access-control/configure-core-rbac/roles/create-roles).
1. (Optional) **Create Action:** in the **Actions/Library** section, create a necessary [Action](https://auth0.com/docs/customize/actions/write-your-first-action#create-an-action) and [Deploy](https://auth0.com/docs/customize/actions/write-your-first-action#deploy-the-action) it. Action parameters:
   - Name: `DIAL role`
   - Trigger: `Login/Post Login`
   - Runtime: `Node 18`
   - Add the following code in the Actions Code Editor:
     ```js
     exports.onExecutePostLogin = async (event, api) => {
       if (event.authorization) { 
         api.accessToken.setCustomClaim("dial_roles", event.authorization.roles);
         api.accessToken.setCustomClaim('email', event.user.email);
       }
     };
     ```   
1. (Optional) **Configure the Login Flow:** in the **Actions/Flows** section, choose `Login`, add a custom action `DIAL role` to `Flow` and apply the change. Refer to [Auth0](https://auth0.com/docs/customize/actions/flows-and-triggers) documentation to learn more.

### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary environment variables, you will enable them to work together seamlessly with Identity Provider for authentication and authorization purposes.

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) for more details.
   
  ```yaml
  AUTH_AUTH0_HOST: "<auth0_domain>"
  AUTH_AUTH0_CLIENT_ID: "<auth0_client_id>"
  AUTH_AUTH0_CLIENT_SECRET: "<auth0_client_secret>"
  AUTH_AUTH0_AUDIENCE: "<auth0_api_audience>" 
  ```

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core **static** settings. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings) for more details.
      
  ```yaml
  aidial.identityProviders.auth0.jwksUrl: "https:///<auth0_domain>/.well-known/jwks.json"
  aidial.identityProviders.auth0.issuerPattern: '^https:\/\/${auth0_domain_name}\.eu\.auth0\.com.*$'
  aidial.identityProviders.auth0.loggingKey: "sub"
  aidial.identityProviders.auth0.loggingSalt: "loggingSalt"
  aidial.identityProviders.auth0.rolePath: "dial_roles"
  ```

#### Assignment of Roles

Once all the above steps are completed, including the ones marked as **Optional**, you can assign roles to Models, Applications, Addons, and Assistants.

In AI DIAL Core:

* [Static settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings): as value for `aidial.identityProviders.auth0.rolePath` provide a claim from Auth0.
* [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): for `userRoles` provide a specific claim value. 

In this example, `auth0-role-name` role from the `"dial_roles"` claim is configured for `chat-gpt-35-turbo` model:

  ```yaml
  # Dynamic settings of AI DIAL Core
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
