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
DEPLOY_DIR="$(dirname "${BASH_SOURCE[0]}")"

# 确保在正确的目录下运行
cd "$WORKSPACE_DIR"
log "当前工作目录: $(pwd)"

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

# 构建 shared 模块
build_shared() {
    log "构建 shared 模块..."
    cd "$WORKSPACE_DIR/shared"
    npm install
    npm run build
    cd "$WORKSPACE_DIR"
}

# 检查必要的命令
check_commands() {
    log "检查必要的命令..."
    for cmd in docker docker-compose git openssl curl dig; do
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
            sudo apt-get install -y mongodb-org-tools
        else
            error "不支持的操作系统，请手动安装 MongoDB 工具"
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
    
    # 设置默认密钥
    export JWT_SECRET=${JWT_SECRET:-"Wl528586*"}
    export ENCRYPTION_KEY=${ENCRYPTION_KEY:-"Wl528586*"}
    export REDIS_PASSWORD=${REDIS_PASSWORD:-"Wl528586*"}
    
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
    export MONGODB_ADMIN_URI=${MONGODB_ADMIN_URI:-"mongodb://admin:Wl528586*@mongodb:27018/panda-quant-admin?authSource=admin"}
    export MONGODB_USER_URI=${MONGODB_USER_URI:-"mongodb://admin:Wl528586*@mongodb:27019/panda-quant-user?authSource=admin"}
    
    # 设置默认Redis连接（转义@符号）
    export REDIS_ADMIN_URL=${REDIS_ADMIN_URL:-"redis://:Wl528586*@redis:6380"}
    export REDIS_USER_URL=${REDIS_USER_URL:-"redis://:Wl528586*@redis:6381"}
    
    # 保存环境变量到文件
    cat > .env << EOF
# 端口配置
ADMIN_API_PORT=$ADMIN_API_PORT
USER_API_PORT=$USER_API_PORT
ADMIN_UI_PORT=$ADMIN_UI_PORT
USER_UI_PORT=$USER_UI_PORT

# 数据库端口
MONGODB_ADMIN_PORT=$MONGODB_ADMIN_PORT
MONGODB_USER_PORT=$MONGODB_USER_PORT
REDIS_ADMIN_PORT=$REDIS_ADMIN_PORT
REDIS_USER_PORT=$REDIS_USER_PORT

# 域名配置
DOMAIN=$DOMAIN
ADMIN_SUBDOMAIN=$ADMIN_SUBDOMAIN
ADMIN_API_SUBDOMAIN=$ADMIN_API_SUBDOMAIN
API_SUBDOMAIN=$API_SUBDOMAIN

# 数据库连接
MONGODB_ADMIN_URI=$MONGODB_ADMIN_URI
MONGODB_USER_URI=$MONGODB_USER_URI
REDIS_ADMIN_URL=$REDIS_ADMIN_URL
REDIS_USER_URL=$REDIS_USER_URL

# 密钥配置
JWT_SECRET=$JWT_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY
REDIS_PASSWORD=$REDIS_PASSWORD

# 环境配置
NODE_ENV=production
EOF
    
    log "环境变量已设置并保存到 .env 文件"
}

# 加载环境变量
load_env() {
    log "加载环境变量..."
    if [ -f .env ]; then
        # 使用source命令加载环境变量，并忽略错误
        set +e
        source .env
        set -e
    else
        warn "未找到 .env 文件，将使用默认值"
    fi
}

# 检查环境变量
check_env() {
    log "检查环境变量..."
    
    # 加载现有的环境变量
    load_env
    
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
    cp -f "$DEPLOY_DIR/docker-compose.admin.yml" "$WORKSPACE_DIR/docker-compose.admin.yml" 2>/dev/null || true
    cp -f "$DEPLOY_DIR/docker-compose.user.yml" "$WORKSPACE_DIR/docker-compose.user.yml" 2>/dev/null || true
    
    # 检查Prisma schema文件
    log "检查Prisma schema文件..."
    if [ ! -f "$WORKSPACE_DIR/admin-api/prisma/schema.prisma" ]; then
        error "找不到Prisma schema文件: $WORKSPACE_DIR/admin-api/prisma/schema.prisma"
    fi
    
    log "目录结构创建完成"
}

# 拉取最新代码
log "跳过自动拉取代码，请确保代码已手动更新..."

# 创建Docker网络
create_docker_network() {
    log "创建Docker网络..."
    if ! docker network ls | grep -q panda-quant-network; then
        docker network create panda-quant-network
    fi
}

# 构建Docker镜像
build_docker_images() {
    log "构建Docker镜像..."
    
    # 先构建 shared 模块
    build_shared
    
    # 构建admin相关服务
    log "构建admin相关服务镜像..."
    docker-compose -f "$DEPLOY_DIR/docker-compose.admin.yml" build --no-cache
    if [ $? -ne 0 ]; then
        error "构建admin服务镜像失败"
    fi
    
    # 构建user相关服务
    log "构建user相关服务镜像..."
    docker-compose -f "$DEPLOY_DIR/docker-compose.user.yml" build --no-cache
    if [ $? -ne 0 ]; then
        error "构建user服务镜像失败"
    fi
}

# 检查DNS记录
check_dns() {
    log "检查DNS记录..."
    local domains=(
        "pandatrade.space"
        "admin.pandatrade.space"
        "admin-api.pandatrade.space"
        "api.pandatrade.space"
    )
    
    for domain in "${domains[@]}"; do
        local ip=$(dig +short $domain)
        if [ "$ip" != "194.164.149.214" ]; then
            error "$domain 的DNS记录未正确指向 194.164.149.214"
        fi
        log "$domain -> $ip ✓"
    done
}

# 设置环境变量
set_env() {
    log "设置环境变量..."
    
    # 加载现有的环境变量
    if [ -f .env ]; then
        source .env
    fi
    
    # 设置默认值
    export ADMIN_API_PORT=${ADMIN_API_PORT:-8081}
    export USER_API_PORT=${USER_API_PORT:-8083}
    export ADMIN_UI_PORT=${ADMIN_UI_PORT:-8080}
    export USER_UI_PORT=${USER_UI_PORT:-8082}
    
    export MONGODB_ADMIN_PORT=${MONGODB_ADMIN_PORT:-27018}
    export MONGODB_USER_PORT=${MONGODB_USER_PORT:-27019}
    export REDIS_ADMIN_PORT=${REDIS_ADMIN_PORT:-6380}
    export REDIS_USER_PORT=${REDIS_USER_PORT:-6381}
    
    export DOMAIN=${DOMAIN:-"pandatrade.space"}
    export ADMIN_SUBDOMAIN=${ADMIN_SUBDOMAIN:-"admin"}
    export ADMIN_API_SUBDOMAIN=${ADMIN_API_SUBDOMAIN:-"admin-api"}
    export API_SUBDOMAIN=${API_SUBDOMAIN:-"api"}
    
    export MONGODB_ADMIN_URI=${MONGODB_ADMIN_URI:-"mongodb://admin:PandaQuant@2024@mongodb:27018/panda-quant-admin?authSource=admin"}
    export MONGODB_USER_URI=${MONGODB_USER_URI:-"mongodb://admin:PandaQuant@2024@mongodb:27019/panda-quant-user?authSource=admin"}
    
    export REDIS_ADMIN_URL=${REDIS_ADMIN_URL:-"redis://:PandaQuant@2024@redis:6380"}
    export REDIS_USER_URL=${REDIS_USER_URL:-"redis://:PandaQuant@2024@redis:6381"}
    
    export JWT_SECRET=${JWT_SECRET:-"PandaQuant@2024"}
    export ENCRYPTION_KEY=${ENCRYPTION_KEY:-"PandaQuant@2024"}
    export REDIS_PASSWORD=${REDIS_PASSWORD:-"PandaQuant@2024"}
    
    # 保存环境变量
    cat > .env << EOF
# 端口配置
ADMIN_API_PORT=$ADMIN_API_PORT
USER_API_PORT=$USER_API_PORT
ADMIN_UI_PORT=$ADMIN_UI_PORT
USER_UI_PORT=$USER_UI_PORT

# 数据库端口
MONGODB_ADMIN_PORT=$MONGODB_ADMIN_PORT
MONGODB_USER_PORT=$MONGODB_USER_PORT
REDIS_ADMIN_PORT=$REDIS_ADMIN_PORT
REDIS_USER_PORT=$REDIS_USER_PORT

# 域名配置
DOMAIN=$DOMAIN
ADMIN_SUBDOMAIN=$ADMIN_SUBDOMAIN
ADMIN_API_SUBDOMAIN=$ADMIN_API_SUBDOMAIN
API_SUBDOMAIN=$API_SUBDOMAIN

# 数据库连接
MONGODB_ADMIN_URI=$MONGODB_ADMIN_URI
MONGODB_USER_URI=$MONGODB_USER_URI
REDIS_ADMIN_URL=$REDIS_ADMIN_URL
REDIS_USER_URL=$REDIS_USER_URL

# 密钥配置
JWT_SECRET=$JWT_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY
REDIS_PASSWORD=$REDIS_PASSWORD

# 环境配置
NODE_ENV=production
EOF
}

# 创建目录
create_dirs() {
    log "创建必要的目录..."
    mkdir -p ssl
    mkdir -p admin-ui/dist
    mkdir -p user-ui/dist
    mkdir -p backup
}

# 备份现有配置
backup_config() {
    log "备份现有配置..."
    local timestamp=$(date +%Y%m%d_%H%M%S)
    tar -czf "backup/config_$timestamp.tar.gz" \
        nginx.conf \
        docker-compose.yml \
        .env \
        ssl/
}

# 生成SSL证书
generate_ssl() {
    log "生成SSL证书..."
    local domains=(
        "pandatrade.space"
        "admin.pandatrade.space"
        "admin-api.pandatrade.space"
        "api.pandatrade.space"
    )
    
    for domain in "${domains[@]}"; do
        if [ ! -f "ssl/$domain.key" ] || [ ! -f "ssl/$domain.crt" ]; then
            log "为 $domain 生成SSL证书..."
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout "ssl/$domain.key" \
                -out "ssl/$domain.crt" \
                -subj "/CN=$domain"
        fi
    done
}

# 启动服务
start_services() {
    log "启动服务..."
    
    # 启动admin相关服务
    log "启动admin相关服务..."
    docker-compose -f "$DEPLOY_DIR/docker-compose.admin.yml" up -d
    
    # 启动user相关服务
    log "启动user相关服务..."
    docker-compose -f "$DEPLOY_DIR/docker-compose.user.yml" up -d
}

# 检查服务状态
check_services() {
    log "检查服务状态..."
    sleep 10
    
    # 检查容器状态
    if ! docker-compose ps | grep -q "Up"; then
        error "部分服务未正常运行"
    fi
    
    # 检查服务健康状态
    local services=(
        "https://admin.pandatrade.space/health"
        "https://admin-api.pandatrade.space/health"
        "https://pandatrade.space/health"
        "https://api.pandatrade.space/health"
    )
    
    for url in "${services[@]}"; do
        if ! curl -k -s -f $url > /dev/null; then
            warn "$url 健康检查失败"
        else
            log "$url 健康检查通过 ✓"
        fi
    done
}

# 主函数
main() {
    log "开始部署..."
    
    # 检查必要的命令
    check_commands
    
    # 检查环境变量
    check_env
    
    # 创建必要的目录结构
    create_directories
    
    # 创建Docker网络
    create_docker_network
    
    # 拉取最新代码
    log "跳过自动拉取代码，请确保代码已手动更新..."
    
    # 构建Docker镜像
    build_docker_images
    
    # 检查DNS记录
    check_dns
    
    # 设置环境变量
    set_env
    
    # 创建目录
    create_dirs
    
    # 备份配置
    backup_config
    
    # 生成SSL证书
    generate_ssl
    
    # 启动服务
    start_services
    
    # 检查服务状态
    check_services
    
    log "部署完成！"
    log "访问以下地址："
    log "- 主站: https://pandatrade.space"
    log "- 管理后台: https://admin.pandatrade.space"
    log "- API文档: https://api.pandatrade.space"
}

# 执行主函数
main "$@" 