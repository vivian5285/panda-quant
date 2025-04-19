FROM node:18

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录权限
RUN chown -R node:node /app

# 切换到非root用户
USER node

# 复制 package 文件
COPY --chown=node:node package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY --chown=node:node . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["npm", "start"] 