# ═══════════════════════════════════════════════════════════════
# IPL Auction 2026 — Backend Dockerfile
# Builds Node.js API + Prisma + PostgreSQL client
# ═══════════════════════════════════════════════════════════════

FROM node:20-alpine AS base
WORKDIR /app

# Install ALL dependencies (prisma CLI is in devDeps but needed for generate + migrate)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Install curl for healthcheck
RUN apk add --no-cache curl

EXPOSE 5000

# NOTE: We do NOT prune devDeps because `prisma` CLI is needed at
# runtime for `prisma migrate deploy`. In a future optimization,
# move prisma to prod dependencies and prune here.

# Startup: migrate → conditional seed → start server
CMD sh -c "\
  echo '🏏 Running Prisma migrations...' && \
  npx prisma migrate deploy && \
  echo '🌱 Checking if seed needed...' && \
  node prisma/seed.js && \
  echo '🚀 Starting server...' && \
  node server.js"
