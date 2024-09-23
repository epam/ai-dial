# Overview

AI DIAL applications provide the following types of monitoring/observability:
- Logs ([Container logs](#container-logs) or [OTel](#opentelemetry))
- Metrics ([Prometheus](#Prometheus) or [OTel](#opentelemetry))
- Traces ([OTel](#opentelemetry))

<div class="docusaurus-ignore">

<!-- omit from toc -->
## Table of Contents

- [Overview](#overview)
  - [Container logs](#container-logs)
    - [Configuration AI DIAL](#configuration-ai-dial)
      - [Configure python components](#configure-python-components)
      - [Configure AI DIAL Chat](#configure-ai-dial-chat)
      - [Configure AI DIAL Core](#configure-ai-dial-core)
  - [Prometheus](#prometheus)
    - [Configuration AI DIAL components](#configuration-ai-dial-components)
    - [Configuration DIAL helm charts](#configuration-dial-helm-charts)
  - [OpenTelemetry](#opentelemetry)
    - [Configuration AI DIAL](#configuration-ai-dial-1)
      - [Configure python components](#configure-python-components-1)
      - [Configure nodejs components](#configure-nodejs-components)
  
</div>

## Container logs

Unix and Linux commands typically open three I/O streams when they run, called STDIN, STDOUT, and STDERR. STDIN is the command's input stream, which may include input from the keyboard or input from another command. STDOUT is usually a command's normal output, and STDERR is typically used to output error messages.
AI DIAL applications by default use this approach for outputting system logs.

### Configuration AI DIAL

ToDO: add parameters for logging

#### Configure python components

LOG_LEVEL 

#### Configure AI DIAL Chat

???

#### Configure AI DIAL Core

AIDIAL_LOG_LEVEL - Level filter. Values: TRACE, DEBUG, INFO, WARN, ERROR, FATAL.

## Prometheus

[Prometheus](https://prometheus.io/) is an open-source monitoring and alerting toolkit designed for reliability and scalability. It collects metrics from configured targets at specified intervals, stores them in a time-series database, and provides powerful querying capabilities. With its flexible architecture, Prometheus is particularly suited for dynamic environments, making it a popular choice for cloud-native applications and microservices. Its intuitive visualization tools help teams gain deep insights into system performance, ensuring timely detection of issues.

[Prometheus operator](https://prometheus-operator.dev/) The Prometheus Operator manages Prometheus clusters atop Kubernetes.

### Configuration AI DIAL components

By default, AI Dial applications have metrics enabled in Prometheus format on port 9464.

### Configuration DIAL helm charts

Add the following helm values to AI DIAL Helm. Refer to [AI DIAL](https://github.com/epam/ai-dial-helm/tree/main/charts/dial) to learn more.

  ```yaml
  <component>:
    metrics:
      enabled: true 
      serviceMonitor:
        enabled: true # when using the Prometheus Operator
  ```
The default port for collecting metrics in most dial applications is 9464. If necessary, you can change the parameter `<component>.containerPorts.metrics`

## OpenTelemetry

[OpenTelemetry](https://opentelemetry.io/) is an open-source observability framework designed to standardize the collection of telemetry data across distributed systems. By providing a unified set of APIs, libraries, and agents, it enables developers to capture traces, metrics, and logs from their applications seamlessly. OpenTelemetry simplifies the monitoring process and enhances visibility into application performance and reliability, making it easier to troubleshoot issues and optimize systems in real-time.

AI DIAL supports OpenTelemetry (OTEL) methods enhance observability by providing powerful metrics collection and tracing capabilities, enabling deeper insights into system performance and behavior.

### Configuration AI DIAL

All environment env variables you could find in the official [opentelemetry documentation](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/).

#### Configure python components

All standard python environment variables you could find in the official opentelemetry [documentation](https://opentelemetry-python-contrib.readthedocs.io/en/latest/instrumentation/logging/logging.html). If no value set for the **OTEL_METRICS_EXPORTER** then OpenTelemetry Prometheus Metric Exporter will be used. If value set to "otlp" the OpenTelemetry Collector Metrics Exporter for web and node will be used.

Example for the configuration of Opentelemetry:

```yaml
  OTEL_RESOURCE_ATTRIBUTES: "service.name=<service_name>" # Key-value pairs to be used as resource attributes
  OTEL_EXPORTER_OTLP_ENDPOINT: "<otlp_endpoint_url>" # OTEL endpoint URL
  OTEL_LOGS_EXPORTER: "otlp" # logs exporter to be used
  OTEL_METRICS_EXPORTER: "otlp|otlp,prometheus" # metrics exporter to be used
  OTEL_TRACES_EXPORTER: "otlp" # trace exporter to be used
  OTEL_PYTHON_LOG_CORRELATION: "true|false" # enable trace context injection
  OTEL_PYTHON_FASTAPI_EXCLUDED_URLS: "<exclude_url>" # to exclude certain URLs from tracking
```

#### Configure nodejs components

If no value set for the **OTEL_METRICS_EXPORTER** then [OpenTelemetry Prometheus Metric Exporter](https://www.npmjs.com/package/@opentelemetry/exporter-prometheus) will be used. If value set to _"otlp"_ the [OpenTelemetry Collector Metrics Exporter for web and node](https://www.npmjs.com/package/@opentelemetry/exporter-metrics-otlp-http) will be used.

Example for the configuration of Opentelemetry:

```yaml
  OTEL_SERVICE_NAME: "<service_name>" # Key-value pairs to be used as resource attributes
  OTEL_EXPORTER_OTLP_ENDPOINT: "<otlp_endpoint_url>" # OTEL endpoint URL
  OTEL_LOGS_EXPORTER: "otlp" # logs exporter to be used
  OTEL_METRICS_EXPORTER: "otlp|otlp,prometheus" # metrics exporter to be used
```