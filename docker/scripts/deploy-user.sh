#!/bin/bash

# 设置执行权限
chmod +x "$0"

# 设置环境变量
export NODE_ENV=production
export PORT=3001
export MONGODB_URI=mongodb://mongo:27017/user
export REDIS_URI=redis://redis:6379

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$DOCKER_DIR")"

# 切换到docker目录
cd "$DOCKER_DIR"

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "开始部署用户服务..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 停止并删除旧容器
echo "停止并删除旧容器..."
docker compose -f docker-compose.user.yml down || true

# 清理 Docker 缓存
echo "清理 Docker 缓存..."
docker system prune -f

# 清理 npm 缓存和 node_modules
echo "清理 npm 缓存和 node_modules..."
cd "$PROJECT_DIR/user-ui"
rm -rf node_modules package-lock.json
npm cache clean --force

# 修复用户 API 的类型问题
echo "修复用户 API 的类型问题..."
cd "$PROJECT_DIR/user-api"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "错误: npm 未安装"
    exit 1
fi

# 安装必要的类型定义
echo "安装必要的类型定义..."
npm install --save-dev @types/node @types/express @types/mongoose @types/jsonwebtoken

# 修改 package.json 中的构建脚本
echo "修改构建脚本..."
npm pkg set scripts.build="tsc --skipLibCheck"

# 创建必要的类型定义
echo "创建类型定义..."
mkdir -p src/types
cat > src/types/index.ts << 'EOF'
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// 测试相关类型
declare global {
  namespace NodeJS {
    interface Global {
      __MONGO_URI__: string;
      __MONGO_DB_NAME__: string;
    }
  }
}

// 用户角色类型
export type UserRole = 'user' | 'admin';

// 用户相关类型
export interface IUser {
  _id: string;
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  balance: number;
  role: UserRole;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  _id: string;
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

// 资产相关类型
export interface IAsset {
  _id: string;
  id: string;
  userId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// 策略相关类型
export interface IStrategy {
  _id: string;
  id: string;
  userId: string;
  name: string;
  description: string;
  type: string;
  status: string;
  config: any;
  createdAt: Date;
  updatedAt: Date;
}

// 回测相关类型
export interface IBacktest {
  _id: string;
  id: string;
  userId: string;
  strategyId: string;
  startTime: Date;
  endTime: Date;
  initialCapital: number;
  finalCapital: number;
  profit: number;
  profitPercentage: number;
  trades: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// 订单相关类型
export interface IOrder {
  _id: string;
  id: string;
  userId: string;
  strategyId: string;
  type: string;
  side: string;
  symbol: string;
  price: number;
  amount: number;
  status: string;
  executedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 佣金相关类型
export interface ICommission {
  _id: string;
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// 提现相关类型
export interface IWithdrawal {
  _id: string;
  id: string;
  userId: string;
  amount: number;
  currency: string;
  address: string;
  status: string;
  txHash: string;
  createdAt: Date;
  updatedAt: Date;
}

// 通知相关类型
export interface INotification {
  _id: string;
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 市场数据相关类型
export interface IMarketData {
  _id: string;
  id: string;
  symbol: string;
  price: number;
  volume: number;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 请求相关类型
export interface AuthRequest extends Request {
  user?: AuthUser;
}

// 响应相关类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 服务相关类型
export interface IDatabaseService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query(collection: string, query: any): Promise<any>;
  findOne(collection: string, query: any): Promise<any>;
  find(collection: string, query: any): Promise<any>;
  insert(collection: string, data: any): Promise<any>;
  update(collection: string, query: any, data: any): Promise<any>;
  delete(collection: string, query: any): Promise<any>;
}

export interface IAssetService {
  getBalance(userId: string): Promise<number>;
  updateBalance(userId: string, amount: number): Promise<void>;
  getHistory(userId: string): Promise<IAsset[]>;
  addBalance(userId: string, amount: number): Promise<void>;
  deductBalance(userId: string, amount: number): Promise<void>;
  freezeBalance(userId: string, amount: number): Promise<void>;
  unfreezeBalance(userId: string, amount: number): Promise<void>;
}

export interface IBacktestService {
  run(strategyId: string, config: any): Promise<IBacktest>;
  getHistory(userId: string): Promise<IBacktest[]>;
  getDetails(backtestId: string): Promise<IBacktest>;
  runBacktest(strategyId: string, data: any, params: any): Promise<any>;
  getUserBacktestHistory(userId: string): Promise<any>;
  getBacktestDetails(backtestId: string): Promise<any>;
}

export interface IHistoricalDataService {
  getData(symbol: string, startTime: Date, endTime: Date): Promise<IMarketData[]>;
  getLatest(symbol: string): Promise<IMarketData>;
  getHistoricalData(symbol: string, timeframe: string): Promise<any>;
  saveHistoricalData(symbol: string, timeframe: string, data: any): Promise<void>;
}

// JWT 相关类型
export interface IJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

// 错误响应类型
export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
}

// 成功响应类型
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}
EOF

# 返回 Docker 目录
cd "$DOCKER_DIR"

# 构建用户 API 镜像
echo "构建用户 API 镜像..."
docker build --no-cache -t panda-quant-user-api -f Dockerfile.user-api .

# 启动用户服务
echo "启动用户服务..."
docker compose -f docker-compose.user.yml up -d --build

# 检查服务状态
echo "检查服务状态..."
docker ps | grep user

echo "用户服务部署完成" 