# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies with debug info
RUN echo "Installing dependencies..." && \
    npm install --legacy-peer-deps --no-audit && \
    echo "Installing type definitions..." && \
    npm install --save-dev \
        @types/dotenv@^8.2.0 \
        @types/node@^20.5.0 \
        @types/express@^4.17.17 \
        @types/jsonwebtoken@^9.0.0 \
        @types/redis@^4.0.11 \
        @types/uuid@^9.0.0 \
        @types/winston@^2.4.4 && \
    echo "Dependencies installed successfully"

# Copy source code
COPY . .

# Debug: List files and show npm version
RUN echo "Node version:" && node --version && \
    echo "NPM version:" && npm --version && \
    echo "Files in /app:" && ls -la

# Build the app
RUN echo "Building application..." && \
    npm run build && \
    echo "Build completed successfully"

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files and dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Set permissions
RUN chown -R node:node /app && \
    chmod -R 755 /app

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 