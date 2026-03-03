# ============================================================
# Dockerfile for EigenCompute deployment
# ============================================================
# EigenCompute runs containers in Intel TDX TEE enclaves.
# Requirements:
#   - Target: linux/amd64
#   - Must run as root (TEE requirement — no USER directive)
# ============================================================

# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY app/ ./app/
COPY components/ ./components/
COPY hooks/ ./hooks/
COPY lib/ ./lib/
COPY types/ ./types/
COPY next.config.ts ./
COPY public/ ./public/
RUN npm run build

# --- Production stage ---
FROM node:20-alpine
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built output
COPY --from=builder /app/out ./out
COPY server.js ./

# EigenCompute TEE requires root — do NOT add a USER directive
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
