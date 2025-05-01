import { Router, Request, Response, NextFunction } from 'express';
import { UserLevelController } from '../controllers/userLevelController';
import { authenticate, isAdmin } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();
const userLevelController = new UserLevelController();

// Admin routes
router.get('/admin/user-levels', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userLevelController.getAllLevels(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

router.post('/admin/user-levels', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userLevelController.createLevel(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

router.put('/admin/user-levels/:id', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userLevelController.updateLevel(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/admin/user-levels/:id', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userLevelController.deleteLevel(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

// User routes
router.get('/user-levels', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userLevelController.getUserLevel(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

router.get('/user-levels/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userLevelController.getUserLevel(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

export default router; 