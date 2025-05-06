import { Response } from 'express';
import { AuthRequest } from '../types/auth';

export const getMarketData = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 这里应该是从数据库或外部 API 获取市场数据
    // 现在返回一些模拟数据
    const marketData = [
      {
        symbol: 'BTC/USDT',
        price: 50000,
        change24h: 2.5,
        volume24h: 1000000,
        marketCap: 1000000000
      },
      {
        symbol: 'ETH/USDT',
        price: 3000,
        change24h: 1.5,
        volume24h: 500000,
        marketCap: 500000000
      },
      {
        symbol: 'BNB/USDT',
        price: 400,
        change24h: 0.5,
        volume24h: 200000,
        marketCap: 200000000
      }
    ];

    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ message: 'Error fetching market data' });
  }
}; 