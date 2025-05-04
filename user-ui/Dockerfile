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
        vite@5.1.4 \
        rollup@3.29.4 \
        typescript@5.3.3 \
        @types/node@20.5.0 \
        @types/react@18.2.0 \
        @types/react-dom@18.2.0 \
        @types/react-router-dom@5.3.3 && \
    echo "Installing production dependencies..." && \
    npm install --save \
        @emotion/react@11.11.3 \
        @emotion/styled@11.11.0 && \
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
FROM nginx:alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 