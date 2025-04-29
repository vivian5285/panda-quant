import { createClient } from 'redis';
import { RedisOptions } from 'redis';

export class HealthService {
  private static instance: HealthService;
  private redisClient: ReturnType<typeof createClient>;

  private constructor() {
    const redisOptions: RedisOptions = {
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    };
    this.redisClient = createClient(redisOptions);
  }

  public static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  public async checkRedisHealth(): Promise<boolean> {
    try {
      await this.redisClient.ping();
      return true;
    } catch (error) {
      return false;
    }
  }

  public async checkDatabaseHealth(): Promise<boolean> {
    try {
      // Add your database health check logic here
      return true;
    } catch (error) {
      return false;
    }
  }

  public async checkApiHealth(): Promise<boolean> {
    try {
      // Add your API health check logic here
      return true;
    } catch (error) {
      return false;
    }
  }
} 