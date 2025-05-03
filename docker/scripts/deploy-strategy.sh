#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"

# 切换到docker目录
cd "$DOCKER_DIR"

echo "开始部署策略引擎服务..."

# 停止并删除旧容器
echo "停止并删除旧容器..."
docker compose down strategy-engine || true

# 启动服务
echo "启动策略引擎服务..."
docker compose up -d strategy-engine

echo "策略引擎服务部署完成" 