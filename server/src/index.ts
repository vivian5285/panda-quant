import express from 'express';
import { connectMongoDB, connectRedis } from './database';
import router from './routes/Index';
import { logger } from './utils/logger';
import { config } from './config';

const app = express();
const PORT = config.port;

// 设置中间件
app.use(express.json());

// 设置路由
app.use(router);

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await connectMongoDB();
    await connectRedis();

    // 启动服务器
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 