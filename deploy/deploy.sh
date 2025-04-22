#!/bin/bash

# 设置错误时退出
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 打印带颜色的消息
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then
    print_error "请使用root权限运行此脚本"
    exit 1
fi

# 申请SSL证书
print_message "申请SSL证书..."
certbot certonly --standalone --force-renewal -d admin.pandatrade.space -d admin-api.pandatrade.space -d pandatrade.space -d api.pandatrade.space --non-interactive --agree-tos --email admin@pandatrade.space

# 设置证书自动续期
print_message "设置证书自动续期..."
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet") | crontab -

# 检查证书文件
print_message "检查证书文件..."
if [ ! -f "/etc/letsencrypt/live/admin.pandatrade.space/fullchain.pem" ] || [ ! -f "/etc/letsencrypt/live/admin.pandatrade.space/privkey.pem" ]; then
    print_error "证书文件不存在"
    exit 1
fi

# 复制Nginx主配置文件
print_message "复制Nginx主配置文件..."
cp nginx/nginx.conf /etc/nginx/

# 复制Nginx配置文件
print_message "复制Nginx配置文件..."
cp nginx/admin.nginx.conf /etc/nginx/sites-available/
cp nginx/user.nginx.conf /etc/nginx/sites-available/

# 创建符号链接
print_message "创建Nginx配置符号链接..."
ln -sf /etc/nginx/sites-available/admin.nginx.conf /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/user.nginx.conf /etc/nginx/sites-enabled/

# 测试Nginx配置
print_message "测试Nginx配置..."
nginx -t

# 重启Nginx
print_message "重启Nginx服务..."
systemctl restart nginx

# 部署Docker服务
print_message "部署Docker服务..."
docker compose -f docker-compose.admin.yml up -d
docker compose -f docker-compose.user.yml up -d

# 检查服务状态
print_message "检查服务状态..."
docker ps

print_message "部署完成！"
print_message "请确保以下域名已正确解析到服务器IP："
print_message "- admin.pandatrade.space"
print_message "- admin-api.pandatrade.space"
print_message "- pandatrade.space"
print_message "- api.pandatrade.space"

ls -l /etc/letsencrypt/live/admin-api.pandatrade.space/ 