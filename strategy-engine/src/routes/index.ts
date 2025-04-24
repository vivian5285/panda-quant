import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { executeStrategy } from '../controllers/strategy';
import { healthCheck } from '../controllers/health';
import { validateStrategyExecution } from '../middleware/validation';

const router = Router();

// 健康检查
router.get('/health', healthCheck);

// 策略执行
router.post('/strategies/execute', 
  authenticateToken,
  validateStrategyExecution,
  executeStrategy
);

// 策略状态更新
router.post('/strategies/status', 
  authenticateToken,
  async (req, res) => {
    // 处理策略状态更新
    res.json({ success: true });
  }
);

export default router; 