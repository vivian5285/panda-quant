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
STRATEGY_ENGINE_PORT=8084
STRATEGY_SERVER_PORT=8085

# 域名配置
DOMAIN=strategy.pandatrade.space
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
if [ -f ssl/private.key ]; then
  chmod 600 ssl/private.key
fi
if [ -f ssl/certificate.crt ]; then
  chmod 644 ssl/certificate.crt
fi

# 创建必要的目录并设置权限
mkdir -p $PROJECT_ROOT/strategy-engine/logs
chmod 755 $PROJECT_ROOT/strategy-engine/logs

# 2. 构建策略引擎镜像
echo "2. 构建策略引擎镜像..."
docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml build

# 3. 启动策略引擎服务
echo "3. 启动策略引擎服务..."
docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml up -d

# 4. 检查服务状态
echo "4. 检查服务状态..."
echo "检查 Docker 容器状态："
docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml ps

# 5. 配置 SSL 证书
echo "5. 配置 SSL 证书..."
if [ ! -f /etc/letsencrypt/live/strategy.pandatrade.space/fullchain.pem ]; then
    echo "配置策略引擎域名证书..."
    sudo certbot --nginx -d strategy.pandatrade.space -d api.strategy.pandatrade.space
else
    echo "SSL 证书已存在，跳过配置"
fi

# 6. 配置 Nginx
echo "6. 配置 Nginx..."
if [ -f $CURRENT_DIR/nginx/strategy.conf ]; then
  echo "Nginx 配置文件已存在，跳过配置"
else
  echo "配置 Nginx..."
  mkdir -p $CURRENT_DIR/nginx
  cat > $CURRENT_DIR/nginx/strategy.conf << EOF
# 策略引擎服务器
upstream strategy-engine {
    server 194.164.149.214:8084;
    keepalive 32;
}

# 策略服务器
upstream strategy-server {
    server 194.164.149.214:8085;
    keepalive 32;
}

# 主站域名配置
server {
    listen 80;
    server_name strategy.pandatrade.space;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name strategy.pandatrade.space;

    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/strategy.pandatrade.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/strategy.pandatrade.space/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/strategy.pandatrade.space/chain.pem;

    # SSL优化配置
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # 安全头
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://*.pandatrade.space;" always;

    # 前端应用
    location / {
        proxy_pass http://strategy-server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API代理
    location /api {
        proxy_pass http://strategy-engine;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 'healthy\n';
        add_header Content-Type text/plain;
    }
}

# API域名配置
server {
    listen 80;
    server_name api.strategy.pandatrade.space;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.strategy.pandatrade.space;

    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/api.strategy.pandatrade.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.strategy.pandatrade.space/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/api.strategy.pandatrade.space/chain.pem;

    # SSL优化配置
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # 安全头
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://*.pandatrade.space;" always;

    # API代理
    location / {
        proxy_pass http://strategy-engine;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 'healthy\n';
        add_header Content-Type text/plain;
    }
}
EOF
fi

# 7. 测试并重启 Nginx
echo "7. 测试并重启 Nginx..."
sudo nginx -t
sudo systemctl restart nginx

# 8. 等待服务启动并检查健康状态
echo "8. 等待服务启动并检查健康状态..."
MAX_RETRIES=30
RETRY_INTERVAL=5
retry_count=0

while [ $retry_count -lt $MAX_RETRIES ]; do
    echo "尝试检查服务健康状态 (尝试 $((retry_count + 1))/$MAX_RETRIES)..."
    
    # 检查 Strategy Engine 服务
    if curl -f https://api.strategy.pandatrade.space/health > /dev/null 2>&1; then
        echo "Strategy Engine 服务已就绪"
    else
        echo "Strategy Engine 服务未就绪，等待重试..."
        sleep $RETRY_INTERVAL
        retry_count=$((retry_count + 1))
        continue
    fi
    
    # 检查 Strategy Server 服务
    if curl -f https://strategy.pandatrade.space/health > /dev/null 2>&1; then
        echo "Strategy Server 服务已就绪"
        break
    else
        echo "Strategy Server 服务未就绪，等待重试..."
        sleep $RETRY_INTERVAL
        retry_count=$((retry_count + 1))
    fi
done

if [ $retry_count -eq $MAX_RETRIES ]; then
    echo "错误：服务在 $((MAX_RETRIES * RETRY_INTERVAL)) 秒后仍未就绪"
    exit 1
fi

echo "策略引擎服务部署完成！"
echo "请确保以下域名已正确配置 DNS 记录："
echo "- strategy.pandatrade.space"
echo "- api.strategy.pandatrade.space" 