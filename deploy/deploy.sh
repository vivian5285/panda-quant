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
        "MONGODB_URI"
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
    
    # 检查数据库是否运行，如果没有运行则启动
    if ! docker-compose -f docker-compose.admin.yml ps mongodb | grep -q "Up"; then
        log "MongoDB 服务未运行，正在启动..."
        docker-compose -f docker-compose.admin.yml up -d mongodb
        
        # 等待MongoDB启动并初始化认证
        log "等待MongoDB启动并初始化认证..."
        local max_attempts=10
        local attempt=1
        while [ $attempt -le $max_attempts ]; do
            log "等待MongoDB初始化 (尝试 $attempt/$max_attempts)..."
            if docker-compose -f docker-compose.admin.yml exec -T mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
                log "MongoDB初始化完成！"
                break
            fi
            if [ $attempt -eq $max_attempts ]; then
                error "MongoDB初始化失败，请检查MongoDB服务状态"
            fi
            sleep 10
            attempt=$((attempt + 1))
        done
    fi
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="backups"
    mkdir -p "$backup_dir"
    
    # 使用环境变量中的用户名和密码
    local mongo_user="admin"
    local mongo_pass="PandaQuant@2024"
    local mongo_host="mongodb"  # 使用容器名而不是 localhost
    local mongo_port="27017"    # 使用容器内部端口
    local mongo_db="panda-quant"
    
    # 执行备份，使用 --authenticationDatabase admin
    log "开始备份数据库..."
    docker-compose -f docker-compose.admin.yml exec -T mongodb mongodump \
        --username="$mongo_user" \
        --password="$mongo_pass" \
        --host="$mongo_host" \
        --port="$mongo_port" \
        --authenticationDatabase="admin" \
        --db="$mongo_db" \
        --out="$backup_dir/mongodb_backup_$timestamp"
    
    if [ $? -eq 0 ]; then
        log "数据库备份成功: $backup_dir/mongodb_backup_$timestamp"
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
    
    # 构建admin服务
    log "构建admin服务镜像..."
    docker-compose -f docker-compose.admin.yml build --no-cache
    
    # 构建user服务
    log "构建user服务镜像..."
    docker-compose -f docker-compose.user.yml build --no-cache
    
    if [ $? -ne 0 ]; then
        error "镜像构建失败"
    fi
}

# 停止服务
stop_services() {
    log "停止服务..."
    
    # 停止admin服务
    log "停止admin服务..."
    docker-compose -f docker-compose.admin.yml down
    
    # 停止user服务
    log "停止user服务..."
    docker-compose -f docker-compose.user.yml down
    
    if [ $? -ne 0 ]; then
        error "服务停止失败"
    fi
}

# 启动服务
start_services() {
    log "启动服务..."
    
    # 创建网络
    log "创建网络..."
    if ! docker network ls | grep -q "panda-quant-network"; then
        docker network create panda-quant-network
    fi
    
    # 启动admin服务
    log "启动admin服务..."
    docker-compose -f docker-compose.admin.yml up -d
    
    # 等待MongoDB启动并验证连接
    log "等待MongoDB启动并验证连接..."
    local max_attempts=10
    local attempt=1
    while [ $attempt -le $max_attempts ]; do
        log "尝试连接MongoDB (尝试 $attempt/$max_attempts)..."
        if docker-compose -f docker-compose.admin.yml exec -T mongodb mongosh --port 27017 -u admin -p PandaQuant@2024 --authenticationDatabase admin --eval "db.adminCommand('ping')" &> /dev/null; then
            log "MongoDB连接成功！"
            break
        fi
        if [ $attempt -eq $max_attempts ]; then
            error "MongoDB连接失败，请检查MongoDB服务状态"
        fi
        sleep 10
        attempt=$((attempt + 1))
    done
    
    # 启动user服务
    log "启动user服务..."
    docker-compose -f docker-compose.user.yml up -d
    
    if [ $? -ne 0 ]; then
        error "服务启动失败"
    fi
}

# 检查服务状态
check_services() {
    log "检查服务状态..."
    sleep 10  # 等待服务启动
    
    # 检查admin服务
    log "检查admin服务状态..."
    local admin_services=("server" "mongodb" "redis" "nginx")
    for service in "${admin_services[@]}"; do
        if ! docker-compose -f docker-compose.admin.yml ps "$service" | grep -q "Up"; then
            error "admin服务 $service 启动失败"
        fi
    done
    
    # 检查user服务
    log "检查user服务状态..."
    local user_services=("server" "redis" "nginx")
    for service in "${user_services[@]}"; do
        if ! docker-compose -f docker-compose.user.yml ps "$service" | grep -q "Up"; then
            error "user服务 $service 启动失败"
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