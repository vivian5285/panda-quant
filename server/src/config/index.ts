import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface Config {
  port: number;
  mongoUri: string;
  redis: {
    url: string;
    password?: string;
  };
  api: {
    userBaseUrl: string;
    adminBaseUrl: string;
    strategyEngineUrl: string;
  };
  server: {
    env: string;
    port: number;
  };
  mongodb: {
    uri: string;
    options: {
      useNewUrlParser: boolean;
      useUnifiedTopology: boolean;
      useCreateIndex: boolean;
      useFindAndModify: boolean;
    };
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  userApi: {
    url: string;
  };
  adminApi: {
    url: string;
  };
  strategyEngine: {
    url: string;
  };
  logging: {
    level: string;
    format: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  cache: {
    ttl: number;
    checkPeriod: number;
  };
  monitoring: {
    enabled: boolean;
    prometheus: {
      port: number;
    };
  };
}

export const config: Config = {
  port: parseInt(process.env['PORT'] || '3000', 10),
  mongoUri: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/panda-quant',
  redis: {
    url: process.env['REDIS_URL'] || 'redis://localhost:6379',
    password: process.env['REDIS_PASSWORD']
  },
  api: {
    userBaseUrl: process.env['USER_API_URL'] || 'http://localhost:3001',
    adminBaseUrl: process.env['ADMIN_API_URL'] || 'http://localhost:3002',
    strategyEngineUrl: process.env['STRATEGY_ENGINE_URL'] || 'http://localhost:3003'
  },
  server: {
    env: process.env['NODE_ENV'] || 'development',
    port: parseInt(process.env['PORT'] || '3000', 10)
  },
  mongodb: {
    uri: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/panda-quant',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  },
  jwt: {
    secret: process.env['JWT_SECRET'] || 'your-secret-key',
    expiresIn: process.env['JWT_EXPIRES_IN'] || '1d'
  },
  userApi: {
    url: process.env['USER_API_URL'] || 'http://localhost:3001'
  },
  adminApi: {
    url: process.env['ADMIN_API_URL'] || 'http://localhost:3002'
  },
  strategyEngine: {
    url: process.env['STRATEGY_ENGINE_URL'] || 'http://localhost:3003'
  },
  logging: {
    level: process.env['LOG_LEVEL'] || 'info',
    format: process.env['LOG_FORMAT'] || 'json'
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // 限制每个 IP 在 windowMs 内的最大请求数
  },
  cache: {
    ttl: 60 * 60, // 1 hour
    checkPeriod: 60 * 60 // 1 hour
  },
  monitoring: {
    enabled: process.env['MONITORING_ENABLED'] === 'true',
    prometheus: {
      port: parseInt(process.env['PROMETHEUS_PORT'] || '9090', 10)
    }
  }
}; 