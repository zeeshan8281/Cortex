# ============================================================
# Dockerfile for EigenCompute deployment
# ============================================================
FROM --platform=linux/amd64 node:20-alpine
USER root
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["bash", "entrypoint.sh"]
