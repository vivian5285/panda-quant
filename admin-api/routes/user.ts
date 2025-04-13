import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import {
  getUsers,
  updateUserStatus,
  rewardUser
} from '../controllers/userController';

const router = express.Router();

// 所有路由都需要管理员权限
router.use(authenticateToken, isAdmin);

// 获取用户列表
router.get('/', getUsers);

// 更新用户状态
router.put('/:id/status', updateUserStatus);

// 发放奖励
router.post('/:id/reward', rewardUser);

export default router; 