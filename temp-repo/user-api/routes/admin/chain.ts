import express from 'express';
import { authenticateToken, isAdmin } from '../../middleware/auth';
import {
  getChains,
  createChain,
  updateChain,
  deleteChain
} from '../../controllers/chain.controller';

const router = express.Router();

// 所有路由都需要管理员权限
router.use(authenticateToken, isAdmin);

// 获取所有链
router.get('/', getChains);

// 创建新链
router.post('/', createChain);

// 更新链
router.put('/:id', updateChain);

// 删除链
router.delete('/:id', deleteChain);

export default router; 