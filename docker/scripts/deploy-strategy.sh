#!/bin/bash

# 设置错误处理
set -e

# 停止并删除旧容器
echo "停止并删除旧容器..."
docker compose down strategy-engine || true

# 启动服务
echo "启动策略引擎服务..."
docker compose up -d strategy-engine 