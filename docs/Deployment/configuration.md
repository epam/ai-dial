# Configuration

> Refer to the provided [example of config](https://github.com/epam/ai-dial/tree/main/docs/Deployment/dialConfig.yaml), where you can find the description of the application-specific parameters.

The `dialConfig.yaml` configuration file of the AI DIAL application is comprised of several main sections:

* Standard parameters of helm chart. Refer to [Helm docs](https://helm.sh/).
* [Front-end parameters](#front-end-parameters): in `env` and `secrets` sections in config.
* [Back-end parameters](#back-end-parameters): in `proxy` section in the config.
* [Configuration of Adapters for models](#configuration-of-adapters). 

> **Important**: it is assumed that you have a working knowledge of standard Helm chart parameters in order to define them within the configuration file.

## Front-End Parameters

> Refer to the [AI DIAL Chat](https://github.com/epam/ai-dial-chat#environment-variables) to view a complete documentation.

Configure front-end parameters in the [`env`](https://github.com/epam/ai-dial/tree/main/docs/Deployment/dialConfig.yaml#L18) and [`secrets`](https://github.com/epam/ai-dial/tree/main/docs/Deployment/dialConfig.yaml#L30) sections of the config file:

> Note: for development we have some predefined variables located in `.env.development`

| Variable| Required| Description | Available Values| Default values   |
| ----- | -----| --------- | --------------------- | ---------------- |
| `OPENAI_API_HOST` | Yes   | OpenAI API Host   | Any string |  |
| `OPENAI_API_KEY`| Yes| OpenAI API Key       | Any string  |    |
| `OPENAI_API_VERSION`     | Yes       | OpenAI API Version  | Any string   |  |
| `APP_BASE_PATH`          | No  | Application base path  | Any string   |  |
| `APP_BASE_ORIGIN`        | Yes (if `APP_BASE_PATH` is set) | Application base origin | Any string   |  |
| `ALLOWED_IFRAME_ORIGINS` | No  | Allowed iFrame Origins | Any origin valid format.| none  |
| `IS_IFRAME`   | No  | Is iFrame   | `true`, `false`     | false |
| `ENABLED_FEATURES`       | No  | Enabled Features       |Refer to [Features](https://github.com/epam/ai-dial-chat/blob/release-0.2/src/types/features.ts)  |  |
| `NEXT_PUBLIC_APP_NAME`   | No  | Public Application Name | Any string   | AI Dial          |
| `NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT` | No  | Public Default System Prompt      | Any string   |  |
| `NEXT_PUBLIC_DEFAULT_TEMPERATURE`   | No  | Public Default Temperature        | 0 to 1       |  |
| `DEFAULT_MODEL`          | No  | Default Model          | Any string   | gpt-35-turbo     |
| `DEFAULT_ASSISTANT_SUB_MODEL`       | No  | Default Assistant Sub Model       | Any string   | gpt-4 |
| `RECENT_MODELS_IDS`      | No  | A list of IDs for recently used AI models.   | Any string   |  |
| `RECENT_ADDONS_IDS`      | No  | A list of IDs for recently used AI model addons.    | Any string   |  |
| `E2E_HOST`    | No  | The host URL for end-to-end testing. Refer to [E2E Tests](https://github.com/epam/ai-dial-chat/blob/release-0.2/e2e/README.md) to learn more. | Any string   |  |
| `PREVIEW_TEST_TOKEN`     | No  | A test token for e2e authentification. Refer to [E2E Tests](https://github.com/epam/ai-dial-chat/blob/release-0.2/e2e/README.md) to learn more.| Any string   |  |
| `TRACES_URL`  | No  | Traces URL  | Any string   |  |
| `TMS_URL`     | No  | TMS URL     | Any string   |  |
| `ISSUE_URL`   | No  | Issue URL   | Any string   |  |
| `THEMES_CONFIG_HOST`     | No  | The host URL for custom themes configuration. Refer to [Theme Configuration](https://github.com/epam/ai-dial-chat/blob/release-0.2/docs/THEME-CUSTOMIZATION.md) to learn more. | Any string   |  |
| `FOOTER_HTML_MESSAGE`    | No  | Footer HTML Message    | Any string   |  |
| `AZURE_FUNCTIONS_API_HOST`          | No  | Azure Functions API Host          | Any string   |  |
| `REPORT_ISSUE_CODE`      | No  | Report Issue Code used when sending report issue info to Azure Functions API Host    | Any string   |  |
| `REQUEST_API_KEY_CODE`   | No  | Request API Key Code used when sending request api key info to Azure Functions API Host     | Any string   |  |
| `CODE_GENERATION_WARNING` | No  | Warning text regarding code generation       | Any string   |  |
| `SHOW_TOKEN_SUB`         | No  | Show token sub in refresh login error logs   | `true`, `false`     | false |


The .env file contains environment variables that can be used to configure your app's settings and behavior. These values can be changed as needed to suit your specific requirements.

Also we have a lot of auth specific env variables:

| Variable       | Required  | Description      | Available Values | Default values |
| ------------------------- | -------------------- | ------------------------------------------------------------------- | ---------------- | -------------- |
| `AUTH_DISABLED` | No        | A flag to enable or disable authentication.   | `true`, `false`  | false          |
| `NEXTAUTH_URL` | Yes (for production) | NextAuth URL     | Any string       |     |
| `NEXTAUTH_SECRET`         | Yes       | NextAuth Secret (generate by `openssl rand -base64 32` for example) | Any string       |     |
| `AUTH_TEST_TOKEN`         | No        | Test Token       | Any string       |     |
| `AUTH_AUTH0_AUDIENCE`     | No        | Auth0 Audience   | Any string       |     |
| `AUTH_AUTH0_CLIENT_ID`    | No        | Auth0 Client ID  | Any string       |     |
| `AUTH_AUTH0_HOST`         | No        | Auth0 Host       | Any string       |     |
| `AUTH_AUTH0_NAME`         | No        | Auth0 Name       | Any string       |     |
| `AUTH_AUTH0_SECRET`       | No        | Auth0 Secret     | Any string       |     |
| `AUTH_AZURE_AD_CLIENT_ID` | No        | Azure AD Client ID          | Any string       |     |
| `AUTH_AZURE_AD_NAME`      | No        | Azure AD Name    | Any string       |     |
| `AUTH_AZURE_AD_SECRET`    | No        | Azure AD Secret  | Any string       |     |
| `AUTH_AZURE_AD_TENANT_ID` | No        | Azure AD Tenant ID          | Any string       |     |
| `AUTH_GITLAB_CLIENT_ID`   | No        | GitLab Client ID | Any string       |     |
| `AUTH_GITLAB_HOST`        | No        | GitLab Host      | Any string       |     |
| `AUTH_GITLAB_NAME`        | No        | GitLab Name      | Any string       |     |
| `AUTH_GITLAB_SECRET`      | No        | GitLab Secret    | Any string       |     |
| `AUTH_GOOGLE_CLIENT_ID`   | No        | Google Client ID | Any string       |     |
| `AUTH_GOOGLE_NAME`        | No        | Google Name      | Any string       |     |
| `AUTH_GOOGLE_SECRET`      | No        | Google Secret    | Any string       |     |
| `AUTH_KEYCLOAK_CLIENT_ID` | No        | Keycloak Client ID          | Any string       |     |
| `AUTH_KEYCLOAK_HOST`      | No        | Keycloak Host    | Any string       |     |
| `AUTH_KEYCLOAK_NAME`      | No        | Keycloak Name    | Any string       |     |
| `AUTH_KEYCLOAK_SECRET`    | No        | Keycloak Secret  | Any string       |     |
| `AUTH_PING_ID_CLIENT_ID`  | No        | PingID Client ID | Any string       |     |
| `AUTH_PING_ID_HOST`       | No        | PingID Host      | Any string       |     |
| `AUTH_PING_ID_NAME`       | No        | PingID Name      | Any string       |     |
| `AUTH_PING_ID_SECRET`     | No        | PingID Secret    | Any string       |     |

## Back-End Parameters

> Refer to the [AI DIAL Core](https://github.com/epam/ai-dial-core) to view a complete documentation.

Configure back-end parameters in the [`proxy`](https://github.com/epam/ai-dial/tree/main/docs/Deployment/dialConfig.yaml#L74) section of the config file.

You can provide dynamic or static configurations for the back-end. Provide path to the corresponding configuration in the `proxy.env` section.

Static settings are configured at application startup and do not change throughout the application lifecycle. 

Priority order of configurations:

* Environment variables with extra "proxy." prefix. E.g. "proxy.server.port", "proxy.config.files".
* File specified in "PROXY_SETTINGS" environment variable.
* Default resource file: src/main/resources/proxy.settings.json.

|Parameter|Default Value|Description|
|---------|-----------|-------------|
|config.files|proxy.config.json |Config files with parts of the whole config.|
|config.reload|60000|Config reload interval in milliseconds.|
|identityProvider.jwksUrl|-|URL to the jwks provider.|
|identityProvider.appName|dial|App name to search in "resource_access" claim of JWT token to check access for deployments.|
|identityProvider.loggingKey|-|User information to search in claims of JWT token.|
|identityProvider.loggingSalt|-|Salt to hash user information for logging.|
|identityProvider.cacheSize|10|How many JWT tokens to cache.|
|identityProvider.cacheExpiration|10|How long to retain JWT tokens in cache.|
|identityProvider.cacheExpirationUnit|MINUTES|Unit of cache expiration.|

This file includes standard [Vertex library configurations](https://cloud.google.com/vertex-ai/docs/start/client-libraries).

**Dynamic** settings are defined in the `proxy.config.json` file by default. You can override settings in this file by configuring static settings.

### proxy.config.json parameters

> Refer to the [confuration file](https://github.com/epam/ai-dial/tree/main/docs/Deployment/dialConfig.yaml#L112) to view an example.

|Parameter|Description|
|---------|-----------|
|routes|Path(s)  Paths to route to specific upstreams or to respond with configured body.|
|route-rate|Parameters for vote endpoint.|
|applications|A list of deployed AI DIAL Applications and their parameters:<br />`endpoint`: AI DIAL Application API for chat completions.<br />`iconUrl`: a path to the icon used for the AI DIAL Application on the UI.<br />`description`: a brief description of the AI DIAL Application rendered on the UI.<br />`displayName`: a name of the AI DIAL Application used on the UI.|
|models|A list of deployed models and their parameters:<br />`type`: specify `chat` or `embedding` model type.<br />`iconUrl`: a path to the icon used for the model on the UI.<br />`description`: a brief description of the model rendered on the UI.<br />`displayName`: a name of the model rendered on the UI.<br />`endpoint`: model API for chat completions or embeddings.<br />`upstreams`: upstreams are used for load-balancing. A request will be sent to the configured model endpoint and will contain X-UPSTREAM-ENDPOINT and X-UPSTREAM-KEY headers:<br />`endpoint`: model endpoint.<br />`key`: your API key.|
|keys|API Keys parameters:<br />`<proxyKey>`: your API key.<br />`project`: a project name this key is assigned to.<br />`role`: name of one of the configured roles. Defines permissions for the key.<br />`userAuth`: can be disabled/enabled/optional.<br />**Disabled** - Authorization header is ignored and not sent to upstream.<br />**Enabled** - Authorization header is required and sent to upstream. Optional - Authorization header is optional and sent to upstream if present.|
|roles|A list of configured roles with their limitations. Specify a role name and in limits, specify models (can be models, Applications, Addons, Assistants) and limitation configurations:<br />`minute`: the total tokens per minute limit that can be sent to the model is managed using a floating window approach. This technique ensures a well-distributed rate-limiting mechanism, allowing control over the number of tokens sent to the model within a defined time frame, typically a one-minute window.<br />`day`: the total tokens per day limit that can be sent to the model is managed using a floating window approach. This method ensures a balanced rate-limiting mechanism, allowing control over the number of tokens sent to the model within a specified time frame, typically a 24-hour window.<br />Refer to [Roles Management](/docs/tutorials/roles-management.md) to learn more.|

## Configuration of Adapters 

To work with Azure, AWS or GCP models we use applications called Adapters. You can configure Adapters in the configuration file.

Refer to these repositories to view a complete documentation for: 

* [Adapter for Bedrock](https://github.com/epam/ai-dial-adapter-bedrock)
* [Adapter for Vertex](https://github.com/epam/ai-dial-adapter-vertexai)
* [Adapter for OpenAI](https://github.com/epam/ai-dial-adapter-openai)

> Refer to the provided [example of config](https://github.com/epam/ai-dial/tree/main/docs/Deployment/dialConfig.yaml#L263) to view configuration examples. 

