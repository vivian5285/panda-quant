"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// 加载环境变量
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.config = {
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
//# sourceMappingURL=index.js.map