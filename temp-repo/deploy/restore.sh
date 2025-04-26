#!/bin/bash

# 设置变量
BACKUP_DIR="/backup"
DB_NAME="panda_quant"
DB_USER="your_db_user"
DB_PASSWORD="your_db_password"

# 检查参数
if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -l $BACKUP_DIR/*.sql.gz.gpg
    exit 1
fi

BACKUP_FILE="$1"

# 检查文件是否存在
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# 解密备份文件
echo "Decrypting backup file..."
DECRYPTED_FILE="${BACKUP_FILE%.gpg}"
gpg --batch --yes --passphrase "$DB_PASSWORD" --decrypt "$BACKUP_FILE" > "$DECRYPTED_FILE"

# 检查解密是否成功
if [ $? -ne 0 ]; then
    echo "Decryption failed!"
    exit 1
fi

# 停止相关服务
echo "Stopping services..."
docker-compose stop backend

# 恢复数据库
echo "Restoring database..."
gunzip -c "$DECRYPTED_FILE" | PGPASSWORD=$DB_PASSWORD psql -h postgres -U $DB_USER $DB_NAME

# 检查恢复是否成功
if [ $? -eq 0 ]; then
    echo "Database restored successfully"
    
    # 清理解密后的文件
    rm "$DECRYPTED_FILE"
    
    # 重启服务
    echo "Restarting services..."
    docker-compose start backend
else
    echo "Database restore failed!"
    exit 1
fi

echo "Restore process completed" 