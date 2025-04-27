#!/bin/bash

# 设置错误时退出
set -e

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 设置工作目录
WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

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
            error "需要安装 $cmd"
        fi
    done
    
    # 检查MongoDB工具
    if ! command -v mongodump &> /dev/null; then
        log "安装MongoDB工具..."
        if [ -f /etc/debian_version ]; then
            # 添加MongoDB GPG密钥
            sudo apt-get install -y gnupg
            wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
            
            # 添加MongoDB仓库
            echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
            
            # 更新包列表并安装工具
            sudo apt-get update
            sudo apt-get install -y mongodb-database-tools
        elif [ -f /etc/redhat-release ]; then
            sudo yum install -y mongodb-org-tools
        else
            warn "不支持的操作系统，跳过MongoDB工具安装"
        fi
    fi
}

# 复制shared目录
copy_shared_directory() {
    log "复制shared目录..."
    if [ -d "$WORKSPACE_DIR/shared" ]; then
        cp -r "$WORKSPACE_DIR/shared" .
    else
        error "找不到shared目录: $WORKSPACE_DIR/shared"
    fi
}

# 设置默认环境变量
set_default_env() {
    log "设置默认环境变量..."
    
    # 设置默认端口
    export ADMIN_API_PORT=${ADMIN_API_PORT:-8081}
    export USER_API_PORT=${USER_API_PORT:-8083}
    export ADMIN_UI_PORT=${ADMIN_UI_PORT:-8080}
    export USER_UI_PORT=${USER_UI_PORT:-8082}
    
    # 设置默认数据库端口
    export MONGODB_ADMIN_PORT=${MONGODB_ADMIN_PORT:-27018}
    export MONGODB_USER_PORT=${MONGODB_USER_PORT:-27019}
    export REDIS_ADMIN_PORT=${REDIS_ADMIN_PORT:-6380}
    export REDIS_USER_PORT=${REDIS_USER_PORT:-6381}
    
    # 设置默认域名
    export DOMAIN=${DOMAIN:-"pandatrade.space"}
    export ADMIN_SUBDOMAIN=${ADMIN_SUBDOMAIN:-"admin"}
    export ADMIN_API_SUBDOMAIN=${ADMIN_API_SUBDOMAIN:-"admin-api"}
    export API_SUBDOMAIN=${API_SUBDOMAIN:-"api"}
    
    # 设置默认数据库连接（转义@符号）
    export MONGODB_ADMIN_URI="mongodb://admin:PandaQuant%402024@mongodb:27017/panda-quant-admin?authSource=admin"
    export MONGODB_USER_URI="mongodb://admin:PandaQuant%402024@mongodb:27017/panda-quant-user?authSource=admin"
    
    # 设置默认Redis连接（转义@符号）
    export REDIS_ADMIN_URL="redis://:PandaQuant%402024@redis:6379"
    export REDIS_USER_URL="redis://:PandaQuant%402024@redis:6379"
    
    # 设置默认密钥
    export JWT_SECRET=${JWT_SECRET:-"PandaQuant@2024"}
    export ENCRYPTION_KEY=${ENCRYPTION_KEY:-"PandaQuant@2024"}
    
    # 保存环境变量到文件
    cat > .env << EOF
ADMIN_API_PORT=$ADMIN_API_PORT
USER_API_PORT=$USER_API_PORT
ADMIN_UI_PORT=$ADMIN_UI_PORT
USER_UI_PORT=$USER_UI_PORT
MONGODB_ADMIN_PORT=$MONGODB_ADMIN_PORT
MONGODB_USER_PORT=$MONGODB_USER_PORT
REDIS_ADMIN_PORT=$REDIS_ADMIN_PORT
REDIS_USER_PORT=$REDIS_USER_PORT
DOMAIN=$DOMAIN
ADMIN_SUBDOMAIN=$ADMIN_SUBDOMAIN
ADMIN_API_SUBDOMAIN=$ADMIN_API_SUBDOMAIN
API_SUBDOMAIN=$API_SUBDOMAIN
MONGODB_ADMIN_URI=$MONGODB_ADMIN_URI
MONGODB_USER_URI=$MONGODB_USER_URI
REDIS_ADMIN_URL=$REDIS_ADMIN_URL
REDIS_USER_URL=$REDIS_USER_URL
JWT_SECRET=$JWT_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY
EOF
    
    log "环境变量已设置并保存到 .env 文件"
}

# 检查环境变量
check_env() {
    log "检查环境变量..."
    
    # 设置默认值
    set_default_env
    
    # 检查关键环境变量
    if [ "$JWT_SECRET" = "PandaQuant@2024" ]; then
        warn "JWT_SECRET 使用默认值，建议在生产环境中修改"
    fi
    
    # 检查域名配置
    if [ "$DOMAIN" != "pandatrade.space" ]; then
        warn "DOMAIN 配置与DNS记录不匹配，请使用 pandatrade.space"
    fi
    
    # 检查子域名配置
    if [ "$ADMIN_SUBDOMAIN" != "admin" ] || [ "$ADMIN_API_SUBDOMAIN" != "admin-api" ] || [ "$API_SUBDOMAIN" != "api" ]; then
        warn "子域名配置与DNS记录不匹配，请使用 admin, admin-api, api"
    fi
}

# 加载环境变量
load_env() {
    log "加载环境变量..."
    if [ -f .env ]; then
        source .env
    else
        warn "未找到 .env 文件，将使用默认值"
    fi
}

# 备份数据库
backup_database() {
    log "开始备份数据库..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_dir="backups"
    backup_file="$backup_dir/mongodb_backup_$timestamp"
    
    mkdir -p $backup_dir
    
    # 检查 mongodump 是否可用
    if ! command -v mongodump &> /dev/null; then
        warn "mongodump 命令不可用，跳过数据库备份"
        return
    fi
    
    # 重试次数和间隔
    max_retries=5
    retry_interval=10
    
    # 备份管理后台数据库
    log "备份管理后台数据库..."
    for i in $(seq 1 $max_retries); do
        if mongodump --uri="$MONGODB_ADMIN_URI" --out="$backup_file/admin"; then
            log "管理后台数据库备份成功: $backup_file/admin"
            break
        else
            if [ $i -eq $max_retries ]; then
                warn "管理后台数据库备份失败，已达到最大重试次数，继续部署..."
            else
                warn "管理后台数据库备份失败，将在 ${retry_interval} 秒后重试 (${i}/${max_retries})..."
                sleep $retry_interval
            fi
        fi
    done
    
    # 备份用户端数据库
    log "备份用户端数据库..."
    for i in $(seq 1 $max_retries); do
        if mongodump --uri="$MONGODB_USER_URI" --out="$backup_file/user"; then
            log "用户端数据库备份成功: $backup_file/user"
            break
        else
            if [ $i -eq $max_retries ]; then
                warn "用户端数据库备份失败，已达到最大重试次数，继续部署..."
            else
                warn "用户端数据库备份失败，将在 ${retry_interval} 秒后重试 (${i}/${max_retries})..."
                sleep $retry_interval
            fi
        fi
    done
}

# 创建必要的目录结构
create_directories() {
    log "创建必要的目录结构..."
    
    # 创建日志目录
    mkdir -p logs/admin-api
    mkdir -p logs/user-api
    mkdir -p logs/admin-ui
    mkdir -p logs/user-ui
    
    # 创建数据目录
    mkdir -p data/mongodb/admin
    mkdir -p data/mongodb/user
    mkdir -p data/redis/admin
    mkdir -p data/redis/user
    
    # 创建备份目录
    mkdir -p backup/mongodb
    mkdir -p backup/redis
    
    # 复制docker-compose配置文件
    log "复制docker-compose配置文件..."
    cp -f docker-compose.admin.yml docker-compose.admin.yml.bak 2>/dev/null || true
    cp -f docker-compose.user.yml docker-compose.user.yml.bak 2>/dev/null || true
    cp -f docker-compose.network.yml docker-compose.network.yml.bak 2>/dev/null || true
    
    # 检查Prisma schema文件
    log "检查Prisma schema文件..."
    if [ ! -f "$WORKSPACE_DIR/admin-api/prisma/schema.prisma" ]; then
        error "找不到Prisma schema文件: $WORKSPACE_DIR/admin-api/prisma/schema.prisma"
    fi
    
    log "目录结构创建完成"
}

# 拉取最新代码
pull_latest_code() {
    log "拉取最新代码..."
    git pull origin main
}

# 创建Docker网络
create_network() {
    log "创建Docker网络..."
    if ! docker network ls | grep -q panda-quant-network; then
        docker network create panda-quant-network
    fi
}

# 构建Docker镜像
build_images() {
    log "构建Docker镜像..."
    
    # 构建admin-api镜像
    log "构建admin-api镜像..."
    copy_shared_directory
    
    # 确保 prisma 目录存在
    if [ ! -d "prisma" ]; then
        mkdir -p prisma
        cp "$WORKSPACE_DIR/admin-api/prisma/schema.prisma" prisma/
    fi
    
    docker build -t panda-quant-admin-api:latest -f Dockerfile ../admin-api
}

# 启动服务
start_services() {
    log "启动服务..."
    docker-compose -f docker-compose.network.yml -f docker-compose.admin.yml up -d
}

# 主函数
main() {
    log "开始部署..."
    
    # 检查必要的命令
    check_commands
    
    # 加载环境变量
    log "加载环境变量..."
    if [ -f .env ]; then
        source .env
    fi
    
    # 检查环境变量
    log "检查环境变量..."
    if [ -z "$JWT_SECRET" ] || [ -z "$ENCRYPTION_KEY" ]; then
        warn "缺少必要的环境变量，将使用默认值"
    fi
    
    # 设置默认环境变量
    set_default_env
    
    # 创建必要的目录结构
    create_directories
    
    # 创建Docker网络
    create_network
    
    # 拉取最新代码
    pull_latest_code
    
    # 构建Docker镜像
    build_images
    
    # 启动服务
    start_services
    
    log "部署完成"
}

# 执行主函数
main 