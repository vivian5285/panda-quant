# PandaQuant 部署指南

本目录包含 PandaQuant 交易系统的所有部署相关文件。

## 目录结构

```
docker/
├── Dockerfile.admin-api      # 管理后台 API 镜像构建文件
├── Dockerfile.admin-ui       # 管理后台前端镜像构建文件
├── Dockerfile.server         # 服务器镜像构建文件
├── Dockerfile.strategy-engine # 策略引擎镜像构建文件
├── Dockerfile.user-api       # 用户 API 镜像构建文件
├── Dockerfile.user-ui        # 用户前端镜像构建文件
├── docker-compose.admin.yml  # 管理端服务编排配置
├── docker-compose.strategy.yml # 策略引擎服务编排配置
├── docker-compose.user.yml   # 用户端服务编排配置
├── .env                      # 环境变量配置文件
├── .env.example              # 环境变量配置示例文件
├── nginx/                    # Nginx 配置文件目录
│   ├── nginx.conf            # Nginx 主配置文件
│   ├── admin.conf            # 管理后台 Nginx 配置
│   ├── user.conf             # 用户端 Nginx 配置
│   ├── strategy.conf         # 策略引擎 Nginx 配置
│   └── server.conf           # 服务器 Nginx 配置
├── scripts/                  # 部署和维护脚本目录
│   ├── monitor.sh            # 系统监控脚本
│   ├── backup.sh             # 数据备份脚本
│   ├── restore.sh            # 数据恢复脚本
│   ├── admin-deploy.sh       # 管理端部署脚本
│   ├── user-deploy.sh        # 用户端部署脚本
│   └── ssl-setup.sh          # SSL 证书配置脚本
└── README.md                 # 部署文档
```

## 部署说明

### 1. 环境准备

确保服务器已安装以下软件：
- Docker 和 Docker Compose
- Nginx
- Node.js 和 PM2
- Certbot（用于 SSL 证书）

### 2. 部署步骤

```bash
# 1. 克隆项目到服务器
git clone <项目仓库地址> panda-quant
cd panda-quant/docker

# 2. 复制环境变量文件
cp .env.example .env

# 3. 编辑环境变量文件
nano .env
# 根据您的配置修改必要的环境变量

# 4. 部署管理端
bash scripts/admin-deploy.sh

# 5. 部署用户端
bash scripts/user-deploy.sh

# 6. 配置 SSL 证书
bash scripts/ssl-setup.sh
```

### 3. 服务说明

- 管理端服务：
  - 管理后台 API (admin-api)
  - 管理后台前端 (admin-ui)
  - MongoDB 和 Redis
- 用户端服务：
  - 用户 API (user-api)
  - 用户前端 (user-ui)
  - 策略引擎 (strategy-engine)
  - 服务器 (server)

### 4. 域名配置

需要配置以下域名：
- 管理后台：admin.pandatrade.space
- 管理 API：admin-api.pandatrade.space
- 用户端：pandatrade.space
- 用户 API：api.pandatrade.space
- 策略引擎：strategy.pandatrade.space
- 服务器：server.pandatrade.space

### 5. 维护工具

- `scripts/monitor.sh`：系统监控脚本
- `scripts/backup.sh`：数据备份脚本
- `scripts/restore.sh`：数据恢复脚本

### 6. 注意事项

- 部署前确保所有域名已正确配置 DNS 记录
- 确保服务器防火墙已开放必要端口
- 建议使用 PM2 管理 Node.js 进程
- 定期检查日志和系统状态

### 7. 故障排除

- 使用 `pm2 list` 检查服务状态
- 使用 `pm2 logs` 查看服务日志
- 使用 `sudo nginx -t` 检查 Nginx 配置
- 使用 `sudo certbot certificates` 检查 SSL 证书状态

## 技术支持

如有部署问题，请联系技术支持团队：
- 邮箱：support@pandaquant.com
- Telegram：@pandaquant
- Discord：PandaQuant 