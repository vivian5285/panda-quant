export interface ISettings {
  userId: string;
  notifications: {
    email: boolean;
    push: boolean;
    telegram: boolean;
  };
  trading: {
    defaultLeverage: number;
    maxOpenPositions: number;
    riskPerTrade: number;
  };
  api: {
    exchange: string;
    apiKey: string;
    apiSecret: string;
  };
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
} 