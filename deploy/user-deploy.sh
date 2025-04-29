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

# 安装和构建用户前端
setup_frontend() {
    print_message "安装和构建用户前端..."
    
    # User UI
    cd user-ui
    npm install
    npm run build
    cd ..
}

# 安装用户和策略后端服务
setup_backend() {
    print_message "安装用户和策略后端服务..."
    
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
    print_message "配置 Nginx..."
    
    # 复制 Nginx 配置文件
    cp deploy/nginx/nginx.conf /etc/nginx/nginx.conf
    cp deploy/nginx/user.conf /etc/nginx/conf.d/
    cp deploy/nginx/strategy.conf /etc/nginx/conf.d/
    cp deploy/nginx/server.conf /etc/nginx/conf.d/
    
    # 重启 Nginx
    systemctl restart nginx
}

# 启动服务
start_services() {
    print_message "启动服务..."
    
    # 使用 PM2 启动用户和策略服务
    cd user-api && pm2 start npm --name "user-api" -- start
    cd ../strategy-engine && pm2 start npm --name "strategy-engine" -- start
    cd ../server && pm2 start npm --name "server" -- start
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
    
    # 允许用户和策略端口
    ufw allow 3002:3005/tcp
    
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
    export USER_API_PORT=3002
    export STRATEGY_ENGINE_PORT=3003
    export SERVER_PORT=3004
    
    # 域名配置
    export USER_DOMAIN="pandatrade.space"
    export USER_API_DOMAIN="api.pandatrade.space"
    export STRATEGY_DOMAIN="strategy.pandatrade.space"
    export SERVER_DOMAIN="server.pandatrade.space"
    
    # 交易配置
    export TRADE_FEE_RATE=0.001
    export MIN_TRADE_AMOUNT=10
    export MAX_TRADE_AMOUNT=10000
    
    print_message "环境变量设置完成"
    print_message "注意：Binance API 密钥需要在系统部署完成后通过管理后台进行配置"
}

# 主函数
main() {
    print_message "开始部署用户和策略端..."
    setup_env
    check_env
    install_dependencies
    setup_frontend
    setup_backend
    setup_nginx
    start_services
    setup_firewall
    print_message "用户和策略端部署完成"
}

# 执行主函数
main 