# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY ../admin-api/package*.json ./
COPY ../admin-api/prisma ./prisma/
COPY ../shared ./shared/

# Install dependencies
RUN npm install && npm install -g typescript tsconfig-paths prisma

# Copy source code
COPY ../admin-api .

# Generate Prisma client
RUN prisma generate

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