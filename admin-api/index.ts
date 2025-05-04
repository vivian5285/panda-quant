import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/user';
import assetRoutes from './routes/assetRoutes';
import orderRoutes from './routes/order.routes';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// 健康检查
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/assets', authenticateToken, assetRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);

// 错误处理中间件
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app; 