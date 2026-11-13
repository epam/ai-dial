import httpx
from aidial_sdk.chat_completion import ChatCompletion, Request, Response
from aidial_sdk.exceptions import HTTPException as DialHTTPException
from aidial_sdk.exceptions import InternalServerError

SEPARATOR = "--- served by ---"


class MockProviderAdapter(ChatCompletion):
    async def chat_completion(
        self, request: Request, response: Response
    ) -> None:
        # DIAL Core chooses an upstream from the model's `upstreams` list and
        # passes it in per-request headers. The SDK surfaces them as attributes.
        endpoint = request.upstream_endpoint
        if endpoint is None:
            raise InternalServerError(
                "No upstream endpoint. Declare `upstreams` on the model "
                "deployment in DIAL Core configuration."
            )

        last_message = request.messages[-1]
        user_text = last_message.text() or ""

        # Translate from the Unified API format to the provider's format.
        provider_payload = {"prompt": user_text, "max_length": 512}

        async with httpx.AsyncClient(timeout=30.0) as client:
            provider_response = await client.post(
                endpoint,
                json=provider_payload,
                # The key belongs to the upstream Core picked, so it is read
                # per request and never stored in this service.
                headers={"api-key": request.upstream_key or ""},
            )

        status = provider_response.status_code
        if status != 200:
            # Pass a provider's own 4xx straight through. A rejected key is a
            # configuration error, and retrying it on another upstream would
            # only hide it; 5xx becomes 502, which Core may retry elsewhere.
            raise DialHTTPException(
                status_code=status if 400 <= status < 500 else 502,
                message=(
                    f"upstream rejected the request: "
                    f"{status} {provider_response.text}"
                ),
            )

        result = provider_response.json()

        # Translate the provider's format back into the Unified API format.
        with response.create_single_choice() as choice:
            choice.append_content(
                f"{result['generated_text']}"
                f"\n\n{SEPARATOR}\n{result['served_by']}"
            )
