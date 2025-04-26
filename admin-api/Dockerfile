# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including TypeScript globally
RUN npm install && npm install -g typescript

# Copy source code
COPY . .

# Create prisma directory if it doesn't exist
RUN mkdir -p prisma

# Generate Prisma client
RUN if [ -f prisma/schema.prisma ]; then \
        echo "Prisma schema found, generating client..." && \
        npx prisma generate; \
    else \
        echo "No Prisma schema found, skipping client generation..." && \
        touch prisma/schema.prisma; \
    fi

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma/

# Set environment variables
ARG MONGODB_ADMIN_URI
ARG REDIS_ADMIN_URL
ARG JWT_SECRET

ENV MONGODB_ADMIN_URI=${MONGODB_ADMIN_URI}
ENV REDIS_ADMIN_URL=${REDIS_ADMIN_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 8081

# Start the app
CMD ["npm", "start"] 