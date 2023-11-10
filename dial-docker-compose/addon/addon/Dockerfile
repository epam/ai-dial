FROM python:3.11-alpine AS builder

RUN apk update && apk add git
RUN git clone https://github.com/openai/plugins-quickstart.git

FROM python:3.11-alpine
COPY --from=builder /plugins-quickstart /plugins-quickstart

WORKDIR /plugins-quickstart
RUN pip install -r requirements.txt

# Replace localhost with host name
RUN sed -i 's/localhost/addon/g' .well-known/ai-plugin.json
RUN sed -i 's/localhost/addon/g' openapi.yaml

EXPOSE 5003
CMD ["python", "main.py"]
