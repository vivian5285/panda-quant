#!/bin/bash

# 安装必要的软件
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# 构建项目
npm install
npm run build

# 配置 Nginx
sudo cp nginx.conf /etc/nginx/sites-available/pandatrade.space
sudo ln -s /etc/nginx/sites-available/pandatrade.space /etc/nginx/sites-enabled/

# 获取 SSL 证书
sudo certbot --nginx -d pandatrade.space -d www.pandatrade.space

# 复制构建文件到 Nginx 目录
sudo cp -r dist/* /usr/share/nginx/html/

# 设置权限
sudo chown -R www-data:www-data /usr/share/nginx/html
sudo chmod -R 755 /usr/share/nginx/html

# 重启 Nginx
sudo systemctl restart nginx

# 设置自动续期
sudo crontab -l | { cat; echo "0 0 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo "部署完成！" 