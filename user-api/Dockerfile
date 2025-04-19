# 构建阶段
FROM node:20 AS builder

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 复制 package 文件
COPY package*.json ./

# 安装依赖和 TypeScript
RUN npm install && \
    npm install -g typescript && \
    npm install typescript --save-dev

# 复制源代码
COPY . .

# 确保 tsc 有执行权限并构建应用
RUN chmod -R 755 ./node_modules/.bin && \
    npx typescript --version && \
    npx tsc

# 生产阶段
FROM node:20

WORKDIR /app

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["npm", "start"] 