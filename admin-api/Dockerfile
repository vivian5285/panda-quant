# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy shared module first
COPY shared ./shared

# Build shared module
WORKDIR /app/shared
RUN npm install && npm install typescript && npx tsc

# Copy admin-api files
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Install dependencies
RUN npm install && \
    npm install -g typescript && \
    npm install --save-dev @types/mongoose @types/bcryptjs @types/express @types/node @types/cors @types/jest @types/jsonwebtoken @types/node-cron @types/pg && \
    npm install mongoose bcryptjs express cors jsonwebtoken node-cron pg redis winston && \
    npm install -g prisma && \
    npm install prisma --save-dev

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build admin-api
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
COPY prisma ./prisma/
COPY shared ./shared/

# Install production dependencies
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/shared/dist ./shared/dist

# Set permissions
RUN chown -R node:node /app && \
    chmod -R 755 /app

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