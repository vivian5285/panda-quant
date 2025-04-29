# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Install dependencies
RUN npm install -g npm@latest && \
    npm install --legacy-peer-deps && \
    npm install -g typescript && \
    npm install prisma --save-dev

# Copy source code
COPY . .

# Generate Prisma client
RUN prisma generate

# Build admin-api
RUN npm run build

# Debug: List files after build
RUN echo "=== Builder stage files ===" && \
    ls -la /app && \
    echo "=== Builder stage dist files ===" && \
    ls -la /app/dist

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install -g npm@latest && \
    npm install --production --legacy-peer-deps && \
    npm install prisma --save-dev

# Copy built files from build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/index.js"] 