# 构建阶段
FROM node:18-alpine AS builder

# 使用 root 用户
USER root

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖、全局 TypeScript 和类型定义
RUN npm install && \
    npm install -g typescript && \
    npm install --save-dev @types/express-rate-limit && \
    chmod +x /usr/local/bin/tsc && \
    chmod +x /usr/local/lib/node_modules/typescript/bin/tsc

# 复制项目文件
COPY . .

# 编译 TypeScript
RUN /usr/local/bin/tsc

# 生产阶段
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 从构建阶段复制编译后的文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# 只安装生产依赖
RUN npm install --production

# 暴露端口
EXPOSE 4000

# 启动服务
CMD ["node", "dist/index.js"] 