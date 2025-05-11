import express, { Router, Request, Response } from 'express';
import { StrategyController } from '../controllers/StrategyController';
import { authenticate } from '../middleware/AuthMiddleware';
import { validateRequest, validateParams } from '../validations/Common';
import { createStrategySchema, updateStrategySchema, strategyIdSchema } from '../validations/schemas/Strategy';
import Joi from 'joi';

const router = Router();
const strategyController = new StrategyController();

// 创建策略
router.post('/', 
  authenticate, 
  validateRequest(createStrategySchema), 
  strategyController.createStrategy.bind(strategyController)
);

// 获取单个策略
router.get('/:id', 
  authenticate, 
  validateParams(strategyIdSchema), 
  strategyController.getStrategy.bind(strategyController)
);

// 更新策略
router.put('/:id', 
  authenticate, 
  validateParams(strategyIdSchema),
  validateRequest(updateStrategySchema), 
  strategyController.updateStrategy.bind(strategyController)
);

// 删除策略
router.delete('/:id', 
  authenticate, 
  validateParams(strategyIdSchema), 
  strategyController.deleteStrategy.bind(strategyController)
);

// 获取所有策略
router.get('/', 
  authenticate, 
  strategyController.getAllStrategies.bind(strategyController)
);

// 启动策略
router.post('/:id/start', 
  authenticate, 
  validateParams(strategyIdSchema), 
  strategyController.startStrategy.bind(strategyController)
);

// 停止策略
router.post('/:id/stop', 
  authenticate, 
  validateParams(strategyIdSchema), 
  strategyController.stopStrategy.bind(strategyController)
);

// 暂停策略
router.post('/:id/pause', 
  authenticate, 
  validateParams(strategyIdSchema), 
  strategyController.pauseStrategy.bind(strategyController)
);

// 恢复策略
router.post('/:id/resume', 
  authenticate, 
  validateParams(strategyIdSchema), 
  strategyController.resumeStrategy.bind(strategyController)
);

// 获取用户的策略
router.get('/user/:userId', 
  authenticate, 
  validateParams(Joi.object({
    userId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/)
  })), 
  strategyController.getStrategiesByUser.bind(strategyController)
);

// 获取活跃策略
router.get('/active/all', 
  authenticate, 
  strategyController.getActiveStrategies.bind(strategyController)
);

// 获取热门策略
router.get('/popular', 
  authenticate, 
  strategyController.getPopularStrategies.bind(strategyController)
);

export default router; 