#!/bin/bash

# 设置环境变量
export COMPOSE_HTTP_TIMEOUT=300
export DOCKER_BUILDKIT=1

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 打印带颜色的消息
print_message() {
    echo -e "${2}${1}${NC}"
}

# 错误处理
handle_error() {
    print_message "Error: $1" "$RED"
    exit 1
}

# 清理系统资源
cleanup_system() {
    print_message "Cleaning up system resources..." "$YELLOW"
    
    # 清理系统缓存
    sync; echo 3 > /proc/sys/vm/drop_caches || print_message "Warning: Failed to clear system cache" "$YELLOW"
    
    # 清理 Docker 资源
    docker system prune -af || handle_error "Failed to prune Docker system"
    docker volume prune -f || handle_error "Failed to prune Docker volumes"
    docker builder prune -af || handle_error "Failed to prune Docker builder cache"
}

# 停止服务
stop_services() {
    print_message "Stopping services..." "$YELLOW"
    
    # 停止所有服务
    docker-compose -f docker-compose.admin.yml down || print_message "No admin services to stop" "$YELLOW"
    docker-compose -f docker-compose.user.yml down || print_message "No user services to stop" "$YELLOW"
}

# 创建网络
setup_network() {
    print_message "Setting up network..." "$YELLOW"
    
    # 删除现有网络
    docker network rm panda-quant-network 2>/dev/null || true
    
    # 创建新网络
    docker-compose -f docker-compose.network.yml up -d || handle_error "Failed to create network"
}

# 准备构建环境
prepare_build() {
    print_message "Preparing build environment..." "$YELLOW"
    
    # 创建必要的目录
    mkdir -p prisma
    
    # 复制必要的文件
    cp -r ../admin-api/* .
    cp -r ../admin-ui/* .
}

# 构建服务
build_services() {
    print_message "Building services..." "$YELLOW"
    
    # 构建 admin-api
    print_message "Building admin-api..." "$YELLOW"
    docker-compose -f docker-compose.admin.yml build --no-cache admin-api || handle_error "Failed to build admin-api"
    
    # 构建 admin-ui
    print_message "Building admin-ui..." "$YELLOW"
    docker-compose -f docker-compose.admin.yml build --no-cache admin-ui || handle_error "Failed to build admin-ui"
}

# 启动服务
start_services() {
    print_message "Starting services..." "$YELLOW"
    
    # 启动服务
    docker-compose -f docker-compose.admin.yml up -d || handle_error "Failed to start services"
}

# 检查服务状态
check_services() {
    print_message "Checking service status..." "$YELLOW"
    
    # 等待服务启动
    sleep 10
    
    # 检查容器状态
    if ! docker ps | grep -q "panda-quant-admin-api"; then
        handle_error "admin-api container is not running"
    fi
    
    if ! docker ps | grep -q "panda-quant-admin-ui"; then
        handle_error "admin-ui container is not running"
    fi
    
    if ! docker ps | grep -q "panda-quant-nginx-admin"; then
        handle_error "nginx container is not running"
    fi
    
    # 检查服务健康状态
    print_message "Checking service health..." "$YELLOW"
    
    # 检查 admin-api 健康状态
    if ! curl -s http://localhost:3001/health | grep -q "ok"; then
        handle_error "admin-api health check failed"
    fi
    
    # 检查 admin-ui 健康状态
    if ! curl -s http://localhost:3000/health | grep -q "ok"; then
        handle_error "admin-ui health check failed"
    fi
    
    # 检查 nginx 健康状态
    if ! curl -s http://localhost:8081/health | grep -q "ok"; then
        handle_error "nginx health check failed"
    fi
}

# 主函数
main() {
    print_message "Starting deployment..." "$GREEN"
    
    # 执行部署步骤
    cleanup_system
    stop_services
    setup_network
    prepare_build
    build_services
    start_services
    check_services
    
    print_message "Deployment completed successfully!" "$GREEN"
}

# 执行主函数
main 