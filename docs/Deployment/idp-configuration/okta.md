
<!-- omit from toc -->

# How to Set Up Okta as Identity Provider

## Introduction

This basic tutorial demonstrates how to configure an application in [Okta](https://www.okta.com/customer-identity/single-sign-on) and integrate it with AI DIAL for identity and access management.

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents

- [How to Set Up Okta as Identity Provider](#how-to-set-up-okta-as-identity-provider)
  - [Introduction](#introduction)
  - [Configuration Guidelines](#configuration-guidelines)
    - [Configure Okta](#configure-okta)
    - [Configure AI DIAL](#configure-ai-dial)
      - [AI DIAL Chat Settings](#ai-dial-chat-settings)
      - [AI DIAL Core Settings](#ai-dial-core-settings)
      - [Roles Management Guide](#roles-management-guide)
  
</div>

## Configuration Guidelines

### Configure Okta

Follow these steps to configure Okta:

1. **Create an Application:** Begin by creating an [Application](https://help.okta.com/okta_help.htm?type=oie&locale=en&id=csh-apps-main). You can refer to the official Okta documentation for detailed instructions on [how to create an OIDC app integration](https://help.okta.com/oie/en-us/content/topics/apps/apps_app_integration_wizard_oidc.htm).
1. **Configure Application Settings:** Under the **Applications/Applications** section, set the following parameters:
  - Sign-in redirect URIs: Enter the callback URL as follows
  
    ```
    https://<chat_url>/api/auth/callback/okta
    ```
  - Sign-out redirect URIs: Enter the application URL as follows
  
    ```
    https://<chat_url>
    ```

    > [!TIP]
    > Replace `<chat_url>` with the actual address of your AI DIAL Chat application.
  - Obtain and save **Client ID** and **Client secrets** generated for your application.

1. **Enable API Scopes:** Under the **Applications/Okta API Scopes** section, enable the following scopes:
    - okta.users.read
    - okta.users.read.self
1. **Configure ID Token:** Under the **Applications/Sign On/OpenID Connect ID Token** section, set **Groups** claim type to `Filter` and **Groups claim filter** to `groups; Matches regex: .*`. For more information, refer to the [Okta documentation](https://developer.okta.com/docs/guides/customize-tokens-groups-claim/main/).
1. **Create Users and Groups:** Once the application integration is set up, create the necessary [People](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-people.htm) and [Groups](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-groups-main.htm) in Okta.
1. **Assign Users to Groups:** Assign the created users to the relevant groups.
1. **Assign Application to Group:** [Assign the Application to group](https://help.okta.com/oie/en-us/content/topics/users-groups-profiles/usgp-assign-app-group.htm)
1. **Obtain Issuer URI and JWKS URI:** Under **Security/API** section, locate the **Issuer URI**. You can find the **jwks_uri** within the Issuer URI. This URI will be used in AI DIAL Core configuration.


### Configure AI DIAL

To enable AI DIAL Chat and AI DIAL Core to work with Okta, configure them with the necessary Okta-specific parameters.

#### AI DIAL Chat Settings

Add the following environment variables to AI DIAL Chat configuration. Refer to [AI DIAL Chat](https://github.com/epam/ai-dial-chat/blob/development/apps/chat/README.md#environment-variables) for more details.
   
      ```
      AUTH_OKTA_CLIENT_ID: "<okta_client_id>"
      AUTH_OKTA_CLIENT_SECRET: "<okta_client_secret>"
      AUTH_OKTA_ISSUER: "<okta_issuer>" 
      ```
> `okta_issuer` example: `https://${yourOktaDomain}/oauth2/${authorizationServerId}`

#### AI DIAL Core Settings

Add the following parameters to AI DIAL Core configuration. Refer to [AI DIAL Core](https://github.com/epam/ai-dial-core?tab=readme-ov-file#configuration) for more details.
   
  ```
  aidial.identityProviders.okta.jwksUrl: "<okta_jwks_uri>" # URL to jwks token like https://${yourOktaDomain}/oauth2/default/v1/keys
  aidial.identityProviders.okta.rolePath: "Groups"
  aidial.identityProviders.okta.issuerPattern: '^https:\/\/${yourOktaAccount}\.okta\.com.*$'
  aidial.identityProviders.okta.loggingKey: "sub"
  aidial.identityProviders.okta.loggingSalt: "loggingSalt"

  ```
  > [!TIP]
  > `okta_jwks_uri` example: `https://${yourOktaDomain}/oauth2/${authorizationServerId}/v1/keys`

#### Roles Management Guide

AI DIAL enables assignment of roles to Models, Applications, Addons, and Assistants to restrict the number of tokens that can be transmitted in a specific time frame. These roles and their limitations can be created in external systems and then assigned in AI DIAL's configuration.
Group management process is consisted of three steps:

1. Create groups in Okta
1. Include into JWT token custom claim.
1. Configure AI DIAL Chat and Core
1. Assign roles to AI DIAL Models/Applications/Assistants/Addons

The initial three steps have been completed as reflected in the preceding sections. The final step involves allocating Okta Groups towards AI DIAL Core configuration. The `aidial.identityProviders.okta.rolePath` setting is leveraged for this purpose, alongside the `userRoles` section found within the description of the DIAL resource.

In this example, the roles are provided to AI DIAL Core via user access token(JWT) by Okta and are available via the path: `Groups` with values `okta-group-name`

  ```yaml
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
