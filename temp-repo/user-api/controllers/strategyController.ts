import { Request, Response } from 'express';
import { Strategy } from '../models/strategy';
import { OptimizationResult } from '../models/optimizationResult';
import { DatabaseService } from '../services/databaseService';
import { StrategyEngine } from '../services/strategyEngine';

export const getStrategies = async (req: Request, res: Response) => {
  try {
    const strategies = await DatabaseService.query(
      'SELECT * FROM strategies WHERE user_id = $1',
      [req.user.id]
    );
    res.json(strategies);
  } catch (error) {
    console.error('Error fetching strategies:', error);
    res.status(500).json({ error: 'Failed to fetch strategies' });
  }
};

export const optimizeStrategy = async (req: Request, res: Response) => {
  try {
    const { strategyId, parameters } = req.body;
    
    // 获取策略配置
    const strategy = await DatabaseService.query(
      'SELECT * FROM strategies WHERE id = $1 AND user_id = $2',
      [strategyId, req.user.id]
    );

    if (!strategy) {
      return res.status(404).json({ error: 'Strategy not found' });
    }

    // 获取历史数据
    const historicalData = await DatabaseService.query(
      'SELECT * FROM historical_data WHERE symbol = $1 ORDER BY timestamp',
      [strategy.symbol]
    );

    // 初始化策略引擎
    const engine = new StrategyEngine(strategy.type, parameters);
    
    // 运行回测
    const results = await engine.runBacktest(historicalData);

    // 保存优化结果
    const optimizationResult = await DatabaseService.query(
      `INSERT INTO optimization_results 
       (strategy_id, parameters, total_profit, max_drawdown, win_rate, 
        sharpe_ratio, sortino_ratio, volatility, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [
        strategyId,
        parameters,
        results.totalProfit,
        results.maxDrawdown,
        results.winRate,
        results.sharpeRatio,
        results.sortinoRatio,
        results.volatility
      ]
    );

    res.json(optimizationResult);
  } catch (error) {
    console.error('Error optimizing strategy:', error);
    res.status(500).json({ error: 'Failed to optimize strategy' });
  }
};

export const getOptimizationResults = async (req: Request, res: Response) => {
  try {
    const { strategyId } = req.params;
    
    const results = await DatabaseService.query(
      `SELECT * FROM optimization_results 
       WHERE strategy_id = $1 
       ORDER BY created_at DESC`,
      [strategyId]
    );

    res.json(results);
  } catch (error) {
    console.error('Error fetching optimization results:', error);
    res.status(500).json({ error: 'Failed to fetch optimization results' });
  }
};

export const updateStrategy = async (req: Request, res: Response) => {
  try {
    const { strategyId } = req.params;
    const { name, description, parameters } = req.body;

    const updatedStrategy = await DatabaseService.query(
      `UPDATE strategies 
       SET name = $1, description = $2, parameters = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [name, description, parameters, strategyId, req.user.id]
    );

    res.json(updatedStrategy);
  } catch (error) {
    console.error('Error updating strategy:', error);
    res.status(500).json({ error: 'Failed to update strategy' });
  }
};

export const deleteStrategy = async (req: Request, res: Response) => {
  try {
    const { strategyId } = req.params;

    await DatabaseService.query(
      'DELETE FROM strategies WHERE id = $1 AND user_id = $2',
      [strategyId, req.user.id]
    );

    res.json({ message: 'Strategy deleted successfully' });
  } catch (error) {
    console.error('Error deleting strategy:', error);
    res.status(500).json({ error: 'Failed to delete strategy' });
  }
}; 