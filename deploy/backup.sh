#!/bin/bash

# 设置变量
BACKUP_DIR="/backup"
DB_NAME="panda_quant"
DB_USER="your_db_user"
DB_PASSWORD="your_db_password"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
echo "Starting database backup..."
PGPASSWORD=$DB_PASSWORD pg_dump -h postgres -U $DB_USER $DB_NAME | gzip > $BACKUP_FILE

# 检查备份是否成功
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE"
    
    # 清理旧备份
    find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "Old backups cleaned up"
else
    echo "Backup failed!"
    exit 1
fi

# 加密备份文件
echo "Encrypting backup file..."
gpg --batch --yes --passphrase "$DB_PASSWORD" --symmetric $BACKUP_FILE
rm $BACKUP_FILE  # 删除未加密的备份

# 上传到远程存储（如果需要）
# aws s3 cp "${BACKUP_FILE}.gpg" s3://your-backup-bucket/

echo "Backup process completed" 