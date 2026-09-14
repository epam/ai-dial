# DIAL Advanced Docker Compose

Production-like Docker Compose stacks with Keycloak authentication, an Admin Panel, and multiple model adapters.

Two release lines are kept side by side:

| Folder | Release line | Status |
|---|---|---|
| [`dial-2.x/`](./dial-2.x) | DIAL 2.x | **Current — use this one** |
| [`dial-1.x/`](./dial-1.x) | DIAL 1.x | Legacy — kept for existing 1.x installations |

Each folder is self-contained: its own `.env`, `core/config.json`, Keycloak realm, and compose files. Run them from inside the folder.

```bash
cd dial-2.x
docker compose -f docker-compose-base.yml up
```

For the minimal quick-start setup (no auth, no Admin Panel), see [`dial-docker-compose/`](../dial-docker-compose) instead.
