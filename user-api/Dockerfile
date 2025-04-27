# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy shared directory
COPY ../shared ./shared

# Build shared directory
WORKDIR /app/shared
RUN npm install
RUN npm install -g typescript
RUN npm install --save-dev @types/bcryptjs @types/express @types/jsonwebtoken @types/node
RUN npx tsc --project tsconfig.json

# Build user-api
WORKDIR /app/user-api
COPY package*.json ./
COPY prisma ./prisma/
COPY src ./src/
COPY tsconfig.json ./

# Install dependencies
RUN npm install
RUN npm install -g typescript tsconfig-paths
RUN npx prisma generate
RUN npx tsc --project tsconfig.json --resolveJsonModule --esModuleInterop

# Production stage
FROM node:18-alpine

WORKDIR /app/user-api

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/user-api/dist ./dist
COPY --from=builder /app/shared/dist ../shared/dist
COPY --from=builder /app/user-api/node_modules/.prisma ./node_modules/.prisma

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8083/health || exit 1

# Expose port
EXPOSE 8083

# Start the application
CMD ["node", "dist/index.js"] 