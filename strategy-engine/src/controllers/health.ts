import { Request, Response } from 'express';
import { HealthCheckResponse } from '../interfaces/api';
import { checkDatabaseConnection } from '../services/database';
import { checkRedisHealth } from '../services/redis';
import { checkServerHealth } from '../services/server';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const [database, redis, server] = await Promise.all([
      checkDatabaseConnection(),
      checkRedisHealth(),
      checkServerHealth(),
    ]);

    const response: HealthCheckResponse = {
      status: database && redis && server ? 'ok' : 'error',
      services: {
        database,
        redis,
        server,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      services: {
        database: false,
        redis: false,
        server: false,
      },
    });
  }
}; 