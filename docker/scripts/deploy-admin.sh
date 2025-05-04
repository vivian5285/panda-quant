#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$DOCKER_DIR")"

# 设置 Docker Hub 用户名
DOCKER_USERNAME="vivian5285"

# 切换到docker目录
cd "$DOCKER_DIR"

# 加载环境变量
if [ -f .env ]; then
    set -a
    source .env
    set +a
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
docker build --no-cache -t ${DOCKER_USERNAME}/panda-quant-admin-api -f Dockerfile.admin-api .

# 构建管理后台 UI 镜像
echo "构建管理后台 UI 镜像..."
cd "$PROJECT_DIR/admin-ui"

# 确保目录权限正确
chmod -R 755 .

# 确保 nginx 配置文件存在
if [ ! -f nginx.conf ]; then
    echo "创建 nginx 配置文件..."
    cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;

    # Root directory and index files
    root /usr/share/nginx/html;
    index index.html index.htm;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://admin-api:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF
fi

# 构建 UI 镜像
echo "开始构建 UI 镜像..."
docker build --no-cache -t ${DOCKER_USERNAME}/panda-quant-admin-ui -f "$DOCKER_DIR/Dockerfile.admin-ui" .

# 推送镜像到 Docker Hub
echo "推送镜像到 Docker Hub..."
docker push ${DOCKER_USERNAME}/panda-quant-admin-api
docker push ${DOCKER_USERNAME}/panda-quant-admin-ui

# 返回docker目录
cd "$DOCKER_DIR"

# 修改 docker-compose 文件中的镜像名称
sed -i "s|image: panda-quant-admin-api|image: ${DOCKER_USERNAME}/panda-quant-admin-api|g" docker-compose.admin.yml
sed -i "s|image: panda-quant-admin-ui|image: ${DOCKER_USERNAME}/panda-quant-admin-ui|g" docker-compose.admin.yml

# 启动管理后台服务
echo "启动管理后台服务..."
docker compose -f docker-compose.admin.yml up -d

echo "管理后台服务部署完成" 