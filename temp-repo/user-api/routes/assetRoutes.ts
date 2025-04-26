import express from 'express';
import { authenticateToken } from '../../shared/middleware/auth';
import { getAssetSummary, createDeposit, getChainInfo } from '../controllers/assetController';

const router = express.Router();

// 资产相关路由
router.get('/summary', authenticateToken, getAssetSummary);

// 支付相关路由
router.get('/payment/chains', authenticateToken, getChainInfo);
router.post('/payment/create', authenticateToken, createDeposit);

export default router; 