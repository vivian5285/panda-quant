#!/bin/bash

# 停止并删除所有容器和网络
docker compose -f docker-compose.admin.yml down
docker compose -f docker-compose.user.yml down
docker compose -f docker-compose.network.yml down
docker network prune -f

# 重新构建镜像
docker compose -f docker-compose.admin.yml build
docker compose -f docker-compose.user.yml build

# 创建网络并启动服务
docker compose -f docker-compose.network.yml up -d
docker compose -f docker-compose.admin.yml up -d
docker compose -f docker-compose.user.yml up -d 