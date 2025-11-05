import os
from pydantic import BaseModel
from aidial_sdk import DIALApp
from aidial_sdk.chat_completion import ChatCompletion, Request, Response


DIAL_URL = os.environ.get("DIAL_URL")


class SettingsRequest(BaseModel):
    count: int


class CustomApplication(ChatCompletion):
    async def chat_completion(
        self, request: Request, response: Response
    ) -> None:
        properties = await request.request_dial_application_properties()
        count = properties.get("count", 1)

        last_user_message = request.messages[-1]
        text = last_user_message.content or ""

        with response.create_single_choice() as choice:
            choice.append_content("\n".join([text] * count))


app = DIALApp(dial_url=DIAL_URL)
app.add_chat_completion("custom-app", CustomApplication())
