import { createClient, RedisClientType } from 'redis';
import { config } from '../../config';

export const redis: RedisClientType = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`,
  ...(config.redis.password ? { password: config.redis.password } : {})
});

redis.on('error', (err: Error) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Connected to Redis'));

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    await redis.disconnect();
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