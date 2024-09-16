#!/bin/sh
set -e

apk add --no-cache curl

until curl -s ${OLLAMA_URL}; do
  echo "Waiting for Ollama..."
  sleep 5
done

echo "Pulling $OLLAMA_URL..."
curl -vL --fail-with-body "$OLLAMA_URL/api/pull" -d "{\"name\": \"$OLLAMA_MODEL\", \"stream\": false}"

OLLAMA_MODEL_ALIAS=ollama-model

echo "Making alias for $OLLAMA_URL: $OLLAMA_MODEL_ALIAS..."
curl -vL --fail-with-body "$OLLAMA_URL/api/copy" -d "{\"source\": \"$OLLAMA_MODEL\", \"destination\": \"$OLLAMA_MODEL_ALIAS\"}"

echo "Loading the model into memory..."
curl -vL --fail-with-body "$OLLAMA_URL/api/generate" -d "{\"model\": \"$OLLAMA_MODEL_ALIAS\"}"

touch /healthy

tail -f /dev/null