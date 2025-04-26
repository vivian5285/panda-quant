import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userAssetRoutes from './user-api/routes/assetRoutes';
import adminAssetRoutes from './admin-api/routes/assetRoutes';

dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 路由
app.use('/api/user', userAssetRoutes); // 用户API
app.use('/api/admin', adminAssetRoutes); // 管理员API

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 