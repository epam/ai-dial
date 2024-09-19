## Overview

AI DIAL Analytics Realtime is a service that gathers prompt logs from [DIAL Core](https://github.com/epam/ai-dial-core) and publishes them to InfluxDB.
The logs of prompts are the data a user provides to LLM and the responses the LLM gives to the user. A user can access analytical data through pre-set Grafana dashboards.

**TODO**
Update AI DIAL Analytics Realtime [README](https://github.com/epam/ai-dial-analytics-realtime/blob/development/README.md) with a link to this document.

## Pre-requisites

- [DIAL Core](https://github.com/epam/ai-dial-core)
- [Prompt Log Collector](https://github.com/vectordotdev/vector)
- [DIAL Analytics Realtime](https://github.com/epam/ai-dial-analytics-realtime)
- [Influx DB](https://github.com/influxdata/influxdb)
- [Grafana](https://github.com/grafana/grafana)

### DIAL Core

Follow the instructions in [AI DIAL Core](https://github.com/epam/ai-dial-core/blob/development/README.md) to learn how to configure Analytics Realtime for AI DIAL Core.

**TODO**
- Describe gflog.xml

### Prompt Log Collector
By default, AI Dial platform uses the external open-source solution [Vector](https://vector.dev) to send prompt logs to other storages such as AWS S3, Azure Blob Store, GCP Cloud Storage or any other "sink". It is also used to send promt logs to AI Dial Analytics Realtime via http.

The approximate configuration in yaml format that can be used for sending data to analytics:

  ```yaml
  sources:
    aidial_logs:
      type: "file"
      max_line_bytes: 100000000
      oldest_first: true
      include:
        - /app/log/*.log
    http_analytics_opensource:
      inputs:
        - aidial_logs
      type: http
      uri: http://dial-analytics.dial:80/data
      request:
        timeout_secs: 300
      batch:
        max_bytes: 1049000
        timeout_secs: 60
      encoding:
        codec: "json"
  ```

You can find more detailed configuration in the [Vector documentation](https://vector.dev/docs/reference/configuration/sinks/http).

### AI DIAL Analytics Realtime

Follow the [instructions](https://github.com/epam/ai-dial-analytics-realtime/blob/development/README.md) to setup AI DIAL Analytics Realtime service.

### Influx DB

Refer to InfluxDB documentation to learn how to [install](https://docs.influxdata.com/influxdb/v2/install/) it and how to [create tokens](https://docs.influxdata.com/influxdb/v2/admin/tokens/create-token/) to read from a bucket.

### Grafana

Refer to Grafana documentation to learn how to [install](https://grafana.com/docs/grafana/latest/setup-grafana/installation/) it and to [import dashboards](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/import-dashboards/). Refer to Analytics Realtime repository to view sample [dashboards](https://github.com/epam/ai-dial-analytics-realtime/blob/development/dashboards/README.md).
