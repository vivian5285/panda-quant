import { StrategyMonitorService, StrategyPerformance } from './StrategyMonitorService';
import { StrategyExecutionService } from './StrategyExecutionService';
import { RiskManagementService } from './RiskManagementService';
import { logger } from '../utils/logger';

export interface StrategyExecutionRequest {
  strategyId: string;
  userId: string;
  parameters: Record<string, any>;
}

export interface StrategyExecutionResponse {
  executionId: string;
  status: 'success' | 'failed';
  message: string;
  performance?: StrategyPerformance;
}

export class StrategyAPIService {
  private static instance: StrategyAPIService;
  private monitorService: StrategyMonitorService;
  private executionService: StrategyExecutionService;
  private riskService: RiskManagementService;

  private constructor() {
    this.monitorService = StrategyMonitorService.getInstance();
    this.executionService = StrategyExecutionService.getInstance();
    this.riskService = RiskManagementService.getInstance();
  }

  public static getInstance(): StrategyAPIService {
    if (!StrategyAPIService.instance) {
      StrategyAPIService.instance = new StrategyAPIService();
    }
    return StrategyAPIService.instance;
  }

  public async executeStrategy(request: StrategyExecutionRequest): Promise<StrategyExecutionResponse> {
    try {
      // 检查风险
      if (!this.riskService.checkStrategyRisk(request.strategyId, request.parameters)) {
        return {
          executionId: '',
          status: 'failed',
          message: 'Strategy exceeds risk limits'
        };
      }

      // 开始监控
      this.monitorService.startMonitoring(request.strategyId, request.userId);

      // 执行策略
      const result = await this.executionService.executeStrategy(
        request.strategyId,
        request.parameters
      );

      // 更新性能指标
      this.monitorService.updatePerformance(request.strategyId, request.userId, {
        status: 'running',
        currentReturn: result.currentReturn || 0,
        maxDrawdown: result.maxDrawdown || 0,
        dailyReturn: result.dailyReturn || 0,
        totalTrades: result.totalTrades || 0,
        winRate: result.winRate || 0
      });

      return {
        executionId: result.executionId,
        status: 'success',
        message: 'Strategy executed successfully',
        performance: this.monitorService.getPerformance(request.strategyId, request.userId)
      };
    } catch (error) {
      logger.error(`Error executing strategy: ${error}`);
      return {
        executionId: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public getStrategyPerformance(strategyId: string, userId: string): StrategyPerformance | undefined {
    return this.monitorService.getPerformance(strategyId, userId);
  }

  public getAllStrategyPerformances(userId?: string): StrategyPerformance[] {
    return this.monitorService.getAllPerformances(userId);
  }

  public subscribeToStrategyUpdates(
    strategyId: string,
    userId: string,
    callback: (performance: StrategyPerformance) => void
  ): void {
    this.monitorService.subscribeToUpdates(strategyId, userId, callback);
  }

  public unsubscribeFromStrategyUpdates(strategyId: string, userId: string): void {
    this.monitorService.unsubscribeFromUpdates(strategyId, userId);
  }
} 