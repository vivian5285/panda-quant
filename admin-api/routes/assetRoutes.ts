import express from 'express';
import { getAssetSummary, getDepositHistory, getFeeHistory, confirmDeposit } from '../controllers/assetController';

const router = express.Router();

// 获取资产概览
router.get('/summary/:userId', getAssetSummary);

// 获取充值记录
router.get('/deposits/:userId', getDepositHistory);

// 获取托管费记录
router.get('/fees/:userId', getFeeHistory);

// 确认充值
router.post('/deposits/:userId/confirm', confirmDeposit);

export default router; 