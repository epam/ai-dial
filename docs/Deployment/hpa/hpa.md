# AI DIAL Horizontal Pod Autoscaler Simple Guide

- [AI DIAL Horizontal Pod Autoscaler Simple Guide](#ai-dial-horizontal-pod-autoscaler-simple-guide)
  - [Prerequisites](#prerequisites)
  - [Expected Outcome](#expected-outcome)
  - [Install Prometheus Adapter via helm chart](#install-prometheus-adapter-via-helm-chart)
  - [Configure Horizontal Pod Autoscaler](#configure-horizontal-pod-autoscaler)

## Prerequisites

- Kubernetes
- [Prometheus](https://prometheus.io/docs/introduction/overview/)


## Expected Outcome

By following the instructions in this guide, you will successfully install Prometheus Adapter and apply Horizontal Pod Autoscaler configuration to scale core application pods based on one of the prometheus metric.
Please note that this guide represents a very basic deployment scenario, and **should never be used in production**.\

## Install Prometheus Adapter via helm chart

1. Add repo
    ```
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    ```
2. Install it with custom metrics config from [values file](values.yaml)
    ```
    helm install prometheus-adapter -f values.yaml -n prometheus-adapter prometheus-community/prometheus-adapter
    ```


## Configure Horizontal Pod Autoscaler

1. Apply HPA manifest in core application namespace to scale scaleTargetRef based on metric that was associated with metrics from custom metric api and configured on previous step.

```
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: core-metrics-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: core
  minReplicas: 2
  maxReplicas: 4
  metrics:
  - type: Pods
    pods:
      metric:
        name: vertx_pool_queue_time_seconds_count
      target:
        averageValue: 500m
        type: AverageValue
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - periodSeconds: 15
          type: Percent
          value: 50
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - periodSeconds: 15
          type: Percent
          value: 100
```