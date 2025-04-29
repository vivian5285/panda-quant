import { Router } from 'express';
import { HealthService } from '../services/health';

const router = Router();
const healthService = HealthService.getInstance();

router.get('/redis', async (req, res) => {
  const isHealthy = await healthService.checkRedisHealth();
  res.json({ status: isHealthy ? 'healthy' : 'unhealthy' });
});

router.get('/database', async (req, res) => {
  const isHealthy = await healthService.checkDatabaseHealth();
  res.json({ status: isHealthy ? 'healthy' : 'unhealthy' });
});

router.get('/api', async (req, res) => {
  const isHealthy = await healthService.checkApiHealth();
  res.json({ status: isHealthy ? 'healthy' : 'unhealthy' });
});

export default router; 