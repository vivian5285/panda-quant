# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g typescript
RUN npm install --save-dev @types/mongoose @types/bcryptjs @types/express @types/node @types/cors @types/jest @types/jsonwebtoken @types/node-cron @types/pg @types/bcrypt @types/morgan @types/node-schedule @types/nodemailer @types/swagger-ui-express
RUN npm install mongoose bcryptjs express cors jsonwebtoken node-cron pg bcrypt helmet morgan express-rate-limit zod class-validator class-transformer ethers axios nodemailer winston node-schedule nanoid swagger-ui-express

# Copy source files and build
COPY . .

# Generate Prisma client and build
RUN npm install prisma --save-dev && \
    npm install -g prisma
RUN prisma generate

# Build TypeScript
RUN npx tsc --skipLibCheck

# Debug: List files after build
RUN echo "=== Builder stage files ===" && \
    ls -la /app && \
    echo "=== Builder stage dist files ===" && \
    ls -la /app/dist

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Expose port
EXPOSE 3002

# Start the application
CMD ["node", "dist/index.js"] 