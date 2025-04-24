#!/bin/bash

# 设置错误处理
set -e
set -o pipefail

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 日志函数
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# 检查必要的命令
check_commands() {
    local commands=("docker" "docker-compose" "git")
    for cmd in "${commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            error "$cmd 未安装，请先安装 $cmd"
        fi
    done
}

# 检查环境变量
check_env() {
    if [ ! -f .env ]; then
        error ".env 文件不存在，请先创建 .env 文件"
    fi

    local required_vars=("JWT_SECRET" "DB_USERNAME" "DB_PASSWORD" "DB_NAME")
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            error "环境变量 $var 未设置"
        fi
    done
}

# 备份数据库
backup_database() {
    log "开始备份数据库..."
    ./backup.sh || warn "数据库备份失败"
}

# 拉取最新代码
pull_code() {
    log "拉取最新代码..."
    git pull || error "拉取代码失败"
}

# 构建镜像
build_images() {
    log "构建 Docker 镜像..."
    docker-compose build --no-cache || error "构建镜像失败"
}

# 停止服务
stop_services() {
    log "停止服务..."
    docker-compose down || error "停止服务失败"
}

# 启动服务
start_services() {
    log "启动服务..."
    docker-compose up -d || error "启动服务失败"
}

# 检查服务状态
check_services() {
    log "检查服务状态..."
    local services=("server" "postgres" "redis" "nginx")
    for service in "${services[@]}"; do
        if ! docker-compose ps "$service" | grep -q "Up"; then
            error "服务 $service 启动失败"
        fi
    done
}

# 清理未使用的镜像和容器
cleanup() {
    log "清理未使用的资源..."
    docker system prune -f || warn "清理资源失败"
}

# 主函数
main() {
    log "开始部署..."
    
    # 检查命令
    check_commands
    
    # 检查环境变量
    check_env
    
    # 备份数据库
    backup_database
    
    # 拉取代码
    pull_code
    
    # 停止服务
    stop_services
    
    # 构建镜像
    build_images
    
    # 启动服务
    start_services
    
    # 检查服务状态
    check_services
    
    # 清理资源
    cleanup
    
    log "部署完成！"
}

# 执行主函数
main "$@" 