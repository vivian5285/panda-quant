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
export declare class StrategyMonitorService {
    private static instance;
    private performances;
    private updateCallbacks;
    private constructor();
    static getInstance(): StrategyMonitorService;
    startMonitoring(strategyId: string, userId: string): void;
    updatePerformance(strategyId: string, userId: string, update: Partial<StrategyPerformance>): void;
    getPerformance(strategyId: string, userId: string): StrategyPerformance | undefined;
    getAllPerformances(userId?: string): StrategyPerformance[];
    subscribeToUpdates(strategyId: string, userId: string, callback: (performance: StrategyPerformance) => void): void;
    unsubscribeFromUpdates(strategyId: string, userId: string): void;
    private getKey;
    private notifyUpdate;
}
