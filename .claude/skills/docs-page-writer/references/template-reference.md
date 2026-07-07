# Reference Template

Use this template when `type: reference` in frontmatter.

Reference pages are **information-oriented**. Exhaustive, neutral, authoritative description of an interface, configuration, or API. The reader is looking up a specific detail.

## Rules

- Every setting documented, including defaults and precedence.
- No narrative. No "you should." No opinions.
- Alphabetical or structural ordering, not "most useful first."
- If a setting has a side effect, document it.
- Include a concrete example for every parameter, not just the type.
- Third person only. No second person.

## Structure

```markdown
---
title: "Core configuration"
type: reference
persona: devops
component: core
last_verified: 2026-04-27
owner: "@dial-core-team"
---

# Core configuration

This page documents all configuration settings for DIAL Core. Settings can be
provided via config file, environment variable, or CLI argument. See
[Config precedence rules](/operating/configuration/precedence) for resolution order.

## Server settings

### `server.port`

| Property | Value |
|---|---|
| Type | integer |
| Default | `8080` |
| Env var | `DIAL_SERVER_PORT` |
| Config path | `server.port` |
| Since | Core 0.30 |

The TCP port DIAL Core listens on for HTTP requests.

**Example:**

    DIAL_SERVER_PORT=9090

### `server.host`

(same table structure)

## Authentication settings

### `auth.jwt.jwks-url`

(same table structure)

## Next steps

- [Configuration precedence](/operating/configuration/precedence) — how file, env, and CLI settings interact
- [Dependency configuration](/operating/configuration/dependencies) — Redis and blob storage settings
```

## Anti-patterns to avoid

- **Hidden behavior.** If setting `X` also affects `Y`, document it.
- **Missing defaults.** Every parameter shows its default, even if it's "none" or "empty."
- **Narrative creep.** "You might want to increase this if…" belongs in a How-to, not a Reference.
- **Inconsistent table structure.** Every parameter uses the same table layout.