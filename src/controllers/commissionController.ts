import { Request, Response } from 'express';
import { CommissionService } from '../services/commissionService';
import { AuthRequest } from '../types';

export class CommissionController {
  private commissionService: CommissionService;

  constructor() {
    this.commissionService = CommissionService.getInstance();
  }

  public async createCommission(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { amount } = req.body;
      const commission = await this.commissionService.createCommissionRecord({
        userId: req.user._id,
        amount,
        type: 'commission',
        status: 'pending'
      });

      res.status(201).json(commission);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getCommissionHistory(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const history = await this.commissionService.getCommissionHistory(req.user._id);
      res.json(history);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getTotalCommission(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const total = await this.commissionService.getTotalCommission(req.user._id);
      res.json({ total });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async distributeCommission(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { amount } = req.body;
      await this.commissionService.distributeCommission(req.user._id, amount);
      res.json({ message: 'Commission distributed successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
} 