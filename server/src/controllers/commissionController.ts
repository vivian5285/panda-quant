import { Request, Response } from 'express';
import { CommissionRule } from '../models/commissionRule';
import { CommissionRecord } from '../models/commissionRecord';
import { commissionService } from '../services/commissionService';
import { validateObjectId } from '../middleware/validation';
import { CommissionService } from '../services/commissionService';
import { AuthRequest } from '../types';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';
import { Error as MongooseError } from 'mongoose';

const commissionServiceInstance = new CommissionService();

export const commissionController = {
  // Commission Rules
  async createRule(req: Request, res: Response) {
    try {
      const rule = new CommissionRule(req.body);
      await rule.save();
      res.status(201).json(rule);
    } catch (error: unknown) {
      if (error instanceof MongooseError.ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getRules(req: Request, res: Response) {
    try {
      const rules = await CommissionRule.find();
      res.json(rules);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getRuleById(req: Request, res: Response) {
    try {
      const rule = await CommissionRule.findById(req.params.id);
      if (!rule) {
        return res.status(404).json({ error: 'Rule not found' });
      }
      res.json(rule);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateRule(req: Request, res: Response) {
    try {
      const rule = await CommissionRule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!rule) {
        return res.status(404).json({ error: 'Rule not found' });
      }
      res.json(rule);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async deleteRule(req: Request, res: Response) {
    try {
      const rule = await CommissionRule.findByIdAndDelete(req.params.id);
      if (!rule) {
        return res.status(404).json({ error: 'Rule not found' });
      }
      res.json({ message: 'Rule deleted successfully' });
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Commission Records
  async getCommissionHistory(req: Request, res: Response) {
    try {
      const history = await commissionService.getCommissionHistory(req.params.userId);
      res.json(history);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getTotalCommission(req: Request, res: Response) {
    try {
      const total = await commissionService.getTotalCommission(req.params.userId);
      res.json({ total });
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async distributeCommission(req: Request, res: Response) {
    try {
      const commission = await commissionService.distributeCommission(req.params.id);
      res.json(commission);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * 获取用户的佣金记录
   */
  async getCommissions(req: AuthRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const commissions = await commissionService.getUserCommissions(req.user._id.toString());
      res.json(commissions);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * 获取用户的佣金统计
   */
  async getUserCommissionStats(req: Request, res: Response) {
    try {
      const stats = await commissionService.getUserCommissionStats(req.params.userId);
      res.json(stats);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * 管理员获取所有佣金记录
   */
  async getAllCommissions(req: Request, res: Response) {
    try {
      const commissions = await CommissionRecord.find()
        .populate('userId', 'username')
        .populate('fromUserId', 'username')
        .sort({ createdAt: -1 });
      res.json(commissions);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * 管理员更新佣金状态
   */
  async updateCommissionStatus(req: Request, res: Response) {
    try {
      const commission = await CommissionRecord.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!commission) {
        return res.status(404).json({ error: 'Commission not found' });
      }
      res.json(commission);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * 获取佣金统计
   */
  async getCommissionStats(req: Request, res: Response) {
    try {
      const stats = await CommissionRecord.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            pending: {
              $sum: {
                $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0]
              }
            },
            paid: {
              $sum: {
                $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0]
              }
            }
          }
        }
      ]);
      res.json(stats[0] || { total: 0, pending: 0, paid: 0 });
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * 获取佣金分布统计
   */
  async getCommissionDistribution(req: Request, res: Response) {
    try {
      const distribution = await CommissionRecord.aggregate([
        {
          $group: {
            _id: '$level',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);
      res.json(distribution);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * 获取用户佣金排行
   */
  async getCommissionRanking(req: Request, res: Response) {
    try {
      const ranking = await CommissionRecord.aggregate([
        {
          $group: {
            _id: '$userId',
            total: { $sum: '$amount' }
          }
        },
        { $sort: { total: -1 } },
        { $limit: 10 }
      ]);
      res.json(ranking);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async createCommission(req: AuthRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const commission = await commissionService.createCommission({
        ...req.body,
        userId: req.user._id
      });
      res.status(201).json(commission);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getTeamInfo(req: AuthRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const teamInfo = await commissionService.getTeamInfo(req.user._id.toString());
      res.json(teamInfo);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getCommissionRecords(req: AuthRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const records = await commissionService.getCommissionRecords(req.user._id.toString());
      res.json(records);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getCommissionTrend(req: AuthRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const trend = await commissionService.getCommissionTrend(req.user._id.toString());
      res.json(trend);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getCommission(req: Request, res: Response) {
    try {
      const commission = await commissionService.getCommission(req.params.userId);
      res.json(commission);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateCommission(req: Request, res: Response) {
    try {
      const commission = await commissionService.updateCommission(
        req.params.userId,
        req.body.rate
      );
      res.json(commission);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}; 