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
RUN pip install requests==2.31.0
RUN pip install openai==1.9.0
RUN pip install httpx==0.27.2
RUN pip install langchain-openai==0.0.3

WORKDIR /app
COPY . /app

RUN adduser -u 1001 --disabled-password --gecos "" appuser
RUN chown -R appuser /app
USER appuser

ENV PYDEVD_DISABLE_FILE_VALIDATION=1

RUN chmod +x run_notebooks.sh
CMD ["./run_notebooks.sh"]
