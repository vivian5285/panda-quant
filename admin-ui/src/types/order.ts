export interface Order {
  id: string;
  _id: string;
  userId: string;
  username: string;
  strategyId: string;
  strategyName: string;
  tradingPair: string;
  type: 'buy' | 'sell';
  status: 'failed' | 'pending' | 'completed' | 'cancelled';
  amount: number;
  price: number;
  totalAmount: number;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  executedAt?: string;
  cancelledAt?: string;
  error?: string;
} 