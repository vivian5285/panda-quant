import { Router } from 'express';
const router = Router();

// 获取用户信息
router.get('/profile', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 更新用户信息
router.put('/profile', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export default router; 