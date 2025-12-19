import os
import aiohttp
import asyncio
import backoff

import logging
import time
from contextlib import asynccontextmanager


def get_env(name: str) -> str:
    value = os.environ.get(name)
    if value is None:
        raise ValueError(f"'{name}' environment variable must be defined")
    return value


DIAL_URL = get_env("DIAL_URL")
DIAL_API_KEY = get_env("DIAL_API_KEY")
DIAL_API_VERSION = get_env("DIAL_API_VERSION")

logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)


@asynccontextmanager
async def timer(name: str):
    log.debug(f"[{name}] Starting...")
    start = time.perf_counter()
    yield
    elapsed = time.perf_counter() - start
    log.debug(f"[{name}] Executed in {elapsed:.2f} seconds")


@backoff.on_exception(
    backoff.expo,
    (aiohttp.ClientError, aiohttp.ServerTimeoutError),
    max_time=60,
)
async def post_with_retry(url: str, payload: dict, headers: dict, params: dict):
    async with aiohttp.ClientSession() as session:
        async with session.post(
            url, json=payload, headers=headers, params=params
        ) as response:
            response.raise_for_status()
            return await response.json()


async def dial_chat_completion(deployment_id: str, messages: list) -> str:
    api_url = f"{DIAL_URL}/openai/deployments/{deployment_id}/chat/completions"

    payload = {
        "model": deployment_id,
        "messages": messages,
        "temperature": 0.0,
        "stream": False
    }
    headers = {"api-key": DIAL_API_KEY}
    params = {"api-version": DIAL_API_VERSION}

    body = await post_with_retry(api_url, payload, headers, params)
    log.debug(f"Response: {body}")

    content = body.get("choices", [])[0].get("message", {}).get("content", "")

    log.debug(f"Content: {content}")

    return content

async def test_chat_model(deployment_id: str):
    message = "2 + 3 = ? Reply with a single number:"
    messages = [{"role": "user", "content": message}]
    content = await dial_chat_completion(deployment_id, messages)

    if "5" not in content:
        raise ValueError(f"Test failed for {deployment_id!r}")

async def tests():
    async with timer("Testing chat model"):
        await test_chat_model("dial-chat-deployment-id")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(tests())
