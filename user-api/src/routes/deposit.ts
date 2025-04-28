import { Router } from 'express';
import { depositController } from '../controllers/deposit.controller';
import { authenticateToken } from '../middlewares/auth';
import { AuthRequest } from '../types/auth';

const router = Router();

// 获取存款地址
router.get('/address', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { chain } = req.query;
    if (!chain || typeof chain !== 'string') {
      return res.status(400).json({ message: 'Invalid chain parameter' });
    }

    const deposit = await depositService.getDepositAddress(req.user.id, chain);
    res.json({ address: deposit });
  } catch (error) {
    console.error('Get deposit address error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 创建存款记录
router.post('/record', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { chain, amount, transactionHash } = req.body;
    if (!chain || !amount || !transactionHash) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const record = await depositService.createDepositRecord(req.user.id, chain, amount, transactionHash);
    res.status(201).json(record);
  } catch (error) {
    console.error('Create deposit record error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 获取存款记录
router.get('/records', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const records = await depositService.getDepositRecords(req.user.id);
    res.json(records);
  } catch (error) {
    console.error('Get deposit records error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', authenticateToken, (req: AuthRequest, res) => {
  depositController.createDeposit(req, res);
});

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  depositController.getDeposits(req, res);
});

router.get('/:id', authenticateToken, (req: AuthRequest, res) => {
  depositController.getDepositById(req, res);
});

router.put('/:id', authenticateToken, (req: AuthRequest, res) => {
  depositController.updateDeposit(req, res);
});

router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  depositController.deleteDeposit(req, res);
});

export default router; 