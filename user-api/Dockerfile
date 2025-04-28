# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy shared module and build
COPY shared ./shared
WORKDIR /app/shared
RUN npm install
RUN npm install typescript
RUN npm install --save-dev @types/mongoose @types/bcryptjs @types/express @types/node @types/cors @types/jest @types/jsonwebtoken @types/node-cron @types/pg
RUN npm install mongoose bcryptjs express cors jsonwebtoken node-cron pg
RUN npx tsc

# Copy package files and install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g typescript tsconfig-paths
RUN npm install --save-dev @types/mongoose @types/bcryptjs @types/express @types/node @types/cors @types/jest @types/jsonwebtoken @types/node-cron @types/pg
RUN npm install mongoose bcryptjs express cors jsonwebtoken node-cron pg

# Copy source files and build
COPY prisma ./prisma/
COPY src ./src/
COPY tsconfig.json ./
COPY index.ts ./
COPY app.ts ./

# Generate Prisma client and build
RUN npx prisma generate
RUN npx tsc

# Debug: List files after build
RUN echo "=== Builder stage files ===" && \
    ls -la /app && \
    echo "=== Builder stage dist files ===" && \
    ls -la /app/dist

# Production stage
FROM node:18-alpine

WORKDIR /app/user-api

# Copy package files and install production dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --production
RUN npm install --save-dev @types/mongoose @types/bcryptjs @types/express @types/node @types/cors @types/jest @types/jsonwebtoken @types/node-cron @types/pg
RUN npm install mongoose bcryptjs express cors jsonwebtoken node-cron pg

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/shared ./shared

# Debug: List files after copy
RUN echo "=== Production stage files ===" && \
    ls -la /app/user-api && \
    echo "=== Production stage dist files ===" && \
    ls -la /app/user-api/dist

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"] 