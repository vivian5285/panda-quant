import { Response } from 'express';
import { WithdrawalService } from '../services/WithdrawalService';
import { handleError } from '../utils/errorHandler';
import { AuthenticatedRequest } from '../types/express';
import { IWithdrawal } from '../types/Withdrawal';

const withdrawalService = WithdrawalService.getInstance();

export class WithdrawalController {
  async createWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const withdrawalData: Omit<IWithdrawal, '_id' | 'createdAt' | 'updatedAt'> = {
        userId: req.user._id,
        amount: req.body.amount,
        currency: req.body.currency,
        status: req.body.status || 'pending',
        network: req.body.network,
        address: req.body.address,
        transactionId: req.body.transactionId
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

      const withdrawals = await withdrawalService.getWithdrawalsByUserId(req.user._id.toString());
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