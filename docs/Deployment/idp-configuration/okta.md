
<!-- omit from toc -->
# How to Set Up Okta as Identity Provider

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents

- [Introduction](#introduction)
- [Configuration Guidelines](#configuration-guidelines)
  - [Configure Okta](#configure-okta)
  - [Configure AI DIAL](#configure-ai-dial)
    - [AI DIAL Chat Settings](#ai-dial-chat-settings)
    - [AI DIAL Core Settings](#ai-dial-core-settings)
    - [Assignment of roles](#assignment-of-roles)
  
</div>

## Introduction

This basic tutorial demonstrates how to configure an application in [Okta](https://www.okta.com/customer-identity/single-sign-on) and integrate it with AI DIAL for identity and access management.

In AI DIAL, you can assign roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.

The complete process includes three steps:

1. [Configuration of Okta](#configure-okta)
2. [Configuration of AI DIAL Chat and Core](#configure-ai-dial)
3. [Assignment of roles](#assignment-of-roles) to AI DIAL Models/Applications/Assistants/Addons

## Configuration Guidelines

### Configure Okta

> [!TIP]
> Replace `<chat_url>` with the actual address of your AI DIAL Chat application.

Follow these steps to configure Okta:

1. **Create an Application:** begin by creating an [Application](https://help.okta.com/okta_help.htm?type=oie&locale=en&id=csh-apps-main). You can refer to the official Okta documentation for detailed instructions on [how to create an OIDC app integration](https://help.okta.com/oie/en-us/content/topics/apps/apps_app_integration_wizard_oidc.htm).
2. **Configure Application Settings:** under the **Applications/Applications** section, set the following parameters:
    - Sign-in redirect URIs: `https://<chat_url>/api/auth/callback/okta`
    - Sign-out redirect URIs: `https://<chat_url>`
    - Obtain and save **Client ID** and **Client secrets** generated for your application.
3. **Enable API Scopes:** under the **Applications/Okta API Scopes** section, enable the following scopes:
    - okta.users.read
    - okta.users.read.self
4. **Obtain Issuer URI and JWKS URI:** under **Security/API** section, locate the **Issuer URI**. You can find the **jwks_uri** within the Issuer URI. This URI will be used in AI DIAL Core configuration.
5. **Create Users:** once the application integration is set up, create the necessary users. Refer to [People](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-people.htm) to learn how to do this.
6. (Optional) **Create Groups:** create the necessary [Groups](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-groups-main.htm) in Okta.
7. (Optional) **Assign People:** assign users (People) to the relevant Groups.
8. (Optional) **Assign Application to Group:** refer to [Assign the Application to group](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-assign-app-group.htm) to learn how to do this.
9. (Optional) **Configure ID Token:** under the **Applications/Sign On/OpenID Connect ID Token** section, set **Groups** claim type to `Filter` and **Groups claim filter** to `groups; Matches regex: .*`. For more information, refer to the [Okta documentation](https://developer.okta.com/docs/guides/customize-tokens-groups-claim/main/).


### Configure AI DIAL

To enable AI DIAL Chat and AI DIAL Core to work with Okta, configure them with the necessary Okta-specific parameters.

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) for more details.
   
  ```yaml
  AUTH_OKTA_CLIENT_ID: "<okta_client_id>"
  AUTH_OKTA_CLIENT_SECRET: "<okta_client_secret>"
  AUTH_OKTA_ISSUER: "<okta_issuer>" 
  ```

> [!TIP]
> `okta_issuer` example: `https://${yourOktaDomain}/oauth2/${authorizationServerId}`

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core **static** settings. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings) for more details.
   
  ```yaml
  aidial.identityProviders.okta.jwksUrl: "<okta_jwks_uri>"
  aidial.identityProviders.okta.rolePath: "Groups"
  aidial.identityProviders.okta.issuerPattern: '^https:\/\/${yourOktaAccount}\.okta\.com.*$'
  aidial.identityProviders.okta.loggingKey: "sub"
  aidial.identityProviders.okta.loggingSalt: "loggingSalt"
  ```
  > [!TIP]
  > `okta_jwks_uri` example: `https://${yourOktaDomain}/oauth2/${authorizationServerId}/v1/keys`

#### Assignment of Roles

Once all the above steps are completed, including the ones marked as **Optional**, you can assign roles to Models, Applications, Addons, and Assistants.

In AI DIAL Core:

* [Static settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#static-settings): as value for `aidial.identityProviders.okta.rolePath` provide a claim from Okta.
* [Dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings): for `userRoles` provide a specific claim value. 

In this example, `okta-group-name` claim value from the `Groups` Okta claim is configured for `chat-gpt-35-turbo` model:

```yaml
# Dynamic settings of AI DIAL Core
"models": {
    "chat-gpt-35-turbo": {
      "type": "chat",
      "endpoint" : "http://localhost:7001/v1/openai/deployments/gpt-35-turbo/chat/completions",
      "upstreams": [
        {"endpoint": "http://localhost:7001", "key": "modelKey1"}
      ],
      "userRoles": ["okta-group-name"]
    }
}
```
