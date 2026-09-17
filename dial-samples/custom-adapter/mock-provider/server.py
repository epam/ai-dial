"""A stand-in AI provider with a deliberately non-OpenAI API.

It accepts {"prompt": ..., "max_length": ...} and returns
{"generated_text": ..., "tokens_used": ..., "served_by": ...}, so the adapter
has something real to translate.

Two things make it useful as a test double:

1. It requires an `api-key` header matching its own EXPECTED_KEY. Each instance
   gets a different key, so a request only succeeds if the adapter forwarded
   the key belonging to the upstream it was routed to.
2. It reports its own name in `served_by`, so a caller can see which upstream
   DIAL Core balanced the request onto.
"""

import os

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

UPSTREAM_NAME = os.environ.get("UPSTREAM_NAME", "provider")
EXPECTED_KEY = os.environ.get("EXPECTED_KEY", "")

app = FastAPI()


class GenerateRequest(BaseModel):
    prompt: str
    max_length: int = 512


class GenerateResponse(BaseModel):
    generated_text: str
    tokens_used: int
    served_by: str


@app.post("/generate")
async def generate(
    req: GenerateRequest, api_key: str = Header(default="", alias="api-key")
) -> GenerateResponse:
    if api_key != EXPECTED_KEY:
        raise HTTPException(
            status_code=401,
            detail=f"{UPSTREAM_NAME} rejected the API key",
        )

    response_text = f"Mock response to: {req.prompt[:200]}"
    return GenerateResponse(
        generated_text=response_text,
        tokens_used=len(response_text.split()),
        served_by=UPSTREAM_NAME,
    )
