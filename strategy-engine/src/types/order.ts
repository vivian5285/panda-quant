export enum OrderType {
  MARKET = 'market',
  LIMIT = 'limit',
  STOP = 'stop'
}

export enum OrderSide {
  BUY = 'buy',
  SELL = 'sell'
}

export interface Order {
  id: string;
  userId: string;
  strategyId: string;
  exchange: string;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  amount: number;
  retryCount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
} 