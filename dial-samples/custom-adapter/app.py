import uvicorn
from aidial_sdk import DIALApp

from adapter import MockProviderAdapter

app = DIALApp()
app.add_chat_completion("my-adapter", MockProviderAdapter())

if __name__ == "__main__":
    uvicorn.run(app, port=5000, host="0.0.0.0")
