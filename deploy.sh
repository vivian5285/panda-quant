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
if [ ! -f deploy/.env ]; then
    print_error "deploy/.env file not found"
fi

# 加载环境变量
source deploy/.env

# 安装必要的软件包
install_dependencies() {
    print_message "Installing required packages..."
    apt-get update
    
    # 先移除可能冲突的包
    apt-get remove -y containerd || true
    
    # 安装 Docker 相关包
    apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # 添加 Docker 官方 GPG 密钥
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg --yes
    
    # 设置 Docker 仓库
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # 更新包索引
    apt-get update
    
    # 安装 Docker 引擎
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # 安装其他必要包
    apt-get install -y \
        curl \
        jq \
        certbot \
        python3-certbot-nginx
    
    check_result "Failed to install packages"
}

# 检查环境变量
check_env_variables() {
    print_message "Checking environment variables..."
    
    # 确保环境变量已加载
    if [ -z "$MONGO_INITDB_ROOT_USERNAME" ]; then
        print_error "Environment variables not loaded. Please check deploy/.env file"
    fi
    
    required_vars=(
        "MONGO_INITDB_ROOT_USERNAME"
        "MONGO_INITDB_ROOT_PASSWORD"
        "REDIS_PASSWORD"
        "JWT_SECRET"
        "ENCRYPTION_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "$var is not set in deploy/.env file"
        fi
    done
}

# 配置域名和 SSL
setup_domain_and_ssl() {
    print_message "Setting up domain and SSL..."
    
    # 检查域名配置
    if [ -z "$DOMAIN" ]; then
        print_error "DOMAIN environment variable is not set"
        exit 1
    fi
    
    # 检查 SSL 证书
    if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ] || [ ! -f "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ]; then
        print_error "SSL certificates not found for $DOMAIN"
        exit 1
    fi
    
    # 配置 Nginx
    cp deploy/nginx/nginx.conf /etc/nginx/nginx.conf
    cp deploy/nginx/admin.conf /etc/nginx/conf.d/
    cp deploy/nginx/user.conf /etc/nginx/conf.d/
    cp deploy/nginx/strategy.conf /etc/nginx/conf.d/
    cp deploy/nginx/server.conf /etc/nginx/conf.d/
    
    # 重启 Nginx
    systemctl restart nginx
    
    print_success "Domain and SSL setup completed"
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
    
    # 清理 Docker 缓存
    print_message "Cleaning Docker cache..."
    docker system prune -f
    
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
    print_message "Checking services..."
    
    # 检查 admin 服务
    if ! docker-compose -f deploy/docker-compose.admin.yml ps | grep -q "Up"; then
        print_error "Admin services are not running"
        exit 1
    fi
    
    # 检查 user 服务
    if ! docker-compose -f deploy/docker-compose.user.yml ps | grep -q "Up"; then
        print_error "User services are not running"
        exit 1
    fi
    
    # 检查 strategy 服务
    if ! docker-compose -f deploy/docker-compose.strategy.yml ps | grep -q "Up"; then
        print_error "Strategy services are not running"
        exit 1
    fi
    
    print_success "All services are running"
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