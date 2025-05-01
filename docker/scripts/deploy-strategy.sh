#!/bin/bash

# 设置错误时退出
set -e

# 显示当前目录
echo "当前部署目录: $(pwd)"
echo "项目根目录: $(pwd)/.."

# 1. 配置环境变量
echo "1. 配置环境变量..."
cat > .env << 'EOF'
# 应用配置
NODE_ENV=production

# 端口配置
STRATEGY_ENGINE_PORT=3004
SERVER_PORT=3005

# 域名配置
DOMAIN=pandatrade.space
STRATEGY_SUBDOMAIN=strategy

# 数据库配置
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=Wl528586*
MONGO_URI=mongodb://admin:Wl528586*@mongodb:27017/admin

# Redis配置
REDIS_PASSWORD=Wl528586*
REDIS_URI=redis://:Wl528586*@redis:6379

# JWT配置
JWT_SECRET=Wl528586*

# Encryption key
ENCRYPTION_KEY=Wl528586*

# Nginx Ports
STRATEGY_NGINX_PORT=80

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
mkdir -p ../strategy-engine/logs
chmod 755 ../strategy-engine/logs

# 2. 构建策略引擎镜像
echo "2. 构建策略引擎镜像..."
echo "构建 strategy-engine 镜像..."
docker build -t panda-quant-strategy-engine -f Dockerfile.strategy-engine ..

# 3. 启动策略引擎服务
echo "3. 启动策略引擎服务..."
docker-compose -f docker-compose.strategy.yml up -d

# 4. 检查服务状态
echo "4. 检查服务状态..."
echo "检查 Docker 容器状态："
docker-compose -f docker-compose.strategy.yml ps

# 5. 配置 Nginx
echo "5. 配置 Nginx..."
if [ -f /etc/nginx/nginx.conf ]; then
    echo "备份现有 Nginx 配置..."
    sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
    sudo mkdir -p /etc/nginx/conf.d.bak
    sudo cp /etc/nginx/conf.d/* /etc/nginx/conf.d.bak/ 2>/dev/null || true
fi

echo "复制 Nginx 配置文件..."
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp nginx/strategy.conf /etc/nginx/conf.d/

# 6. 测试并重启 Nginx
echo "6. 测试并重启 Nginx..."
sudo nginx -t
sudo systemctl restart nginx

# 7. 等待服务启动
echo "7. 等待服务启动..."
sleep 10

# 8. 检查服务健康状态
echo "8. 检查服务健康状态..."
echo "检查 Strategy Engine 服务..."
curl -f http://localhost:3004/health || echo "Strategy Engine 服务未就绪"
echo "检查 Server 服务..."
curl -f http://localhost:3005/health || echo "Server 服务未就绪"

echo "策略引擎部署完成！"
echo "请确保以下域名已正确配置 DNS 记录："
echo "- strategy.pandatrade.space"
echo ""
echo "注意：SSL 证书将在后续单独配置，请运行 deploy-ssl.sh 脚本进行配置" 