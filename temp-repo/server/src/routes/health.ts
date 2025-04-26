import { Router } from 'express';
import { HealthCheckResponse } from '../interfaces/api';
import { checkDatabaseHealth } from '../services/database';
import { checkRedisHealth } from '../services/redis';
import { checkUserApiHealth } from '../clients/api';
import { checkAdminApiHealth } from '../clients/api';
import { checkStrategyEngineHealth } from '../clients/api';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    const [database, redis, userApi, adminApi, strategyEngine] = await Promise.all([
      checkDatabaseHealth(),
      checkRedisHealth(),
      checkUserApiHealth(),
      checkAdminApiHealth(),
      checkStrategyEngineHealth(),
    ]);

    const response: HealthCheckResponse = {
      status: database && redis && userApi && adminApi && strategyEngine ? 'ok' : 'error',
      services: {
        database,
        redis,
        userApi,
        adminApi,
        strategyEngine,
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
        userApi: false,
        adminApi: false,
        strategyEngine: false,
      },
    });
  }
});

export default router; 