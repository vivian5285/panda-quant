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

# 确保在正确的目录下运行
cd "$WORKSPACE_DIR"
log "当前工作目录: $(pwd)"

# 创建日志目录
mkdir -p "$WORKSPACE_DIR/logs"
LOG_FILE="$WORKSPACE_DIR/logs/deploy_$(date +%Y%m%d_%H%M%S).log"

# 设置日志输出
exec 1> >(tee -a "$LOG_FILE")
exec 2>&1

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

# 创建网络（如果不存在）
create_network() {
    log "设置 Docker 网络..."
    if ! docker network ls | grep -q panda-quant-network; then
        docker network create panda-quant-network
        log "创建 panda-quant-network 网络"
    else
        log "panda-quant-network 网络已存在"
    fi
}

# 创建数据卷
setup_volumes() {
    log "设置数据卷..."
    docker volume create mongodb_data || true
    docker volume create redis_data || true
    log "数据卷设置完成"
}

# 加载环境变量
load_env() {
    log "加载环境变量..."
    if [ -f "$WORKSPACE_DIR/.env" ]; then
        source "$WORKSPACE_DIR/.env"
    else
        log "未找到 .env 文件，使用默认环境变量配置"
        # 设置默认环境变量
        export MONGODB_USERNAME=admin
        export MONGODB_PASSWORD=Wl528586*
        export MONGODB_DATABASE=panda_quant
        export REDIS_PASSWORD=Wl528586*
    fi
}

# 清理旧容器和镜像
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
    
    # 清理之前的构建
    rm -rf dist
    rm -rf node_modules
    
    # 安装依赖并构建
    log "安装共享模块依赖..."
    npm install --production
    log "构建共享模块..."
    npm run build
    
    # 确保构建成功
    if [ ! -d "dist" ]; then
        error "共享模块构建失败"
    fi
    
    cd "$WORKSPACE_DIR"
}

# 部署管理端 API
deploy_admin_api() {
    log "部署管理端 API..."
    
    # 检查端口
    check_port 3001 "管理端 API"
    
    # 先构建共享模块
    deploy_shared
    
    # 构建管理端 API
    log "构建管理端 API..."
    docker build -t panda-quant-admin-api \
        --build-arg PORT=3001 \
        -f "$WORKSPACE_DIR/deploy/Dockerfile.api" \
        "$WORKSPACE_DIR/admin-api" || error "管理端 API 构建失败"
    
    # 启动管理端 API 服务
    log "启动管理端 API 服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.admin.yml" up -d admin-api
    
    # 检查服务状态
    log "检查管理端 API 服务状态..."
    check_container_status panda-quant-admin-api
}

# 部署管理端 UI
deploy_admin_ui() {
    log "部署管理端 UI..."
    
    # 先构建共享模块
    deploy_shared
    
    # 构建管理端 UI
    log "构建管理端 UI..."
    docker build -t panda-quant-admin-ui \
        -f "$WORKSPACE_DIR/deploy/Dockerfile.ui" \
        "$WORKSPACE_DIR/admin-ui" || error "管理端 UI 构建失败"
    
    # 启动管理端 UI 服务
    log "启动管理端 UI 服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.admin.yml" up -d admin-ui
    
    # 检查服务状态
    log "检查管理端 UI 服务状态..."
    check_container_status panda-quant-admin-ui
}

# 部署用户端 API
deploy_user_api() {
    log "部署用户端 API..."
    
    # 检查端口
    check_port 3002 "用户端 API"
    
    # 先构建共享模块
    deploy_shared
    
    # 构建用户端 API
    log "构建用户端 API..."
    docker build -t panda-quant-user-api \
        --build-arg PORT=3002 \
        -f "$WORKSPACE_DIR/deploy/Dockerfile.api" \
        "$WORKSPACE_DIR/user-api" || error "用户端 API 构建失败"
    
    # 启动用户端 API 服务
    log "启动用户端 API 服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.user.yml" up -d user-api
    
    # 检查服务状态
    log "检查用户端 API 服务状态..."
    check_container_status panda-quant-user-api
}

# 部署用户端 UI
deploy_user_ui() {
    log "部署用户端 UI..."
    
    # 先构建共享模块
    deploy_shared
    
    # 构建用户端 UI
    log "构建用户端 UI..."
    docker build -t panda-quant-user-ui \
        -f "$WORKSPACE_DIR/deploy/Dockerfile.ui" \
        "$WORKSPACE_DIR/user-ui" || error "用户端 UI 构建失败"
    
    # 启动用户端 UI 服务
    log "启动用户端 UI 服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.user.yml" up -d user-ui
    
    # 检查服务状态
    log "检查用户端 UI 服务状态..."
    check_container_status panda-quant-user-ui
}

# 部署 Nginx
deploy_nginx() {
    log "部署 Nginx..."
    check_port 443 "Nginx" || return 1
    check_port 80 "Nginx" || return 1
    check_port 81 "Nginx"
    check_port 444 "Nginx"
    
    # 启动 Nginx 服务
    log "启动 Nginx 服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.admin.yml" up -d nginx-admin
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.user.yml" up -d nginx-user
    
    # 检查服务状态
    log "检查 Nginx 服务状态..."
    check_container_status panda-quant-nginx-admin
    check_container_status panda-quant-nginx-user
}

# 部署数据库
deploy_database() {
    log "部署数据库服务..."
    check_port 27017 "MongoDB" || return 1
    check_port 6379 "Redis" || return 1
    
    # 设置数据卷
    setup_volumes
    
    # 启动数据库服务
    log "启动数据库服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.admin.yml" up -d mongodb redis
    
    # 检查服务状态
    log "检查数据库服务状态..."
    check_container_status panda-quant-mongodb
    check_container_status panda-quant-redis
}

# 回滚到上一个版本
rollback() {
    log "开始回滚..."
    local version=$1
    
    if [ -z "$version" ]; then
        error "请指定要回滚的版本"
    fi
    
    # 停止当前服务
    log "停止当前服务..."
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.admin.yml" down
    docker-compose -f "$WORKSPACE_DIR/deploy/docker-compose.user.yml" down
    
    # 回滚到指定版本
    log "回滚到版本 $version..."
    git checkout $version
    
    # 重新部署
    log "重新部署..."
    deploy_database
    deploy_shared
    deploy_admin_api
    deploy_admin_ui
    deploy_user_api
    deploy_user_ui
    deploy_nginx
}

# 主函数
main() {
    local deploy_type=$1
    local version=$2
    
    # 检查依赖
    check_dependencies
    
    # 加载环境变量
    load_env
    
    # 设置网络
    create_network
    
    # 设置数据卷（只在需要时创建）
    if [ "$deploy_type" = "database" ] || [ "$deploy_type" = "all" ]; then
        setup_volumes
    fi
    
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
        "rollback")
            rollback $version
            ;;
        *)
            error "请指定部署类型: shared, admin-api, admin-ui, user-api, user-ui, nginx, database, admin, user, all, cleanup 或 rollback"
            ;;
    esac
}

# 执行主函数
main "$@" 