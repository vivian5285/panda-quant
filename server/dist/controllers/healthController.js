"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = void 0;
const logger_1 = require("../utils/logger");
exports.healthController = {
    checkHealth(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
};
//# sourceMappingURL=healthController.js.map