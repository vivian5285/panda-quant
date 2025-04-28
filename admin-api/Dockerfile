# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Install dependencies and set permissions
RUN npm install && \
    npm install -g typescript && \
    npm install --save-dev @types/node && \
    npm install -g prisma && \
    chmod -R 755 /app && \
    chown -R node:node /app

# Copy source code
COPY . .

# Generate Prisma client
USER node
RUN npx prisma generate

# Build admin-api
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm install --production && \
    npm install -g prisma && \
    chmod -R 755 /app && \
    chown -R node:node /app

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8081

# Expose port
EXPOSE 8081

# Start the application
USER node
CMD ["node", "dist/index.js"] 