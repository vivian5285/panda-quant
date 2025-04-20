# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache python3 make g++

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install && \
    npm install typescript --save-dev

# 确保 TypeScript 安装成功
RUN ls -la ./node_modules/.bin/tsc && \
    ./node_modules/.bin/tsc --version

# 复制源代码
COPY . .

# 设置权限并构建应用
RUN chmod -R 755 ./node_modules/.bin && \
    ./node_modules/.bin/tsc

# 生产阶段
FROM node:20-alpine

WORKDIR /app

# 安装生产环境依赖
RUN apk add --no-cache python3 make g++

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 重新安装 bcrypt 以确保正确编译
RUN npm rebuild bcrypt --build-from-source

# 暴露端口
EXPOSE 3001

# 安装 ts-node
RUN npm install -g ts-node

# 启动应用
CMD ["node", "dist/app.js"] 