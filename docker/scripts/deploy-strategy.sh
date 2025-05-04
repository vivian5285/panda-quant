#!/bin/bash

# 设置错误时退出
set -e

# 设置 Docker Hub 用户名
DOCKER_USERNAME="vivian5285"

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$DOCKER_DIR")"

# 切换到项目根目录
cd "$PROJECT_DIR"

# 加载环境变量
if [ -f "$DOCKER_DIR/.env" ]; then
    set -a
    source "$DOCKER_DIR/.env"
    set +a
fi

echo "开始部署策略引擎服务..."

# 显示当前目录
echo "当前目录: $(pwd)"

# 设置环境变量
export NODE_ENV=production
export PORT=3002
export MONGODB_URI=mongodb://mongo:27017/strategy
export REDIS_URI=redis://redis:6379

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "错误: Docker 未安装"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker compose &> /dev/null; then
    echo "错误: Docker Compose 未安装"
    exit 1
fi

# 检查必要的目录是否存在
if [ ! -d "src" ]; then
    echo "创建 src 目录..."
    mkdir -p src
fi

# 显示目录结构
echo "目录结构:"
ls -la

# 安装必要的类型定义
echo "安装必要的类型定义..."
cd strategy-engine
npm install --save-dev @types/jest @types/mocha @types/node @types/express @types/mongoose @types/cors @types/helmet @types/morgan

# 返回项目根目录
cd "$PROJECT_DIR"

# 构建策略引擎镜像
echo "构建策略引擎镜像..."
docker build --no-cache -t ${DOCKER_USERNAME}/panda-quant-strategy-engine -f docker/Dockerfile.strategy-engine .

# 推送镜像到 Docker Hub
echo "推送镜像到 Docker Hub..."
docker push ${DOCKER_USERNAME}/panda-quant-strategy-engine

# 修改 docker-compose 文件中的镜像名称
sed -i "s|image: panda-quant-strategy-engine|image: ${DOCKER_USERNAME}/panda-quant-strategy-engine|g" docker/docker-compose.strategy.yml

# 启动策略引擎服务
echo "启动策略引擎服务..."
cd docker
docker compose -f docker-compose.strategy.yml up -d

# 等待服务启动
echo "等待服务启动..."
sleep 10

# 检查服务状态
echo "检查服务状态..."
docker ps | grep panda-quant-strategy

echo "策略引擎服务部署完成" 