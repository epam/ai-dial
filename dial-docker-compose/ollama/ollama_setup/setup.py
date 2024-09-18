import asyncio
from contextlib import asynccontextmanager
import os
import time
import httpx

OLLAMA_URL = os.getenv("OLLAMA_URL")
if OLLAMA_URL is None:
    raise RuntimeError("OLLAMA_URL env var isn't set")

OLLAMA_CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL")
OLLAMA_VISION_MODEL = os.getenv("OLLAMA_VISION_MODEL")
OLLAMA_EMBEDDING_MODEL = os.getenv("OLLAMA_EMBEDDING_MODEL")

HEALTH_FILE = "/healthy"


def print_info(*args, **kwargs):
    print(*args, **kwargs, flush=True)


print_info(f"OLLAMA_URL = {OLLAMA_URL}")
print_info(f"OLLAMA_CHAT_MODEL = {OLLAMA_CHAT_MODEL}")
print_info(f"OLLAMA_VISION_MODEL = {OLLAMA_VISION_MODEL}")
print_info(f"OLLAMA_EMBEDDING_MODEL = {OLLAMA_EMBEDDING_MODEL}")


@asynccontextmanager
async def timer(name: str):
    print_info(f"[{name}] Starting...")
    start = time.perf_counter()
    yield
    elapsed = time.perf_counter() - start
    print_info(f"[{name}] Finished in {elapsed:.2f} seconds")


ollama = httpx.AsyncClient(base_url=OLLAMA_URL, timeout=300)


async def wait_for_startup():
    while True:
        try:
            if (await ollama.get("/")).is_success:
                break
        except Exception:
            pass
        await asyncio.sleep(1)


async def pull_model(model):
    data = {"name": model, "stream": False}
    (await ollama.post("/api/pull", json=data)).raise_for_status()


async def create_alias(source, dest):
    data = {"source": source, "destination": dest}
    (await ollama.post(f"/api/copy", json=data)).raise_for_status()


async def load_model(model):
    data = {"model": model}
    (await ollama.post(f"/api/generate", json=data)).raise_for_status()


async def mark_as_healthy():
    open(HEALTH_FILE, "w").close()


async def main():
    async with timer("Waiting for Ollama to start"):
        await wait_for_startup()

    for model, alias in [
        (OLLAMA_CHAT_MODEL, "chat-model"),
        (OLLAMA_VISION_MODEL, "vision-model"),
        (OLLAMA_EMBEDDING_MODEL, "embedding-model"),
    ]:
        if model:
            async with timer(f"Pulling model {model}"):
                await pull_model(model)

            async with timer(f"Creating alias for {model}: {alias}"):
                await create_alias(model, alias)

    if model_to_load := (OLLAMA_CHAT_MODEL or OLLAMA_VISION_MODEL):
        async with timer(f"Loading model {model_to_load} into memory"):
            await load_model(model_to_load)

    await mark_as_healthy()


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
