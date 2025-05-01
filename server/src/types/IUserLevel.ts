export interface IUserLevel {
  level: number;
  name: string;
  description?: string;
  requirements: {
    minDeposit?: number;
    minTrades?: number;
    minVolume?: number;
  };
  benefits: {
    commissionRate?: number;
    withdrawalLimit?: number;
    specialFeatures?: string[];
  };
} 