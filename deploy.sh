#!/bin/bash

# 打印带颜色的消息
print_message() {
    echo -e "\033[1;34m$1\033[0m"
}

# 打印错误消息
print_error() {
    echo -e "\033[1;31mError: $1\033[0m"
    exit 1
}

# 检查命令执行结果
check_result() {
    if [ $? -ne 0 ]; then
        print_error "$1"
    fi
}

# 设置环境变量
export COMPOSE_PROJECT_NAME=panda-quant
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# 检查 .env 文件
if [ ! -f .env ]; then
    print_error ".env file not found"
fi

# 安装必要的软件包
install_dependencies() {
    print_message "Installing required packages..."
    apt-get update
    apt-get install -y \
        docker.io \
        docker-compose \
        curl \
        jq \
        certbot \
        python3-certbot-nginx
    check_result "Failed to install packages"
}

# 检查环境变量
check_env_variables() {
    print_message "Checking environment variables..."
    required_vars=(
        "MONGO_INITDB_ROOT_USERNAME"
        "MONGO_INITDB_ROOT_PASSWORD"
        "REDIS_PASSWORD"
        "JWT_SECRET"
        "ENCRYPTION_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "$var is not set in .env file"
        fi
    done
}

# 配置域名和 SSL
setup_domain_and_ssl() {
    print_message "Setting up domain and SSL..."
    
    # 创建 Nginx 配置目录
    mkdir -p /etc/nginx/conf.d
    
    # 复制 Nginx 配置文件
    cp deploy/nginx/nginx.conf /etc/nginx/nginx.conf
    cp deploy/nginx/*.conf /etc/nginx/conf.d/
    
    # 重启 Nginx
    systemctl restart nginx
    
    # 获取 SSL 证书
    certbot --nginx -d panda-quant.com -d www.panda-quant.com -d admin.panda-quant.com -d strategy.panda-quant.com --non-interactive --agree-tos --email admin@panda-quant.com
    
    # 配置自动续期
    echo "0 0 * * * certbot renew --quiet" | crontab -
}

# 配置防火墙
setup_firewall() {
    print_message "Setting up firewall..."
    
    # 允许 HTTP 和 HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # 允许必要的 Docker 端口
    ufw allow 3001:3005/tcp
    
    # 启用防火墙
    ufw --force enable
}

# 启动服务
start_services() {
    print_message "Starting services..."
    
    # 启动管理服务
    docker-compose -f deploy/docker-compose.admin.yml up -d --build
    check_result "Failed to start admin services"
    
    # 启动用户服务
    docker-compose -f deploy/docker-compose.user.yml up -d --build
    check_result "Failed to start user services"
    
    # 启动策略引擎和服务器服务
    docker-compose -f deploy/docker-compose.strategy.yml up -d --build
    check_result "Failed to start strategy services"
}

# 检查服务状态
check_services() {
    print_message "Checking services status..."
    
    # 检查管理服务
    admin_services=("nginx-admin" "admin-api" "mongodb" "redis")
    for service in "${admin_services[@]}"; do
        if ! docker-compose -f deploy/docker-compose.admin.yml ps | grep -q "$service.*Up"; then
            print_error "$service is not running"
        fi
    done
    
    # 检查用户服务
    user_services=("nginx-user" "user-api" "user-ui")
    for service in "${user_services[@]}"; do
        if ! docker-compose -f deploy/docker-compose.user.yml ps | grep -q "$service.*Up"; then
            print_error "$service is not running"
        fi
    done
    
    # 检查策略服务
    strategy_services=("strategy-engine" "server")
    for service in "${strategy_services[@]}"; do
        if ! docker-compose -f deploy/docker-compose.strategy.yml ps | grep -q "$service.*Up"; then
            print_error "$service is not running"
        fi
    done
}

# 主函数
main() {
    print_message "Starting deployment..."
    
    # 安装依赖
    install_dependencies
    
    # 检查环境变量
    check_env_variables
    
    # 配置域名和 SSL
    setup_domain_and_ssl
    
    # 配置防火墙
    setup_firewall
    
    # 启动服务
    start_services
    
    # 检查服务状态
    check_services
    
    print_message "Deployment completed successfully!"
}

# 执行主函数
main 