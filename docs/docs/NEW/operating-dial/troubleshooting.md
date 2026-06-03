---
title: "Troubleshooting"
type: reference
persona: devops
component: core
last_verified: 2026-06-03
owner: "@dial-docs-team"
---

# Troubleshooting

This page catalogs the failures DIAL operators encounter most often, the HTTP status codes DIAL Core returns, and the resolution for each. It is for DevOps and platform engineers running a deployment who need to map a symptom to a cause quickly. It assumes familiarity with the [Operating DIAL](/docs/NEW/operating-dial/local-setup/index) sections it links to; it does not re-explain configuration that those pages already document.

## How to diagnose

Three facts about how DIAL is built determine where to look first.

- **DIAL Core and the other services are stateless.** A crashed or restarted replica loses nothing durable. Most "lost data" reports are storage or Redis problems, not Core problems.
- **Blob storage holds permanent data** — conversations, files, published resources, application state. Storage errors surface as failed reads, failed uploads, or 5xx responses.
- **Redis holds volatile data** — caches, sessions, rate-limit counters. Redis being unreachable degrades or blocks requests even when storage is healthy.

### First steps

1. Read the service logs. Every quick-start and deployment page verifies a healthy start by confirming that the `core`, `chat`, and adapter services logged a startup line with no errors. A service that exits immediately or logs a stack trace on boot points at configuration, not load. See [Logging](/docs/NEW/operating-dial/observability/logging) for log format and levels.
2. Identify the HTTP status code returned to the client. The [HTTP error code reference](#http-error-code-reference) below maps each code to its triggers.
3. Read the error body. DIAL Core returns a structured JSON error (see [Error response format](#error-response-format)); its `message` field names the specific failure.

:::tip
When an application or Quick App returns a generic "Tool call failed" with no detail, the raw error is being suppressed. Set `display_error_in_stage` to `true` on the application configuration temporarily to surface the underlying error in the chat stage.
:::

## Symptom index

The fastest path from a symptom to the section that resolves it.

| Symptom | Likely area | Section |
|---|---|---|
| A service exits or crashes on startup | Startup and deployment | [Startup and deployment](#startup-and-deployment) |
| Containers fail to bind a port | Startup and deployment | [Startup and deployment](#startup-and-deployment) |
| DIAL Admin will not connect to DIAL Core | Startup and deployment | [Startup and deployment](#startup-and-deployment) |
| Every request returns 401 | Authentication and access | [Authentication and access](#authentication-and-access) |
| A user is blocked from a model, app, or file (403) | Authentication and access | [Authentication and access](#authentication-and-access) |
| Chat completions time out or hang | Models and adapters | [Models and adapters](#models-and-adapters) |
| Rising rate of 5xx from an adapter or route | Models and adapters | [Models and adapters](#models-and-adapters) |
| Spike in 429 responses | Models and adapters | [Models and adapters](#models-and-adapters) |
| File upload or download fails | Storage and Redis | [Storage and Redis](#storage-and-redis) |
| Sessions or rate limits behave erratically | Storage and Redis | [Storage and Redis](#storage-and-redis) |

For the signals to alert on for each of these failure modes, see [Alerting](/docs/NEW/operating-dial/observability/alerting).

## Startup and deployment

| Symptom | Likely cause | Resolution |
|---|---|---|
| A container fails to start with a port-bind error | Ports `8080` (DIAL Core) or `3000` (DIAL Chat) are already in use | Free the ports or remap them. See [Echo application](/docs/NEW/operating-dial/local-setup/docker-compose-with-application) for the local-setup port requirements. |
| DIAL Admin will not start or applies an unexpected configuration version | Admin cannot reach Core to read its config version, or the `config.json` is incompatible with Core | Admin falls back to the version in `CORE_CONFIG_VERSION` when it cannot connect. Verify Core is reachable and the configuration is compatible. |
| Core exits on boot with a configuration error | A required `settings.json` section is missing or malformed | Validate against the [Core configuration reference](/docs/NEW/operating-dial/configuration/core/settings-json/index). Storage, Redis, and at least one identity provider are required. |
| Adapter fails to start when file storage is enabled | `DIAL_URL` is unset while `DIAL_USE_FILE_STORAGE` is `True` | Set `DIAL_URL` to the Core URL. See [Adapter configuration](/docs/NEW/operating-dial/configuration/adapter-configuration). |

## Authentication and access

| Symptom | Likely cause | Resolution |
|---|---|---|
| Every request returns 401 | No identity provider is configured, or the API key is unknown | Configure at least one provider with `jwksUrl` or `userInfoEndpoint`. See [Identity Providers](/docs/NEW/operating-dial/configuration/core/settings-json/identity-providers) and [JWT authentication](/docs/NEW/operating-dial/auth-and-access-control/jwt). |
| 401 with a valid-looking key | Both an API key and an `Authorization` header were sent (Core rejects this as 400), or the `Authorization` header is malformed | Send exactly one credential. See [API keys](/docs/NEW/operating-dial/auth-and-access-control/api-keys). |
| 403 on a model or application | The authenticated user lacks role-based access to that deployment | Grant the role. See [Roles and rate limits](/docs/NEW/operating-dial/auth-and-access-control/roles-and-rate-limits). |
| 403 on a file attached to a chat completion | The application's per-request key does not cover the attached file | Attach only files associated with the per-request key or directly accessible to the application. |
| 403 when approving a publication | Only administrators can approve publications | Perform the approval with an admin account. |

## Models and adapters

| Symptom | Likely cause | Resolution |
|---|---|---|
| Chat completion returns 504 | The upstream model did not respond in time | Check upstream health and latency. For streaming, set `SSE_HEARTBEAT_INTERVAL` on the adapter so it injects ping comments and avoids idle read timeouts. |
| Chat completion returns 502 | The upstream is unavailable, or the maximum retry attempts were exceeded | `maxRetryAttempts` defaults to 5 for language models and 1 for applications. Verify the upstream endpoint and adjust retries in Core dynamic settings. |
| Chat completion returns 503 | Every retry to the upstreams returned 429, or the application controller or code interpreter is unavailable | Add upstream capacity or raise provider limits; confirm the application controller is running. |
| Spike in 429 responses | A user exceeded token or request limits per minute, hour, or day | Inspect and adjust limits. A `Retry-After` header indicates the wait. See [Roles and rate limits](/docs/NEW/operating-dial/auth-and-access-control/roles-and-rate-limits). |
| Intermittent upstream errors from one provider | Provider-side retriable errors are not being retried | Set the provider retry variable: `ANTHROPIC_MAX_RETRY_ATTEMPTS`, `BOTOCORE_MAX_RETRY_ATTEMPTS`, or `GOOGLE_GENAI_MAX_RETRY_ATTEMPTS` (each defaults to `0`). |

Sustained 5xx or latency from adapters warrants an alert; see [Metrics and monitoring](/docs/NEW/operating-dial/observability/metrics-and-monitoring) and [Alerting](/docs/NEW/operating-dial/observability/alerting).

## Storage and Redis

| Symptom | Likely cause | Resolution |
|---|---|---|
| File upload or download fails; resource reads error | Blob storage is misconfigured or unreachable | Verify the provider-specific required fields: S3 needs `bucket` and `region`; Azure Blob needs a `container`; GCS needs `bucket` and `projectId`. See [Storage](/docs/NEW/operating-dial/configuration/core/settings-json/storage). |
| Upload rejected with 413 | The content exceeds a size limit | `maxUploadedFileSize` defaults to 512 MB for `multipart/form-data`; `maxSize` defaults to 67 MB for resources. Raise the relevant limit or reduce the payload. |
| Sessions drop or rate limits behave erratically | Redis is unreachable | Redis is required for caching, sessions, and rate-limit counters. Provide a single-server or cluster configuration. See [Redis](/docs/NEW/operating-dial/configuration/core/settings-json/redis). |
| 412 on a resource write | A concurrent modification failed the `If-Match` or `If-Unmodified-Since` precondition | Re-read the resource and retry the write with the current version. |

Losing Redis costs a cache warm-up, not data. Losing blob storage loses permanent data — see [Back up and restore DIAL](/docs/NEW/operating-dial/production-readiness/backup-and-restore).

## HTTP error code reference

DIAL Core returns the following HTTP status codes. The triggers are authoritative, drawn from the Core error-code catalog.

| Code | Name | Meaning and common triggers |
|---|---|---|
| 400 | Bad Request | Client error: a malformed resource URL, both an API key and an `Authorization` header supplied, or a folder that cannot be downloaded. |
| 401 | Unauthorized | Invalid credentials: a bad `Authorization` header or an unknown API key. |
| 403 | Forbidden | Authenticated but lacking permission: no access to a model or application, approving a publication without admin rights, or accessing files attached to a chat completion request. |
| 404 | Not Found | The request is authenticated and authorized, but the resource — application, model, file, conversation, or prompt — does not exist. |
| 405 | Method Not Allowed | The HTTP method is unsupported. Core supports `GET`, `DELETE`, `POST`, `PUT`, `HEAD`, and `OPTIONS`. |
| 409 | Conflict | The request conflicts with resource state: an application must be stopped before moving, deploying, or deleting it, and started before undeploying it. |
| 412 | Precondition Failed | A conditional request failed its `If-Match` or `If-Unmodified-Since` precondition — typically a concurrent resource modification. |
| 413 | Content Too Large | The request exceeds `maxUploadedFileSize` (storage settings, default 512 MB, for `multipart/form-data`) or `maxSize` (resource settings, default 67 MB). |
| 415 | Unsupported Media Type | The content format is not accepted. Chat completion requests must be `application/json`. |
| 422 | Unprocessable Entity | The server failed to receive the request body. |
| 429 | Too Many Requests | Rate limiting: the user exceeded token or request limits over a minute, hour, or day on a chat completion or router request. A `Retry-After` header may indicate the wait. |
| 500 | Internal Server Error | A generic catch-all for an unexpected server condition with no more specific 5xx code. |
| 502 | Bad Gateway | An upstream is unavailable on a chat completion request or behind a route, or the maximum retry attempts were exceeded. |
| 503 | Service Unavailable | The server is not ready: all upstream retries returned 429, or the application controller or code interpreter is unavailable. |
| 504 | Gateway Timeout | The upstream did not respond in time on a chat completion request. |
| 505 | HTTP Version Not Supported | The HTTP version is unsupported. Core supports HTTP/1.1 only. |

### Error response format

DIAL Core serializes errors as a JSON object compatible with the OpenAI error shape. Field names are snake_case, and null fields are omitted.

```json
{
  "error": {
    "message": "human-readable error message",
    "display_message": "message safe to show to end users",
    "type": "error type",
    "param": "offending parameter",
    "code": "machine-readable code"
  }
}
```

| Field | Description |
|---|---|
| `message` | The full human-readable error message. The primary field for diagnosis. |
| `display_message` | A message safe to surface to end users. Populated when the raw `message` should not be shown directly. |
| `type` | The error type. |
| `param` | The request parameter that caused the error, when applicable. |
| `code` | A machine-readable error code, when applicable. |

## Related troubleshooting

Component-specific failure tables live alongside the features they cover:

- [MCP server integration](/docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/tool-sets/mcp-server-integration) — tool call failures, toolset auth, OAuth redirects.
- [Create a Quick App via the API](/docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/create-via-api) — request validation errors.
- [Create and configure a Quick App](/docs/NEW/building-with-dial/apps/quick-apps/quick-app-original/create-and-configure) — configuration errors.

## Next steps

- [Alerting](/docs/NEW/operating-dial/observability/alerting) — turn these failure modes into alerts before they reach users.
- [Production readiness](/docs/NEW/operating-dial/production-readiness/index) — high availability, scaling, and backup that prevent these failures.
- [Core configuration reference](/docs/NEW/operating-dial/configuration/core/settings-json/index) — the settings behind startup, storage, Redis, and identity errors.
