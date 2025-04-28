#!/bin/bash

# 设置错误处理
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

# 设置工作目录
WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$WORKSPACE_DIR"
log "当前工作目录: $(pwd)"

# 检查依赖
check_dependencies() {
    log "检查系统依赖..."
    command -v docker >/dev/null 2>&1 || { error "需要安装 Docker"; }
    command -v node >/dev/null 2>&1 || { error "需要安装 Node.js"; }
    command -v npm >/dev/null 2>&1 || { error "需要安装 npm"; }
    command -v docker-compose >/dev/null 2>&1 || { error "需要安装 docker-compose"; }
    log "系统依赖检查完成"
}

# 检查端口是否被占用
check_port() {
    local port=$1
    local service=$2
    if lsof -i :$port > /dev/null 2>&1; then
        log "WARN: $service 所需的端口 $port 已被占用，尝试释放..."
        local pid=$(lsof -t -i :$port)
        if [ ! -z "$pid" ]; then
            kill -9 $pid
            sleep 2
            if ! lsof -i :$port > /dev/null 2>&1; then
                log "端口 $port 已释放"
                return 0
            fi
        fi
        log "ERROR: 无法释放端口 $port"
        return 1
    fi
    return 0
}

# 检查容器状态
check_container_status() {
    local container_name=$1
    if [ "$(docker ps -q -f name=$container_name)" ]; then
        log "$container_name 容器运行正常"
        return 0
    else
        warn "$container_name 容器未运行"
        return 1
    fi
}

# 创建网络
create_network() {
    log "设置 Docker 网络..."
    if ! docker network ls | grep -q panda-quant-network; then
        docker network create panda-quant-network
        log "创建 panda-quant-network 网络"
    else
        log "panda-quant-network 网络已存在"
    fi
}

# 设置数据卷
setup_volumes() {
    log "设置数据卷..."
    docker volume create mongodb_data || true
    docker volume create redis_data || true
    log "数据卷设置完成"
}

# 加载环境变量
load_env() {
    log "加载环境变量..."
    export MONGODB_USERNAME=admin
    export MONGODB_PASSWORD=Wl528586*
    export MONGODB_DATABASE=panda_quant
    export REDIS_PASSWORD=Wl528586*
}

# 清理
cleanup() {
    log "清理旧容器和镜像..."
    docker stop $(docker ps -a -q) 2>/dev/null || true
    docker rm $(docker ps -a -q) 2>/dev/null || true
    docker rmi $(docker images -q) 2>/dev/null || true
    log "清理完成"
}

# 部署共享模块
deploy_shared() {
    log "部署共享模块..."
    cd "$WORKSPACE_DIR/shared"
    rm -rf dist node_modules
    find src -name "*.js" -delete
    find src -name "*.d.ts" -delete
    
    log "安装共享模块依赖..."
    npm install
    npm install --save-dev @types/bcryptjs
    
    log "构建共享模块..."
    npm run build
    
    if [ ! -d "dist" ]; then
        error "共享模块构建失败"
    fi
    
    cd "$WORKSPACE_DIR"
}

# 部署数据库
deploy_database() {
    log "部署数据库服务..."
    check_port 27017 "MongoDB" || return 1
    check_port 6379 "Redis" || return 1
    
    setup_volumes
    
    log "启动数据库服务..."
    MONGODB_USERNAME=$MONGODB_USERNAME \
    MONGODB_PASSWORD=$MONGODB_PASSWORD \
    MONGODB_DATABASE=$MONGODB_DATABASE \
    REDIS_PASSWORD=$REDIS_PASSWORD \
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.admin.yml" up -d mongodb redis
    
    log "检查数据库服务状态..."
    check_container_status panda-quant-mongodb
    check_container_status panda-quant-redis
}

# 部署管理端 API
deploy_admin_api() {
    log "部署管理端 API..."
    check_port 3001 "管理端 API"
    deploy_shared
    
    log "构建管理端 API..."
    docker build -t panda-quant-admin-api \
        --build-arg PORT=3001 \
        -f "$WORKSPACE_DIR/deploy/Dockerfile.api" \
        "$WORKSPACE_DIR/admin-api" || error "管理端 API 构建失败"
    
    log "启动管理端 API 服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.admin.yml" up -d admin-api
    check_container_status panda-quant-admin-api
}

# 部署管理端 UI
deploy_admin_ui() {
    log "部署管理端 UI..."
    deploy_shared
    
    log "构建管理端 UI..."
    docker build -t panda-quant-admin-ui \
        -f "$WORKSPACE_DIR/deploy/Dockerfile.ui" \
        "$WORKSPACE_DIR/admin-ui" || error "管理端 UI 构建失败"
    
    log "启动管理端 UI 服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.admin.yml" up -d admin-ui
    check_container_status panda-quant-admin-ui
}

# 部署用户端 API
deploy_user_api() {
    log "部署用户端 API..."
    check_port 3002 "用户端 API"
    deploy_shared
    
    log "构建用户端 API..."
    docker build -t panda-quant-user-api \
        --build-arg PORT=3002 \
        -f "$WORKSPACE_DIR/deploy/Dockerfile.api" \
        "$WORKSPACE_DIR/user-api" || error "用户端 API 构建失败"
    
    log "启动用户端 API 服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.user.yml" up -d user-api
    check_container_status panda-quant-user-api
}

# 部署用户端 UI
deploy_user_ui() {
    log "部署用户端 UI..."
    deploy_shared
    
    log "构建用户端 UI..."
    docker build -t panda-quant-user-ui \
        -f "$WORKSPACE_DIR/deploy/Dockerfile.ui" \
        "$WORKSPACE_DIR/user-ui" || error "用户端 UI 构建失败"
    
    log "启动用户端 UI 服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.user.yml" up -d user-ui
    check_container_status panda-quant-user-ui
}

# 部署 Nginx
deploy_nginx() {
    log "部署 Nginx..."
    check_port 443 "Nginx" || return 1
    check_port 80 "Nginx" || return 1
    check_port 81 "Nginx"
    check_port 444 "Nginx"
    
    log "启动 Nginx 服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.admin.yml" up -d nginx-admin
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.user.yml" up -d nginx-user
    
    log "检查 Nginx 服务状态..."
    check_container_status panda-quant-nginx-admin
    check_container_status panda-quant-nginx-user
}

# 主函数
main() {
    local deploy_type=$1
    
    check_dependencies
    load_env
    create_network
    
    case $deploy_type in
        "shared")
            deploy_shared
            ;;
        "admin-api")
            deploy_admin_api
            ;;
        "admin-ui")
            deploy_admin_ui
            ;;
        "user-api")
            deploy_user_api
            ;;
        "user-ui")
            deploy_user_ui
            ;;
        "nginx")
            deploy_nginx
            ;;
        "database")
            deploy_database
            ;;
        "admin")
            deploy_shared
            deploy_admin_api
            deploy_admin_ui
            deploy_nginx
            ;;
        "user")
            deploy_shared
            deploy_user_api
            deploy_user_ui
            deploy_nginx
            ;;
        "all")
            deploy_database
            deploy_shared
            deploy_admin_api
            deploy_admin_ui
            deploy_user_api
            deploy_user_ui
            deploy_nginx
            ;;
        "cleanup")
            cleanup
            ;;
        *)
            error "请指定部署类型: shared, admin-api, admin-ui, user-api, user-ui, nginx, database, admin, user, all, cleanup"
            ;;
    esac
}

# 执行主函数
main "$@" 