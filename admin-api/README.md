# Admin API

管理后台 API 服务

## 环境要求

- Node.js 18+
- npm 8+
- MongoDB 4.4+

## 安装

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 生产环境运行
npm start
```

## 环境变量

创建 `.env` 文件并配置以下环境变量：

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/admin
JWT_SECRET=your_jwt_secret
```

## Docker 部署

```bash
# 构建镜像
docker build -t admin-api .

# 运行容器
docker run -d -p 3000:3000 --name admin-api admin-api
```

## API 文档

### 认证

- POST /api/auth/login - 管理员登录
- POST /api/auth/logout - 管理员登出

### 用户管理

- GET /api/users - 获取用户列表
- GET /api/users/:id - 获取用户详情
- PUT /api/users/:id - 更新用户信息
- DELETE /api/users/:id - 删除用户

### 策略管理

- GET /api/strategies - 获取策略列表
- GET /api/strategies/:id - 获取策略详情
- POST /api/strategies - 创建新策略
- PUT /api/strategies/:id - 更新策略
- DELETE /api/strategies/:id - 删除策略

### 订单管理

- GET /api/orders - 获取订单列表
- GET /api/orders/:id - 获取订单详情
- PUT /api/orders/:id - 更新订单状态

### 系统设置

- GET /api/settings - 获取系统设置
- PUT /api/settings - 更新系统设置 