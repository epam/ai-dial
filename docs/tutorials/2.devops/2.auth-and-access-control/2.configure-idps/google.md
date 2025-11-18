<!-- omit from toc -->

# How to Set Google Identity as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->

## Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Google Identity](#configure-google-identity)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Assignment of Roles](#assignment-of-roles)

</div>

## Introduction

This basic tutorial demonstrates how to configure [Google Identity](https://developers.google.com/identity/protocols/oauth2) and use it as an identity and access management solution for AI DIAL users.

In AI DIAL, you can assign roles to Models and Applications to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

## Configuration Guidelines

### Configure Google Identity

> **Note**: Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure Google Identity:

1. **Create an OAuth consent screen**: refer [Google documentation](https://developers.google.com/workspace/guides/configure-oauth-consent) to learn how to do this.
1. **Create Client ID and Secret**: in the **Google Auth Platform/Clients**, use **Create Client**:
   - **Application Type**: `Web Application`
   - **Name**, e.g. `ai-dial-chat`
   - **Authorized JavaScript origins**: `<chat_url>`
   - **Authorized redirect URIs**: `https://<chat_url>/api/auth/callback/google`
1. **Gather facts**: to proceed with DIAL configuration, collect information related to Google Identity from the modal window:
   - **Client ID** (`<google_client_id>`)
   - **Client secret** (`<google_client_secret>`)
1. (Optional, RBAC) **Create a Group and add members**: Once the application integration is set up, [create the necessary Group and add members in Google Group](https://support.google.com/a/answer/9400082?hl=en#zippy=%2Cstep-create-a-group).
1. (Optional, RBAC) **Enable the Google Cloud Identity API**: In **APIs & Services/Library**, [Search for `Cloud Identity API`](https://console.cloud.google.com/apis/api/cloudidentity.googleapis.com) and enable it.

### Configure AI DIAL

By configuring both AI DIAL Chat and AI DIAL Core with the necessary environment variables, you will enable them to work together seamlessly with Identity Provider for authentication and authorization purposes.

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat [configuration](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables):

```yaml
AUTH_GOOGLE_CLIENT_ID: '<google_client_id>'
AUTH_GOOGLE_SECRET: '<google_client_secret>'
AUTH_GOOGLE_SCOPE: 'openid email profile https://www.googleapis.com/auth/cloud-identity.groups.readonly'
```

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core [**static** settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings):

> **Note**: generate some random sting for `loggingSalt` parameter, e.g. using `pwgen -s 32 1`

```yaml
aidial.identityProviders.google.userInfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo'
aidial.identityProviders.google.loggingKey: 'sub'
aidial.identityProviders.google.loggingSalt: 'loggingSalt'
aidial.identityProviders.google.rolePath: 'fn:getGoogleWorkspaceGroups'
```

#### Assignment of Roles

> **Warning**: RBAC-related steps from [Configure Google Identity](#configure-google-identity) must be completed before proceeding with this section.

To limit access to AI DIAL resources based on Google Groups, configure the AI DIAL Core by adjusting the [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): set the `userRoles` parameter to align with the desired Google group names.

In the provided example, users assigned the `google-group-name` group will have access to the `chat-gpt-35-turbo` model.

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
      "userRoles": ["google-group-name"]
    }
  }
}
```
