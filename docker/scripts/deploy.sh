#!/bin/bash

# 设置错误时退出
set -e

# 显示当前目录
echo "当前部署目录: $(pwd)"
echo "项目根目录: $(pwd)/.."

# 1. 给所有部署脚本添加执行权限
echo "1. 设置部署脚本权限..."
chmod +x scripts/deploy-admin.sh
chmod +x scripts/deploy-user.sh
chmod +x scripts/deploy-ssl.sh

# 2. 部署管理端
echo "2. 部署管理端..."
./scripts/deploy-admin.sh

# 3. 部署用户端
echo "3. 部署用户端..."
./scripts/deploy-user.sh

# 4. 部署 SSL 证书
echo "4. 部署 SSL 证书..."
./scripts/deploy-ssl.sh

echo "所有服务部署完成！" 