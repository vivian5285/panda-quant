import { createClient } from 'redis';
import { config } from './config';
import { logger } from './utils/logger';

export const redis = createClient({
  url: config.redis.url
});

redis.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  logger.info('Redis Client Connected');
});

export const connectDB = async (): Promise<void> => {
  try {
    await redis.connect();
    logger.info('Redis connection established');
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
};

// 初始化连接
(async () => {
  try {
    await redis.connect();
  } catch (error) {
    logger.error('Redis connection failed:', error);
  }
})(); 