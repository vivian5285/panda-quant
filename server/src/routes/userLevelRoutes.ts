import { Router } from 'express';
import { userLevelController } from '../controllers/userLevelController';
import { auth, requireAdmin } from '../middleware/auth';

const router = Router();

// 所有路由都需要认证
router.use(auth);

// 获取所有用户等级 - 需要管理员或版主权限
router.get('/', requireAdmin, userLevelController.getAllLevels);

// 获取单个用户等级 - 需要管理员或版主权限
router.get('/:id', requireAdmin, userLevelController.getLevelById);

// 创建用户等级 - 需要管理员权限
router.post('/', requireAdmin, userLevelController.createLevel);

// 更新用户等级 - 需要管理员权限
router.put('/:id', requireAdmin, userLevelController.updateLevel);

// 删除用户等级 - 需要管理员权限
router.delete('/:id', requireAdmin, userLevelController.deleteLevel);

export default router; 