# Analytics

## Introduction

[DIAL Core](https://github.com/epam/ai-dial-core) collects **system logs** and **chat completion logs**:

* System logs do not include any user data and contain logs of all requests from system components to AI DIAL Core (using the ELK stack (Elasticsearch, Logstash, Kibana) or other log collection system). **Note**: this document does not cover system logs.
* [Chat completion requests](https://epam-rail.com/dial_api#/paths/~1openai~1deployments~1%7BDeployment%20Name%7D~1chat~1completions/post) logs include information that users send in their requests to LLMs and the information they get in responses.

[AI DIAL setup](../architecture#full-platform-landscape) can include a special service called DIAL Analytics Realtime, which uses diverse techniques such as embedding algorithms, clustering algorithms, frameworks, light-weight self-hosted language models, to analyze **chat completion logs** and extract the needed information, which can be presented in tools such as Grafana for visualization and analytics.

> Refer to [Analytics Realtime](https://github.com/epam/ai-dial-analytics-realtime) repository to learn more and view the project source code.

Analytics Realtime does not retain any private information, such as user prompts or conversations, beyond the system. Instead, only the computed artifacts are collected and stored in time-series databases like InfluxDB or any scalable database capable of handling voluminous, constantly changing information.

Examples of the computed artifacts:

* Who has used the AI? – user hash, title, and never personal data such as names.
* What areas have people asked questions about?
* Are there any recurring patterns?
* Topics of conversations.
* Unique users.
* Sentiments.
* Cost analysis of the communication.
* Language of conversations.
* Any other calculated statistics based on conversations.

## Configuration

This section outlines the required steps for configuring Analytics Realtime service and other necessary components:

- Step 1: Configure [DIAL Core](https://github.com/epam/ai-dial-core)
- Step 2: Install [Influx DB](https://github.com/influxdata/influxdb)
- Step 3: Configure [DIAL Analytics Realtime](https://github.com/epam/ai-dial-analytics-realtime)
- Step 4: Configure [Log Collector](https://github.com/vectordotdev/vector)
- Step 5: Configure [Grafana](https://github.com/grafana/grafana)

**Flow:**

AI DIAL Core generates a `.log` file containing chat completion logs. A log collector tool then transfers this file to AI DIAL Analytics Realtime for analysis. The insights derived from the analysis are stored in InfluxDB and can subsequently be visualized using Grafana.

### Step 1: AI DIAL Core

AI DIAL Core can be configured to write chat completion logs into a specific `.log` file. 

Use the default AI DIAL Core [Gflog Configuration](https://github.com/epam/ai-dial-core/blob/development/src/main/resources/gflog.xml) as reference.

### Step 2: Influx DB

Analytics Realtime uses InfluxDB to store the analytics of chat completion logs. Refer to InfluxDB documentation to learn how to [install](https://docs.influxdata.com/influxdb/v2/install/) it and how to [create tokens](https://docs.influxdata.com/influxdb/v2/admin/tokens/create-token/) to read from a bucket.

> Refer to [Configuration](https://github.com/epam/ai-dial-analytics-realtime?tab=readme-ov-file#configuration) to view how to configure InfluxDB for Analytics Realtime service.

### Step 3: AI DIAL Analytics Realtime

Follow the [instructions](https://github.com/epam/ai-dial-analytics-realtime/blob/development/README.md) to setup AI DIAL Analytics Realtime service.

### Step 4: Log Collector

AI DIAL uses the external open-source solution [Vector](https://github.com/vectordotdev/vector) as a log collector to transfer a `.log` file with **chat completion logs** to AI DIAL Analytics Realtime service via HTTP. Analytics Realtime functions as a "sink" for Vector, providing an endpoint designed to receive logs from it. To connect, you only need to know the hostname and port, such as http://localhost:5001/data - see the example below.

> You can find an additional information on delivering observability data to an HTTP server in the Vector [documentation](https://vector.dev/docs/reference/configuration/sinks/http).

This is an example of Vector configuration: 

```yaml
sources:
  aidial_logs:
    type: "file"
    max_line_bytes: 100000000
    oldest_first: true
    include:
      - /app/log/*.log # file with chat completion logs
  http_analytics_opensource:
    inputs:
      - aidial_logs
    type: http
    uri: http://dial-analytics.dial:80/data # Analytics Realtime URI
    request:
      timeout_secs: 300
    batch:
      max_bytes: 1049000
      timeout_secs: 60
    encoding:
      codec: "json"
```

### Step 5: Grafana

Grafana can be [configured](https://grafana.com/docs/grafana/latest/datasources/influxdb/#influxdb-data-source) to use InfluxDB with analytics of DIAL logs as a data source. You can use pre-configured samples of [dashboards](https://github.com/epam/ai-dial-analytics-realtime/blob/development/dashboards/README.md) to visualize data in Grafana.

> Refer to Grafana documentation to learn how to [install](https://grafana.com/docs/grafana/latest/setup-grafana/installation/) it and [import dashboards](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/import-dashboards/). 

![](img/grafana.png)