FROM python:3.11-alpine

WORKDIR /app
COPY * /app
RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
