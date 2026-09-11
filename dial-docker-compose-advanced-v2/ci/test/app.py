import asyncio
import logging
import os

import aiohttp
import backoff


def get_env(name: str) -> str:
    value = os.environ.get(name)
    if value is None:
        raise ValueError(f"'{name}' environment variable must be defined")
    return value


CORE_URL = get_env("CORE_URL")
KEYCLOAK_URL = get_env("KEYCLOAK_URL")

logging.basicConfig(level=logging.INFO)


@backoff.on_exception(
    backoff.expo,
    (aiohttp.ClientError, asyncio.TimeoutError),
    max_time=120,
)
async def check_reachable(url: str):
    timeout = aiohttp.ClientTimeout(total=10)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(url) as response:
            logging.info("%s -> %s", url, response.status)
            if response.status >= 500:
                raise RuntimeError(f"{url} responded with {response.status}")


async def tests():
    await check_reachable(f"{KEYCLOAK_URL}/realms/master")
    await check_reachable(f"{CORE_URL}/health")


if __name__ == "__main__":
    asyncio.run(tests())
