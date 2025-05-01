#!/bin/bash

# 设置错误时退出
set -e

# 显示当前目录
echo "当前部署目录: $(pwd)"

# 检查 Certbot 是否已安装
if ! command -v certbot &> /dev/null; then
    echo "Certbot 未安装，正在安装..."
    sudo apt update
    sudo apt install certbot python3-certbot-nginx -y
fi

# 创建必要的目录
echo "创建必要的目录..."
mkdir -p ssl
mkdir -p ../nginx/logs
chmod 755 ../nginx/logs

# 1. 配置管理端域名证书
echo "1. 配置管理端域名证书..."
echo "为 admin.pandatrade.space 和 admin-api.pandatrade.space 配置证书..."
sudo certbot --nginx -d admin.pandatrade.space -d admin-api.pandatrade.space

# 2. 配置用户端域名证书
echo "2. 配置用户端域名证书..."
echo "为 pandatrade.space 和 api.pandatrade.space 配置证书..."
sudo certbot --nginx -d pandatrade.space -d api.pandatrade.space

# 3. 配置策略引擎域名证书
echo "3. 配置策略引擎域名证书..."
echo "为 strategy.pandatrade.space 配置证书..."
sudo certbot --nginx -d strategy.pandatrade.space

# 4. 配置服务器域名证书
echo "4. 配置服务器域名证书..."
echo "为 server.pandatrade.space 配置证书..."
sudo certbot --nginx -d server.pandatrade.space

# 5. 设置证书自动续期
echo "5. 设置证书自动续期..."
echo "测试证书续期..."
sudo certbot renew --dry-run

# 6. 检查证书状态
echo "6. 检查证书状态..."
echo "检查所有证书："
sudo certbot certificates

# 7. 配置 Nginx
echo "7. 配置 Nginx..."
echo "复制 Nginx 配置文件..."
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp nginx/admin.conf /etc/nginx/conf.d/
sudo cp nginx/user.conf /etc/nginx/conf.d/
sudo cp nginx/strategy.conf /etc/nginx/conf.d/
sudo cp nginx/server.conf /etc/nginx/conf.d/

# 8. 测试并重启 Nginx
echo "8. 测试并重启 Nginx..."
sudo nginx -t
sudo systemctl restart nginx

# 9. 设置证书文件权限
echo "9. 设置证书文件权限..."
sudo chmod 600 /etc/letsencrypt/live/*/privkey.pem
sudo chmod 644 /etc/letsencrypt/live/*/fullchain.pem

# 10. 创建符号链接到 ssl 目录
echo "10. 创建符号链接到 ssl 目录..."
sudo ln -sf /etc/letsencrypt/live/pandatrade.space/privkey.pem ssl/private.key
sudo ln -sf /etc/letsencrypt/live/pandatrade.space/fullchain.pem ssl/certificate.crt

echo "SSL 证书部署完成！"
echo "已配置的域名："
echo "- admin.pandatrade.space"
echo "- admin-api.pandatrade.space"
echo "- pandatrade.space"
echo "- api.pandatrade.space"
echo "- strategy.pandatrade.space"
echo "- server.pandatrade.space"
echo ""
echo "证书续期测试结果："
sudo certbot renew --dry-run 