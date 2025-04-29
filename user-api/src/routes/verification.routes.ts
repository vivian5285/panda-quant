import { Router } from 'express';
import { AuthRouter } from '../types/express';
import { VerificationController } from '../controllers/verification.controller';
import { RequestHandler } from 'express';

const router: AuthRouter = Router();
const verificationController = new VerificationController();

// 发送验证码
router.post('/send', verificationController.sendCode as RequestHandler);

// 验证验证码
router.post('/verify', verificationController.verifyCode as RequestHandler);

export default router; 