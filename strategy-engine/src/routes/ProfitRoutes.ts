import { Router } from 'express';
const router = Router();

// 获取收益列表
router.get('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 获取收益统计
router.get('/stats', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export default router; 