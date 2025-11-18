# Custom application runner backend for a chat-based end-user interface

A sample backend application to demonstrate how a custom backend can be developed for a _DIAL application runner_ with the standard chat-based end-user interface.

This sample code uses the standard DIAL SDK mechanism to read the configuration of the application instance that invokes the chat completion endpoint (see `request.request_dial_application_properties()`). It retrieves the `Count` property and repeats the request text in the response as many times as specified by this property.

The application does not expose any custom API, only a chat completion endpoint to be invoked by the standard DIAL Chat interface.

The application instance configuration is supposed to be managed directly by the Admin UI application via DIAL application API.

## Environment Variables

### `DIAL_URL`

- **Description:** Specifies the URL of the DIAL Core endpoint that the application communicates with.
- **Example:** `http://core:8080`
- **Required:** Yes
