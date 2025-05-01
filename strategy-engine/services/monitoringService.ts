import { StrategyExecutionResult } from '../types';
import { DatabaseService } from './databaseService';

export class MonitoringService {
  private static instance: MonitoringService;
  private databaseService: DatabaseService;

  private constructor() {
    this.databaseService = new DatabaseService();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  public async initialize(): Promise<void> {
    await this.databaseService.initialize();
  }

  public async updateStrategyExecution(strategyId: string, result: StrategyExecutionResult): Promise<void> {
    try {
      await this.databaseService.query(
        'INSERT INTO strategy_executions (id, strategy_id, status, start_time, end_time, performance) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          result.id,
          strategyId,
          result.status,
          result.startTime,
          result.endTime,
          JSON.stringify(result.performance)
        ]
      );
    } catch (error) {
      console.error('更新策略执行记录失败:', error);
      throw error;
    }
  }

  public async logError(strategyId: string, error: any): Promise<void> {
    try {
      await this.databaseService.query(
        'INSERT INTO error_logs (strategy_id, error_message, timestamp) VALUES ($1, $2, $3)',
        [strategyId, error.message, new Date()]
      );
    } catch (dbError) {
      console.error('记录错误日志失败:', dbError);
    }
  }

  public async getStrategyStats(strategyId: string): Promise<any> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM strategy_executions WHERE strategy_id = $1 ORDER BY start_time DESC LIMIT 100',
        [strategyId]
      );
      return result.rows;
    } catch (error) {
      console.error('获取策略统计信息失败:', error);
      throw error;
    }
  }

  public async cleanup(): Promise<void> {
    await this.databaseService.close();
  }
} 