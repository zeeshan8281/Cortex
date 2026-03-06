# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:22 AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
# NEXT_STANDALONE=true tells next.config.ts to use output:'standalone' for this Docker build
ENV NEXT_STANDALONE=true
RUN npm run build

# ── Stage 2: runner ───────────────────────────────────────────────────────────
# Use Debian (not Alpine) — EigenCompute's kms-client binary requires glibc
FROM --platform=linux/amd64 node:22 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Standalone output bundles the server and all deps
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# docker-entrypoint.sh — standard exec passthrough
# ecloud CLI replaces this ENTRYPOINT with compute-source-env.sh at deploy time
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# App startup script — becomes CMD after ecloud wraps the entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["/app/entrypoint.sh"]
