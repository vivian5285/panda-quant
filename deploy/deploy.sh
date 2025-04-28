#!/bin/bash

# 设置错误时退出
set -e

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 日志函数
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# 设置工作目录
WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 确保在正确的目录下运行
cd "$WORKSPACE_DIR"
log "当前工作目录: $(pwd)"

# 创建日志目录
mkdir -p "$WORKSPACE_DIR/logs"
LOG_FILE="$WORKSPACE_DIR/logs/deploy_$(date +%Y%m%d_%H%M%S).log"

# 设置日志输出
exec 1> >(tee -a "$LOG_FILE")
exec 2>&1

# 检查依赖
check_dependencies() {
    log "检查系统依赖..."
    command -v docker >/dev/null 2>&1 || { error "需要安装 Docker"; }
    command -v node >/dev/null 2>&1 || { error "需要安装 Node.js"; }
    command -v npm >/dev/null 2>&1 || { error "需要安装 npm"; }
    log "系统依赖检查完成"
}

# 检查端口占用
check_port() {
    local port=$1
    local service=$2
    if lsof -i :$port > /dev/null 2>&1; then
        error "$service 所需的端口 $port 已被占用"
    fi
}

# 检查容器状态
check_container_status() {
    local container_name=$1
    if [ "$(docker ps -q -f name=$container_name)" ]; then
        log "$container_name 容器运行正常"
        return 0
    else
        warn "$container_name 容器未运行"
        return 1
    fi
}

# 创建 Docker 网络
setup_network() {
    log "设置 Docker 网络..."
    if ! docker network ls | grep -q panda-quant-network; then
        docker network create panda-quant-network
        log "创建 panda-quant-network 网络"
    else
        log "panda-quant-network 网络已存在"
    fi
}

# 创建数据卷
setup_volumes() {
    log "设置数据卷..."
    docker volume create mongodb_data || true
    docker volume create redis_data || true
    log "数据卷设置完成"
}

# 加载环境变量
load_env() {
    log "加载环境变量..."
    if [ -f "$WORKSPACE_DIR/.env" ]; then
        source "$WORKSPACE_DIR/.env"
    else
        # 创建默认环境变量文件
        cat > "$WORKSPACE_DIR/.env" << 'EOL'
MONGODB_USERNAME=admin
MONGODB_PASSWORD=Wl528586*
MONGODB_DATABASE=admin
REDIS_PASSWORD=Wl528586*
ADMIN_API_PORT=3001
USER_API_PORT=3002
ADMIN_UI_PORT=80
USER_UI_PORT=81
SHARED_PORT=3000

# 域名配置
DOMAIN=pandatrade.space
ADMIN_SUBDOMAIN=admin
ADMIN_API_SUBDOMAIN=admin-api
API_SUBDOMAIN=api
EOL
        source "$WORKSPACE_DIR/.env"
        log "创建默认环境变量文件"
    fi
}

# 清理旧容器和镜像
cleanup() {
    log "清理旧容器和镜像..."
    docker stop $(docker ps -a -q) 2>/dev/null || true
    docker rm $(docker ps -a -q) 2>/dev/null || true
    docker rmi $(docker images -q) 2>/dev/null || true
    log "清理完成"
}

# 构建 shared 模块
build_shared() {
    log "构建 shared 模块..."
    cd "$WORKSPACE_DIR/shared"
    
    # 清理之前的构建和源文件
    rm -rf dist
    rm -rf src
    
    # 创建新的目录结构
    mkdir -p src/types src/models
    
    # 复制源文件
    if [ -f "types/auth.ts" ]; then
        cp types/auth.ts src/types/
    fi
    
    if [ -f "models/user.ts" ]; then
        cp models/user.ts src/models/
    fi
    
    if [ -f "models/asset.ts" ]; then
        cp models/asset.ts src/models/
    fi
    
    if [ -f "models/fee.ts" ]; then
        cp models/fee.ts src/models/
    fi
    
    # 创建 package.json
    cat > package.json << 'EOL'
{
  "name": "shared",
  "version": "1.0.0",
  "description": "Shared types and models",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf dist",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "typescript": "^4.9.5"
  }
}
EOL
    
    # 创建 tsconfig.json
    cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "declaration": true,
    "moduleResolution": "node",
    "typeRoots": ["./node_modules/@types"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
EOL
    
    # 安装依赖并构建
    npm install
    npm run build
    
    # 确保构建成功
    if [ ! -d "dist" ]; then
        error "shared 模块构建失败"
    fi
    
    cd "$WORKSPACE_DIR"
}

# 更新导入路径
update_imports() {
    local target_dir=$1
    
    log "更新导入路径..."
    cd "$target_dir"
    
    # 替换所有可能的相对路径导入
    find . -type f -name "*.ts" -exec sed -i \
        -e 's|from "../../shared/|from "@shared/|g' \
        -e 's|from "../shared/|from "@shared/|g' \
        -e 's|from "./shared/|from "@shared/|g' \
        -e 's|from "shared/|from "@shared/|g' \
        {} \;
    
    cd "$WORKSPACE_DIR"
}

# 部署 shared 模块
deploy_shared() {
    log "开始部署 shared 模块..."
    
    # 检查端口
    check_port $SHARED_PORT "Shared 模块"
    
    # 构建 shared 模块
    build_shared
    
    # 创建 Dockerfile
    cat > Dockerfile << 'EOL'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
EOL
    
    # 构建并启动 Docker 容器
    log "构建并启动 shared 模块容器..."
    docker build -t panda-quant-shared .
    docker run -d \
        --name panda-quant-shared \
        --network panda-quant-network \
        -p $SHARED_PORT:3000 \
        panda-quant-shared
    
    # 检查容器状态
    check_container_status panda-quant-shared
    
    log "shared 模块部署完成！"
}

# 部署管理端 API
deploy_admin_api() {
    log "开始部署管理端 API..."
    
    # 检查端口
    check_port $ADMIN_API_PORT "管理端 API"
    
    # 构建 shared 模块
    build_shared
    
    # 复制 shared 模块到 admin-api
    log "复制 shared 模块到 admin-api..."
    cd "$WORKSPACE_DIR"
    rm -rf admin-api/shared
    cp -r shared admin-api/
    
    # 更新 tsconfig.json
    log "更新 tsconfig.json..."
    cd "$WORKSPACE_DIR/admin-api"
    
    # 创建新的 tsconfig.json
    cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": ".",
    "resolveJsonModule": true,
    "declaration": true,
    "moduleResolution": "node",
    "typeRoots": ["./node_modules/@types"],
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["./shared/dist/*"]
    }
  },
  "include": [
    "src/**/*",
    "models/**/*",
    "types/**/*",
    "interfaces/**/*",
    "utils/**/*",
    "services/**/*",
    "middleware/**/*",
    "routes/**/*",
    "controllers/**/*",
    "shared/dist/**/*",
    "index.ts",
    "app.ts"
  ]
}
EOL
    
    # 更新导入路径
    update_imports "$WORKSPACE_DIR/admin-api"
    
    # 安装依赖
    log "安装管理端 API 依赖..."
    npm install
    
    # 创建 Dockerfile
    cat > Dockerfile << 'EOL'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "start"]
EOL
    
    # 构建并启动 Docker 容器
    log "构建并启动管理端 API 容器..."
    docker build -t panda-quant-admin-api .
    docker run -d \
        --name panda-quant-admin-api \
        --network panda-quant-network \
        -p $ADMIN_API_PORT:3001 \
        -e MONGODB_URI=mongodb://$MONGODB_USERNAME:$MONGODB_PASSWORD@mongodb:27017/$MONGODB_DATABASE \
        -e REDIS_URI=redis://redis:6379 \
        panda-quant-admin-api
    
    # 检查容器状态
    check_container_status panda-quant-admin-api
    
    log "管理端 API 部署完成！"
}

# 部署管理端 UI
deploy_admin_ui() {
    log "开始部署管理端 UI..."
    
    # 检查端口
    check_port $ADMIN_UI_PORT "管理端 UI"
    
    cd "$WORKSPACE_DIR/admin-ui"
    
    # 安装依赖
    log "安装管理端 UI 依赖..."
    npm install
    
    # 创建 Dockerfile
    cat > Dockerfile << 'EOL'
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
EOL
    
    # 创建 nginx 配置
    cat > nginx.conf << 'EOL'
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://panda-quant-admin-api:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 'healthy\n';
    }
}
EOL
    
    # 构建并启动 Docker 容器
    log "构建并启动管理端 UI 容器..."
    docker build -t panda-quant-admin-ui .
    docker run -d \
        --name panda-quant-admin-ui \
        --network panda-quant-network \
        -p $ADMIN_UI_PORT:80 \
        panda-quant-admin-ui
    
    # 检查容器状态
    check_container_status panda-quant-admin-ui
    
    log "管理端 UI 部署完成！"
}

# 部署用户端 API
deploy_user_api() {
    log "开始部署用户端 API..."
    
    # 检查端口
    check_port $USER_API_PORT "用户端 API"
    
    # 构建 shared 模块
    build_shared
    
    # 复制 shared 模块到 user-api
    log "复制 shared 模块到 user-api..."
    cd "$WORKSPACE_DIR"
    rm -rf user-api/shared
    cp -r shared user-api/
    
    # 更新 tsconfig.json
    log "更新 tsconfig.json..."
    cd "$WORKSPACE_DIR/user-api"
    
    # 创建新的 tsconfig.json
    cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": ".",
    "resolveJsonModule": true,
    "declaration": true,
    "moduleResolution": "node",
    "typeRoots": ["./node_modules/@types"],
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["./shared/dist/*"]
    }
  },
  "include": [
    "src/**/*",
    "models/**/*",
    "types/**/*",
    "interfaces/**/*",
    "utils/**/*",
    "services/**/*",
    "middleware/**/*",
    "routes/**/*",
    "controllers/**/*",
    "shared/dist/**/*",
    "index.ts",
    "app.ts"
  ]
}
EOL
    
    # 更新导入路径
    update_imports "$WORKSPACE_DIR/user-api"
    
    # 安装依赖
    log "安装用户端 API 依赖..."
    npm install
    
    # 创建 Dockerfile
    cat > Dockerfile << 'EOL'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

CMD ["npm", "start"]
EOL
    
    # 构建并启动 Docker 容器
    log "构建并启动用户端 API 容器..."
    docker build -t panda-quant-user-api .
    docker run -d \
        --name panda-quant-user-api \
        --network panda-quant-network \
        -p $USER_API_PORT:3002 \
        -e MONGODB_URI=mongodb://$MONGODB_USERNAME:$MONGODB_PASSWORD@mongodb:27017/$MONGODB_DATABASE \
        -e REDIS_URI=redis://redis:6379 \
        panda-quant-user-api
    
    # 检查容器状态
    check_container_status panda-quant-user-api
    
    log "用户端 API 部署完成！"
}

# 部署用户端 UI
deploy_user_ui() {
    log "开始部署用户端 UI..."
    
    # 检查端口
    check_port $USER_UI_PORT "用户端 UI"
    
    cd "$WORKSPACE_DIR/user-ui"
    
    # 安装依赖
    log "安装用户端 UI 依赖..."
    npm install
    
    # 创建 Dockerfile
    cat > Dockerfile << 'EOL'
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 81

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:81/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
EOL
    
    # 创建 nginx 配置
    cat > nginx.conf << 'EOL'
server {
    listen 81;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://panda-quant-user-api:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 'healthy\n';
    }
}
EOL
    
    # 构建并启动 Docker 容器
    log "构建并启动用户端 UI 容器..."
    docker build -t panda-quant-user-ui .
    docker run -d \
        --name panda-quant-user-ui \
        --network panda-quant-network \
        -p $USER_UI_PORT:81 \
        panda-quant-user-ui
    
    # 检查容器状态
    check_container_status panda-quant-user-ui
    
    log "用户端 UI 部署完成！"
}

# 部署数据库
deploy_database() {
    log "开始部署数据库..."
    
    # 检查端口
    check_port 27017 "MongoDB"
    check_port 6379 "Redis"
    
    # 创建 MongoDB 容器
    log "创建 MongoDB 容器..."
    docker run -d \
        --name panda-quant-mongodb \
        --network panda-quant-network \
        -p 27017:27017 \
        -v mongodb_data:/data/db \
        -e MONGO_INITDB_ROOT_USERNAME=$MONGODB_USERNAME \
        -e MONGO_INITDB_ROOT_PASSWORD=$MONGODB_PASSWORD \
        -e MONGO_INITDB_DATABASE=$MONGODB_DATABASE \
        mongo:latest
    
    # 创建 Redis 容器
    log "创建 Redis 容器..."
    docker run -d \
        --name panda-quant-redis \
        --network panda-quant-network \
        -p 6379:6379 \
        -v redis_data:/data \
        -e REDIS_PASSWORD=$REDIS_PASSWORD \
        redis:alpine redis-server --requirepass $REDIS_PASSWORD
    
    # 检查容器状态
    check_container_status panda-quant-mongodb
    check_container_status panda-quant-redis
    
    log "数据库部署完成！"
}

# 部署 Nginx 反向代理
deploy_nginx() {
    log "开始部署 Nginx 反向代理..."
    
    # 检查端口
    check_port 80 "Nginx HTTP"
    check_port 443 "Nginx HTTPS"
    
    # 创建 nginx 配置目录
    mkdir -p "$WORKSPACE_DIR/nginx/conf.d"
    mkdir -p "$WORKSPACE_DIR/nginx/ssl"
    
    # 生成自签名证书
    log "生成临时自签名证书..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$WORKSPACE_DIR/nginx/ssl/temp.key" \
        -out "$WORKSPACE_DIR/nginx/ssl/temp.crt" \
        -subj "/CN=*.pandatrade.space" 2>/dev/null || true
    
    # 创建主配置文件
    cat > "$WORKSPACE_DIR/nginx/nginx.conf" << 'EOL'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    sendfile on;
    keepalive_timeout 65;
    
    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 包含所有虚拟主机配置
    include /etc/nginx/conf.d/*.conf;
}
EOL
    
    # 创建管理端配置
    cat > "$WORKSPACE_DIR/nginx/conf.d/admin.conf" << 'EOL'
server {
    listen 80;
    server_name $ADMIN_SUBDOMAIN.$DOMAIN;
    
    # 重定向 HTTP 到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name $ADMIN_SUBDOMAIN.$DOMAIN;
    
    # SSL 配置
    ssl_certificate /etc/nginx/ssl/temp.crt;
    ssl_certificate_key /etc/nginx/ssl/temp.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # 前端静态文件
    location / {
        proxy_pass http://panda-quant-admin-ui:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 健康检查
    location /health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 'healthy\n';
    }
}
EOL
    
    # 创建管理端 API 配置
    cat > "$WORKSPACE_DIR/nginx/conf.d/admin-api.conf" << 'EOL'
server {
    listen 80;
    server_name $ADMIN_API_SUBDOMAIN.$DOMAIN;
    
    # 重定向 HTTP 到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name $ADMIN_API_SUBDOMAIN.$DOMAIN;
    
    # SSL 配置
    ssl_certificate /etc/nginx/ssl/temp.crt;
    ssl_certificate_key /etc/nginx/ssl/temp.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # API 代理
    location / {
        proxy_pass http://panda-quant-admin-api:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 健康检查
    location /health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 'healthy\n';
    }
}
EOL
    
    # 创建用户端 API 配置
    cat > "$WORKSPACE_DIR/nginx/conf.d/api.conf" << 'EOL'
server {
    listen 80;
    server_name $API_SUBDOMAIN.$DOMAIN;
    
    # 重定向 HTTP 到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name $API_SUBDOMAIN.$DOMAIN;
    
    # SSL 配置
    ssl_certificate /etc/nginx/ssl/temp.crt;
    ssl_certificate_key /etc/nginx/ssl/temp.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # API 代理
    location / {
        proxy_pass http://panda-quant-user-api:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 健康检查
    location /health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 'healthy\n';
    }
}
EOL
    
    # 创建 Dockerfile
    cat > "$WORKSPACE_DIR/nginx/Dockerfile" << 'EOL'
FROM nginx:alpine

# 复制配置文件
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/*.conf /etc/nginx/conf.d/

# 创建 SSL 证书目录
RUN mkdir -p /etc/nginx/ssl

# 暴露端口
EXPOSE 80 443

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
EOL
    
    # 构建并启动 Nginx 容器
    log "构建并启动 Nginx 容器..."
    cd "$WORKSPACE_DIR/nginx"
    docker build -t panda-quant-nginx .
    docker run -d \
        --name panda-quant-nginx \
        --network panda-quant-network \
        -p 80:80 \
        -p 443:443 \
        -v "$WORKSPACE_DIR/nginx/conf.d:/etc/nginx/conf.d" \
        -v "$WORKSPACE_DIR/nginx/ssl:/etc/nginx/ssl" \
        panda-quant-nginx
    
    # 检查容器状态
    check_container_status panda-quant-nginx
    
    log "Nginx 反向代理部署完成！"
    log "注意：当前使用的是临时自签名证书，请按照以下步骤更新为正式证书："
    log "1. 申请 SSL 证书（可以使用 Let's Encrypt 或其他证书颁发机构）"
    log "2. 将证书文件复制到以下位置："
    log "   - 证书文件：$WORKSPACE_DIR/nginx/ssl/pandatrade.space.crt"
    log "   - 私钥文件：$WORKSPACE_DIR/nginx/ssl/pandatrade.space.key"
    log "3. 重启 Nginx 容器：docker restart panda-quant-nginx"
}

# 主函数
main() {
    local deploy_type=$1
    
    # 检查依赖
    check_dependencies
    
    # 加载环境变量
    load_env
    
    # 设置网络和数据卷
    setup_network
    setup_volumes
    
    case $deploy_type in
        "admin")
            deploy_shared
            deploy_admin_api
            deploy_admin_ui
            deploy_database
            deploy_nginx
            ;;
        "user")
            deploy_shared
            deploy_user_api
            deploy_user_ui
            deploy_database
            deploy_nginx
            ;;
        "all")
            deploy_shared
            deploy_admin_api
            deploy_admin_ui
            deploy_user_api
            deploy_user_ui
            deploy_database
            deploy_nginx
            ;;
        "cleanup")
            cleanup
            ;;
        *)
            error "请指定部署类型: admin, user, all 或 cleanup"
            ;;
    esac
}

# 执行主函数
main "$@" 