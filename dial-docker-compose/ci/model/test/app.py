import os
import aiohttp
import asyncio
import backoff

import logging


def get_env(name: str) -> str:
    value = os.environ.get(name)
    if value is None:
        raise ValueError(f"'{name}' environment variable must be defined")
    return value


DIAL_URL = get_env("DIAL_URL")
DIAL_API_KEY = get_env("DIAL_API_KEY")
DIAL_API_VERSION = get_env("DIAL_API_VERSION")

logging.basicConfig(level=logging.DEBUG)


@backoff.on_exception(
    backoff.expo,
    (aiohttp.ClientError, aiohttp.ServerTimeoutError),
    max_time=60,
)
async def post_with_retry(url: str, payload: dict, headers: dict, params: dict):
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload, headers=headers, params=params) as response:
            response.raise_for_status()
            return await response.json()


async def test_model(deployment_id: str):
    api_url = f"{DIAL_URL}/openai/deployments/{deployment_id}/chat/completions"

    message = "Hello"
    payload = {"messages": [{"role": "user", "content": message}], "stream": False}
    headers = {"api-key": DIAL_API_KEY}
    params = {"api-version": DIAL_API_VERSION}

    body = await post_with_retry(api_url, payload, headers, params)

    content = body.get("choices", [])[0].get("message", {}).get("content", "")
    if content != message:
        raise ValueError(f"Test failed for '{deployment_id}'")


async def tests():
    await test_model("gpt-35-turbo")
    await test_model("gpt-4")


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(tests())
