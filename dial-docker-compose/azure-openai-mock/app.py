import json
import uuid
from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
import time

app = FastAPI()


@app.post("/openai/deployments/{model}/chat/completions")
async def process_completion(
    model: str, request: Request, x_api_key: str = Header(None)
):
    if x_api_key != "azure-openai-mock-api-key":
        raise HTTPException(status_code=403, detail="Invalid API key")

    if model not in ["gpt-35-turbo", "gpt-4"]:
        raise HTTPException(status_code=404, detail="Model not found")

    body = await request.json()
    stream = body.get("stream", False)

    content = body["choice"][0]["messages"][0]["content"]

    response_payload = {
        "id": uuid.uuid4(),
        "object": "chat.completion" if not stream else "chat.completion.chunk",
        "created": int(time.time()),
        "model": model,
        "choices": [
            {
                "index": 0,
                "message": {
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
