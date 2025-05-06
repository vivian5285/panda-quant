import express from 'express';
import { connectMongoDB, connectRedis } from './database';
import router from './routes/Index';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env['PORT'] || 3005;

// 连接数据库
connectMongoDB();
connectRedis();

// 设置中间件
app.use(express.json());

// 设置路由
app.use(router);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 