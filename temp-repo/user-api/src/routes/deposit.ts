import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { DepositService } from '../services/deposit';
import { validateRequest } from '../middleware/validate';
import { z } from 'zod';

const router = Router();
const depositService = new DepositService();

// 获取充值地址
const getDepositAddressSchema = z.object({
  chain: z.enum(['OP', 'MATIC', 'TRX', 'BSC', 'ARB'])
});

router.get('/getDepositAddress', 
  authenticateToken,
  validateRequest({ query: getDepositAddressSchema }),
  async (req, res) => {
    try {
      const { chain } = req.query;
      const address = await depositService.getDepositAddress(req.user.id, chain as string);
      res.json({ address });
    } catch (error) {
      res.status(500).json({ error: '获取充值地址失败' });
    }
  }
);

// 检查充值状态
const checkDepositStatusSchema = z.object({
  transactionHash: z.string(),
  chain: z.enum(['OP', 'MATIC', 'TRX', 'BSC', 'ARB'])
});

router.get('/checkDepositStatus',
  authenticateToken,
  validateRequest({ query: checkDepositStatusSchema }),
  async (req, res) => {
    try {
      const { transactionHash, chain } = req.query;
      const status = await depositService.checkDepositStatus(
        req.user.id,
        transactionHash as string,
        chain as string
      );
      res.json({ status });
    } catch (error) {
      res.status(500).json({ error: '检查充值状态失败' });
    }
  }
);

// 获取充值历史
router.get('/getDepositHistory',
  authenticateToken,
  async (req, res) => {
    try {
      const history = await depositService.getDepositHistory(req.user.id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: '获取充值历史失败' });
    }
  }
);

export default router; 