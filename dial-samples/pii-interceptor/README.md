# PII-redacting interceptor

A worked example of a DIAL interceptor that redacts personally identifiable
information before a request reaches the model, and restores it in the
response. This is the finished project from
[Tutorial: PII-redacting interceptor](../../docs_v2/3.building-with-dial/2.interceptors/1.tutorial-pii-interceptor.md).

## Run it

```bash
docker compose up --build
```

Then send a message containing PII:

```bash
curl http://localhost:8080/openai/deployments/protected-model/chat/completions \
  -H "Api-Key: dial_api_key" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"My email is john.doe@example.com and my phone is 555-123-4567."}]}'
```

The reply shows both what you get back (PII restored) and what the model
actually received (PII redacted).

## What is here

| Path | Purpose |
|---|---|
| `interceptor.py` | The interceptor — regex detection, anonymize and de-anonymize |
| `app.py` | Serves the interceptor as a DIAL deployment |
| `config.json` | Declares the interceptor and assigns it to a model |
| `docker-compose.yml` | DIAL Core, Redis, the interceptor, and a stand-in model |
| `mock-model/` | Stand-in model, so no provider API key is needed |

No provider account or API key is required.

## Tests

This interceptor is exercised on every pull request by
[`how_to_use_an_interceptor.ipynb`](../../dial-cookbook/examples/how_to_use_an_interceptor.ipynb)
in the cookbook, which runs it against DIAL Core and asserts that the model
receives redacted text while the caller gets the original values back. The
`run-notebooks` CI job fails if redaction stops working.

To run that check locally:

```bash
cd ../../dial-cookbook/ci
docker compose up --build --abort-on-container-exit --exit-code-from test
```
