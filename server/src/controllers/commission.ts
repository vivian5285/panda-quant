import { Request, Response } from 'express';
import { CommissionService } from '../services/commissionService';
import { AuthRequest, User } from '../types';

const commissionService = CommissionService.getInstance();

export const commissionController = {
  async getCommissions(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const commissions = await commissionService.getUserCommissions(req.user._id);
      res.json(commissions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  },

  async createCommission(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const commission = await commissionService.calculateAndDistributeCommission({
        ...req.body,
        userId: req.user._id
      });
      res.status(201).json(commission);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }
};

export class CommissionController {
  private commissionService: CommissionService;

  constructor() {
    this.commissionService = CommissionService.getInstance();
  }

  // 获取用户团队信息
  async getTeamInfo(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userId = req.user.id;
      const teamInfo = await this.commissionService.getTeamInfo(userId);
      res.json(teamInfo);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  // 获取用户佣金记录
  async getCommissionRecords(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userId = req.user.id;
      const { page = 1, limit = 10, type, status } = req.query;
      const records = await this.commissionService.getCommissionRecords(userId);
      res.json(records);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  // 获取所有用户的佣金统计（管理员）
  async getAllUserCommissions(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { page = 1, limit = 10, search } = req.query;
      const commissions = await this.commissionService.getUserCommissions(req.user.id);
      res.json(commissions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  // 获取佣金趋势数据（管理员）
  async getCommissionTrend(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const trend = await this.commissionService.getCommissionTrend(req.user.id);
      res.json(trend);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }
} 