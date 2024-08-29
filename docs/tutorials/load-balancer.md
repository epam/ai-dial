# Load Balancer

## Introduction

Load balancing is crucial for distributing requests to LLMs across various resources, preventing bottlenecks, enhancing fault tolerance and keeping costs under control.

Using the AI DIAL Load Balancer, you can manage traffic and workload efficiently across your organization's provisioned throughput units (PTU), ensuring resources are used optimally and performance remains consistent. The system also automatically retries any failed requests, boosting reliability and improving the user experience.

You have the option to set up a simple strategy by directing requests to specific endpoints, or you can choose a more sophisticated approach by customizing a combination of parameters.

## Configuration

You can configure load balancing in AI DIAL Core [dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings) by defining `upstream` parameters for models. These parameters can be dynamically adjusted without the need to redeploy the AI DIAL Core.

```java
public class Upstream {
    private String endpoint; // required
    private String key; // optional
    private int tier = 0; // default weight if not specified
    private int weight = 1; // default weight if not specified
}
```

**Note**: in a cluster, AI DIAL Core nodes do share the state of endpoints, which may cause a certain asynchronization in their work routing the requests. 

**Configuration example**:

```json
    "models": {
        "chat-gpt-35-turbo": {
            "upstreams": [
                {
                    "endpoint": "http://localhost:7001",
                    "key": "modelKey",
                    "weight": 1,
                    "tier": 0
                },
            ],
        }
    }
```

where:

* `endpoint` - the model endpoint. The only **required** parameter.
* `key` - model API key
* `weight` - the endpoint capacity as a share of the total traffic
* `tier` - specifies an endpoint group

In the following sections, you can get familiar with specific combinations of these parameter for configuring load balancer algorithms.

## Standard Load Balancer

Standard load balancer follows the round-robin approach. The incoming traffic is distributed evenly across all resources. Each new request is sent to the next endpoint in line, and the process repeats cyclically. Once the end of the list is reached, it starts over from the first endpoint. This can be efficient in scenarios where all resources have similar capabilities and the tasks they handle are roughly equivalent in terms of resource consumption.

Example of configuration of AI DIAL Core: 


```json
"models": {
    "chat-gpt-35-turbo": {
        "upstreams": [
            {
                "endpoint": "https://hostname1/openai/deployments/gpt-4-32k-0613/chat/completions"
            },
            {
                "endpoint": "https://hostname2/openai/deployments/gpt-4-32k-0613/chat/completions"
            },
            {
                "endpoint": "https://hostname3/openai/deployments/gpt-4-32k-0613/chat/completions"
            },
        ]
    }
}
```

In this scenario, requests are distributed between endpoints in the order specified in the configuration. By default, the `weight` is set to `1` and `tier` to `0` for all of them.


## Advanced Load Balancer

You can use a combination of `weight` and `tier` parameters to define a more complex load balancing algorithm. 

### Tiers

Use `tier` to aggregate endpoints in groups. In a regular scenario, all requests are routed to endpoints with the lowest `tier`,
but in case of the outage or hitting the limits, the second in line `tier` helps to handle the load.

For example, requests will be routed to a group of endpoint with `"tier": 0` before they go to the group with `"tier": 1`.

The default value is 0, which signifies the highest tier.

Example of configuration of AI DIAL Core: 

```json
"models": {
    "chat-gpt-35-turbo": {
        "upstreams": [
            {
                "endpoint": "https://hostname1/openai/deployments/gpt-4-32k-0613/chat/completions",
                "tier": 0
            },
            {
                "endpoint": "https://hostname2/openai/deployments/gpt-4-32k-0613/chat/completions",
                "tier": 0
            },
            {
                "endpoint": "https://hostname3/openai/deployments/gpt-4-32k-0613/chat/completions",
                "tier": 1
            },
        ]
    }
}
```

In this scenario, requests are distributed between groups of endpoints in the order specified in the configuration. By default, the `weight` is set to `1`for all of them.

### Weights

Use `weight` inside groups of endpoints to allocate a share of the total traffic for specific endpoints. **Note**: `weight` can be used only in combination with `tier`. 

The default value is 1. A positive value represents an endpoint capacity, zero or negative - disables the endpoint from routing.

Example of configuration of AI DIAL Core: 

```json
"models": {
    "chat-gpt-35-turbo": {
        "upstreams": [
            {
                "endpoint": "https://hostname1/openai/deployments/gpt-4-32k-0613/chat/completions",
                "tier": 0,
                "weight": 3
            },
            {
                "endpoint": "https://hostname2/openai/deployments/gpt-4-32k-0613/chat/completions",
                "tier": 0,
                "weight": 2
            },
            {
                "endpoint": "https://hostname3/openai/deployments/gpt-4-32k-0613/chat/completions",
                "tier": 1,
                "weight": 1
            },
        ]
    }
}
```

In this setup, requests are initially directed to tier=0. Within this tier, the share of the total traffic in 50% (3+2): `host1: 3/5*100 = 60%` and `host2: 2/5*100 = 40%`. If tier=0 is unavailable or reaches its capacity limits, the remaining traffic is then routed to tier=1. Additionally, if the endpoint with the highest weight fails, the subsequent retry will be directed to the endpoint with the second-highest weight to avoid repeated retries to the same endpoint because of its high weight.