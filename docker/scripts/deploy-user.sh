#!/bin/bash

# 设置执行权限
chmod +x "$0"

# 设置环境变量
export NODE_ENV=production
export PORT=3001
export MONGODB_URI=mongodb://mongo:27017/user
export REDIS_URI=redis://redis:6379

# 设置 Docker Hub 用户名
DOCKER_USERNAME="vivian5285"

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$DOCKER_DIR")"

# 切换到docker目录
cd "$DOCKER_DIR"

# 加载环境变量
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

echo "开始部署用户服务..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 停止并删除旧容器
echo "停止并删除旧容器..."
docker compose -f docker-compose.user.yml down || true

# 清理 Docker 缓存
echo "清理 Docker 缓存..."
docker system prune -f

# 清理 npm 缓存和 node_modules
echo "清理 npm 缓存和 node_modules..."
cd "$PROJECT_DIR/user-ui"
rm -rf node_modules
npm cache clean --force

# 修复用户 API 的类型问题
echo "修复用户 API 的类型问题..."
cd "$PROJECT_DIR/user-api"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "错误: npm 未安装"
    exit 1
fi

# 安装必要的类型定义
echo "安装必要的类型定义..."
npm install --save-dev @types/node @types/express @types/mongoose @types/jsonwebtoken

# 修改 package.json 中的构建脚本
echo "修改构建脚本..."
npm pkg set scripts.build="tsc --skipLibCheck"

# 返回docker目录
cd "$DOCKER_DIR"

# 构建用户 API 镜像
echo "构建用户 API 镜像..."
docker build --no-cache -t ${DOCKER_USERNAME}/panda-quant-user-api -f Dockerfile.user-api .

# 构建用户 UI 镜像
echo "构建用户 UI 镜像..."
cd "$PROJECT_DIR/user-ui"

# 确保目录权限正确
chmod -R 755 .

# 确保 nginx 配置文件存在
if [ ! -f nginx.conf ]; then
    echo "创建 nginx 配置文件..."
    cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;

    # Root directory and index files
    root /usr/share/nginx/html;
    index index.html index.htm;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://user-api:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF
fi

# 构建 UI 镜像
echo "开始构建 UI 镜像..."
cd "$PROJECT_DIR/user-ui"
docker build --no-cache -t ${DOCKER_USERNAME}/panda-quant-user-ui -f "$DOCKER_DIR/Dockerfile.user-ui" .

# 推送镜像到 Docker Hub
echo "推送镜像到 Docker Hub..."
docker push ${DOCKER_USERNAME}/panda-quant-user-api
docker push ${DOCKER_USERNAME}/panda-quant-user-ui

# 返回docker目录
cd "$DOCKER_DIR"

# 修改 docker-compose 文件中的镜像名称
sed -i "s|image: panda-quant-user-api|image: ${DOCKER_USERNAME}/panda-quant-user-api|g" docker-compose.user.yml
sed -i "s|image: panda-quant-user-ui|image: ${DOCKER_USERNAME}/panda-quant-user-ui|g" docker-compose.user.yml

# 启动服务
echo "启动服务..."
docker compose -f docker-compose.user.yml up -d

# 检查服务状态
echo "检查服务状态..."
docker compose -f docker-compose.user.yml ps

echo "用户服务部署完成" 