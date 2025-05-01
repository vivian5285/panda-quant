#!/bin/bash

# 设置错误时退出
set -e

echo "开始部署管理端服务..."

# 构建管理端镜像
echo "构建管理端镜像..."
docker build -t panda-quant-admin-api -f ../Dockerfile.admin-api ..
docker build -t panda-quant-admin-ui -f ../Dockerfile.admin-ui ..

# 启动管理端服务
echo "启动管理端服务..."
docker-compose -f ../docker-compose.admin.yml up -d

# 检查服务状态
echo "检查服务状态..."
docker-compose -f ../docker-compose.admin.yml ps

echo "管理端部署完成！" 