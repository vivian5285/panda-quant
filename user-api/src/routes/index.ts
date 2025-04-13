import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { validateRequest } from '../middleware/validateRequest';
import { errorHandler } from '../middleware/errorHandler';
import { requestLogger } from '../middleware/requestLogger';
import { performanceMonitor } from '../middleware/performanceMonitor';
import { rateLimiter } from '../middleware/rateLimiter';

// 导入路由
import authRoutes from './auth';
import userRoutes from './user';
import assetRoutes from './asset';
import strategyRoutes from './strategy';
import backtestRoutes from './backtest';
import transactionRoutes from './transaction';

const router = express.Router();

// 中间件
router.use(validateRequest);
router.use(errorHandler);
router.use(requestLogger);
router.use(performanceMonitor);
router.use(rateLimiter);

// API 文档
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 健康检查
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API 路由
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/assets', assetRoutes);
router.use('/api/v1/strategies', strategyRoutes);
router.use('/api/v1/backtests', backtestRoutes);
router.use('/api/v1/transactions', transactionRoutes);

// 404 处理
router.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

export default router; 