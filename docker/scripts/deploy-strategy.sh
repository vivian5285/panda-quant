#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$DOCKER_DIR")"

# 切换到docker目录
cd "$DOCKER_DIR"

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "开始部署策略引擎服务..."

# 设置环境变量
export NODE_ENV=production
export PORT=3002
export MONGODB_URI=mongodb://mongo:27017/strategy
export REDIS_URI=redis://redis:6379

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 停止旧的容器
echo "停止旧的容器..."
docker-compose -f docker-compose.strategy.yml down

# 安装必要的类型定义
echo "安装必要的类型定义..."
npm install --save-dev @types/node @types/express @types/mongoose @types/jsonwebtoken

# 构建并启动服务
echo "构建并启动服务..."
docker-compose -f docker-compose.strategy.yml up -d --build

# 检查服务状态
echo "检查服务状态..."
docker ps | grep panda-quant-strategy

echo "策略引擎服务部署完成" 