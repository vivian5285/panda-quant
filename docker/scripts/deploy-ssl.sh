#!/bin/bash

# 设置错误处理
set -e

# 停止并删除旧容器
echo "停止并删除旧容器..."
docker compose down ssl-service || true

# 启动服务
echo "启动SSL证书服务..."
docker compose up -d ssl-service 