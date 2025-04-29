import { Router } from 'express';
import { checkDatabaseHealth } from '../services/database';
import { checkRedisHealth } from '../services/redis';
import { checkUserApiHealth, checkAdminApiHealth, checkStrategyEngineHealth } from '../clients/api';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [dbHealth, redisHealth, userApiHealth, adminApiHealth, strategyEngineHealth] = await Promise.all([
      checkDatabaseHealth(),
      checkRedisHealth(),
      checkUserApiHealth(),
      checkAdminApiHealth(),
      checkStrategyEngineHealth()
    ]);

    res.json({
      database: dbHealth,
      redis: redisHealth,
      userApi: userApiHealth,
      adminApi: adminApiHealth,
      strategyEngine: strategyEngineHealth
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

export default router; 