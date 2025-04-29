# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Update npm and install dependencies
RUN npm install -g npm@11.3.0 && \
    npm cache clean --force && \
    npm install --legacy-peer-deps && \
    npm install -g typescript@5.4.2 && \
    npm install prisma@5.10.0 --save-dev

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build admin-api
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Update npm and install production dependencies
RUN npm install -g npm@11.3.0 && \
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