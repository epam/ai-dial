# DIAL Docker Compose

1. Setup model endpoints and keys

Update `./core/config.json` with real upstream model endpoints and keys.

2. Run the Docker Compose file

```
docker compose -f <filename> up
```

Choose one of the Compose files depending on your needs:

|File|Description|
|---|---|
|docker-compose-base.yml|Runs Core, Chat, Admin, Keycloak and required underlying services|
|docker-compose-full.yml|Runs RAG in addition to the base services from above|

3. Start using DIAL

|URL|Description|
|---|---|
|http://localhost:3000|DIAL Chat|
|http://localhost:3002|DIAL Admin|
|http://localhost:8800|Keycloak|

There are three default DIAL users pre-defined in Keycloak:

|Username|Password|Description|
|---|---|---|
|user|dial|Has only basic access to DIAL Chat|
|dial|dial|Has admin access to DIAL Chat|
|dial-admin|dial|Has access to DIAL Admin console|

Use `admin` as a user and a password to login to Keycloak as administrator.
