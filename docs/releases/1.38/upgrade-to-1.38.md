# Instructions

## Before environment upgrade

**Please notice**:

1. ETA downtime: TBD
1. Helm chart versions:
    - dial TBD
    - dial-core TBD
    - dial-extension TBD
2. Main components versions:
    - ai-dial-adapter-bedrock:`0.35.0`
    - ai-dial-adapter-openai:`0.34.0`
    - ai-dial-adapter-vertexai:`0.29.0`
    - ai-dial-adapter-dial:`0.10.0`
    - ai-dial-auth-helper:`0.4.0`
    - ai-dial-chat-themes:`0.12.0`
    - ai-dial-chat:`0.40.0` 
    - ai-dial-core:`0.38.0`  
    - ai-dial-analytics-realtime:`0.19.4`
    - ai-dial-rag:`0.36.0`
    - ai-dial-log-parser:`0.2.0`
    - ai-dial-code-interpreter:`0.2.0`
    - ai-dial-app-controller:`0.3.0`
    - ai-dial-app-builder-python:`0.1.0`
    - quick-apps: `0.8.2`
    - quick-apps-2.0: `0.2.0`
    - mindmap-backend: `0.11.6`
    - mindmap-frontend: `0.8.13`
    - admin-backend : `0.11.0`
    - admin-frontend `0.11.0`

## Upgrade

TBD

## After environment upgrade

TBD


## Config changes

    - **ai-dial-core**
       - Optional feature supportCommentInRateResponse in deployment.feature section. Allowing to send feedback text in addition to like / dislike to this deployment.
       - Optional field globalInterceptors which allows you to specify list of interceptors is going to be applicable for any deployment on setup.
       - Optional field dial:applicationTypeInterceptors in application schema which allows you to specify list of interceptors is going to be applicable for all applications of specific type.
    - **ai-dial-chat**
       - Optional feature code-interpreter in ENABLED_FEATURES which allows you to specify if code-interpreter enabled on setup.
       - Optional feature dislike-comment in ENABLED_FEATURES which allows you to turn on ability to send text comment in addition to dislike
    - **ai-dial-chat-themes**
       - Add icons for RAG (RAG_files_search.svg) and Echo (Echo.svg)
       - Add default icon for Toolset (default-toolset.svg)
       - Remove default icon for Addon (Addon_Wolfram.svg)
    - **ai-dial-adapter-openai**
       - Optional variable AUDIO_AZURE_API_VERSION which specifies api version for audio models. Default value is 2025-03-01-preview.
    - **ai-dial-adapter-bedrock**
       - Optional variable AWS_SESSION_TOKEN which allows you to specify alternative way to specify creds for adapter.
    - **admin-frontend**
       - Removed env variable - THEMES_CONFIG_IMAGES      
    - **admin-backend**
       - In additional attachments to release you can find the table listing the updated environment variables, highlighting the changes in naming conventions.



## Admin Backend changes table       
1. 

| Previous Variable Name                   | New Variable Name                                 | Description                                                                                           |
|------------------------------------------|---------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| SECURITY_ALLOWED_ROLES                   | providers.<your_provider_name>.allowed-roles      | Comma-separated list of roles with access permissions for the provider.                               |
| SECURITY_JWT_JWKS_URI                    | providers.<your_provider_name>.jwk-set-uri        | URI for JSON Web Key Set for the provider.                                                            |
| SECURITY_JWT_ACCEPTED_ISSUERS            | providers.<your_provider_name>.issuer             | List of accepted JWT token issuers for the provider.                                                  |
| SECURITY_JWT_ACCEPTED_ISSUERS_ALIAS      | providers.azure.aliases                           | Aliases for accepted JWT token issuers (only applicable for Azure provider).                          |
| DIAL_ADMIN_CLIENT_ID                     | Removed                                           | Previously used as a unique identifier for the DIAL Admin backend application.                        |
| SECURITY_JWT_ACCEPTED_AUDIENCES          | providers.azure.audiences                         | Unique identifier assigned to DIAL Admin backend application by the authentication provider.           |
| SECURITY_ROLES_CLAIM                     | providers.<your_provider_name>.role-claims        | JWT claim name for user roles for the provider.                                                       |

2. Support for Multiple Providers

The DIAL Admin application now supports the use of multiple authentication providers, allowing for greater flexibility and integration with various identity services. Below is an example configuration demonstrating how to set up multiple providers:

Example Configuration for multiple providers:


envs:

\&nbsp; providers.auth0.jwk-set-uri: "https://example-auth0.com/.well-known/jwks.json"

\&nbsp; providers.auth0.issuer: "https://example-auth0.com"

\&nbsp; providers.auth0.role-claims: "example\\\_roles"

\&nbsp; providers.auth0.audiences: "example-audience-id"



\&nbsp; providers.keycloak.jwk-set-uri: "https://example-keycloak.com/realms/Example/protocol/openid-connect/certs"

\&nbsp; providers.keycloak.issuer: "https://example-keycloak.com/realms/Example"

\&nbsp; providers.keycloak.role-claims: "example\\\_roles"

\&nbsp; providers.keycloak.audiences: "example-ui, example-admin"



\&nbsp; providers.azure.jwk-set-uri: "https://example.microsoft.com/common/discovery/v2.0/keys"

\&nbsp; providers.azure.issuer: "example-issuer-id"

\&nbsp; providers.azure.role-claims: "example\\\_groups"

\&nbsp; providers.azure.audiences: "example-audience-id"

\&nbsp; providers.azure.aliases: "login.microsoftonline.com, login.windows.net, login.microsoft.com, sts.windows.net, login.partner.microsoftonline.cn, login.chinacloudapi.cn, login.microsoftonline.de, login.microsoftonline.us, login.usgovcloudapi.net, login-us.microsoftonline.com"

\&nbsp; providers.azure.allowed-roles: "example-role-id"


## Release notes
