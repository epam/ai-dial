FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
      curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000
EXPOSE 8000

ENV DIAL_URL=http://core:8080 \
    CUSTOM_APP_SETTINGS_FILE=/app/settings.json

CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "8000"]
