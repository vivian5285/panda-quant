# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Install dependencies
RUN npm install && \
    npm install -g typescript && \
    npm install --save-dev @types/node && \
    npm install prisma --save-dev

# Copy source code
COPY . .

# Set environment variables for Prisma
ENV MONGODB_ADMIN_URI=mongodb://admin:PandaQuant@2024@mongodb-admin:27017/panda-quant-admin?authSource=admin

# Generate Prisma client
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
    npm install prisma --save-dev

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8081
ENV MONGODB_ADMIN_URI=mongodb://admin:PandaQuant@2024@mongodb-admin:27017/panda-quant-admin?authSource=admin
ENV REDIS_URL=redis://:PandaQuant@2024@redis-admin:6379
ENV JWT_SECRET=PandaQuant@2024
ENV ENCRYPTION_KEY=PandaQuant@2024

# Expose port
EXPOSE 8081

# Start the application
CMD ["npm", "start"] 