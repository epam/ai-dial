
<!-- omit from toc -->
# How to Set Google OAuth2 as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Google OAuth2](#configure-google-oauth2)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Assignment of Roles](#assignment-of-roles)
  
</div>

## Introduction

This basic tutorial demonstrates how to configure [Google OAuth2](https://developers.google.com/identity/protocols/oauth2) and integrate it with AI DIAL for identity and access management.

In AI DIAL, you can assign roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

## Configuration Guidelines

### Configure Google OAuth2

> **Note:**
> Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure Google OAuth2:

1. **Create an OAuth consent screen:** refer [Google documentation](https://developers.google.com/workspace/guides/configure-oauth-consent) to learn how to do this.
1. **Create Client ID and Secret:** click **Create Credentials > OAuth Client ID** and fill it with:
    - Name
    - Application Type: `Web Application`
    - Authorized JavaScript Origins: `https://<chat_url>`
    - Authorized Redirect URLs: `https://<chat_url>/api/auth/callback/google`
1. Obtain and save **Client ID** and **Client Secret** from the __OAuth Client__ modal.
1. (Optional) **Create a Group and add members:** Once the application integration is set up, [create the necessary Group and add members in Google Group](https://support.google.com/a/answer/9400082?hl=en#zippy=%2Cstep-create-a-group).
1. (Optional) **Enable the Google Cloud Identity API:** click `ENABLE` in [your organization’s dashboard](https://console.cloud.google.com/apis/api/cloudidentity.googleapis.com/).

### Configure AI DIAL

To enable AI DIAL Chat and AI DIAL Core to work with Google OAuth2, configure them with the necessary specific parameters.

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) for more details.
  
  ```yaml
  AUTH_GOOGLE_CLIENT_ID: "<google_client_id>"
  AUTH_GOOGLE_SECRET: "<google_tenant_id>"
  AUTH_GOOGLE_SCOPE: "openid email profile https://www.googleapis.com/auth/cloud-identity.groups.readonly" # Optional
  ```

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core **static** settings. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings) for more details.
   
  ```yaml
  aidial.identityProviders.google.userInfoEndpoint: "https://openidconnect.googleapis.com/v1/userinfo"
  aidial.identityProviders.google.rolePath: "fn:getGoogleWorkspaceGroups"
  aidial.identityProviders.google.loggingKey: "sub"
  aidial.identityProviders.google.loggingSalt: "loggingSalt"
  ```

#### Assignment of Roles

Once all the above steps are completed, including the ones marked as **Optional**, you can assign roles to Models, Applications, Addons, and Assistants.

In AI DIAL Core:

* [Static settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings): as value for `aidial.identityProviders.google.rolePath` provide an API endpoint from Google OAuth2.
* [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): for `userRoles` provide a specific group name. 

In this example, `"google-group-name"` role from the `"fn:getGoogleWorkspaceGroups"` API endpoint is configured for `chat-gpt-35-turbo` model:

  ```yaml
  "models": {
      "chat-gpt-35-turbo": {
        "type": "chat",
        "endpoint" : "http://localhost:7001/v1/openai/deployments/gpt-35-turbo/chat/completions",
        "upstreams": [
          {"endpoint": "http://localhost:7001", "key": "modelKey1"}
        ],
        "userRoles": ["google-group-name"]
      }
  }
  ```
