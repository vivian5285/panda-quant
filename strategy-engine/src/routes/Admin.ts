import { Router } from 'express';
const router = Router();

// 获取系统状态
router.get('/status', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 获取用户列表
router.get('/users', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export default router; 