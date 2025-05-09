import type { Request, Response } from 'express';
import ProfitModel from '../models/profit.model';
import { logger } from '../utils/logger';

export class ProfitController {
  public async getProfits(req: Request, res: Response): Promise<void> {
    try {
      const profits = await ProfitModel.find();
      res.json(profits);
    } catch (error) {
      logger.error('Error in getProfits:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getProfitById(req: Request, res: Response): Promise<void> {
    try {
      const profit = await ProfitModel.findById(req.params.id);
      if (!profit) {
        res.status(404).json({ error: 'Profit not found' });
        return;
      }
      res.json(profit);
    } catch (error) {
      logger.error('Error in getProfitById:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async createProfit(req: Request, res: Response): Promise<void> {
    try {
      const profit = new ProfitModel(req.body);
      await profit.save();
      res.status(201).json(profit);
    } catch (error) {
      logger.error('Error in createProfit:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async updateProfit(req: Request, res: Response): Promise<void> {
    try {
      const profit = await ProfitModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!profit) {
        res.status(404).json({ error: 'Profit not found' });
        return;
      }
      res.json(profit);
    } catch (error) {
      logger.error('Error in updateProfit:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async deleteProfit(req: Request, res: Response): Promise<void> {
    try {
      const profit = await ProfitModel.findByIdAndDelete(req.params.id);
      if (!profit) {
        res.status(404).json({ error: 'Profit not found' });
        return;
      }
      res.json({ message: 'Profit deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteProfit:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 