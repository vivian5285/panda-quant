import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { commonValidators } from '../middleware/validator';

const router = Router();

// 用户认证路由
router.post('/login', validateRequest([
  commonValidators.email,
  commonValidators.password
]));

router.post('/register', validateRequest([
  commonValidators.email,
  commonValidators.password,
  commonValidators.requiredString('username')
]));

// 需要认证的路由
router.use(authenticateToken);

// 用户信息路由
router.get('/profile', (req, res) => {
  res.success({ user: req.user });
});

router.put('/profile', validateRequest([
  commonValidators.optionalString('username'),
  commonValidators.optionalString('avatar')
]));

export default router; 