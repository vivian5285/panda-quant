#!/bin/bash

# 设置错误时退出
set -e

# 设置日志文件
LOG_FILE="/var/log/panda-quant/deploy-strategy.log"
mkdir -p /var/log/panda-quant
touch $LOG_FILE

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# 错误处理函数
handle_error() {
    log "错误: $1"
    log "部署失败，正在回滚..."
    docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml down
    exit 1
}

# 域名配置
DOMAIN="pandatrade.space"
STRATEGY_SUBDOMAIN="server"
STRATEGY_API_SUBDOMAIN="strategy"
STRATEGY_DOMAIN="${STRATEGY_SUBDOMAIN}.${DOMAIN}"
STRATEGY_API_DOMAIN="${STRATEGY_API_SUBDOMAIN}.${DOMAIN}"

# 检查DNS解析
check_dns() {
    local domain=$1
    log "检查域名 $domain 的DNS解析..."
    
    # 检查A记录
    if ! dig +short A $domain | grep -q '^[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}$'; then
        handle_error "域名 $domain 的A记录未正确配置"
    fi
    
    # 检查CNAME记录
    if ! dig +short CNAME $domain > /dev/null; then
        log "域名 $domain 没有CNAME记录"
    fi
    
    log "域名 $domain 的DNS解析正常"
}

# 检查域名解析
check_domain_resolution() {
    local domain=$1
    log "检查域名 $domain 的解析..."
    
    if ! curl -s -m 5 "http://$domain" > /dev/null; then
        log "警告: 域名 $domain 无法通过HTTP访问，请确保域名已正确解析到服务器IP"
    fi
    
    if ! curl -s -m 5 "https://$domain" > /dev/null; then
        log "警告: 域名 $domain 无法通过HTTPS访问，请确保SSL证书已正确配置"
    fi
}

# 设置当前部署目录和项目根目录
CURRENT_DIR=$(pwd)
PROJECT_ROOT=$(dirname "$CURRENT_DIR")

log "当前部署目录: $CURRENT_DIR"
log "项目根目录: $PROJECT_ROOT"

# 检查DNS解析
check_dns $STRATEGY_DOMAIN
check_dns $STRATEGY_API_DOMAIN

# 1. 配置环境变量
log "1. 配置环境变量..."
if [ ! -f .env ]; then
    cat > .env << EOF
# 应用配置
NODE_ENV=production

# 端口配置
STRATEGY_API_PORT=3002

# 域名配置
DOMAIN=${DOMAIN}
STRATEGY_SUBDOMAIN=${STRATEGY_SUBDOMAIN}
STRATEGY_API_SUBDOMAIN=${STRATEGY_API_SUBDOMAIN}
STRATEGY_DOMAIN=${STRATEGY_DOMAIN}
STRATEGY_API_DOMAIN=${STRATEGY_API_DOMAIN}

# 数据库配置
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=Wl528586*
MONGO_URI=mongodb://admin:Wl528586*@mongodb:27017/admin

# Redis配置
REDIS_PASSWORD=Wl528586*
REDIS_URI=redis://:Wl528586*@redis:6380

# JWT配置
JWT_SECRET=Wl528586*

# Encryption key
ENCRYPTION_KEY=Wl528586*

# Network Configuration
NETWORK_NAME=panda-quant-network

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_RETENTION_DAYS=30
EOF
    log "环境变量文件创建成功"
else
    log "环境变量文件已存在，跳过创建"
fi

# 设置权限
chmod 600 .env
if [ -f ssl/private.key ]; then
    chmod 600 ssl/private.key
fi
if [ -f ssl/certificate.crt ]; then
    chmod 644 ssl/certificate.crt
fi

# 创建必要的目录并设置权限
mkdir -p $PROJECT_ROOT/strategy-api/logs
chmod 755 $PROJECT_ROOT/strategy-api/logs

# 2. 安装依赖和类型定义
log "2. 安装依赖和类型定义..."
cd $PROJECT_ROOT/strategy-api

# 安装生产依赖
log "安装生产依赖..."
npm install --production

# 安装开发依赖和类型定义
log "安装开发依赖和类型定义..."
npm install --save-dev @types/node @types/redis @types/express @types/mongoose typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 创建缺失的类型定义文件
log "创建缺失的类型定义文件..."
mkdir -p src/types

# 创建 Blacklist 类型定义
cat > src/types/Blacklist.d.ts << EOF
export interface Blacklist {
    _id: string;
    userId: string;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}
EOF

# 创建 CommissionRule 类型定义
cat > src/types/CommissionRule.d.ts << EOF
export interface CommissionRule {
    _id: string;
    level: number;
    rate: number;
    createdAt: Date;
    updatedAt: Date;
}
EOF

# 创建 Order 类型定义
cat > src/types/Order.d.ts << EOF
export interface Order {
    _id: string;
    userId: string;
    strategyId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
EOF

# 创建 StrategyRating 类型定义
cat > src/types/StrategyRating.d.ts << EOF
export interface StrategyRating {
    _id: string;
    strategyId: string;
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}
EOF

# 创建 UserLevel 类型定义
cat > src/types/UserLevel.d.ts << EOF
export interface UserLevel {
    _id: string;
    userId: string;
    level: number;
    points: number;
    createdAt: Date;
    updatedAt: Date;
}
EOF

# 3. 构建策略端镜像
log "3. 构建策略端镜像..."
if ! docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml build; then
    handle_error "构建镜像失败"
fi

# 4. 启动策略端服务
log "4. 启动策略端服务..."
if ! docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml up -d; then
    handle_error "启动服务失败"
fi

# 5. 检查服务状态
log "5. 检查服务状态..."
echo "检查 Docker 容器状态："
docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml ps

# 5. 配置 SSL 证书
log "5. 配置 SSL 证书..."
if [ ! -f /etc/letsencrypt/live/${STRATEGY_DOMAIN}/fullchain.pem ]; then
    log "配置策略端域名证书..."
    
    # 创建临时 Nginx 配置
    mkdir -p /etc/nginx/conf.d
    cat > /etc/nginx/conf.d/strategy.conf << EOF
server {
    listen 80;
    server_name ${STRATEGY_DOMAIN} ${STRATEGY_API_DOMAIN};
    location / {
        return 301 https://\$host\$request_uri;
    }
}
EOF
    
    # 验证 Nginx 配置
    if ! nginx -t; then
        handle_error "Nginx 配置验证失败"
    fi
    
    # 重启 Nginx
    if ! systemctl restart nginx; then
        handle_error "Nginx 重启失败"
    fi
    
    # 申请证书
    if ! certbot --nginx -d ${STRATEGY_DOMAIN} -d ${STRATEGY_API_DOMAIN} --email pandaspace0001@gmail.com --agree-tos --no-eff-email; then
        handle_error "SSL证书配置失败"
    fi
    
    # 配置证书自动续期
    log "配置证书自动续期..."
    if ! grep -q "certbot renew" /etc/crontab; then
        echo "0 0 1 * * root certbot renew --quiet --deploy-hook 'systemctl reload nginx'" >> /etc/crontab
        log "证书自动续期配置成功"
    fi
else
    log "SSL 证书已存在，跳过配置"
fi

# 7. 配置 Nginx
log "7. 配置 Nginx..."
if [ -f $CURRENT_DIR/nginx/strategy.conf ]; then
    log "Nginx 配置文件已存在，备份原配置..."
    cp $CURRENT_DIR/nginx/strategy.conf $CURRENT_DIR/nginx/strategy.conf.bak
fi

log "配置 Nginx..."
mkdir -p $CURRENT_DIR/nginx
cat > $CURRENT_DIR/nginx/strategy.conf << EOF
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;
    sendfile on;
    keepalive_timeout 65;

    # 策略端 API 服务器
    upstream strategy-api {
        server localhost:3002;
        keepalive 32;
    }

    # 策略后台域名配置
    server {
        listen 80;
        server_name ${STRATEGY_DOMAIN};
        return 301 https://\$server_name\$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name ${STRATEGY_DOMAIN};

        # SSL证书配置
        ssl_certificate /etc/letsencrypt/live/${STRATEGY_DOMAIN}/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/${STRATEGY_DOMAIN}/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/${STRATEGY_DOMAIN}/chain.pem;

        # SSL优化配置
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;
        ssl_session_tickets off;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # 安全头
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://*.${DOMAIN};" always;

        # 前端应用
        location / {
            root /var/www/strategy-ui;
            try_files \$uri \$uri/ /index.html;
            add_header Cache-Control "no-cache";
            
            # 启用 gzip 压缩
            gzip on;
            gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
            gzip_min_length 1000;
            gzip_proxied any;
            gzip_vary on;
        }

        # API代理
        location /api {
            proxy_pass http://strategy-api;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_cache_bypass \$http_upgrade;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            
            # 超时设置
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
            
            # 启用 gzip 压缩
            gzip on;
            gzip_types application/json;
            gzip_min_length 1000;
            gzip_proxied any;
        }

        # 健康检查
        location /health {
            access_log off;
            return 200 'healthy\n';
            add_header Content-Type text/plain;
        }

        # 错误页面
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }

    # 策略API域名配置
    server {
        listen 80;
        server_name ${STRATEGY_API_DOMAIN};
        return 301 https://\$server_name\$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name ${STRATEGY_API_DOMAIN};

        # SSL证书配置
        ssl_certificate /etc/letsencrypt/live/${STRATEGY_API_DOMAIN}/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/${STRATEGY_API_DOMAIN}/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/${STRATEGY_API_DOMAIN}/chain.pem;

        # SSL优化配置
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;
        ssl_session_tickets off;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # 安全头
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://*.${DOMAIN};" always;

        # API代理
        location / {
            proxy_pass http://strategy-api;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_cache_bypass \$http_upgrade;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            
            # 超时设置
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
            
            # 启用 gzip 压缩
            gzip on;
            gzip_types application/json;
            gzip_min_length 1000;
            gzip_proxied any;
        }

        # 健康检查
        location /health {
            access_log off;
            return 200 'healthy\n';
            add_header Content-Type text/plain;
        }

        # 错误页面
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
EOF

# 8. 验证Nginx配置
log "8. 验证Nginx配置..."
if ! sudo nginx -t; then
    log "Nginx配置验证失败，恢复备份配置..."
    cp $CURRENT_DIR/nginx/strategy.conf.bak $CURRENT_DIR/nginx/strategy.conf
    handle_error "Nginx配置验证失败"
fi

# 9. 重启Nginx服务
log "9. 重启Nginx服务..."
if ! sudo systemctl restart nginx; then
    handle_error "Nginx服务重启失败"
fi

# 10. 检查域名解析
log "10. 检查域名解析..."
check_domain_resolution $STRATEGY_DOMAIN
check_domain_resolution $STRATEGY_API_DOMAIN

# 11. 健康检查
log "11. 执行健康检查..."
sleep 10  # 等待服务启动
if ! curl -s https://${STRATEGY_DOMAIN}/health | grep -q "healthy"; then
    handle_error "策略后台健康检查失败"
fi
if ! curl -s https://${STRATEGY_API_DOMAIN}/health | grep -q "healthy"; then
    handle_error "策略API健康检查失败"
fi

log "部署完成！"
log "策略后台地址: https://${STRATEGY_DOMAIN}"
log "策略API地址: https://${STRATEGY_API_DOMAIN}" 