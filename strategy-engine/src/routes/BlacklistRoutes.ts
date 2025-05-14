import { Router } from 'express';
const router = Router();

// 获取黑名单列表
router.get('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 添加黑名单
router.post('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export default router; 