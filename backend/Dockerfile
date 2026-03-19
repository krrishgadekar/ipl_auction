# ═══════════════════════════════════════════════════════════════
# IPL Auction 2026 — Backend Dockerfile
# Builds Node.js API + Prisma + PostgreSQL client
# ═══════════════════════════════════════════════════════════════

FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Install curl for healthcheck
RUN apk add --no-cache curl

EXPOSE 5000

# Startup: push → conditional seed → start server
CMD ["sh", "-c", "echo '🏏 Syncing Prisma schema...' && npx prisma db push --accept-data-loss && echo '🌱 Checking if seed needed...' && node prisma/seed.js && echo '🚀 Starting server...' && node server.js"]
