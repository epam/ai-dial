import re
from typing_extensions import override
from aidial_interceptors_sdk.chat_completion.base import (
    ChatCompletionInterceptor,
)
from aidial_interceptors_sdk.utils.not_given import NotGiven


class PIIRedactorInterceptor(ChatCompletionInterceptor):
    replacements: dict[str, str] = {}
    reverse_replacements: dict[str, str] = {}
    counter: int = 0

    PII_PATTERNS: dict[str, str] = {
        "EMAIL": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
        "PHONE": r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b",
        "SSN": r"\b\d{3}-\d{2}-\d{4}\b",
    }

    def _anonymize(self, text: str) -> str:
        for label, pattern in self.PII_PATTERNS.items():
            for match in re.finditer(pattern, text):
                original = match.group()
                if original not in self.replacements:
                    self.counter += 1
                    placeholder = f"[{label}_{self.counter}]"
                    self.replacements[original] = placeholder
                    self.reverse_replacements[placeholder] = original
                text = text.replace(original, self.replacements[original])
        return text

    def _deanonymize(self, text: str) -> str:
        for placeholder, original in self.reverse_replacements.items():
            text = text.replace(placeholder, original)
        return text

    @override
    async def on_request_message(self, path, message: dict) -> list[dict]:
        if content := message.get("content"):
            message["content"] = self._anonymize(content)
        return [message]

    @override
    async def on_response_message(
        self, path, message: dict | NotGiven | None
    ) -> dict | NotGiven | None:
        if isinstance(message, dict):
            if content := message.get("content"):
                message["content"] = self._deanonymize(content)
        return message
