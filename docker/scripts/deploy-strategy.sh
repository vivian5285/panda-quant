#!/bin/bash

# 设置错误时退出
set -e

# 设置日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 设置错误处理函数
handle_error() {
    log "错误: $1"
    log "正在回滚..."
    cd "$DOCKER_DIR"
    docker compose -f docker-compose.strategy.yml down || true
    exit 1
}

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$DOCKER_DIR")"

# 切换到项目根目录
cd "$PROJECT_DIR" || handle_error "无法切换到项目根目录"
log "当前目录: $(pwd)"

# 加载环境变量
if [ -f .env ]; then
    set -a
    source .env || handle_error "无法加载环境变量"
    set +a
fi

log "开始部署策略引擎服务..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    handle_error "Docker 未安装"
fi

# 检查 Docker Compose 是否安装
if ! command -v docker compose &> /dev/null; then
    handle_error "Docker Compose 未安装"
fi

# 停止并删除旧容器
log "停止并删除旧容器..."
cd "$DOCKER_DIR" || handle_error "无法切换到 Docker 目录"
docker compose -f docker-compose.strategy.yml down || true

# 清理 Docker 缓存
log "清理 Docker 缓存..."
docker system prune -f || handle_error "清理 Docker 缓存失败"

# 构建策略引擎镜像
log "构建策略引擎镜像..."
docker build --no-cache -t vivian5285/panda-quant-strategy-engine -f "$DOCKER_DIR/Dockerfile.strategy-engine" . || handle_error "构建镜像失败"

# 推送镜像到 Docker Hub
log "推送镜像到 Docker Hub..."
docker push vivian5285/panda-quant-strategy-engine || handle_error "推送镜像失败"

# 修改 docker-compose 文件中的镜像名称
log "更新 docker-compose 文件..."
sed -i "s|image: panda-quant-strategy-engine|image: vivian5285/panda-quant-strategy-engine|g" docker-compose.strategy.yml || handle_error "更新 docker-compose 文件失败"

# 启动服务
log "启动服务..."
docker compose -f docker-compose.strategy.yml up -d || handle_error "启动服务失败"

# 等待服务启动并检查健康状态
log "等待服务启动并检查健康状态..."
for i in {1..30}; do
    if curl -s http://localhost:5000/health | grep -q "ok"; then
        log "服务已成功启动"
        break
    fi
    if [ $i -eq 30 ]; then
        handle_error "服务启动超时"
    fi
    log "等待服务启动... ($i/30)"
    sleep 2
done

# 检查服务状态
log "检查服务状态..."
docker compose -f docker-compose.strategy.yml ps || handle_error "检查服务状态失败"

log "策略引擎服务部署完成" 