#!/bin/bash

# 设置错误时退出
set -e

# 设置日志文件
LOG_FILE="/var/log/panda-quant/deploy-user.log"
sudo mkdir -p /var/log/panda-quant
sudo touch $LOG_FILE
sudo chmod 777 $LOG_FILE

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | sudo tee -a $LOG_FILE
}

# 错误处理函数
handle_error() {
    log "错误: $1"
    log "部署失败，请检查日志文件: $LOG_FILE"
    sudo docker-compose -f docker-compose.user.yml down
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
sudo chown -R root:root $PROJECT_ROOT
sudo chmod -R 777 $PROJECT_ROOT
sudo chown -R root:root $CURRENT_DIR
sudo chmod -R 777 $CURRENT_DIR

log "开始部署用户端..."

# 1. 检查环境变量
log "1. 检查环境变量..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        sudo cp .env.example .env
        sudo chmod 777 .env
        log "请编辑 .env 文件配置必要的环境变量"
        exit 1
    else
        handle_error ".env 和 .env.example 文件都不存在"
    fi
fi

# 2. 清理旧的容器和网络
log "2. 清理旧的容器和网络..."
sudo docker-compose -f docker-compose.user.yml down --remove-orphans
sudo docker rm -f panda-quant-user-api 2>/dev/null || true
sudo docker rm -f panda-quant-user-ui 2>/dev/null || true
sudo docker network rm panda-quant-network 2>/dev/null || true

# 3. 创建新的网络
log "3. 创建新的网络..."
sudo docker network create panda-quant-network

# 4. 构建应用
log "4. 构建应用..."
cd $PROJECT_ROOT/user-api
sudo chown -R root:root .
sudo chmod -R 777 .
sudo npm run build
check_result "构建用户端 API 失败"

cd $PROJECT_ROOT/user-ui
sudo chown -R root:root .
sudo chmod -R 777 .
sudo npm run build
check_result "构建用户端 UI 失败"

# 5. 部署服务
log "5. 部署服务..."
cd $CURRENT_DIR

# 启动服务
sudo docker-compose -f docker-compose.user.yml up -d --build
check_result "启动服务失败"

# 6. 等待服务就绪
log "6. 等待服务就绪..."
max_attempts=15
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:3001/health | grep -q "ok" && \
       curl -s http://localhost/health | grep -q "ok"; then
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
log "用户端 API 访问地址: http://localhost:3001"
log "用户端 UI 访问地址: http://localhost" 