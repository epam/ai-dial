# Custom standalone application backend for a chat-based end-user interface

A sample backend application to demonstrate how a custom backend can be developed for a *DIAL standalone application* with the standard chat-based end-user interface.

The application exposes a custom API for centralized configuration management (`GET /config`, `PUT /config`) and a chat completion endpoint.

The chat completion endpoint handler retrieves the `Count` property from the configuration store and repeats the request text in the response as many times as specified by this property.

The application instance configuration is supposed to be managed directly by the Admin UI application via the custom API exposed from this backend.

## Environment Variables

### `DIAL_URL`

- **Description:** Specifies the URL of the DIAL Core endpoint that the application communicates with.
- **Example:** `http://core:8080`
- **Required:** Yes
