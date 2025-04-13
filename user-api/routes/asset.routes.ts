import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getAssetSummary,
  getChainAddresses,
  createDeposit,
  confirmDeposit,
  updateUserProfit
} from '../controllers/asset.controller';

const router = express.Router();

// 获取资产概览
router.get('/summary', authenticateToken, getAssetSummary);

// 获取链地址
router.get('/chain-addresses', authenticateToken, getChainAddresses);

// 创建充值记录
router.post('/deposit', authenticateToken, createDeposit);

// 确认充值
router.post('/deposit/:paymentId/confirm', authenticateToken, confirmDeposit);

// 更新用户收益
router.post('/profit/:userId', authenticateToken, updateUserProfit);

export default router; 