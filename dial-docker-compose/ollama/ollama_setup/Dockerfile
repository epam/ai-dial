FROM python:3.11-alpine

RUN apk --no-cache add curl

WORKDIR /app
COPY * /app
RUN pip install -r requirements.txt

EXPOSE 5000

HEALTHCHECK --interval=10s --timeout=1s --start-period=10s --retries=10 \
  CMD curl --fail http://localhost:5000/health || exit 1

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
