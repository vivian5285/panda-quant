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

# 检查环境变量
check_env() {
    print_message "检查环境变量..."
    
    if [ ! -f .env ]; then
        print_error ".env 文件未找到"
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
            print_error "$var 未在 .env 文件中设置"
        fi
    done
}

# 安装必要的软件包
install_dependencies() {
    print_message "安装必要的软件包..."
    
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
        jq
    
    check_result "安装软件包失败"
}

# 配置数据库
setup_database() {
    print_message "配置数据库..."
    
    # 配置 MongoDB
    systemctl start mongodb
    systemctl enable mongodb
    
    # 配置 Redis
    systemctl start redis-server
    systemctl enable redis-server
    
    # 设置 Redis 密码
    redis-cli CONFIG SET requirepass "$REDIS_PASSWORD"
}

# 安装和构建管理前端
setup_frontend() {
    print_message "安装和构建管理前端..."
    
    # Admin UI
    cd admin-ui
    npm install
    npm run build
    cd ..
}

# 安装管理后端服务
setup_backend() {
    print_message "安装管理后端服务..."
    
    # Admin API
    cd admin-api
    npm install
    cd ..
}

# 配置 Nginx
setup_nginx() {
    print_message "配置 Nginx..."
    
    # 复制 Nginx 配置文件
    cp deploy/nginx/nginx.conf /etc/nginx/nginx.conf
    cp deploy/nginx/admin.conf /etc/nginx/conf.d/
    
    # 重启 Nginx
    systemctl restart nginx
}

# 启动服务
start_services() {
    print_message "启动服务..."
    
    # 使用 PM2 启动管理服务
    cd admin-api && pm2 start npm --name "admin-api" -- start
    cd ..
    
    # 保存 PM2 配置
    pm2 save
}

# 配置防火墙
setup_firewall() {
    print_message "配置防火墙..."
    
    # 允许 HTTP 和 HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # 允许管理端口
    ufw allow 3001/tcp
    
    # 启用防火墙
    ufw --force enable
}

# 设置环境变量
setup_env() {
    print_message "设置环境变量..."
    
    # MongoDB 配置
    export MONGO_INITDB_ROOT_USERNAME="admin"
    export MONGO_INITDB_ROOT_PASSWORD="pandaquant123"
    
    # Redis 配置
    export REDIS_PASSWORD="pandaquant123"
    
    # JWT 配置
    export JWT_SECRET="pandaquant_jwt_secret_2024"
    
    # 加密密钥
    export ENCRYPTION_KEY="pandaquant_encryption_key_2024"
    
    # 数据库连接
    export MONGODB_URI="mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@localhost:27017"
    export REDIS_URL="redis://:${REDIS_PASSWORD}@localhost:6379"
    
    # 服务端口
    export ADMIN_API_PORT=3001
    
    # 域名配置
    export ADMIN_DOMAIN="admin.pandatrade.space"
    export ADMIN_API_DOMAIN="admin-api.pandatrade.space"
    
    print_message "环境变量设置完成"
}

# 主函数
main() {
    print_message "开始部署管理端..."
    setup_env
    check_env
    install_dependencies
    setup_database
    setup_frontend
    setup_backend
    setup_nginx
    start_services
    setup_firewall
    print_message "管理端部署完成"
}

# 执行主函数
main 