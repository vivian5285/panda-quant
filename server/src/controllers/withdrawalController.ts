import { Request, Response } from 'express';
import { WithdrawalService } from '../services/withdrawalService';
import { Types } from 'mongoose';
import { User } from '../models/User';
import { validateObjectId } from '../middleware/validation';
import { AuthRequest } from '../types';

const withdrawalService = new WithdrawalService();

export const withdrawalController = {
  async createWithdrawal(req: Request & { user?: User }, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { amount, address } = req.body;
      const withdrawal = await withdrawalService.createWithdrawal({
        userId: req.user._id,
        amount,
        address
      });

      res.status(201).json(withdrawal);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async getWithdrawals(req: Request & { user?: User }, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const withdrawals = await withdrawalService.getWithdrawals(req.user._id);
      res.json(withdrawals);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async getWithdrawal(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      res.json({});
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  },

  async updateWithdrawalStatus(req: Request & { user?: User }, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { withdrawalId, status } = req.body;
      const withdrawal = await withdrawalService.updateWithdrawalStatus(
        withdrawalId,
        status
      );

      res.json(withdrawal);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async deleteWithdrawal(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  },

  async getWithdrawalHistory(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const history = await withdrawalService.getWithdrawalHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async processWithdrawal(req: Request, res: Response) {
    try {
      const { withdrawalId } = req.params;
      const { status, notes } = req.body;

      if (!validateObjectId(withdrawalId)) {
        return res.status(400).json({ error: 'Invalid withdrawal ID' });
      }

      await withdrawalService.processWithdrawal(withdrawalId, status, notes);
      res.json({ message: 'Withdrawal request processed successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async completeWithdrawal(req: Request, res: Response) {
    try {
      const { withdrawalId } = req.params;

      if (!validateObjectId(withdrawalId)) {
        return res.status(400).json({ error: 'Invalid withdrawal ID' });
      }

      await withdrawalService.completeWithdrawal(withdrawalId);
      res.json({ message: 'Withdrawal completed successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getPendingWithdrawals(req: Request, res: Response) {
    try {
      const withdrawals = await withdrawalService.getPendingWithdrawals();
      res.json(withdrawals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getWithdrawalStats(req: Request, res: Response) {
    try {
      const stats = await withdrawalService.getWithdrawalStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}; 