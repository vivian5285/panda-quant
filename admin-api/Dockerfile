# 构建阶段
FROM node:18-alpine AS builder

# 使用 root 用户
USER root

# 设置工作目录
WORKDIR /app

# 复制所有文件
COPY . .

# 安装依赖
RUN npm install

# 编译 TypeScript
RUN npm run build

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
EXPOSE 3000

# 启动服务
CMD ["node", "dist/index.js"] 