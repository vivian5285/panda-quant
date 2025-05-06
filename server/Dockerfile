FROM node:20-alpine AS builder

WORKDIR /app

# 安装构建依赖
RUN apk add --no-cache \
    python3 \
    make \
    g++

# 设置 npm 配置
RUN npm config set fetch-retries 5 && \
    npm config set fetch-timeout 300000

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产环境镜像
FROM node:20-alpine

WORKDIR /app

# 安装生产环境依赖
RUN apk add --no-cache python3 make g++

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 只安装生产环境依赖
RUN npm ci --only=production

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3005

# 启动应用
CMD ["node", "dist/index.js"] 