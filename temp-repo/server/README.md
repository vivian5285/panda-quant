# Server - 后端服务

## 📋 简介

后端服务是 PandaQuant 平台的核心服务，提供 API 接口、数据处理、交易执行和系统管理等功能。采用微服务架构，支持高并发和分布式部署。

## 🎯 核心功能

### 1. API 服务
- RESTful API
- WebSocket 实时数据
- 文件上传下载
- API 文档生成

### 2. 数据处理
- 市场数据采集
- 数据清洗和转换
- 数据存储和缓存
- 数据分析计算

### 3. 交易执行
- 策略执行引擎
- 订单管理
- 仓位管理
- 风险控制

### 4. 系统管理
- 用户认证授权
- 系统监控
- 日志管理
- 配置管理

## 📁 目录结构

```
server/
├── src/
│   ├── controllers/       # 控制器
│   │   ├── user.ts       # 用户控制器
│   │   ├── strategy.ts   # 策略控制器
│   │   ├── trade.ts      # 交易控制器
│   │   └── system.ts     # 系统控制器
│   ├── models/           # 数据模型
│   │   ├── user.ts       # 用户模型
│   │   ├── strategy.ts   # 策略模型
│   │   ├── trade.ts      # 交易模型
│   │   └── system.ts     # 系统模型
│   ├── routes/           # 路由
│   │   ├── user.ts       # 用户路由
│   │   ├── strategy.ts   # 策略路由
│   │   ├── trade.ts      # 交易路由
│   │   └── system.ts     # 系统路由
│   ├── services/         # 服务
│   │   ├── user.ts       # 用户服务
│   │   ├── strategy.ts   # 策略服务
│   │   ├── trade.ts      # 交易服务
│   │   └── system.ts     # 系统服务
│   ├── utils/            # 工具函数
│   │   ├── logger.ts     # 日志工具
│   │   ├── validator.ts  # 验证工具
│   │   └── helper.ts     # 辅助函数
│   ├── config/           # 配置
│   │   ├── default.ts    # 默认配置
│   │   ├── development.ts # 开发配置
│   │   └── production.ts # 生产配置
│   ├── middleware/       # 中间件
│   │   ├── auth.ts       # 认证中间件
│   │   ├── error.ts      # 错误处理
│   │   └── logger.ts     # 日志中间件
│   └── app.ts            # 应用入口
├── tests/                # 测试
├── docs/                 # 文档
└── scripts/              # 脚本
```

## 🔧 开发指南

### 1. 环境设置
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 2. 控制器开发
```typescript
import { Request, Response } from 'express';
import { UserService } from '../services/user';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

### 3. 服务开发
```typescript
import { UserModel } from '../models/user';

export class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async getUsers() {
    return await this.userModel.findAll();
  }
}
```

### 4. 模型开发
```typescript
import { Model } from 'sequelize';

export class UserModel extends Model {
  static async findAll() {
    // 数据库查询
  }
}
```

## 📊 数据库设计

### 1. 用户表
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

### 2. 策略表
```sql
CREATE TABLE strategies (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  parameters JSON NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

### 3. 交易表
```sql
CREATE TABLE trades (
  id VARCHAR(36) PRIMARY KEY,
  strategy_id VARCHAR(36) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  type VARCHAR(10) NOT NULL,
  price DECIMAL(20,8) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

## 🧪 测试

### 单元测试
```bash
npm test
```

### API 测试
```bash
npm run test:api
```

### 性能测试
```bash
npm run test:performance
```

## 📈 性能优化

- 数据库索引优化
- 查询缓存
- 连接池管理
- 异步处理
- 负载均衡

## 🔒 安全措施

- JWT 认证
- 密码加密
- 请求限流
- SQL 注入防护
- XSS/CSRF 防护

## 📝 文档

- [API 文档](docs/api.md)
- [数据库设计](docs/database.md)
- [部署指南](docs/deployment.md)
- [监控指南](docs/monitoring.md)

## 🤝 贡献

欢迎提交 Pull Request 或创建 Issue。

## 📄 许可证

MIT 