#!/bin/bash

# 设置执行权限
chmod +x "$0"

# 设置环境变量
export NODE_ENV=production
export PORT=3001
export MONGODB_URI=mongodb://mongo:27017/user
export REDIS_URI=redis://redis:6379

# 设置 Docker Hub 用户名
DOCKER_USERNAME="vivian5285"

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$DOCKER_DIR")"

# 切换到docker目录
cd "$DOCKER_DIR"

# 加载环境变量
if [ -f .env ]; then
    set -a
    source .env
    set +a
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

# 检查并停止占用端口的进程
echo "检查并停止占用端口的进程..."
for port in 3001 80 27017 6379; do
    pid=$(lsof -t -i:$port)
    if [ ! -z "$pid" ]; then
        echo "端口 $port 被进程 $pid 占用，正在停止..."
        kill -9 $pid
    fi
done

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

# 安装必要的依赖
echo "安装必要的依赖..."
npm install --legacy-peer-deps --no-audit && \
npm install --save-dev \
    @types/react \
    @types/react-dom \
    @types/react-router-dom \
    @types/framer-motion \
    @types/react-i18next \
    @types/chart.js \
    @types/react-chartjs-2 \
    @types/recharts \
    @types/react-swipeable \
    @types/qrcode.react \
    @types/web-vitals \
    @types/ethers \
    @types/i18next \
    @types/i18next-browser-languagedetector \
    @types/i18next-http-backend \
    @types/@mui/x-date-pickers \
    @types/@mui/x-data-grid \
    @types/@web3modal/wagmi/react \
    @types/@ethersproject/providers && \
npm install --save \
    framer-motion \
    react-i18next \
    i18next \
    i18next-browser-languagedetector \
    i18next-http-backend \
    chart.js \
    react-chartjs-2 \
    recharts \
    react-swipeable \
    qrcode.react \
    web-vitals \
    ethers \
    @ethersproject/providers \
    @mui/x-date-pickers \
    @mui/x-data-grid \
    @web3modal/wagmi/react && \
npm rebuild

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

# 返回docker目录
cd "$DOCKER_DIR"

# 构建用户 API 镜像
echo "构建用户 API 镜像..."
docker build --no-cache -t ${DOCKER_USERNAME}/panda-quant-user-api -f Dockerfile.user-api .

# 构建用户 UI 镜像
echo "构建用户 UI 镜像..."
cd "$PROJECT_DIR/user-ui"

# 确保目录权限正确
chmod -R 755 .

# 构建 UI 镜像
echo "开始构建 UI 镜像..."
docker build --no-cache -t ${DOCKER_USERNAME}/panda-quant-user-ui -f "$DOCKER_DIR/Dockerfile.user-ui" .

# 推送镜像到 Docker Hub
echo "推送镜像到 Docker Hub..."
docker push ${DOCKER_USERNAME}/panda-quant-user-api
docker push ${DOCKER_USERNAME}/panda-quant-user-ui

# 返回docker目录
cd "$DOCKER_DIR"

# 修改 docker-compose 文件中的镜像名称
sed -i "s|image: panda-quant-user-api|image: ${DOCKER_USERNAME}/panda-quant-user-api|g" docker-compose.user.yml
sed -i "s|image: panda-quant-user-ui|image: ${DOCKER_USERNAME}/panda-quant-user-ui|g" docker-compose.user.yml

# 启动服务
echo "启动服务..."
docker compose -f docker-compose.user.yml up -d

# 检查服务状态
echo "检查服务状态..."
docker compose -f docker-compose.user.yml ps

echo "用户服务部署完成" 