#!/bin/bash

# 设置错误处理
set -e

# 设置环境变量
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "Docker 未运行，正在启动..."
    sudo service docker start
    sleep 5
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose 未安装，正在安装..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 检查是否在正确的目录
if [ ! -f "docker-compose.yml" ]; then
    echo "错误：请在项目根目录运行此脚本"
    exit 1
fi

# 清理旧的构建缓存
echo "清理旧的构建缓存..."
docker builder prune -f

# 停止并删除旧容器
echo "停止并删除旧容器..."
docker-compose down || true

# 构建并启动容器
echo "开始构建SSL证书服务..."
if ! docker-compose build ssl-service; then
    echo "构建失败，尝试重新构建..."
    # 清理构建缓存
    docker builder prune -f
    # 重新构建
    docker-compose build --no-cache ssl-service
fi

# 启动服务
echo "启动SSL证书服务..."
docker-compose up -d ssl-service

# 检查服务状态
echo "检查服务状态..."
sleep 5
if ! docker-compose ps | grep -q "ssl-service.*Up"; then
    echo "服务启动失败，检查日志..."
    docker-compose logs ssl-service
    exit 1
fi

echo "SSL证书服务部署完成！"
echo "服务状态："
docker-compose ps

# 保持连接
if [ -n "$SSH_CLIENT" ]; then
    echo "部署完成，按 Ctrl+C 退出..."
    # 使用更可靠的保持连接方式
    exec tail -f /dev/null
fi 