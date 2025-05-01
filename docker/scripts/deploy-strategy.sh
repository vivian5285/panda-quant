#!/bin/bash

# 设置错误时退出
set -e

# 设置日志文件
LOG_FILE="/var/log/panda-quant/deploy-strategy.log"
mkdir -p /var/log/panda-quant
touch $LOG_FILE

# 日志函数
log() {
    local level=$1
    local message=$2
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" | tee -a $LOG_FILE
}

# 错误处理函数
handle_error() {
    log "ERROR" "错误: $1"
    log "ERROR" "部署失败，正在回滚..."
    
    # 回滚到上一个版本
    if [ -f "$CURRENT_DIR/docker-compose.strategy.yml.bak" ]; then
        log "INFO" "正在恢复上一个版本的配置..."
        cp "$CURRENT_DIR/docker-compose.strategy.yml.bak" "$CURRENT_DIR/docker-compose.strategy.yml"
    fi
    
    # 停止并移除当前容器
    docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml down
    
    # 清理临时文件
    rm -rf $CURRENT_DIR/tmp/*
    
    exit 1
}

# 健康检查函数
check_health() {
    local url=$1
    local max_retries=5
    local retry_count=0
    local sleep_time=10
    
    while [ $retry_count -lt $max_retries ]; do
        if curl -s $url | grep -q "healthy"; then
            log "INFO" "健康检查通过: $url"
            return 0
        fi
        log "WARN" "健康检查失败 (尝试 $((retry_count + 1))/$max_retries): $url"
        retry_count=$((retry_count + 1))
        sleep $sleep_time
    done
    
    return 1
}

# 备份当前配置
backup_config() {
    log "INFO" "备份当前配置..."
    cp "$CURRENT_DIR/docker-compose.strategy.yml" "$CURRENT_DIR/docker-compose.strategy.yml.bak"
    if [ -f "$CURRENT_DIR/nginx/strategy.conf" ]; then
        cp "$CURRENT_DIR/nginx/strategy.conf" "$CURRENT_DIR/nginx/strategy.conf.bak"
    fi
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
    log "INFO" "检查域名 $domain 的DNS解析..."
    
    # 检查A记录
    if ! dig +short A $domain | grep -q '^[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}$'; then
        handle_error "域名 $domain 的A记录未正确配置"
    fi
    
    # 检查CNAME记录
    if ! dig +short CNAME $domain > /dev/null; then
        log "WARN" "域名 $domain 没有CNAME记录"
    fi
    
    log "INFO" "域名 $domain 的DNS解析正常"
}

# 检查域名解析
check_domain_resolution() {
    local domain=$1
    log "INFO" "检查域名 $domain 的解析..."
    
    if ! curl -s -m 5 "http://$domain" > /dev/null; then
        log "WARN" "域名 $domain 无法通过HTTP访问，请确保域名已正确解析到服务器IP"
    fi
    
    if ! curl -s -m 5 "https://$domain" > /dev/null; then
        log "WARN" "域名 $domain 无法通过HTTPS访问，请确保SSL证书已正确配置"
    fi
}

# 设置当前部署目录和项目根目录
CURRENT_DIR=$(pwd)
PROJECT_ROOT=$(dirname "$CURRENT_DIR")

log "INFO" "当前部署目录: $CURRENT_DIR"
log "INFO" "项目根目录: $PROJECT_ROOT"

# 创建临时目录
mkdir -p $CURRENT_DIR/tmp

# 备份当前配置
backup_config

# 检查DNS解析
check_dns $STRATEGY_DOMAIN
check_dns $STRATEGY_API_DOMAIN

# 1. 配置环境变量
log "INFO" "1. 配置环境变量..."
if [ ! -f .env ]; then
    if [ ! -f .env.example ]; then
        handle_error "缺少环境变量示例文件 .env.example"
    fi
    log "INFO" "从 .env.example 创建环境变量文件..."
    cp .env.example .env
    log "INFO" "请编辑 .env 文件并设置必要的环境变量"
    exit 1
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
log "INFO" "2. 检查依赖和类型定义..."
cd $PROJECT_ROOT/strategy-api

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    log "INFO" "node_modules 不存在，安装依赖..."
    # 清理 npm 缓存
    npm cache clean --force
    
    # 安装所有依赖
    log "INFO" "安装所有依赖..."
    npm install --prefer-offline --no-audit --legacy-peer-deps
    
    # 安装开发依赖和类型定义
    log "INFO" "安装开发依赖和类型定义..."
    npm install --save-dev --prefer-offline --no-audit \
        @types/node \
        @types/express \
        @types/mongoose \
        @types/redis \
        typescript@5.3.3 \
        @typescript-eslint/parser \
        @typescript-eslint/eslint-plugin
    
    # 检查 TypeScript 版本
    if [ "$(npm list typescript | grep -o '5.3.3')" != "5.3.3" ]; then
        log "WARN" "TypeScript 版本不正确，重新安装..."
        npm uninstall typescript
        npm install --save-dev typescript@5.3.3
    fi
else
    log "INFO" "node_modules 已存在，检查依赖版本..."
    # 检查 TypeScript 版本
    if [ "$(npm list typescript | grep -o '5.3.3')" != "5.3.3" ]; then
        log "INFO" "更新 TypeScript 版本..."
        npm uninstall typescript
        npm install --save-dev typescript@5.3.3
    fi
fi

# 检查类型定义文件是否存在
if [ ! -d "src/types" ]; then
    log "INFO" "创建缺失的类型定义文件..."
    mkdir -p src/types
else
    log "INFO" "检查类型定义文件..."
fi

# 创建或更新类型定义文件
create_or_update_type_file() {
    local file=$1
    local content=$2
    if [ ! -f "$file" ] || ! diff <(echo "$content") "$file" > /dev/null 2>&1; then
        log "INFO" "更新类型定义文件: $file"
        echo "$content" > "$file"
    fi
}

# 创建或更新类型定义
create_or_update_type_file "src/types/Blacklist.d.ts" 'export interface Blacklist { _id: string; userId: string; reason: string; createdAt: Date; updatedAt: Date; }'
create_or_update_type_file "src/types/CommissionRule.d.ts" 'export interface CommissionRule { _id: string; level: number; rate: number; createdAt: Date; updatedAt: Date; }'
create_or_update_type_file "src/types/Order.d.ts" 'export interface Order { _id: string; userId: string; strategyId: string; amount: number; status: string; createdAt: Date; updatedAt: Date; }'
create_or_update_type_file "src/types/StrategyRating.d.ts" 'export interface StrategyRating { _id: string; strategyId: string; userId: string; rating: number; comment?: string; createdAt: Date; updatedAt: Date; }'
create_or_update_type_file "src/types/UserLevel.d.ts" 'export interface UserLevel { _id: string; userId: string; level: number; points: number; createdAt: Date; updatedAt: Date; }'

# 3. 构建策略端镜像
log "INFO" "3. 构建策略端镜像..."
if ! docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml build --no-cache; then
    handle_error "构建镜像失败"
fi

# 4. 启动策略端服务
log "INFO" "4. 启动策略端服务..."
if ! docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml up -d; then
    handle_error "启动服务失败"
fi

# 5. 检查服务状态
log "INFO" "5. 检查服务状态..."
echo "检查 Docker 容器状态："
docker-compose -f $CURRENT_DIR/docker-compose.strategy.yml ps

# 6. 配置 SSL 证书
log "INFO" "6. 配置 SSL 证书..."
if [ ! -f /etc/letsencrypt/live/${STRATEGY_DOMAIN}/fullchain.pem ]; then
    log "INFO" "配置策略端域名证书..."
    
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
    log "INFO" "配置证书自动续期..."
    if ! grep -q "certbot renew" /etc/crontab; then
        echo "0 0 1 * * root certbot renew --quiet --deploy-hook 'systemctl reload nginx'" >> /etc/crontab
        log "INFO" "证书自动续期配置成功"
    fi
else
    log "INFO" "SSL 证书已存在，跳过配置"
fi

# 7. 配置 Nginx
log "INFO" "7. 配置 Nginx..."
if [ -f $CURRENT_DIR/nginx/strategy.conf ]; then
    log "INFO" "Nginx 配置文件已存在，备份原配置..."
    cp $CURRENT_DIR/nginx/strategy.conf $CURRENT_DIR/nginx/strategy.conf.bak
fi

log "INFO" "配置 Nginx..."
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
log "INFO" "8. 验证Nginx配置..."
if ! sudo nginx -t; then
    log "ERROR" "Nginx配置验证失败，恢复备份配置..."
    cp $CURRENT_DIR/nginx/strategy.conf.bak $CURRENT_DIR/nginx/strategy.conf
    handle_error "Nginx配置验证失败"
fi

# 9. 重启Nginx服务
log "INFO" "9. 重启Nginx服务..."
if ! sudo systemctl restart nginx; then
    handle_error "Nginx服务重启失败"
fi

# 10. 检查域名解析
log "INFO" "10. 检查域名解析..."
check_domain_resolution $STRATEGY_DOMAIN
check_domain_resolution $STRATEGY_API_DOMAIN

# 11. 健康检查
log "INFO" "11. 执行健康检查..."
if ! check_health "https://${STRATEGY_DOMAIN}/health"; then
    handle_error "策略后台健康检查失败"
fi
if ! check_health "https://${STRATEGY_API_DOMAIN}/health"; then
    handle_error "策略API健康检查失败"
fi

# 12. 清理临时文件
log "INFO" "12. 清理临时文件..."
rm -rf $CURRENT_DIR/tmp/*

log "INFO" "部署完成！"
log "INFO" "策略后台地址: https://${STRATEGY_DOMAIN}"
log "INFO" "策略API地址: https://${STRATEGY_API_DOMAIN}" 