"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.createLogger = exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logDir = 'logs';
const { combine, timestamp, printf, colorize } = winston_1.default.format;
const logFormat = printf((_a) => {
    var { level, message, timestamp } = _a, metadata = __rest(_a, ["level", "message", "timestamp"]);
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        new winston_1.default.transports.Console({
            format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
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
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printf((_a) => {
            var { level, message, timestamp } = _a, metadata = __rest(_a, ["level", "message", "timestamp"]);
            let msg = `${timestamp} [${level}] [${module}] : ${message}`;
            if (Object.keys(metadata).length > 0) {
                msg += ` ${JSON.stringify(metadata)}`;
            }
            return msg;
        })),
        transports: [
            new winston_1.default.transports.Console({
                format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printf((_a) => {
                    var { level, message, timestamp } = _a, metadata = __rest(_a, ["level", "message", "timestamp"]);
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