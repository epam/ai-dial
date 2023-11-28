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

|Parameter|Description|
|---------|-----------|
|NEXTAUTH_URL|Public URL of the application. When deploying to production, set the `NEXTAUTH_URL` environment variable to the canonical URL of your site.|
|NEXTAUTH_SECRET|A random string used as a ceed for authentication. Used to encrypt the NextAuth.js JWT, and to hash email verification tokens.|
|NEXT_PUBLIC_DEFAULT_TEMPERATURE|Default temperature settings in the range: [0 1]|
|NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT|The default system prompt.|
|NEXT_PUBLIC_APP_NAME | Public Application Name |
|OPENAI_API_HOST|AI DIAL back-end URL.|
|OPENAI_API_KEY|Open AI API Key.|
|OPENAI_API_VERSION|Version of the OpenAI API.|
|DEFAULT_MODEL|Default LLM.|
|ENABLED_FEATURES|A list of UI features.|
|NEXT_PUBLIC_APP_NAME|Application name.|
|AVAILABLE_MODELS_USERS_LIMITATIONS|Specify models and users that have access to them. Skip to allow all users to access all models.|
|AVAILABLE_ADDONS_USERS_LIMITATIONS|Specify Addons and users that have access to them. Skip to allow all users to access all Addons.|
|CLIENT_ID|You client id at auth provider.|
|TENANT_ID|You tenant id at auth provider.|
|SECRET|You secret at auth provider.|
|NAME|Display name in AI DIAL app.|
|HOST|Auth provider URL.|
|AUDIENCE|Your audience at auth provider.|

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

