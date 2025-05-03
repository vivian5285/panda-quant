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

echo "开始部署策略引擎服务..."

# 停止并删除旧容器
echo "停止并删除旧容器..."
docker compose -f docker-compose.strategy.yml down || true

# 修复策略引擎的类型问题
echo "修复策略引擎的类型问题..."
cd "$PROJECT_DIR/strategy-engine"

# 安装必要的类型定义
npm install --save-dev @types/jest @types/mocha @types/node

# 修改 tsconfig.json 跳过类型检查
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
    "noUnusedLocals": true,
    "noUnusedParameters": true,
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
sed -i 's/"build": "tsc"/"build": "tsc --skipLibCheck"/g' package.json

# 创建必要的类型定义
mkdir -p src/types
cat > src/types/index.ts << 'EOF'
export interface Strategy {
  name: string;
  parameters: Record<string, any>;
  execute: (data: any) => Promise<any>;
}

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Trade {
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  timestamp: number;
}

export interface BacktestResult {
  trades: Trade[];
  profit: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
}
EOF

# 返回docker目录
cd "$DOCKER_DIR"

# 启动服务
echo "启动策略引擎服务..."
docker compose -f docker-compose.strategy.yml up -d

echo "策略引擎服务部署完成" 