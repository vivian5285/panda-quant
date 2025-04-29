import { Request, Response } from 'express';
import { Types, Document } from 'mongoose';
import { Strategy } from '../models/Strategy';
import { StrategyPerformance } from '../models/StrategyPerformance';
import { commissionService } from '../services/commissionService';
import { IStrategyPerformance } from '../interfaces/IStrategyPerformance';

export const profitController = {
  async createProfit(req: Request, res: Response) {
    try {
      const { userId, strategyId, profit } = req.body;
      
      const performance = await StrategyPerformance.create({
        userId: new Types.ObjectId(userId),
        strategyId: new Types.ObjectId(strategyId),
        profit
      });

      // 计算并分配佣金
      await commissionService.calculateAndDistributeCommission(performance as Document<unknown, {}, IStrategyPerformance> & IStrategyPerformance & Required<{ _id: Types.ObjectId }>);

      res.status(201).json(performance);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async calculateAndDistributeCommission(req: Request, res: Response) {
    try {
      const { strategyId } = req.params;
      const strategy = await Strategy.findById(strategyId);
      
      if (!strategy) {
        return res.status(404).json({ error: 'Strategy not found' });
      }

      const performance = await StrategyPerformance.findOne({ 
        strategyId: strategy._id 
      });

      if (!performance) {
        return res.status(404).json({ error: 'Performance record not found' });
      }

      const result = await commissionService.calculateAndDistributeCommission(performance as Document<unknown, {}, IStrategyPerformance> & IStrategyPerformance & Required<{ _id: Types.ObjectId }>);
      res.json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
}; 