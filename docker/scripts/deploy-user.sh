#!/bin/bash

# 设置错误时退出
set -e

# 设置日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 设置错误处理函数
handle_error() {
    log "错误: $1"
    log "正在回滚..."
    cd "$DOCKER_DIR"
    docker compose -f docker-compose.user.yml down || true
    exit 1
}

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
cd "$DOCKER_DIR" || handle_error "无法切换到 Docker 目录"

# 加载环境变量
if [ -f .env ]; then
    set -a
    source .env || handle_error "无法加载环境变量"
    set +a
fi

log "开始部署用户服务..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    handle_error "Docker 未安装"
fi

# 检查 Docker Compose 是否安装
if ! command -v docker compose &> /dev/null; then
    handle_error "Docker Compose 未安装"
fi

# 检查并停止占用端口的进程
log "检查并停止占用端口的进程..."
for port in 3001 80 27017 6379; do
    # 检查 lsof 是否安装
    if ! command -v lsof &> /dev/null; then
        log "警告: lsof 命令未安装，尝试使用 netstat 检查端口..."
        if ! command -v netstat &> /dev/null; then
            log "警告: netstat 命令也未安装，跳过端口检查"
            break
        fi
        # 使用 netstat 检查端口
        if netstat -tuln | grep -q ":$port "; then
            log "端口 $port 被占用，但无法获取进程ID，请手动检查"
            continue
        fi
    else
        # 使用 lsof 检查端口
        if lsof -i:$port > /dev/null 2>&1; then
            pid=$(lsof -t -i:$port)
            if [ ! -z "$pid" ]; then
                log "端口 $port 被进程 $pid 占用，正在停止..."
                # 尝试优雅地停止进程
                kill $pid 2>/dev/null || true
                sleep 2
                # 如果进程仍然存在，则强制终止
                if ps -p $pid > /dev/null 2>&1; then
                    kill -9 $pid 2>/dev/null || true
                fi
            fi
        fi
    fi
done

# 停止并删除旧容器
log "停止并删除旧容器..."
docker compose -f docker-compose.user.yml down || true

# 清理 Docker 缓存
log "清理 Docker 缓存..."
docker system prune -f || handle_error "清理 Docker 缓存失败"

# 检查并安装用户 UI 依赖
log "检查用户 UI 依赖..."
cd "$PROJECT_DIR/user-ui" || handle_error "无法切换到 user-ui 目录"

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    log "安装用户 UI 依赖..."
    npm install --legacy-peer-deps --no-audit || handle_error "安装用户 UI 依赖失败"
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
        @web3modal/wagmi || handle_error "安装用户 UI 运行时依赖失败"
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
        @types/i18next-http-backend || handle_error "安装用户 UI 开发依赖失败"
else
    log "用户 UI 依赖已存在，跳过安装..."
fi

# 检查并安装用户 API 依赖
log "检查用户 API 依赖..."
cd "$PROJECT_DIR/user-api" || handle_error "无法切换到 user-api 目录"

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    log "安装用户 API 依赖..."
    npm install --legacy-peer-deps --no-audit || handle_error "安装用户 API 依赖失败"
    npm install --save-dev @types/node @types/express @types/mongoose @types/jsonwebtoken || handle_error "安装用户 API 类型定义失败"
else
    log "用户 API 依赖已存在，跳过安装..."
fi

# 修改 package.json 中的构建脚本
log "修改构建脚本..."
npm pkg set scripts.build="tsc --skipLibCheck" || handle_error "修改构建脚本失败"

# 返回docker目录
cd "$DOCKER_DIR" || handle_error "无法切换到 Docker 目录"

# 构建用户 API 镜像
log "构建用户 API 镜像..."
docker build --no-cache -t ${DOCKER_USERNAME}/panda-quant-user-api -f Dockerfile.user-api . || handle_error "构建 API 镜像失败"

# 构建用户 UI 镜像
log "构建用户 UI 镜像..."
cd "$PROJECT_DIR/user-ui" || handle_error "无法切换到 user-ui 目录"

# 确保目录权限正确
log "设置目录权限..."
chmod -R 755 . || handle_error "设置目录权限失败"

# 构建 UI 镜像
log "开始构建 UI 镜像..."
docker build --no-cache -t ${DOCKER_USERNAME}/panda-quant-user-ui -f "$DOCKER_DIR/Dockerfile.user-ui" . || handle_error "构建 UI 镜像失败"

# 推送镜像到 Docker Hub
log "推送镜像到 Docker Hub..."
docker push ${DOCKER_USERNAME}/panda-quant-user-api || handle_error "推送 API 镜像失败"
docker push ${DOCKER_USERNAME}/panda-quant-user-ui || handle_error "推送 UI 镜像失败"

# 返回docker目录
cd "$DOCKER_DIR" || handle_error "无法切换到 Docker 目录"

# 修改 docker-compose 文件中的镜像名称
log "更新 docker-compose 文件..."
sed -i "s|image: panda-quant-user-api|image: ${DOCKER_USERNAME}/panda-quant-user-api|g" docker-compose.user.yml || handle_error "更新 docker-compose 文件失败"
sed -i "s|image: panda-quant-user-ui|image: ${DOCKER_USERNAME}/panda-quant-user-ui|g" docker-compose.user.yml || handle_error "更新 docker-compose 文件失败"

# 启动服务
log "启动服务..."
docker compose -f docker-compose.user.yml up -d || handle_error "启动服务失败"

# 等待服务启动并检查健康状态
log "等待服务启动并检查健康状态..."
for i in {1..30}; do
    if curl -s http://localhost:3001/health | grep -q "ok"; then
        log "服务已成功启动"
        break
    fi
    if [ $i -eq 30 ]; then
        handle_error "服务启动超时"
    fi
    log "等待服务启动... ($i/30)"
    sleep 2
done

# 检查服务状态
log "检查服务状态..."
docker compose -f docker-compose.user.yml ps || handle_error "检查服务状态失败"

log "用户服务部署完成" 