#!/bin/bash

# 设置错误时退出
set -e

# 设置日志文件
LOG_FILE="/var/log/panda-quant/deploy-user.log"
mkdir -p /var/log/panda-quant
touch $LOG_FILE

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# 错误处理函数
handle_error() {
    log "错误: $1"
    log "部署失败，请检查日志文件: $LOG_FILE"
    exit 1
}

# 检查命令执行结果
check_result() {
    if [ $? -ne 0 ]; then
        handle_error "$1"
    fi
}

# 设置当前部署目录和项目根目录
CURRENT_DIR=$(pwd)
PROJECT_ROOT=$(dirname "$CURRENT_DIR")

log "当前部署目录: $CURRENT_DIR"
log "项目根目录: $PROJECT_ROOT"

# 1. 配置环境变量
log "1. 配置环境变量..."
if [ ! -f .env ]; then
    cat > .env << EOF
# 应用配置
NODE_ENV=production

# 端口配置
USER_API_PORT=8082

# 域名配置
DOMAIN=pandatrade.space
USER_SUBDOMAIN=user
USER_API_SUBDOMAIN=user-api
USER_DOMAIN=user.pandatrade.space
USER_API_DOMAIN=user-api.pandatrade.space

# 数据库配置
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=Wl528586*
MONGO_URI=mongodb://admin:Wl528586*@mongodb:27017/admin

# Redis配置
REDIS_PASSWORD=Wl528586*
REDIS_URI=redis://:Wl528586*@redis:6379

# JWT配置
JWT_SECRET=Wl528586*

# Encryption key
ENCRYPTION_KEY=Wl528586*

# Network Configuration
NETWORK_NAME=panda-quant-network

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_RETENTION_DAYS=30
EOF
    log "环境变量文件创建成功"
else
    log "环境变量文件已存在，跳过创建"
fi

# 设置权限
chmod 600 .env
check_result "设置环境变量文件权限失败"

# 2. 检查 Docker 网络
log "2. 检查 Docker 网络..."
if ! docker network ls | grep -q panda-quant-network; then
    log "创建 Docker 网络..."
    docker network create panda-quant-network
    check_result "创建 Docker 网络失败"
else
    log "Docker 网络已存在，跳过创建"
fi

# 3. 安装依赖
log "3. 安装依赖..."
cd $PROJECT_ROOT/user-api

# 检查是否需要安装依赖
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    log "检测到依赖需要更新，开始安装..."
    # 使用更安全的方式清理 npm 缓存
    npm cache verify
    # 安装生产依赖
    npm install --legacy-peer-deps --no-audit
    check_result "安装依赖失败"
    # 安装开发依赖
    log "安装开发依赖..."
    npm install --save-dev @types/dotenv@8.2.0 --no-audit
    check_result "安装开发依赖失败"
    log "依赖安装完成"
else
    log "依赖已是最新，跳过安装"
fi

# 4. 构建应用
log "4. 构建应用..."
# 检查 TypeScript 配置文件
if [ ! -f "tsconfig.json" ]; then
    handle_error "tsconfig.json 文件不存在"
fi

# 检查源代码目录
if [ ! -d "src" ]; then
    handle_error "src 目录不存在"
fi

# 清理构建目录
log "清理构建目录..."
rm -rf dist
check_result "清理构建目录失败"

# 构建应用
log "开始构建应用..."
npm run build
check_result "构建应用失败"

# 检查构建结果
if [ ! -d "dist" ]; then
    handle_error "构建失败：dist 目录未生成"
fi

log "应用构建成功"

# 5. 启动服务
log "5. 启动服务..."
cd $CURRENT_DIR

# 停止并删除旧的容器
log "停止并删除旧的容器..."
# 强制停止并删除所有相关容器
docker-compose -f docker-compose.user.yml down --remove-orphans
check_result "停止旧容器失败"

# 确保所有相关容器都被删除
log "确保所有相关容器都被删除..."
docker rm -f panda-quant-user-api panda-quant-user-ui panda-quant-postgres panda-quant-redis 2>/dev/null || true

# 确保所有相关卷都被删除
log "清理旧的数据卷..."
docker volume rm postgres_data 2>/dev/null || true

# 构建并启动服务
log "构建并启动服务..."
docker-compose -f docker-compose.user.yml up -d --build
check_result "启动服务失败"

# 6. 等待服务启动
log "6. 等待服务启动..."

# 等待 MongoDB 就绪
log "等待 MongoDB 就绪..."
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if docker exec panda-quant-mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
        log "MongoDB 已就绪"
        break
    fi
    log "等待 MongoDB 就绪... (尝试 $attempt/$max_attempts)"
    sleep 5
    attempt=$((attempt + 1))
done
if [ $attempt -gt $max_attempts ]; then
    handle_error "MongoDB 启动超时"
fi

# 等待 Redis 就绪
log "等待 Redis 就绪..."
attempt=1
while [ $attempt -le $max_attempts ]; do
    if docker exec panda-quant-redis redis-cli ping >/dev/null 2>&1; then
        log "Redis 已就绪"
        break
    fi
    log "等待 Redis 就绪... (尝试 $attempt/$max_attempts)"
    sleep 5
    attempt=$((attempt + 1))
done
if [ $attempt -gt $max_attempts ]; then
    handle_error "Redis 启动超时"
fi

# 等待 user-api 就绪
log "等待 user-api 就绪..."
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:8083/health | grep -q "ok"; then
        log "user-api 已就绪"
        break
    fi
    log "等待 user-api 就绪... (尝试 $attempt/$max_attempts)"
    sleep 5
    attempt=$((attempt + 1))
done
if [ $attempt -gt $max_attempts ]; then
    handle_error "user-api 启动超时"
fi

# 等待 user-ui 就绪
log "等待 user-ui 就绪..."
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:8082 | grep -q "html"; then
        log "user-ui 已就绪"
        break
    fi
    log "等待 user-ui 就绪... (尝试 $attempt/$max_attempts)"
    sleep 5
    attempt=$((attempt + 1))
done
if [ $attempt -gt $max_attempts ]; then
    handle_error "user-ui 启动超时"
fi

# 7. 检查服务状态
log "7. 检查服务状态..."
docker-compose -f docker-compose.user.yml ps
check_result "检查服务状态失败"

log "部署完成！所有服务已成功启动"
log "用户端访问地址: https://user.pandatrade.space"
log "API 访问地址: https://user-api.pandatrade.space" 