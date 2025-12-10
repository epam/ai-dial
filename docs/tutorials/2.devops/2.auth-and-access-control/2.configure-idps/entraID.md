
<!-- omit from toc -->
# How to Set Microsoft Entra ID as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->
## Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Microsoft Entra ID](#configure-microsoft-entra-id)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Assignment of Roles](#assignment-of-roles)

</div>

## Introduction

This basic tutorial demonstrates how to configure [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/whatis) and use it as an identity and access management solution for AI DIAL users.

In AI DIAL, you can assign roles to Models and Applications to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

## Configuration Guidelines

### Configure Microsoft Entra ID

> **Note**: Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure Microsoft Entra ID:

1. **Register Application**: refer to [Microsoft documentation](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) for detailed instructions on how to register an application:
    - **Name**: e.g. `ai-dial-chat`
    - **Supported account types**: e.g. `Accounts in this organizational directory only (Single tenant)`
    - **Redirect URI**: `Web` + `<chat_url>/api/auth/callback/azure-ad`
1. **Create Client secret**: in the **Certificates & secrets/Client secrets** section, create **New client secret** and save its value. Refer to [Microsoft documentation](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials?tabs=client-secret).
1. **Gather facts**: to proceed with DIAL configuration, collect information related to Microsoft Entra ID:
    - In **App registrations/App registration name/Overview**, save **Application (client) ID** (`<azure_client_id>`), **Directory (tenant) ID** (`<azure_tenant_id>`).
    - In **App registrations/App registration name/Certificates & secrets**, save **Client secret** value (`<azure_client_secret>`).
1. (Optional, RBAC) **Create a Group and add members**: once the application integration is set up, create groups and add members to them. Refer to [Microsoft documentation](https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups).
1. (Optional, RBAC): **Add Groups to application**: in the **Enterprise applications/Application name/Users and groups** section, add the created groups to the application. If free tier is used, you can assign only users, not groups, which is fine too.
1. (Optional, RBAC) **Configure ID Token**: in the **App registrations/App registration name/Token Configuration** section, select **Add groups claim** and [customize which groups](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims) you want to include, e.g.:
    - **Select group types to include in Access, ID, and SAML tokens**: `Groups assigned to the application`
    - **Customize token properties by type**: `Group ID`
    > **Note**: There're [important caveats](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#important-caveats-for-this-functionality) to be aware of when using group claims in Microsoft Entra ID.

### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary environment variables, you will enable them to work together seamlessly with Identity Provider for authentication and authorization purposes.

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) for more details.

```yaml
AUTH_AZURE_AD_CLIENT_ID: "<azure_client_id>"
AUTH_AZURE_AD_TENANT_ID: "<azure_tenant_id>"
AUTH_AZURE_AD_SECRET: "<azure_client_secret>"
AUTH_AZURE_AD_SCOPE: "openid profile <azure_client_id>/.default email offline_access"
```

> **Tip**: The application **scope** added above [is required to validate signature](https://learn.microsoft.com/en-us/answers/questions/318741/graphapi-cannot-validate-access-token-signature) of the access token.

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core [**static** settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings):

> **Note**: generate some random sting for `loggingSalt` parameter, e.g. using `pwgen -s 32 1`

```yaml
aidial.identityProviders.azure.jwksUrl: "https://login.microsoftonline.com/<azure_tenant_id>/discovery/v2.0/keys"
aidial.identityProviders.azure.issuerPattern: '^https:\/\/sts\.windows\.net.+$'
aidial.identityProviders.azure.loggingKey: "sub"
aidial.identityProviders.azure.loggingSalt: "loggingSalt"
aidial.identityProviders.azure.rolePath: "groups"
```

#### Assignment of Roles

> **Warning**: RBAC-related steps from [Configure Microsoft Entra ID](#configure-microsoft-entra-id) must be completed before proceeding with this section.

To limit access to AI DIAL resources based on Microsoft Entra ID Groups, configure the AI DIAL Core by adjusting the [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): set the `userRoles` parameter to align with the desired Microsoft Entra ID group names.

In the provided example, users assigned the `azure-group-name` group will have access to the `chat-gpt-35-turbo` model.

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
        "azure-group-name"
      ]
    }
  }
}
```
