"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = exports.stream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logDir = 'logs';
const { combine, timestamp, printf, colorize } = winston_1.default.format;
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        }),
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'combined.log' })
    ]
});
exports.logger = logger;
// Create a stream object for Morgan
exports.stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};
const createLogger = (module) => {
    return winston_1.default.createLogger({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printf(({ level, message, timestamp, ...metadata }) => {
            let msg = `${timestamp} [${level}] [${module}] : ${message}`;
            if (Object.keys(metadata).length > 0) {
                msg += ` ${JSON.stringify(metadata)}`;
            }
            return msg;
        })),
        transports: [
            new winston_1.default.transports.Console({
                format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printf(({ level, message, timestamp, ...metadata }) => {
                    let msg = `${timestamp} [${level}] [${module}] : ${message}`;
                    if (Object.keys(metadata).length > 0) {
                        msg += ` ${JSON.stringify(metadata)}`;
                    }
                    return msg;
                }))
            }),
            new winston_1.default.transports.File({
                filename: path_1.default.join(logDir, 'error.log'),
                level: 'error'
            }),
            new winston_1.default.transports.File({
                filename: path_1.default.join(logDir, 'combined.log')
            })
        ]
    });
};
exports.createLogger = createLogger;
//# sourceMappingURL=logger.js.map