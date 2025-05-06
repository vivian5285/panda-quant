import dotenv from 'dotenv';
import path from 'path';
// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../../.env') });
const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    logLevel: process.env.LOG_LEVEL || 'info',
    nodeEnv: process.env.NODE_ENV || 'development',
    server: {
        port: parseInt(process.env.PORT || '3000', 10)
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant'
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        password: process.env.REDIS_PASSWORD || ''
    },
    cache: {
        ttl: parseInt(process.env.CACHE_TTL || '3600', 10)
    }
};
// 验证必需的配置
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}
export { config };
//# sourceMappingURL=index.js.map