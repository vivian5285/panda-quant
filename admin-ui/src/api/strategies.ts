export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'momentum' | 'mean_reversion' | 'arbitrage' | 'other';
  status: 'active' | 'inactive' | 'testing';
  riskLevel: 'low' | 'medium' | 'high';
  performance: {
    totalProfit: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Momentum Trading',
    description: 'A strategy that follows market trends and momentum',
    type: 'momentum',
    status: 'active',
    riskLevel: 'medium',
    performance: {
      totalProfit: 15000,
      winRate: 0.75,
      maxDrawdown: 0.15,
      sharpeRatio: 2.5,
    },
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Mean Reversion',
    description: 'A strategy that bets on price returning to its mean',
    type: 'mean_reversion',
    status: 'testing',
    riskLevel: 'low',
    performance: {
      totalProfit: 8000,
      winRate: 0.65,
      maxDrawdown: 0.1,
      sharpeRatio: 1.8,
    },
    createdAt: '2024-01-01T11:00:00Z',
    updatedAt: '2024-01-01T11:00:00Z',
  },
];

export const getStrategies = async (): Promise<Strategy[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStrategies);
    }, 1000);
  });
};

export const getStrategyById = async (id: string): Promise<Strategy | null> => {
  const strategy = mockStrategies.find((s) => s.id === id);
  return strategy || null;
};

export const createStrategy = async (strategyData: Partial<Strategy>): Promise<Strategy> => {
  const newStrategy: Strategy = {
    id: Date.now().toString(),
    name: strategyData.name || '',
    description: strategyData.description || '',
    type: strategyData.type || 'other',
    status: strategyData.status || 'testing',
    riskLevel: strategyData.riskLevel || 'medium',
    performance: {
      totalProfit: 0,
      winRate: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockStrategies.push(newStrategy);
  return newStrategy;
};

export const updateStrategy = async (strategyData: Strategy): Promise<Strategy | null> => {
  const index = mockStrategies.findIndex((s) => s.id === strategyData.id);
  if (index !== -1) {
    mockStrategies[index] = {
      ...strategyData,
      updatedAt: new Date().toISOString(),
    };
    return mockStrategies[index];
  }
  return null;
};

export const deleteStrategy = async (id: string): Promise<boolean> => {
  const index = mockStrategies.findIndex((s) => s.id === id);
  if (index !== -1) {
    mockStrategies.splice(index, 1);
    return true;
  }
  return false;
}; 