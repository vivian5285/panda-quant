import Redis from 'ioredis';
import { config } from '../config';

export class RedisService {
  private static instance: RedisService;
  private client: Redis;

  private constructor() {
    this.client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async lpush(key: string, value: string): Promise<number> {
    return this.client.lpush(key, value);
  }

  async rpop(key: string): Promise<string | null> {
    return this.client.rpop(key);
  }

  async llen(key: string): Promise<number> {
    return this.client.llen(key);
  }

  async lindex(key: string, index: number): Promise<string | null> {
    return this.client.lindex(key, index);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }
} 