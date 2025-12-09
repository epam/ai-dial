import os
import json
from pathlib import Path
from typing import Dict, Any
from fastapi import FastAPI
from pydantic import BaseModel

from aidial_sdk import DIALApp
from aidial_sdk.chat_completion import ChatCompletion, Request, Response

DIAL_URL = os.environ.get("DIAL_URL", "http://core:8080")
SETTINGS_FILE = Path(os.environ.get("CUSTOM_APP_SETTINGS_FILE", "settings.json"))


class SettingsRequest(BaseModel):
    count: int = 1


def load_settings() -> Dict[str, Any]:
    try:
        if SETTINGS_FILE.exists():
            return json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
    except Exception:
        pass
    return {"count": 1}


def save_settings(data: Dict[str, Any]) -> None:
    SETTINGS_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=4), encoding="utf-8")


api = FastAPI(title="Custom App Config API")


@api.get("/config", response_model=SettingsRequest)
def get_config() -> SettingsRequest:
    return SettingsRequest(**load_settings())


@api.put("/config")
def update_config(req: SettingsRequest):
    save_settings(req.dict())


class CustomApplication(ChatCompletion):
    async def chat_completion(self, request: Request, response: Response) -> None:
        properties = load_settings()
        count = int(properties.get("count", 1))

        last_user_message = request.messages[-1]
        text = last_user_message.content or ""

        with response.create_single_choice() as choice:
            choice.append_content("\n".join([text] * max(count, 1)))


dial = DIALApp(dial_url=DIAL_URL)
dial.add_chat_completion("custom-app", CustomApplication())

app = FastAPI(title="Custom App (Completion API + Custom API)")

app.mount("/api/v1", api)

app.mount("/", dial)
