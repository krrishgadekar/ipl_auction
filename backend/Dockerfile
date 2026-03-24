# ═══════════════════════════════════════════════════════════════
# IPL Auction 2026 — Backend Dockerfile (Optimized for Render)
# ═══════════════════════════════════════════════════════════════

FROM node:20-alpine AS base
WORKDIR /app

# Install system dependencies for Prisma
RUN apk add --no-cache curl openssl

# Install ALL dependencies first to allow Prisma generation
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and Prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Prune dev dependencies after generation
RUN npm prune --omit=dev

# The app listens on the port provided by the PORT env var (standard for Render)
# Render default is usually 10000

# Startup: start server immediately
CMD ["sh", "-c", "echo '🚀 Starting server...' && node server.js"]
