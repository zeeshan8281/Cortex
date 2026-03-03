# ============================================================
# Dockerfile for EigenCompute deployment
# ============================================================
# EigenCompute runs containers in Intel TDX TEE enclaves.
# Requirements:
#   - Target: linux/amd64
#   - Must run as root (TEE requirement — no USER directive)
# ============================================================

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["bash", "entrypoint.sh"]
