import { Redis } from 'ioredis';
import { config } from '../config';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  connectTimeout: 10000,
  disconnectTimeout: 2000,
  commandTimeout: 5000,
  keepAlive: 30000,
  family: 4,
  db: 0
});

redis.on('error', (err: Error) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Connected to Redis'));
redis.on('ready', () => console.log('Redis Client Ready'));
redis.on('reconnecting', () => console.log('Redis Client Reconnecting'));
redis.on('end', () => console.log('Redis Client Connection Ended'));

export async function connectRedis(): Promise<void> {
  try {
    await redis.ping();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    await redis.quit();
  } catch (error) {
    console.error('Failed to disconnect from Redis:', error);
    throw error;
  }
}

export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
} 