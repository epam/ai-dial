# Interceptors

## Introduction

Interceptors can be seen as a middleware that modifies incoming or outgoing requests according to a specific logic. In AI DIAL, we use interceptors to facilitate the implementation of a so-called Responsible AI approach and enforce compliance with internal and external privacy regulations and policies.

For example, interceptors can block requests that violate specific regulations, related to restricted domains, or potentially lead to data leaks or biased responses. Another use case is when interceptors allow applications or models to respond solely to specific subjects and anonymize Personally Identifiable Information (PII) from user requests, or cache LLM responses.

> Watch a [demo video](../../video%20demos/demos/interceptors) to learn more about interceptors.

Technically speaking, interceptors in AI DIAL are components inserted into deployments (applications or model adapters) that can be called before or after [chat completion requests](https://epam-rail.com/dial_api#/paths/~1openai~1deployments~1%7BDeployment%20Name%7D~1chat~1completions/post).

Interceptors in AI DIAL could be classified into the following categories:

* **Pre-interceptors** that only modify the incoming request from the client (e.g. rejecting requests following certain criteria)
* **Post-interceptors** that only modify the response received from the upstream (e.g. censoring the response)
* **Generic interceptors** that modify both the incoming request and the response from the upstream (e.g. caching the responses)

For example, to implement PII (Personally Identifiable Information) anonymization for all data sent to models through AI DIAL, you can use a **generic** interceptor which can employ specific locally deployed NLP models to obfuscate (replace with token) PII in requests (pre-interceptor) and decode it in responses (post-interceptor), effectively ensuring the anonymization of all personal data.

<!-- Interceptors in AI DIAL can:

* Modify an incoming AI DIAL request received from the client (or it may leave it as is).
* Call an upstream AI DIAL application (the upstream for short) with the modified request.
* Modify the response from the upstream (or it may leave it as is).
* Return the modified response to the client. -->

For illustration, the below diagram shows the flow of requests if two interceptors are configured. Every request/response goes through AI DIAL Core (this is hidden from the diagram for brevity):

```js
Client -> (original request) ->
  Interceptor 1 -> (modified request #1) ->
    Interceptor 2 -> (modified request #2) ->
      Upstream -> (original response) ->
    Interceptor 2 -> (modified response #1) ->
  Interceptor 1 -> (modified response #2) ->
Client
```

AI DIAL Core manages chat completion requests from interceptors through the endpoint: `/openai/deployments/interceptor/chat/completions`. It uses the reserved deployment name `interceptor` to handle requests from all interceptors. Upon receiving a request, it identifies the next interceptor based on its [per-request API key](../Roles%20and%20Access%20Control/API%20Keys#per-request-keys). The final interceptor in the sequence is always the target deployment (application, model).

## Interceptors SDK

You can use [AI DIAL Interceptors Python SDK](https://github.com/epam/ai-dial-interceptors-sdk) to create your custom interceptors. Refer to [Examples](https://github.com/epam/ai-dial-interceptors-sdk/tree/development/aidial_interceptors_sdk/examples) for your reference.

## Configuration

Interceptors can be defined and assigned in AI DIAL Core [dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings).

### Add

1. Add `interceptors` section to [AI DIAL Core dynamic settings](https://github.com/epam/ai-dial-core/blob/development/sample/aidial.config.json#L3).
2. Define a list of interceptors that will be available for your deployments: 

```json
    "interceptors": {
        "gpt-cache": {
            "endpoint": "${INTERCEPTOR_SERVICE_URL}/openai/deployments/gpt-cache/chat/completions",
            "description": "description"
        },
        "pii-anonymizer": {
            "endpoint": "${INTERCEPTOR_SERVICE_URL}/openai/deployments/pii-anonymizer/chat/completions",
            "description": "description"
        }
    }
    ...
```

### Assign

To assign `interceptors` to `applications` and `models`:

1. In our example, we add `interceptors` array to a chat-gpt-4 model.
2. Define interceptors from the available list: 

```json
    { 
    "models": {
        "chat-gpt-4": {
            "interceptors": ["gpt-cache", "pii-anonymizer"]            
        },
        ...
    },
    ...
    }
```

**Note**: make sure that chat completion interceptors are only used in chat models or application, embeddings interceptors are only used in embeddings models.

## Flow

To demonstrate the flow, lets take two interceptors **gpt-cache** and **pii-anonymizer** configured for the **GPT-4** model:

1. AI DIAL Core receives a request from AI DIAL Chat to query the GPT-4 model.
2. The first interceptor, **gpt-cache**, checks the cache for the request. If found, the response is returned to AI DIAL Core; if not, the request is forwarded to **pii-anonymizer**.
3. The **pii-anonymizer** interceptor anonymizes any personally identifiable information (PII) in the request and forwards it to **GPT-4**.
4. After all interceptors have processed the request, AI DIAL Core sends it directly to the GPT-4 model.
5. AI DIAL Core retrieves the response from **GPT-4** and forwards it to **pii-anonymizer**.
6. The **pii-anonymizer** interceptor restores the original PII in the response and passes it to **gpt-cache**.
7. The **gpt-cache** interceptor stores the response in the cache and returns it to AI DIAL Core.
8. AI DIAL Core sends the final response back to AI DIAL Chat.

