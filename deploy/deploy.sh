#!/bin/bash

# 设置错误处理
set -e

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 设置 Docker 构建参数
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
export BUILDKIT_INLINE_CACHE=1

# 设置构建超时时间（秒）
export COMPOSE_HTTP_TIMEOUT=300

# 设置构建参数
BUILD_ARGS="--no-cache --progress=plain"

# 停止并清理现有容器
log "停止并清理现有容器..."
docker-compose down -v

# 清理旧的构建产物
log "清理旧的构建产物..."
rm -rf admin-ui/dist user-ui/dist

# 重新安装依赖
log "安装依赖..."
cd admin-ui && npm install --legacy-peer-deps && cd ..
cd user-ui && npm install --legacy-peer-deps && cd ..
cd admin-api && npm install --legacy-peer-deps && cd ..
cd user-api && npm install --legacy-peer-deps && cd ..

# 重新构建镜像
log "构建镜像..."
docker-compose build $BUILD_ARGS

# 创建网络并启动服务
log "启动服务..."
docker-compose up -d

# 检查服务状态
log "检查服务状态..."
docker-compose ps

log "部署完成！" 