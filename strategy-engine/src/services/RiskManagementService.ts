import { logger } from '../utils/logger';

export class RiskManagementService {
  private static instance: RiskManagementService;
  private riskLimits: Map<string, number>;

  constructor() {
    this.riskLimits = new Map();
    this.initializeRiskLimits();
  }

  public static getInstance(): RiskManagementService {
    if (!RiskManagementService.instance) {
      RiskManagementService.instance = new RiskManagementService();
    }
    return RiskManagementService.instance;
  }

  private initializeRiskLimits(): void {
    // 设置默认风险限制
    this.riskLimits.set('maxLeverage', 20);
    this.riskLimits.set('maxPositionSize', 0.1); // 10% of capital
    this.riskLimits.set('maxDrawdown', 0.1); // 10%
    this.riskLimits.set('maxDailyLoss', 0.05); // 5%
  }

  public checkStrategyRisk(strategyId: string, params: any): boolean {
    try {
      const maxLeverage = this.riskLimits.get('maxLeverage');
      const maxPositionSize = this.riskLimits.get('maxPositionSize');
      const maxDrawdown = this.riskLimits.get('maxDrawdown');
      const maxDailyLoss = this.riskLimits.get('maxDailyLoss');

      // 检查杠杆
      if (maxLeverage !== undefined && params.leverage > maxLeverage) {
        logger.warn(`Strategy ${strategyId} exceeds max leverage limit`);
        return false;
      }

      // 检查仓位大小
      if (maxPositionSize !== undefined && params.positionSize > maxPositionSize) {
        logger.warn(`Strategy ${strategyId} exceeds max position size limit`);
        return false;
      }

      // 检查回撤
      if (maxDrawdown !== undefined && params.maxDrawdown > maxDrawdown) {
        logger.warn(`Strategy ${strategyId} exceeds max drawdown limit`);
        return false;
      }

      // 检查每日损失
      if (maxDailyLoss !== undefined && params.dailyLoss > maxDailyLoss) {
        logger.warn(`Strategy ${strategyId} exceeds max daily loss limit`);
        return false;
      }

      return true;
    } catch (error) {
      logger.error(`Error checking strategy risk: ${error}`);
      return false;
    }
  }

  public updateRiskLimits(limits: Map<string, number>): void {
    this.riskLimits = limits;
    logger.info('Risk limits updated');
  }

  public getRiskLimits(): Map<string, number> {
    return this.riskLimits;
  }

  async checkRisk(userId: string, amount: number): Promise<boolean> {
    // TODO: Implement risk check logic
    return true;
  }
} 