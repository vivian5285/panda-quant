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
COPY . .

# Install dependencies
RUN npm install
RUN npm install -g typescript tsconfig-paths
RUN npx prisma generate
RUN npx tsc --project tsconfig.json --resolveJsonModule --esModuleInterop

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY user-api/package*.json ./user-api/
COPY user-api/prisma ./user-api/prisma/

# Install production dependencies
RUN cd user-api && npm install --production

# Copy built files from builder
COPY --from=builder /app/user-api/dist ./user-api/dist
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/user-api/node_modules/.prisma ./user-api/node_modules/.prisma

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

WORKDIR /app/user-api
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"] 