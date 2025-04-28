#!/bin/bash

# 设置错误时退出
set -e

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 日志函数
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
    exit 1
}

# 设置工作目录
WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 确保在正确的目录下运行
cd "$WORKSPACE_DIR"
log "当前工作目录: $(pwd)"

# 构建 shared 模块
build_shared() {
    log "构建 shared 模块..."
    cd "$WORKSPACE_DIR/shared"
    
    # 清理之前的构建和源文件
    rm -rf dist
    rm -rf src
    
    # 创建新的目录结构
    mkdir -p src/types src/models
    
    # 复制源文件
    if [ -f "types/auth.ts" ]; then
        cp types/auth.ts src/types/
    fi
    
    if [ -f "models/user.ts" ]; then
        cp models/user.ts src/models/
    fi
    
    if [ -f "models/asset.ts" ]; then
        cp models/asset.ts src/models/
    fi
    
    if [ -f "models/fee.ts" ]; then
        cp models/fee.ts src/models/
    fi
    
    # 安装依赖并构建
    npm install
    npm run build
    
    # 确保构建成功
    if [ ! -d "dist" ]; then
        error "shared 模块构建失败"
    fi
    
    cd "$WORKSPACE_DIR"
}

# 部署管理端
deploy_admin() {
    log "开始部署管理端..."
    
    # 构建 shared 模块
    build_shared
    
    # 复制 shared 模块到 admin-api
    log "复制 shared 模块到 admin-api..."
    cd "$WORKSPACE_DIR"
    rm -rf admin-api/shared
    cp -r shared admin-api/
    
    # 更新 tsconfig.json
    log "更新 tsconfig.json..."
    cd "$WORKSPACE_DIR/admin-api"
    
    # 创建新的 tsconfig.json
    cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": ".",
    "resolveJsonModule": true,
    "declaration": true,
    "moduleResolution": "node",
    "typeRoots": ["./node_modules/@types"],
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["./shared/src/*"]
    }
  },
  "include": [
    "src/**/*",
    "models/**/*",
    "types/**/*",
    "interfaces/**/*",
    "utils/**/*",
    "services/**/*",
    "middleware/**/*",
    "routes/**/*",
    "controllers/**/*",
    "shared/src/**/*",
    "index.ts",
    "app.ts"
  ]
}
EOL
    
    # 更新导入路径
    log "更新导入路径..."
    find . -type f -name "*.ts" -exec sed -i 's|from "../../shared/|from "@shared/|g' {} \;
    
    # 安装管理端依赖
    log "安装管理端依赖..."
    npm install
    
    cd "$WORKSPACE_DIR/admin-ui"
    npm install
    
    cd "$WORKSPACE_DIR"
    
    # 构建管理端服务
    log "构建管理端服务..."
    cd "$WORKSPACE_DIR/admin-api"
    npm run build
    
    cd "$WORKSPACE_DIR/admin-ui"
    npm run build
    
    cd "$WORKSPACE_DIR"
    
    # 启动服务
    log "启动管理端服务..."
    docker-compose -f deploy/docker-compose.admin.yml up -d --build
    
    log "管理端部署完成！"
}

# 部署用户端
deploy_user() {
    log "开始部署用户端..."
    
    # 构建 shared 模块
    build_shared
    
    # 复制 shared 模块到 user-api
    log "复制 shared 模块到 user-api..."
    cd "$WORKSPACE_DIR"
    rm -rf user-api/shared
    cp -r shared user-api/
    
    # 更新 tsconfig.json
    log "更新 tsconfig.json..."
    cd "$WORKSPACE_DIR/user-api"
    
    # 创建新的 tsconfig.json
    cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": ".",
    "resolveJsonModule": true,
    "declaration": true,
    "moduleResolution": "node",
    "typeRoots": ["./node_modules/@types"],
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["./shared/src/*"]
    }
  },
  "include": [
    "src/**/*",
    "models/**/*",
    "types/**/*",
    "interfaces/**/*",
    "utils/**/*",
    "services/**/*",
    "middleware/**/*",
    "routes/**/*",
    "controllers/**/*",
    "shared/src/**/*",
    "index.ts",
    "app.ts"
  ]
}
EOL
    
    # 更新导入路径
    log "更新导入路径..."
    find . -type f -name "*.ts" -exec sed -i 's|from "../../shared/|from "@shared/|g' {} \;
    
    # 安装用户端依赖
    log "安装用户端依赖..."
    npm install
    
    cd "$WORKSPACE_DIR/user-ui"
    npm install
    
    cd "$WORKSPACE_DIR"
    
    # 构建用户端服务
    log "构建用户端服务..."
    cd "$WORKSPACE_DIR/user-api"
    npm run build
    
    cd "$WORKSPACE_DIR/user-ui"
    npm run build
    
    cd "$WORKSPACE_DIR"
    
    # 启动服务
    log "启动用户端服务..."
    docker-compose -f deploy/docker-compose.user.yml up -d --build
    
    log "用户端部署完成！"
}

# 主函数
main() {
    local deploy_type=$1
    
    case $deploy_type in
        "admin")
            deploy_admin
            ;;
        "user")
            deploy_user
            ;;
        *)
            error "请指定部署类型: admin 或 user"
            ;;
    esac
}

# 执行主函数
main "$@" 