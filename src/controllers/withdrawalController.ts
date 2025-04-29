import { Request, Response } from 'express';
import { WithdrawalService } from '../services/withdrawalService';
import { AuthRequest } from '../types';

export class WithdrawalController {
  private withdrawalService: WithdrawalService;

  constructor() {
    this.withdrawalService = WithdrawalService.getInstance();
  }

  public async createWithdrawal(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { amount } = req.body;
      const withdrawal = await this.withdrawalService.createWithdrawal({
        userId: req.user._id,
        amount,
        status: 'pending'
      });

      res.status(201).json(withdrawal);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getWithdrawalById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const withdrawal = await this.withdrawalService.getWithdrawalById(req.params.id);
      if (!withdrawal) {
        return res.status(404).json({ error: 'Withdrawal not found' });
      }

      res.json(withdrawal);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getWithdrawalsByUserId(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const withdrawals = await this.withdrawalService.getWithdrawalsByUserId(req.user._id);
      res.json(withdrawals);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async updateWithdrawalStatus(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { status } = req.body;
      const withdrawal = await this.withdrawalService.updateWithdrawalStatus(req.params.id, status);
      if (!withdrawal) {
        return res.status(404).json({ error: 'Withdrawal not found' });
      }

      res.json(withdrawal);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async deleteWithdrawal(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const withdrawal = await this.withdrawalService.deleteWithdrawal(req.params.id);
      if (!withdrawal) {
        return res.status(404).json({ error: 'Withdrawal not found' });
      }

      res.json({ message: 'Withdrawal deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
} 