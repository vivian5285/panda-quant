import { Router, Request, Response } from 'express';
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

// 注册路由
router.post('/register', (req: Request, res: Response) => UserController.register(req, res));

// 登录路由
router.post('/login', (req: Request, res: Response) => UserController.login(req, res));

// 验证邮箱路由
router.post('/verify-email', (req: Request, res: Response) => UserController.verifyEmail(req, res));

router.get('/profile', (req: Request, res: Response) => UserController.getProfile(req, res));

router.put('/profile', (req: Request, res: Response) => UserController.updateProfile(req, res));

export default router; 