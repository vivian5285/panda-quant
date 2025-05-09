import express from 'express';
import { StrategyController } from '../controllers/StrategyController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, validateParams } from '../validations/common';
import { createStrategySchema, updateStrategySchema, strategyIdSchema } from '../validations/schemas/strategy';
import Joi from 'joi';

const router = express.Router();
const strategyController = new StrategyController();

// 创建策略
router.post('/', 
  authenticateToken, 
  validateRequest(createStrategySchema), 
  strategyController.createStrategy.bind(strategyController)
);

// 获取单个策略
router.get('/:id', 
  authenticateToken, 
  validateParams(strategyIdSchema), 
  strategyController.getStrategy.bind(strategyController)
);

// 更新策略
router.put('/:id', 
  authenticateToken, 
  validateParams(strategyIdSchema),
  validateRequest(updateStrategySchema), 
  strategyController.updateStrategy.bind(strategyController)
);

// 删除策略
router.delete('/:id', 
  authenticateToken, 
  validateParams(strategyIdSchema), 
  strategyController.deleteStrategy.bind(strategyController)
);

// 获取所有策略
router.get('/', 
  authenticateToken, 
  strategyController.getAllStrategies.bind(strategyController)
);

// 启动策略
router.post('/:id/start', 
  authenticateToken, 
  validateParams(strategyIdSchema), 
  strategyController.startStrategy.bind(strategyController)
);

// 停止策略
router.post('/:id/stop', 
  authenticateToken, 
  validateParams(strategyIdSchema), 
  strategyController.stopStrategy.bind(strategyController)
);

// 暂停策略
router.post('/:id/pause', 
  authenticateToken, 
  validateParams(strategyIdSchema), 
  strategyController.pauseStrategy.bind(strategyController)
);

// 恢复策略
router.post('/:id/resume', 
  authenticateToken, 
  validateParams(strategyIdSchema), 
  strategyController.resumeStrategy.bind(strategyController)
);

// 获取用户的策略
router.get('/user/:userId', 
  authenticateToken, 
  validateParams(Joi.object({
    userId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/)
  })), 
  strategyController.getStrategiesByUser.bind(strategyController)
);

// 获取活跃策略
router.get('/active/all', 
  authenticateToken, 
  strategyController.getActiveStrategies.bind(strategyController)
);

// 获取热门策略
router.get('/popular', 
  authenticateToken, 
  strategyController.getPopularStrategies.bind(strategyController)
);

export default router; 