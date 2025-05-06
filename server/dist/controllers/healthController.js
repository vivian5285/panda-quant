"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = void 0;
const logger_1 = require("../utils/logger");
exports.healthController = {
    async checkHealth(_req, res) {
        try {
            // 这里可以添加更多的健康检查逻辑
            res.status(200).json({
                status: 'ok',
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            logger_1.logger.error('Health check failed:', error);
            res.status(500).json({
                status: 'error',
                message: 'Health check failed'
            });
        }
    }
};
//# sourceMappingURL=healthController.js.map