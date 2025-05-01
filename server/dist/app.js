"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const rateLimiter_1 = require("./middleware/rateLimiter");
const cache_1 = require("./middleware/cache");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./utils/logger");
const AppError_1 = require("./utils/AppError");
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
mongoose_1.default.connect(config_1.config.mongodb.uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(cache_1.cacheMiddleware);
// API 文档
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// 健康检查
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
// API 路由（应用速率限制）
app.use('/api', rateLimiter_1.rateLimiter);
// Routes
app.use(routes_1.default);
// Error handling middleware
app.use((err, _req, res, _next) => {
    logger_1.logger.error('Error:', err);
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({ message: err.message });
    }
    else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Start server
const port = config_1.config.server.port;
app.listen(port, () => {
    logger_1.logger.info(`Server is running on port ${port}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map