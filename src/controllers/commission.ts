import { Request, Response } from 'express';
import { User } from '../types/user';
import { CommissionService } from '../services/commissionService';
import { ICommission } from '../interfaces/ICommission';

export interface AuthRequest extends Request {
  user?: User;
}

export class CommissionController {
  private commissionService: CommissionService;

  constructor() {
    this.commissionService = new CommissionService();
  }

  async getUserCommissions(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const commissions = await this.commissionService.getUserCommissions(req.user._id);
      return res.json(commissions);
    } catch (error) {
      console.error('Error getting user commissions:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createCommission(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const commissionData: Partial<ICommission> = {
        ...req.body,
        userId: req.user._id
      };
      const commission = await this.commissionService.createCommission(commissionData);
      return res.status(201).json(commission);
    } catch (error) {
      console.error('Error creating commission:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAllUserCommissions(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const commissions = await this.commissionService.getAllUserCommissions(req.user._id);
      return res.json(commissions);
    } catch (error) {
      console.error('Error getting all user commissions:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 