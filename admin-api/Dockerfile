# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY src ./src/
COPY tsconfig.json ./

# Copy shared module
COPY shared ./shared

# Install dependencies
RUN npm install
RUN npm install -g typescript
RUN npx prisma generate

# Build shared module first
WORKDIR /app/shared
RUN npm install
RUN npm run build

# Build admin-api
WORKDIR /app
RUN npx tsc --project tsconfig.json --resolveJsonModule --esModuleInterop

# Production stage
FROM node:18-alpine

WORKDIR /app/admin-api

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY shared ./shared/

# Install production dependencies
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${ADMIN_API_PORT:-8081}/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=${ADMIN_API_PORT:-8081}

# Expose port
EXPOSE ${ADMIN_API_PORT:-8081}

# Start the application
CMD ["node", "dist/index.js"] 