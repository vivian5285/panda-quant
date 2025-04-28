# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first
COPY admin-api/package*.json ./
COPY admin-api/tsconfig.json ./

# Install all dependencies first
RUN npm install && \
    npm install -g typescript tsconfig-paths && \
    npm install --save-dev @types/mongoose @types/bcryptjs @types/express @types/cors @types/jsonwebtoken @types/node && \
    npm install mongoose bcryptjs express cors jsonwebtoken && \
    npm install -g prisma --unsafe-perm && \
    npm install prisma --save-dev --unsafe-perm

# Copy shared module
COPY shared ./shared/
WORKDIR /app/shared
RUN npm install && npm install typescript && npx tsc

# Back to main directory
WORKDIR /app

# Copy prisma schema
COPY admin-api/prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY admin-api .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/shared ./shared

# Install production dependencies
RUN npm install --production

# Expose port
EXPOSE 3000

# Start application with tsconfig-paths support
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"] 