FROM node:18-alpine

WORKDIR /app

# 安装构建依赖
RUN apk add --no-cache python3 make g++

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install && \
    npm install --save-dev @types/node @types/redis && \
    npm install --save redis

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"] 