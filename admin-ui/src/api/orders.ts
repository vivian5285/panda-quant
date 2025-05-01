import axios from './axios';

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

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    _id: '1',
    userId: 'user1',
    username: 'John Doe',
    strategyId: 'strategy1',
    strategyName: 'Momentum Trading',
    tradingPair: 'BTC/USDT',
    type: 'buy',
    status: 'completed',
    price: 50000,
    amount: 5000,
    totalAmount: 5000,
    timestamp: '2024-01-01T10:00:00Z',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:01:00Z'
  },
  {
    id: '2',
    _id: '2',
    userId: 'user2',
    username: 'Jane Smith',
    strategyId: 'strategy2',
    strategyName: 'Mean Reversion',
    tradingPair: 'ETH/USDT',
    type: 'sell',
    status: 'pending',
    price: 3000,
    amount: 3000,
    totalAmount: 3000,
    timestamp: '2024-01-01T11:00:00Z',
    createdAt: '2024-01-01T11:00:00Z',
    updatedAt: '2024-01-01T11:00:00Z'
  }
];

export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await axios.get<{ data: Order[]; total: number }>('/orders', { params });
  return response;
};

export const getOrderById = async (id: string) => {
  const response = await axios.get<Order>(`/orders/${id}`);
  return response;
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

export const createOrder = async (data: Partial<Order>) => {
  const response = await axios.post<Order>('/orders', data);
  return response;
};

export const updateOrder = async (id: string, data: Partial<Order>) => {
  const response = await axios.put<Order>(`/orders/${id}`, data);
  return response;
};

export const deleteOrder = async (id: string) => {
  const response = await axios.delete(`/orders/${id}`);
  return response;
}; 