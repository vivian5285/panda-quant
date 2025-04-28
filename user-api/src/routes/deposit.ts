import { Router } from 'express';
import { auth } from '../middleware/auth';
import { createDeposit } from '../services/deposit';
import { Request, Response } from 'express';

const router = Router();

// 获取存款地址
router.get('/address', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { chain } = req.query;
    if (!chain || typeof chain !== 'string') {
      return res.status(400).json({ message: 'Invalid chain parameter' });
    }

    const deposit = await createDeposit(req.user);
    res.json({ address: deposit.address });
  } catch (error) {
    console.error('Get deposit address error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 创建存款记录
router.post('/record', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { chain, amount, transactionHash } = req.body;
    if (!chain || !amount || !transactionHash) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    res.status(201).json({ message: 'Deposit record created' });
  } catch (error) {
    console.error('Create deposit record error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 获取存款记录
router.get('/records', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json([]);
  } catch (error) {
    console.error('Get deposit records error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 