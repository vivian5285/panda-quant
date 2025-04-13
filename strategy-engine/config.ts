import { StrategyPreset } from './types';

export const STRATEGY_PRESETS: StrategyPreset[] = [
  {
    name: 'SuperTrend',
    params: {
      period: 10,
      multiplier: 3,
      stopLoss: 0.02,
      takeProfit: 0.05
    }
  }
];

export const DATABASE_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'panda_quant',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
};

export const ENGINE_CONFIG = {
  updateInterval: 1000, // 策略执行间隔（毫秒）
  maxHistoryData: 1000, // 最大历史数据条数
  minTradeInterval: 60 * 1000 // 最小交易间隔（毫秒）
}; 