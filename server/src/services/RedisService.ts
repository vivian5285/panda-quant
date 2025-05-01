import { createClient } from 'redis';
import { logger } from '../utils/logger';

export class RedisService {
  private client: ReturnType<typeof createClient>;
  private static instance: RedisService;

  private constructor() {
    this.client = createClient({
      url: process.env['REDIS_URL'] || 'redis://localhost:6379'
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    this.client.connect();
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async lPush(key: string, value: string): Promise<number> {
    return await this.client.lPush(key, value);
  }

  public async rPop(key: string): Promise<string | null> {
    return await this.client.rPop(key);
  }

  public async lLen(key: string): Promise<number> {
    return await this.client.lLen(key);
  }

  public async lIndex(key: string, index: number): Promise<string | null> {
    return await this.client.lIndex(key, index);
  }

  public async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  public async expire(key: string, seconds: number): Promise<boolean> {
    return await this.client.expire(key, seconds);
  }
} 