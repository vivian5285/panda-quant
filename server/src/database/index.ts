import mongoose from 'mongoose';
import { createClient } from 'redis';
import { logger } from '../utils/logger';
import { config } from '../config';

// MongoDB 连接
export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('MongoDB disconnection error:', error);
    process.exit(1);
  }
};

// Redis 连接
export const redis = createClient({
  url: config.redis.url,
  password: config.redis.password
});

redis.on('error', (err) => logger.error('Redis Client Error', err));
redis.on('connect', () => logger.info('Redis connected successfully'));

export const connectRedis = async (): Promise<void> => {
  try {
    await redis.connect();
  } catch (error) {
    logger.error('Redis connection error:', error);
    process.exit(1);
  }
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    await redis.disconnect();
    logger.info('Redis disconnected successfully');
  } catch (error) {
    logger.error('Redis disconnection error:', error);
    process.exit(1);
  }
}; 