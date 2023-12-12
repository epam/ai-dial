# Configuration

> Refer to [AI DIAL Generic Installation Simple Guide](https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple), to view a basic AI DIAL installation guide.

The configuration of AI DIAL includes several main sections:

* [Core parameters](#core-parameters)
* [Chat parameters](#chat-parameters)
* [Chat Themes parameters](#themes-parameters)
* [Configuration of Adapters](#adapters-parameters)
* [Configuration of Assistant](#assistant-parameters)

> **Important**: it is assumed that you have a working knowledge of standard Helm chart parameters in order to define them within the configuration file.

## Core Parameters

> Refer to the [AI DIAL Core](https://github.com/epam/ai-dial-core) to view a complete documentation.

Configure Core parameters in the [`core`](https://github.com/epam/ai-dial-helm/blob/8a2d6ebe301965ef0e4f06bc5f6e47aadc7b597f/charts/dial/examples/generic/simple/values.yaml#L1) section of the config file.

You can provide **dynamic** and **static** settings for the AI DIAL Core:

* Static settings are used on startup and cannot be changed while application is running. Refer to [Static settings](https://github.com/epam/ai-dial-core#static-settings) to learn more.
* Dynamic settings are stored in JSON files, specified via [config.files](https://github.com/epam/ai-dial-helm/blob/8a2d6ebe301965ef0e4f06bc5f6e47aadc7b597f/charts/dial/examples/generic/simple/values.yaml#L6C3-L6C6) static setting, and reloaded at interval, specified via "config.reload" static setting. Refer to [Dynamic settings](https://github.com/epam/ai-dial-core#dynamic-settings) to learn more.

### Some of the dynamic parameters

|Parameter|Description|
|---------|-----------|
|routes|Path(s)  Paths to route to specific upstreams or to respond with configured body.|
|route-rate|Parameters for vote endpoint.|
|applications|A list of deployed AI DIAL Applications and their parameters:<br />`endpoint`: AI DIAL Application API for chat completions.<br />`iconUrl`: a path to the icon used for the AI DIAL Application on the UI.<br />`description`: a brief description of the AI DIAL Application rendered on the UI.<br />`displayName`: a name of the AI DIAL Application used on the UI.|
|models|A list of deployed models and their parameters:<br />`type`: specify `chat` or `embedding` model type.<br />`iconUrl`: a path to the icon used for the model on the UI.<br />`description`: a brief description of the model rendered on the UI.<br />`displayName`: a name of the model rendered on the UI.<br />`endpoint`: model API for chat completions or embeddings.<br />`upstreams`: upstreams are used for load-balancing. A request will be sent to the configured model endpoint and will contain X-UPSTREAM-ENDPOINT and X-UPSTREAM-KEY headers:<br />`endpoint`: model endpoint.<br />`key`: your API key.|
|keys|API Keys parameters:<br />`<proxyKey>`: your API key.<br />`project`: a project name this key is assigned to.<br />`role`: name of one of the configured roles. Defines permissions for the key.<br />`userAuth`: can be disabled/enabled/optional.<br />**Disabled** - Authorization header is ignored and not sent to upstream.<br />**Enabled** - Authorization header is required and sent to upstream. Optional - Authorization header is optional and sent to upstream if present.|
|roles|A list of configured roles with their limitations. Specify a role name and in limits, specify models (can be models, Applications, Addons, Assistants) and limitation configurations:<br />`minute`: the total tokens per minute limit that can be sent to the model is managed using a floating window approach. This technique ensures a well-distributed rate-limiting mechanism, allowing control over the number of tokens sent to the model within a defined time frame, typically a one-minute window.<br />`day`: the total tokens per day limit that can be sent to the model is managed using a floating window approach. This method ensures a balanced rate-limiting mechanism, allowing control over the number of tokens sent to the model within a specified time frame, typically a 24-hour window.<br />Refer to [Roles Management](/docs/tutorials/roles-management.md) to learn more.|

## Chat Parameters

> Refer to the [AI DIAL Chat](https://github.com/epam/ai-dial-chat) to view a complete documentation.

Configure Chat parameters in the [`chat`](https://github.com/epam/ai-dial-helm/blob/8a2d6ebe301965ef0e4f06bc5f6e47aadc7b597f/charts/dial/examples/generic/simple/values.yaml#L63) section of the config file.

## Themes Parameters

> Refer to the [AI DIAL Chat Themes](https://github.com/epam/ai-dial-chat-themes) to view a complete documentation.

Configure Themes parameters in the [`themes`](https://github.com/epam/ai-dial-helm/blob/8a2d6ebe301965ef0e4f06bc5f6e47aadc7b597f/charts/dial/examples/generic/simple/values.yaml#L98) section of the config file.

## Adapters Parameters

To work with Azure, AWS or GCP models we use applications called Adapters. You can configure Adapters in the [AI DIAL Config](https://github.com/epam/ai-dial-helm/blob/8a2d6ebe301965ef0e4f06bc5f6e47aadc7b597f/charts/dial/examples/generic/simple/values.yaml#L114).

Refer to these repositories to view a complete documentation for:

* [Adapter for Bedrock](https://github.com/epam/ai-dial-adapter-bedrock)
* [Adapter for Vertex](https://github.com/epam/ai-dial-adapter-vertexai). Refer to [Vertex Model Deployment](./Vertex%20Model%20Deployment.md#step-3-configure-ai-dial-adapter) to view the configuration example.
* [Adapter for OpenAI](https://github.com/epam/ai-dial-adapter-openai)

```yaml
### examples of basic configurations of adapters ###

### ai-dial-adapter-openai configuration ###
openai:
  # -- Enable/disable ai-dial-adapter-openai
  enabled: false
  commonLabels:
    app.kubernetes.io/component: "adapter"
  image:
    repository: epam/ai-dial-adapter-openai
    tag: 0.2.0

### ai-dial-adapter-bedrock configuration ###
bedrock:
  # -- Enable/disable ai-dial-adapter-bedrock
  enabled: false
  commonLabels:
    app.kubernetes.io/component: "adapter"
  image:
    repository: epam/ai-dial-adapter-bedrock
    tag: 0.2.0
  secrets:
    {}
    # DEFAULT_REGION: "us-east-1"
    # AWS_ACCESS_KEY_ID: ""
    # AWS_SECRET_ACCESS_KEY: ""

### ai-dial-adapter-vertexai configuration ###
vertexai:
  # -- Enable/disable ai-dial-adapter-vertexai
  enabled: false
  commonLabels:
    app.kubernetes.io/component: "adapter"
  image:
    repository: epam/ai-dial-adapter-vertexai
    tag: 0.2.0
```

## Assistant Parameters

You can add AI DIAL Assistant settings in the `assistant` section of the AI DIAL configuration file. 

> Refer to the [AI DIAL Assistant](https://github.com/epam/ai-dial-assistant) to view a complete documentation.

```yaml
### example of a basic ai-dial-assistant configuration ###
assistant:
  # -- Enable/disable ai-dial-assistant
  enabled: false
  commonLabels:
    app.kubernetes.io/component: "application"
  image:
    repository: epam/ai-dial-assistant
    tag: 0.2.3
  # env:
  #   OPENAI_API_BASE: ""
```
