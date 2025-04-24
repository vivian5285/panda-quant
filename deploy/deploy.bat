@echo off
setlocal

REM 设置环境变量
set NODE_ENV=production

REM 创建日志目录
if not exist logs mkdir logs

REM 安装依赖
echo Installing dependencies...
cd ..\user-api
call npm install
cd ..\user-ui
call npm install
cd ..\deploy
call npm install

REM 构建项目
echo Building projects...
cd ..\user-api
call npm run build
cd ..\user-ui
call npm run build

REM 启动服务
echo Starting services...
cd ..\deploy
call pm2 start ecosystem.config.js

REM 保存 PM2 配置
call pm2 save

echo Deployment completed!
pause 