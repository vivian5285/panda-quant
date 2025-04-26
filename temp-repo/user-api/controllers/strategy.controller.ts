import { Request, Response } from 'express';
import { StrategyManager } from '../strategy-engine/strategyManager';
import { StrategyPreset } from '../strategy-engine/types';

const strategyManager = new StrategyManager();

export const initializeStrategyManager = (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: 'Strategy manager initialized' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAvailableStrategies = async (req: Request, res: Response) => {
  try {
    const strategies = strategyManager.getAvailableStrategies();
    res.json({ strategies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createStrategy = async (req: Request, res: Response) => {
  try {
    const preset: StrategyPreset = req.body;
    const strategyId = strategyManager.createStrategy(preset);
    res.json({ strategyId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const analyzeMarket = async (req: Request, res: Response) => {
  try {
    const { strategyId } = req.params;
    const { data } = req.body;
    const strategy = strategyManager.getStrategy(strategyId);
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    const signal = strategy.analyzeMarket(data);
    res.json({ signal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const executeTrade = async (req: Request, res: Response) => {
  try {
    const { strategyId } = req.params;
    const { price } = req.body;
    const strategy = strategyManager.getStrategy(strategyId);
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    await strategy.executeTrade(price);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStrategyStats = async (req: Request, res: Response) => {
  try {
    const { strategyId } = req.params;
    const strategy = strategyManager.getStrategy(strategyId);
    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }
    const stats = strategy.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 