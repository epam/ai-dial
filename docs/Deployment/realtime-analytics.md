## Overview

AI DIAL Analytics Realtime is a service that gathers prompt logs from [DIAL Core](https://github.com/epam/ai-dial-core) and publishes them to InfluxDB.
The logs of prompts are the data a user provides to LLM and the responses the LLM gives to the user. A user can access analytical data through pre-set Grafana dashboards.

**TODO**
Update AI DIAL Analytics Realtime [README](https://github.com/epam/ai-dial-analytics-realtime/blob/development/README.md) with a link to this document.

## Pre-requisites

- [DIAL Core](https://github.com/epam/ai-dial-core)
- [Prompt log collector](https://github.com/vectordotdev/vector)
- [DIAL realtime analytics](https://github.com/epam/ai-dial-analytics-realtime)
- [Influx DB](https://github.com/influxdata/influxdb)
- [Grafana](https://github.com/grafana/grafana)

### DIAL Core

Follow the instructions in [AI DIAL Core](https://github.com/epam/ai-dial-core/blob/development/README.md) to setup.

**TODO**
- Describe gflog.xml

### Prompt log collector

The collector takes prompt logs from AI DIAL Core and sends them to AI DIAL Analytics Realtime.

**TODO**
- Describe container settings in k8s pod. See logger container in the staging: timberio/vector:0.35.0-alpine.

### AI DIAL Analytics Realtime

Follow the [instructions](https://github.com/epam/ai-dial-analytics-realtime/blob/development/README.md) to setup AI DIAL Analytics Realtime service.

### Influx DB

**TODO**
- Describe steps required to setup InfluxDB

### Grafana

**TODO**
- Describe steps required to setup Grafana
- Describe steps to setup dashboards for AI DIAL Analytics Realtime. See [dashboards](https://github.com/epam/ai-dial-analytics-realtime/blob/development/dashboards/README.md)
