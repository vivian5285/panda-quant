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
    docker-compose -f docker-compose.strategy.yml down
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

log "开始部署策略端..."

# 1. 检查环境变量
log "1. 检查环境变量..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        log "请编辑 .env 文件配置必要的环境变量"
        exit 1
    else
        handle_error ".env 和 .env.example 文件都不存在"
    fi
fi

# 2. 检查并创建 Docker 网络
log "2. 检查 Docker 网络..."
if ! docker network ls | grep -q panda-quant-network; then
    docker network create panda-quant-network
fi

# 3. 构建应用
log "3. 构建应用..."
cd $PROJECT_ROOT/strategy-engine

# 安装依赖并构建
npm install --legacy-peer-deps --no-audit
npm run build
check_result "构建应用失败"

# 4. 部署服务
log "4. 部署服务..."
cd $CURRENT_DIR

# 停止旧容器并启动新容器
docker-compose -f docker-compose.strategy.yml down
docker-compose -f docker-compose.strategy.yml up -d --build
check_result "启动服务失败"

# 5. 等待服务就绪
log "5. 等待服务就绪..."
max_attempts=15
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker exec panda-quant-mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1 && \
       docker exec panda-quant-redis redis-cli ping >/dev/null 2>&1 && \
       curl -s http://localhost:8083/health | grep -q "ok"; then
        log "所有服务已就绪"
        break
    fi
    log "等待服务就绪... (尝试 $attempt/$max_attempts)"
    sleep 5
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    handle_error "服务启动超时"
fi

log "部署完成！"
log "策略端访问地址: https://server.pandatrade.space"
log "API 访问地址: https://strategy.pandatrade.space" 