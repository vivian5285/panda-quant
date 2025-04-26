import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { commonValidators } from '../middleware/validator';

const router = Router();

// 所有策略路由都需要认证
router.use(authenticateToken);

// 策略列表
router.get('/', (req, res) => {
  res.success({ strategies: [] });
});

// 创建策略
router.post('/', validateRequest([
  commonValidators.requiredString('name'),
  commonValidators.requiredString('description'),
  commonValidators.requiredString('code')
]));

// 更新策略
router.put('/:id', validateRequest([
  commonValidators.optionalString('name'),
  commonValidators.optionalString('description'),
  commonValidators.optionalString('code')
]));

// 删除策略
router.delete('/:id');

// 执行策略
router.post('/:id/execute', validateRequest([
  commonValidators.requiredString('parameters')
]));

// 获取策略执行结果
router.get('/:id/results');

export default router; 