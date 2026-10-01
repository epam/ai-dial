import os

from aidial_sdk import DIALApp
from aidial_sdk.telemetry.types import TelemetryConfig
from aidial_interceptors_sdk.chat_completion import (
    interceptor_to_chat_completion,
)
from aidial_interceptors_sdk.utils._http_client import get_http_client

from interceptor import PIIRedactorInterceptor

DIAL_URL = os.environ.get("DIAL_URL", "http://core:8080")


async def client_factory():
    return get_http_client()


app = DIALApp(
    dial_url=DIAL_URL,
    telemetry_config=TelemetryConfig(),
    add_healthcheck=True,
    propagate_auth_headers=True,
    allow_extra_request_fields=True,
)

app.add_chat_completion(
    "pii-redactor",
    interceptor_to_chat_completion(
        PIIRedactorInterceptor, DIAL_URL, client_factory
    ),
)
