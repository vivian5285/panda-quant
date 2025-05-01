#!/bin/bash

# 设置环境变量
cat > .env << 'EOF'
# Database
DB_HOST=postgres
DB_USERNAME=postgres
DB_PASSWORD=Wl528586*
DB_NAME=panda_quant
DB_PORT=5432
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=2000

# JWT
JWT_SECRET=panda_quant_secret_key_2024
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# API
API_PORT=3000
NODE_ENV=production
API_RATE_LIMIT=100
API_RATE_LIMIT_WINDOW=900000

# SSL
SSL_CERT_PATH=/etc/nginx/ssl/pandatrade.space.crt
SSL_KEY_PATH=/etc/nginx/ssl/pandatrade.space.key

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000
GRAFANA_ADMIN_PASSWORD=Wl528586*
ALERTMANAGER_PORT=9093

# Backup
BACKUP_DIR=/backup
BACKUP_RETENTION_DAYS=7
BACKUP_SCHEDULE="0 0 * * *"

# Security
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SYMBOLS=true
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCKOUT_MINUTES=30

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_RETENTION_DAYS=30

# Cache
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=Wl528586*
CACHE_TTL=3600

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=Wl528586*
SMTP_FROM=noreply@pandatrade.space

# CDN
CDN_ENABLED=true
CDN_DOMAIN=cdn.pandatrade.space
CDN_KEY=your_cdn_key
CDN_SECRET=your_cdn_secret
EOF

# 部署管理端
echo "Deploying admin services..."
docker-compose -f docker-compose.admin.yml up -d

# 部署用户端
echo "Deploying user services..."
docker-compose -f docker-compose.user.yml up -d

# 部署策略引擎
echo "Deploying strategy engine..."
docker-compose -f docker-compose.strategy.yml up -d

# 配置 SSL 证书
echo "Setting up SSL certificates..."
bash scripts/ssl-setup.sh

echo "Deployment completed!" 