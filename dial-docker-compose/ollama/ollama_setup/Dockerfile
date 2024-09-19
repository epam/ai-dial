FROM python:3.11-alpine

WORKDIR /app
COPY * /app
RUN pip install -r requirements.txt

CMD ["sh", "-c", "python setup.py && tail -f /dev/null"]
