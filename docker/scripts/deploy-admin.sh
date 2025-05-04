#!/bin/bash

# 设置错误时退出
set -e

# 设置日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 设置错误处理函数
handle_error() {
    log "错误: $1"
    log "正在回滚..."
    cd "$DOCKER_DIR"
    docker compose -f docker-compose.admin.yml down || true
    exit 1
}

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$DOCKER_DIR")"

# 设置 Docker Hub 用户名
DOCKER_USERNAME="vivian5285"

# 切换到docker目录
cd "$DOCKER_DIR" || handle_error "无法切换到 Docker 目录"

# 加载环境变量
if [ -f .env ]; then
    set -a
    source .env || handle_error "无法加载环境变量"
    set +a
fi

log "开始部署管理后台服务..."

# 检查并停止占用端口的进程
log "检查并停止占用端口的进程..."
for port in 3000 80 27017 6379; do
    pid=$(lsof -t -i:$port)
    if [ ! -z "$pid" ]; then
        log "端口 $port 被进程 $pid 占用，正在停止..."
        kill -9 $pid || true
    fi
done

# 停止并删除旧容器
log "停止并删除旧容器..."
docker compose -f docker-compose.admin.yml down || true

# 清理 Docker 缓存
log "清理 Docker 缓存..."
docker system prune -f || handle_error "清理 Docker 缓存失败"

# 修复管理API的类型问题
log "修复管理API的类型问题..."
cd "$PROJECT_DIR/admin-api" || handle_error "无法切换到 admin-api 目录"

# 安装必要的类型定义
log "安装必要的类型定义..."
npm install --save-dev @types/jest @types/mocha @types/express @types/node || handle_error "安装类型定义失败"

# 修改 tsconfig.json 跳过类型检查
log "修改 tsconfig.json..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "lib": ["es2018", "esnext.asynciterable"],
    "skipLibCheck": true,
    "sourceMap": true,
    "outDir": "./dist",
    "moduleResolution": "node",
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "resolveJsonModule": true,
    "baseUrl": "."
  },
  "exclude": ["node_modules"],
  "include": ["./src/**/*.ts"]
}
EOF

# 修改 package.json 中的构建脚本
log "修改 package.json 构建脚本..."
sed -i 's/"build": "tsc"/"build": "tsc --skipLibCheck"/g' package.json || handle_error "修改 package.json 失败"

# 返回docker目录
cd "$DOCKER_DIR" || handle_error "无法切换到 Docker 目录"

# 构建管理后台 API 镜像
log "构建管理后台 API 镜像..."
cd "$PROJECT_DIR/admin-api" || handle_error "无法切换到 admin-api 目录"
docker build --no-cache -t ${DOCKER_USERNAME}/panda-quant-admin-api -f "$DOCKER_DIR/Dockerfile.admin-api" . || handle_error "构建 API 镜像失败"
cd "$DOCKER_DIR" || handle_error "无法切换到 Docker 目录"

# 构建管理后台 UI 镜像
log "构建管理后台 UI 镜像..."
cd "$PROJECT_DIR/admin-ui" || handle_error "无法切换到 admin-ui 目录"

# 确保目录权限正确
log "设置目录权限..."
chmod -R 755 . || handle_error "设置目录权限失败"

# 确保 nginx 配置文件存在
if [ ! -f nginx.conf ]; then
    log "创建 nginx 配置文件..."
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
        proxy_pass http://admin-api:3000;
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
log "开始构建 UI 镜像..."
docker build --no-cache -t ${DOCKER_USERNAME}/panda-quant-admin-ui -f "$DOCKER_DIR/Dockerfile.admin-ui" . || handle_error "构建 UI 镜像失败"

# 推送镜像到 Docker Hub
log "推送镜像到 Docker Hub..."
docker push ${DOCKER_USERNAME}/panda-quant-admin-api || handle_error "推送 API 镜像失败"
docker push ${DOCKER_USERNAME}/panda-quant-admin-ui || handle_error "推送 UI 镜像失败"

# 返回docker目录
cd "$DOCKER_DIR" || handle_error "无法切换到 Docker 目录"

# 修改 docker-compose 文件中的镜像名称
log "更新 docker-compose 文件..."
sed -i "s|image: panda-quant-admin-api|image: ${DOCKER_USERNAME}/panda-quant-admin-api|g" docker-compose.admin.yml || handle_error "更新 docker-compose 文件失败"
sed -i "s|image: panda-quant-admin-ui|image: ${DOCKER_USERNAME}/panda-quant-admin-ui|g" docker-compose.admin.yml || handle_error "更新 docker-compose 文件失败"

# 启动管理后台服务
log "启动管理后台服务..."
docker compose -f docker-compose.admin.yml up -d || handle_error "启动服务失败"

# 等待服务启动并检查健康状态
log "等待服务启动并检查健康状态..."
for i in {1..30}; do
    if curl -s http://localhost:3000/health | grep -q "ok"; then
        log "服务已成功启动"
        break
    fi
    if [ $i -eq 30 ]; then
        handle_error "服务启动超时"
    fi
    log "等待服务启动... ($i/30)"
    sleep 2
done

# 检查服务状态
log "检查服务状态..."
docker compose -f docker-compose.admin.yml ps || handle_error "检查服务状态失败"

log "管理后台服务部署完成" 