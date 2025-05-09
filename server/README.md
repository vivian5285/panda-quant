# Panda Quant Server

Panda Quant 的后端服务，提供完整的量化交易策略管理、用户管理和交易执行功能。

## 功能特性

- 🔐 完整的用户认证和授权系统
- 📊 策略管理和性能分析
- 💰 交易执行和资金管理
- 📈 实时市场数据接入
- 🔄 自动化结算系统
- 📱 RESTful API 接口
- 🔒 安全防护和限流
- 📝 完整的日志系统
- 🔍 请求追踪和监控
- 💾 数据缓存优化

## 技术栈

- Node.js
- Express.js
- TypeScript
- MongoDB
- Redis
- JWT
- Web3.js
- Jest
- Winston
- Joi

## 目录结构

```
server/
├── src/
│   ├── config/           # 配置文件
│   ├── controllers/      # 控制器
│   ├── middleware/       # 中间件
│   ├── models/          # 数据模型
│   ├── routes/          # 路由定义
│   ├── services/        # 业务逻辑
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   └── app.ts           # 应用入口
├── tests/               # 测试文件
├── dist/                # 编译输出
├── logs/                # 日志文件
└── package.json         # 项目配置
```

## 环境要求

- Node.js >= 16.0.0
- MongoDB >= 4.4
- Redis >= 6.0
- npm >= 7.0.0

## 安装

1. 克隆项目
```bash
git clone https://github.com/your-username/panda-quant.git
cd panda-quant/server
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```
编辑 `.env` 文件，设置必要的环境变量。

4. 启动服务
```bash
# 开发环境
npm run dev

# 生产环境
npm run build
npm start
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| NODE_ENV | 运行环境 | development |
| PORT | 服务端口 | 3000 |
| MONGODB_URI | MongoDB 连接地址 | mongodb://localhost:27017/panda-quant |
| REDIS_HOST | Redis 主机地址 | localhost |
| REDIS_PORT | Redis 端口 | 6379 |
| REDIS_PASSWORD | Redis 密码 | |
| JWT_SECRET | JWT 密钥 | |
| LOG_LEVEL | 日志级别 | info |
| RATE_LIMIT_WINDOW | 限流时间窗口(ms) | 900000 |
| RATE_LIMIT_MAX | 限流最大请求数 | 100 |

## API 文档

API 文档使用 Swagger 生成，启动服务后访问：
```
http://localhost:3000/api-docs
```

## 主要功能模块

### 1. 用户管理
- 用户注册和登录
- 角色和权限管理
- 用户信息管理
- 资金账户管理

### 2. 策略管理
- 策略创建和编辑
- 策略参数配置
- 策略回测
- 策略性能分析
- 策略订阅管理

### 3. 交易系统
- 实时行情数据
- 交易信号生成
- 订单管理
- 持仓管理
- 交易记录

### 4. 结算系统
- 收益计算
- 手续费计算
- 分成计算
- 结算记录
- 提现管理

### 5. 系统管理
- 系统配置
- 日志管理
- 监控告警
- 数据备份

## 中间件说明

### 认证中间件 (auth.ts)
- `ensureAuthenticated`: 验证用户是否已认证
- `authorize`: 基于角色的授权
- `isAdmin`: 管理员权限检查
- `hasPermission`: 基于权限的访问控制
- `authenticateToken`: JWT token 验证

### 错误处理中间件 (error.ts)
- `AppError`: 基础错误类
- `ValidationError`: 验证错误
- `AuthenticationError`: 认证错误
- `AuthorizationError`: 授权错误
- `ContractError`: 智能合约错误
- `NotFoundError`: 资源未找到错误
- `TimeoutError`: 请求超时错误
- `ServerError`: 服务器错误

### 缓存中间件 (cache.ts)
- `disableCache`: 禁用缓存
- `cacheMiddleware`: Redis 缓存中间件
- `clearCache`: 清除缓存

## 开发指南

### 代码规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 使用 JSDoc 注释

### 测试
```bash
# 运行单元测试
npm test

# 运行集成测试
npm run test:integration

# 运行测试覆盖率报告
npm run test:coverage
```

### 部署
1. 构建项目
```bash
npm run build
```

2. 启动服务
```bash
npm start
```

3. 使用 PM2 管理进程
```bash
pm2 start dist/app.js --name panda-quant
```

## 监控和日志

### 日志系统
- 使用 Winston 进行日志管理
- 日志级别：error, warn, info, debug
- 日志文件按日期分割
- 支持日志轮转

### 性能监控
- 请求响应时间
- 内存使用情况
- CPU 使用率
- 数据库连接状态
- Redis 连接状态

## 安全措施

1. 认证和授权
   - JWT 认证
   - 角色基础访问控制
   - 权限验证

2. 数据安全
   - 数据加密
   - 敏感信息脱敏
   - 数据验证

3. 接口安全
   - 请求限流
   - CORS 配置
   - XSS 防护
   - SQL 注入防护

4. 系统安全
   - 环境变量配置
   - 错误处理
   - 日志记录
   - 定期备份

## 常见问题

1. 数据库连接失败
   - 检查 MongoDB 服务是否运行
   - 验证连接字符串是否正确
   - 确认数据库用户权限

2. Redis 连接失败
   - 检查 Redis 服务是否运行
   - 验证连接配置是否正确
   - 确认 Redis 密码是否正确

3. JWT 认证失败
   - 检查 token 是否过期
   - 验证 token 签名是否正确
   - 确认 JWT_SECRET 环境变量已设置

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License 