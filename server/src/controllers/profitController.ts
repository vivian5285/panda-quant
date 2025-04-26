import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Strategy } from '../models/Strategy';
import { StrategyPerformance } from '../models/StrategyPerformance';
import { CommissionService } from '../services/commissionService';

const commissionService = new CommissionService();

export class ProfitController {
  // ... existing code ...

  async calculateAndDistributeCommission(req: Request, res: Response) {
    try {
      const { strategyId } = req.params;
      const strategy = await Strategy.findById(strategyId);
      
      if (!strategy) {
        return res.status(404).json({ error: 'Strategy not found' });
      }

      const performance = await StrategyPerformance.findOne({ 
        strategyId: strategy._id as Types.ObjectId 
      });

      if (!performance) {
        return res.status(404).json({ error: 'Performance record not found' });
      }

      const result = await commissionService.calculateAndDistributeCommission(performance);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 