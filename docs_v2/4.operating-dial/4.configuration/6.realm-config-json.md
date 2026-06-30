---
title: "realm-config.json"
type: reference
persona: devops
component: keycloak
last_verified: 2026-04-29
owner: "@dial-core-team"
---

# realm-config.json

`realm-config.json` is the Keycloak realm configuration file. It defines the authentication realm, client applications, roles, and users for DIAL. Keycloak imports this file at startup via the `--import-realm` flag.

## File location

In Docker Compose deployments, the file is mounted into the Keycloak container:

```yaml
keycloak:
  image: keycloak/keycloak:26.3
  command: ["start-dev", "--import-realm", "--http-port=${KC_PORT}", "--hostname-backchannel-dynamic=true"]
  volumes:
    - ./keycloak/import/realm-config.json:/opt/keycloak/data/import/realm-config.json
```

The reference file is at [`dial-docker-compose-advanced/keycloak/import/realm-config.json`](https://github.com/epam/ai-dial/blob/main/dial-docker-compose-advanced/keycloak/import/realm-config.json).

## Top-level structure

```json
{
  "realm": "dial",
  "displayName": "DIAL Keycloak Sign-In",
  "enabled": true,
  "accessTokenLifespan": 86400,
  "ssoSessionIdleTimeout": 86400,
  "ssoSessionMaxLifespan": 86400,
  "sslRequired": "none",
  "roles": { ... },
  "users": [ ... ],
  "clients": [ ... ],
  "clientScopes": [ ... ]
}
```

## Realm settings

| Key | Value | Description |
|-----|-------|-------------|
| `realm` | `"dial"` | Realm name. Referenced in JWKS URLs and issuer patterns across all DIAL components. |
| `displayName` | `"DIAL Keycloak Sign-In"` | Shown on the Keycloak login page. |
| `enabled` | `true` | Whether the realm accepts authentication requests. |
| `accessTokenLifespan` | `86400` | Access token lifetime in seconds (24 hours). |
| `ssoSessionIdleTimeout` | `86400` | SSO session idle timeout in seconds. |
| `ssoSessionMaxLifespan` | `86400` | Maximum SSO session lifetime in seconds. |
| `sslRequired` | `"none"` | SSL requirement: `"none"`, `"external"`, or `"all"`. Set to `"external"` or `"all"` in production. |
| `rememberMe` | `false` | Whether to show "Remember Me" on the login page. |

## Roles

Client roles are defined per application. The default configuration defines roles for `dial-chat` and `dial-admin-console`:

```json
{
  "roles": {
    "client": {
      "dial-chat": [
        {
          "name": "admin",
          "description": "AI DIAL chat admin role",
          "clientRole": true
        },
        {
          "name": "user",
          "description": "AI DIAL chat user role",
          "clientRole": true
        }
      ],
      "dial-admin-console": [
        {
          "name": "admin",
          "description": "AI DIAL web-console admin user role",
          "clientRole": true
        },
        {
          "name": "ConfigAdmin",
          "description": "AI DIAL web-console admin user role",
          "clientRole": true
        }
      ]
    }
  }
}
```

These roles are referenced in DIAL Core's identity provider configuration via `rolePath` and in DIAL Chat via `AUTH_KEYCLOAK_DIAL_ROLES_FIELD`.

## Users

Users are pre-provisioned with assigned client roles:

```json
{
  "users": [
    {
      "username": "dial",
      "enabled": true,
      "emailVerified": true,
      "email": "no-reply-dial@example.com",
      "firstName": "Chat",
      "lastName": "User",
      "credentials": [
        {
          "type": "password",
          "value": "dial"
        }
      ],
      "clientRoles": {
        "dial-chat": ["admin"],
        "dial-admin-console": ["admin", "ConfigAdmin"]
      }
    }
  ]
}
```

> **Warning:** The default user credentials are for development only. Remove or change them in production.

## Clients

Two OAuth2 clients are configured for DIAL:

| Client ID | Description |
|-----------|-------------|
| `dial-chat` | DIAL Chat web application. Confidential client with authorization code flow. |
| `dial-admin-console` | DIAL Admin Panel. Confidential client with authorization code flow. |

Each client defines redirect URIs, web origins, and protocol mappers for role claims.

## Client scopes

Client scopes define which claims are included in tokens. The default configuration includes 11 scopes covering standard OpenID Connect claims and custom DIAL-specific mappings.

## DIAL components that reference realm-config.json

The realm name (`dial`) and client IDs appear in configuration across multiple DIAL components:

- **DIAL Core** — `identityProviders.keycloak.jwksUrl` includes the realm name
- **DIAL Chat** — `AUTH_KEYCLOAK_CLIENT_ID` and `AUTH_KEYCLOAK_HOST` reference the realm
- **Admin Frontend** — `AUTH_KEYCLOAK_CLIENT_ID` references `dial-admin-console`
- **Admin Backend** — `providers.keycloak.issuer` includes the realm name

See [Identity Providers](core/settings-json/identity-providers) for DIAL Core's Keycloak connection settings.

## Next steps

- [Identity Providers](core/settings-json/identity-providers) — DIAL Core JWT validation settings
- [DIAL Chat configuration](chat-configuration) — Chat Keycloak auth variables
- [Admin configuration](admin-configuration) — Admin Panel auth settings
