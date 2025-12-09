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

RUN pip install jupyter==1.1.1

# NOTE: for some reason jupyter doesn't run pip-installs inside the notebooks,
# so we have to repeat them here.
RUN pip install requests==2.32.3
RUN pip install openai==1.83.0
RUN pip install httpx==0.28.1
RUN pip install aidial-integration-langchain==0.1.0
RUN pip install langchain-openai==0.3.19

WORKDIR /app
COPY . /app

RUN adduser -u 1001 --disabled-password --gecos "" appuser
RUN chown -R appuser /app
USER appuser

ENV PYDEVD_DISABLE_FILE_VALIDATION=1

RUN chmod +x run_notebooks.sh
CMD ["./run_notebooks.sh"]
