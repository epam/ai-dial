import base64
import os
from pathlib import Path
from typing import Any
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


def read_image_base64(png_file: Path) -> str:
    return base64.b64encode(png_file.read_bytes()).decode("utf-8")

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

async def dial_embeddings(deployment_id: str, input: Any) -> str:
    api_url = f"{DIAL_URL}/openai/deployments/{deployment_id}/embeddings"

    payload = {
        "model": deployment_id,
        "input": input,
    }
    headers = {"api-key": DIAL_API_KEY}
    params = {"api-version": DIAL_API_VERSION}

    body = await post_with_retry(api_url, payload, headers, params)
    log.debug(f"Response: {body}")

    embedding = body.get("data", [])[0].get("embedding", [])

    log.debug(f"Len embedding vector: {len(embedding)}")

    return embedding

async def test_chat_model(deployment_id: str):
    message = "2 + 3 = ? Reply with a single number:"
    messages = [{"role": "user", "content": message}]
    content = await dial_chat_completion(deployment_id, messages)

    if "5" not in content:
        raise ValueError(f"Test failed for {deployment_id!r}")


async def test_vision_model(deployment_id: str):
    base64_data = read_image_base64(Path("./image.png"))
    base64_image = f"data:image/png;base64,{base64_data}"

    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe the image"},
                {"type": "image_url", "image_url": {"url": base64_image}},
            ],
        }
    ]

    content = await dial_chat_completion(deployment_id, messages)

    if "vision" not in content.lower():
        raise ValueError(f"Test failed for {deployment_id!r}")

async def test_embedding_model(deployment_id: str):
    embeddings = await dial_embeddings(deployment_id, "cat")

    if len(embeddings) == 0 or not isinstance(embeddings[0], float):
        raise ValueError(f"Test failed for {deployment_id!r}")


async def tests():
    async with timer("Testing chat-model"):
        await test_chat_model("chat-model")

    async with timer("Testing vision-model"):
        await test_vision_model("vision-model")

    async with timer("Testing embedding-model"):
        await test_embedding_model("embedding-model")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(tests())
