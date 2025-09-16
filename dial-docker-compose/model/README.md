# Instructions

1. Setup model endpoints and keys

Update `./core/config.json` with real upstream model endpoints and keys.

2. Run the Docker Compose file

If Keycloak and DIAL Admin are not needed, just run the default Docker Compose:

```
docker compose up
```

To include Keycloak and DIAL Admin, update `docker-compose.yml` to include `common-admin.yml` instead of `common.yml`, and run the following:

```
docker compose --env-file=.env.full up
```

3. Start using DIAL

|URL|Description|
|---|---|
|http://localhost:3000|DIAL Chat|
|http://localhost:3002|DIAL Admin|
|http://localhost:8800|Keycloak|

There are three default users pre-defined in Keycloak

|Username|Password|Description|
|---|---|---|
|user|dial|Has only basic access to DIAL Chat|
|dial|dial|Has admin access to DIAL Chat|
|dial-admin|dial|Has access to DIAL Admin console|
