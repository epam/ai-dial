# Custom adapter

A worked example of a DIAL adapter: it puts a provider with a non-OpenAI API
behind the DIAL Unified API. This is the finished project from
[Tutorial: custom adapter](../../docs_v2/3.building-with-dial/3.adapters/1.tutorial-custom-adapter.md).

The provider runs twice, as `provider-eu` and `provider-us`, each with its own
API key. DIAL Core picks one per request and passes it to the adapter in the
`X-UPSTREAM-ENDPOINT` and `X-UPSTREAM-KEY` headers, so the adapter holds no
provider address and no key of its own.

## Run it

```bash
docker compose up --build
```

Then send a request:

```bash
curl -s http://localhost:8080/openai/deployments/mock-model/chat/completions \
  -H "Api-Key: dial_api_key" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello from curl"}]}'
```

The reply ends with the upstream that served it. Repeat the command and it
alternates between `provider-eu` and `provider-us`.

`mock-model-bad-key` is the same adapter and the same provider with a wrong key
in `config.json`. It fails with `401` and the provider's own reason.

## What is here

| Path | Purpose |
|---|---|
| `adapter.py` | The adapter — translates between the Unified API and the provider's format |
| `app.py` | Serves the adapter as a DIAL deployment |
| `config.json` | Registers the adapter as a model with two upstreams |
| `docker-compose.yml` | DIAL Core, Redis, the adapter, and two provider upstreams |
| `mock-provider/` | Stand-in provider, so no provider account is needed |

No provider account or API key is required.

## Tests

This adapter is exercised on every pull request by
[`how_to_use_a_custom_adapter.ipynb`](../../dial-cookbook/examples/how_to_use_a_custom_adapter.ipynb)
in the cookbook, which asserts that the format translation works, that DIAL Core
balances across both upstreams, and that a wrong key is rejected. The
`run-notebooks` CI job fails if any of that stops being true.

To run that check locally:

```bash
cd ../../dial-cookbook/ci
docker compose up --build --abort-on-container-exit --exit-code-from test
```
