#!/bin/bash

# 设置错误处理
set -e

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 错误处理函数
error() {
    log "错误: $1"
    exit 1
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        error "$1 未安装，请先安装 $1"
    fi
}

# 检查必要的命令
check_command npm
check_command node
check_command nginx
check_command certbot

# 安装必要的软件
log "更新系统包..."
sudo apt update || error "系统更新失败"

log "安装必要的软件..."
sudo apt install -y nginx certbot python3-certbot-nginx || error "软件安装失败"

# 安装 TypeScript
log "安装 TypeScript..."
sudo npm install -g typescript || error "TypeScript 安装失败"

# 构建项目
log "安装项目依赖..."
npm install || error "依赖安装失败"

log "构建项目..."
npm run build || error "项目构建失败"

# 配置 Nginx
log "配置 Nginx..."
sudo cp nginx.conf /etc/nginx/nginx.conf || error "Nginx 配置复制失败"
sudo nginx -t || error "Nginx 配置测试失败"

# 获取 SSL 证书
log "获取 SSL 证书..."
sudo certbot --nginx -d pandatrade.space -d www.pandatrade.space --non-interactive --agree-tos --email wangjiali240@gmail.com || error "SSL 证书获取失败"

# 复制构建文件到 Nginx 目录
log "部署构建文件..."
sudo mkdir -p /usr/share/nginx/html || error "创建目录失败"
sudo cp -r dist/* /usr/share/nginx/html/ || error "文件复制失败"

# 设置权限
log "设置文件权限..."
sudo chown -R www-data:www-data /usr/share/nginx/html || error "设置所有者失败"
sudo chmod -R 755 /usr/share/nginx/html || error "设置权限失败"

# 重启 Nginx
log "重启 Nginx..."
sudo systemctl restart nginx || error "Nginx 重启失败"

# 设置自动续期
log "设置 SSL 证书自动续期..."
(crontab -l 2>/dev/null; echo "0 0 * * * /usr/bin/certbot renew --quiet") | sudo crontab - || error "设置自动续期失败"

# 检查服务状态
log "检查服务状态..."
sudo systemctl status nginx || error "Nginx 服务状态异常"

log "部署完成！"
log "网站地址: https://pandatrade.space" 