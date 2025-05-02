#!/bin/bash

# 设置错误时退出
set -e

# 设置日志文件
LOG_FILE="/var/log/panda-quant/deploy-admin.log"
mkdir -p /var/log/panda-quant
touch $LOG_FILE

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
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
ADMIN_API_PORT=8081

# 域名配置
DOMAIN=pandatrade.space
ADMIN_SUBDOMAIN=admin
ADMIN_API_SUBDOMAIN=admin-api
ADMIN_DOMAIN=admin.pandatrade.space
ADMIN_API_DOMAIN=admin-api.pandatrade.space

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
cd $PROJECT_ROOT/admin-api

# 检查 package.json 是否被修改
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    log "安装依赖..."
    npm install --legacy-peer-deps
    log "依赖安装完成"
else
    log "依赖已是最新，跳过安装"
fi

# 3. 构建应用
log "3. 构建应用..."
npm run build
log "应用构建成功"

# 4. 启动服务
log "4. 启动服务..."
cd $CURRENT_DIR

# 停止并删除旧的容器
docker-compose -f docker-compose.admin.yml down

# 构建并启动服务
docker-compose -f docker-compose.admin.yml up -d --build

# 等待服务启动
log "等待服务启动..."
sleep 10

# 检查服务状态
log "检查服务状态..."
if ! docker ps | grep -q "panda-quant-admin-api"; then
    log "admin-api 服务未启动"
    exit 1
fi

log "部署完成！"
log "管理端访问地址: https://admin.pandatrade.space"
log "API 访问地址: https://admin-api.pandatrade.space" 