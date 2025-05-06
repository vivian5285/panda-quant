import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { rateLimiter } from './middleware/rateLimiter';
import { cacheMiddleware } from './middleware/cache';
import router from './routes/index';
import { logger } from './utils/logger';
import { connectDB } from './utils/database';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger, responseTime } from './middleware/logger';
import { securityMiddleware, requestSizeLimit } from './middleware/security';
const app = express();
// Swagger 配置
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Panda Quant API',
            version: '1.0.0',
            description: 'Panda Quant Trading Platform API Documentation',
        },
        servers: [
            {
                url: `http://localhost:${config.server.port}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'], // 指定 API 路由文件
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// Connect to MongoDB
connectDB().catch(err => {
    logger.error('Failed to connect to database:', err);
    process.exit(1);
});
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cacheMiddleware);
app.use(requestSizeLimit);
app.use(requestLogger);
app.use(responseTime);
app.use(securityMiddleware);
// API 文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// 健康检查
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// API 路由（应用速率限制）
app.use('/api', rateLimiter);
// Routes
app.use(router);
// Error handling middleware
app.use(errorHandler);
// Start server
const port = config.server.port;
const server = app.listen(port, () => {
    logger.info(`Server is running on port ${port} in ${config.env} mode`);
});
// 优雅关闭
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger.info('Process terminated');
    });
});
export default app;
//# sourceMappingURL=app.js.map