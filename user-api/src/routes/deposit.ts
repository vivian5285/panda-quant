import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateDepositRequest } from '../middleware/validate';
import { depositService } from '../services/deposit';
import { Request, Response } from 'express';
import { IUser } from '@shared/models/user';

const router = Router();

// 获取存款地址
router.get('/address', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    if (!user || !user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { chain } = req.query;
    if (!chain || typeof chain !== 'string') {
      return res.status(400).json({ message: 'Invalid chain parameter' });
    }

    const address = await depositService.getDepositAddress(user._id.toString(), chain);
    res.json({ address });
  } catch (error) {
    console.error('Get deposit address error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 创建存款记录
router.post('/record', authenticateToken, validateDepositRequest, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    if (!user || !user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { chain, amount, transactionHash } = req.body;
    const record = await depositService.createDepositRecord(
      user._id.toString(),
      chain,
      amount,
      transactionHash
    );
    res.status(201).json(record);
  } catch (error) {
    console.error('Create deposit record error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 获取存款记录
router.get('/records', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    if (!user || !user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const records = await depositService.getDepositRecords(user._id.toString());
    res.json(records);
  } catch (error) {
    console.error('Get deposit records error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 