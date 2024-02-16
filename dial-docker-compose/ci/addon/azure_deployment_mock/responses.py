import json
import time
import uuid


def create_base_response(
    content: str,
    finish_reason: str,
    completion_tokens: str,
    prompt_tokens: str,
    total_tokens: str,
) -> dict:
    return {
        "choices": [
            {
                "index": 0,
                "delta": {"role": "assistant", "content": content},
                "finish_reason": finish_reason,
            }
        ],
        "usage": {
            "completion_tokens": completion_tokens,
            "prompt_tokens": prompt_tokens,
            "total_tokens": total_tokens,
        },
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


# Response to pseudo count_tokens request
response1 = create_base_response(
    content="{\n",
    finish_reason="length",
    completion_tokens=1,
    prompt_tokens=315,
    total_tokens=316,
)

commands2 = {
    "commands": [
        {
            "command": "todo",
            "arguments": {
                "query": "Add 'buy milk', 'buy eggs', 'make omelette' to Anton's TODO list."
            },
        }
    ]
}

response2 = create_base_response(
    content=json.dumps(commands2),
    finish_reason="stop",
    completion_tokens=53,
    prompt_tokens=315,
    total_tokens=368,
)

commands3 = {
    "commands": [
        {"command": "addTodo", "arguments": {"todo": "buy milk", "username": "Anton"}},
        {"command": "addTodo", "arguments": {"todo": "buy eggs", "username": "Anton"}},
        {
            "command": "addTodo",
            "arguments": {"todo": "make omelette", "username": "Anton"},
        },
        {
            "command": "reply",
            "arguments": {
                "message": "Tasks 'buy milk', 'buy eggs', 'make omelette' have been added to Anton's TODO list."
            },
        },
    ]
}

response3 = create_base_response(
    content=json.dumps(commands3),
    finish_reason="stop",
    completion_tokens=167,
    prompt_tokens=368,
    total_tokens=535,
)

commands4 = {
    "commands": [
        {
            "command": "reply",
            "arguments": {
                "message": "Successfully added 'buy milk', 'buy eggs', and 'make omelette' to Anton's TODO list."
            },
        }
    ]
}

response4 = create_base_response(
    content=json.dumps(commands4),
    finish_reason="stop",
    completion_tokens=41,
    prompt_tokens=497,
    total_tokens=538,
)

# Response to pseudo count_tokens request
response5 = create_base_response(
    content='{"',
    finish_reason="length",
    completion_tokens=1,
    prompt_tokens=400,
    total_tokens=401,
)

commands6 = {
    "commands": [
        {
            "command": "reply",
            "arguments": {
                "message": "Successfully added 'buy milk', 'buy eggs', and 'make omelette' to your TODO list."
            },
        }
    ]
}

response6 = create_base_response(
    content=json.dumps(commands6),
    finish_reason="stop",
    completion_tokens=40,
    prompt_tokens=400,
    total_tokens=440,
)


responses = [
    response1,
    response2,
    response3,
    response4,
    response5,
    response6,
]
