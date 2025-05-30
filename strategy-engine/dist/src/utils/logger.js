"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInfo = exports.logError = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json());
const errorTransport = new winston_daily_rotate_file_1.default({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
});
const infoTransport = new winston_daily_rotate_file_1.default({
    filename: 'logs/info-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
});
const consoleTransport = new winston_1.default.transports.Console({
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
});
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        errorTransport,
        infoTransport,
        consoleTransport,
    ],
});
const logError = (error, context) => {
    exports.logger.error({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
    });
};
exports.logError = logError;
const logInfo = (message, meta) => {
    exports.logger.info({
        message,
        meta,
        timestamp: new Date().toISOString(),
    });
};
exports.logInfo = logInfo;
