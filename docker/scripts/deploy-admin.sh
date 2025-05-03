#!/bin/bash

# 设置错误处理
set -e

# 停止并删除旧容器
echo "停止并删除旧容器..."
docker compose down admin-panel || true

# 启动服务
echo "启动管理后台服务..."
docker compose up -d admin-panel 