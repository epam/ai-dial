FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

RUN npm install --global docusaurus-init

COPY . .

ENV BASE_URL=/

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
