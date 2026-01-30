# ============================================
# PRODUCTION DOCKERFILE - NUNGGU/KITA
# Multi-stage build for Backend and Frontend
# ============================================

# ============================================
# Stage 1: Base Node.js image
# ============================================
FROM node:22-alpine AS base

# Install dependencies for native modules and Prisma
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# ============================================
# Stage 2: Backend Dependencies
# ============================================
FROM base AS backend-deps

WORKDIR /app/backend

# Copy package files
COPY backend/package.json backend/package-lock.json* ./

# Install all dependencies (including devDependencies for Prisma generate)
RUN npm ci --include=dev

# ============================================
# Stage 3: Backend Builder
# ============================================
FROM base AS backend-builder

WORKDIR /app/backend

# Copy dependencies from deps stage
COPY --from=backend-deps /app/backend/node_modules ./node_modules

# Copy backend source code
COPY backend/ .

# Generate Prisma client (dummy URL for build time only)
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate

# ============================================
# Stage 4: Backend Production
# ============================================
FROM base AS backend

ENV NODE_ENV=production
# General Configuration
ENV PORT=8000
ENV NETWORK=sepolia
# Base Sepolia (Testnet)
ENV BASE_SEPOLIA_RPC=https://sepolia.base.org
ENV MOCK_USDC_ADDRESS=0x00dcEE3921A5BDf4Baa6bd836D8Bf88cE9cd0bF1
ENV MOCK_OPTIONBOOK_ADDRESS=0x79F320b0b657BfBB20a619600e1Fda721026EB1c
ENV KITA_VAULT_ADDRESS_SEPOLIA=0x1cF7e8fF49cd61D7AAB9850BaC106E0947c31326
ENV GROUP_VAULT_ADDRESS_SEPOLIA=0x9B2b628b1bad3C9983A2E6C0170185d289489c6e
# Base Mainnet (Production)
ENV BASE_MAINNET_RPC=https://mainnet.base.org
ENV KITA_VAULT_ADDRESS_MAINNET=0x0000000000000000000000000000000000000000
ENV GROUP_VAULT_ADDRESS_MAINNET=0x0000000000000000000000000000000000000000

WORKDIR /app

COPY --from=backend-builder /app/backend ./

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

RUN chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Expose backend port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

# Start the backend server
CMD ["npm", "run", "start"]

# ============================================
# Stage 5: Frontend Dependencies
# ============================================
FROM base AS frontend-deps

WORKDIR /app/frontend

# Copy package files
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies
RUN npm ci

# ============================================
# Stage 6: Frontend Builder
# ============================================
FROM base AS frontend-builder

WORKDIR /app/frontend

# Copy dependencies
COPY --from=frontend-deps /app/frontend/node_modules ./node_modules

# Copy frontend source code
COPY frontend/ .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js application
RUN npm run build

# ============================================
# Stage 7: Frontend Production
# ============================================
FROM base AS frontend

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=frontend-builder /app/frontend/public ./public

# Set correct permissions for prerender cache
RUN mkdir -p .next && chown nextjs:nodejs .next

# Copy built Next.js standalone output
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose frontend port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start the Next.js server
CMD ["node", "server.js"]

# ============================================
# Default target: backend
# Build with: docker build --target backend -t nunggu-backend .
# Build with: docker build --target frontend -t nunggu-frontend .
# ============================================
