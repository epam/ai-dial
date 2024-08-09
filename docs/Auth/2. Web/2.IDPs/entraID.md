
<!-- omit from toc -->
# How to Set Microsoft Entra as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Microsoft Entra ID](#configure-microsoft-entra-id)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Assignment of Roles](#assignment-of-roles)
  
</div>

## Introduction

This basic tutorial demonstrates how to configure [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/whatis) and integrate it with AI DIAL for identity and access management.

In AI DIAL, you can assign roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

## Configuration Guidelines

### Configure Microsoft Entra ID

> **Note:** Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure Microsoft Entra ID:

1. **Create an Application:** refer to [Microsoft documentation](https://learn.microsoft.com/en-us/azure/healthcare-apis/register-application) to learn how to register an application. Set the following parameters:
    - Name
    - Supported account types
    - Platform: `Web`
    - Redirect URI: `https://<chat_url>/api/auth/callback/azure-ad`
1. After registering an application, obtain and save **Application (client) ID** and **Directory (tenant) ID** - you will need them to configure AI DIAL. Refer to [Microsoft documentation](https://learn.microsoft.com/en-us/azure/healthcare-apis/register-application#application-id-client-id).
1. **Create and save a Client secret:** in the **Certificates & secrets/Client secret** section, create **New client secret** and save its value. Refer to [Microsoft documentation](https://learn.microsoft.com/en-us/azure/healthcare-apis/register-application#certificates--secrets).
1. (Optional) **Create a Group and add members:** once the application integration is set up, create the necessary Group and add members. Refer to [Microsoft documentation](https://learn.microsoft.com/en-us/entra/fundamentals/groups-view-azure-portal).
2. (Optional) **Configure ID Token:** in the **Token Configuration** section, **Add Groups claim** and customize which groups you want to include and where (access, ID token). Refer to [Microsoft documentation](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#important-caveats-for-this-functionality).

### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary Microsoft Entra ID environment variables, you will enable them to work together seamlessly with Microsoft Entra ID for authentication and authorization purposes.

To configure AI DIAL Chat and AI DIAL Core to work with Microsoft Entra ID, follow these steps:

#### AI DIAL Chat Settings

> **Note:** The application **scope** is required to validate signature of the access token. Refer to [Microsoft Portal](https://learn.microsoft.com/en-us/answers/questions/318741/graphapi-cannot-validate-access-token-signature) to read more about this case.

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) for more details.
   
  ```yaml
  AUTH_AZURE_AD_CLIENT_ID: "<azure_client_id>"
  AUTH_AZURE_AD_TENANT_ID: "<azure_tenant_id>"
  AUTH_AZURE_AD_SECRET: "<azure_client_secret>"
  AUTH_AZURE_AD_SCOPE: "openid profile <azure_client_id>/.default email offline_access"
  ```

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core **static** settings. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings) for more details.
   
  ```yaml
  aidial.identityProviders.azure.jwksUrl: "https://login.microsoftonline.com/<azure_tenant_id>/discovery/v2.0/keys"
  aidial.identityProviders.azure.rolePath: "groups"
  aidial.identityProviders.azure.issuerPattern: '^https:\/\/sts\.windows\.net.+$'
  aidial.identityProviders.azure.loggingKey: "sub"
  aidial.identityProviders.azure.loggingSalt: "loggingSalt"
  ```

#### Assignment of Roles

Once all the above steps are completed, including the ones marked as **Optional**, you can assign roles to Models, Applications, Addons, and Assistants.

In AI DIAL Core:

* [Static settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings): as value for `aidial.identityProviders.azure.rolePath` provide a claim from Microsoft Entra.
* [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): for `userRoles` provide a specific group name as a claim value. 

In this example, `"azure-group-name"` role from the `"groups"` claim is configured for `chat-gpt-35-turbo` model:

  ```yaml
  # Dynamic settings of AI DIAL Core
  "models": {
      "chat-gpt-35-turbo": {
        "type": "chat",
        "endpoint" : "http://localhost:7001/v1/openai/deployments/gpt-35-turbo/chat/completions",
        "upstreams": [
          {"endpoint": "http://localhost:7001", "key": "modelKey1"}
        ],
        "userRoles": ["azure-group-name"]
      }
  }
  ```
