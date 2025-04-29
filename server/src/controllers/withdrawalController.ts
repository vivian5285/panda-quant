import { Request, Response } from 'express';
import { WithdrawalService } from '../services/withdrawalService';
import { Types } from 'mongoose';
import { IUser } from '../interfaces/IUser';
import { validateObjectId } from '../middleware/validation';
import { AuthRequest } from '../types';

export const withdrawalController = {
  async createWithdrawal(req: Request & { user?: IUser }, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { amount, paymentMethod, paymentDetails } = req.body;
      const withdrawal = await WithdrawalService.getInstance().createWithdrawalRequest(
        new Types.ObjectId(req.user._id),
        amount,
        paymentMethod,
        paymentDetails
      );

      res.status(201).json(withdrawal);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async getWithdrawals(req: Request & { user?: IUser }, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const withdrawals = await WithdrawalService.getInstance().getWithdrawals(
        new Types.ObjectId(req.user._id)
      );
      res.json(withdrawals);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
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

  async updateWithdrawalStatus(req: Request & { user?: IUser }, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { withdrawalId, status } = req.body;
      const withdrawal = await WithdrawalService.getInstance().updateWithdrawalStatus(
        new Types.ObjectId(withdrawalId),
        status
      );

      res.json(withdrawal);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
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

  async getWithdrawalHistory(req: Request & { user?: IUser }, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const history = await WithdrawalService.getInstance().getWithdrawalHistory(
        new Types.ObjectId(req.user._id)
      );

      res.json(history);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async processWithdrawal(req: Request, res: Response) {
    try {
      const { withdrawalId, status, adminComment } = req.body;
      const withdrawal = await WithdrawalService.getInstance().processWithdrawal(
        new Types.ObjectId(withdrawalId),
        status,
        adminComment
      );

      res.json(withdrawal);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async completeWithdrawal(req: Request, res: Response) {
    try {
      const { withdrawalId } = req.body;
      const withdrawal = await WithdrawalService.getInstance().completeWithdrawal(
        new Types.ObjectId(withdrawalId)
      );

      res.json(withdrawal);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async getPendingWithdrawals(req: Request, res: Response) {
    try {
      const withdrawals = await WithdrawalService.getInstance().getPendingWithdrawals();
      res.json(withdrawals);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async getWithdrawalStats(req: Request & { user?: IUser }, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const stats = await WithdrawalService.getInstance().getWithdrawalStats(
        new Types.ObjectId(req.user._id)
      );

      res.json(stats);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }
}; 