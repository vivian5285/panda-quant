# 使用 Node.js 运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖和全局 TypeScript
RUN npm install && \
    npm install -g typescript

# 复制项目文件
COPY . .

# 编译 TypeScript
RUN tsc

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "dist/index.js"] 