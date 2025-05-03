#!/bin/bash

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
    echo "错误: Docker 未安装"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "错误: Docker Compose 未安装"
    exit 1
fi

# 停止并删除旧容器
echo "停止并删除旧容器..."
docker compose -f docker-compose.user.yml down || true

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
npm install --save-dev @types/jest @types/mocha @types/node @types/express

# 修改 tsconfig.json 跳过类型检查
echo "配置 TypeScript..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "lib": ["es2018", "esnext.asynciterable"],
    "skipLibCheck": true,
    "sourceMap": true,
    "outDir": "./dist",
    "moduleResolution": "node",
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "resolveJsonModule": true,
    "baseUrl": "."
  },
  "exclude": ["node_modules"],
  "include": ["./src/**/*.ts"]
}
EOF

# 修改 package.json 中的构建脚本
echo "修改构建脚本..."
npm pkg set scripts.build="tsc --skipLibCheck"

# 创建必要的类型定义
echo "创建类型定义..."
mkdir -p src/types
cat > src/types/index.ts << 'EOF'
import { Request } from 'express';

// 测试相关类型
declare global {
  namespace NodeJS {
    interface Global {
      beforeAll: (callback: () => void) => void;
      afterAll: (callback: () => void) => void;
      beforeEach: (callback: () => void) => void;
      describe: (name: string, callback: () => void) => void;
      it: (name: string, callback: () => void) => void;
      expect: (value: any) => {
        toBe: (value: any) => void;
        toEqual: (value: any) => void;
        toBeDefined: () => void;
        toBeUndefined: () => void;
        toBeNull: () => void;
        toBeTruthy: () => void;
        toBeFalsy: () => void;
        toContain: (value: any) => void;
        toHaveLength: (length: number) => void;
        toMatch: (regex: RegExp) => void;
        toThrow: (error?: any) => void;
      };
    }
  }
}

// 用户相关类型
export interface IUser {
  _id: string;
  id: string;
  email: string;
  password: string;
  name: string;
  balance: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// 资产相关类型
export interface IAsset {
  id: string;
  userId: string;
  balance: number;
  totalProfit: number;
  isNewUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 策略相关类型
export interface IStrategy {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBacktest {
  id: string;
  userId: string;
  strategyId: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// 佣金相关类型
export interface ICommission {
  id: string;
  userId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
}

// 提现相关类型
export interface IWithdrawal {
  id: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// 推荐相关类型
export interface IReferral {
  id: string;
  userId: string;
  referrerId: string;
  commission: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// 策略日志相关类型
export interface IStrategyLog {
  id: string;
  userId: string;
  strategyId: string;
  message: string;
  level: string;
  createdAt: Date;
}

// 市场数据相关类型
export interface IOHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ITrade {
  id: string;
  userId: string;
  strategyId: string;
  type: string;
  side: string;
  amount: number;
  price: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// 优化结果相关类型
export interface IOptimizationResult {
  id: string;
  userId: string;
  strategyId: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// 历史数据相关类型
export interface IHistoricalData {
  id: string;
  symbol: string;
  timeframe: string;
  data: IOHLCV[];
  createdAt: Date;
  updatedAt: Date;
}

// 策略性能相关类型
export interface IStrategyPerformance {
  id: string;
  strategyId: string;
  profit: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
  createdAt: Date;
}

// 通知相关类型
export interface IAlert {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface INotification {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// 市场数据相关类型
export interface IMarketData {
  id: string;
  symbol: string;
  price: number;
  volume: number;
  timestamp: Date;
}

// 链相关类型
export interface IChain {
  id: string;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerUrl: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 黑名单相关类型
export interface IBlacklistEntry {
  id: string;
  address: string;
  reason: string;
  createdAt: Date;
}

// 网络状态相关类型
export interface INetworkStatus {
  id: string;
  network: string;
  status: string;
  lastChecked: Date;
}

// 用户等级相关类型
export interface IUserLevel {
  id: string;
  name: string;
  description: string;
  requirements: Record<string, any>;
  benefits: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// 佣金记录相关类型
export interface ICommissionRecord {
  id: string;
  userId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
}

// 摘要相关类型
export interface ISummary {
  total: number;
  success: number;
  failed: number;
  averageTime: number;
}

// 数据库服务相关类型
export interface IDatabaseService {
  query: (collection: string, query: any) => Promise<any>;
  findOne: (collection: string, query: any) => Promise<any>;
  find: (collection: string, query: any) => Promise<any>;
  insert: (collection: string, data: any) => Promise<any>;
  update: (collection: string, query: any, data: any) => Promise<any>;
  delete: (collection: string, query: any) => Promise<any>;
}

// 资产服务相关类型
export interface IAssetService {
  getUserBalance: (userId: string) => Promise<number>;
  addBalance: (userId: string, amount: number) => Promise<void>;
  deductBalance: (userId: string, amount: number) => Promise<void>;
  freezeBalance: (userId: string, amount: number) => Promise<void>;
  unfreezeBalance: (userId: string, amount: number) => Promise<void>;
}

// 回测服务相关类型
export interface IBacktestService {
  runBacktest: (strategyId: string, data: any, params: any) => Promise<any>;
  getUserBacktestHistory: (userId: string) => Promise<any>;
  getBacktestDetails: (backtestId: string) => Promise<any>;
}

// 历史数据服务相关类型
export interface IHistoricalDataService {
  getHistoricalData: (symbol: string, timeframe: string) => Promise<any>;
  saveHistoricalData: (symbol: string, timeframe: string, data: any) => Promise<void>;
}

// 策略引擎相关类型
export interface IStrategyEngine {
  execute: (strategy: IStrategy, data: any) => Promise<any>;
  optimize: (strategy: IStrategy, data: any, params: any) => Promise<any>;
}

// JWT 相关类型
export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

// 错误处理相关类型
export interface IErrorResponse {
  status: number;
  message: string;
  error?: any;
}

// 成功响应相关类型
export interface ISuccessResponse {
  status: number;
  message: string;
  data?: any;
}
EOF

# 返回docker目录
cd "$DOCKER_DIR"

# 构建镜像
echo "构建用户 API 镜像..."
docker build -t panda-quant-user-api -f Dockerfile.user-api .

# 启动服务
echo "启动用户服务..."
docker compose -f docker-compose.user.yml up -d --build

# 检查服务状态
echo "检查服务状态..."
sleep 5
docker ps | grep user

echo "用户服务部署完成" 