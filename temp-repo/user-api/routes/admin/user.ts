import express from 'express';
import { authenticateToken, isAdmin } from '../../middleware/auth';
import { getUsers } from '../../controllers/admin/userController';

const router = express.Router();

// 所有路由都需要管理员权限
router.use(authenticateToken, isAdmin);

// 获取用户列表
router.get('/', getUsers);

export default router; 