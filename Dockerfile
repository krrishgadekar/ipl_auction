# ═══════════════════════════════════════════════════════════════
# IPL Auction 2026 — Frontend Dockerfile (Next.js Standalone)
# ═══════════════════════════════════════════════════════════════

FROM node:20-alpine AS base

# ── Build Stage ───────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source
COPY . .

# Build with API URL injected at build time
ARG NEXT_PUBLIC_API_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# ── Production Stage ──────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
