# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy shared directory first
COPY shared ./shared
WORKDIR /app/shared
RUN npm install
RUN npm install -g typescript
RUN npm install --save-dev @types/bcryptjs @types/express @types/jsonwebtoken @types/node
RUN npx tsc --project tsconfig.json

# Setup admin-api
WORKDIR /app/admin-api
COPY admin-api/package*.json ./
COPY admin-api/prisma ./prisma/
COPY admin-api/src ./src/
COPY admin-api/tsconfig.json ./
RUN npm install
RUN npm install -g typescript

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript code
RUN npx tsc --project tsconfig.json --resolveJsonModule --esModuleInterop

# Production stage
FROM node:18-alpine

WORKDIR /app/admin-api

# Copy package files and install production dependencies
COPY admin-api/package*.json ./
COPY admin-api/prisma ./prisma/
RUN npm install --production

# Copy built files and dependencies
COPY --from=builder /app/admin-api/dist ./dist
COPY --from=builder /app/shared/dist ../shared/dist
COPY --from=builder /app/admin-api/node_modules/.prisma ./node_modules/.prisma

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
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 