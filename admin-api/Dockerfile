# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create prisma directory if it doesn't exist
RUN mkdir -p prisma

# Copy Prisma schema if it exists
COPY prisma/schema.prisma ./prisma/ || echo "No Prisma schema found"

# Generate Prisma client
RUN if [ -f prisma/schema.prisma ]; then \
        echo "Prisma schema found, generating client..." && \
        npx prisma generate; \
    else \
        echo "No Prisma schema found, skipping client generation..."; \
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

# Create prisma directory if it doesn't exist
RUN mkdir -p prisma

# Copy Prisma schema if it exists
COPY prisma/schema.prisma ./prisma/ || echo "No Prisma schema found"

# Generate Prisma client
RUN if [ -f prisma/schema.prisma ]; then \
        echo "Prisma schema found, generating client..." && \
        npx prisma generate; \
    else \
        echo "No Prisma schema found, skipping client generation..."; \
    fi

# Expose port
EXPOSE 8081

# Start the app
CMD ["npm", "start"] 