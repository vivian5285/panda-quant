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

echo "开始部署管理后台服务..."

# 停止并删除旧容器
echo "停止并删除旧容器..."
docker compose -f docker-compose.admin.yml down || true

# 清理 Docker 缓存
echo "清理 Docker 缓存..."
docker system prune -f

# 修复管理API的类型问题
echo "修复管理API的类型问题..."
cd "$PROJECT_DIR/admin-api"

# 安装必要的类型定义
npm install --save-dev @types/jest @types/mocha @types/express @types/node

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

# 返回docker目录
cd "$DOCKER_DIR"

# 构建管理后台 API 镜像
echo "构建管理后台 API 镜像..."
docker build --no-cache -t panda-quant-admin-api -f Dockerfile.admin-api .

# 启动管理后台服务
echo "启动管理后台服务..."
docker compose -f docker-compose.admin.yml up -d --build

echo "管理后台服务部署完成" 