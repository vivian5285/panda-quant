# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies including TypeScript and required packages
RUN npm install && \
    npm install -g typescript && \
    npm install --save-dev @types/node && \
    npm install --save-dev @types/node-cron && \
    npm install --save-dev @types/axios && \
    npm install --save-dev @prisma/client && \
    npm install --save-dev node-cron && \
    npm install --save-dev axios && \
    chmod -R 755 /usr/local/lib/node_modules/typescript/bin/tsc

# Copy Prisma schema first
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --production && \
    npm install --save @prisma/client && \
    npm install --save node-cron && \
    npm install --save axios

# Copy built files and Prisma schema
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Generate Prisma client in production
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"] 