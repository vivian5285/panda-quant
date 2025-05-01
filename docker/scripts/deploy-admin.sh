#!/bin/bash

# 设置错误时退出
set -e

# 设置当前部署目录和项目根目录
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
ADMIN_API_PORT=3001
ADMIN_UI_PORT=8084

# 域名配置
DOMAIN=pandatrade.space
ADMIN_SUBDOMAIN=admin
ADMIN_API_SUBDOMAIN=admin-api

# 数据库配置
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=Wl528586*
MONGO_URI=mongodb://admin:Wl528586*@mongodb:27017/admin

# Redis配置
REDIS_PASSWORD=Wl528586*
REDIS_URI=redis://:Wl528586*@redis:6380

# JWT配置
JWT_SECRET=Wl528586*

# Encryption key
ENCRYPTION_KEY=Wl528586*

# Nginx Ports
ADMIN_NGINX_PORT=80

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
mkdir -p $PROJECT_ROOT/admin-api/logs
chmod 755 $PROJECT_ROOT/admin-api/logs

# 2. 构建管理端镜像
echo "2. 构建管理端镜像..."
docker-compose -f $CURRENT_DIR/docker-compose.admin.yml build

# 3. 启动管理端服务
echo "3. 启动管理端服务..."
docker-compose -f $CURRENT_DIR/docker-compose.admin.yml up -d

# 4. 检查服务状态
echo "4. 检查服务状态..."
echo "检查 Docker 容器状态："
docker-compose -f $CURRENT_DIR/docker-compose.admin.yml ps

# 5. 配置 Nginx
echo "5. 配置 Nginx..."
if [ -f $CURRENT_DIR/nginx/admin.conf ]; then
  echo "Nginx 配置文件已存在，跳过配置"
else
  echo "配置 Nginx..."
  mkdir -p $CURRENT_DIR/nginx
  cat > $CURRENT_DIR/nginx/admin.conf << EOF
server {
    listen 80;
    server_name admin.pandatrade.space;

    location / {
        proxy_pass http://admin-ui:8084;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api {
        proxy_pass http://admin-api:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # 健康检查
    location /health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 "healthy\n";
    }
}
EOF
fi

# 6. 测试并重启 Nginx
echo "6. 测试并重启 Nginx..."
sudo nginx -t
sudo systemctl restart nginx

# 7. 等待服务启动并检查健康状态
echo "7. 等待服务启动并检查健康状态..."
MAX_RETRIES=30
RETRY_INTERVAL=5
retry_count=0

while [ $retry_count -lt $MAX_RETRIES ]; do
    echo "尝试检查服务健康状态 (尝试 $((retry_count + 1))/$MAX_RETRIES)..."
    
    # 检查 Admin API 服务
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "Admin API 服务已就绪"
    else
        echo "Admin API 服务未就绪，等待重试..."
        sleep $RETRY_INTERVAL
        retry_count=$((retry_count + 1))
        continue
    fi
    
    # 检查 Admin UI 服务
    if curl -f http://localhost:8084/health > /dev/null 2>&1; then
        echo "Admin UI 服务已就绪"
        break
    else
        echo "Admin UI 服务未就绪，等待重试..."
        sleep $RETRY_INTERVAL
        retry_count=$((retry_count + 1))
    fi
done

if [ $retry_count -eq $MAX_RETRIES ]; then
    echo "错误：服务在 $((MAX_RETRIES * RETRY_INTERVAL)) 秒后仍未就绪"
    exit 1
fi

# 8. 配置 SSL 证书（可选）
read -p "是否需要配置 SSL 证书？(y/n): " need_ssl
if [ "$need_ssl" = "y" ]; then
    echo "8. 配置 SSL 证书..."
    echo "为 admin.pandatrade.space 和 admin-api.pandatrade.space 配置证书..."
    sudo certbot --nginx -d admin.pandatrade.space -d admin-api.pandatrade.space

    echo "设置证书自动续期..."
    sudo certbot renew --dry-run
fi

echo "管理端服务部署完成！"
echo "请确保以下域名已正确配置 DNS 记录："
echo "- admin.pandatrade.space"
echo "- admin-api.pandatrade.space" 