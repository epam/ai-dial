import logging
import sys
import time
from contextlib import asynccontextmanager


class Writer:
    @classmethod
    def write(cls, s: str):
        # NOTE: every tqdm progress bar update is deliberately ended with "\n",
        # otherwise one wouldn't see the bar running in console upon running `docker compose up`.
        if s in ["\n", ""]:
            return
        print(s.strip(), file=sys.stderr, flush=True, end="\n")

    @classmethod
    def flush(cls):
        sys.stderr.flush()


print_info = Writer.write


@asynccontextmanager
async def timer(name: str):
    print_info(f"[{name}] Starting...")
    start = time.perf_counter()
    yield
    elapsed = time.perf_counter() - start
    print_info(f"[{name}] Finished in {elapsed:.2f} seconds")


class HealthFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find("/health") == -1


logging.getLogger("uvicorn.access").addFilter(HealthFilter())
