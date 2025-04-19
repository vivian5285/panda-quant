import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();
const authController = new AuthController();

// 注册
router.post('/register', authController.register);

// 登录
router.post('/login', authController.login);

// 获取用户信息（需要认证）
router.get('/profile', authenticate, authController.getProfile);

export default router; 