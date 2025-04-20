import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateEmail, validatePassword } from '../utils/validation';
import { ValidationError } from '../utils/errors';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const router = Router();
const userController = new UserController();

// 注册路由
router.post('/register', userController.register.bind(userController));

// 登录路由
router.post('/login', userController.login.bind(userController));

// 验证邮箱路由
router.post('/verify-email', userController.verifyEmail.bind(userController));

// 获取用户信息
router.get('/profile', userController.getProfile.bind(userController));

// 更新用户信息
router.put('/profile', userController.updateProfile.bind(userController));

export default router; 