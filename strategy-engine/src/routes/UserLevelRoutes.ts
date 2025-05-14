import { Router } from 'express';
const router = Router();

// 获取用户等级列表
router.get('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 创建用户等级
router.post('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export default router; 