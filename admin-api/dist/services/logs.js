"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = exports.LogSource = exports.LogLevel = void 0;
const client_1 = require("@prisma/client");
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var LogSource;
(function (LogSource) {
    LogSource["API"] = "API";
    LogSource["STRATEGY"] = "STRATEGY";
    LogSource["SYSTEM"] = "SYSTEM";
})(LogSource || (exports.LogSource = LogSource = {}));
class LogService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async createLog(level, source, message, data) {
        return this.prisma.log.create({
            data: {
                level,
                source,
                message,
                data: data ? JSON.stringify(data) : null,
                timestamp: new Date()
            }
        });
    }
    async getLogs(level, source, startDate, endDate) {
        const where = {};
        if (level)
            where.level = level;
        if (source)
            where.source = source;
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate)
                where.timestamp.gte = startDate;
            if (endDate)
                where.timestamp.lte = endDate;
        }
        return this.prisma.log.findMany({
            where,
            orderBy: {
                timestamp: 'desc'
            }
        });
    }
    async getLogStats() {
        const stats = await this.prisma.log.groupBy({
            by: ['level', 'source'],
            _count: true
        });
        return stats;
    }
}
exports.LogService = LogService;
