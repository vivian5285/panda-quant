import { logger } from '../utils/logger';
import { CommissionService } from './CommissionService';
import { StrategyMonitorService } from './StrategyMonitorService';

export interface StrategyExecutionResult {
  executionId: string;
  status: 'success' | 'failed';
  message: string;
  currentReturn?: number;
  maxDrawdown?: number;
  dailyReturn?: number;
  totalTrades?: number;
  winRate?: number;
}

export class StrategyExecutionService {
  private static instance: StrategyExecutionService;
  private commissionService: CommissionService;
  private monitorService: StrategyMonitorService;

  private constructor() {
    this.commissionService = CommissionService.getInstance();
    this.monitorService = StrategyMonitorService.getInstance();
  }

  public static getInstance(): StrategyExecutionService {
    if (!StrategyExecutionService.instance) {
      StrategyExecutionService.instance = new StrategyExecutionService();
    }
    return StrategyExecutionService.instance;
  }

  public async executeStrategy(
    strategyId: string,
    parameters: Record<string, any>
  ): Promise<StrategyExecutionResult> {
    try {
      // 执行策略逻辑
      const result = await this.runStrategy(strategyId, parameters);

      // 如果有收益，处理佣金
      if (result.currentReturn && result.currentReturn > 0) {
        await this.commissionService.processTradeProfit(
          parameters.userId,
          strategyId,
          result.executionId,
          result.currentReturn
        );
      }

      // 更新监控数据
      this.monitorService.updatePerformance(strategyId, parameters.userId, {
        currentReturn: result.currentReturn || 0,
        maxDrawdown: result.maxDrawdown || 0,
        dailyReturn: result.dailyReturn || 0,
        totalTrades: result.totalTrades || 0,
        winRate: result.winRate || 0
      });

      return result;
    } catch (error) {
      logger.error(`Error executing strategy: ${error}`);
      return {
        executionId: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async runStrategy(
    strategyId: string,
    parameters: Record<string, any>
  ): Promise<StrategyExecutionResult> {
    // TODO: 实现具体的策略执行逻辑
    // 这里应该调用实际的交易API执行交易
    // 并返回交易结果

    return {
      executionId: this.generateExecutionId(),
      status: 'success',
      message: 'Strategy executed successfully',
      currentReturn: 100, // 示例数据
      maxDrawdown: 5,
      dailyReturn: 2,
      totalTrades: 10,
      winRate: 0.8
    };
  }

  private generateExecutionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 