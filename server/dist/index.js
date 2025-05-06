"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const index_1 = __importDefault(require("./routes/index"));
const logger_1 = require("./utils/logger");
const config_1 = require("./config");
const app = (0, express_1.default)();
const PORT = config_1.config.port;
// 设置中间件
app.use(express_1.default.json());
// 设置路由
app.use(index_1.default);
// 启动服务器
const startServer = async () => {
    try {
        // 连接数据库
        await (0, database_1.connectMongoDB)();
        await (0, database_1.connectRedis)();
        // 启动服务器
        app.listen(PORT, () => {
            logger_1.logger.info(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map