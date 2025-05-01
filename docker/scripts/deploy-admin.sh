#!/bin/bash

# 设置错误时退出
set -e

# 设置日志文件
LOG_FILE="/var/log/panda-quant/deploy-admin.log"
mkdir -p /var/log/panda-quant
touch $LOG_FILE

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# 详细日志函数
log_detail() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [详细] $1" | tee -a $LOG_FILE
}

# 错误分析函数
analyze_error() {
    local error_type=$1
    local error_message=$2
    local error_details=$3
    
    log "错误分析报告:"
    log "====================="
    
    case $error_type in
        "DOCKER_SERVICE")
            log "错误类型: Docker 服务问题"
            log "可能原因:"
            log "1. Docker 服务未启动"
            log "2. Docker 守护进程崩溃"
            log "3. 系统资源不足"
            log "建议解决方案:"
            log "1. 检查 Docker 服务状态: systemctl status docker"
            log "2. 重启 Docker 服务: systemctl restart docker"
            log "3. 检查系统资源使用情况"
            ;;
        "DOCKER_COMPOSE")
            log "错误类型: Docker Compose 问题"
            log "可能原因:"
            log "1. Docker Compose 未安装"
            log "2. Docker Compose 版本不兼容"
            log "3. docker-compose.yml 文件格式错误"
            log "建议解决方案:"
            log "1. 安装 Docker Compose: apt-get install docker-compose"
            log "2. 检查 docker-compose.yml 文件格式"
            log "3. 更新 Docker Compose 版本"
            ;;
        "NGINX_CONFIG")
            log "错误类型: Nginx 配置问题"
            log "可能原因:"
            log "1. 配置文件语法错误"
            log "2. 权限问题"
            log "3. 端口冲突"
            log "建议解决方案:"
            log "1. 检查 Nginx 配置语法: nginx -t"
            log "2. 检查文件权限"
            log "3. 检查端口占用情况"
            ;;
        "SERVICE_HEALTH")
            log "错误类型: 服务健康检查失败"
            log "可能原因:"
            log "1. 服务启动失败"
            log "2. 依赖服务未就绪"
            log "3. 端口被占用"
            log "4. 资源限制"
            log "建议解决方案:"
            log "1. 检查服务日志: docker-compose logs [service]"
            log "2. 检查端口占用: netstat -tuln"
            log "3. 检查系统资源使用情况"
            ;;
        "BUILD_FAILED")
            log "错误类型: 构建失败"
            log "可能原因:"
            log "1. 依赖安装失败"
            log "2. 编译错误"
            log "3. 资源不足"
            log "建议解决方案:"
            log "1. 检查构建日志"
            log "2. 清理 npm 缓存: npm cache clean --force"
            log "3. 检查磁盘空间"
            ;;
        "DNS_RESOLUTION")
            log "错误类型: DNS 解析问题"
            log "可能原因:"
            log "1. DNS 记录未正确配置"
            log "2. DNS 服务器问题"
            log "3. 网络连接问题"
            log "建议解决方案:"
            log "1. 检查 DNS 记录: dig +short A [domain]"
            log "2. 检查网络连接"
            log "3. 检查 DNS 服务器配置"
            ;;
        *)
            log "错误类型: 未知错误"
            log "错误详情: $error_message"
            log "建议解决方案:"
            log "1. 检查系统日志"
            log "2. 检查应用程序日志"
            log "3. 联系技术支持"
            ;;
    esac
    
    log "====================="
    log "详细错误信息:"
    log "$error_details"
}

# 错误处理函数
handle_error() {
    local error_type=$1
    local error_message=$2
    local error_details=$3
    
    log "错误: $error_message"
    log "错误详情: $error_details"
    
    # 分析错误
    analyze_error "$error_type" "$error_message" "$error_details"
    
    log "部署失败，正在回滚..."
    docker-compose -f $CURRENT_DIR/docker-compose.admin.yml down
    exit 1
}

# 服务健康检查函数
check_service_health() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    log "检查服务 $service 的健康状态..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "http://localhost:$port/health" > /dev/null; then
            log "服务 $service 健康检查通过"
            return 0
        fi
        
        log "等待服务 $service 启动... (尝试 $attempt/$max_attempts)"
        sleep 5
        attempt=$((attempt + 1))
    done
    
    handle_error "SERVICE_HEALTH" "服务 $service 健康检查失败" "服务在 $max_attempts 次尝试后仍未就绪"
}

# 检查并创建必要目录
check_and_create_directories() {
    # 创建 nginx 用户和组
    if ! getent group nginx >/dev/null; then
        log_detail "创建 nginx 组"
        groupadd nginx
    fi
    
    if ! getent passwd nginx >/dev/null; then
        log_detail "创建 nginx 用户"
        useradd -g nginx -s /sbin/nologin nginx
    fi
    
    local dirs=(
        "$PROJECT_ROOT/admin-api/logs"
        "$PROJECT_ROOT/admin-api/dist"
        "/var/cache/nginx"
        "/var/cache/nginx/client_temp"
        "/var/cache/nginx/proxy_temp"
        "/var/cache/nginx/fastcgi_temp"
        "/var/cache/nginx/uwsgi_temp"
        "/var/cache/nginx/scgi_temp"
    )
    
    for dir in "${dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            log_detail "创建目录: $dir"
            mkdir -p "$dir"
        fi
    done
}

# 设置目录权限
set_directory_permissions() {
    local dirs=(
        "$PROJECT_ROOT/admin-api/logs"
        "$PROJECT_ROOT/admin-api/dist"
        "/var/cache/nginx"
        "/var/cache/nginx/client_temp"
        "/var/cache/nginx/proxy_temp"
        "/var/cache/nginx/fastcgi_temp"
        "/var/cache/nginx/uwsgi_temp"
        "/var/cache/nginx/scgi_temp"
    )
    
    for dir in "${dirs[@]}"; do
        if [ -d "$dir" ]; then
            log_detail "设置目录权限: $dir"
            chmod -R 755 "$dir"
            if getent passwd nginx >/dev/null && getent group nginx >/dev/null; then
                chown -R nginx:nginx "$dir"
            else
                log_detail "警告: nginx 用户或组不存在，使用当前用户设置权限"
                chown -R $(id -u):$(id -g) "$dir"
            fi
        fi
    done
}

# 验证 Nginx 配置
validate_nginx_config() {
    log "验证 Nginx 配置..."
    if ! nginx -t; then
        handle_error "NGINX_CONFIG" "Nginx 配置验证失败" "$(nginx -t 2>&1)"
    fi
    log "Nginx 配置验证成功"
}

# 检查 Docker 服务状态
check_docker_services() {
    log "检查 Docker 服务状态..."
    
    # 检查 Docker 是否运行
    if ! systemctl is-active --quiet docker; then
        handle_error "DOCKER_SERVICE" "Docker 服务未运行" "请确保 Docker 服务已启动"
    fi
    
    # 检查 Docker Compose 是否可用
    if ! command -v docker-compose &> /dev/null; then
        handle_error "DOCKER_COMPOSE" "Docker Compose 未安装" "请安装 Docker Compose"
    fi
}

# 清理旧的容器和镜像
cleanup_old_containers() {
    log "清理旧的容器和镜像..."
    
    # 停止并删除旧的容器
    docker-compose -f $CURRENT_DIR/docker-compose.admin.yml down --remove-orphans
    
    # 清理未使用的镜像
    docker image prune -f
}

# 域名配置
DOMAIN="pandatrade.space"
ADMIN_SUBDOMAIN="admin"
ADMIN_API_SUBDOMAIN="admin-api"
ADMIN_DOMAIN="${ADMIN_SUBDOMAIN}.${DOMAIN}"
ADMIN_API_DOMAIN="${ADMIN_API_SUBDOMAIN}.${DOMAIN}"

# 检查DNS解析
check_dns() {
    local domain=$1
    log "检查域名 $domain 的DNS解析..."
    
    # 检查A记录
    if ! dig +short A $domain | grep -q '^[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}$'; then
        handle_error "DNS_RESOLUTION" "域名 $domain 的A记录未正确配置" "请检查 DNS 记录配置"
    fi
    
    # 检查CNAME记录
    if ! dig +short CNAME $domain > /dev/null; then
        log "域名 $domain 没有CNAME记录"
    fi
    
    log "域名 $domain 的DNS解析正常"
}

# 检查域名解析
check_domain_resolution() {
    local domain=$1
    log "检查域名 $domain 的解析..."
    
    if ! curl -s -m 5 "http://$domain" > /dev/null; then
        log "警告: 域名 $domain 无法通过HTTP访问，请确保域名已正确解析到服务器IP"
    fi
    
    if ! curl -s -m 5 "https://$domain" > /dev/null; then
        log "警告: 域名 $domain 无法通过HTTPS访问，请确保SSL证书已正确配置"
    fi
}

# 设置当前部署目录和项目根目录
CURRENT_DIR=$(pwd)
PROJECT_ROOT=$(dirname "$CURRENT_DIR")

log "当前部署目录: $CURRENT_DIR"
log "项目根目录: $PROJECT_ROOT"

# 检查 Docker 服务
check_docker_services

# 检查DNS解析
check_dns $ADMIN_DOMAIN
check_dns $ADMIN_API_DOMAIN

# 1. 配置环境变量
log "1. 配置环境变量..."
if [ ! -f .env ]; then
    cat > .env << EOF
# 应用配置
NODE_ENV=production

# 端口配置
ADMIN_API_PORT=3001

# 域名配置
DOMAIN=${DOMAIN}
ADMIN_SUBDOMAIN=${ADMIN_SUBDOMAIN}
ADMIN_API_SUBDOMAIN=${ADMIN_API_SUBDOMAIN}
ADMIN_DOMAIN=${ADMIN_DOMAIN}
ADMIN_API_DOMAIN=${ADMIN_API_DOMAIN}

# 数据库配置
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=Wl528586*
MONGO_URI=mongodb://admin:Wl528586*@mongodb:27017/admin

# Redis配置
REDIS_PASSWORD=Wl528586*
REDIS_URI=redis://:Wl528586*@redis:6380

# JWT配置
JWT_SECRET=Wl528586*

# Encryption key
ENCRYPTION_KEY=Wl528586*

# Network Configuration
NETWORK_NAME=panda-quant-network

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_RETENTION_DAYS=30
EOF
    log "环境变量文件创建成功"
else
    log "环境变量文件已存在，跳过创建"
fi

# 设置权限
chmod 600 .env
if [ -f ssl/private.key ]; then
    chmod 600 ssl/private.key
fi
if [ -f ssl/certificate.crt ]; then
    chmod 644 ssl/certificate.crt
fi

# 在构建镜像前添加目录检查和权限设置
log "检查并创建必要目录..."
check_and_create_directories

log "设置目录权限..."
set_directory_permissions

# 2. 安装依赖和类型定义
log "2. 检查依赖和类型定义..."
cd $PROJECT_ROOT/admin-api

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    log "node_modules 不存在，安装依赖..."
    # 清理 npm 缓存
    npm cache clean --force
    # 安装依赖
    npm install --legacy-peer-deps
    log "依赖安装完成"
else
    log "node_modules 已存在，跳过安装"
fi

# 检查类型定义文件是否存在
if [ ! -d "src/types" ]; then
    log "创建缺失的类型定义文件..."
    mkdir -p src/types
    
    # 创建 Blacklist 类型定义
    cat > src/types/Blacklist.d.ts << EOF
export interface Blacklist {
    _id: string;
    userId: string;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}
EOF
    
    # 创建 CommissionRule 类型定义
    cat > src/types/CommissionRule.d.ts << EOF
export interface CommissionRule {
    _id: string;
    level: number;
    rate: number;
    createdAt: Date;
    updatedAt: Date;
}
EOF
    
    # 创建 Order 类型定义
    cat > src/types/Order.d.ts << EOF
export interface Order {
    _id: string;
    userId: string;
    strategyId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
EOF
    
    # 创建 StrategyRating 类型定义
    cat > src/types/StrategyRating.d.ts << EOF
export interface StrategyRating {
    _id: string;
    strategyId: string;
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}
EOF
    
    # 创建 UserLevel 类型定义
    cat > src/types/UserLevel.d.ts << EOF
export interface UserLevel {
    _id: string;
    userId: string;
    level: number;
    points: number;
    createdAt: Date;
    updatedAt: Date;
}
EOF
else
    log "类型定义文件已存在，跳过创建"
fi

# 3. 构建应用
log "3. 构建应用..."
npm run build
if [ $? -ne 0 ]; then
    handle_error "BUILD_FAILED" "构建失败" "请检查构建日志"
fi
log "应用构建成功"

# 4. 启动服务
log "4. 启动管理端服务..."
cd $CURRENT_DIR

# 清理旧的容器和镜像
cleanup_old_containers

# 构建并启动服务
docker-compose -f docker-compose.admin.yml up -d --build

# 等待服务启动
log "等待服务启动..."
sleep 10

# 检查服务健康状态
check_service_health "admin-api" 8081
check_service_health "admin-ui" 8084

# 5. 配置 SSL 证书
log "5. 配置 SSL 证书..."
log "配置管理端域名证书..."
validate_nginx_config

# 6. 验证服务
log "6. 验证服务..."
check_domain_resolution $ADMIN_DOMAIN
check_domain_resolution $ADMIN_API_DOMAIN

log "部署完成！"
log "管理端访问地址: https://$ADMIN_DOMAIN"
log "API 访问地址: https://$ADMIN_API_DOMAIN" 