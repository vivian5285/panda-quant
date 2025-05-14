import { Router } from 'express';
const router = Router();

// 获取提现列表
router.get('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 创建提现申请
router.post('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export default router; 