#!/bin/bash

# 设置错误时退出
set -e

# 设置日志文件
LOG_FILE="/var/log/panda-quant/deploy-strategy.log"
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
    sudo docker-compose -f docker-compose.strategy.yml down
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

log "开始部署策略端..."

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
sudo docker-compose -f docker-compose.strategy.yml down --remove-orphans
sudo docker rm -f panda-quant-strategy 2>/dev/null || true
sudo docker rm -f panda-quant-nginx-strategy 2>/dev/null || true
sudo docker network rm panda-quant-network 2>/dev/null || true

# 3. 创建新的网络
log "3. 创建新的网络..."
sudo docker network create panda-quant-network

# 4. 构建应用
log "4. 构建应用..."
cd $PROJECT_ROOT/strategy-engine
sudo chown -R root:root .
sudo chmod -R 777 .

# 检查是否需要重新安装依赖
if [ ! -d "node_modules" ] || [ ! -f "package-lock.json" ] || [ "package.json" -nt "package-lock.json" ]; then
    log "安装策略引擎依赖..."
    sudo npm install
    check_result "安装策略引擎依赖失败"
    
    # 安装必要的类型定义文件
    log "安装类型定义文件..."
    sudo npm install --save-dev @types/dotenv
    sudo npm install --save-dev @types/node
    check_result "安装类型定义文件失败"
else
    log "使用缓存的策略引擎依赖..."
fi

sudo SKIP_TYPE_CHECK=true npm run build
check_result "构建策略引擎失败"

# 5. 部署服务
log "5. 部署服务..."
cd $CURRENT_DIR

# 启动服务
sudo SKIP_TYPE_CHECK=true docker-compose -f docker-compose.strategy.yml up -d --build
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