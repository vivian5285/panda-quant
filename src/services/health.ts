import { createClient } from 'redis';
import { config } from '../config';

const redis = createClient({
  url: config.redis.url,
  password: config.redis.password
});

export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    return false;
  }
} 