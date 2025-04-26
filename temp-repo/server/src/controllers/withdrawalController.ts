import { Request, Response } from 'express';
import { withdrawalService } from '../services/withdrawalService';
import { validateObjectId } from '../middleware/validation';

export const withdrawalController = {
  async createWithdrawal(req: Request, res: Response) {
    try {
      const { amount, paymentMethod, paymentDetails } = req.body;
      const userId = req.user._id;

      await withdrawalService.createWithdrawalRequest(
        userId,
        amount,
        paymentMethod,
        paymentDetails
      );

      res.status(201).json({ message: 'Withdrawal request created successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
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