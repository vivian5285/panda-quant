#!/bin/bash

# 设置错误时退出
set -e

# 显示当前目录
CURRENT_DIR=$(pwd)
PROJECT_ROOT=$(dirname "$CURRENT_DIR")

echo "当前部署目录: $CURRENT_DIR"
echo "项目根目录: $PROJECT_ROOT"

# 1. 配置环境变量
echo "1. 配置环境变量..."
cat > .env << 'EOF'
# 应用配置
NODE_ENV=production

# 端口配置
USER_API_PORT=8083
USER_UI_PORT=8082

# 域名配置
DOMAIN=pandatrade.space
API_SUBDOMAIN=api

# 数据库配置
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=Wl528586*
MONGO_URI=mongodb://admin:Wl528586*@mongodb:27017/admin

# Redis配置
REDIS_PASSWORD=Wl528586*
REDIS_URI=redis://:Wl528586*@redis:6381

# JWT配置
JWT_SECRET=Wl528586*

# Encryption key
ENCRYPTION_KEY=Wl528586*

# Nginx Ports
USER_NGINX_PORT=80

# Network Configuration
NETWORK_NAME=panda-quant-network

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_RETENTION_DAYS=30
EOF

# 设置权限
chmod 600 .env

# 创建必要的目录并设置权限
mkdir -p $PROJECT_ROOT/user-api/logs
chmod 755 $PROJECT_ROOT/user-api/logs

# 2. 构建用户端镜像
echo "2. 构建用户端镜像..."
echo "构建 user-api 镜像..."
docker build -t panda-quant-user-api -f $CURRENT_DIR/Dockerfile.user-api $PROJECT_ROOT
echo "构建 user-ui 镜像..."
docker build -t panda-quant-user-ui -f $CURRENT_DIR/Dockerfile.user-ui $PROJECT_ROOT

# 3. 启动用户端服务
echo "3. 启动用户端服务..."
docker-compose -f $CURRENT_DIR/docker-compose.user.yml up -d

# 4. 检查服务状态
echo "4. 检查服务状态..."
echo "检查 Docker 容器状态："
docker-compose -f $CURRENT_DIR/docker-compose.user.yml ps

# 5. 配置 Nginx
echo "5. 配置 Nginx..."
if [ -f /etc/nginx/nginx.conf ]; then
    echo "备份现有 Nginx 配置..."
    sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
    sudo mkdir -p /etc/nginx/conf.d.bak
    sudo cp /etc/nginx/conf.d/* /etc/nginx/conf.d.bak/ 2>/dev/null || true
fi

echo "复制 Nginx 配置文件..."
sudo cp $CURRENT_DIR/nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp $CURRENT_DIR/nginx/user.conf /etc/nginx/conf.d/

# 6. 测试并重启 Nginx
echo "6. 测试并重启 Nginx..."
sudo nginx -t
sudo systemctl restart nginx

# 7. 等待服务启动
echo "7. 等待服务启动..."
sleep 10

# 8. 检查服务健康状态
echo "8. 检查服务健康状态..."
echo "检查 User API 服务..."
curl -f http://localhost:8083/health || echo "User API 服务未就绪"
echo "检查 User UI 服务..."
curl -f http://localhost:8082/health || echo "User UI 服务未就绪"

echo "用户端服务部署完成！"
echo "请确保以下域名已正确配置 DNS 记录："
echo "- pandatrade.space"
echo "- api.pandatrade.space"
echo ""
echo "注意：SSL 证书将在后续单独配置，请运行 deploy-ssl.sh 脚本进行配置" 