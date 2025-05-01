#!/bin/bash

# 设置错误时退出
set -e

echo "开始部署用户端服务..."

# 构建用户端镜像
echo "构建用户端镜像..."
docker build -t panda-quant-user-api -f ../Dockerfile.user-api ..
docker build -t panda-quant-user-ui -f ../Dockerfile.user-ui ..
docker build -t panda-quant-strategy-engine -f ../Dockerfile.strategy-engine ..
docker build -t panda-quant-server -f ../Dockerfile.server ..

# 启动用户端服务
echo "启动用户端服务..."
docker-compose -f ../docker-compose.user.yml up -d
docker-compose -f ../docker-compose.strategy.yml up -d

# 检查服务状态
echo "检查服务状态..."
docker-compose -f ../docker-compose.user.yml ps
docker-compose -f ../docker-compose.strategy.yml ps

echo "用户端部署完成！" 