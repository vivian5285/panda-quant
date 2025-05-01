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
    log "部署失败，正在回滚..."
    docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml down
    exit 1
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

# 2. 安装依赖
log "2. 安装依赖..."
cd $PROJECT_ROOT/strategy-api

if [ ! -d "node_modules" ]; then
    log "安装依赖..."
    npm install --legacy-peer-deps || handle_error "依赖安装失败"
    log "依赖安装完成"
else
    log "node_modules 已存在，跳过安装"
fi

# 3. 构建应用
log "3. 构建应用..."
npm run build || handle_error "构建失败"
log "应用构建成功"

# 4. 启动服务
log "4. 启动服务..."
cd $CURRENT_DIR

# 停止并删除旧的容器
docker-compose -f docker-compose.strategy.yml down

# 构建并启动服务
docker-compose -f docker-compose.strategy.yml up -d --build || handle_error "服务启动失败"

# 等待服务启动
log "等待服务启动..."
sleep 10

# 检查服务状态
log "检查服务状态..."
if ! docker ps | grep -q "panda-quant-strategy-api"; then
    handle_error "strategy-api 服务未启动"
fi

if ! docker ps | grep -q "panda-quant-strategy-engine"; then
    handle_error "strategy-engine 服务未启动"
fi

log "部署完成！"
log "策略端访问地址: https://server.pandatrade.space"
log "API 访问地址: https://strategy.pandatrade.space" 