#!/bin/bash

# 设置错误处理
set -e

# 定义日志函数
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# 停止并删除所有容器和网络
log "停止并清理现有容器..."
docker compose -f docker-compose.admin.yml down || true
docker compose -f docker-compose.user.yml down || true
docker compose -f docker-compose.network.yml down || true
docker network prune -f

# 清理旧的构建产物
log "清理旧的构建产物..."
rm -rf dist/ || true
rm -rf node_modules/ || true

# 重新安装依赖
log "安装依赖..."
npm install

# 重新构建镜像
log "构建镜像..."
docker compose -f docker-compose.admin.yml build --no-cache
docker compose -f docker-compose.user.yml build --no-cache

# 创建网络并启动服务
log "启动服务..."
docker compose -f docker-compose.network.yml up -d
docker compose -f docker-compose.admin.yml up -d
docker compose -f docker-compose.user.yml up -d

# 检查服务状态
log "检查服务状态..."
docker ps

log "部署完成！" 