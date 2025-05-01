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
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# 发送告警
send_alert() {
    local message="$1"
    local severity="$2"
    
    # 发送邮件告警
    echo "$message" | mail -s "[$severity] System Alert" admin@example.com
    
    # 发送Slack通知
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"[$severity] $message\"}" \
        $SLACK_WEBHOOK_URL
}

# 检查服务状态
check_services() {
    log "Checking services status..."
    local services=("server" "postgres" "redis" "nginx")
    local all_healthy=true
    
    for service in "${services[@]}"; do
        if ! docker-compose ps "$service" | grep -q "Up"; then
            error "Service $service is down"
            send_alert "Service $service is down" "CRITICAL"
            all_healthy=false
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        log "All services are running"
    fi
}

# 检查日志
check_logs() {
    log "Checking logs for errors..."
    local error_count=$(docker-compose logs --tail=1000 | grep -i "error" | wc -l)
    
    if [ "$error_count" -gt 0 ]; then
        warn "Found $error_count errors in recent logs"
        send_alert "Found $error_count errors in recent logs" "WARNING"
    fi
}

# 检查资源使用情况
check_resources() {
    log "Checking resource usage..."
    local cpu_threshold=80
    local memory_threshold=85
    
    docker stats --no-stream --format "{{.Name}} {{.CPUPerc}} {{.MemPerc}}" | while read -r line; do
        local container=$(echo "$line" | awk '{print $1}')
        local cpu=$(echo "$line" | awk '{print $2}' | tr -d '%')
        local memory=$(echo "$line" | awk '{print $3}' | tr -d '%')
        
        if (( $(echo "$cpu > $cpu_threshold" | bc -l) )); then
            warn "High CPU usage in $container: $cpu%"
            send_alert "High CPU usage in $container: $cpu%" "WARNING"
        fi
        
        if (( $(echo "$memory > $memory_threshold" | bc -l) )); then
            warn "High memory usage in $container: $memory%"
            send_alert "High memory usage in $container: $memory%" "WARNING"
        fi
    done
}

# 检查网络连接
check_network() {
    log "Checking network connections..."
    local connection_count=$(netstat -tuln | wc -l)
    
    if [ "$connection_count" -gt 1000 ]; then
        warn "High number of network connections: $connection_count"
        send_alert "High number of network connections: $connection_count" "WARNING"
    fi
}

# 检查磁盘空间
check_disk() {
    log "Checking disk space..."
    local threshold=85
    
    df -h | grep -v "tmpfs" | while read -r line; do
        local usage=$(echo "$line" | awk '{print $5}' | tr -d '%')
        local mount=$(echo "$line" | awk '{print $6}')
        
        if [ "$usage" -gt "$threshold" ]; then
            warn "High disk usage on $mount: $usage%"
            send_alert "High disk usage on $mount: $usage%" "WARNING"
        fi
    done
}

# 检查数据库性能
check_database() {
    log "Checking database performance..."
    local query_time=$(docker-compose exec postgres psql -U $DB_USERNAME -d $DB_NAME -c "EXPLAIN ANALYZE SELECT 1;" | grep "Execution Time" | awk '{print $3}')
    
    if (( $(echo "$query_time > 100" | bc -l) )); then
        warn "Slow database query time: $query_time ms"
        send_alert "Slow database query time: $query_time ms" "WARNING"
    fi
}

# 检查Redis性能
check_redis() {
    log "Checking Redis performance..."
    local redis_info=$(docker-compose exec redis redis-cli info)
    local connected_clients=$(echo "$redis_info" | grep "connected_clients" | awk -F: '{print $2}')
    local used_memory=$(echo "$redis_info" | grep "used_memory_human" | awk -F: '{print $2}')
    
    if [ "$connected_clients" -gt 100 ]; then
        warn "High number of Redis clients: $connected_clients"
        send_alert "High number of Redis clients: $connected_clients" "WARNING"
    fi
}

# 主函数
main() {
    log "Starting system monitoring..."
    
    check_services
    echo "----------------------------------------"
    
    check_logs
    echo "----------------------------------------"
    
    check_resources
    echo "----------------------------------------"
    
    check_network
    echo "----------------------------------------"
    
    check_disk
    echo "----------------------------------------"
    
    check_database
    echo "----------------------------------------"
    
    check_redis
    echo "----------------------------------------"
    
    log "Monitoring completed!"
}

# 执行主函数
main 