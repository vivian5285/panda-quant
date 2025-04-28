# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy shared module first
COPY shared ./shared/
WORKDIR /app/shared
RUN npm install && npm install typescript && npx tsc

# Copy package files
WORKDIR /app
COPY admin-api/package*.json ./
COPY admin-api/prisma ./prisma/
COPY admin-api/tsconfig.json ./

# Install dependencies including dev dependencies for type declarations
RUN npm install && \
    npm install -g typescript tsconfig-paths prisma && \
    npm install --save-dev @types/mongoose @types/bcryptjs @types/express && \
    chmod -R 777 /app/node_modules/.prisma && \
    chmod -R 777 /app/node_modules/.bin

# Copy source code
COPY admin-api .

# Generate Prisma client
RUN npx prisma generate

# Build application with path aliases support
RUN npx tsc

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