import { Router } from 'express';
const router = Router();

// 获取结算列表
router.get('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 创建结算记录
router.post('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export default router; 