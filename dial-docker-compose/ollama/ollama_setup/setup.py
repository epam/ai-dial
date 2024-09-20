import asyncio
from contextlib import asynccontextmanager
import os
import sys
import time
import asyncio
from ollama import AsyncClient
from tqdm import tqdm

OLLAMA_URL = os.getenv("OLLAMA_URL")
if OLLAMA_URL is None:
    raise RuntimeError("OLLAMA_URL env var isn't set")

OLLAMA_CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL")
OLLAMA_VISION_MODEL = os.getenv("OLLAMA_VISION_MODEL")
OLLAMA_EMBEDDING_MODEL = os.getenv("OLLAMA_EMBEDDING_MODEL")

HEALTH_FILE = "/healthy"


class Writer:
    @classmethod
    def write(cls, s: str):
        # NOTE: every tqdm progress bar update is deliberately ended with "\n",
        # otherwise one wouldn't see the bar running in console upon running `docker compose up`.
        if s in ["\n", ""]:
            return
        print(s.rstrip(), file=sys.stderr, flush=True, end="\n")

    @classmethod
    def flush(cls):
        sys.stderr.flush()


print_info = Writer.write

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


async def wait_for_startup():
    attempt = 0
    while True:
        attempt += 1
        try:
            await AsyncClient(host=OLLAMA_URL, timeout=5).ps()
        except Exception:
            print_info(f"[{attempt:>3}] Waiting for Ollama to start...")
            await asyncio.sleep(5)
        else:
            break


async def pull_model(client: AsyncClient, model: str):
    response = await client.pull(model, stream=True)

    progress_bar = None
    prev_status = None

    async for chunk in response:
        status = chunk["status"]
        total = chunk.get("total")
        completed = chunk.get("completed")

        if status != prev_status and total:
            prev_status = status
            progress_bar = tqdm(
                total=total,
                unit="B",
                unit_scale=True,
                desc=f"[{status}]",
                mininterval=1,
                file=Writer,
            )

        if completed and total and progress_bar:
            progress_bar.n = completed
            progress_bar.update(n=0)

        if total and total == completed and progress_bar:
            progress_bar.close()
            progress_bar = None

        if not completed and not total:
            print_info(f"[{status}]")


async def create_health_mark():
    open(HEALTH_FILE, "w").close()


async def main():
    client = AsyncClient(host=OLLAMA_URL, timeout=300)

    async with timer("Waiting for Ollama to start"):
        await wait_for_startup()

    for model, alias in [
        (OLLAMA_CHAT_MODEL, "chat-model"),
        (OLLAMA_VISION_MODEL, "vision-model"),
        (OLLAMA_EMBEDDING_MODEL, "embedding-model"),
    ]:
        if model:
            async with timer(f"Pulling model {model}"):
                await pull_model(client, model)

            async with timer(f"Creating alias for {model}: {alias}"):
                await client.copy(model, alias)

    if model_to_load := (OLLAMA_CHAT_MODEL or OLLAMA_VISION_MODEL):
        async with timer(f"Loading model {model_to_load} into memory"):
            await client.generate(model_to_load)

    await create_health_mark()

    print_info("The Ollama server is up and running.")


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
