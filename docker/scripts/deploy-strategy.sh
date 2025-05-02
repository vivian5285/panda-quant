#!/bin/bash

# 设置错误时退出
set -e

# 设置日志文件
LOG_FILE="/var/log/panda-quant/deploy-strategy.log"
mkdir -p /var/log/panda-quant
touch $LOG_FILE
chmod 777 $LOG_FILE

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

# 设置目录权限
log "设置目录权限..."
chmod -R 777 $PROJECT_ROOT
chmod -R 777 $CURRENT_DIR

log "开始部署策略端..."

# 1. 检查环境变量
log "1. 检查环境变量..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        chmod 777 .env
        log "请编辑 .env 文件配置必要的环境变量"
        exit 1
    else
        handle_error ".env 和 .env.example 文件都不存在"
    fi
fi

# 2. 清理旧的容器和网络
log "2. 清理旧的容器和网络..."
docker-compose -f docker-compose.strategy.yml down --remove-orphans
docker rm -f panda-quant-strategy 2>/dev/null || true
docker network rm panda-quant-network 2>/dev/null || true

# 3. 创建新的网络
log "3. 创建新的网络..."
docker network create panda-quant-network

# 4. 构建应用
log "4. 构建应用..."
cd $PROJECT_ROOT/strategy
chmod -R 777 .
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps --no-audit --unsafe-perm
npm install dotenv@16.4.5 @types/dotenv@8.2.3 --save-dev --unsafe-perm
npm run build
check_result "构建策略引擎失败"

# 5. 部署服务
log "5. 部署服务..."
cd $CURRENT_DIR

# 启动服务
docker-compose -f docker-compose.strategy.yml up -d --build
check_result "启动服务失败"

# 6. 等待服务就绪
log "6. 等待服务就绪..."
max_attempts=15
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:3003/health | grep -q "ok"; then
        log "服务已就绪"
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
log "策略引擎访问地址: http://localhost:3003" 