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
    local commands=("docker" "docker-compose" "pg_dump")
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

    local required_vars=("DB_USERNAME" "DB_PASSWORD" "DB_NAME")
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            error "环境变量 $var 未设置"
        fi
    done
}

# 创建备份目录
create_backup_dir() {
    local backup_dir="backups/$(date +%Y%m%d)"
    mkdir -p "$backup_dir" || error "创建备份目录失败"
    echo "$backup_dir"
}

# 备份数据库
backup_database() {
    local backup_dir=$1
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/db_$timestamp.sql.gz"
    
    log "开始备份数据库..."
    
    docker-compose exec -T postgres pg_dump -U "$DB_USERNAME" "$DB_NAME" | gzip > "$backup_file" || error "数据库备份失败"
    
    log "数据库备份完成: $backup_file"
}

# 备份配置文件
backup_configs() {
    local backup_dir=$1
    local timestamp=$(date +%Y%m%d_%H%M%S)
    
    log "开始备份配置文件..."
    
    # 备份 .env 文件
    cp .env "$backup_dir/env_$timestamp" || warn "备份 .env 文件失败"
    
    # 备份 nginx 配置
    tar -czf "$backup_dir/nginx_$timestamp.tar.gz" nginx/ || warn "备份 nginx 配置失败"
    
    # 备份 docker-compose 配置
    cp docker-compose*.yml "$backup_dir/" || warn "备份 docker-compose 配置失败"
    
    log "配置文件备份完成"
}

# 清理旧备份
cleanup_old_backups() {
    local backup_dir="backups"
    local keep_days=7
    
    log "清理 $keep_days 天前的旧备份..."
    
    find "$backup_dir" -type d -mtime +$keep_days -exec rm -rf {} \; || warn "清理旧备份失败"
}

# 主函数
main() {
    log "开始备份..."
    
    # 检查命令
    check_commands
    
    # 检查环境变量
    check_env
    
    # 创建备份目录
    local backup_dir=$(create_backup_dir)
    
    # 备份数据库
    backup_database "$backup_dir"
    
    # 备份配置文件
    backup_configs "$backup_dir"
    
    # 清理旧备份
    cleanup_old_backups
    
    log "备份完成！"
}

# 执行主函数
main "$@" 