# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install && npm install -g typescript tsconfig-paths prisma

# Copy source code
COPY . .

# Generate Prisma client
RUN prisma generate

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

# Set environment variables
ARG MONGODB_USER_URI
ARG REDIS_USER_URL
ARG JWT_SECRET

ENV MONGODB_USER_URI=${MONGODB_USER_URI}
ENV REDIS_USER_URL=${REDIS_USER_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"] 