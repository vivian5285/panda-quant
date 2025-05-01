"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = exports.createLogger = exports.logger = void 0;
const isDevelopment = process.env['NODE_ENV'] === 'development';
class Logger {
    constructor(prefix = '') {
        this.prefix = prefix ? `[${prefix}] ` : '';
    }
    info(message, ...args) {
        if (isDevelopment) {
            console.log(`${this.prefix}${message}`, ...args);
        }
    }
    warn(message, ...args) {
        console.warn(`${this.prefix}${message}`, ...args);
    }
    error(message, ...args) {
        console.error(`${this.prefix}${message}`, ...args);
    }
    debug(message, ...args) {
        if (isDevelopment) {
            console.debug(`${this.prefix}${message}`, ...args);
        }
    }
}
// 创建默认logger实例
exports.logger = new Logger();
// 创建带有特定前缀的logger实例
const createLogger = (prefix) => new Logger(prefix);
exports.createLogger = createLogger;
// 创建特定用途的logger实例
exports.requestLogger = (0, exports.createLogger)('request');
exports.errorLogger = (0, exports.createLogger)('error');
//# sourceMappingURL=logger.js.map