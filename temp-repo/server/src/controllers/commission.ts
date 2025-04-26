import { Request, Response } from 'express';
import { CommissionService } from '../services/commission';

export class CommissionController {
  private commissionService: CommissionService;

  constructor() {
    this.commissionService = new CommissionService();
  }

  // 获取用户团队信息
  async getTeamInfo(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const teamInfo = await this.commissionService.getTeamInfo(userId);
      res.json(teamInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取用户佣金记录
  async getCommissionRecords(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, type, status } = req.query;
      const records = await this.commissionService.getCommissionRecords(
        userId,
        Number(page),
        Number(limit),
        type as string,
        status as string
      );
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取所有用户的佣金统计（管理员）
  async getAllUserCommissions(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const commissions = await this.commissionService.getAllUserCommissions(
        Number(page),
        Number(limit),
        search as string
      );
      res.json(commissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取佣金趋势数据（管理员）
  async getCommissionTrend(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const trend = await this.commissionService.getCommissionTrend(
        startDate as string,
        endDate as string
      );
      res.json(trend);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 