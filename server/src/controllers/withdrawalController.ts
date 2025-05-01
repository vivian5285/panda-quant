import { Response } from 'express';
import { WithdrawalService } from '../services/WithdrawalService';
import { handleError } from '../utils/errorHandler';
import { AuthenticatedRequest } from '../types/auth';

const withdrawalService = WithdrawalService.getInstance();

export class WithdrawalController {
  async createWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const withdrawalData = {
        userId: req.user._id,
        amount: req.body.amount,
        walletAddress: req.body.walletAddress,
        paymentMethod: req.body.paymentMethod,
        paymentDetails: req.body.paymentDetails,
        status: req.body.status,
        metadata: req.body.metadata
      };

      const withdrawal = await withdrawalService.createWithdrawal(withdrawalData);
      res.status(201).json(withdrawal);
    } catch (error) {
      handleError(res, error);
    }
  }

  async getWithdrawals(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const withdrawals = await withdrawalService.getWithdrawals(req.user._id);
      res.json(withdrawals);
    } catch (error) {
      handleError(res, error);
    }
  }

  async getWithdrawalById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const withdrawal = await withdrawalService.getWithdrawalById(id);
      if (!withdrawal) {
        res.status(404).json({ message: 'Withdrawal not found' });
        return;
      }
      res.json(withdrawal);
    } catch (error) {
      handleError(res, error);
    }
  }

  async updateWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const withdrawal = await withdrawalService.updateWithdrawal(id, req.body);
      if (!withdrawal) {
        res.status(404).json({ message: 'Withdrawal not found' });
        return;
      }
      res.json(withdrawal);
    } catch (error) {
      handleError(res, error);
    }
  }

  async deleteWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await withdrawalService.deleteWithdrawal(id);
      if (!success) {
        res.status(404).json({ message: 'Withdrawal not found' });
        return;
      }
      res.json({ message: 'Withdrawal deleted successfully' });
    } catch (error) {
      handleError(res, error);
    }
  }
} 