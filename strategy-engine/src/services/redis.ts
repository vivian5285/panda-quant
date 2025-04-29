import { createClient } from 'redis';
import { config } from '../config';

export const redis = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`,
  password: config.redis.password
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Connected to Redis'));

export async function connectRedis(): Promise<void> {
  await redis.connect();
}

export async function disconnectRedis(): Promise<void> {
  await redis.disconnect();
} 