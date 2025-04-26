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
    export JWT_SECRET=${JWT_SECRET:-"your_jwt_secret_key_here"}
    
    # 创建 .env 文件
    cat > .env << EOF
# 应用配置
NODE_ENV=production

# 端口配置
ADMIN_API_PORT=${ADMIN_API_PORT}
USER_API_PORT=${USER_API_PORT}
ADMIN_UI_PORT=${ADMIN_UI_PORT}
USER_UI_PORT=${USER_UI_PORT}
MONGODB_ADMIN_PORT=${MONGODB_ADMIN_PORT}
MONGODB_USER_PORT=${MONGODB_USER_PORT}
REDIS_ADMIN_PORT=${REDIS_ADMIN_PORT}
REDIS_USER_PORT=${REDIS_USER_PORT}

# 域名配置
DOMAIN=${DOMAIN}
ADMIN_SUBDOMAIN=${ADMIN_SUBDOMAIN}
ADMIN_API_SUBDOMAIN=${ADMIN_API_SUBDOMAIN}
API_SUBDOMAIN=${API_SUBDOMAIN}

# 数据库配置
MONGODB_ADMIN_URI=${MONGODB_ADMIN_URI}
MONGODB_USER_URI=${MONGODB_USER_URI}
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=PandaQuant@2024

# Redis配置
REDIS_ADMIN_URL=${REDIS_ADMIN_URL}
REDIS_USER_URL=${REDIS_USER_URL}
REDIS_PASSWORD=PandaQuant@2024

# JWT配置
JWT_SECRET=${JWT_SECRET}
EOF
    
    log "环境变量已设置并保存到 .env 文件"
}

# 检查环境变量
check_env() {
    log "检查环境变量..."
    
    # 设置默认值
    set_default_env
    
    # 检查关键环境变量
    if [ "$JWT_SECRET" = "your_jwt_secret_key_here" ]; then
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
    
    # 创建基本目录
    mkdir -p admin-api/prisma
    mkdir -p user-api/prisma
    mkdir -p admin-ui/prisma
    mkdir -p user-ui/prisma
    mkdir -p backups
    
    # 复制docker-compose文件
    log "复制docker-compose配置文件..."
    if [ -f "docker-compose.admin.yml" ]; then
        log "docker-compose.admin.yml 已存在"
    else
        error "未找到docker-compose.admin.yml文件"
    fi
    
    if [ -f "docker-compose.user.yml" ]; then
        log "docker-compose.user.yml 已存在"
    else
        error "未找到docker-compose.user.yml文件"
    fi
    
    if [ -f "docker-compose.network.yml" ]; then
        log "docker-compose.network.yml 已存在"
    else
        error "未找到docker-compose.network.yml文件"
    fi
    
    # 确保Prisma schema文件存在
    log "检查Prisma schema文件..."
    if [ ! -f "../admin-api/prisma/schema.prisma" ]; then
        warn "未找到管理后台API的Prisma schema文件，将创建空文件"
        mkdir -p "../admin-api/prisma"
        touch "../admin-api/prisma/schema.prisma"
    fi
    
    if [ ! -f "../user-api/prisma/schema.prisma" ]; then
        warn "未找到用户端API的Prisma schema文件，将创建空文件"
        mkdir -p "../user-api/prisma"
        touch "../user-api/prisma/schema.prisma"
    fi
    
    log "目录结构创建完成"
}

# 拉取最新代码
pull_latest_code() {
    log "拉取最新代码..."
    if ! git pull origin main; then
        warn "代码拉取失败，继续使用当前代码..."
    fi
}

# 创建网络
create_network() {
    log "创建Docker网络..."
    if ! docker network ls | grep -q "panda-quant-network"; then
        docker-compose -f docker-compose.network.yml up -d
    fi
}

# 构建Docker镜像
build_images() {
    log "构建Docker镜像..."
    
    # 构建admin-api
    log "构建admin-api镜像..."
    if [ -d "../admin-api" ]; then
        cd "../admin-api"
        
        # 复制共享目录
        if [ -d "../shared" ]; then
            log "复制共享目录..."
            # 如果目标目录已存在，先删除
            if [ -d "shared" ]; then
                rm -rf shared
            fi
            # 复制共享目录
            cp -r "../shared" .
        else
            error "共享目录不存在"
        fi
        
        # 安装依赖
        log "安装依赖..."
        if ! npm install && npm install -g typescript tsconfig-paths; then
            error "依赖安装失败"
        fi
        
        # 生成 Prisma 客户端
        log "生成 Prisma 客户端..."
        if ! npx prisma generate; then
            error "Prisma 客户端生成失败"
        fi
        
        # 构建镜像
        if ! docker build \
            --build-arg MONGODB_ADMIN_URI="${MONGODB_ADMIN_URI}" \
            --build-arg REDIS_ADMIN_URL="${REDIS_ADMIN_URL}" \
            --build-arg JWT_SECRET="${JWT_SECRET}" \
            -t panda-quant-admin-api .; then
            error "管理后台API镜像构建失败"
        fi
        
        # 清理复制的共享目录
        rm -rf shared
        
        cd -
    else
        error "admin-api目录不存在"
    fi
    
    # 构建user-api
    log "构建user-api镜像..."
    if [ -d "../user-api" ]; then
        cd "../user-api"
        
        # 复制共享目录
        if [ -d "../shared" ]; then
            log "复制共享目录..."
            # 如果目标目录已存在，先删除
            if [ -d "shared" ]; then
                rm -rf shared
            fi
            # 复制共享目录
            cp -r "../shared" .
        else
            error "共享目录不存在"
        fi
        
        # 安装依赖
        log "安装依赖..."
        if ! npm install && npm install -g typescript tsconfig-paths; then
            error "依赖安装失败"
        fi
        
        # 生成 Prisma 客户端
        log "生成 Prisma 客户端..."
        if ! npx prisma generate; then
            error "Prisma 客户端生成失败"
        fi
        
        # 构建镜像
        if ! docker build \
            --build-arg MONGODB_USER_URI="${MONGODB_USER_URI}" \
            --build-arg REDIS_USER_URL="${REDIS_USER_URL}" \
            --build-arg JWT_SECRET="${JWT_SECRET}" \
            -t panda-quant-user-api .; then
            error "用户端API镜像构建失败"
        fi
        
        # 清理复制的共享目录
        rm -rf shared
        
        cd -
    else
        error "user-api目录不存在"
    fi
}

# 部署管理后台
deploy_admin() {
    log "部署管理后台..."
    
    # 获取当前目录
    current_dir=$(pwd)
    
    # 构建管理后台UI
    log "构建管理后台UI..."
    if [ -d "../admin-ui" ]; then
        cd "../admin-ui"
        if ! docker build -t panda-quant-admin-ui .; then
            error "管理后台UI镜像构建失败"
        fi
        cd "$current_dir"
    else
        error "管理后台UI目录不存在"
    fi
    
    # 启动管理后台服务
    log "启动管理后台服务..."
    if ! docker-compose -f docker-compose.admin.yml up -d; then
        error "管理后台服务启动失败"
    fi
}

# 部署用户端
deploy_user() {
    log "部署用户端..."
    
    # 获取当前目录
    current_dir=$(pwd)
    
    # 构建用户端API
    log "构建用户端API..."
    if [ -d "../user-api" ]; then
        cd "../user-api"
        
        # 复制共享目录
        if [ -d "../shared" ]; then
            log "复制共享目录..."
            # 如果目标目录已存在，先删除
            if [ -d "shared" ]; then
                rm -rf shared
            fi
            # 复制共享目录
            cp -r "../shared" .
        else
            error "共享目录不存在"
        fi
        
        # 构建镜像
        if ! docker build \
            --build-arg MONGODB_USER_URI="${MONGODB_USER_URI}" \
            --build-arg REDIS_USER_URL="${REDIS_USER_URL}" \
            --build-arg JWT_SECRET="${JWT_SECRET}" \
            -t panda-quant-user-api .; then
            error "用户端API镜像构建失败"
        fi
        
        # 清理复制的共享目录
        rm -rf shared
        
        cd "$current_dir"
    else
        error "用户端API目录不存在"
    fi
    
    # 构建用户端UI
    log "构建用户端UI..."
    if [ -d "../user-ui" ]; then
        cd "../user-ui"
        if ! docker build -t panda-quant-user-ui .; then
            error "用户端UI镜像构建失败"
        fi
        cd "$current_dir"
    else
        error "用户端UI目录不存在"
    fi
    
    # 启动用户端服务
    log "启动用户端服务..."
    if ! docker-compose -f docker-compose.user.yml up -d; then
        error "用户端服务启动失败"
    fi
}

# 检查服务状态
check_services() {
    log "检查服务状态..."
    sleep 10
    
    # 检查管理后台服务
    log "检查管理后台服务状态..."
    if ! docker-compose -f docker-compose.admin.yml ps; then
        error "管理后台服务状态检查失败"
    fi
    
    # 检查用户端服务
    log "检查用户端服务状态..."
    if ! docker-compose -f docker-compose.user.yml ps; then
        error "用户端服务状态检查失败"
    fi
}

# 安装Certbot
install_certbot() {
    log "安装Certbot..."
    if ! command -v certbot &> /dev/null; then
        if [ -f /etc/debian_version ]; then
            sudo apt-get update
            sudo apt-get install -y certbot python3-certbot-nginx
        elif [ -f /etc/redhat-release ]; then
            sudo yum install -y certbot python3-certbot-nginx
        else
            error "不支持的操作系统"
        fi
    fi
}

# 清理现有证书和配置
cleanup_existing_certs() {
    log "清理现有证书和配置..."
    
    # 停止Nginx服务
    if systemctl is-active --quiet nginx; then
        sudo systemctl stop nginx
    fi
    
    # 删除现有证书
    if [ -d "/etc/letsencrypt" ]; then
        sudo rm -rf /etc/letsencrypt/live/*
        sudo rm -rf /etc/letsencrypt/archive/*
        sudo rm -rf /etc/letsencrypt/renewal/*
    fi
    
    # 删除Nginx配置
    if [ -f "/etc/nginx/nginx.conf" ]; then
        sudo rm -f /etc/nginx/nginx.conf
    fi
    if [ -f "/etc/nginx/conf.d/default.conf" ]; then
        sudo rm -f /etc/nginx/conf.d/default.conf
    fi
    
    # 删除sites-enabled目录下的所有配置
    if [ -d "/etc/nginx/sites-enabled" ]; then
        sudo rm -f /etc/nginx/sites-enabled/*
    fi
    
    log "清理完成"
}

# 获取SSL证书
get_ssl_certificates() {
    log "获取SSL证书..."
    
    # 停止Nginx服务
    log "停止Nginx服务..."
    if systemctl is-active --quiet nginx; then
        sudo systemctl stop nginx
    fi
    
    # 检查是否已存在有效证书
    if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/${DOMAIN}/privkey.pem" ]; then
        log "发现已存在的有效证书，跳过证书获取..."
    else
        certbot certonly --standalone -d "${DOMAIN}" -d "admin.${DOMAIN}" -d "admin-api.${DOMAIN}" -d "api.${DOMAIN}" --non-interactive --agree-tos --email "${ADMIN_EMAIL}"
        if [ $? -ne 0 ]; then
            error "获取SSL证书失败"
        fi
        log "SSL证书获取成功"
    fi
}

# 配置Nginx SSL
configure_nginx_ssl() {
    log "配置Nginx SSL..."
    
    # 创建Nginx配置目录
    sudo mkdir -p /etc/nginx/conf.d
    
    # 复制Nginx主配置
    log "复制Nginx主配置..."
    sudo cp nginx/nginx.conf /etc/nginx/
    
    # 复制虚拟主机配置
    log "复制虚拟主机配置..."
    sudo cp nginx/conf.d/default.conf /etc/nginx/conf.d/
    
    # 检查Nginx配置
    log "检查Nginx配置..."
    if ! sudo nginx -t; then
        error "Nginx配置检查失败"
    fi
    
    # 重启Nginx
    log "重启Nginx服务..."
    if ! sudo systemctl restart nginx; then
        error "Nginx重启失败"
    fi
    
    log "Nginx SSL配置完成"
}

# 设置证书自动续期
setup_certbot_renewal() {
    log "设置证书自动续期..."
    
    # 创建续期脚本
    cat > /etc/cron.d/certbot-renew << EOF
0 0 * * * root systemctl stop nginx && certbot renew --quiet --standalone --preferred-challenges http && systemctl start nginx
EOF
    
    # 设置权限
    chmod 644 /etc/cron.d/certbot-renew
    
    log "证书自动续期设置完成"
}

# 主函数
main() {
    log "开始部署..."
    
    # 基础部署步骤
    check_commands
    load_env
    check_env
    create_directories
    create_network
    pull_latest_code
    
    # 构建镜像
    build_images
    
    # 部署服务
    deploy_admin
    deploy_user
    
    # 检查服务状态
    check_services
    
    # 等待服务启动
    log "等待服务启动..."
    sleep 30
    
    # 备份数据库
    backup_database
    
    # SSL证书配置步骤
    install_certbot
    cleanup_existing_certs
    get_ssl_certificates
    configure_nginx_ssl
    setup_certbot_renewal
    
    log "部署完成！"
}

# 执行主函数
main 