FROM node:18-alpine
WORKDIR /app
COPY . .

# Install dependencies and type declarations
RUN npm install && \
    npm install typescript && \
    npm install --save-dev @types/mongoose @types/bcryptjs @types/express @types/node @types/cors && \
    npm install mongoose bcryptjs express cors && \
    chmod -R 755 /app && \
    npx tsc 