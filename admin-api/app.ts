import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { initAdmin } from './controllers/authController';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 路由
app.use('/api/auth', authRoutes);

// 连接数据库
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/panda-quant')
  .then(async () => {
    console.log('Connected to MongoDB');
    // 初始化管理员账号
    await initAdmin();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 