#!/bin/bash

domains=(api.admin.panda-quant.com api.user.panda-quant.com admin.panda-quant.com user.panda-quant.com)
email="your-email@example.com" # 替换为你的邮箱
data_path="./nginx/letsencrypt"
rsa_key_size=4096

# 创建必要的目录
mkdir -p "$data_path/conf/live"

# 创建临时 Nginx 配置用于验证
cat > ./nginx/conf.d/default.conf << EOF
server {
    listen 80;
    server_name _;
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}
EOF

# 启动 Nginx
docker-compose up -d nginx

# 为每个域名获取证书
for domain in "${domains[@]}"; do
  echo "Getting certificate for $domain..."
  
  # 创建证书目录
  mkdir -p "$data_path/conf/live/$domain"
  
  # 获取证书
  docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email $email \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $domain
done

# 停止 Nginx
docker-compose down

echo "SSL certificates have been obtained successfully!" 