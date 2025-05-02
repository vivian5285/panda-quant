#!/bin/bash

# 设置错误时退出
set -e

# 设置日志文件
LOG_FILE="/var/log/panda-quant/deploy-strategy.log"
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
STRATEGY_API_PORT=8083

# 域名配置
DOMAIN=pandatrade.space
STRATEGY_SUBDOMAIN=server
STRATEGY_API_SUBDOMAIN=strategy
STRATEGY_DOMAIN=server.pandatrade.space
STRATEGY_API_DOMAIN=strategy.pandatrade.space

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
cd $PROJECT_ROOT/strategy-engine

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
# 清理构建目录
rm -rf dist
# 执行类型检查
log "执行类型检查..."
npm run type-check
check_result "类型检查失败"
# 构建应用
npm run build
check_result "构建应用失败"
log "应用构建成功"

# 5. 启动服务
log "5. 启动服务..."
cd $CURRENT_DIR

# 停止并删除旧的容器
log "停止并删除旧的容器..."
docker-compose -f docker-compose.strategy.yml down
check_result "停止旧容器失败"

# 构建并启动服务
log "构建并启动服务..."
docker-compose -f docker-compose.strategy.yml up -d --build
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

# 等待 strategy-engine 就绪
log "等待 strategy-engine 就绪..."
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:8083/health | grep -q "ok"; then
        log "strategy-engine 已就绪"
        break
    fi
    log "等待 strategy-engine 就绪... (尝试 $attempt/$max_attempts)"
    sleep 5
    attempt=$((attempt + 1))
done
if [ $attempt -gt $max_attempts ]; then
    handle_error "strategy-engine 启动超时"
fi

# 7. 检查服务状态
log "7. 检查服务状态..."
docker-compose -f docker-compose.strategy.yml ps
check_result "检查服务状态失败"

log "部署完成！所有服务已成功启动"
log "策略端访问地址: https://server.pandatrade.space"
log "API 访问地址: https://strategy.pandatrade.space" 