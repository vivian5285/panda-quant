import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { WithdrawalService } from '../services/WithdrawalService';
import { handleError } from '../utils/errorHandler';
import { AuthenticatedRequest } from '../types/Auth';
import { IWithdrawal } from '../types/Withdrawal';

export class WithdrawalController {
  private withdrawalService: WithdrawalService;

  constructor() {
    this.withdrawalService = WithdrawalService.getInstance();
  }

  async createWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const withdrawalData: Omit<IWithdrawal, '_id' | 'createdAt' | 'updatedAt'> = {
        userId: new Types.ObjectId(req.user._id.toString()),
        amount: req.body.amount,
        currency: req.body.currency,
        status: req.body.status || 'pending',
        network: req.body.network,
        address: req.body.address,
        transactionId: req.body.transactionId
      };

      const withdrawal = await this.withdrawalService.createWithdrawal(withdrawalData);
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

      const withdrawals = await this.withdrawalService.getWithdrawalsByUserId(req.user._id.toString());
      res.json(withdrawals);
    } catch (error) {
      handleError(res, error);
    }
  }

  async getWithdrawalById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const withdrawal = await this.withdrawalService.getWithdrawalById(id);
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
      const withdrawal = await this.withdrawalService.updateWithdrawal(id, req.body);
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
      const success = await this.withdrawalService.deleteWithdrawal(id);
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