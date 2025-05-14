import { Router } from 'express';
const router = Router();

// 获取策略列表
router.get('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 创建策略
router.post('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 获取策略详情
router.get('/:id', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 更新策略
router.put('/:id', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// 删除策略
router.delete('/:id', async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export default router; 