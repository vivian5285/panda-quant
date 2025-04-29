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

# 安装必要的软件包
install_dependencies() {
    print_message "Installing required packages..."
    
    # 更新包索引
    apt-get update
    
    # 安装 Node.js 和 npm
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    
    # 安装其他必要包
    apt-get install -y \
        nginx \
        redis-server \
        mongodb \
        pm2 \
        git \
        curl \
        jq \
        certbot \
        python3-certbot-nginx
    
    check_result "Failed to install packages"
}

# 检查环境变量
check_env_variables() {
    print_message "Checking environment variables..."
    
    if [ ! -f .env ]; then
        print_error ".env file not found"
    fi
    
    source .env
    
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

# 配置数据库
setup_databases() {
    print_message "Setting up databases..."
    
    # 配置 MongoDB
    systemctl start mongodb
    systemctl enable mongodb
    
    # 配置 Redis
    systemctl start redis-server
    systemctl enable redis-server
    
    # 设置 Redis 密码
    redis-cli CONFIG SET requirepass "$REDIS_PASSWORD"
}

# 安装和构建前端
setup_frontend() {
    print_message "Setting up frontend applications..."
    
    # Admin UI
    cd admin-ui
    npm install
    npm run build
    cd ..
    
    # User UI
    cd user-ui
    npm install
    npm run build
    cd ..
}

# 安装后端服务
setup_backend() {
    print_message "Setting up backend services..."
    
    # Admin API
    cd admin-api
    npm install
    cd ..
    
    # User API
    cd user-api
    npm install
    cd ..
    
    # Strategy Engine
    cd strategy-engine
    npm install
    cd ..
    
    # Server
    cd server
    npm install
    cd ..
}

# 配置 Nginx
setup_nginx() {
    print_message "Setting up Nginx..."
    
    # 复制 Nginx 配置文件
    cp deploy/nginx/nginx.conf /etc/nginx/nginx.conf
    cp deploy/nginx/admin.conf /etc/nginx/conf.d/
    cp deploy/nginx/user.conf /etc/nginx/conf.d/
    cp deploy/nginx/strategy.conf /etc/nginx/conf.d/
    cp deploy/nginx/server.conf /etc/nginx/conf.d/
    
    # 重启 Nginx
    systemctl restart nginx
}

# 启动服务
start_services() {
    print_message "Starting services..."
    
    # 使用 PM2 启动所有服务
    cd admin-api && pm2 start npm --name "admin-api" -- start
    cd ../user-api && pm2 start npm --name "user-api" -- start
    cd ../strategy-engine && pm2 start npm --name "strategy-engine" -- start
    cd ../server && pm2 start npm --name "server" -- start
    
    # 保存 PM2 配置
    pm2 save
}

# 配置防火墙
setup_firewall() {
    print_message "Setting up firewall..."
    
    # 允许 HTTP 和 HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # 允许必要的端口
    ufw allow 3001:3005/tcp
    
    # 启用防火墙
    ufw --force enable
}

# 主函数
main() {
    print_message "开始部署..."
    check_env
    install_dependencies
    setup_database
    setup_frontend
    setup_backend
    setup_nginx
    start_services
    setup_firewall
    print_message "部署完成"
}

# 执行主函数
main 