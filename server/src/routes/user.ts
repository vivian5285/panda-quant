import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { AuthenticatedRequest } from '../types/auth';
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();
const userController = new UserController();

// 公共路由
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.login(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.register(req, res);
  } catch (error) {
    next(error);
  }
});

// 需要认证的路由
router.use(authMiddleware);

router.post('/change-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.changePassword(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.getProfile(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

// 管理员路由
router.use(adminMiddleware);

router.get('/users', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await userController.getAllUsers(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await userController.getUserById(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/users', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await userController.register(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await userController.updateUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await userController.deleteUser(req, res);
  } catch (error) {
    next(error);
  }
});

export default router; 