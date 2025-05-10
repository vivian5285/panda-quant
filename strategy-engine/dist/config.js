"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
    },
    api: {
        port: parseInt(process.env.API_PORT || '4000'),
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
    },
    server: {
        port: parseInt(process.env.PORT || '4000')
    },
    wsUrl: process.env.WS_URL || 'ws://localhost:4000',
    strategy: {
        defaultLeverage: 1,
        maxLeverage: 10,
        defaultStopLoss: 0.02,
        defaultTakeProfit: 0.05
    }
};
//# sourceMappingURL=config.js.map