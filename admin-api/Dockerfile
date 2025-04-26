# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install && npm install -g typescript

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/shared ./shared

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