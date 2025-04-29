# PandaQuant - 熊猫量化交易平台

## 🚀 项目简介

PandaQuant 是一个专业的量化交易平台，提供智能交易策略和自动化交易服务。我们通过先进的算法和专业的团队，帮助用户实现稳定的投资收益。

## 🎯 核心特点

- 🧠 智能策略：剥头皮 / 超级趋势 / 网格套利
- 🏦 托管灵活：支持 API 托管 / USDT 充值托管
- 💰 收益保障：支持低中高风险策略，动态调节
- 🔒 安全保障：多重风控机制，API 只读授权
- 🌐 多语言支持：支持 30+ 种语言
- 📱 响应式设计：完美适配移动端和桌面端

## 🛠️ 技术栈

- **前端**：
  - React 18
  - TypeScript
  - Material-UI
  - Framer Motion
  - Chart.js
  - i18next

- **后端**：
  - Node.js
  - Express
  - MongoDB
  - Redis
  - WebSocket

## 📁 项目结构

```
panda-quant/
├── admin-api/          # 管理后台 API
├── admin-ui/           # 管理后台前端
├── user-api/           # 用户 API
├── user-ui/            # 用户前端
├── strategy-engine/    # 策略引擎
├── server/             # 服务器
├── deploy/             # 部署相关文件
│   ├── nginx/          # Nginx 配置文件
│   ├── admin-deploy.sh # 管理端部署脚本
│   ├── user-deploy.sh  # 用户端部署脚本
│   └── ssl-setup.sh    # SSL 证书配置脚本
└── .env                # 环境变量配置文件
```

## 🎨 设计风格

- **主色调**：黑 + 熊猫绿（#00FFB8）+ 纯白补光
- **字体**：英文：Poppins，中文：阿里巴巴普惠体
- **卡片**：玻璃拟态 + 阴影 hover 效果
- **动画**：Framer Motion 动画熊猫元素，渐入渐出
- **特效**：背景星光点点流动 / 波动图展示 / 放大按钮

## 🚀 快速开始

1. 克隆项目
```bash
git clone https://github.com/your-username/panda-quant.git
cd panda-quant
```

2. 安装依赖
```bash
# 安装用户界面依赖
cd user-ui
npm install

# 安装管理界面依赖
cd ../admin-ui
npm install

# 安装后端依赖
cd ../server
npm install
```

3. 配置环境变量
```bash
# 复制示例环境变量文件
cp .env.example .env

# 编辑 .env 文件，填入必要的配置
```

4. 启动开发服务器
```bash
# 启动用户界面
cd user-ui
npm run dev

# 启动管理界面
cd admin-ui
npm run dev

# 启动后端服务
cd server
npm run dev
```

## 📝 开发指南

### 组件开发规范

1. **命名规范**
   - 组件文件使用 PascalCase
   - 工具函数使用 camelCase
   - 常量使用 UPPER_SNAKE_CASE

2. **代码风格**
   - 使用 TypeScript
   - 遵循 ESLint 规则
   - 使用 Prettier 格式化代码

3. **组件结构**
   ```typescript
   import React from 'react';
   import { Box, Typography } from '@mui/material';
   import { motion } from 'framer-motion';
   import { useTranslation } from 'react-i18next';

   interface ComponentProps {
     // 属性定义
   }

   const Component: React.FC<ComponentProps> = ({ /* 属性 */ }) => {
     // 状态和逻辑
     return (
       // JSX
     );
   };

   export default Component;
   ```

### 国际化开发

1. 在 `src/i18n/locales` 目录下添加新的语言文件
2. 使用 `useTranslation` hook 获取翻译
3. 遵循翻译键命名规范：`组件名.功能名`

### 样式开发

1. 使用 Material-UI 的主题系统
2. 遵循设计规范中的颜色和字体
3. 使用 Framer Motion 添加动画效果

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 邮箱：support@pandaquant.com
- Telegram：@pandaquant
- Discord：PandaQuant

## 系统要求

- Ubuntu 20.04 LTS 或更高版本
- Node.js 18.x
- MongoDB 4.4 或更高版本
- Redis 6.0 或更高版本
- Nginx 1.18 或更高版本
- PM2 进程管理器

## 环境变量配置

在项目根目录创建 `.env` 文件，包含以下必要配置：

```env
# MongoDB 配置
MONGO_INITDB_ROOT_USERNAME=your_mongo_username
MONGO_INITDB_ROOT_PASSWORD=your_mongo_password

# Redis 配置
REDIS_PASSWORD=your_redis_password

# JWT 配置
JWT_SECRET=your_jwt_secret

# 加密密钥
ENCRYPTION_KEY=your_encryption_key
```

## 部署流程

### 1. 部署管理端

管理端包含管理后台 API 和前端界面。

```bash
# 进入项目目录
cd panda-quant

# 执行管理端部署脚本
bash deploy/admin-deploy.sh
```

部署完成后，管理端将运行在以下端口：
- 管理后台 API: 3001
- 管理后台前端: 80/443 (通过 Nginx 代理)

### 2. 部署用户和策略端

用户和策略端包含用户 API、前端、策略引擎和服务器。

```bash
# 进入项目目录
cd panda-quant

# 执行用户端部署脚本
bash deploy/user-deploy.sh
```

部署完成后，用户和策略端将运行在以下端口：
- 用户 API: 3002
- 用户前端: 80/443 (通过 Nginx 代理)
- 策略引擎: 3003
- 服务器: 3004

### 3. 配置 SSL 证书

为所有域名配置 SSL 证书：

```bash
# 进入项目目录
cd panda-quant

# 执行 SSL 证书配置脚本
bash deploy/ssl-setup.sh
```

该脚本将为以下域名配置 SSL 证书：
- pandatrade.space
- admin.pandatrade.space
- admin-api.pandatrade.space
- api.pandatrade.space
- strategy.pandatrade.space
- server.pandatrade.space

## 服务管理

### 使用 PM2 管理服务

```bash
# 查看所有服务状态
pm2 list

# 查看服务日志
pm2 logs [service-name]

# 重启服务
pm2 restart [service-name]

# 停止服务
pm2 stop [service-name]

# 删除服务
pm2 delete [service-name]
```

### 使用 systemctl 管理系统服务

```bash
# 管理 Nginx
sudo systemctl status nginx
sudo systemctl restart nginx
sudo systemctl stop nginx

# 管理 MongoDB
sudo systemctl status mongodb
sudo systemctl restart mongodb
sudo systemctl stop mongodb

# 管理 Redis
sudo systemctl status redis-server
sudo systemctl restart redis-server
sudo systemctl stop redis-server
```

## 防火墙配置

系统已配置以下端口：
- 80/tcp (HTTP)
- 443/tcp (HTTPS)
- 3001/tcp (管理 API)
- 3002-3005/tcp (用户和策略服务)

## 故障排除

1. 检查服务状态：
   ```bash
   pm2 list
   sudo systemctl status nginx
   sudo systemctl status mongodb
   sudo systemctl status redis-server
   ```

2. 查看日志：
   ```bash
   pm2 logs
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/mongodb/mongod.log
   sudo tail -f /var/log/redis/redis-server.log
   ```

3. 检查端口占用：
   ```bash
   sudo netstat -tulpn | grep LISTEN
   ```

## 更新部署

1. 拉取最新代码：
   ```bash
   git pull
   ```

2. 重新部署特定服务：
   ```bash
   # 更新管理端
   bash deploy/admin-deploy.sh

   # 更新用户端
   bash deploy/user-deploy.sh
   ```

3. 更新 SSL 证书：
   ```bash
   bash deploy/ssl-setup.sh
   ```

## 注意事项

1. 部署前确保所有必要的环境变量已正确配置
2. 确保服务器有足够的磁盘空间和内存
3. 建议在部署前备份数据库
4. SSL 证书配置需要域名 DNS 记录已正确设置
5. 防火墙配置可能会影响服务访问，请确保相关端口已开放

## 技术支持

如有问题，请联系技术支持团队。 