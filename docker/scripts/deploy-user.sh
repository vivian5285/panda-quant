#!/bin/bash

# 设置错误时退出
set -e

# 设置日志文件
LOG_FILE="/var/log/panda-quant/deploy-user.log"
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
    docker-compose -f docker-compose.user.yml down
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

log "开始部署用户端..."

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
docker-compose -f docker-compose.user.yml down --remove-orphans
docker rm -f panda-quant-user-api panda-quant-user-ui panda-quant-postgres panda-quant-redis panda-quant-mongodb 2>/dev/null || true
docker network rm panda-quant-network 2>/dev/null || true

# 3. 创建新的网络
log "3. 创建新的网络..."
docker network create panda-quant-network

# 4. 构建应用
log "4. 构建应用..."

# 构建 user-api
log "构建 user-api..."
cd $PROJECT_ROOT/user-api
chmod -R 777 .
npm install --legacy-peer-deps --no-audit --unsafe-perm
npm run build
check_result "构建 user-api 失败"

# 构建 user-ui
log "构建 user-ui..."
cd $PROJECT_ROOT/user-ui
chmod -R 777 .
npm install --legacy-peer-deps --no-audit --unsafe-perm
npm run build
check_result "构建 user-ui 失败"

# 5. 部署服务
log "5. 部署服务..."
cd $CURRENT_DIR

# 启动服务
docker-compose -f docker-compose.user.yml up -d --build
check_result "启动服务失败"

# 6. 等待服务就绪
log "6. 等待服务就绪..."
max_attempts=15
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker exec panda-quant-mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1 && \
       docker exec panda-quant-redis redis-cli -p 6380 -a Wl528586* ping >/dev/null 2>&1 && \
       docker exec panda-quant-postgres pg_isready -U admin -d panda_quant >/dev/null 2>&1 && \
       curl -s http://localhost:3001/health | grep -q "ok" && \
       curl -s http://localhost:80/ | grep -q "html"; then
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
log "用户端访问地址: http://localhost:80"
log "API 访问地址: http://localhost:3001" 