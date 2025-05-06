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
RUN npm install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产环境镜像
FROM nginx:alpine

# 安装 curl 用于健康检查
RUN apk add --no-cache curl

# 复制 nginx 配置
COPY docker/nginx/admin-ui.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 3003

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:3003/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"] 