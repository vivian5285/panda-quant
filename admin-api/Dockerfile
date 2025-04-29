# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Install dependencies
RUN yarn install --frozen-lockfile && \
    yarn add prisma@5.10.0 --dev

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build admin-api
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN yarn install --production --frozen-lockfile && \
    yarn add prisma@5.10.0 --dev

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