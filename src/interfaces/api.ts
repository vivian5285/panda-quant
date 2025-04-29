export interface StrategyExecutionRequest {
  userId: string;
  strategyId: string;
  parameters: {
    symbol: string;
    amount: number;
    leverage: number;
    maxDrawdown: number;
  };
}

export interface StrategyExecutionResponse {
  executionId: string;
  status: 'success' | 'failed';
  result?: any;
  error?: string;
  message?: string;
} 