---
title: "Architect overview"
type: explanation
persona: architect
component: platform
last_verified: 2026-06-01
owner: "@dial-docs-team"
---

# Architect overview

DIAL is an API-first platform that sits between your applications and the language models, tools, and data they depend on. This page explains the platform's shape — its mandatory core, optional components, and extension points — so you can decide how DIAL fits into your architecture and where the integration boundaries lie. It is written for solution architects evaluating or designing with DIAL. It contains no setup instructions; follow the linked how-tos for those.

## The central idea: one API for everything

Every model, application, adapter, and tool in DIAL is reached through a single, OpenAI-compatible interface: the [Unified API](../understand-dial/architecture/4.unified-api-overview.md). Because all components speak the same protocol, they are interchangeable from a caller's perspective. An application can call a model, another application, or a tool set without bespoke integration for each. This uniformity is the architectural property that everything else builds on.

## The components

DIAL is deliberately modular. Only one component is mandatory.

```text
Clients (DIAL Chat, your apps, DIAL Overlay)
        │  Unified API
        ▼
DIAL Core (required)
├── LLM gateway and load balancer
├── Authentication and access control
├── Interceptor orchestration
├── File storage and cost management
└── Observability (OpenTelemetry)
        │
        ├── Adapters ──► external providers (Azure OpenAI, Bedrock, Vertex AI, …)
        ├── Applications (Custom Apps, Quick Apps, Code Apps, Mind Map Studio)
        └── Tool Sets ──► MCP servers and external services

Optional surfaces: DIAL Chat (UI), DIAL Admin (governance), DIAL Overlay (embedding)
```

[DIAL Core](../understand-dial/architecture/4.unified-api-overview.md) is the only required component. It is headless and runs without a UI. Everything else — DIAL Chat, DIAL Admin, adapters, applications — is optional and can be adopted incrementally.

### Why a headless core matters

A headless core means DIAL can serve a custom application, an embedded chat widget, or a backend service equally well. You are not locked into the bundled UI. Teams that already have a frontend integrate at the API layer; teams that want a product experience adopt DIAL Chat on top.

## Extension points

DIAL gives you three distinct ways to extend the platform, and keeping them separate is key to a clean design:

- **Adapters** translate an external provider's API into the Unified API. Add a provider once; every app gains access to it.
- **Interceptors** are middleware that modify requests and responses in flight — PII redaction, content filtering, audit logging, compliance enforcement.
- **Applications** are first-class services that expose chat completion or embedding endpoints and can be composed as agents.

These are not interchangeable. An adapter connects a provider; an interceptor enforces a policy; an application implements business logic. Conflating them leads to brittle designs.

## Cross-cutting concerns, handled centrally

Because all traffic flows through DIAL Core, the platform applies governance uniformly rather than per application:

- **Access control** — role-based permissions integrated with your identity provider.
- **Cost and rate limits** — enforced per key and per role.
- **Load balancing** — weighted distribution across upstreams and regions, with provisioned-throughput priority.
- **Observability** — OpenTelemetry metrics, traces, and logs across the whole request path.

Designing these once at the gateway, rather than re-implementing them in every application, is the main reason organizations adopt DIAL over wiring models directly into apps.

## Trade-offs to weigh

DIAL centralizes the model gateway, which adds one hop to every request. In exchange, you gain consistent governance, observability, and interchangeability. If your use case is a single application calling a single model with no governance needs, that trade-off may not pay off. The value grows with the number of models, applications, teams, and compliance requirements you need to coordinate.

## Further reading

- [Architecture highlights](../understand-dial/architecture/1.architecture-highlights.md) — the component architecture in depth
- [Application server](../understand-dial/architecture/3.application-server.md) — how DIAL runs applications
- [Agentic platform](../understand-dial/capabilities/1.agentic-platform.md) — composing applications into multi-agent workflows
- [Access control](../understand-dial/security-and-governance/2.access-control-reference.md) — the access model in detail

## Next steps

- [Building with DIAL](../building-with-dial/index) — how teams build applications on the platform
- [Operating DIAL](../operating-dial/configuration/index) — configuration and deployment for the components above
