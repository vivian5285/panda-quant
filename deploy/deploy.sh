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
    local commands=("docker" "docker-compose" "git")
    for cmd in "${commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            error "命令 $cmd 未安装"
        fi
    done
}

# 检查环境变量
check_env_vars() {
    log "检查环境变量..."
    local required_vars=(
        "JWT_SECRET"
        "DB_USERNAME"
        "DB_PASSWORD"
        "DB_NAME"
        "REDIS_PASSWORD"
        "CSRF_SECRET"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            error "环境变量 $var 未设置"
        fi
    done
    
    # 检查敏感变量是否使用默认值
    if [ "$JWT_SECRET" = "your_jwt_secret_key_here" ]; then
        error "请修改 JWT_SECRET 的值"
    fi
    if [ "$DB_PASSWORD" = "your_db_password_here" ]; then
        error "请修改 DB_PASSWORD 的值"
    fi
    if [ "$REDIS_PASSWORD" = "your_redis_password_here" ]; then
        error "请修改 REDIS_PASSWORD 的值"
    fi
    if [ "$CSRF_SECRET" = "your_csrf_secret_here" ]; then
        error "请修改 CSRF_SECRET 的值"
    fi
}

# 加载环境变量
load_env() {
    if [ -f .env ]; then
        log "加载环境变量..."
        # 使用 while 循环逐行读取并处理环境变量
        while IFS= read -r line || [ -n "$line" ]; do
            # 跳过注释和空行
            [[ $line =~ ^#.*$ ]] && continue
            [[ -z $line ]] && continue
            
            # 处理带引号的值
            if [[ $line =~ ^[[:alnum:]_]+=.*$ ]]; then
                export "$line"
            fi
        done < .env
    else
        error ".env 文件不存在"
    fi
}

# 备份数据库
backup_database() {
    log "备份数据库..."
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="backups"
    mkdir -p "$backup_dir"
    
    docker-compose exec -T postgres pg_dump -U "$DB_USERNAME" "$DB_NAME" > "$backup_dir/db_backup_$timestamp.sql"
    
    if [ $? -eq 0 ]; then
        log "数据库备份成功: $backup_dir/db_backup_$timestamp.sql"
    else
        error "数据库备份失败"
    fi
}

# 拉取最新代码
pull_latest_code() {
    log "拉取最新代码..."
    git pull origin main
    
    if [ $? -ne 0 ]; then
        error "代码拉取失败"
    fi
}

# 构建Docker镜像
build_images() {
    log "构建Docker镜像..."
    docker-compose build --no-cache
    
    if [ $? -ne 0 ]; then
        error "镜像构建失败"
    fi
}

# 停止服务
stop_services() {
    log "停止服务..."
    docker-compose down
    
    if [ $? -ne 0 ]; then
        error "服务停止失败"
    fi
}

# 启动服务
start_services() {
    log "启动服务..."
    docker-compose up -d
    
    if [ $? -ne 0 ]; then
        error "服务启动失败"
    fi
}

# 检查服务状态
check_services() {
    log "检查服务状态..."
    sleep 10  # 等待服务启动
    
    local services=("server" "postgres" "redis" "nginx")
    for service in "${services[@]}"; do
        if ! docker-compose ps "$service" | grep -q "Up"; then
            error "服务 $service 启动失败"
        fi
    done
}

# 清理未使用的资源
cleanup() {
    log "清理未使用的资源..."
    docker system prune -f
}

# 主函数
main() {
    log "开始部署..."
    
    # 检查命令
    check_commands
    
    # 加载环境变量
    load_env
    
    # 检查环境变量
    check_env_vars
    
    # 备份数据库
    backup_database
    
    # 拉取代码
    pull_latest_code
    
    # 构建镜像
    build_images
    
    # 停止服务
    stop_services
    
    # 启动服务
    start_services
    
    # 检查服务状态
    check_services
    
    # 清理资源
    cleanup
    
    log "部署完成！"
}

# 执行主函数
main 