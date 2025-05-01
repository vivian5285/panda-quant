"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = require("../utils/logger");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    logger_1.logger.info(`Request: ${req.method} ${req.url} from ${req.ip} with user agent ${req.headers['user-agent']}`);
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.logger.info(`Response: ${req.method} ${req.url} ${res.statusCode} in ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=requestLogger.js.map