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

# 检查环境变量
check_env() {
    print_message "Checking environment variables..." "$YELLOW"
    
    # 检查必要的环境变量
    required_vars=(
        "JWT_SECRET"
        "ENCRYPTION_KEY"
        "MONGODB_PASSWORD"
        "REDIS_PASSWORD"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            handle_error "Missing required environment variable: $var"
        fi
    done
}

# 安装依赖
install_dependencies() {
    print_message "Installing dependencies..." "$YELLOW"
    
    # 安装部署依赖
    cd deploy
    npm install || handle_error "Failed to install deploy dependencies"
    
    # 安装用户API依赖
    cd ../user-api
    npm install || handle_error "Failed to install user-api dependencies"
    
    # 安装管理API依赖
    cd ../admin-api
    npm install || handle_error "Failed to install admin-api dependencies"
    
    # 安装用户UI依赖
    cd ../user-ui
    npm install || handle_error "Failed to install user-ui dependencies"
    
    # 安装管理UI依赖
    cd ../admin-ui
    npm install || handle_error "Failed to install admin-ui dependencies"
    
    cd ..
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
    docker-compose down || print_message "No services to stop" "$YELLOW"
}

# 启动服务
start_services() {
    print_message "Starting services..." "$YELLOW"
    
    # 启动所有服务
    docker-compose up -d || handle_error "Failed to start services"
}

# 检查服务状态
check_services() {
    print_message "Checking service status..." "$YELLOW"
    
    # 等待服务启动
    sleep 10
    
    # 检查容器状态
    services=(
        "panda-quant-admin-api"
        "panda-quant-admin-ui"
        "panda-quant-user-api"
        "panda-quant-user-ui"
        "panda-quant-nginx"
        "panda-quant-mongodb"
        "panda-quant-redis"
    )
    
    for service in "${services[@]}"; do
        if ! docker ps | grep -q "$service"; then
            handle_error "$service container is not running"
        fi
    done
    
    # 检查服务健康状态
    print_message "Checking service health..." "$YELLOW"
    
    # 检查健康状态
    health_endpoints=(
        "http://localhost:8081/health"
        "http://localhost:3000/health"
        "http://localhost:8082/health"
        "http://localhost:3001/health"
        "http://localhost/health"
    )
    
    for endpoint in "${health_endpoints[@]}"; do
        if ! curl -s "$endpoint" | grep -q "ok"; then
            handle_error "Health check failed for $endpoint"
        fi
    done
}

# 主函数
main() {
    print_message "Starting deployment..." "$GREEN"
    
    # 执行部署步骤
    check_env
    install_dependencies
    cleanup_system
    stop_services
    start_services
    check_services
    
    print_message "Deployment completed successfully!" "$GREEN"
}

# 执行主函数
main 