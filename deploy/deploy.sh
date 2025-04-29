#!/bin/bash

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

# 设置环境变量
export COMPOSE_HTTP_TIMEOUT=300
export DOCKER_BUILDKIT=1

# 加载环境变量
if [ -f ../.env ]; then
    print_message "Loading environment variables from .env file..." "$YELLOW"
    export $(grep -v '^#' ../.env | xargs)
else
    handle_error ".env file not found"
fi

# 检查并安装必要的软件
install_requirements() {
    print_message "Installing required packages..." "$YELLOW"
    
    # 检查并安装必要的软件包
    required_packages=(
        "git"
        "nodejs"
        "npm"
        "docker"
        "docker-compose"
        "nginx"
        "certbot"
        "python3-certbot-nginx"
    )
    
    for package in "${required_packages[@]}"; do
        if ! command -v "$package" &> /dev/null; then
            print_message "Installing $package..." "$YELLOW"
            apt-get update
            apt-get install -y "$package" || handle_error "Failed to install $package"
        fi
    done
}

# 检查环境变量
check_env() {
    print_message "Checking environment variables..." "$YELLOW"
    
    # 检查必要的环境变量
    required_vars=(
        "JWT_SECRET"
        "ENCRYPTION_KEY"
        "MONGO_INITDB_ROOT_PASSWORD"
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
    
    # 检查并安装用户API依赖
    cd ../user-api
    if [ ! -d "node_modules" ]; then
        print_message "Installing user-api dependencies..." "$YELLOW"
        npm install --legacy-peer-deps || handle_error "Failed to install user-api dependencies"
    else
        print_message "user-api dependencies already installed, skipping..." "$YELLOW"
    fi
    
    # 检查并安装管理API依赖
    cd ../admin-api
    if [ ! -d "node_modules" ]; then
        print_message "Installing admin-api dependencies..." "$YELLOW"
        npm install --legacy-peer-deps || handle_error "Failed to install admin-api dependencies"
    else
        print_message "admin-api dependencies already installed, skipping..." "$YELLOW"
    fi
    
    # 检查并安装用户UI依赖
    cd ../user-ui
    if [ ! -d "node_modules" ]; then
        print_message "Installing user-ui dependencies..." "$YELLOW"
        npm install --legacy-peer-deps || handle_error "Failed to install user-ui dependencies"
        # 生成类型声明文件
        npm run build:types || handle_error "Failed to generate type declarations"
    else
        print_message "user-ui dependencies already installed, skipping..." "$YELLOW"
    fi
    
    # 检查并安装管理UI依赖
    cd ../admin-ui
    if [ ! -d "node_modules" ]; then
        print_message "Installing admin-ui dependencies..." "$YELLOW"
        npm install --legacy-peer-deps || handle_error "Failed to install admin-ui dependencies"
        # 生成类型声明文件
        npm run build:types || handle_error "Failed to generate type declarations"
    else
        print_message "admin-ui dependencies already installed, skipping..." "$YELLOW"
    fi
    
    cd ../deploy
}

# 停止服务
stop_services() {
    print_message "Stopping services..." "$YELLOW"
    
    # 停止所有服务
    docker-compose -f ./docker-compose.user.yml down || print_message "No user services to stop" "$YELLOW"
    docker-compose -f ./docker-compose.admin.yml down || print_message "No admin services to stop" "$YELLOW"
    docker-compose -f ./docker-compose.network.yml down || print_message "No network to stop" "$YELLOW"
    
    # 清理 Docker 资源
    docker system prune -af || print_message "Warning: Failed to prune Docker system" "$YELLOW"
    docker volume prune -f || print_message "Warning: Failed to prune Docker volumes" "$YELLOW"
    docker builder prune -af || print_message "Warning: Failed to prune Docker builder cache" "$YELLOW"
}

# 启动服务
start_services() {
    print_message "Starting services..." "$YELLOW"
    
    # 按顺序启动服务
    print_message "Creating network..." "$YELLOW"
    docker-compose -f ./docker-compose.network.yml up -d || handle_error "Failed to create network"
    
    print_message "Starting admin services..." "$YELLOW"
    docker-compose -f ./docker-compose.admin.yml up -d --build || handle_error "Failed to start admin services"
    
    print_message "Starting user services..." "$YELLOW"
    docker-compose -f ./docker-compose.user.yml up -d --build || handle_error "Failed to start user services"
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
        "panda-quant-nginx-admin"
        "panda-quant-nginx-user"
        "panda-quant-mongodb"
        "panda-quant-redis"
    )
    
    for service in "${services[@]}"; do
        if ! docker ps | grep -q "$service"; then
            handle_error "$service container is not running"
        fi
    done
}

# 配置域名和 SSL
setup_domain_ssl() {
    print_message "Setting up domain and SSL..." "$YELLOW"
    
    # 安装必要的软件
    apt-get update
    apt-get install -y nginx certbot python3-certbot-nginx
    
    # 获取 SSL 证书
    certbot --nginx -d pandatrade.space -d www.pandatrade.space -d admin.pandatrade.space -d api.pandatrade.space -d admin-api.pandatrade.space --non-interactive --agree-tos --email admin@pandatrade.space || handle_error "Failed to setup SSL certificates"
    
    # 设置自动更新
    (crontab -l 2>/dev/null; echo "0 0 * * * /usr/bin/certbot renew --quiet") | crontab -
}

# 配置防火墙
setup_firewall() {
    print_message "Setting up firewall..." "$YELLOW"
    
    # 安装 ufw
    apt-get install -y ufw || handle_error "Failed to install ufw"
    
    # 配置防火墙规则
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo "y" | ufw enable || handle_error "Failed to enable firewall"
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

# 设置备份
setup_backup() {
    print_message "Setting up backup..." "$YELLOW"
    
    # 创建备份目录
    mkdir -p /backup
    
    # 创建备份脚本
    cat > /backup/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# 备份 MongoDB
docker exec panda-quant-mongodb mongodump --out=$BACKUP_DIR/mongodb

# 备份 Redis
docker exec panda-quant-redis redis-cli SAVE
docker cp panda-quant-redis:/data/dump.rdb $BACKUP_DIR/redis/

# 压缩备份
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR
EOF
    
    # 设置备份脚本权限
    chmod +x /backup/backup.sh
    
    # 设置备份定时任务
    (crontab -l 2>/dev/null; echo "0 2 * * * /backup/backup.sh") | crontab -
}

# 主函数
main() {
    print_message "Starting deployment..." "$GREEN"
    
    # 检查是否为 root 用户
    if [ "$EUID" -ne 0 ]; then
        handle_error "Please run as root"
    fi
    
    # 执行部署步骤
    install_requirements
    check_env
    install_dependencies
    stop_services
    start_services
    check_services
    
    # 询问是否继续配置域名和 SSL
    read -p "Do you want to configure domain and SSL now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_domain_ssl
        setup_firewall
        setup_backup
    else
        print_message "Skipping domain and SSL configuration. You can run these steps later." "$YELLOW"
    fi
    
    print_message "Deployment completed successfully!" "$GREEN"
}

# 执行主函数
main 