import time
import uuid

# Response for pseudo count_tokens request
response1 = {
    "choices": [
        {
            "index": 0,
            "delta": {"role": "assistant", "content": "{\n"},
            "finish_reason": "length",
        }
    ],
    "usage": {"completion_tokens": 1, "prompt_tokens": 315, "total_tokens": 316},
}

content2 = """
{
  "commands": [
    {
      "command": "todo",
      "arguments": {
        "query": "Add 'buy milk', 'buy eggs', 'make omelette' to Anton's TODO list."
      }
    }
  ]
}
""".strip()

response2 = {
    "choices": [
        {
            "index": 0,
            "delta": {"role": "assistant", "content": content2},
            "finish_reason": "stop",
        }
    ],
    "usage": {"completion_tokens": 53, "prompt_tokens": 315, "total_tokens": 368},
}

content3 = """
```json
{
  "commands": [
    {
      "command": "addTodo",
      "arguments": {
        "todo": "buy milk",
        "username": "Anton"
      }
    },
    {
      "command": "addTodo",
      "arguments": {
        "todo": "buy eggs",
        "username": "Anton"
      }
    },
    {
      "command": "addTodo",
      "arguments": {
        "todo": "make omelette",
        "username": "Anton"
      }
    },
    {
      "command": "reply",
      "arguments": {
        "message": "Tasks 'buy milk', 'buy eggs', 'make omelette' have been added to Anton's TODO list."
      }
    }
  ]
}
```
""".strip()

response3 = {
    "choices": [
        {
            "index": 0,
            "delta": {"role": "assistant", "content": content3},
            "finish_reason": "stop",
        }
    ],
    "usage": {"completion_tokens": 167, "prompt_tokens": 368, "total_tokens": 535},
}

content4 = '{"commands": [{"command": "reply", "arguments": {"message": "Successfully added \'buy milk\', \'buy eggs\', and \'make omelette\' to Anton\'s TODO list."}}]}'

response4 = {
    "choices": [
        {
            "index": 0,
            "delta": {"role": "assistant", "content": content4},
            "finish_reason": "stop",
        }
    ],
    "usage": {"completion_tokens": 41, "prompt_tokens": 497, "total_tokens": 538},
}

# Response for pseudo count_tokens request
response5 = {
    "choices": [
        {
            "index": 0,
            "delta": {"role": "assistant", "content": '{"'},
            "finish_reason": "length",
        }
    ],
    "usage": {"completion_tokens": 1, "prompt_tokens": 400, "total_tokens": 401},
}

content6 = '{"commands": [{"command": "reply", "arguments": {"message": "Successfully added \'buy milk\', \'buy eggs\', and \'make omelette\' to your TODO list."}}]}'

response6 = {
    "choices": [
        {
            "index": 0,
            "delta": {"role": "assistant", "content": content6},
            "finish_reason": "stop",
        }
    ],
    "usage": {"completion_tokens": 40, "prompt_tokens": 400, "total_tokens": 440},
}


def create_response(body: dict, model: str) -> dict:
    return {
        "id": str(uuid.uuid4()),
        "object": "chat.completion.chunk",
        "created": int(time.time()),
        "model": model,
        "system_fingerprint": None,
        **body,
    }


responses = [
    response1,
    response2,
    response3,
    response4,
    response5,
    response6,
]
