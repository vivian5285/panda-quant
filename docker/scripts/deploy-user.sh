#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"

# 切换到docker目录
cd "$DOCKER_DIR"

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "开始部署用户服务..."

# 停止并删除旧容器
echo "停止并删除旧容器..."
docker compose -f docker-compose.user.yml down || true

# 启动服务
echo "启动用户服务..."
docker compose -f docker-compose.user.yml up -d

echo "用户服务部署完成" 