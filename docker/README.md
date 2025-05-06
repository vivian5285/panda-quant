# Panda Quant Docker 配置

本项目使用 Docker 和 Docker Compose 来管理多个服务。主要包括三个部分：用户端、管理端和策略引擎。

## 服务架构

### 1. 用户端 (docker-compose.user.yml)
- **API 服务**: 用户端 API 服务
  - 端口: 4000
  - 依赖: MongoDB, Redis
- **UI 服务**: 用户端界面
  - 端口: 3000
  - 依赖: API 服务
- **Nginx**: 反向代理和静态文件服务
  - 端口: 80/443
  - 域名: pandatrade.space
- **MongoDB**: 用户数据存储
  - 端口: 27019:27017
- **Redis**: 缓存服务
  - 端口: 6381:6379

### 2. 管理端 (docker-compose.admin.yml)
- **Admin API**: 管理端 API 服务
  - 端口: 4000
  - 依赖: MongoDB, Redis
- **Admin UI**: 管理端界面
  - 端口: 3000
  - 依赖: Admin API
- **Nginx**: 反向代理和静态文件服务
  - 端口: 80/443
  - 域名: admin.pandatrade.space
- **MongoDB**: 管理数据存储
  - 端口: 27017:27017
- **Redis**: 缓存服务
  - 端口: 6379:6379

### 3. 策略引擎 (docker-compose.strategy.yml)
- **Server**: 策略服务器
  - 端口: 4000
  - 依赖: MongoDB, Redis
- **Strategy Engine**: 策略引擎
  - 端口: 3000
  - 依赖: Server, MongoDB, Redis
- **Nginx**: 反向代理
  - 端口: 80/443
  - 域名: strategy.pandatrade.space
- **MongoDB**: 策略数据存储
  - 端口: 27018:27017
- **Redis**: 缓存服务
  - 端口: 6380:6379

## 网络配置

每个服务组使用独立的网络：
- user-network: 用户端服务网络
- admin-network: 管理端服务网络
- strategy-network: 策略引擎服务网络

## DNS 配置

所有服务都配置了多个 DNS 服务器以确保网络可靠性：
- 8.8.8.8 (Google DNS)
- 223.5.5.5 (阿里 DNS)

## 构建和运行

### 用户端
```bash
docker-compose -f docker-compose.user.yml up -d --build
```

### 管理端
```bash
docker-compose -f docker-compose.admin.yml up -d --build
```

### 策略引擎
```bash
docker-compose -f docker-compose.strategy.yml up -d --build
```

## 环境变量

所有服务都使用以下环境变量：
- NODE_ENV: 环境类型 (production)
- PORT: 服务端口
- MONGO_URI: MongoDB 连接字符串
- REDIS_URI: Redis 连接字符串

## 数据持久化

使用 Docker volumes 持久化数据：
- mongo_data: MongoDB 数据
- redis_data: Redis 数据

## 安全配置

- 所有服务都配置了 SSL/TLS
- 使用 Let's Encrypt 证书
- 配置了安全相关的 HTTP 头
- 使用非 root 用户运行服务

## 监控和健康检查

所有服务都配置了健康检查：
```bash
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:${PORT}/health || exit 1
```

## 日志管理

- 所有服务日志都通过 Docker 日志系统管理
- Nginx 访问日志和错误日志存储在 /var/log/nginx 目录

## 维护命令

### 查看服务状态
```bash
docker-compose -f docker-compose.*.yml ps
```

### 查看服务日志
```bash
docker-compose -f docker-compose.*.yml logs -f
```

### 重启服务
```bash
docker-compose -f docker-compose.*.yml restart
```

### 停止服务
```bash
docker-compose -f docker-compose.*.yml down
```

### 清理未使用的资源
```bash
docker system prune -f
```

## 技术支持

如有部署问题，请联系技术支持团队：
- 邮箱：support@pandaquant.com
- Telegram：@pandaquant
- Discord：PandaQuant 