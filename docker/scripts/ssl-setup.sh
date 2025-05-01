#!/bin/bash

# 设置错误时退出
set -e

echo "开始配置 SSL 证书..."

# 安装 certbot
echo "安装 certbot..."
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# 配置 Nginx
echo "配置 Nginx..."
sudo cp ../nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp ../nginx/admin.conf /etc/nginx/conf.d/
sudo cp ../nginx/user.conf /etc/nginx/conf.d/
sudo cp ../nginx/strategy.conf /etc/nginx/conf.d/
sudo cp ../nginx/server.conf /etc/nginx/conf.d/

# 获取 SSL 证书
echo "获取 SSL 证书..."
sudo certbot --nginx -d admin.pandatrade.space -d admin-api.pandatrade.space
sudo certbot --nginx -d pandatrade.space -d api.pandatrade.space
sudo certbot --nginx -d strategy.pandatrade.space
sudo certbot --nginx -d server.pandatrade.space

# 设置证书自动续期
echo "设置证书自动续期..."
sudo certbot renew --dry-run

echo "SSL 证书配置完成！" 