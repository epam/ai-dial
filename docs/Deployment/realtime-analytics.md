# Analytics

## Introduction

[DIAL Core](https://github.com/epam/ai-dial-core) collects **system logs** and **chat completion logs**:

* System logs do not include any user data and contain logs of all requests from system components to AI DIAL Core (using the ELK stack (Elasticsearch, Logstash, Kibana) or other log collection system). **Note**: system logs is out of scope of this document!
* [chat completion requests](https://epam-rail.com/dial_api#/paths/~1openai~1deployments~1%7BDeployment%20Name%7D~1chat~1completions/post) logs include information users send in their requests to LLMs and the information they get in responses.

[AI DIAL setup](../architecture#full-platform-landscape) can include a special tool called DIAL Analytics Realtime, which uses diverse techniques such as embedding algorithms, clustering algorithms, frameworks, light-weight self-hosted language models, to analyze **chat completion logs** and extract the needed information, which can be presented in tools such as Grafana for visualization and analytics.

> Refer to [Analytics Realtime](https://github.com/epam/ai-dial-analytics-realtime) repository to learn more and view the project source code.

Analytics Realtime tool is a sink of [vector.dev](https://vector.dev/). It does not retain any private information, such as user prompts or conversations, beyond the system. Instead, only the computed artifacts are collected and stored in time-series databases like InfluxDB or any scalable database capable of handling voluminous, constantly changing information.

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

This section outlines the required steps for configuring Analytics Realtime service.

- Step 1: Configure [DIAL Core](https://github.com/epam/ai-dial-core)
- Step 2: Install [Influx DB](https://github.com/influxdata/influxdb)
- Step 3: Configure [DIAL Analytics Realtime](https://github.com/epam/ai-dial-analytics-realtime)
- Step 4: Configure [Prompt Log Collector](https://github.com/vectordotdev/vector)
- Step 5: Configure [Grafana](https://github.com/grafana/grafana)

**Flow:**

AI DIAL Core generates a `.log` file containing chat completion logs, which is stored in InfluxDB. The log collector tool then transfers this file to AI DIAL Analytics Realtime for analysis. The insights derived from the analysis can subsequently be visualized using Grafana.

### Step 1: AI DIAL Core

AI DIAL Core can be configured to write chat completion logs into a specific `.log` file. 

Use the default AI DIAL Core [Gflog Configuration](https://github.com/epam/ai-dial-core/blob/development/src/main/resources/gflog.xml) as reference.

### Step 2: Influx DB

`.log` file is stored in InfluxDB.

Refer to InfluxDB documentation to learn how to [install](https://docs.influxdata.com/influxdb/v2/install/) it and how to [create tokens](https://docs.influxdata.com/influxdb/v2/admin/tokens/create-token/) to read from a bucket.

> Refer to [Configuration](https://github.com/epam/ai-dial-analytics-realtime?tab=readme-ov-file#configuration) to view how to configure InfluxDB for Analytics Realtime service.

### Step 3: AI DIAL Analytics Realtime

Follow the [instructions](https://github.com/epam/ai-dial-analytics-realtime/blob/development/README.md) to setup AI DIAL Analytics Realtime service.

### Step 4: Prompt Log Collector

By default, AI DIAL Core uses the external open-source solution [vector.dev](https://vector.dev/) as a log collector to send **chat completion logs** to AI DIAL Analytics Realtime via HTTP. It can also be used to send it to storages such as AWS S3, Azure Blob Store, GCP Cloud Storage or any other "sink".

> You can find more details on delivering observability data to an HTTP server in the vector.dev [documentation](https://vector.dev/docs/reference/configuration/sinks/http).

This is the example of vector.dev configuration: 

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

> Refer to Grafana documentation to learn how to [install](https://grafana.com/docs/grafana/latest/setup-grafana/installation/) it and to [import dashboards](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/import-dashboards/). 

> Refer to Analytics Realtime repository to view samples of [dashboards](https://github.com/epam/ai-dial-analytics-realtime/blob/development/dashboards/README.md).
