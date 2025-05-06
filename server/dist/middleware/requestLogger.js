import { logger } from '../utils/logger';
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    logger.info(`Request: ${req.method} ${req.url} from ${req.ip} with user agent ${req.headers['user-agent']}`);
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`Response: ${req.method} ${req.url} ${res.statusCode} in ${duration}ms`);
    });
    next();
};
//# sourceMappingURL=requestLogger.js.map