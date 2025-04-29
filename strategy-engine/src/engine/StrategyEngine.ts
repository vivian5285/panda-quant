import { Strategy, StrategyParameters, StrategyStatus } from '../types/strategy';
import { Order, OrderType, OrderSide, OrderStatus } from '../types/order';
import { RiskManagementService } from '../services/RiskManagementService';
import { StrategyMonitorService } from '../services/StrategyMonitorService';
import { v4 as uuidv4 } from 'uuid';

export class StrategyEngine {
  private riskManagementService: RiskManagementService;
  private monitorService: StrategyMonitorService;

  constructor() {
    this.riskManagementService = RiskManagementService.getInstance();
    this.monitorService = StrategyMonitorService.getInstance();
  }

  async executeStrategy(strategyId: string, parameters: StrategyParameters): Promise<{ executionId: string; status: StrategyStatus }> {
    // 检查风险
    if (!this.riskManagementService.checkStrategyRisk(strategyId, parameters)) {
      throw new Error('Strategy execution exceeds risk limits');
    }

    // 执行策略
    const executionId = uuidv4();
    const status = StrategyStatus.RUNNING;

    // 更新监控
    this.monitorService.startMonitoring(strategyId, parameters.userId);
    this.monitorService.updatePerformance(strategyId, parameters.userId, {
      status,
      currentReturn: 0,
      maxDrawdown: 0,
      dailyReturn: 0,
      totalTrades: 0,
      winRate: 0
    });

    return { executionId, status };
  }

  async createOrder(order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    return {
      ...order,
      id: uuidv4(),
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
} 