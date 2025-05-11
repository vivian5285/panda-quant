#!/bin/bash

# 更新代码
echo "Updating code..."
git fetch --all
git reset --hard origin/main

# 修复文件名大小写
echo "Fixing file names..."
node scripts/fix-filenames.js

# 安装依赖
echo "Installing dependencies..."
npm install

# 构建项目
echo "Building project..."
npm run build

# 重启服务
echo "Restarting service..."
if pm2 list | grep -q "panda-quant-server"; then
    pm2 restart panda-quant-server
else
    pm2 start dist/index.js --name panda-quant-server
fi

echo "Deployment completed!" 