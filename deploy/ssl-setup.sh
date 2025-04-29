#!/bin/bash

# 打印带颜色的消息
print_message() {
    echo -e "\033[1;34m$1\033[0m"
}

# 打印错误消息
print_error() {
    echo -e "\033[1;31mError: $1\033[0m"
    exit 1
}

# 检查命令执行结果
check_result() {
    if [ $? -ne 0 ]; then
        print_error "$1"
    fi
}

# 安装必要的软件包
install_dependencies() {
    print_message "安装必要的软件包..."
    
    # 更新包索引
    apt-get update
    
    # 安装 Certbot 和 Nginx 插件
    apt-get install -y certbot python3-certbot-nginx
    
    check_result "安装软件包失败"
}

# 配置域名和SSL证书
setup_domain_and_ssl() {
    print_message "开始配置域名和SSL证书..."
    
    # 安装Certbot
    if ! command -v certbot &> /dev/null; then
        install_dependencies
    fi
    
    # 配置Nginx
    print_message "配置Nginx..."
    mkdir -p /etc/nginx/conf.d
    cp deploy/nginx/*.conf /etc/nginx/conf.d/
    
    # 获取SSL证书
    print_message "获取SSL证书..."
    domains=(
        "pandatrade.space"
        "admin.pandatrade.space"
        "admin-api.pandatrade.space"
        "api.pandatrade.space"
        "strategy.pandatrade.space"
        "server.pandatrade.space"
    )
    
    for domain in "${domains[@]}"; do
        print_message "为 $domain 获取证书..."
        certbot --nginx -d $domain --non-interactive --agree-tos --email admin@pandatrade.space
        check_result "为 $domain 获取证书失败"
    done
    
    # 配置证书自动续期
    print_message "配置证书自动续期..."
    (crontab -l 2>/dev/null; echo "0 0 1 * * certbot renew --quiet") | crontab -
    
    # 重启Nginx
    print_message "重启Nginx..."
    systemctl restart nginx
    
    print_message "域名和SSL证书配置完成"
}

# 主函数
main() {
    print_message "开始SSL证书配置..."
    setup_domain_and_ssl
    print_message "SSL证书配置完成"
}

# 执行主函数
main 