import { Router } from 'express';
const router = Router();

// 登录
router.post('/login', async (req, res) => {
  // TODO: 实现登录逻辑
  res.status(501).json({ message: 'Not implemented' });
});

// 注册
router.post('/register', async (req, res) => {
  // TODO: 实现注册逻辑
  res.status(501).json({ message: 'Not implemented' });
});

// 刷新token
router.post('/refresh-token', async (req, res) => {
  // TODO: 实现token刷新逻辑
  res.status(501).json({ message: 'Not implemented' });
});

export default router; 