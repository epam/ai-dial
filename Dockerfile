FROM node:22-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN curl -L -o quarto.deb https://quarto.org/download/latest/quarto-linux-amd64.deb \
    && apt-get update \
    && apt-get install -y ./quarto.deb \
    && rm quarto.deb

COPY package*.json ./
RUN npm ci

RUN npm install --global docusaurus-init

COPY . .

ENV BASE_URL=/

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]