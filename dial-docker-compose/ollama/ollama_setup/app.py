import asyncio
from contextlib import asynccontextmanager
import os
import asyncio
from fastapi import FastAPI
from ollama import AsyncClient
from tqdm import tqdm
from tenacity import retry, stop_after_attempt

from utils import Writer, print_info, timer

OLLAMA_URL = os.getenv("OLLAMA_URL")
if OLLAMA_URL is None:
    raise RuntimeError("OLLAMA_URL env var isn't set")

OLLAMA_CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL")
OLLAMA_VISION_MODEL = os.getenv("OLLAMA_VISION_MODEL")
OLLAMA_EMBEDDING_MODEL = os.getenv("OLLAMA_EMBEDDING_MODEL")


async def wait_for_startup():
    attempts = 0
    while True:
        attempts += 1
        try:
            await AsyncClient(host=OLLAMA_URL, timeout=5).ps()
        except Exception:
            print_info(f"[{attempts:>3}] Waiting for Ollama to start...")
            await asyncio.sleep(5)
        else:
            break


@retry(stop=stop_after_attempt(5))
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


async def startup():
    print_info(f"OLLAMA_URL = {OLLAMA_URL}")
    print_info(f"OLLAMA_CHAT_MODEL = {OLLAMA_CHAT_MODEL}")
    print_info(f"OLLAMA_VISION_MODEL = {OLLAMA_VISION_MODEL}")
    print_info(f"OLLAMA_EMBEDDING_MODEL = {OLLAMA_EMBEDDING_MODEL}")

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

    print_info("The Ollama server is up and running.")


@asynccontextmanager
async def lifespan(app):
    await startup()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/health")
def health_check():
    return {"status": "ok"}
