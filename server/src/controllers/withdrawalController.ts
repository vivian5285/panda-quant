import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { logger } from '../utils/logger';
import { WithdrawalService } from '../services/withdrawal.service';
import { Types } from 'mongoose';
import { IWithdrawal } from '../types/withdrawal';

export class WithdrawalController {
  private withdrawalService: WithdrawalService;

  constructor() {
    this.withdrawalService = new WithdrawalService();
  }

  public createWithdrawal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const withdrawalData: Partial<IWithdrawal> = {
        ...req.body,
        userId: new Types.ObjectId(req.user._id.toString())
      };
      const withdrawal = await this.withdrawalService.createWithdrawal(withdrawalData);
      res.status(201).json(withdrawal);
    } catch (error) {
      logger.error('Error creating withdrawal:', error);
      res.status(400).json({ message: 'Error creating withdrawal', error: (error as Error).message });
    }
  };

  public getWithdrawals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const withdrawals = await this.withdrawalService.getWithdrawals(req.user._id.toString());
      res.json(withdrawals);
    } catch (error) {
      logger.error('Error getting withdrawals:', error);
      res.status(500).json({ message: 'Error getting withdrawals', error });
    }
  };

  public getWithdrawal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const { id } = req.params;
      const withdrawal = await this.withdrawalService.getWithdrawal(id, req.user._id.toString());
      if (!withdrawal) {
        res.status(404).json({ message: 'Withdrawal not found' });
        return;
      }
      res.json(withdrawal);
    } catch (error) {
      logger.error('Error getting withdrawal:', error);
      res.status(500).json({ message: 'Error getting withdrawal', error });
    }
  };

  public updateWithdrawal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const withdrawal = await this.withdrawalService.updateWithdrawal(
        req.params['id'],
        req.user._id.toString(),
        req.body
      );
      if (!withdrawal) {
        res.status(404).json({ message: 'Withdrawal not found' });
        return;
      }
      res.json(withdrawal);
    } catch (error) {
      logger.error('Error updating withdrawal:', error);
      res.status(400).json({ message: 'Error updating withdrawal', error: (error as Error).message });
    }
  };

  public deleteWithdrawal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const withdrawal = await this.withdrawalService.deleteWithdrawal(
        req.params['id'],
        req.user._id.toString()
      );
      if (!withdrawal) {
        res.status(404).json({ message: 'Withdrawal not found' });
        return;
      }
      res.json({ message: 'Withdrawal deleted successfully' });
    } catch (error) {
      logger.error('Error deleting withdrawal:', error);
      res.status(400).json({ message: 'Error deleting withdrawal', error: (error as Error).message });
    }
  };
}

export default new WithdrawalController(); 