#!/bin/bash

# 设置错误处理
set -e

# 设置环境变量
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

# 设置构建参数
export NODE_ENV=production
export SKIP_TYPE_CHECK=true

# 设置 SSH 保持连接
if [ -n "$SSH_CLIENT" ]; then
    echo "设置 SSH 保持连接..."
    echo "ClientAliveInterval 60" | sudo tee -a /etc/ssh/sshd_config
    echo "ClientAliveCountMax 3" | sudo tee -a /etc/ssh/sshd_config
    sudo service ssh restart
fi

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
echo "开始构建用户端 UI..."
if ! docker-compose build user-ui; then
    echo "构建失败，尝试重新构建..."
    # 清理构建缓存
    docker builder prune -f
    # 重新构建
    docker-compose build --no-cache user-ui
fi

# 启动服务
echo "启动用户端 UI 服务..."
docker-compose up -d user-ui

# 检查服务状态
echo "检查服务状态..."
sleep 5
if ! docker-compose ps | grep -q "user-ui.*Up"; then
    echo "服务启动失败，检查日志..."
    docker-compose logs user-ui
    exit 1
fi

echo "用户端 UI 部署完成！"
echo "服务状态："
docker-compose ps

# 保持连接
if [ -n "$SSH_CLIENT" ]; then
    echo "按 Ctrl+C 退出..."
    while true; do
        sleep 60
    done
fi 