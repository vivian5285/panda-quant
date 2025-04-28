import { Router } from 'express';
import { AuthRouter } from '../types/express';
import { verifyEmail, resetPassword } from '../controllers/verification.controller';

const router: AuthRouter = Router();

// 发送验证码
router.post('/send', verificationController.sendCode);

// 验证验证码
router.post('/verify', verificationController.verifyCode);

router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);

export default router; 