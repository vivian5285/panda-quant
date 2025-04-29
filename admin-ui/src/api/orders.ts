export interface Order {
  id: string;
  userId: string;
  username: string;
  strategyId: string;
  strategyName: string;
  symbol: string;
  tradingPair: string;
  type: 'buy' | 'sell';
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  price: number;
  quantity: number;
  totalAmount: number;
  total: number;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'John Doe',
    strategyId: 'strategy1',
    strategyName: 'Momentum Trading',
    symbol: 'BTC/USDT',
    tradingPair: 'BTC/USDT',
    type: 'buy',
    status: 'completed',
    price: 50000,
    quantity: 0.1,
    totalAmount: 5000,
    total: 5000,
    timestamp: '2024-01-01T10:00:00Z',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:01:00Z',
    amount: 5000,
  },
  {
    id: '2',
    userId: 'user2',
    username: 'Jane Smith',
    strategyId: 'strategy2',
    strategyName: 'Mean Reversion',
    symbol: 'ETH/USDT',
    tradingPair: 'ETH/USDT',
    type: 'sell',
    status: 'pending',
    price: 3000,
    quantity: 1,
    totalAmount: 3000,
    total: 3000,
    timestamp: '2024-01-01T11:00:00Z',
    createdAt: '2024-01-01T11:00:00Z',
    updatedAt: '2024-01-01T11:00:00Z',
    amount: 3000,
  },
];

export const getOrders = async (): Promise<Order[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrders);
    }, 1000);
  });
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  const order = mockOrders.find((o) => o.id === id);
  return order || null;
};

export const updateOrderStatus = async (
  id: string,
  status: Order['status']
): Promise<Order | null> => {
  const order = mockOrders.find((o) => o.id === id);
  if (order) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }
  return null;
};

export const cancelOrder = async (id: string): Promise<boolean> => {
  const order = mockOrders.find((o) => o.id === id);
  if (order) {
    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    return true;
  }
  return false;
};

export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  // 这里应该是实际的 API 调用
  return {
    id: Date.now().toString(),
    tradingPair: orderData.tradingPair || '',
    type: orderData.type || 'buy',
    status: orderData.status || 'pending',
    amount: orderData.amount || 0,
    price: orderData.price || 0,
    timestamp: new Date().toISOString(),
  };
};

export const updateOrder = async (orderData: Order): Promise<Order> => {
  // 这里应该是实际的 API 调用
  return orderData;
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  // 这里应该是实际的 API 调用
}; 