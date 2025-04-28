# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy shared module first
COPY shared ./shared

# Build shared module
WORKDIR /app/shared
RUN chmod -R 777 .
RUN npm install
RUN chmod -R 777 node_modules
RUN npm install typescript
RUN npx tsc

# Copy admin-api files
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
COPY src ./src/
COPY tsconfig.json ./

# Install dependencies and type definitions
RUN npm install
RUN npm install -g typescript
RUN npm install --save-dev @types/mongoose @types/bcryptjs @types/express @types/node @types/cors @types/jest @types/jsonwebtoken @types/node-cron @types/pg
RUN npm install mongoose bcryptjs express cors jsonwebtoken node-cron pg redis winston
RUN npx prisma generate

# Verify TypeScript installation and dependencies
RUN tsc --version
RUN ls -la node_modules/@types
RUN ls -la node_modules/mongoose
RUN ls -la node_modules/bcryptjs
RUN ls -la node_modules/express

# Copy shared module build output
RUN mkdir -p node_modules/shared
RUN cp -r /app/shared/dist/* node_modules/shared/

# Build admin-api
RUN npx tsc

# Production stage
FROM node:18-alpine

WORKDIR /app/admin-api

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY shared ./shared/
COPY tsconfig.json ./

# Install production dependencies and TypeScript
RUN npm install --production
RUN npm install -g typescript
RUN npm install mongoose bcryptjs express cors jsonwebtoken node-cron pg redis winston

# Copy shared module build output
RUN mkdir -p node_modules/shared
RUN cp -r /app/admin-api/shared/dist/* node_modules/shared/

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/shared/dist ./shared/dist

# Set permissions
RUN chown -R node:node /app/admin-api && \
    chmod -R 777 /app/admin-api

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