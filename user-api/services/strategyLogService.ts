import { DatabaseService } from './databaseService';

export class StrategyLogService {
  private static instance: StrategyLogService;

  private constructor() {}

  public static getInstance(): StrategyLogService {
    if (!StrategyLogService.instance) {
      StrategyLogService.instance = new StrategyLogService();
    }
    return StrategyLogService.instance;
  }

  public async logStrategyExecution(
    userId: number,
    strategyName: string,
    profit: number,
    cumulativeProfit: number
  ): Promise<void> {
    try {
      await DatabaseService.query(
        `INSERT INTO user_strategy_logs 
         (user_id, strategy_name, profit, cumulative_profit) 
         VALUES ($1, $2, $3, $4)`,
        [userId, strategyName, profit, cumulativeProfit]
      );
    } catch (error) {
      console.error('Error logging strategy execution:', error);
      throw error;
    }
  }

  public async getStrategyLogs(
    userId: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    try {
      let query = `
        SELECT * FROM user_strategy_logs 
        WHERE user_id = $1
      `;
      const params: any[] = [userId];

      if (startDate) {
        query += ` AND executed_at >= $${params.length + 1}`;
        params.push(startDate);
      }

      if (endDate) {
        query += ` AND executed_at <= $${params.length + 1}`;
        params.push(endDate);
      }

      query += ` ORDER BY executed_at DESC`;

      const result = await DatabaseService.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting strategy logs:', error);
      throw error;
    }
  }

  public async getStrategyStats(
    userId: number,
    strategyName: string
  ): Promise<any> {
    try {
      const result = await DatabaseService.query(
        `SELECT 
          COUNT(*) as total_executions,
          SUM(profit) as total_profit,
          AVG(profit) as average_profit,
          MIN(profit) as min_profit,
          MAX(profit) as max_profit
         FROM user_strategy_logs 
         WHERE user_id = $1 AND strategy_name = $2`,
        [userId, strategyName]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error getting strategy stats:', error);
      throw error;
    }
  }
} 