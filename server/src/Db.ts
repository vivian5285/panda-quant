import { createClient } from 'redis';
import mongoose from 'mongoose';
import { config } from './Config';
import { logger } from './utils/Logger';

// Redis 客户端
export const redis = createClient({
  url: config.redis.url
});

redis.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  logger.info('Redis Client Connected');
});

// MongoDB 连接
mongoose.connect(config.mongoUri)
  .then(() => {
    logger.info('MongoDB Connected');
  })
  .catch((err) => {
    logger.error('MongoDB Connection Error:', err);
  });

export const connectDB = async (): Promise<void> => {
  try {
    // 连接 Redis
    await redis.connect();
    logger.info('Redis connection established');

    // 确保 MongoDB 已连接
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(config.mongoUri);
      logger.info('MongoDB connection established');
    }
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

// 初始化连接
(async () => {
  try {
    await connectDB();
  } catch (error) {
    logger.error('Database connection failed:', error);
  }
})(); 