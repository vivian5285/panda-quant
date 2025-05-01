#!/bin/bash

# 设置错误时退出
set -e

# 显示当前目录
echo "当前部署目录: $(pwd)"
echo "项目根目录: $(pwd)/.."

# 1. 配置环境变量
echo "1. 配置环境变量..."
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

# 设置权限
chmod 600 .env
chmod 600 ssl/private.key
chmod 644 ssl/certificate.crt

# 创建必要的目录并设置权限
mkdir -p ../user-api/logs
chmod 755 ../user-api/logs

# 2. 构建用户端镜像
echo "2. 构建用户端镜像..."
echo "构建 user-api 镜像..."
docker build -t panda-quant-user-api -f Dockerfile.user-api ..
echo "构建 user-ui 镜像..."
docker build -t panda-quant-user-ui -f Dockerfile.user-ui ..

# 3. 启动用户端服务
echo "3. 启动用户端服务..."
docker-compose -f ../docker/docker-compose.user.yml up -d --build

# 4. 检查服务状态
echo "4. 检查服务状态..."
echo "检查 Docker 容器状态："
docker-compose -f ../docker/docker-compose.user.yml ps

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
sudo cp nginx/user.conf /etc/nginx/conf.d/

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
curl -f http://localhost:8082/health || echo "User API 服务未就绪"

# 9. 配置 SSL 证书（可选）
read -p "是否需要配置 SSL 证书？(y/n): " need_ssl
if [ "$need_ssl" = "y" ]; then
    echo "9. 配置 SSL 证书..."
    echo "为 pandatrade.space 和 api.pandatrade.space 配置证书..."
    sudo certbot --nginx -d pandatrade.space -d api.pandatrade.space

    echo "设置证书自动续期..."
    sudo certbot renew --dry-run
fi

echo "用户端服务部署完成！"
echo "请确保以下域名已正确配置 DNS 记录："
echo "- pandatrade.space"
echo "- api.pandatrade.space" 