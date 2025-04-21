import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseService } from './services/databaseService';
import { StrategyManager } from './managers/strategyManager';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import assetRoutes from './routes/asset.routes';
import strategyRoutes from './routes/strategy';
import marketRoutes from './routes/market';
import { scheduleWeeklyFeeDeduction } from './tasks/feeDeduction';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Initialize database service
const databaseService = DatabaseService.getInstance();

// MongoDB connection
databaseService.connect()
  .then(() => logger.info('MongoDB connected'))
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Initialize strategy manager
const strategyManager = new StrategyManager();
app.set('strategyManager', strategyManager);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/asset', assetRoutes);
app.use('/api/strategy', strategyRoutes);
app.use('/api/market', marketRoutes);

// Schedule weekly fee deduction
scheduleWeeklyFeeDeduction();

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Panda Quant User API is running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: err.message
  });
});

// Start server
const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    databaseService.disconnect()
      .then(() => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      })
      .catch(err => {
        logger.error('Error disconnecting from MongoDB:', err);
        process.exit(1);
      });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    databaseService.disconnect()
      .then(() => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      })
      .catch(err => {
        logger.error('Error disconnecting from MongoDB:', err);
        process.exit(1);
      });
  });
}); 