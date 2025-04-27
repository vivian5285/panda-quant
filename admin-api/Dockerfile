# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy shared directory
COPY shared ./shared

# Build shared directory
WORKDIR /app/shared
RUN npm install
RUN npm install -g typescript
RUN npm install --save-dev @types/bcryptjs @types/express @types/jsonwebtoken @types/node
RUN npx tsc --project tsconfig.json

# Build admin-api
WORKDIR /app/admin-api
COPY admin-api/package*.json ./
COPY admin-api/prisma ./prisma/
COPY admin-api/src ./src/
COPY admin-api/tsconfig.json ./

# Install dependencies
RUN npm install
RUN npm install -g typescript
RUN npx prisma generate
RUN npx tsc --project tsconfig.json --resolveJsonModule --esModuleInterop

# Production stage
FROM node:18-alpine

WORKDIR /app/admin-api

# Copy package files
COPY admin-api/package*.json ./
COPY admin-api/prisma ./prisma/

# Install production dependencies
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/admin-api/dist ./dist
COPY --from=builder /app/shared/dist ../shared/dist
COPY --from=builder /app/admin-api/node_modules/.prisma ./node_modules/.prisma

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "dist/index.js"] 