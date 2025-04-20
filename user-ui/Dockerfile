# Build stage
FROM node:20 AS build

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Clean up and install dependencies
RUN rm -rf node_modules package-lock.json && \
    npm install --legacy-peer-deps && \
    npm install --legacy-peer-deps \
    chart.js \
    react-chartjs-2 \
    @types/chart.js \
    @types/react-chartjs-2 \
    @types/react \
    @types/react-dom \
    typescript

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 