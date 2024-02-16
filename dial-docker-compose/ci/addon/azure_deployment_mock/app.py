import json
import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from responses import responses, create_response

app = FastAPI()

API_KEY = os.environ.get("API_KEY")

if API_KEY is None:
    raise ValueError("API_KEY environment variable not set")

response_idx = 0


@app.post("/openai/deployments/{model}/chat/completions")
async def process_completion(model: str, request: Request):
    api_key = request.headers.get("api-key")

    if api_key is None:
        raise HTTPException(status_code=401, detail="API key not provided")

    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

    body = await request.json()
    stream = body.get("stream", False)

    if not stream:
        raise HTTPException(
            status_code=400, detail="Non-streaming mode isn't supported"
        )

    global response_idx

    response_payload = create_response(responses[response_idx], model)
    response_idx = (response_idx + 1) % len(responses)

    def generate_stream():
        yield f"data: {json.dumps(response_payload)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate_stream(), media_type="text/event-stream")
