# Observability and Monitoring

AI DIAL components provide the following types of monitoring/observability:

- Logs ([Container logs](#container-logs) or [OTel](#opentelemetry))
- Metrics ([Prometheus](#prometheus) or [OTel](#opentelemetry))
- Traces ([OTel](#opentelemetry))

<div class="docusaurus-ignore">

<!-- omit from toc -->
# Table of Contents
- [Container Logs](#container-logs)
  - [AI DIAL Configuration](#ai-dial-configuration)
    - [Chat](#chat)
    - [Core](#core)
    - [Bedrock Adapter](#bedrock-adapter)
    - [Vertex Adapter](#vertex-adapter)
    - [OpenAI Adapter](#openai-adapter)
    - [DIAL Adapter](#dial-adapter)
- [Prometheus](#prometheus)
  - [Configure AI DIAL Components](#configure-ai-dial-components)
  - [Configure DIAL Helm Charts](#configure-dial-helm-charts)
- [OpenTelemetry](#opentelemetry)
  - [AI DIAL Configuration](#ai-dial-configuration-1)
    - [Python Components](#python-components)
    - [Node.js Components](#nodejs-components)
  
</div>

## Container Logs

Unix and Linux commands typically open three I/O streams when they run, called STDIN, STDOUT, and STDERR. 

* STDIN is the command's input stream, which may include input from the keyboard or input from another command. 
* STDOUT is usually a command's normal output.
* STDERR is typically used to output error messages.

AI DIAL components by default use this approach for outputting system logs.

### AI DIAL Configuration

#### Chat

AI DIAL supports OpenTelemetry (OTEL) methods to enhance observability by providing powerful metrics for collection and tracing capabilities, enabling deeper insights into system performance and behavior.

All environment variables you can find in the official OpenTelemetry Collector Logs Exporter for web and node with HTTP [documentation](https://www.npmjs.com/package/@opentelemetry/exporter-logs-otlp-http).

```yaml
OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: #The endpoint to send logs to. By default https://localhost:4318/v1/logs will be used. v1/logs will not be appended automatically and has to be added explicitly.
OTEL_EXPORTER_OTLP_LOGS_TIMEOUT: #The maximum waiting time, in milliseconds, allowed to send each OTLP log batch. Default is 10000.
```

AI DIAL supports OpenTelemetry SDK for Node.js. All environment variables you can find in the official OpenTelemetry SDK for Node.js [documentation](https://www.npmjs.com/package/@opentelemetry/sdk-node).

```yaml
OTEL_SDK_DISABLED: #Disable the SDK by setting the OTEL_SDK_DISABLED environment variable to `true`
OTEL_LOG_LEVEL: #Log level used by the SDK logger.` Values: `TRACE, DEBUG, INFO, WARN, ERROR, FATAL`. Use `DEBUG` for dev purposes and INFO in prod. It is strongly recommended not to use the logging level `DEBUG` for prod purposes.
```

#### Core

[DIAL Core](https://github.com/epam/ai-dial-core) is the main component of AI DIAL, which provides [Unified API](https://epam-rail.com/dial_api) to different chat completion and embedding models, assistants, and applications.

These environment variables you can use to configure logging:

```yaml
AIDIAL_LOG_FILE: #Place when the log file should be stored.
AIDIAL_LOG_LEVEL: #The logging levels used are ERROR, WARN, INFO, DEBUG, and TRACE.
```

#### Bedrock Adapter

[AI DIAL Bedrock Adapter](https://github.com/epam/ai-dial-adapter-bedrock) implements AI DIAL API for language models from AWS Bedrock.

These environment variables you can use to configure logging:

```yaml
LOG_LEVEL: #Level filter for the Adapter logger. Values: `TRACE, DEBUG, INFO, WARN, ERROR, FATAL`. Use `DEBUG` for dev purposes and INFO in prod. It is strongly recommended not to use the logging level `DEBUG` for prod purposes.
AIDIAL_LOG_LEVEL: #AI DIAL SDK Level filter for the LLM and response logging. Values: `TRACE, DEBUG, INFO, WARNING, ERROR, FATAL`.
```

#### Vertex Adapter

[AI DIAL Vertex AI Adapter](https://github.com/epam/ai-dial-adapter-vertexai) implements AI DIAL API for language models and embeddings from Vertex AI.

These environment variables you can use to configure logging:

```yaml
LOG_LEVEL: #Level filter for the Adapter logger. Values: `TRACE, DEBUG, INFO, WARN, ERROR, FATAL`. Use `DEBUG` for dev purposes and INFO in prod. It is strongly recommended not to use the logging level `DEBUG` for prod purposes.
AIDIAL_LOG_LEVEL: #AI DIAL SDK Level filter for the LLM and response logging. Values: `TRACE, DEBUG, INFO, WARNING, ERROR, FATAL`.
```

#### OpenAI Adapter

[AI DIAL OpenAI Adapter](https://github.com/epam/ai-dial-adapter-openai) implements AI DIAL API for language models from Azure OpenAI.

These environment variables you can use to configure logging:

```yaml
LOG_LEVEL: #Level filter for the Adapter logger. Values: `TRACE, DEBUG, INFO, WARN, ERROR, FATAL`. Use `DEBUG` for dev purposes and INFO in prod. It is strongly recommended not to use the logging level `DEBUG` for prod purposes.
```

#### DIAL Adapter

[DIAL Adapter](https://github.com/epam/ai-dial-adapter-dial) adapts calls from one DIAL Core to calls to another DIAL Core.

These environment variables you can use to configure logging:

```yaml
LOG_LEVEL: #Level filter for the Adapter logger. Values: `TRACE, DEBUG, INFO, WARN, ERROR, FATAL`. Use `DEBUG` for dev purposes and INFO in prod. It is strongly recommended not to use the logging level `DEBUG` for prod purposes.
```

## Prometheus

[Prometheus](https://prometheus.io/) is an open-source monitoring and alerting toolkit designed for reliability and scalability. It collects metrics from configured targets at specified intervals, stores them in a time-series database, and provides powerful querying capabilities. With its flexible architecture, Prometheus is particularly suited for dynamic environments, making it a popular choice for cloud-native applications and microservices. Its intuitive visualization tools help to gain deep insights into system performance, ensuring timely detection of issues.

[Prometheus Operator](https://prometheus-operator.dev/) manages Prometheus clusters atop Kubernetes.

### Configure AI DIAL Components

By default, AI DIAL components have metrics enabled in Prometheus format on port **9464**.

### Configure DIAL Helm Charts

Add the following helm values to AI DIAL Helm. Refer to [AI DIAL Helm](https://github.com/epam/ai-dial-helm/tree/main/charts/dial) to learn more.

```yaml
<component>:
  metrics:
    enabled: true 
    serviceMonitor:
      enabled: true # when using the Prometheus Operator
```
The default port for collecting metrics in AI DIAL components is 9464. You can change the parameter `<component>.containerPorts.metrics` to change the default port.

## OpenTelemetry

[OpenTelemetry](https://opentelemetry.io/) is an open-source observability framework designed to standardize the collection of telemetry data across distributed systems. By providing a unified set of APIs, libraries, and agents, it enables developers to capture traces, metrics, and logs from their applications seamlessly. OpenTelemetry simplifies the monitoring process and enhances visibility into application performance and reliability, making it easier to troubleshoot issues and optimize systems in real-time.

AI DIAL supports OpenTelemetry (OTEL) methods to enhance observability by providing powerful metrics for collection and tracing capabilities, enabling deeper insights into system performance and behavior.

### AI DIAL Configuration

All environment variables you can find in the official OpenTelemetry [documentation](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/).

#### Python Components

All standard python environment variables you can find in the official OpenTelemetry [documentation](https://opentelemetry-python-contrib.readthedocs.io/en/latest/instrumentation/logging/logging.html). 

* If the value for **OTEL_METRICS_EXPORTER** is not set, the [OpenTelemetry Prometheus Metric Exporter](https://www.npmjs.com/package/@opentelemetry/exporter-prometheus) will be used. 
* If its value is set to `"otlp"`, the [OpenTelemetry Collector Metrics Exporter for Web and Node](https://www.npmjs.com/package/@opentelemetry/exporter-metrics-otlp-http) will be used.

Example configuration of OpenTelemetry:

```yaml
  OTEL_RESOURCE_ATTRIBUTES: "service.name=<service_name>" # Key-value pairs to be used as resource attributes
  OTEL_EXPORTER_OTLP_ENDPOINT: "<otlp_endpoint_url>" # OTEL endpoint URL
  OTEL_LOGS_EXPORTER: "otlp" # logs exporter to be used
  OTEL_METRICS_EXPORTER: "otlp|otlp,prometheus" # metrics exporter to be used
  OTEL_TRACES_EXPORTER: "otlp" # trace exporter to be used
  OTEL_PYTHON_LOG_CORRELATION: "true|false" # enable trace context injection
  OTEL_PYTHON_FASTAPI_EXCLUDED_URLS: "<exclude_url>" # to exclude certain URLs from tracking
```

#### Node.js Components

* If the value for **OTEL_METRICS_EXPORTER** is not set, the [OpenTelemetry Prometheus Metric Exporter](https://www.npmjs.com/package/@opentelemetry/exporter-prometheus) will be used. 
* If its value is set to `"otlp"`, the [OpenTelemetry Collector Metrics Exporter for Web and Node](https://www.npmjs.com/package/@opentelemetry/exporter-metrics-otlp-http) will be used.

Example configuration of OpenTelemetry:

```yaml
  OTEL_SERVICE_NAME: "<service_name>" # Key-value pairs to be used as resource attributes
  OTEL_EXPORTER_OTLP_ENDPOINT: "<otlp_endpoint_url>" # OTEL endpoint URL
  OTEL_LOGS_EXPORTER: "otlp" # logs exporter to be used
  OTEL_METRICS_EXPORTER: "otlp|otlp,prometheus" # metrics exporter to be used
```