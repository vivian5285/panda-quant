import express, { Router } from 'express';
import authController from '../controllers/AuthController';
import { authenticate } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.get('/profile', authenticate, authController.getCurrentUser);
router.put('/profile', authenticate, authController.updateUser);

export default router; 