export interface StrategyParameters {
    userId: string;
    symbol: string;
    amount: number;
    leverage: number;
    maxDrawdown: number;
}
export declare enum StrategyStatus {
    RUNNING = "running",
    PAUSED = "paused",
    STOPPED = "stopped",
    FAILED = "failed"
}
export interface Strategy {
    id: string;
    name: string;
    description: string;
    parameters: StrategyParameters;
    status: StrategyStatus;
    createdAt: Date;
    updatedAt: Date;
}
