import dotenv from 'dotenv';

dotenv.config();

export default {
  // 交易所配置
  exchange: {
    apiKey: process.env.EXCHANGE_API_KEY,
    apiSecret: process.env.EXCHANGE_API_SECRET,
    testnet: process.env.EXCHANGE_TESTNET === 'true',
  },

  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'panda_quant',
  },

  // 策略引擎配置
  engine: {
    maxStrategies: parseInt(process.env.MAX_STRATEGIES || '10'),
    updateInterval: parseInt(process.env.UPDATE_INTERVAL || '60000'), // 1分钟
    maxDrawdown: parseFloat(process.env.MAX_DRAWDOWN || '0.1'), // 10%
    stopLoss: parseFloat(process.env.STOP_LOSS || '0.05'), // 5%
    takeProfit: parseFloat(process.env.TAKE_PROFIT || '0.1'), // 10%
  },

  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'strategy-engine.log',
  },
}; 