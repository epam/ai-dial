FROM python:3.11-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Required for jupyter
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    make \
    zeromq-dev

RUN pip install jupyter

COPY requirements.txt .
RUN python -m pip install -r requirements.txt

WORKDIR /app
COPY . /app

RUN adduser -u 1001 --disabled-password --gecos "" appuser
RUN chown -R appuser /app
USER appuser

ENV PYDEVD_DISABLE_FILE_VALIDATION=1

RUN chmod +x run_notebooks.sh
CMD ["./run_notebooks.sh"]
