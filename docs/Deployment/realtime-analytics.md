## Overview

Realtime analytics service gathers prompt logs from [DIAL Core](https://github.com/epam/ai-dial-core) and publish them to InfluxDB.
The prompt logs are input data that user asks for LLM and output data that LLM responds to the user.
A user can view analytics data on pre-configured Grafana dashboards.

**TODO**
Update DIAL analytics [README](https://github.com/epam/ai-dial-analytics-realtime/blob/development/README.md) with a link to this document.

## Pre-requisites

- [DIAL Core](https://github.com/epam/ai-dial-core)
- [Prompt log collector](https://github.com/vectordotdev/vector)
- [DIAL realtime analytics](https://github.com/epam/ai-dial-analytics-realtime)
- [Influx DB](https://github.com/influxdata/influxdb)
- [Grafana](https://github.com/grafana/grafana)

### DIAL Core

Follow the [instructions](https://github.com/epam/ai-dial-core/blob/development/README.md) to setup DIAL Core.

**TODO**
- Describe gflog.xml

### Prompt log collector

The collector takes prompt logs from DIAL Core and sends them to DIAL realtime analytics.

**TODO**
- Describe container settings in k8s pod. See logger container in the staging: timberio/vector:0.35.0-alpine.

### DIAL realtime analytics

Follow the [instructions](https://github.com/epam/ai-dial-analytics-realtime/blob/development/README.md) to setup DIAL analytics.

### Influx DB

**TODO**
- Describe steps required to setup InfluxDB

### Grafana

**TODO**
- Describe steps required to setup Grafana
- Describe steps to setup dashboards for DIAL analytics. See [dashboards](https://github.com/epam/ai-dial-analytics-realtime/blob/development/dashboards/README.md)