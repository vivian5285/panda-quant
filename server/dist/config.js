"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const env = process.env;
exports.config = {
    server: {
        port: env.PORT || 3000,
        env: env.NODE_ENV || 'development'
    },
    mongodb: {
        uri: env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    },
    redis: {
        host: env.REDIS_HOST || 'localhost',
        port: parseInt(env.REDIS_PORT || '6379'),
        password: env.REDIS_PASSWORD,
        db: parseInt(env.REDIS_DB || '0'),
        url: env.REDIS_URL || 'redis://localhost:6379'
    },
    api: {
        userBaseUrl: env.USER_API_URL || 'http://localhost:3001',
        adminBaseUrl: env.ADMIN_API_URL || 'http://localhost:3002',
        strategyEngineUrl: env.STRATEGY_ENGINE_URL || 'http://localhost:3003'
    },
    jwt: {
        secret: env.JWT_SECRET || 'your-secret-key',
        expiresIn: env.JWT_EXPIRES_IN || '7d'
    },
    monitoring: {
        interval: parseInt(env.MONITORING_INTERVAL || '60000'),
        timeout: parseInt(env.MONITORING_TIMEOUT || '5000')
    },
    logging: {
        level: env.LOG_LEVEL || 'info',
        filename: env.LOG_FILE || 'logs/app.log'
    }
};
//# sourceMappingURL=config.js.map