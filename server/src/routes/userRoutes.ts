import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { UserController } from '../controllers/userController';
import { authenticate, isAdmin } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const userController = new UserController();

// 包装异步请求处理函数，增加错误处理
const handleRequest = <
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
>(
  handler: (req: AuthenticatedRequest & Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>) => Promise<void>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return async (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' } as ResBody);
        return;
      }
      await handler(req as AuthenticatedRequest & Request<P, ResBody, ReqBody, ReqQuery>, res);
    } catch (error) {
      next(error);
    }
  };
};

// 应用认证中间件
router.use(authMiddleware);

// Admin routes
router.get('/admin/users', authenticate, isAdmin, handleRequest((req, res) => userController.getAllUsers(req, res)));
router.get('/admin/users/:id', authenticate, isAdmin, handleRequest((req, res) => userController.getUserById(req, res)));
router.post('/admin/users', authenticate, isAdmin, handleRequest((req, res) => userController.register(req, res)));
router.put('/admin/users/:id', authenticate, isAdmin, handleRequest((req, res) => userController.updateUser(req, res)));
router.delete('/admin/users/:id', authenticate, isAdmin, handleRequest((req, res) => userController.deleteUser(req, res)));

// User routes
router.get('/profile', handleRequest(async (req, res) => {
  await userController.getProfile(req, res);
}));

router.put('/profile', handleRequest(async (req, res) => {
  await userController.updateProfile(req, res);
}));

router.delete('/me', handleRequest((req, res) => userController.deleteUser(req, res)));

export default router;