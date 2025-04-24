import { Router } from 'express';
import { authenticateToken, isAdmin, hasPermission } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { commonValidators } from '../middleware/validator';

const router = Router();

// 所有管理员路由都需要认证和管理员权限
router.use(authenticateToken, isAdmin);

// 用户管理
router.get('/users', hasPermission('users:read'));
router.post('/users', validateRequest([
  commonValidators.email,
  commonValidators.password,
  commonValidators.requiredString('username'),
  commonValidators.requiredString('role')
]), hasPermission('users:create'));

router.put('/users/:id', validateRequest([
  commonValidators.optionalString('username'),
  commonValidators.optionalString('role')
]), hasPermission('users:update'));

router.delete('/users/:id', hasPermission('users:delete'));

// 策略管理
router.get('/strategies', hasPermission('strategies:read'));
router.post('/strategies', validateRequest([
  commonValidators.requiredString('name'),
  commonValidators.requiredString('description')
]), hasPermission('strategies:create'));

router.put('/strategies/:id', validateRequest([
  commonValidators.optionalString('name'),
  commonValidators.optionalString('description')
]), hasPermission('strategies:update'));

router.delete('/strategies/:id', hasPermission('strategies:delete'));

export default router; 