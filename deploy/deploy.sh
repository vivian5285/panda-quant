#!/bin/bash

# 设置错误时退出
set -e

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
    log "检查必要的命令..."
    for cmd in docker docker-compose git; do
        if ! command -v $cmd &> /dev/null; then
            log "错误: 需要安装 $cmd"
            exit 1
        fi
    done
}

# 检查环境变量
check_env() {
    log "检查环境变量..."
    required_vars=(
        "MONGODB_URI"
        "JWT_SECRET"
        "ADMIN_API_PORT"
        "USER_API_PORT"
        "FRONTEND_PORT"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            log "错误: 环境变量 $var 未设置"
            exit 1
        fi
    done
}

# 加载环境变量
load_env() {
    log "加载环境变量..."
    if [ -f .env ]; then
        source .env
    else
        log "警告: 未找到 .env 文件"
    fi
}

# 备份数据库
backup_database() {
    log "开始备份数据库..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_dir="backups"
    backup_file="$backup_dir/mongodb_backup_$timestamp"
    
    mkdir -p $backup_dir
    
    # 使用 mongodump 备份数据库
    mongodump --uri="$MONGODB_URI" --out="$backup_file"
    
    if [ $? -eq 0 ]; then
        log "数据库备份成功: $backup_file"
    else
        log "错误: 数据库备份失败"
        exit 1
    fi
}

# 创建必要的目录结构
create_directories() {
    log "创建必要的目录结构..."
    mkdir -p admin-api/prisma
    mkdir -p user-api/prisma
    mkdir -p frontend/prisma
}

# 拉取最新代码
pull_latest_code() {
    log "拉取最新代码..."
    git pull origin main
}

# 构建Docker镜像
build_docker_images() {
    log "构建Docker镜像..."
    
    # 构建admin服务镜像
    log "构建admin服务镜像..."
    cd admin-api
    docker build -t panda-quant-admin-api .
    cd ..
    
    # 构建user服务镜像
    log "构建user服务镜像..."
    cd user-api
    docker build -t panda-quant-user-api .
    cd ..
    
    # 构建前端镜像
    log "构建前端镜像..."
    cd frontend
    docker build -t panda-quant-frontend .
    cd ..
}

# 启动服务
start_services() {
    log "启动服务..."
    docker-compose up -d
}

# 检查服务状态
check_services() {
    log "检查服务状态..."
    sleep 10
    docker-compose ps
}

# 主函数
main() {
    log "开始部署..."
    
    check_commands
    load_env
    check_env
    backup_database
    create_directories
    pull_latest_code
    build_docker_images
    start_services
    check_services
    
    log "部署完成！"
}

# 执行主函数
main 