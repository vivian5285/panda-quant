import express, { Router, Request, Response } from 'express';
import authController from '../controllers/AuthController';
import { authenticate } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../types/Auth';

const router: Router = express.Router();

// Public routes
router.post('/login', (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  authController.login(authReq, res);
});

router.post('/register', (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  authController.register(authReq, res);
});

// Protected routes
router.get('/profile', authenticate, (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  authController.getCurrentUser(authReq, res);
});

router.put('/profile', authenticate, (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  authController.updateUser(authReq, res);
});

export default router; 