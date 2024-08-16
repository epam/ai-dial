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

AI DIAL Core uses [Vector](https://vector.dev/docs/reference/configuration/sinks/http/) (a lightweight, ultra-fast tool for building observability pipelines) to redirect users’ messages to S3, Azure Blob Store, GCP Cloud Storage or any other "sink". The collector takes prompt logs from AI DIAL Core and sends them to AI DIAL Analytics Realtime. 

**TODO**
- Describe container settings in k8s pod. See logger container in the staging: timberio/vector:0.35.0-alpine.

### AI DIAL Analytics Realtime

Follow the [instructions](https://github.com/epam/ai-dial-analytics-realtime/blob/development/README.md) to setup AI DIAL Analytics Realtime service.

### Influx DB

Refer to InfluxDB documentation to learn how to [install](https://docs.influxdata.com/influxdb/v2/install/) it and how to [create tokens](https://docs.influxdata.com/influxdb/v2/admin/tokens/create-token/) to read from a bucket.

### Grafana

Refer to Grafana documentation to learn how to [install](https://grafana.com/docs/grafana/latest/setup-grafana/installation/) it and to [import dashboards](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/import-dashboards/). Refer to Analytics Realtime repository to view sample [dashboards](https://github.com/epam/ai-dial-analytics-realtime/blob/development/dashboards/README.md).
