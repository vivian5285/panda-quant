import express from 'express';
import { VerificationController } from '../controllers/verification.controller';

const router = express.Router();
const verificationController = new VerificationController();

// 发送验证码
router.post('/send', verificationController.sendCode);

// 验证验证码
router.post('/verify', verificationController.verifyCode);

export default router; 