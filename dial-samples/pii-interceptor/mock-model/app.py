"""A stand-in model for the PII interceptor sample.

It replies with two parts:

1. Your message, echoed back verbatim. The interceptor de-anonymizes this on
   the way out, so you get your original text.
2. What this "model" actually received, with the placeholder brackets swapped
   for guillemets so the interceptor does not de-anonymize them.

Part 2 is the point: it shows the redacted text that left your machine.
"""

import uvicorn
from aidial_sdk import DIALApp
from aidial_sdk.chat_completion import ChatCompletion, Request, Response

SEPARATOR = "--- the model received ---"


class MockModel(ChatCompletion):
    async def chat_completion(
        self, request: Request, response: Response
    ) -> None:
        received = request.messages[-1].content or ""
        # Swap brackets so the interceptor's de-anonymization does not match.
        shown = received.replace("[", "«").replace("]", "»")

        with response.create_single_choice() as choice:
            choice.append_content(f"{received}\n\n{SEPARATOR}\n{shown}")


app = DIALApp()
app.add_chat_completion("mock-model", MockModel())

if __name__ == "__main__":
    uvicorn.run(app, port=5000, host="0.0.0.0")
