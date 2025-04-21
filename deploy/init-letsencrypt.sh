#!/bin/bash

# 设置域名
domains=(pandatrade.space www.pandatrade.space)
email="pandaspace0001@gmail.com"
data_path="./nginx/ssl"

# 创建必要的目录
mkdir -p "$data_path/conf/live/$domains"

# 获取Let's Encrypt证书
docker run -it --rm \
  -v "$data_path/conf:/etc/letsencrypt" \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  --non-interactive \
  --agree-tos \
  --email "$email" \
  --domains "${domains[0]},${domains[1]}"

# 创建符号链接
ln -sf "../../live/${domains[0]}/fullchain.pem" "$data_path/conf/live/${domains[0]}/fullchain.pem"
ln -sf "../../live/${domains[0]}/privkey.pem" "$data_path/conf/live/${domains[0]}/privkey.pem"

echo "SSL证书初始化完成！" 