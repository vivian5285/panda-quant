# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Install dependencies step by step
RUN npm config set registry https://registry.npmmirror.com && \
    npm cache clean --force && \
    npm install --legacy-peer-deps || (echo "npm install failed" && exit 1)

RUN npm install -g typescript@5.4.2 || (echo "typescript install failed" && exit 1)

RUN npm install prisma@5.10.0 --save-dev || (echo "prisma install failed" && exit 1)

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate || (echo "prisma generate failed" && exit 1)

# Build admin-api
RUN npm run build || (echo "build failed" && exit 1)

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

# Install production dependencies step by step
RUN npm config set registry https://registry.npmmirror.com && \
    npm cache clean --force && \
    npm install --omit=dev --legacy-peer-deps || (echo "production npm install failed" && exit 1)

RUN npm install prisma@5.10.0 --save-dev || (echo "production prisma install failed" && exit 1)

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