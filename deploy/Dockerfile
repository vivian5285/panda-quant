# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Create non-root user for build stage
RUN addgroup -S buildgroup && adduser -S builduser -G buildgroup

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

# Set proper permissions
RUN chown -R builduser:buildgroup /app && \
    chmod -R 755 /app

# Generate Prisma client
USER builduser
RUN npx prisma generate

# Copy source code
COPY --chown=builduser:buildgroup admin-api .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built files from builder
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/shared ./shared

# Install production dependencies
RUN npm install --production

# Set proper permissions
RUN chown -R appuser:appgroup /app && \
    chmod -R 755 /app && \
    chmod -R +x /app/dist

# Expose port
EXPOSE 3000

# Switch to non-root user
USER appuser

# Start application with tsconfig-paths support
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"] 