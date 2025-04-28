# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g typescript tsconfig-paths

# Copy shared module and build
COPY shared ./shared
WORKDIR /app/shared
RUN npm install
RUN npm run build

# Copy source files and build
WORKDIR /app
COPY prisma ./prisma/
COPY src ./src/
COPY tsconfig.json ./
COPY index.ts ./
COPY app.ts ./

# Generate Prisma client and build
RUN npx prisma generate
RUN npx tsc

# Production stage
FROM node:18-alpine

WORKDIR /app/user-api

# Copy package files and install production dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/shared ./shared

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8083/health || exit 1

# Expose port
EXPOSE 8083

# Start the application
CMD ["node", "dist/index.js"] 