# 部署指南

本目录包含 PandaQuant 交易系统的所有部署相关文件。

## 目录结构

```
deploy/
├── nginx/              # Nginx 配置文件
│   ├── nginx.conf      # Nginx 主配置文件
│   ├── admin.conf      # 管理后台 Nginx 配置
│   ├── user.conf       # 用户端 Nginx 配置
│   ├── strategy.conf   # 策略引擎 Nginx 配置
│   └── server.conf     # 服务器 Nginx 配置
├── admin-deploy.sh     # 管理端部署脚本
├── user-deploy.sh      # 用户端部署脚本
└── ssl-setup.sh        # SSL 证书配置脚本
```

## 部署脚本说明

### 1. 管理端部署脚本 (admin-deploy.sh)

用于部署管理后台相关服务，包括：
- 管理后台 API (admin-api)
- 管理后台前端 (admin-ui)
- 数据库配置 (MongoDB, Redis)
- Nginx 配置

使用方式：
```bash
bash deploy/admin-deploy.sh
```

### 2. 用户端部署脚本 (user-deploy.sh)

用于部署用户端和策略相关服务，包括：
- 用户 API (user-api)
- 用户前端 (user-ui)
- 策略引擎 (strategy-engine)
- 服务器 (server)
- Nginx 配置

使用方式：
```bash
bash deploy/user-deploy.sh
```

### 3. SSL 证书配置脚本 (ssl-setup.sh)

用于配置所有域名的 SSL 证书，包括：
- 安装 Certbot
- 配置 Nginx
- 获取 SSL 证书
- 设置证书自动续期

使用方式：
```bash
bash deploy/ssl-setup.sh
```

## Nginx 配置说明

### 1. 主配置文件 (nginx.conf)

包含 Nginx 全局配置：
- 工作进程数
- 连接超时设置
- 日志格式
- Gzip 压缩
- 安全头设置

### 2. 管理后台配置 (admin.conf)

配置管理后台相关域名：
- admin.pandatrade.space
- admin-api.pandatrade.space

### 3. 用户端配置 (user.conf)

配置用户端相关域名：
- pandatrade.space
- api.pandatrade.space

### 4. 策略引擎配置 (strategy.conf)

配置策略引擎相关域名：
- strategy.pandatrade.space

### 5. 服务器配置 (server.conf)

配置服务器相关域名：
- server.pandatrade.space

## 部署顺序

建议按照以下顺序执行部署：

1. 部署管理端
   ```bash
   bash deploy/admin-deploy.sh
   ```

2. 部署用户端
   ```bash
   bash deploy/user-deploy.sh
   ```

3. 配置 SSL 证书
   ```bash
   bash deploy/ssl-setup.sh
   ```

## 注意事项

1. 部署前确保：
   - 服务器已安装必要的软件包
   - 环境变量已正确配置
   - 域名 DNS 记录已正确设置
   - 服务器防火墙已配置

2. 部署过程中：
   - 观察日志输出
   - 检查服务状态
   - 验证端口是否正常开放

3. 部署后检查：
   - 所有服务是否正常运行
   - SSL 证书是否生效
   - 域名是否可以正常访问

## 故障排除

1. 服务无法启动：
   ```bash
   # 检查服务状态
   pm2 list
   sudo systemctl status nginx
   
   # 查看日志
   pm2 logs
   sudo tail -f /var/log/nginx/error.log
   ```

2. SSL 证书问题：
   ```bash
   # 检查证书状态
   sudo certbot certificates
   
   # 手动续期证书
   sudo certbot renew --dry-run
   ```

3. Nginx 配置问题：
   ```bash
   # 检查配置语法
   sudo nginx -t
   
   # 重新加载配置
   sudo systemctl reload nginx
   ```

## 更新部署

1. 更新特定服务：
   ```bash
   # 更新管理端
   bash deploy/admin-deploy.sh
   
   # 更新用户端
   bash deploy/user-deploy.sh
   ```

2. 更新 SSL 证书：
   ```bash
   bash deploy/ssl-setup.sh
   ```

## 技术支持

如有部署问题，请联系技术支持团队：
- 邮箱：support@pandaquant.com
- Telegram：@pandaquant
- Discord：PandaQuant 