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

# 安装基础依赖
install_basic_deps() {
    print_message "安装基础依赖..."
    apt-get update
    apt-get install -y curl wget git
}

# 安装 Node.js
install_nodejs() {
    print_message "安装 Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    npm install -g pm2
}

# 安装数据库
install_databases() {
    print_message "安装数据库..."
    
    # 安装 MongoDB
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    apt-get update
    apt-get install -y mongodb-org redis-server
    
    # 启动数据库服务
    systemctl start mongodb redis-server
    systemctl enable mongodb redis-server
}

# 安装 Nginx
install_nginx() {
    print_message "安装 Nginx..."
    apt-get install -y nginx
}

# 配置环境变量
setup_env() {
    print_message "配置环境变量..."
    
    # 创建 .env 文件
    cat > .env << EOL
# MongoDB 配置
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=pandaquant123
MONGODB_URI=mongodb://admin:pandaquant123@localhost:27017

# Redis 配置
REDIS_PASSWORD=pandaquant123
REDIS_URL=redis://:pandaquant123@localhost:6379

# JWT 配置
JWT_SECRET=pandaquant_jwt_secret_2024

# 加密密钥
ENCRYPTION_KEY=pandaquant_encryption_key_2024

# 服务端口
ADMIN_API_PORT=3001
USER_API_PORT=3002
STRATEGY_ENGINE_PORT=3003
SERVER_PORT=3004

# 域名配置
ADMIN_DOMAIN=admin.pandatrade.space
ADMIN_API_DOMAIN=admin-api.pandatrade.space
USER_DOMAIN=pandatrade.space
USER_API_DOMAIN=api.pandatrade.space
STRATEGY_DOMAIN=strategy.pandatrade.space
SERVER_DOMAIN=server.pandatrade.space
EOL
}

# 安装和配置服务
setup_services() {
    print_message "安装和配置服务..."
    
    # 安装管理端
    cd admin-api && npm install && npm run build && cd ..
    cd admin-ui && npm install && npm run build && cd ..
    
    # 安装用户端
    cd user-api && npm install && npm run build && cd ..
    cd user-ui && npm install && npm run build && cd ..
    cd strategy-engine && npm install && npm run build && cd ..
    cd server && npm install && npm run build && cd ..
}

# 配置 Nginx
setup_nginx() {
    print_message "配置 Nginx..."
    
    # 复制 Nginx 配置
    cp deploy/nginx/nginx.conf /etc/nginx/nginx.conf
    cp deploy/nginx/*.conf /etc/nginx/conf.d/
    
    # 重启 Nginx
    systemctl restart nginx
}

# 启动服务
start_services() {
    print_message "启动服务..."
    
    # 启动管理端服务
    cd admin-api && pm2 start npm --name "admin-api" -- start && cd ..
    
    # 启动用户端服务
    cd user-api && pm2 start npm --name "user-api" -- start && cd ..
    cd strategy-engine && pm2 start npm --name "strategy-engine" -- start && cd ..
    cd server && pm2 start npm --name "server" -- start && cd ..
    
    # 保存 PM2 配置
    pm2 save
}

# 配置防火墙
setup_firewall() {
    print_message "配置防火墙..."
    
    # 允许必要端口
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3001:3004/tcp
    
    # 启用防火墙
    ufw --force enable
}

# 主函数
main() {
    print_message "开始简化部署..."
    
    # 安装基础依赖
    install_basic_deps
    
    # 安装 Node.js
    install_nodejs
    
    # 安装数据库
    install_databases
    
    # 安装 Nginx
    install_nginx
    
    # 配置环境变量
    setup_env
    
    # 安装和配置服务
    setup_services
    
    # 配置 Nginx
    setup_nginx
    
    # 启动服务
    start_services
    
    # 配置防火墙
    setup_firewall
    
    print_message "部署完成！"
    print_message "请确保所有域名已正确配置 DNS 记录"
    print_message "然后运行 deploy/ssl-setup.sh 配置 SSL 证书"
}

# 执行主函数
main 