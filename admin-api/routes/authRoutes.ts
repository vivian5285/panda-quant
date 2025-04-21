import express from 'express';
import {
  login,
  requestPasswordReset,
  resetPassword,
  updateUserProfile,
  logout
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 公开路由
router.post('/login', login);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// 需要认证的路由
router.post('/logout', authenticateToken, logout);
router.put('/profile', authenticateToken, updateUserProfile);

export default router; 