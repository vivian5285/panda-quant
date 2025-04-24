import express from 'express';
import { SettlementService } from '../services/settlement';
import { auth } from '../middleware/auth';

const router = express.Router();
const settlementService = new SettlementService();

// 获取结算列表
router.get('/', auth, async (req, res) => {
  try {
    const settlements = await settlementService.getSettlements(req.query);
    res.json(settlements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get settlements' });
  }
});

// 获取结算详情
router.get('/:id', auth, async (req, res) => {
  try {
    const settlement = await settlementService.getSettlementDetails(req.params.id);
    res.json(settlement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get settlement details' });
  }
});

// 更新结算状态
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    await settlementService.updateSettlementStatus(req.params.id, status);
    res.json({ message: 'Settlement status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settlement status' });
  }
});

// 导出结算数据
router.get('/export', auth, async (req, res) => {
  try {
    const csvData = await settlementService.exportSettlements(req.query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=settlements.csv');
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export settlements' });
  }
});

// 生成结算记录
router.post('/generate', auth, async (req, res) => {
  try {
    await settlementService.generateSettlements();
    res.json({ message: 'Settlements generated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate settlements' });
  }
});

// 处理结算支付
router.post('/:id/process', auth, async (req, res) => {
  try {
    await settlementService.processPayment(req.params.id);
    res.json({ message: 'Payment processed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

export default router; 