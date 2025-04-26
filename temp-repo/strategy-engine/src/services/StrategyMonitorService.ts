import { logger } from '../utils/logger';

export interface StrategyPerformance {
  strategyId: string;
  userId: string;
  status: 'running' | 'paused' | 'stopped';
  startTime: Date;
  currentReturn: number;
  maxDrawdown: number;
  dailyReturn: number;
  totalTrades: number;
  winRate: number;
  lastUpdate: Date;
}

export class StrategyMonitorService {
  private static instance: StrategyMonitorService;
  private performances: Map<string, StrategyPerformance>;
  private updateCallbacks: Map<string, (performance: StrategyPerformance) => void>;

  private constructor() {
    this.performances = new Map();
    this.updateCallbacks = new Map();
  }

  public static getInstance(): StrategyMonitorService {
    if (!StrategyMonitorService.instance) {
      StrategyMonitorService.instance = new StrategyMonitorService();
    }
    return StrategyMonitorService.instance;
  }

  public startMonitoring(strategyId: string, userId: string): void {
    const key = this.getKey(strategyId, userId);
    if (!this.performances.has(key)) {
      this.performances.set(key, {
        strategyId,
        userId,
        status: 'running',
        startTime: new Date(),
        currentReturn: 0,
        maxDrawdown: 0,
        dailyReturn: 0,
        totalTrades: 0,
        winRate: 0,
        lastUpdate: new Date()
      });
      logger.info(`Started monitoring strategy ${strategyId} for user ${userId}`);
    }
  }

  public updatePerformance(
    strategyId: string,
    userId: string,
    update: Partial<StrategyPerformance>
  ): void {
    const key = this.getKey(strategyId, userId);
    const current = this.performances.get(key);
    
    if (current) {
      const updated = {
        ...current,
        ...update,
        lastUpdate: new Date()
      };
      
      this.performances.set(key, updated);
      this.notifyUpdate(key, updated);
      logger.info(`Updated performance for strategy ${strategyId}`);
    }
  }

  public getPerformance(strategyId: string, userId: string): StrategyPerformance | undefined {
    return this.performances.get(this.getKey(strategyId, userId));
  }

  public getAllPerformances(userId?: string): StrategyPerformance[] {
    if (userId) {
      return Array.from(this.performances.values())
        .filter(performance => performance.userId === userId);
    }
    return Array.from(this.performances.values());
  }

  public subscribeToUpdates(
    strategyId: string,
    userId: string,
    callback: (performance: StrategyPerformance) => void
  ): void {
    const key = this.getKey(strategyId, userId);
    this.updateCallbacks.set(key, callback);
  }

  public unsubscribeFromUpdates(strategyId: string, userId: string): void {
    const key = this.getKey(strategyId, userId);
    this.updateCallbacks.delete(key);
  }

  private getKey(strategyId: string, userId: string): string {
    return `${strategyId}:${userId}`;
  }

  private notifyUpdate(key: string, performance: StrategyPerformance): void {
    const callback = this.updateCallbacks.get(key);
    if (callback) {
      callback(performance);
    }
  }
} 