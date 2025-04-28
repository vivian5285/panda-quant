import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error';
import { authenticate } from './middleware/auth';
import authRoutes from './routes/auth.routes';
import verificationRoutes from './routes/verification.routes';
import { syncService } from './services/sync.service';
import routes from './routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', authenticate, routes);
app.use('/api/auth', authRoutes);
app.use('/api/verification', verificationRoutes);

// Error handling
app.use(errorHandler);

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