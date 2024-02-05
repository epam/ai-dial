import json
import os
import uuid
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
import time

app = FastAPI()

API_KEY = os.environ.get("API_KEY")

if API_KEY is None:
    raise ValueError("API_KEY environment variable not set")


@app.post("/openai/deployments/{model}/chat/completions")
async def process_completion(model: str, request: Request):
    api_key = request.headers.get("api-key")

    if api_key is None:
        raise HTTPException(status_code=403, detail="API key not provided")

    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

    if model not in ["gpt-35-turbo", "gpt-4"]:
        raise HTTPException(status_code=404, detail="Model not found")

    body = await request.json()
    stream = body.get("stream", False)

    content = body["messages"][-1]["content"]

    message_key = "message" if not stream else "delta"

    response_payload = {
        "id": str(uuid.uuid4()),
        "object": "chat.completion" if not stream else "chat.completion.chunk",
        "created": int(time.time()),
        "model": model,
        "choices": [
            {
                "index": 0,
                message_key: {
                    "role": "assistant",
                    "content": content,
                },
                "finish_reason": "stop",
            }
        ],
        "usage": {
            "prompt_tokens": 1,
            "completion_tokens": 1,
            "total_tokens": 2,
        },
    }

    if stream:

        def generate_stream():
            yield f"data: {json.dumps(response_payload)}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(generate_stream(), media_type="text/event-stream")
    else:
        return JSONResponse(content=response_payload)
