import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';
import { RequestHandler } from 'express';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/send-code', authController.sendVerificationCode as RequestHandler);
router.post('/register', authController.register as RequestHandler);
router.post('/login', authController.login as RequestHandler);
router.post('/verify-email', authController.verifyEmail as RequestHandler);
router.post('/resend-verification', authController.resendVerification as RequestHandler);
router.post('/forgot-password', authController.forgotPassword as RequestHandler);
router.post('/reset-password', authController.resetPassword as RequestHandler);

// Protected routes
router.get('/me', authenticate as RequestHandler, authController.getProfile as RequestHandler);
router.put('/me', authenticate as RequestHandler, authController.updateProfile as RequestHandler);
router.put('/change-password', authenticate as RequestHandler, authController.changePassword as RequestHandler);

export default router; 