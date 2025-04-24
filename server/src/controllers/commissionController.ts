import { Request, Response } from 'express';
import { CommissionRule } from '../models/commissionRule';
import { CommissionRecord } from '../models/commissionRecord';
import { commissionService } from '../services/commissionService';
import { validateObjectId } from '../middleware/validation';
import { CommissionService } from '../services/commissionService';

const commissionServiceInstance = new CommissionService();

export const commissionController = {
  // Commission Rules
  async createRule(req: Request, res: Response) {
    try {
      const rule = new CommissionRule(req.body);
      await rule.save();
      res.status(201).json(rule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getRules(req: Request, res: Response) {
    try {
      const rules = await CommissionRule.find();
      res.json(rules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getRuleById(req: Request, res: Response) {
    try {
      const rule = await CommissionRule.findById(req.params.id);
      if (!rule) {
        return res.status(404).json({ error: 'Commission rule not found' });
      }
      res.json(rule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateRule(req: Request, res: Response) {
    try {
      const rule = await CommissionRule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!rule) {
        return res.status(404).json({ error: 'Commission rule not found' });
      }
      res.json(rule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteRule(req: Request, res: Response) {
    try {
      const rule = await CommissionRule.findByIdAndDelete(req.params.id);
      if (!rule) {
        return res.status(404).json({ error: 'Commission rule not found' });
      }
      res.json({ message: 'Commission rule deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Commission Records
  async getCommissionHistory(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      if (!validateObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const records = await commissionService.getCommissionHistory(
        userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTotalCommission(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      if (!validateObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const total = await commissionService.getTotalCommission(
        userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async distributeCommission(req: Request, res: Response) {
    try {
      const { recordId } = req.params;

      if (!validateObjectId(recordId)) {
        return res.status(400).json({ error: 'Invalid record ID' });
      }

      await commissionService.distributeCommission(recordId);
      res.json({ message: 'Commission distributed successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * 获取用户的佣金记录
   */
  async getUserCommissions(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const { startDate, endDate, status } = req.query;

      const commissions = await commissionServiceInstance.getUserCommissions(userId, {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        status: status as 'pending' | 'paid'
      });

      res.json(commissions);
    } catch (error) {
      res.status(500).json({ message: '获取佣金记录失败', error });
    }
  },

  /**
   * 获取用户的佣金统计
   */
  async getUserCommissionStats(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const stats = await commissionServiceInstance.getUserCommissionStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: '获取佣金统计失败', error });
    }
  },

  /**
   * 管理员获取所有佣金记录
   */
  async getAllCommissions(req: Request, res: Response) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '无权访问' });
      }

      const { startDate, endDate, status, userId } = req.query;
      const query: any = {};

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate as string);
        if (endDate) query.createdAt.$lte = new Date(endDate as string);
      }

      if (status) {
        query.status = status;
      }

      if (userId) {
        query.userId = userId;
      }

      const commissions = await CommissionRecord.find(query)
        .populate('userId', 'username')
        .populate('fromUserId', 'username')
        .populate('strategyId', 'name')
        .sort({ createdAt: -1 });

      res.json(commissions);
    } catch (error) {
      res.status(500).json({ message: '获取佣金记录失败', error });
    }
  },

  /**
   * 管理员更新佣金状态
   */
  async updateCommissionStatus(req: Request, res: Response) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '无权访问' });
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'paid'].includes(status)) {
        return res.status(400).json({ message: '无效的状态' });
      }

      const commission = await CommissionRecord.findById(id);
      if (!commission) {
        return res.status(404).json({ message: '佣金记录不存在' });
      }

      commission.status = status;
      if (status === 'paid') {
        commission.paidAt = new Date();
      }
      await commission.save();

      res.json(commission);
    } catch (error) {
      res.status(500).json({ message: '更新佣金状态失败', error });
    }
  },

  /**
   * 获取佣金统计
   */
  async getCommissionStats(req: Request, res: Response) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '无权访问' });
      }

      const { startDate, endDate } = req.query;
      const query: any = {};

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate as string);
        if (endDate) query.createdAt.$lte = new Date(endDate as string);
      }

      const [total, pending, paid] = await Promise.all([
        CommissionRecord.aggregate([
          { $match: query },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        CommissionRecord.aggregate([
          { $match: { ...query, status: 'pending' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        CommissionRecord.aggregate([
          { $match: { ...query, status: 'paid' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
      ]);

      res.json({
        total: total[0]?.total || 0,
        pending: pending[0]?.total || 0,
        paid: paid[0]?.total || 0
      });
    } catch (error) {
      res.status(500).json({ message: '获取佣金统计失败', error });
    }
  },

  /**
   * 获取佣金分布统计
   */
  async getCommissionDistribution(req: Request, res: Response) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '无权访问' });
      }

      const { startDate, endDate } = req.query;
      const query: any = {};

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate as string);
        if (endDate) query.createdAt.$lte = new Date(endDate as string);
      }

      const distribution = await CommissionRecord.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$level',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            level: '$_id',
            total: 1,
            count: 1,
            _id: 0
          }
        }
      ]);

      res.json(distribution);
    } catch (error) {
      res.status(500).json({ message: '获取佣金分布统计失败', error });
    }
  },

  /**
   * 获取用户佣金排行
   */
  async getCommissionRanking(req: Request, res: Response) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '无权访问' });
      }

      const { startDate, endDate, limit = 10 } = req.query;
      const query: any = {};

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate as string);
        if (endDate) query.createdAt.$lte = new Date(endDate as string);
      }

      const ranking = await CommissionRecord.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$userId',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { total: -1 } },
        { $limit: Number(limit) },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            userId: '$_id',
            username: '$user.username',
            total: 1,
            count: 1,
            _id: 0
          }
        }
      ]);

      res.json(ranking);
    } catch (error) {
      res.status(500).json({ message: '获取佣金排行失败', error });
    }
  }
}; 