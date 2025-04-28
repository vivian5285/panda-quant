import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import verificationRoutes from './routes/verification.routes';
import { syncService } from './services/sync.service';
import routes from './routes';

const app = express();

// 中间件
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Panda Quant API' });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Panda Quant User API is running'
  });
});

// 路由
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/verification', verificationRoutes);

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

async function startServer() {
  try {
    // 连接 MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant');
    console.log('Connected to MongoDB');

    // 启动同步服务
    await syncService.startSync();
    console.log('Sync service started');

    // 启动服务器
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app; 