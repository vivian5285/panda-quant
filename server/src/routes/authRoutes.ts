import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import authController from '../controllers/authController';

const router = Router();

// 注册
router.post('/register', authController.register);

// 登录
router.post('/login', authController.login);

// 获取当前用户信息
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router; 