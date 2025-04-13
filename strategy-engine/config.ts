import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },

  // API Configuration
  api: {
    port: parseInt(process.env.PORT || '4000'),
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  },

  // Strategy Configuration
  strategy: {
    maxConcurrentBacktests: parseInt(process.env.MAX_CONCURRENT_BACKTESTS || '5'),
    defaultRiskLevel: process.env.DEFAULT_RISK_LEVEL || 'medium',
  }
}; 