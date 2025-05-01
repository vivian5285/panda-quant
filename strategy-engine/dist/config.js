"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
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
        password: process.env.REDIS_PASSWORD || undefined,
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
