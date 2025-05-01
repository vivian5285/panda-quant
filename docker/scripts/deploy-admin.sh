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
if [ ! -f .env ]; then
  cat > .env << EOF
# MongoDB Configuration
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=Wl528586*

# Redis Configuration
REDIS_PASSWORD=Wl528586*

# JWT Configuration
JWT_SECRET=Wl528586*
ENCRYPTION_KEY=Wl528586*

# CDN Configuration
CDN_SECRET=your_cdn_secret
EOF
fi

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
    }

    location /api {
        proxy_pass http://admin-api:8081;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF
fi

# 6. 测试并重启 Nginx
echo "6. 测试并重启 Nginx..."
sudo nginx -t
sudo systemctl restart nginx

# 7. 等待服务启动
echo "7. 等待服务启动..."
sleep 10

# 8. 检查服务健康状态
echo "8. 检查服务健康状态..."
echo "检查 Admin API 服务..."
curl -f http://localhost:8081/health || echo "Admin API 服务未就绪"

# 9. 配置 SSL 证书（可选）
read -p "是否需要配置 SSL 证书？(y/n): " need_ssl
if [ "$need_ssl" = "y" ]; then
    echo "9. 配置 SSL 证书..."
    echo "为 admin.pandatrade.space 和 admin-api.pandatrade.space 配置证书..."
    sudo certbot --nginx -d admin.pandatrade.space -d admin-api.pandatrade.space

    echo "设置证书自动续期..."
    sudo certbot renew --dry-run
fi

echo "管理端服务部署完成！"
echo "请确保以下域名已正确配置 DNS 记录："
echo "- admin.pandatrade.space"
echo "- admin-api.pandatrade.space" 