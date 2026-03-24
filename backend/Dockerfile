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

# The app will listen on the port provided by the PORT env var (standard for Render)
# EXPOSE is not strictly needed for Render but helps for local documentation

# Startup: push → conditional seed → start server
CMD ["sh", "-c", "echo '🏏 Syncing Prisma schema...' && npx prisma db push --accept-data-loss && echo '🌱 Checking if seed needed...' && node prisma/seed.js && echo '🚀 Starting server...' && node server.js"]
