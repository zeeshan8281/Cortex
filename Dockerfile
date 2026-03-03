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

ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
