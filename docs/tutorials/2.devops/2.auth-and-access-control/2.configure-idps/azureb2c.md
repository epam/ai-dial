# How to Set Azure AD B2C as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->

## Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Azure AD B2C](#configure-microsoft-entra-id)
  - [Configure DIAL](#configure-dial)
    - [DIAL Chat Settings](#dial-chat-settings)
    - [DIAL Core Settings](#dial-core-settings)
    - [Assignment of Roles](#assignment-of-roles)

</div>

## Introduction

This basic tutorial demonstrates how to configure [Azure AD B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/overview) and use it as an identity and access management solution for DIAL users.

## Configuration Guidelines

### Configure Azure AD B2C

Follow these steps to configure Azure AD B2C:

1. Create a **B2C Tenant** if you do not have one: Refer to [Azure tutorials](https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant) to learn how to do this. Save the **tenant id** (`<azure_b2c_tenant_id>`) - you will need it to configure DIAL Chat `AUTH_AZURE_B2C_TENANT_ID` environment variable.
2. Register an enterprise **Web Application**: Refer to [Azure tutorials](https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-register-applications) for detailed instructions on how to register a Web application. Upon the registration, make sure to get the following details - you will need them to configure DIAL:
   - Application ID: Identifier associated with your application in the Azure portal (`<azure_b2c_app_id>`)
   - Redirect URI: A URI where authentication responses are sent and received by your app. Follow this format - `<chat_url>/api/auth/callback/azure-ad-b2c`. Replace `<chat_url>` with the actual address of your DIAL Chat application.
3. Create a **Client secret**: Refer to [Azure tutorials](https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-register-applications#create-a-client-secret) to learn how to do this. Save a client secret `<azure_b2c_client_secret>` and a `<azure_b2c_client_id>` - you will need them to configure DIAL CHAT `AUTH_AZURE_B2C_SECRET` and `AUTH_AZURE_B2C_CLIENT_ID` environment variables.
4. Create a **Scope**: Scopes are used to manage permissions to protected resources. In the section **Manage/Expose an API**, add a custom scope `Chat.Login` (`<azure_b2c_tenant_id>.onmicrosoft.com/<azure_b2c_app_id>/Chat.Login`). You will need it to configure DIAL Chat `AUTH_AZURE_B2C_SCOPE` environment variable. Refer to Azure tutorials to learn [how to configure scopes](https://learn.microsoft.com/en-us/azure/active-directory-b2c/configure-authentication-sample-spa-app?tabs=app-reg-ga#step-22-configure-scopes).
5. Configure **API Permissions**: To call a protected web API from an application, you need to grant your application permissions to the API. In **App registrations/App registration name/Manage/API Permissions** section, add a Delegated permission type for the custom scope you have created in the previous step and [OpenID scopes](https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc#openid-connect-scopes) `openid`, `profile`, `email`, and `offline_access`. Refer to [Azure documentation](https://learn.microsoft.com/en-us/azure/active-directory-b2c/add-web-api-application#grant-permissions) for more details.
6. Create a **User Flow**: A business logic that users follow to gain access to your application. Refer to [Azure tutorials](https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-user-flow) to learn how to do this. Save the `USER_FLOW_NAME`- you will need it to configure DIAL Chat `AUTH_AZURE_B2C_USER_FLOW` environment variable.
   - DIAL Chat application uses [NextAuth.js](https://next-auth.js.org/) for authentication, which requires claims `sub`, `name` and `emails` to be a part of JWT to authenticate users.
7. **Enable role-based access** to applications, models and toolsets: A JWT provided by the identity provider configured in your User Flow must include a specific claim with user roles. Claim values will be used in [userRoles](#assignment-of-roles) settings in DIAL Core. The claim name itself is used in [DIAL Core static settings](#dial-core-settings) for `rolePath` and as a value of the `AUTH_AZURE_B2C_DIAL_ROLES_FIELD` DIAL Chat environment variable. In this tutorial, for clarity, we use the claim name `roles`.
8. **Configure access for DIAL administrators**: To enable access for DIAL administrators, a claim for user roles in JWT provided by the identity provider configured in your User Flow must include a specific claim value for admin users. This value must match the `target` value in `access.admin.rules` settings in DIAL Core static settings. This claim value is also provided as a value for DIAL Chat environment variable `AUTH_AZURE_B2C_ADMIN_ROLE_NAMES`. In this tutorial, for clarity, we use the claim name `roles` and the value `admin` to identify DIAL administrators.

### Configure DIAL

By configuring both DIAL Chat and DIAL Core with the necessary environment variables, you will enable them to work together seamlessly with Identity Provider for authentication and authorization purposes.

#### DIAL Chat Settings

Add the following environment variables to DIAL Chat configuration. Refer to [DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) for more details.

Authentication variables:

```yaml
AUTH_AZURE_B2C_AUD: <azure_b2c_app_id>
AUTH_AZURE_B2C_CLIENT_ID: <azure_b2c_client_id>
AUTH_AZURE_B2C_CLIENT_SECRET: <azure_b2c_client_secret>
AUTH_AZURE_B2C_DIAL_ROLES_FIELD: roles #claim with user roles from identity provider configured in the user flow
AUTH_AZURE_B2C_ADMIN_ROLE_NAMES: admin #claim value from the roles claim used to identify admin users
AUTH_AZURE_B2C_NAME: Azure B2C
AUTH_AZURE_B2C_SCOPE: openid profile email offline_access <azure_b2c_tenant_id>.onmicrosoft.com/<azure_b2c_app_id>/Chat.Login
AUTH_AZURE_B2C_TENANT_ID: <azure_b2c_tenant_id>
AUTH_AZURE_B2C_USER_FLOW: USER_FLOW_NAME
```

> **Tip**: The application **scope** added above [is required to validate signature](https://learn.microsoft.com/en-us/answers/questions/318741/graphapi-cannot-validate-access-token-signature) of the access token.

Additional variables:

```yaml
FEDERATED_LOGOUT_PROVIDERS: azure-ad-b2c #define value as azure-ad-b2c to enable logout
```

#### DIAL Core Settings

Add the following parameters to [DIAL Core static settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings):

> **Note**: generate some random sting for `loggingSalt` parameter, e.g. using `pwgen -s 32 1`

```yaml
aidial.identityProviders.azureb2c.issuerPattern: ^https:\/\/<azure_b2c_tenant_id>\.b2clogin\.com.+$ #describes an issuer in a token
aidial.identityProviders.azureb2c.jwksUrl: <azure_b2c_tenant_id>.b2clogin.com/<azure_b2c_tenant_id>.onmicrosoft.com/<USER_FLOW_NAME>/discovery/v2.0/keys #used to validate a token
aidial.identityProviders.azureb2c.loggingKey: sub
aidial.identityProviders.azureb2c.loggingSalt: your-logging-salt
aidial.identityProviders.azureb2c.projectPath: aud
aidial.identityProviders.azureb2c.rolePath: roles #claim with user roles from identity provider configured in the user flow
aidial.identityProviders.azureb2c.userDisplayName: name #claim with the user name from identity provider configured in the user flow
```

To identify users with admin permissions, configure `access.admin.rules` parameter in [DIAL Core static settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings). In this tutorial, for clarity, we use claim `roles` with value `admin` to identify DIAL administrators. This claim must be a part of JWT from your identity provider. Refer to [DIAL Core documentation](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings) to learn how to configure `access.admin.rules`.

Example of DIAL Core configuration to identify DIAL administrators:

```json
{
  "aidial": {
    "access": {
      "admin": {
        "rules": [
          {
            "source": "roles",
            "function": "EQUAL",
            "targets": ["admin"]
          }
        ]
      }
    }
  }
}
```

#### Assignment of Roles

> **Note**: A User Flow must be defined to proceed with the assignment of roles to DIAL resources.

Roles in DIAL are used to limit access to DIAL resources (applications, models, toolsets).

To define roles, configure [DIAL Core dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings):

For the `userRoles` settings, provide specific claim values provided in JWT by your identity provider. In this example, for clarity, we used claim `roles` with value `regular_user` to identify regular DIAL users. In the provided example, users with the `regular_user` role have access to the `chat-gpt-35-turbo` model.

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
        "regular_user" #A specific claim value in the roles claim
      ]
    }
  }
}
```
