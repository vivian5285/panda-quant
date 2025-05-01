#!/bin/bash

# 设置错误时退出
set -e

echo "开始部署 PandaQuant 系统..."

# 1. 安装必要的软件
echo "安装必要的软件..."
sudo apt-get update
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    nginx \
    certbot \
    python3-certbot-nginx

# 2. 安装 Docker
echo "安装 Docker..."
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# 3. 安装 Docker Compose
echo "安装 Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. 配置环境变量
echo "配置环境变量..."
cat > .env << 'EOF'
# Database
DB_HOST=postgres
DB_USERNAME=postgres
DB_PASSWORD=Wl528586*
DB_NAME=panda_quant
DB_PORT=5432
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=2000

# JWT
JWT_SECRET=panda_quant_secret_key_2024
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# API
API_PORT=3000
NODE_ENV=production
API_RATE_LIMIT=100
API_RATE_LIMIT_WINDOW=900000

# SSL
SSL_CERT_PATH=/etc/nginx/ssl/pandatrade.space.crt
SSL_KEY_PATH=/etc/nginx/ssl/pandatrade.space.key

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000
GRAFANA_ADMIN_PASSWORD=Wl528586*
ALERTMANAGER_PORT=9093

# Backup
BACKUP_DIR=/backup
BACKUP_RETENTION_DAYS=7
BACKUP_SCHEDULE="0 0 * * *"

# Security
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SYMBOLS=true
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCKOUT_MINUTES=30

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_RETENTION_DAYS=30

# Cache
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=Wl528586*
CACHE_TTL=3600

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=Wl528586*
SMTP_FROM=noreply@pandatrade.space

# CDN
CDN_ENABLED=true
CDN_DOMAIN=cdn.pandatrade.space
CDN_KEY=your_cdn_key
CDN_SECRET=your_cdn_secret
EOF

# 5. 构建所有镜像
echo "构建所有镜像..."
docker build -t panda-quant-admin-api -f Dockerfile.admin-api ..
docker build -t panda-quant-admin-ui -f Dockerfile.admin-ui ..
docker build -t panda-quant-user-api -f Dockerfile.user-api ..
docker build -t panda-quant-user-ui -f Dockerfile.user-ui ..
docker build -t panda-quant-strategy-engine -f Dockerfile.strategy-engine ..
docker build -t panda-quant-server -f Dockerfile.server ..

# 6. 启动所有服务
echo "启动所有服务..."
docker-compose -f docker-compose.admin.yml up -d
docker-compose -f docker-compose.user.yml up -d
docker-compose -f docker-compose.strategy.yml up -d

# 7. 配置 Nginx
echo "配置 Nginx..."
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp nginx/admin.conf /etc/nginx/conf.d/
sudo cp nginx/user.conf /etc/nginx/conf.d/
sudo cp nginx/strategy.conf /etc/nginx/conf.d/
sudo cp nginx/server.conf /etc/nginx/conf.d/

# 8. 配置 SSL 证书
echo "配置 SSL 证书..."
sudo certbot --nginx -d admin.pandatrade.space -d admin-api.pandatrade.space
sudo certbot --nginx -d pandatrade.space -d api.pandatrade.space
sudo certbot --nginx -d strategy.pandatrade.space
sudo certbot --nginx -d server.pandatrade.space

# 9. 设置证书自动续期
echo "设置证书自动续期..."
sudo certbot renew --dry-run

# 10. 配置防火墙
echo "配置防火墙..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# 11. 检查服务状态
echo "检查服务状态..."
docker-compose -f docker-compose.admin.yml ps
docker-compose -f docker-compose.user.yml ps
docker-compose -f docker-compose.strategy.yml ps

echo "PandaQuant 系统部署完成！"
echo "请确保以下域名已正确配置 DNS 记录："
echo "- admin.pandatrade.space"
echo "- admin-api.pandatrade.space"
echo "- pandatrade.space"
echo "- api.pandatrade.space"
echo "- strategy.pandatrade.space"
echo "- server.pandatrade.space" 