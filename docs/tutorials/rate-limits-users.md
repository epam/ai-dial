# How to Configure Rate Limits for Chat Users

## Overview 

In AI DIAL, you can limit the number of tokens that chat users can send to an LLM within a certain time period. These restrictions are implemented via user roles. You can create user roles for your users in your IDP system and then apply limits for these roles in AI DIAL configuration. 

> Besides rate limitations, you can use roles to manage access to models, applications, assistants and addons.

1. Configure any of the supported identity providers and then add a configuration to AI DIAL Core and AI DIAL Chat to work with it.
   
> Refer to [Auth0](https://docs.epam-rail.com/Deployment/idp-configuration/auth0), [AWS Cognito](https://docs.epam-rail.com/Deployment/idp-configuration/cognito), [MS Entra](https://docs.epam-rail.com/Deployment/idp-configuration/entraID), [Google OAuth2](https://docs.epam-rail.com/Deployment/idp-configuration/google), [Keycloak](https://docs.epam-rail.com/Deployment/idp-configuration/keycloak), [Okta](https://docs.epam-rail.com/Deployment/idp-configuration/okta) to view how to enable them as an identity and access management solution for AI DIAL users.

2. Once you have your roles defined in AI DIAL Core and assigned to the desired models, applications, assistants and addons, you can specify limits for these roles.

## Example 

For example purposes, lets configure rate limits for AI DIAL Chat users with user roles managed in Microsoft Entra. 

1. [Configure Microsoft Entra](https://docs.epam-rail.com/Deployment/idp-configuration/entraID#configure-microsoft-entra-id): create application, client secret, and user group.
2. [Configure AI DIAL Chat](https://docs.epam-rail.com/Deployment/idp-configuration/entraID#ai-dial-chat-settings) to work with MS Entra.
3. [Configure AI DIAL Core](https://docs.epam-rail.com/Deployment/idp-configuration/entraID#ai-dial-core-settings) to work with MS Entra.
4. [Assign roles](https://docs.epam-rail.com/Deployment/idp-configuration/entraID#assignment-of-roles) you have created in MS Entra to a selected model in AI DIAL Core configuration. In this example, "azure-group-name" role from the "groups" claim is configured for chat-gpt-35-turbo model:

      ```json
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
5. In AI DIAL Core configuration file, in the `roles` section, add your role ("azure-group-name") and limits for it. Refer to [configuration example](https://github.com/epam/ai-dial-core/blob/9d7e3ba8380ffea3b9b6a7ccd65a96f024e842e3/sample/aidial.config.json#L191) for example purposes. For `roles.<role_name>.limits` you can configure `minute` (total tokens per minute limit sent to the model, managed via floating window approach for well-distributed rate limiting. If it's not set the default value is unlimited), `day` (total tokens per day limit sent to the model, managed via floating window approach for balanced rate limiting. If it's not set the default value is unlimited), `week` and `month` accordingly.

      > The `default` role applies in case other roles are not configured.
      > In case the same user has different roles with different limits, the role with the higher limit is an effective role.
      
      ```json
      "roles": {
          "azure-group-name": {
              "limits": {
                  "chat-gpt-35-turbo": {
                      "minute": "200000",
                      "day": "10000000"
                  }
              }
          },
          "default": {
              "limits": {
                  "chat-gpt-35-turbo": {
                      "minute": "200000",
                      "day": "10000000"
                  }
              }
          },
      }
      ```
