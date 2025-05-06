"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const rateLimiter_1 = require("./middleware/rateLimiter");
const cache_1 = require("./middleware/cache");
const Index_1 = __importDefault(require("./routes/Index"));
const logger_1 = require("./utils/logger");
const database_1 = require("./utils/database");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_2 = require("./middleware/logger");
const security_1 = require("./middleware/security");
const app = (0, express_1.default)();
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
                url: `http://localhost:${config_1.config.server.port}`,
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Connect to MongoDB
(0, database_1.connectDB)().catch(err => {
    logger_1.logger.error('Failed to connect to database:', err);
    process.exit(1);
});
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(cache_1.cacheMiddleware);
app.use(security_1.requestSizeLimit);
app.use(logger_2.requestLogger);
app.use(logger_2.responseTime);
app.use(security_1.securityMiddleware);
// API 文档
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// 健康检查
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// API 路由（应用速率限制）
app.use('/api', rateLimiter_1.rateLimiter);
// Routes
app.use(Index_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Start server
const port = config_1.config.server.port;
const server = app.listen(port, () => {
    logger_1.logger.info(`Server is running on port ${port} in ${config_1.config.env} mode`);
});
// 优雅关闭
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger_1.logger.info('Process terminated');
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map