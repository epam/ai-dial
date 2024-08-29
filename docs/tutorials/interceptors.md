# Interceptors

## Introduction

Interceptors are AI DIAL components used to facilitate the implementation of a so-called Responsible AI approach and enforce compliance with internal and external privacy regulations and policies.

Interceptors, are pluggable components that can be triggered before a chat completion request (pre-interceptor) or after a chat completion response (post-interceptor) to execute a certain logic and delegate the analysis of information to third-party models.

For example, interceptors can be utilized to block requests that violate specific regulations, originate from restricted domains, or potentially lead to data leaks or biased responses. Another use case is when interceptors allow applications or models to respond solely to specific subjects and anonymize Personally Identifiable Information (PII) from user requests, cache LLM responses.

To implement PII (Personally Identifiable Information) anonymization for all data sent to models through AI DIAL, you can use interceptors which can employ specific locally deployed NLP models to obfuscate (replace with token) PII in requests (pre-interceptor) and decode it in responses (post-interceptor), effectively ensuring the anonymization of all personal data.

## Flow

Technically speaking, interceptors in AI DIAL are components inserted into deployments (applications or model adapters) that can be called before or after [chat completion requests](https://epam-rail.com/dial_api#/paths/~1openai~1deployments~1%7BDeployment%20Name%7D~1chat~1completions/post).

AI DIAL Core manages chat completion requests from interceptors through the endpoint: `/openai/deployments/<deployment|interceptor>/chat/completions`. It uses the deployment name `interceptor` to handle requests from all interceptors. Upon receiving a request, it identifies the next interceptor based on the current interceptor specified in the API Key data. The final interceptor in the sequence is always the target deployment (application, model).

For the example purposes, lets take two interceptors **gtp-cache** and **pii-anonymizer** configured for the **GPT-4** model:

```json
    "models": {
        "chat-gpt-4": {
            "interceptors": ["gtp-cache", "pii-anonymizer"]
        }
```

1. AI DIAL Core receives a request from AI DIAL Chat to query the GPT-4 model.
2. The first interceptor, **gpt-cache**, checks the cache for the request. If found, the response is returned to AI DIAL Core; if not, the request is forwarded to **pii-anonymizer**.
3. The **pii-anonymizer** interceptor anonymizes any personally identifiable information (PII) in the request and forwards it to **GPT-4**.
4. After all interceptors have processed the request, AI DIAL Core sends it directly to the GPT-4 model.
5. AI DIAL Core retrieves the response from **GPT-4** and forwards it to **pii-anonymizer**.
6. The **pii-anonymizer** interceptor restores the original PII in the response and passes it to **gpt-cache**.
7. The **gpt-cache** interceptor stores the response in the cache and returns it to AI DIAL Core.
8. AI DIAL Core sends the final response back to AI DIAL Chat.

## Configuration

Interceptors can be defined and assigned in AI DIAL Core [dynamic settings](https://github.com/epam/ai-dial-core?tab=readme-ov-file#dynamic-settings).

### Add

1. Add `interceptors` section to [AI DIAL Core dynamic settings](https://github.com/epam/ai-dial-core/blob/development/sample/aidial.config.json#L3).
2. Define a list of interceptors that will be available for your deployments: 

```json
    "interceptors": {
        "gpt-cache": {
            "endpoint": "http://localhost:4088/api/v1/interceptor/handle",
            "description": "description"
        },
        "pii-anonymizer": {
            "endpoint": "http://localhost:4089/api/v1/interceptor/handle",
            "description": "description"
        }
    }
    ...
```

### Assign

To assign `interceptors` to `applications` and `models`:

1. Add `interceptors` array to `models` and `applications`.
2. Define interceptors from the available list: 

```json
    { 
    "applications": {
        "app": {
            "interceptors": ["gpt-cache", "pii-anonymizer"]                
        },
        ...
    },
    "models": {
        "chat-gpt-4": {
            "interceptors": ["gpt-cache", "pii-anonymizer"]            
        },
        ...
    },
    ...
    }
```

## Interceptor Endpoint Specification

Each interceptor operates with an endpoint defined as `POST interceptor_endpoint HTTP/1.1`. It is mandatory for every interceptor to have the `DIAL_URL` environment variable set.

When an interceptor calls the next one, it uses the special deployment name "interceptor" and the [per-request API key](../Roles%20and%20Access%20Control/API%20Keys#per-request-keys), which is extracted from the request's HTTP header named `api-key`.

An interceptor can handle a request in one of the following ways:

1. Accept the request and return an HTTP response code of 200 along with the chat completion response, such as a response from the GPT cache.
2. Accept the request and forward the HTTP response from the subsequent interceptor.
3. Reject the request and return an HTTP response code of 451, including an error message in the response body.

**Note**: It is possible for a client to encounter an error during a streaming response, even if the initial HTTP response code indicates success.