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
RUN npm install -g npm@9.8.1 && \
    npm cache clean --force && \
    npm install --legacy-peer-deps && \
    npm install prisma@5.10.0 --save-dev

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build admin-api
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm install -g npm@9.8.1 && \
    npm cache clean --force && \
    npm install --omit=dev --legacy-peer-deps && \
    npm install prisma@5.10.0 --save-dev

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