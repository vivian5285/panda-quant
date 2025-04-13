import { StrategyManager } from '../strategyManager';
import { StrategyLogService } from '../../user-api/services/strategyLogService';
import { DatabaseService } from '../../user-api/services/databaseService';

export class StrategyMonitor {
  private static instance: StrategyMonitor;
  private strategyManager: StrategyManager;
  private logService: StrategyLogService;

  private constructor() {
    this.strategyManager = new StrategyManager();
    this.logService = StrategyLogService.getInstance();
  }

  public static getInstance(): StrategyMonitor {
    if (!StrategyMonitor.instance) {
      StrategyMonitor.instance = new StrategyMonitor();
    }
    return StrategyMonitor.instance;
  }

  public async monitorStrategyExecution(): Promise<void> {
    try {
      const strategies = this.strategyManager.getAllStrategies();
      
      for (const [strategyId, strategy] of strategies) {
        const stats = strategy.getStats();
        
        // 记录策略执行日志
        await this.logService.logStrategyExecution(
          stats.userId,
          stats.strategyName,
          stats.profit,
          stats.cumulativeProfit
        );

        // 记录详细日志
        console.log(`Strategy Execution Log:
          Strategy ID: ${strategyId}
          User ID: ${stats.userId}
          Strategy Name: ${stats.strategyName}
          Execution Time: ${new Date().toISOString()}
          Profit: ${stats.profit}
          Cumulative Profit: ${stats.cumulativeProfit}
          Total Trades: ${stats.totalTrades}
          Win Rate: ${stats.winRate}%
          Max Drawdown: ${stats.maxDrawdown}%
        `);

        // 检查数据一致性
        await this.verifyDataConsistency(stats);
      }
    } catch (error) {
      console.error('Error monitoring strategy execution:', error);
      throw error;
    }
  }

  private async verifyDataConsistency(stats: any): Promise<void> {
    try {
      // 从数据库获取最新的策略统计
      const dbStats = await this.logService.getStrategyStats(
        stats.userId,
        stats.strategyName
      );

      // 验证收益数据一致性
      if (Math.abs(dbStats.total_profit - stats.cumulativeProfit) > 0.0001) {
        console.error(`Profit data inconsistency detected:
          Database Total Profit: ${dbStats.total_profit}
          Strategy Total Profit: ${stats.cumulativeProfit}
        `);
      }

      // 验证交易数量一致性
      if (dbStats.total_executions !== stats.totalTrades) {
        console.error(`Trade count inconsistency detected:
          Database Trade Count: ${dbStats.total_executions}
          Strategy Trade Count: ${stats.totalTrades}
        `);
      }

      // 记录验证结果
      await DatabaseService.query(
        `INSERT INTO strategy_consistency_checks 
         (user_id, strategy_name, check_time, is_consistent) 
         VALUES ($1, $2, $3, $4)`,
        [
          stats.userId,
          stats.strategyName,
          new Date(),
          Math.abs(dbStats.total_profit - stats.cumulativeProfit) <= 0.0001 &&
          dbStats.total_executions === stats.totalTrades
        ]
      );
    } catch (error) {
      console.error('Error verifying data consistency:', error);
      throw error;
    }
  }

  public async getConsistencyReport(
    userId: number,
    strategyName: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    try {
      const result = await DatabaseService.query(
        `SELECT 
          check_time,
          is_consistent,
          CASE 
            WHEN is_consistent THEN 'Consistent'
            ELSE 'Inconsistent'
          END as status
         FROM strategy_consistency_checks
         WHERE user_id = $1 
         AND strategy_name = $2
         ${startDate ? 'AND check_time >= $3' : ''}
         ${endDate ? 'AND check_time <= $4' : ''}
         ORDER BY check_time DESC`,
        [userId, strategyName, startDate, endDate].filter(Boolean)
      );

      return result.rows;
    } catch (error) {
      console.error('Error getting consistency report:', error);
      throw error;
    }
  }
} 