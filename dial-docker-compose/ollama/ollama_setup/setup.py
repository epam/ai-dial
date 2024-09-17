import asyncio
from contextlib import asynccontextmanager
import logging
import os
import time
import requests

OLLAMA_URL = os.getenv("OLLAMA_URL")
if OLLAMA_URL is None:
    raise RuntimeError("OLLAMA_URL env var isn't set")

OLLAMA_CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL")
OLLAMA_VISION_MODEL = os.getenv("OLLAMA_VISION_MODEL")

HEALTH_FILE = "/healthy"

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

log.info(f"OLLAMA_URL = {OLLAMA_URL}")
log.info(f"OLLAMA_CHAT_MODEL = {OLLAMA_CHAT_MODEL}")
log.info(f"OLLAMA_VISION_MODEL = {OLLAMA_VISION_MODEL}")


@asynccontextmanager
async def timer(name: str):
    log.info(f"[{name}] Starting...")
    start = time.perf_counter()
    yield
    elapsed = time.perf_counter() - start
    log.info(f"[{name}] Executed in {elapsed:.2f} seconds")


async def wait_for_ollama():
    while True:
        try:
            if requests.get(OLLAMA_URL).ok:
                break
        except requests.RequestException:
            pass
        await asyncio.sleep(1)


async def pull_model(model):
    data = {"name": model, "stream": False}
    requests.post(f"{OLLAMA_URL}/api/pull", json=data).raise_for_status()


async def create_alias(source, dest):
    data = {"source": source, "destination": dest}
    requests.post(f"{OLLAMA_URL}/api/copy", json=data).raise_for_status()


async def load_model(model):
    data = {"model": model}
    requests.post(f"{OLLAMA_URL}/api/generate", json=data).raise_for_status()


async def mark_as_healthy():
    open(HEALTH_FILE, "w").close()


async def main():
    async with timer("Waiting for Ollama to start"):
        await wait_for_ollama()

    for model, alias in [
        (OLLAMA_CHAT_MODEL, "chat-model"),
        (OLLAMA_VISION_MODEL, "vision-model"),
    ]:
        if model:
            async with timer(f"Pulling model {model}"):
                await pull_model(model)

            async with timer(f"Creating alias for {model}: {alias}"):
                await create_alias(model, alias)

    if model_to_load := OLLAMA_CHAT_MODEL or OLLAMA_VISION_MODEL:
        async with timer(f"Loading model {model_to_load} into memory"):
            await load_model(model_to_load)

    await mark_as_healthy()


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
