import { Router } from 'express';
const router = Router();

// 获取佣金列表
router.get('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 创建佣金记录
router.post('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export default router; 