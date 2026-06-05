---
title: "Unified API"
type: reference
persona: app-dev
component: core
last_verified: 2026-06-05
owner: "@dial-docs-team"
---

# Unified API

The Unified API is DIAL Core's single, OpenAI-compatible HTTP API. Every model, application,
adapter, and tool set deployed in DIAL is reachable through the same endpoints, so client code
written against one deployment works against another without change.

The API covers:

- **Chat completions** and **embeddings** — OpenAI-compatible request and response schemas,
  including streaming.
- **File storage** — upload, list, download, and delete files in per-user and shared buckets.
- **Resources** — conversations, prompts, publications, sharing, and notifications.

## Full specification

The complete, always-current request and response schema is published as an OpenAPI
specification:

- **[Unified API specification (OpenAPI)](https://dialx.ai/dial_api)**

## Related pages

- **[Unified API overview](../understand-dial/architecture/4.unified-api-overview.md)** — what the
  API is and why DIAL exposes a single surface.
- **[Per-request keys](../building-with-dial/working-with-dial-resources/5.per-request-keys.md)** —
  scoping API access per request.
- **[SDK reference](../building-with-dial/developer-tools/sdk-reference/0.index.md)** — building
  applications that serve and consume the API.
