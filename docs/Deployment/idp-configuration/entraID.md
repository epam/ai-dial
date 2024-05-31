
<!-- omit from toc -->
# How to Set Up Google OAuth2 as Identity Provider

## Introduction

This basic tutorial demonstrates how to configure [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/whatis) and integrate it with AI DIAL for identity and access management.

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Microsoft Entra ID](#configure-microsoft-entra-id)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Roles Management Guide](#roles-management-guide)
  
</div>

## Configuration Guidelines

### Configure Microsoft Entra ID

> [!TIP]
> Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure Microsoft Entra ID:

1. **Create an Application:** Begin by register an Application. You can refer to the official Microsoft documentation for detailed instructions on [how to register application](https://learn.microsoft.com/en-us/azure/healthcare-apis/register-application).
1. **Configure Application Settings:** Set the following parameters:
    - Name
    - Supported account types
    - Platform: `Web`
    - Redirect URI: `https://<chat_url>/api/auth/callback/azure-ad`
1. Obtain and save **Application (client) ID** and **Directory (tenant) ID**
1. **Add and save client secret:** Under the **Certificates & secrets/Client secret** section, create **New client secret** and save its value.
1. (Optional) **Create a Group and add members:** Once the application integration is set up, [create the necessary Group and add members in Microsoft Entra](https://learn.microsoft.com/en-us/entra/fundamentals/groups-view-azure-portal).
2. (Optional) **Configure ID Token:** Under the **Token Configuration** section, **Add Groups claim** and customize which groups you want to include and where (access, ID token). You can refer to the official Microsoft documentation for detailed instructions on [configuration of group claims for applications](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#important-caveats-for-this-functionality).

### Configure AI DIAL

To enable AI DIAL Chat and AI DIAL Core to work with Microsoft Entra ID, configure them with the necessary specific parameters.

#### AI DIAL Chat Settings

> [!NOTE]
>  The application **scope** is required to validate signature of the access token.
> Refer to [Microsoft Portal](https://learn.microsoft.com/en-us/answers/questions/318741/graphapi-cannot-validate-access-token-signature) to read more about this case.

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) for more details.
   
  ```
  AUTH_AZURE_AD_CLIENT_ID: "<azure_client_id>"
  AUTH_AZURE_AD_TENANT_ID: "<azure_tenant_id>"
  AUTH_AZURE_AD_SECRET: "<azure_client_secret>"
  AUTH_AZURE_AD_SCOPE: "openid profile <azure_client_id>/.default email offline_access"
  ```

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core configuration. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#configuration) for more details.
   
  ```
  aidial.identityProviders.azure.jwksUrl: "https://login.microsoftonline.com/<azure_tenant_id>/discovery/v2.0/keys"
  aidial.identityProviders.azure.rolePath: "groups"
  aidial.identityProviders.azure.issuerPattern: '^https:\/\/sts\.windows\.net.+$'
  aidial.identityProviders.azure.loggingKey: "sub"
  aidial.identityProviders.azure.loggingSalt: "loggingSalt"
  ```

#### Roles Management Guide

AI DIAL enables assignment of roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.
Group management process is consisted of three steps:

1. Create a Group and add members in Microsoft Entra
1. Include into JWT token custom claim.
1. Configure AI DIAL Chat and Core
1. Assign roles to AI DIAL Models/Applications/Assistants/Addons

All the steps mentioned above have been completed, including the ones marked as **Optional**. The final step involves allocating Microsoft Entra Groups towards AI DIAL Core configuration. The `aidial.identityProviders.azure.rolePath` setting is leveraged for this purpose, alongside the `userRoles` section found within the description of the DIAL resource.

In this example, the roles are provided to AI DIAL Core via user access token(JWT) by Microsoft Entra ID and are available via the path: `Groups` with values `azure-group-name`

  ```yaml
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
