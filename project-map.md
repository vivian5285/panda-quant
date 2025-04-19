# Project Map

## ⚠️ 开发规则（必读）

在开始任何开发工作之前，请务必遵循以下规则：

### 1. 开发前检查（必须执行）
- 先查看 `project-map.md` 是否已有页面、接口、组件
- 不要重复生成已有的组件、模型、接口
- 如果不确定是否已有，请先返回确认，不要直接创建

### 2. 目录规范（必须遵守）
- 前端组件：
  - 用户端：`/user-ui/src/components/`
  - 管理端：`/admin-ui/src/components/`
- 前端页面：
  - 用户端：`/user-ui/src/pages/`
  - 管理端：`/admin-ui/src/pages/`
- 后端接口：
  - 用户端：`/user-api/routes/`
  - 管理端：`/admin-api/routes/`
- 后端控制器：
  - 用户端：`/user-api/controllers/`
  - 管理端：`/admin-api/controllers/`
- 后端模型：
  - 用户端：`/user-api/models/`
  - 管理端：`/admin-api/models/`
- 量化策略：
  - 根目录：`/strategy-engine/`

### 3. 代码规范（必须遵守）
- 所有新建代码都应写在指定目录和命名规则下
- 保持代码结构清晰，遵循现有模式
- 及时更新文档和注释

### 4. 违规处理
- 违反上述规则可能导致代码被拒绝合并
- 重复创建已有组件将导致代码被拒绝
- 未按目录规范放置的代码将被要求重构

## Overview
This is a quantitative trading platform with separate user and admin interfaces, backed by a strategy engine.

## Local Development Guidelines

### Development Environment Setup
1. Run user and admin backend services locally
2. Follow the directory structure and naming conventions strictly

### Development Rules
1. **Pre-development Checklist**
   - Always check `project-map.md` first
   - Verify if the page, API, or component already exists
   - Do not duplicate existing components, models, or interfaces
   - When in doubt, verify before creating new code

2. **Directory Structure Rules**
   - Frontend Components:
     - User UI: `/user-ui/src/components/`
     - Admin UI: `/admin-ui/src/components/`
   - Frontend Pages:
     - User UI: `/user-ui/src/pages/`
     - Admin UI: `/admin-ui/src/pages/`
   - Backend APIs:
     - User API: `/user-api/routes/`
     - Admin API: `/admin-api/routes/`
   - Backend Controllers:
     - User API: `/user-api/controllers/`
     - Admin API: `/admin-api/controllers/`
   - Backend Models:
     - User API: `/user-api/models/`
     - Admin API: `/admin-api/models/`
   - Trading Strategies:
     - Root directory: `/strategy-engine/`

3. **Code Organization**
   - All new code must follow the specified directory structure
   - Use consistent naming conventions
   - Maintain clear separation between user and admin components
   - Keep strategy-related code in the strategy-engine directory

4. **Best Practices**
   - Document all new components and APIs
   - Update project-map.md when adding new features
   - Follow the existing code style and patterns
   - Maintain clear separation of concerns

## Directory Structure

### Root Directory
- `.env` - Environment configuration file
- `docker-compose.yml` - Docker compose configuration for the entire project
- `DEVELOPMENT.md` - Development guidelines and setup instructions
- `README.md` - Project overview and documentation
- `project-map.md` - This file, documenting the project structure
- `app.ts` - Main application entry point

### Core Components

#### user-api/
- `package.json` - Node.js dependencies and scripts
- `Dockerfile` - Docker configuration for user API
- `index.ts` - API entry point
- `src/` - Source code directory
- `scripts/` - Utility scripts
- `test/` - Test files
- `migrations/` - Database migration files
- `services/` - Business logic services
- `routes/` - API route definitions
- `controllers/` - Request handlers
- `managers/` - Business logic managers
- `factories/` - Object factories
- `strategies/` - Trading strategies
- `models/` - Data models
- `types/` - TypeScript type definitions
- `middleware/` - Request middleware
- `prisma/` - Database ORM configuration

#### admin-api/
- `package.json` - Node.js dependencies and scripts
- `Dockerfile` - Docker configuration for admin API
- `index.ts` - API entry point
- `models/` - Data models
- `scripts/` - Utility scripts
- `routes/` - API route definitions
- `middleware/` - Request middleware
- `controllers/` - Request handlers
- `services/` - Business logic services

#### strategy-engine/
- `config.ts` - Configuration settings
- `types.ts` - TypeScript type definitions
- `strategyManager.ts` - Strategy management logic
- `strategyFactory.ts` - Strategy creation factory
- `StrategyEngine.ts` - Core strategy engine implementation
- `backtestEngine.ts` - Backtesting engine implementation
- `utils/` - Utility functions
- `monitoring/` - Monitoring and logging
- `services/` - Business logic services
- `strategies/` - Trading strategies
- `sql/` - SQL queries and database operations
- `engine/` - Core engine components
- `config/` - Configuration files
- `tasks/` - Background tasks
- `backtest/` - Backtesting components
- `types/` - TypeScript type definitions
- `mt4/` - MetaTrader 4 integration
- `exchange/` - Exchange integrations
- `runner/` - Strategy execution runners

#### user-ui/
- `package.json` - Frontend dependencies and scripts
- `Dockerfile` - Docker configuration for user interface
- `src/` - Source code directory
- `public/` - Static assets
- `nginx.conf` - Nginx configuration

#### admin-ui/
- `package.json` - Frontend dependencies and scripts
- `src/` - Source code directory

#### deploy/
- `docker-compose.backend.yml` - Backend services configuration
- `docker-compose.frontend.yml` - Frontend services configuration
- `docker-compose.yml` - Main Docker compose configuration
- `restore.sh` - Database restore script
- `backup.sh` - Database backup script
- `.env.example` - Example environment configuration
- `alert.rules` - Alerting rules
- `prometheus.yml` - Prometheus configuration
- `nginx.conf` - Nginx configuration
- `Dockerfile.api` - API Docker configuration
- `Dockerfile` - Base Docker configuration

#### docs/
- Documentation files

#### test/
- Test files and configurations

## 已完成功能模块 ✅

### 1. 用户系统
- [x] 邮箱注册/登录
- [x] JWT 鉴权
- [x] 邀请码绑定
- [x] 个人中心
- [x] 多语言支持（中英日韩）

### 2. 资产系统
- [x] 充值功能（多链支持）
- [x] 提现功能
- [x] 托管费自动结算
- [x] 资产统计展示
- [x] 收益趋势图表

### 3. 推广系统
- [x] 推荐码注册
- [x] 多级奖励（1代20%，2代10%）
- [x] 推荐人列表
- [x] 奖励统计

### 4. 策略系统
- [x] 策略收益展示
- [x] 风险等级分类
- [x] 参与情况统计
- [x] 收益趋势分析

### 5. 通知系统
- [x] 托管欠费提醒
- [x] 审核结果通知
- [x] 消息中心

### 6. 管理员系统
- [x] 用户管理
- [x] 链地址管理
- [x] 支付确认
- [x] 数据统计

## 下一步计划 🚀

### 1. 性能优化
- [ ] 前端代码分割
- [ ] 图片懒加载
- [ ] 缓存策略优化
- [ ] 数据库索引优化

### 2. 安全加固
- [ ] 接口限流
- [ ] 敏感数据加密
- [ ] 操作日志审计
- [ ] 防SQL注入

### 3. 用户体验
- [ ] 加载动画优化
- [ ] 错误提示优化
- [ ] 表单验证增强
- [ ] 操作引导优化

### 4. 新功能规划
- [ ] 资产分析报告
- [ ] 策略回测功能
- [ ] 自动化交易接口
- [ ] 多币种支持

## 技术栈

### 前端 (user-ui)
- React 18
- TypeScript
- Material-UI
- React Router
- i18next
- Axios
- Recharts

### 后端 (user-api)
- Node.js
- Express
- TypeScript
- MongoDB
- JWT
- Web3.js

### 数据库
- MongoDB
- Redis (缓存)

## 开发规范

### 代码规范
- 使用 ESLint + Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 组件使用函数式组件和 Hooks
- 使用 Material-UI 组件库
- 响应式设计优先

### Git 规范
- 主分支：main
- 开发分支：dev
- 功能分支：feature/*
- 修复分支：hotfix/*
- 提交信息使用英文，格式：`type(scope): description`

### 文档规范
- 使用 Markdown 格式
- 保持文档及时更新
- 重要功能必须编写文档
- 接口文档使用 Swagger

## 部署说明

### 环境要求
- Node.js >= 16
- MongoDB >= 4.4
- Redis >= 6.0

### 部署步骤
1. 克隆代码库
2. 安装依赖
3. 配置环境变量
4. 启动服务

### 环境变量
```env
# 前端
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development

# 后端
PORT=3000
MONGODB_URI=mongodb://localhost:27017/panda-quant
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```

## 测试说明

### 单元测试
- 使用 Jest + React Testing Library
- 测试覆盖率要求 > 80%
- 关键功能必须测试

### 集成测试
- 使用 Cypress
- 自动化测试流程
- 定期运行测试

## 监控告警

### 系统监控
- 服务器资源监控
- 应用性能监控
- 错误日志监控
- 用户行为分析

### 告警规则
- 服务器负载 > 80%
- 错误率 > 1%
- 响应时间 > 2s
- 内存使用 > 90% 